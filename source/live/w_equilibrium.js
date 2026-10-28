// A ⇌ B with real particles. Each A turns into B with probability kf·dt, each B back into A with kr·dt
// (kf = 2 and kr = 1 per second, the book's made-up model). The clock runs 4 times slower than real time
// so the flips can be watched. 6 particles stand for 1 unit, so 60 particles = the book's 10 units.
// params.perturb: adds an "Add 4 units of A" button (Figure 5.7).
import { Live } from './core.js';

Live.register('equilibrium', (stage, params, api) => {
  const c = api.colors();
  const perturb = !!params.perturb;
  const W = 640, H = 430;
  const k = api.canvas(W, H, perturb
    ? 'Particles of A and B flipping back and forth. Adding extra A makes more B form until B is again twice A.'
    : 'Particles of A turning into B and back. The amounts level off at B twice A while particles keep flipping both ways.');
  const ctx = k.ctx;
  const PER_UNIT = 6, SLOW = 0.25;           // 6 particles = 1 unit; 1 real second = 0.25 model seconds
  const R = 8.5;
  const box = { x: 20, y: 34, w: 600, h: 170 };
  const plot = { x: 58, y: 392, w: 560, h: 140 };
  const r = api.rng(11);
  let kf = 2, kr = 1, doubled = false;
  let t = 0, parts = [], hist = [], flipsF = 0, flipsR = 0, rateF = 0, rateR = 0, added = null;

  function makeParticle(kind) {
    return { kind, x: box.x + R + r() * (box.w - 2 * R), y: box.y + R + r() * (box.h - 2 * R),
      vx: (r() - 0.5) * 40, vy: (r() - 0.5) * 40, flash: 0 };
  }
  function reset() {
    parts = []; for (let i = 0; i < 10 * PER_UNIT; i++) parts.push(makeParticle('A'));
    t = 0; hist = [[0, 10, 0]]; added = null; flipsF = flipsR = 0; rateF = rateR = 0;
  }
  reset();
  const counts = () => { let a = 0; for (const p of parts) if (p.kind === 'A') a++; return [a, parts.length - a]; };

  api.button('Both constants doubled', (b) => {
    doubled = !doubled; kf = doubled ? 4 : 2; kr = doubled ? 2 : 1; b.setAttribute('aria-pressed', String(doubled));
  }, { pressed: false });
  if (perturb) api.button('Add 4 units of A', () => {
    if (parts.length > 120) return;
    for (let i = 0; i < 4 * PER_UNIT; i++) { const p = makeParticle('A'); p.flash = 0.6; parts.push(p); }
    added = t;
    const [a, b] = counts(); hist.push([t, a / PER_UNIT, b / PER_UNIT]);
  });
  api.button('Start again', () => reset());
  const say = api.readout();

  function step(dt) {
    const mdt = dt * SLOW; t += mdt;
    for (const p of parts) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < box.x + R || p.x > box.x + box.w - R) p.vx *= -1;
      if (p.y < box.y + R || p.y > box.y + box.h - R) p.vy *= -1;
      p.x = Math.min(Math.max(p.x, box.x + R), box.x + box.w - R);
      p.y = Math.min(Math.max(p.y, box.y + R), box.y + box.h - R);
      if (p.kind === 'A' && r() < kf * mdt) { p.kind = 'B'; p.flash = 0.45; flipsF++; }
      else if (p.kind === 'B' && r() < kr * mdt) { p.kind = 'A'; p.flash = 0.45; flipsR++; }
      if (p.flash) p.flash = Math.max(0, p.flash - dt);
    }
    // flips per model second, smoothed
    const a = Math.min(1, dt / 1.5);
    rateF += (flipsF / mdt / PER_UNIT - rateF) * a; rateR += (flipsR / mdt / PER_UNIT - rateR) * a;
    flipsF = flipsR = 0;
    const [na, nb] = counts();
    if (!hist.length || t - hist[hist.length - 1][0] > 0.02) hist.push([t, na / PER_UNIT, nb / PER_UNIT]);
  }

  function guideA(tt) { const s = kf + kr; return 10 * kr / s + (10 - 10 * kr / s) * Math.exp(-s * tt); }

  function render() {
    k.clear();
    // box
    ctx.fillStyle = c.sheet; ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.strokeRect(box.x, box.y, box.w, box.h);
    for (const p of parts) {
      const col = p.kind === 'A' ? c.proton : c.electron;
      if (p.flash) { ctx.beginPath(); ctx.arc(p.x, p.y, R + 9 * p.flash, 0, Math.PI * 2); ctx.fillStyle = c.mark_soft; ctx.fill(); }
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
      api.draw.text(ctx, p.kind, p.x, p.y + 0.5, { size: 10.5, color: '#fff', align: 'center', weight: 700, base: 'middle' });
    }
    const [na, nb] = counts();
    api.draw.text(ctx, `A: ${(na / PER_UNIT).toFixed(1)} units`, box.x, 24, { size: 13.5, color: c.proton, weight: 700 });
    api.draw.text(ctx, `B: ${(nb / PER_UNIT).toFixed(1)} units`, box.x + 150, 24, { size: 13.5, color: c.electron, weight: 700 });
    api.draw.text(ctx, `time ${t.toFixed(2)} s (slowed 4×)`, box.x + box.w, 24, { size: 12.5, color: c.muted, align: 'right' });

    // plot
    const tmax = Math.max(3, Math.ceil(t * 2) / 2 + 0.5);
    const total = parts.length / PER_UNIT;
    const vmax = total > 12 ? 16 : 10;
    const X = (tt) => plot.x + tt / tmax * plot.w, Y = (v) => plot.y - v / vmax * plot.h;
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(plot.x, plot.y - plot.h); ctx.lineTo(plot.x, plot.y); ctx.lineTo(plot.x + plot.w, plot.y); ctx.stroke();
    for (let v = 0; v <= vmax; v += vmax > 10 ? 4 : 2) {
      api.draw.text(ctx, String(v), plot.x - 7, Y(v) + 4, { size: 11, color: c.muted, align: 'right' });
    }
    api.draw.text(ctx, 'amount (units)', plot.x, plot.y - plot.h - 8, { size: 11.5, color: c.muted });
    api.draw.text(ctx, `model time (s), up to ${tmax.toFixed(1)}`, plot.x + plot.w, plot.y + 20, { size: 11.5, color: c.muted, align: 'right' });
    // guide curves (the book's calculation for the same constants, before any extra A)
    ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
    const tg = added == null ? tmax : added;
    for (const [col, fn] of [[c.proton, guideA], [c.electron, (tt) => 10 - guideA(tt)]]) {
      ctx.strokeStyle = col; ctx.globalAlpha = 0.5; ctx.beginPath();
      for (let i = 0; i <= 80; i++) { const tt = tg * i / 80; i ? ctx.lineTo(X(tt), Y(fn(tt))) : ctx.moveTo(X(tt), Y(fn(tt))); }
      ctx.stroke();
    }
    if (added != null) { // new settling levels after the extra A: total 14 -> A 4.67, B 9.33
      const aeq = total * kr / (kf + kr);
      for (const [col, v] of [[c.proton, aeq], [c.electron, total - aeq]]) {
        ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(X(added), Y(v)); ctx.lineTo(X(tmax), Y(v)); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.setLineDash([]);
      ctx.strokeStyle = c.muted; ctx.beginPath(); ctx.moveTo(X(added), plot.y); ctx.lineTo(X(added), plot.y - plot.h); ctx.stroke();
      api.draw.text(ctx, '+4 A', X(added) + 4, plot.y - plot.h + 10, { size: 11, color: c.muted });
    }
    ctx.globalAlpha = 1; ctx.setLineDash([]);
    // counted history
    for (const [idx, col] of [[1, c.proton], [2, c.electron]]) {
      ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath();
      hist.forEach((h, i) => (i ? ctx.lineTo(X(h[0]), Y(h[idx])) : ctx.moveTo(X(h[0]), Y(h[idx]))));
      ctx.stroke();
    }

    const settled = t > (added != null ? added + 1.2 : 1.5) / (doubled ? 2 : 1);
    api.draw.text(ctx, `turning A→B: ${rateF.toFixed(1)} units/s     B→A: ${rateR.toFixed(1)} units/s`, box.x + box.w, box.y + box.h + 18, { size: 12, color: c.ink, align: 'right', weight: 600 });
    say(settled
      ? `<b>The amounts have stopped changing, but the flips never stop.</b> The two rates (shown under the box) are now equal, so B stays about twice A. Solid lines are the counted particles; dashed lines are the book's calculation. With only ${parts.length} particles the count wobbles a little. The clock runs 4 times slower than the model's seconds.`
      : `At first far more A turns into B than back, because there is lots of A and little B. Watch the two rates under the box move towards each other.${doubled ? ' Both constants are doubled: the same end point, reached twice as fast.' : ''}`);
  }
  api.loop((dt) => { if (dt) step(dt); render(); });
  api.account(() => ({counts:counts(),kf,kr,doubled}));
  return {};
}, { label: 'Watch the particles flip' });
