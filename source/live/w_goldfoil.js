// The gold-foil experiment, magnified. Each alpha particle is pushed away by every nearby gold
// nucleus with the electric (Coulomb) force, which grows as 1/distance². Paths are integrated
// step by step: most alphas miss every nucleus by a wide margin and fly straight; the rare one
// that passes very close is turned sharply, or sent back.
import { Live } from './core.js';

Live.register('goldfoil', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 330;
  const k = api.canvas(W, H, 'Animation of alpha particles fired at a magnified gold foil. Most pass straight through; a few are deflected; a very few bounce back.');
  const ctx = k.ctx;
  const r = api.rng(41);
  const V = 210;               // alpha speed, px/s
  const D0 = 0.22;             // closest approach in a head-on hit, px (sets the force strength)
  const K = D0 * V * V / 2;    // acceleration = K / r^2
  const nuclei = [];
  const cols = [300, 336, 372, 408], rowStep = 36;
  cols.forEach((x, i) => { for (let y = 26 + (i % 2) * rowStep / 2; y < 300; y += rowStep) nuclei.push([x, y]); });
  const alphas = [];
  const traces = [];           // remembered paths of deflected alphas
  const n = { straight: 0, turned: 0, back: 0 };
  let spawn = 0;

  const say = api.readout();
  api.button('Reset the counts', () => { n.straight = n.turned = n.back = 0; traces.length = 0; });

  function newAlpha() { const y = 18 + r() * 284; return { x: 14, y, vx: V, vy: 0, y0: y, trail: [[14, y]] }; }

  function advance(a, dt) {
    let left = dt, guard = 0;
    while (left > 0 && guard++ < 4000) {
      let ax = 0, ay = 0, rmin = 1e9;
      for (const [nx, ny] of nuclei) {
        const dx = a.x - nx, dy = a.y - ny; const d2 = dx * dx + dy * dy;
        if (d2 > 2500) continue;
        const d = Math.sqrt(d2); rmin = Math.min(rmin, d);
        const f = K / d2; ax += f * dx / d; ay += f * dy / d;
      }
      // small steps near a nucleus, big steps far away
      const h = Math.min(left, Math.max(2e-6, Math.min(rmin, 50) / V / 25));
      a.vx += ax * h; a.vy += ay * h; a.x += a.vx * h; a.y += a.vy * h;
      left -= h;
    }
    const s = Math.hypot(a.vx, a.vy) || 1; a.vx *= V / s; a.vy *= V / s; // keep the speed exact (energy is conserved far from nuclei)
  }

  function step(dt) {
    for (const t of traces) t.age += dt;
    spawn += dt;
    while (spawn > 0.11) { spawn -= 0.11; alphas.push(newAlpha()); }
    for (let i = alphas.length - 1; i >= 0; i--) {
      const a = alphas[i];
      advance(a, dt);
      const last = a.trail[a.trail.length - 1];
      if (Math.hypot(a.x - last[0], a.y - last[1]) > 3) a.trail.push([a.x, a.y]);
      if (a.x < 0 || a.x > W || a.y < 0 || a.y > H) {
        const ang = Math.abs(Math.atan2(a.vy, a.vx)) * 180 / Math.PI;
        if (ang > 90) n.back++; else if (ang > 20) n.turned++; else n.straight++;
        if (ang > 20) { traces.push({ pts: a.trail, back: ang > 90, age: 0 }); if (traces.length > 5) traces.shift(); }
        alphas.splice(i, 1);
      }
    }
  }

  function render() {
    k.clear();
    ctx.fillStyle = c.plate; ctx.fillRect(0, 0, W, H);
    // foil band and atoms (electron regions faint, nuclei as dots drawn far too big)
    ctx.fillStyle = c.vol; ctx.globalAlpha = 0.06; ctx.fillRect(280, 0, 148, H); ctx.globalAlpha = 1;
    for (const [x, y] of nuclei) {
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.setLineDash([2, 3]); ctx.strokeStyle = c.electron; ctx.globalAlpha = 0.45; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fillStyle = c.ink; ctx.fill();
    }
    // remembered deflections
    for (const t of traces) {
      ctx.strokeStyle = t.back ? c.proton : c.neutron; ctx.lineWidth = 1.4; ctx.globalAlpha = Math.max(0.12, 0.8 - t.age * 0.05); ctx.beginPath();
      t.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.globalAlpha = 1;
    }
    for (const a of alphas) {
      ctx.strokeStyle = c.proton; ctx.globalAlpha = 0.18; ctx.lineWidth = 1.2; ctx.beginPath();
      a.trail.slice(-25).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineTo(a.x, a.y); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(a.x, a.y, 3.2, 0, Math.PI * 2); ctx.fillStyle = c.proton; ctx.fill();
    }
    ctx.fillStyle = c.plate; ctx.globalAlpha = 0.92; ctx.fillRect(8, 8, 140, 22); ctx.globalAlpha = 1;
    api.draw.text(ctx, 'alpha particles (2+)', 14, 14, { size: 12, color: c.proton, weight: 600, base: 'top' });
    api.draw.text(ctx, 'gold foil, magnified', 354, H - 8, { size: 12, color: c.vol, weight: 600, align: 'center' });
    // counters
    const total = n.straight + n.turned + n.back;
    ctx.fillStyle = c.plate; ctx.globalAlpha = 0.92; ctx.fillRect(452, 12, 182, 72); ctx.globalAlpha = 1;
    const rows = [['straight through', n.straight, c.ink], ['turned more than 20°', n.turned, c.neutron], ['bounced back', n.back, c.proton]];
    rows.forEach(([lab, v, col], i) => {
      api.draw.text(ctx, lab, 462, 30 + i * 22, { size: 12.5, color: col, weight: 600 });
      api.draw.text(ctx, String(v), 626, 30 + i * 22, { size: 12.5, color: col, weight: 600, align: 'right' });
    });
    say(`${total} alpha particles so far. The nuclei are drawn thousands of times too big: at this magnification a real gold nucleus would be far smaller than a pixel. Only an alpha that happens to pass extremely close is turned sharply. To show those rare events in a minute rather than hours, this model makes them far more common than in Geiger and Marsden's foil, where about one in several thousand turned through a large angle.`);
  }
  api.loop((dt) => { if (dt) step(dt); render(); });
  api.account(() => ({n:{...n}}));
  return {};
}, { label: 'Fire alpha particles' });
