// Gas in a box: particles fly in straight lines and bounce off the walls.
// mode 'temperature': slider for kelvin temperature at fixed volume (Figure 3.2).
// mode 'volume': slider moves a piston at fixed temperature (Figure 3.4).
// The pressure readout is counted from the particles' computed pushes on the piston,
// calibrated so that 1 mol at 300 K in 10 L reads 249 kPa, and compared with P = nRT/V.
import { Live } from './core.js';

Live.register('gasbox', (stage, params, api) => {
  const c = api.colors();
  const mode = params.mode || 'temperature';
  const W = 640, H = 300;
  const k = api.canvas(W, H, mode === 'temperature'
    ? 'Animated gas particles in a sealed box. A slider changes the temperature; hotter particles move faster and push harder on the walls.'
    : 'Animated gas particles in a cylinder with a piston. A slider moves the piston; in a smaller space the particles hit it more often.');
  const ctx = k.ctx;
  const N = 60, R = 4;
  const r = api.rng(7);
  const box = { x: 40, y: 40, h: 190 };
  const pxPerL = 26;               // 10 L -> 260 px wide
  let T = mode === 'temperature' ? 200 : 300;
  let V = 10;
  const sigma0 = 70;               // px/s, spread of one velocity component at 300 K
  const parts = [];
  for (let i = 0; i < N; i++) {
    parts.push({ x: box.x + 10 + r() * (V * pxPerL - 20), y: box.y + 10 + r() * (box.h - 20),
      gx: api.gauss(r), gy: api.gauss(r), trail: [] });
  }
  const sig = () => sigma0 * Math.sqrt(T / 300);
  // expected push per second on the piston: N * sigma^2 / width  (1-D kinetic theory)
  const calib = 249.4 / (N * sigma0 * sigma0 / (10 * pxPerL));
  let push = 0, smooth = null, hits = 0, hitRate = 0;

  const say = api.readout();
  if (mode === 'temperature') {
    api.slider('Temperature', { min: 100, max: 600, step: 10, value: T, fmt: (v) => `${v} K`, onInput: (v) => { T = v; smooth = null; } });
  } else {
    api.slider('Volume', { min: 5, max: 20, step: 0.5, value: V, fmt: (v) => `${v} L`, onInput: (v) => { V = v; smooth = null; } });
  }

  function step(dt) {
    const s = sig(), right = box.x + V * pxPerL;
    for (const p of parts) {
      p.x += p.gx * s * dt; p.y += p.gy * s * dt;
      if (p.x < box.x + R) { p.x = 2 * (box.x + R) - p.x; p.gx = Math.abs(p.gx); }
      if (p.x > right - R) {
        p.x = Math.min(2 * (right - R) - p.x, right - R); push += 2 * Math.abs(p.gx * s); hits++; p.gx = -Math.abs(p.gx);
        p.flash = 0.18;
      }
      if (p.y < box.y + R) { p.y = 2 * (box.y + R) - p.y; p.gy = Math.abs(p.gy); }
      if (p.y > box.y + box.h - R) { p.y = 2 * (box.y + box.h - R) - p.y; p.gy = -Math.abs(p.gy); }
      p.trail.push([p.x, p.y]); if (p.trail.length > 6) p.trail.shift();
      if (p.flash) p.flash = Math.max(0, p.flash - dt);
    }
    // pressure from pushes over the last moments (exponential average)
    if (dt > 0) {
      const inst = push / dt; push = 0;
      const a = Math.min(1, dt / 3);
      smooth = smooth == null ? N * s * s / (V * pxPerL) : smooth + (inst - smooth) * a;
      hitRate = hitRate + (hits / dt - hitRate) * Math.min(1, dt / 1.2); hits = 0;
    }
  }

  function render() {
    k.clear();
    const right = box.x + V * pxPerL;
    // container
    ctx.fillStyle = c.plate; ctx.fillRect(box.x, box.y, right - box.x, box.h);
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(right, box.y); ctx.lineTo(box.x, box.y); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(right, box.y + box.h); ctx.stroke();
    // piston (or fixed wall)
    ctx.fillStyle = mode === 'volume' ? c.neutron : c.ink;
    ctx.fillRect(right, box.y - 8, 9, box.h + 16);
    if (mode === 'volume') { ctx.fillRect(right + 9, box.y + box.h / 2 - 4, W - right - 30, 8); }
    // particles with short trails
    for (const p of parts) {
      ctx.strokeStyle = c.electron; ctx.globalAlpha = 0.25; ctx.lineWidth = 2;
      ctx.beginPath(); p.trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fillStyle = c.electron; ctx.fill();
      if (p.flash) { ctx.beginPath(); ctx.arc(p.x, p.y, R + 5 * p.flash / 0.18, 0, Math.PI * 2); ctx.strokeStyle = c.proton; ctx.lineWidth = 1.5; ctx.stroke(); }
    }
    // labels
    const P = 8.314462618 * T / V;                       // kPa for 1 mol, V in L
    const counted = smooth == null ? null : smooth * calib;
    api.draw.text(ctx, '1 mole of gas', box.x, 28, { size: 13, color: c.muted });
    api.draw.text(ctx, `${T} K, ${V} L`, right, 28, { size: 13, color: c.ink, align: 'right', weight: 600 });
    // pressure gauge: counted (bar) vs rule (tick)
    const gx = 40, gy = 262, gw = 560, max = 900;
    ctx.fillStyle = c.rule_2; ctx.fillRect(gx, gy, gw, 12);
    if (counted != null) { ctx.fillStyle = c.proton; ctx.fillRect(gx, gy, Math.min(gw, gw * counted / max), 12); }
    const tx = gx + Math.min(gw, gw * P / max);
    ctx.fillStyle = c.ink; ctx.fillRect(tx - 1.5, gy - 5, 3, 22);
    api.draw.text(ctx, counted == null ? 'Collision sampling: no interval yet' : `computed wall pushes: ${Math.round(counted)} kPa`, gx, gy + 32, { size: 12.5, color: c.proton, weight: 600 });
    api.draw.text(ctx, `rule P = nRT/V: ${P.toFixed(0)} kPa`, gx + gw, gy + 32, { size: 12.5, color: c.ink, align: 'right' });
    const sampling = counted == null ? ' No collision-sampling interval has run yet. The gas still has pressure; use the calculated mark or sample a model interval.' : '';
    say((mode === 'volume'
      ? `${V} L at 300 K. The red bar samples computed wall pushes; the black mark is the rule P = nRT/V (${P.toFixed(0)} kPa). Only ${N} display markers are used; their gauge is calibrated to the ideal-gas rule, not a measured real-gas pressure.`
      : `${T} K in 10 L. Hotter molecules move faster, so each hit is harder and hits come more often. The red bar samples computed wall pushes; the black mark is the rule P = nRT/V (${P.toFixed(0)} kPa). Only ${N} display markers are used; their gauge is calibrated to the ideal-gas rule, not a measured real-gas pressure.`) + sampling);
  }
  api.button('Sample 1 model second', () => { for (let i = 0; i < 60; i++) step(1 / 60); render(); });
  api.loop((dt) => { if (dt) step(dt); render(); });
  api.account(() => ({T,V}));
  return {};
}, { label: 'Watch the molecules' });
