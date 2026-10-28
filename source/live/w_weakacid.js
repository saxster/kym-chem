// A weak acid is busy: molecules keep handing a proton to water and taking one back.
// At any moment only a few are split. Real 1 mol/L acetic acid: about 1 molecule in 240.
// Here about 1 in 18 (exaggerated so you can see any at all), and the flips are slowed down.
import { Live } from './core.js';

Live.register('weakacid', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 300;
  const k = api.canvas(W, H, 'Animation of a weak acid: molecules occasionally split into a hydronium ion and an acetate ion, then join up again, so only a few are split at any moment.');
  const ctx = k.ctx;
  const r = api.rng(21), N = 48, R = 11;
  const box = { x: 30, y: 30, w: 580, h: 210 };
  const SPLIT = 0.03, JOIN = 0.5;    // per second: split fraction at balance = SPLIT/(SPLIT+JOIN) ≈ 1 in 18
  const parts = [];
  for (let i = 0; i < N; i++) parts.push({ x: box.x + R + r() * (box.w - 2 * R), y: box.y + R + r() * (box.h - 2 * R), vx: (r() - .5) * 30, vy: (r() - .5) * 30, split: i % 16 === 3 ? 1 : 0, sep: 1, flash: 0 });
  const say = api.readout();
  let events = 0, t = 0;

  function step(dt) {
    t += dt;
    for (const p of parts) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < box.x + R + 16 || p.x > box.x + box.w - R - 16) p.vx *= -1;
      if (p.y < box.y + R || p.y > box.y + box.h - R) p.vy *= -1;
      p.x = Math.min(Math.max(p.x, box.x + R + 16), box.x + box.w - R - 16); p.y = Math.min(Math.max(p.y, box.y + R), box.y + box.h - R);
      if (!p.split && r() < SPLIT * dt) { p.split = 1; p.sep = 0; p.flash = 0.6; events++; }
      else if (p.split && r() < JOIN * dt) { p.split = 0; p.flash = 0.6; events++; }
      if (p.split) p.sep = Math.min(1, p.sep + dt * 2);
      if (p.flash) p.flash = Math.max(0, p.flash - dt);
    }
  }
  function tok(x, y, lab, col) {
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    api.draw.text(ctx, lab, x, y + 0.5, { size: lab.length > 2 ? 8 : 9.5, color: '#fff', align: 'center', weight: 700, base: 'middle' });
  }
  function render() {
    k.clear();
    ctx.fillStyle = 'rgba(53,109,131,.10)'; ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(box.x, box.y - 10); ctx.lineTo(box.x, box.y + box.h); ctx.lineTo(box.x + box.w, box.y + box.h); ctx.lineTo(box.x + box.w, box.y - 10); ctx.stroke();
    let ns = 0;
    for (const p of parts) {
      if (p.flash) { ctx.beginPath(); ctx.arc(p.x, p.y, R + 12 * p.flash, 0, Math.PI * 2); ctx.fillStyle = c.mark_soft; ctx.fill(); }
      if (p.split) { ns++; const d = 14 * p.sep; tok(p.x - d, p.y, 'A⁻', c.green); tok(p.x + d, p.y, 'H₃O⁺', c.proton); }
      else tok(p.x, p.y, 'HA', c.neutron);
    }
    api.draw.text(ctx, `whole acid molecules (HA): ${N - ns}`, box.x, 270, { size: 13, color: c.neutron, weight: 700 });
    api.draw.text(ctx, `split into H₃O⁺ + A⁻: ${ns}`, box.x + box.w, 270, { size: 13, color: c.proton, weight: 700, align: 'right' });
    api.draw.text(ctx, `changes so far: ${events}`, box.x + box.w, 290, { size: 12, color: c.muted, align: 'right' });
    say(`Watch any one for long enough and it will split and join up again: the acid is constantly busy, but the number split at any moment stays small. In real 1 mol/L acetic acid it is about 1 in 240; this picture exaggerates that to about 1 in 18 so there is something to see, and slows everything down.`);
  }
  api.loop((dt) => { if (dt) step(dt); render(); });
  return {};
}, { label: 'Watch the acid at work' });
