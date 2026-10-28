// Dilution: eight dissolved particles wander through the solution. Adding water raises the level;
// the same eight particles spread through the bigger volume, so each litre holds fewer.
import { Live } from './core.js';

Live.register('dilution', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 300;
  const k = api.canvas(W, H, 'Animation of a beaker of solution with eight dissolved particles. Adding a litre of water spreads the same particles through twice the volume.');
  const ctx = k.ctx;
  const r = api.rng(3);
  const B = { x: 210, w: 220, bot: 262 };
  const perL = 92;                 // px of height per litre
  let litres = 1, level = 1, pour = 0;
  const N = 8;
  let P = [];
  function seed() {
    P = [];
    for (let i = 0; i < N; i++) P.push({ x: B.x + 20 + r() * (B.w - 40), y: B.bot - 14 - r() * (perL - 28), vx: 0, vy: 0 });
  }
  seed();
  const say = api.readout();
  const add = api.button('Add a litre of water', () => { if (litres < 2) { litres = 2; pour = 1.6; add.disabled = true; } });
  api.button('Reset', () => { litres = 1; level = 1; pour = 0; add.disabled = false; seed(); });

  function step(dt) {
    level += Math.sign(litres - level) * Math.min(Math.abs(litres - level), dt * 0.65);
    if (pour) pour = Math.max(0, pour - dt);
    const top = B.bot - level * perL;
    for (const p of P) {
      // random wandering (like Brownian motion), plus a little stirring from the pour
      p.vx += api.gauss(r) * 260 * dt; p.vy += api.gauss(r) * 260 * dt;
      if (pour) p.vy -= 60 * dt;
      p.vx *= Math.exp(-1.2 * dt); p.vy *= Math.exp(-1.2 * dt);
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < B.x + 10) { p.x = B.x + 10; p.vx = Math.abs(p.vx); }
      if (p.x > B.x + B.w - 10) { p.x = B.x + B.w - 10; p.vx = -Math.abs(p.vx); }
      if (p.y < top + 10) { p.y = top + 10; p.vy = Math.abs(p.vy); }
      if (p.y > B.bot - 10) { p.y = B.bot - 10; p.vy = -Math.abs(p.vy); }
    }
  }

  function render() {
    k.clear();
    const top = B.bot - level * perL;
    // water
    ctx.fillStyle = c.electron; ctx.globalAlpha = 0.13; ctx.fillRect(B.x, top, B.w, B.bot - top); ctx.globalAlpha = 1;
    ctx.strokeStyle = c.electron; ctx.globalAlpha = 0.5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B.x, top); ctx.lineTo(B.x + B.w, top); ctx.stroke(); ctx.globalAlpha = 1;
    if (pour) { ctx.fillStyle = c.electron; ctx.globalAlpha = 0.3; ctx.fillRect(B.x + B.w * 0.62, 6, 10, top - 6); ctx.globalAlpha = 1; }
    // beaker
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(B.x, 28); ctx.lineTo(B.x, B.bot); ctx.lineTo(B.x + B.w, B.bot); ctx.lineTo(B.x + B.w, 28); ctx.stroke();
    // litre marks
    for (const L of [1, 2]) {
      const y = B.bot - L * perL;
      ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B.x + B.w, y); ctx.lineTo(B.x + B.w + 12, y); ctx.stroke();
      api.draw.text(ctx, `${L} L`, B.x + B.w + 16, y + 4, { size: 12, color: c.muted });
    }
    for (const p of P) { ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fillStyle = c.proton; ctx.fill(); }
    const L = Math.round(level * 10) / 10;
    // two counters side by side: one changes, one never does
    api.draw.text(ctx, 'in each litre', 40, 104, { size: 12, color: c.muted });
    api.draw.text(ctx, `${(N / level).toFixed(1)} particles`, 40, 126, { size: 17, color: c.proton, weight: 600 });
    api.draw.text(ctx, '(this is what you taste)', 40, 146, { size: 11, color: c.muted });
    api.draw.text(ctx, 'in the whole beaker', 40, 186, { size: 12, color: c.muted });
    api.draw.text(ctx, `${N} particles`, 40, 208, { size: 17, color: c.ink, weight: 600 });
    api.draw.text(ctx, `(never changes) · ${L.toFixed(1)} L`, 40, 228, { size: 11, color: c.muted });
    say(litres === 1
      ? 'One litre of solution with 8 dissolved particles: 8 particles per litre. Each drawn particle stands for an enormous number of real ones. Press <b>Add a litre of water</b>.'
      : 'Two litres now. Nothing was taken away: the same 8 particles wander through twice the space, so each litre (and each sip) holds 4. The concentration has halved; the amount of solute has not changed.');
  }
  api.loop((dt) => { if (dt) step(dt); else if(api.reduced || !api._isPlaying?.()) { level = litres; pour = 0; } render(); });
  api.account(() => ({N,litres}));
  return {};
}, { label: 'Add water and watch' });
