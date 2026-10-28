// The salt energy staircase (Section 2.5, and the "want" box in Section 1.6), per mole, gas-phase atoms to
// solid salt: +496 kJ (remove sodium's electron), −349 kJ (chlorine captures it), −787 kJ (the ions pack into
// a lattice). Net −640 kJ. A ball climbs and falls along the steps, one at a time.
import { Live } from './core.js';

const LEVELS = [
  { v: 0, lab: 'Na + Cl atoms (gas)' },
  { v: 496, lab: 'Na⁺ + e⁻ + Cl' },
  { v: 147, lab: 'Na⁺ + Cl⁻, far apart' },
  { v: -640, lab: 'solid salt, NaCl' },
];
const STEPS = [
  { d: +496, lab: '+496 kJ', say: '<b>Step 1: take the electron off sodium.</b> This <i>costs</i> 496 kJ for every mole of atoms. The sodium nucleus holds on to its outer electron, and pulling it away takes energy. So sodium does not "want" to lose its electron: left to itself, it keeps it.' },
  { d: -349, lab: '−349 kJ', say: '<b>Step 2: chlorine catches the electron.</b> That gives back 349 kJ. But 496 − 349 = 147: the pair of separate ions is still <b>147 kJ uphill</b> of where it started. If the story stopped here, salt would never form.' },
  { d: -787, lab: '−787 kJ', say: '<b>Step 3: the ions pack into a crystal.</b> Every Na⁺ is surrounded by six Cl⁻ and every Cl⁻ by six Na⁺. All those attractions release 787 kJ, far more than everything paid so far.' },
];

Live.register('saltsteps', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 360;
  const k = api.canvas(W, H, 'An energy staircase for making solid salt from sodium and chlorine atoms: up 496 kJ, down 349 kJ, then down 787 kJ, ending 640 kJ below the start.');
  const ctx = k.ctx;
  const Y = (v) => 140 - v * 0.24;
  const XS = [[24, 150], [174, 300], [324, 450], [474, 616]];
  let step = 0, f = 1, playing = false;       // step = how many steps done; f = progress of the current move
  const say = api.readout();
  api.button('Next step', () => { if (step < 3) { step++; f = 0; } else { step = 0; f = 1; } });
  api.button('Play all', () => { step = 1; f = 0; playing = true; });
  api.button('Start again', () => { step = 0; f = 1; playing = false; });

  function ballPos() {
    if (step === 0) return [XS[0][0] + 40, Y(0)];
    const a = LEVELS[step - 1], b = LEVELS[step];
    const xa = XS[step - 1][1] - 10, xb = XS[step][0] + 30;
    const t = Math.min(1, f), s = (1 - Math.cos(t * Math.PI)) / 2;
    // climb: rise then move across; fall: move across then drop
    const up = b.v > a.v;
    const x = xa + (xb - xa) * (up ? Math.max(0, (s - 0.5) * 2) : Math.min(1, s * 2));
    const yv = a.v + (b.v - a.v) * (up ? Math.min(1, s * 2) : Math.max(0, (s - 0.5) * 2));
    return [x, Y(yv)];
  }

  api.loop((dt) => {
    if (dt > 0 && f < 1) { f = Math.min(1, f + dt / 1.6); }
    if (playing && f >= 1) { if (step < 3) { step++; f = 0; } else playing = false; }
    if (dt === 0) f = 1;           // paused or reduced motion: show each step finished
    k.clear(c.sheet || c.paper);
    // zero line
    ctx.strokeStyle = c.rule; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(16, Y(0)); ctx.lineTo(624, Y(0)); ctx.stroke(); ctx.setLineDash([]);
    api.draw.text(ctx, 'start', 620, Y(0) - 5, { size: 13, color: c.muted, align: 'right' });
    LEVELS.forEach((L, i) => {
      const [xa, xb] = XS[i];
      const reached = i <= step;
      ctx.strokeStyle = i === 3 ? c.green : c.ink; ctx.globalAlpha = reached ? 1 : 0.25; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(xa, Y(L.v)); ctx.lineTo(xb, Y(L.v)); ctx.stroke();
      api.draw.text(ctx, L.lab, xa, Y(L.v) + 19, { size: 14, color: c.ink, weight: i === 3 ? 600 : 400 });
      ctx.globalAlpha = 1;
    });
    STEPS.forEach((S, i) => {
      if (i >= step) return;
      const a = LEVELS[i].v, b = LEVELS[i + 1].v, x = XS[i][1] + 12;
      api.draw.arrow(ctx, x, Y(a), x, Y(b), S.d > 0 ? c.proton : c.green, 2.2);
      api.draw.text(ctx, S.lab, x + 8, (Y(a) + Y(b)) / 2 + 4, { size: 15, color: S.d > 0 ? c.proton : c.green, weight: 600 });
    });
    if (step === 3 && f >= 1) {
      ctx.strokeStyle = c.green; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(600, Y(0)); ctx.lineTo(600, Y(-640)); ctx.stroke(); ctx.setLineDash([]);
      api.draw.text(ctx, 'overall −640 kJ', 594, Y(-450), { size: 15, color: c.green, weight: 600, align: 'right' });
    }
    const [bx, by] = ballPos();
    ctx.fillStyle = c.vol || c.electron; ctx.beginPath(); ctx.arc(bx, by - 8, 7, 0, 7); ctx.fill();
    const tail = ' <span class="muted">(Energies per mole, starting from atoms of sodium and chlorine as a gas.)</span>';
    if (step === 0) say('Start with separate atoms of sodium and chlorine. Press <b>Next step</b> to follow the energy, one step at a time.' + tail);
    else if (step < 3 || f < 1) say(STEPS[step - 1].say + tail);
    else say(STEPS[2].say + ' Overall: +496 − 349 − 787 = <b>−640 kJ</b>. So sodium doesn\'t "want" to lose its electron: that step costs energy. The whole path runs downhill only because the crystal forms.' + tail);
  });
  return {};
}, { label: 'Follow the energy' });
