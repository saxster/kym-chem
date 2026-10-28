// 2 H2 + O2 -> 2 H2O, as bookkeeping: molecules meet, their bonds break, the same six atoms
// regroup into two water molecules. The atom tally is drawn on every frame and never changes.
import { Live } from './core.js';

const ease = (u) => (u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u));
const lerp = (a, b, u) => a + (b - a) * u;

Live.register('rearrange', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 300;
  const k = api.canvas(W, H, 'Animation: two hydrogen molecules and one oxygen molecule break apart and their atoms regroup into two water molecules. The count of atoms stays the same throughout.');
  const ctx = k.ctx;
  const HA = 52.25 * Math.PI / 180, OH = 26;
  // atoms: H1..H4, Oa, Ob ; start (reactants far apart), meet (molecules near the centre), end (products)
  const start = { H1: [70, 72], H2: [96, 72], H3: [70, 182], H4: [96, 182], Oa: [540, 112], Ob: [574, 112] };
  const meet = { H1: [270, 100], H2: [296, 100], H3: [270, 170], H4: [296, 170], Oa: [330, 135], Ob: [362, 135] };
  const loose = { H1: [246, 88], H2: [312, 82], H3: [244, 186], H4: [318, 192], Oa: [292, 140], Ob: [392, 132] };
  const w1 = [230, 128], w2 = [420, 128];
  const prod = {
    Oa: w1, H1: [w1[0] - OH * Math.sin(HA), w1[1] + OH * Math.cos(HA)], H3: [w1[0] + OH * Math.sin(HA), w1[1] + OH * Math.cos(HA)],
    Ob: w2, H2: [w2[0] - OH * Math.sin(HA), w2[1] + OH * Math.cos(HA)], H4: [w2[0] + OH * Math.sin(HA), w2[1] + OH * Math.cos(HA)],
  };
  const end = {};
  for (const kk in prod) end[kk] = [prod[kk][0] + (kk === 'Oa' || kk === 'H1' || kk === 'H3' ? -90 : 90), prod[kk][1]];
  const oldBonds = [['H1', 'H2', 1], ['H3', 'H4', 1], ['Oa', 'Ob', 2]];
  const newBonds = [['Oa', 'H1', 1], ['Oa', 'H3', 1], ['Ob', 'H2', 1], ['Ob', 'H4', 1]];
  const CYCLE = 10;
  let T = 0;
  const say = api.readout();
  api.button('Replay', () => { T = 0; });

  function posAt(t) {
    const p = {};
    for (const a in start) {
      let x, y;
      if (t < 2.4) { const u = ease(t / 2.4); x = lerp(start[a][0], meet[a][0], u); y = lerp(start[a][1], meet[a][1], u); }
      else if (t < 3.6) { const u = ease((t - 2.4) / 1.2); x = lerp(meet[a][0], loose[a][0], u); y = lerp(meet[a][1], loose[a][1], u); }
      else if (t < 5.4) { const u = ease((t - 3.6) / 1.8); x = lerp(loose[a][0], prod[a][0], u); y = lerp(loose[a][1], prod[a][1], u); }
      else { const u = ease((t - 5.4) / 2.2); x = lerp(prod[a][0], end[a][0], u); y = lerp(prod[a][1], end[a][1], u); }
      p[a] = [x, y];
    }
    return p;
  }

  function render() {
    k.clear();
    const t = T % CYCLE;
    const p = posAt(t);
    const oldA = t < 2.6 ? 1 : 1 - ease((t - 2.6) / 0.6);
    const newA = t < 4.4 ? 0 : ease((t - 4.4) / 0.8);
    ctx.save(); ctx.globalAlpha = oldA;
    for (const [a, b, o] of oldBonds) api.draw.bond(ctx, ...p[a], ...p[b], o, c, 3);
    ctx.globalAlpha = newA;
    for (const [a, b, o] of newBonds) api.draw.bond(ctx, ...p[a], ...p[b], o, c, 3);
    ctx.restore();
    for (const a of ['Oa', 'Ob']) api.draw.atom(ctx, ...p[a], 15, 'O');
    for (const a of ['H1', 'H2', 'H3', 'H4']) api.draw.atom(ctx, ...p[a], 10, 'H');
    // stage caption
    const phase = t < 2.4 ? 'Molecules move and meet: 2 H₂ and 1 O₂' : t < 3.6 ? 'Old bonds break (this takes energy)'
      : t < 5.4 ? 'The same atoms regroup' : 'New bonds have formed: 2 H₂O (more energy is given out than was taken in)';
    api.draw.text(ctx, phase, 320, 28, { size: 13.5, color: c.ink, weight: 600, align: 'center' });
    // tally (always the same)
    const ty = 258;
    ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(30, ty - 22); ctx.lineTo(610, ty - 22); ctx.stroke();
    api.draw.text(ctx, 'atom count right now:', 30, ty, { size: 12.5, color: c.muted });
    for (let i = 0; i < 4; i++) api.draw.atom(ctx, 190 + i * 22, ty - 4, 8, 'H');
    api.draw.text(ctx, '4 hydrogen', 280, ty, { size: 12.5, color: c.ink, weight: 600 });
    for (let i = 0; i < 2; i++) api.draw.atom(ctx, 380 + i * 24, ty - 4, 9.5, 'O');
    api.draw.text(ctx, '2 oxygen', 420, ty, { size: 12.5, color: c.ink, weight: 600 });
    const mols = t < 2.9 ? '3 molecules' : t < 4.9 ? 'regrouping' : '2 molecules';
    api.draw.text(ctx, mols, 610, ty, { size: 12.5, color: c.vol, weight: 600, align: 'right' });
    api.draw.text(ctx, 'the number of atoms never changes; the number of molecules does', 320, ty + 26, { size: 12, color: c.muted, align: 'center' });
    say('Every atom that goes in comes out: 4 hydrogen and 2 oxygen at every moment. Only the partners change. This shows the bookkeeping, not the real path: the real reaction runs through several quick steps involving fragments of molecules, and a mixture of hydrogen and oxygen needs a spark to get it started.');
  }
  api.loop((dt) => { T += dt * 0.9; render(); });
  return {};
}, { label: 'Watch the atoms regroup' });
