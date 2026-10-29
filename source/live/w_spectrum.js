// Why flames have colours: an atom's energy ladder, an electron that jumps up and falls back,
// and the photon whose colour is set by the size of the drop. Real energy levels:
//   hydrogen  E_n = −13.6 eV / n²   (Balmer lines to n = 2: 656.3, 486.1, 434.0, 410.2 nm)
//   sodium    3s 0, 3p 2.104, 4s 3.191, 3d 3.617 eV  (3p → 3s gives the 589 nm yellow)
// Wavelength from the gap: λ (nm) = 1239.84 / ΔE (eV).
import { Live } from './core.js';

const HC = 1239.84;
function wlColor(nm) {
  let r, g, b;
  if (nm < 440) { r = -(nm - 440) / 60; g = 0; b = 1; }
  else if (nm < 490) { r = 0; g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { r = 0; g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; b = 0; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; b = 0; }
  else { r = 1; g = 0; b = 0; }
  // fade towards the edges of vision
  const f = nm < 420 ? 0.35 + 0.65 * (nm - 380) / 40 : nm > 700 ? 0.35 + 0.65 * (780 - nm) / 80 : 1;
  const c = (v) => Math.round(255 * Math.max(0, Math.min(1, v * f)));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
const visible = (nm) => nm >= 380 && nm <= 750;
const band = (nm) => (nm < 380 ? 'ultraviolet' : nm > 750 ? 'infrared' : 'visible');

const ATOMS = {
  hydrogen: {
    name: 'Hydrogen',
    levels: [1, 2, 3, 4, 5, 6].map((n) => ({ key: n, label: `n = ${n}`, E: -13.6 / (n * n) })),
    ground: 1,
    // choose how high the flame or spark lifts the electron, and the path back down
    excite(r) {
      const top = 3 + Math.floor(r() * 4); // 3..6
      const path = [top];
      if (top > 3 && r() < 0.3) path.push(3 + Math.floor(r() * (top - 3))); // sometimes stop on the way (infrared)
      path.push(2, 1);
      return path;
    },
    Emin: -13.6, Emax: 0,
    note: 'Hydrogen glows with four visible colours: red, blue-green, blue and violet. Each comes from an electron falling to the second level. Falls to the bottom level give ultraviolet light, which our eyes cannot see.',
  },
  sodium: {
    name: 'Sodium',
    levels: [
      { key: '3s', label: '3s (lowest)', E: 0 }, { key: '3p', label: '3p', E: 2.104 },
      { key: '4s', label: '4s', E: 3.191 }, { key: '3d', label: '3d', E: 3.617 },
    ],
    ground: '3s',
    excite(r) {
      const x = r();
      if (x < 0.7) return ['3p', '3s'];
      return [x < 0.85 ? '4s' : '3d', '3p', '3s'];
    },
    Emin: 0, Emax: 5.14,
    note: 'Sodium has one strong visible colour: the yellow at 589 nm, from a fall from 3p to 3s. Electrons lifted higher drop to 3p first, giving infrared light we cannot see, and then make the same yellow jump. That is why salt in a flame, and old street lamps, glow yellow.',
  },
};

Live.register('spectrum', (stage, params, api) => {
  const W = 640, H = 380;
  const k = api.canvas(W, H, 'An atom’s energy levels drawn as a ladder. An electron jumps up, falls back, and gives out light whose colour depends on the size of the fall; each colour lands as a line on a spectrum strip.');
  const ctx = k.ctx;
  const say = api.readout();
  const r = api.rng(7);
  const L = { x0: 90, x1: 250, y0: 336, y1: 66 };       // ladder box
  const S = { x0: 300, x1: 596, y: 286, h: 40 };       // spectrum strip 380–750 nm
  const nmX = (nm) => S.x0 + (nm - 380) / (750 - 380) * (S.x1 - S.x0);

  let mode = params.atom === 'sodium' ? 'sodium' : params.atom === 'rainbow' ? 'rainbow' : 'hydrogen';
  let atom = ATOMS[mode] || ATOMS.hydrogen;
  let level = atom.ground;            // where the electron is
  let queue = [];                     // remaining levels to visit
  let wait = 0;                       // pause before the next fall
  let photons = [];                   // flying photons {nm, x, y, tx, ty, t}
  let lines = new Map();              // nm -> brightness (0..1)
  let marks = { ultraviolet: 0, infrared: 0 };
  let elecY = 0;                      // animated electron height
  let last = '';

  const yOf = (E) => L.y0 - (E - atom.Emin) / (atom.Emax - atom.Emin) * (L.y0 - L.y1);
  const lev = (key) => atom.levels.find((l) => l.key === key);
  elecY = yOf(lev(level).E);

  function reset() {
    atom = ATOMS[mode] || ATOMS.hydrogen; level = atom.ground; queue = []; photons = []; lines = new Map();
    marks = { ultraviolet: 0, infrared: 0 }; wait = 0; elecY = atom ? yOf(lev(level).E) : 0;
  }
  const tabs = api.tabs(['Hydrogen', 'Sodium (flame yellow)', 'A rainbow'], (i) => {
    mode = ['hydrogen', 'sodium', 'rainbow'][i]; reset();
    giveBtn.disabled = mode === 'rainbow';
    tell(); for (const fn of api._loops) fn(0, 0);
  }, mode === 'sodium' ? 1 : mode === 'rainbow' ? 2 : 0);
  const giveBtn = api.button('Give it energy', () => {
    if (mode === 'rainbow') return;
    if (queue.length || level !== atom.ground) return;
    const path = atom.excite(r);
    level = path[0]; queue = path.slice(1); wait = api.reduced ? 0 : 0.7;
    if (api.reduced) runAll();
    tell(`The electron was lifted to <b>${lev(level).label}</b>. Watch it fall back.`);
  });
  api.button('Clear the strip', () => { lines = new Map(); marks = { ultraviolet: 0, infrared: 0 }; tell(); });
  giveBtn.disabled = mode === 'rainbow';

  function emit(fromKey, toKey) {
    const dE = lev(fromKey).E - lev(toKey).E;
    const nm = HC / dE;
    const x = L.x1 + 6, y = (yOf(lev(fromKey).E) + yOf(lev(toKey).E)) / 2;
    const tx = visible(nm) ? nmX(nm) : nm < 380 ? S.x0 - 12 : S.x1 + 12;
    photons.push({ nm, x, y, sx: x, sy: y, tx, ty: S.y + S.h / 2, t: 0 });
    if (api.reduced) land(photons.pop());
    return nm;
  }
  function land(p) {
    if (visible(p.nm)) { const key = Math.round(p.nm * 10) / 10; lines.set(key, Math.min(1, (lines.get(key) || 0) + 0.34)); }
    else marks[band(p.nm)] += 1;
    tell(lineSentence(p.nm));
  }
  function lineSentence(nm) {
    const b = band(nm);
    if (b === 'visible') return `That fall gave light of <b>${Math.round(nm)} nm</b>: ${colourName(nm)}. A bigger fall would give bluer light; a smaller fall, redder.`;
    return `That fall gave <b>${b}</b> light (${Math.round(nm)} nm). It is real light, but invisible to our eyes, so it lands off the coloured strip.`;
  }
  function colourName(nm) {
    return nm < 450 ? 'violet' : nm < 495 ? 'blue' : nm < 570 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : 'red';
  }
  function runAll() { // reduced motion: do the whole cascade at once
    while (queue.length) { const nx = queue.shift(); emit(level, nx); level = nx; }
    elecY = yOf(lev(level).E);
  }
  function tell(msg) {
    if (mode === 'rainbow') { say('A hot solid, such as a bulb filament, gives a broad continuous spectrum. The Sun also has a broad spectrum, but its visible surface is a layer of gas and plasma, with absorption lines superimposed. A dilute excited atomic gas gives bright lines at <b>certain</b> colours, because each atom has only certain gaps between its levels. That difference is how Bunsen and Kirchhoff could tell elements apart by their light.'); return; }
    say(msg || `${atom.note} Press <b>Give it energy</b>. (Simplified: real atoms choose their routes down with fixed odds.)`);
  }
  tell();

  api.loop((dt) => {
    // physics of the cascade
    if (mode !== 'rainbow' && dt > 0) {
      if (queue.length) {
        wait -= dt;
        const targetY = yOf(lev(level).E);
        elecY += (targetY - elecY) * Math.min(1, dt * 10);
        if (wait <= 0 && Math.abs(targetY - elecY) < 1.5) {
          const nx = queue.shift(); emit(level, nx); level = nx; wait = 0.75;
        }
      } else {
        const targetY = yOf(lev(level).E);
        elecY += (targetY - elecY) * Math.min(1, dt * 10);
      }
      for (const p of photons) p.t += dt / 1.2;
      for (const p of photons.filter((q) => q.t >= 1)) land(p);
      photons = photons.filter((q) => q.t < 1);
    }
    draw();
  });

  function draw() {
    const c = api.colors();
    k.clear();
    ctx.fillStyle = c.plate; api.draw.roundRect(ctx, 8, 8, W - 16, H - 16, 10); ctx.fill();
    // ---- spectrum strip
    api.draw.text(ctx, mode === 'rainbow' ? 'Light from a hot filament' : 'What reaches your eye', S.x0, S.y - 12, { size: 15, color: c.muted });
    ctx.fillStyle = '#0d0f12'; ctx.fillRect(S.x0, S.y, S.x1 - S.x0, S.h);
    if (mode === 'rainbow') {
      for (let x = S.x0; x < S.x1; x++) { const nm = 380 + (x - S.x0) / (S.x1 - S.x0) * 370; ctx.fillStyle = wlColor(nm); ctx.fillRect(x, S.y, 1.2, S.h); }
    } else {
      for (const [nm, a] of lines) {
        ctx.globalAlpha = 0.25 + 0.75 * a; ctx.fillStyle = wlColor(nm);
        ctx.fillRect(nmX(nm) - 2, S.y, 4, S.h);
        ctx.globalAlpha = 0.22 * a; ctx.fillRect(nmX(nm) - 7, S.y, 14, S.h);
        ctx.globalAlpha = 1;
      }
      for (const [b, n] of Object.entries(marks)) {
        if (!n) continue;
        const x = b === 'ultraviolet' ? S.x0 - 16 : S.x1 + 18;
        api.draw.text(ctx, b === 'ultraviolet' ? 'UV' : 'IR', x, S.y + 16, { size: 12, color: c.muted, align: 'center', weight: 600 });
        api.draw.text(ctx, `×${n}`, x, S.y + 32, { size: 12, color: c.muted, align: 'center' });
      }
    }
    for (const nm of [400, 500, 600, 700]) {
      ctx.fillStyle = c.muted; ctx.fillRect(nmX(nm), S.y + S.h, 1, 5);
      api.draw.text(ctx, `${nm}`, nmX(nm), S.y + S.h + 18, { size: 13, color: c.muted, align: 'center' });
    }
    api.draw.text(ctx, 'nm', S.x1, S.y + S.h + 18, { size: 13, color: c.muted, align: 'right' });
    api.draw.text(ctx, '← ultraviolet (invisible)', S.x0, S.y + S.h + 40, { size: 12, color: c.muted });
    api.draw.text(ctx, 'infrared (invisible) →', S.x1, S.y + S.h + 40, { size: 12, color: c.muted, align: 'right' });

    if (mode === 'rainbow') {
      // a glowing filament on the left
      api.draw.text(ctx, 'A hot solid: every colour', (L.x0 + L.x1) / 2, 70, { size: 14, color: c.ink, align: 'center', weight: 600 });
      ctx.strokeStyle = '#f2b544'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i <= 60; i++) { const x = L.x0 + 20 + i * 2.3, y = 170 + Math.sin(i * 0.9) * 22; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.globalAlpha = 0.18; ctx.fillStyle = '#f2b544'; ctx.beginPath(); ctx.arc((L.x0 + L.x1) / 2, 170, 70, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      api.draw.arrow(ctx, L.x1, 170, S.x0 - 10, S.y - 26, c.muted, 1.4);
      return;
    }
    // ---- energy ladder
    api.draw.text(ctx, `${atom.name}: energy levels`, 24, 32, { size: 16, color: c.ink, weight: 600 });
    api.draw.text(ctx, 'higher = more energy', 24, 52, { size: 13, color: c.muted });
    let lastLab = 1e9;
    for (const l of [...atom.levels].sort((a, b) => a.E - b.E)) {
      const y = yOf(l.E);
      ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L.x0, y); ctx.lineTo(L.x1, y); ctx.stroke();
      if (lastLab - y >= 15) { api.draw.text(ctx, l.label, L.x0 - 8, y + 4, { size: 13, color: c.muted, align: 'right' }); lastLab = y; }
    }
    if (atom === ATOMS.hydrogen) api.draw.text(ctx, '← 4, 5, 6… crowd together', L.x1 + 6, yOf(-13.6 / 25) + 4, { size: 12, color: c.muted });
    if (atom === ATOMS.hydrogen) {
      const y = yOf(0); ctx.setLineDash([4, 4]); ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(L.x0, y); ctx.lineTo(L.x1, y); ctx.stroke(); ctx.setLineDash([]);
      api.draw.text(ctx, 'free', L.x0 - 8, y + 4, { size: 12, color: c.muted, align: 'right' });
    }
    // electron
    api.draw.particle(ctx, (L.x0 + L.x1) / 2, elecY - 8, 7, 'e', c);
    // photons in flight: a short wiggle in the light's colour (grey dashes if invisible)
    for (const p of photons) {
      const e = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
      const x = p.sx + (p.tx - p.sx) * e, y = p.sy + (p.ty - p.sy) * e;
      const ang = Math.atan2(p.ty - p.sy, p.tx - p.sx);
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      ctx.strokeStyle = visible(p.nm) ? wlColor(p.nm) : c.muted; ctx.lineWidth = 2.4;
      if (!visible(p.nm)) ctx.setLineDash([3, 3]);
      ctx.beginPath();
      const wl = Math.max(4, Math.min(14, p.nm / 50));
      for (let i = -24; i <= 0; i++) { const yy = Math.sin(i / wl * 2 * Math.PI) * 5; i === -24 ? ctx.moveTo(i, yy) : ctx.lineTo(i, yy); }
      ctx.stroke(); ctx.restore();
    }
  }
  return {};
}, { label: 'Make the atom glow' });
