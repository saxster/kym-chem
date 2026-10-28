// Why a bond forms (Section 2.3): two hydrogen atoms and the energy of the pair against the distance between
// their nuclei. A Morse curve with the measured depth (436 kJ/mol) and bond length (74 pm); the exact shape
// between those points is a model, as the readout says. Drag the slider, or let the atoms come together
// (the energy they lose leaves as heat) or pull them apart (436 kJ/mol must be paid).
import { Live } from './core.js';

const DE = 436, RE = 74, A = 0.0194;           // kJ/mol, pm, 1/pm (same curve as Figure c2_bond_energy)
const V = (r) => DE * (1 - Math.exp(-A * (r - RE))) ** 2 - DE;

Live.register('bondwell', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 412;
  const k = api.canvas(W, H, 'Two hydrogen atoms above an energy graph. As the atoms move closer the energy dips to a lowest point at 74 picometres, 436 kJ per mole below separate atoms, then rises steeply when the nuclei get too close.');
  const ctx = k.ctx;
  const gx0 = 70, gx1 = 610, gy0 = 175, gy1 = 385;
  const RMIN = 30, RMAX = 300, EMIN = -480, EMAX = 360;
  const X = (r) => gx0 + (r - RMIN) / (RMAX - RMIN) * (gx1 - gx0);
  const Y = (e) => gy0 + (EMAX - e) / (EMAX - EMIN) * (gy1 - gy0);
  let r = 220, vel = 0, anim = null, paid = 0;
  const sl = api.slider('Distance between the nuclei', { min: RMIN, max: RMAX, step: 1, value: r, fmt: (v) => `${Math.round(v)} pm`, onInput: (v) => { anim = null; r = v; paid = 0; } });
  api.button('Let them come together', () => { anim = 'fall'; r = Math.max(r, 200); vel = 0; paid = 0; sl.set(r); });
  api.button('Pull them apart', () => { anim = 'pull'; paid = 0; });
  const say = api.readout();

  function atoms() {
    const cy = 92, cx = W / 2, pxPerPm = 1.05;
    const d = Math.min(r, 290) * pxPerPm;
    const x1 = cx - d / 2, x2 = cx + d / 2;
    // electron clouds: a soft blob round each nucleus; near the bond length, a shared bridge of density between them
    const overlap = Math.max(0, 1 - Math.abs(r - RE) / 70) * (r < 200 ? 1 : 0);
    ctx.save();
    for (const x of [x1, x2]) {
      const g = ctx.createRadialGradient(x, cy, 2, x, cy, 52);
      g.addColorStop(0, hexA(c.electron, 0.5)); g.addColorStop(1, hexA(c.electron, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, 52, 0, 7); ctx.fill();
    }
    if (overlap > 0) {
      const g = ctx.createRadialGradient((x1 + x2) / 2, cy, 2, (x1 + x2) / 2, cy, 40);
      g.addColorStop(0, hexA(c.electron, 0.55 * overlap)); g.addColorStop(1, hexA(c.electron, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse((x1 + x2) / 2, cy, 44, 30, 0, 0, 7); ctx.fill();
    }
    ctx.restore();
    for (const x of [x1, x2]) api.draw.particle(ctx, x, cy, 9, 'p', c);
    api.draw.text(ctx, 'H', x1, cy - 58, { size: 17, color: c.ink, align: 'center', weight: 600 });
    api.draw.text(ctx, 'H', x2, cy - 58, { size: 17, color: c.ink, align: 'center', weight: 600 });
    // forces: too close, the nuclei repel
    if (r < 55) { api.draw.arrow(ctx, x1 - 12, cy, x1 - 48, cy, c.proton, 2.2); api.draw.arrow(ctx, x2 + 12, cy, x2 + 48, cy, c.proton, 2.2); }
    else if (r < 190 && r > RE + 8) { api.draw.arrow(ctx, x1 + 14, cy + 34, x1 + 40, cy + 34, c.green, 2); api.draw.arrow(ctx, x2 - 14, cy + 34, x2 - 40, cy + 34, c.green, 2); }
    // distance bar
    ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1, cy + 52); ctx.lineTo(x2, cy + 52); ctx.stroke();
    api.draw.text(ctx, `${Math.round(r)} pm`, (x1 + x2) / 2, cy + 68, { size: 14, color: c.muted, align: 'center' });
  }

  function graph() {
    // axes
    ctx.strokeStyle = c.rule; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();
    ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(gx0, Y(0)); ctx.lineTo(gx1, Y(0)); ctx.stroke(); ctx.setLineDash([]);
    api.draw.text(ctx, 'separate atoms', gx1, Y(0) - 6, { size: 13, color: c.muted, align: 'right' });
    api.draw.text(ctx, 'energy', gx0 - 8, gy0 + 6, { size: 13, color: c.muted, align: 'right' });
    api.draw.text(ctx, 'distance between nuclei →', gx1, gy1 + 15, { size: 13, color: c.muted, align: 'right' });
    // curve
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let rr = RMIN; rr <= RMAX; rr += 1) { const e = Math.min(V(rr), EMAX); const px = X(rr), py = Y(e); rr === RMIN ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
    ctx.stroke();
    // the well
    ctx.strokeStyle = c.green; ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(X(RE), Y(0)); ctx.lineTo(X(RE), Y(-DE)); ctx.stroke(); ctx.setLineDash([]);
    api.draw.text(ctx, '436 kJ/mol', X(RE) + 8, Y(-DE / 2), { size: 14, color: c.green, weight: 600 });
    api.draw.text(ctx, '74 pm', X(RE), gy1 + 16, { size: 13.5, color: c.green, align: 'center' });
    // the pair, as a ball on the curve
    const e = Math.min(V(r), EMAX);
    ctx.fillStyle = c.vol || c.electron; ctx.beginPath(); ctx.arc(X(r), Y(e), 7, 0, 7); ctx.fill();
    if (paid > 1) api.draw.text(ctx, `energy supplied so far: ${Math.round(paid)} kJ/mol`, gx0 + 10, gy0 + 14, { size: 14, color: c.proton, weight: 600 });
  }

  function words() {
    const e = V(r);
    let s;
    if (r < 60) s = '<b>Too close.</b> The two nuclei are both positive, and squeezed this close they repel strongly: the energy shoots up.';
    else if (Math.abs(r - RE) <= 8) s = `<b>The bottom of the well: this is the bond.</b> At 74 pm the pair is 436 kJ/mol lower in energy than two separate atoms. Each electron is now pulled by <i>both</i> nuclei, and the shared cloud between them holds them together.`;
    else if (r < 190) s = `The atoms attract: the electron clouds overlap and each nucleus pulls on both electrons. Energy here: about ${Math.round(e)} kJ/mol (lower is more stable).`;
    else s = '<b>Too far apart.</b> The atoms hardly notice each other, so the energy is the same as two separate atoms: zero on this graph.';
    if (anim === 'fall') s += ' They roll down into the well and rock back and forth. To <i>stay</i> bonded, the pair must get rid of the extra energy, as heat passed to other molecules (or as light). Without that, they would fly apart again.';
    if (anim === 'pull' || paid > 400) s += ' Pulling them apart means climbing out of the well: <b>436 kJ for every mole of bonds</b> must be supplied. Breaking a bond always costs energy; making one always gives it out.';
    return s + ' <span class="muted">(The two marked numbers are measured; the curve between them is a standard model shape.)</span>';
  }

  api.loop((dt) => {
    if (anim === 'fall' && dt > 0) {
      // damped motion in the well, slowed right down; damping stands for energy handed on as heat
      const F = -(V(r + 0.5) - V(r - 0.5));
      vel += F * dt * 200; vel *= Math.pow(0.4, dt); r += vel * dt;
      if (r < RMIN + 2) { r = RMIN + 2; vel = Math.abs(vel); }
      if (Math.abs(vel) < 2 && Math.abs(r - RE) < 3) { r = RE; anim = null; }
      sl.set(Math.round(r));
    } else if (anim === 'pull' && dt > 0) {
      const before = V(r);
      r = Math.min(RMAX, r + 60 * dt);
      paid += Math.max(0, V(r) - before);
      if (r >= RMAX) anim = null;
      sl.set(Math.round(r));
    }
    k.clear(c.sheet || c.paper);
    atoms(); graph();
    say(words());
  });
  api.account(() => ({r,energy:V(r)}));
  return {};
}, { label: 'Move the atoms' });

function hexA(col, a) {
  // accepts #rgb/#rrggbb or rgb(...) and returns rgba with alpha a
  if (!col) return `rgba(80,110,160,${a})`;
  col = col.trim();
  if (col[0] === '#') {
    let h = col.slice(1); if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    const n = parseInt(h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  }
  const m = col.match(/[\d.]+/g); return m ? `rgba(${m[0]},${m[1]},${m[2]},${a})` : col;
}
