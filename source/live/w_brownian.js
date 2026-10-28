// Brownian motion: one big grain jostled by many small, fast water molecules.
// Real physics in miniature: every molecule-grain collision is elastic and conserves momentum,
// so the heavy grain ends up drifting slowly and randomly, as Perrin saw.
import { Live } from './core.js';

Live.register('brownian', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 300;
  const k = api.canvas(W, H, 'Animation of a grain floating in water, wandering in a zig-zag path. A button reveals the water molecules hitting it.');
  const ctx = k.ctx;
  const r = api.rng(23);
  const box = { x: 20, y: 20, w: 600, h: 250 };
  const G = { x: 320, y: 145, vx: 0, vy: 0, R: 18, M: 22 };   // grain; molecule mass = 1
  const NM = 300, sig = 150;                                 // molecules and their speed spread (px/s per component)
  // start the grain with its fair share of thermal energy (equipartition)
  G.vx = api.gauss(r) * sig / Math.sqrt(G.M); G.vy = api.gauss(r) * sig / Math.sqrt(G.M);
  const mol = [];
  for (let i = 0; i < NM; i++) {
    let x, y;
    do { x = box.x + r() * box.w; y = box.y + r() * box.h; } while (Math.hypot(x - G.x, y - G.y) < G.R + 4);
    mol.push({ x, y, vx: api.gauss(r) * sig, vy: api.gauss(r) * sig, hit: 0 });
  }
  let show = false;
  const path = [[G.x, G.y]];
  let sinceMark = 0;
  const MARK = 0.5;      // seconds between recorded positions

  const say = api.readout();
  const tog = api.button('Show the water molecules', (b) => { show = !show; b.setAttribute('aria-pressed', String(show)); }, { pressed: false });
  api.button('Clear the path', () => { path.length = 0; path.push([G.x, G.y]); sinceMark = 0; });

  function step(dt) {
    // grain moves
    G.x += G.vx * dt; G.y += G.vy * dt;
    if (G.x < box.x + G.R) { G.x = box.x + G.R; G.vx = Math.abs(G.vx); }
    if (G.x > box.x + box.w - G.R) { G.x = box.x + box.w - G.R; G.vx = -Math.abs(G.vx); }
    if (G.y < box.y + G.R) { G.y = box.y + G.R; G.vy = Math.abs(G.vy); }
    if (G.y > box.y + box.h - G.R) { G.y = box.y + box.h - G.R; G.vy = -Math.abs(G.vy); }
    for (const m of mol) {
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.x < box.x) { m.x = 2 * box.x - m.x; m.vx = Math.abs(m.vx); }
      if (m.x > box.x + box.w) { m.x = 2 * (box.x + box.w) - m.x; m.vx = -Math.abs(m.vx); }
      if (m.y < box.y) { m.y = 2 * box.y - m.y; m.vy = Math.abs(m.vy); }
      if (m.y > box.y + box.h) { m.y = 2 * (box.y + box.h) - m.y; m.vy = -Math.abs(m.vy); }
      const dx = m.x - G.x, dy = m.y - G.y, d = Math.hypot(dx, dy);
      if (d < G.R && d > 0) {
        const nx = dx / d, ny = dy / d;
        const vrel = (m.vx - G.vx) * nx + (m.vy - G.vy) * ny;
        if (vrel < 0) {
          // elastic collision, molecule mass 1, grain mass M: momentum and energy both conserved
          const J = 2 * G.M / (1 + G.M) * vrel;
          m.vx -= J * nx; m.vy -= J * ny;
          G.vx += J / G.M * nx; G.vy += J / G.M * ny;
          m.hit = 0.25;
        }
        m.x = G.x + nx * (G.R + 0.5); m.y = G.y + ny * (G.R + 0.5);
      }
      if (m.hit) m.hit = Math.max(0, m.hit - dt);
    }
    sinceMark += dt;
    if (sinceMark >= MARK) { sinceMark = 0; path.push([G.x, G.y]); if (path.length > 80) path.shift(); }
  }

  function render() {
    k.clear();
    ctx.fillStyle = c.plate; ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.strokeRect(box.x, box.y, box.w, box.h);
    if (show) {
      for (const m of mol) {
        ctx.beginPath(); ctx.arc(m.x, m.y, m.hit ? 3 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = m.hit ? c.proton : c.electron; ctx.globalAlpha = m.hit ? 1 : 0.55; ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // recorded path, Perrin-style: dots joined by straight lines
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.3; ctx.beginPath();
    path.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.lineTo(G.x, G.y); ctx.stroke();
    ctx.fillStyle = c.ink;
    for (const [x, y] of path) { ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    // grain
    ctx.beginPath(); ctx.arc(G.x, G.y, G.R, 0, Math.PI * 2); ctx.fillStyle = c.vol; ctx.globalAlpha = 0.88; ctx.fill(); ctx.globalAlpha = 1;
    api.draw.text(ctx, 'grain', G.x, G.y + 4, { size: 11, color: c.sheet, align: 'center', weight: 600 });
    api.draw.text(ctx, show ? 'the hidden cause: molecules (drawn far too big and far too few)' : 'what the microscope shows: one grain, wandering', box.x, H - 10, { size: 12.5, color: c.muted });
    say(show
      ? 'Each blue dot is a water molecule; red ones have just hit the grain. At every instant a few more hit one side than the other, so the grain is shoved this way and that. Real molecules are far smaller and far more numerous: a real grain is struck far more than a trillion times every second.'
      : 'This is what Perrin saw: the grain never stops wandering, with no cause you can see. Its position is marked every half second here (Perrin marked his every 30 seconds). Now press <b>Show the water molecules</b>.');
  }
  api.loop((dt) => { if (dt) step(dt); render(); });
  void tog;
  return {};
}, { label: 'Watch the grain wander' });
