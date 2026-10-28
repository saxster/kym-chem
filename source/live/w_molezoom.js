// How many is a mole? Zoom from a spoonful of water (18 g, one mole) down through powers of ten
// until single water molecules appear. Everything is drawn at true scale for the current view.
// Numbers: water molecules are about 0.31 nm apart in the liquid (18 mL ÷ 6.022 × 10²³, cube-rooted);
// 18 mL as a cube is 2.62 cm on a side, with about 84 million molecules along each edge.
import { Live } from './core.js';

const NA = 6.02214076e23;
const D = 0.31e-9;             // spacing between water molecules in the liquid (m)
const W0 = 0.06, W1 = 2.4e-9;  // view widths at zoom 0 and 100 (m)
// landmarks from the book's scale ladder (Chapter 0), drawn for size
const MARKS = [
  { name: 'a raindrop', size: 2e-3, kind: 'drop' },
  { name: 'a grain of salt', size: 0.3e-3, kind: 'salt' },
  { name: 'a hair, end-on', size: 0.08e-3, kind: 'hair' },
  { name: 'a red blood cell', size: 7e-6, kind: 'cell' },
  { name: 'a bacterium', size: 1e-6, kind: 'bug' },
  { name: 'a virus', size: 100e-9, kind: 'virus' },
  { name: 'the width of DNA', size: 2e-9, kind: 'dna' },
];

function hash(i, j, s = 0) { let h = (i * 374761393 + j * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function words(n) {
  if (n < 1000) return String(Math.round(n));
  const units = [[1e12, 'million million'], [1e9, 'thousand million'], [1e6, 'million'], [1e3, 'thousand']];
  for (const [v, w] of units) if (n >= v) { const x = n / v; return `${x < 10 ? x.toFixed(1).replace(/\.0$/, '') : Math.round(x)} ${w}`; }
  return String(n);
}
function niceLen(m) { // a round scale-bar length near m
  const p = Math.pow(10, Math.floor(Math.log10(m))); const f = m / p;
  return (f >= 5 ? 5 : f >= 2 ? 2 : 1) * p;
}
function fmtLen(m) {
  if (m >= 1e-2) return `${+(m * 100).toPrecision(2)} cm`;
  if (m >= 1e-3) return `${+(m * 1e3).toPrecision(2)} mm`;
  if (m >= 1e-6) return `${+(m * 1e6).toPrecision(2)} µm`;
  return `${+(m * 1e9).toPrecision(2)} nm`;
}

Live.register('molezoom', (stage, params, api) => {
  const W = 640, H = 380;
  const k = api.canvas(W, H, 'A spoonful of water seen at true scale, zooming in by powers of ten past a raindrop, a grain of salt, a hair, a blood cell, a bacterium and a virus, until single water molecules appear.');
  const ctx = k.ctx;
  const say = api.readout();
  let z = 0;                      // 0..100
  let auto = false;
  const widthAt = (v) => Math.exp(Math.log(W0) + (Math.log(W1) - Math.log(W0)) * v / 100);
  const width = () => widthAt(z);
  const sl = api.slider('Zoom', { min: 0, max: 100, step: 0.5, value: 0, fmt: (v) => fmtLen(widthAt(v)) + ' across', onInput: (v) => { z = v; auto = false; draw(); tell(); } });
  const zoomBtn = api.button('Zoom in ×10', () => { setZ(z + 100 * Math.log(10) / Math.log(W0 / W1)); });
  api.button('Out ×10', () => { setZ(z - 100 * Math.log(10) / Math.log(W0 / W1)); });
  api.button('Fly all the way in', () => { if (api.reduced) setZ(100); else { if (z >= 99.5) z = 0; auto = true; } });
  function setZ(v) { z = Math.max(0, Math.min(100, v)); auto = false; sl.set(z); draw(); tell(); }

  function tell() {
    const w = width(), across = w / D;
    let msg = `This view is <b>${fmtLen(w)}</b> across. Water molecules side by side across it: about <b>${words(across)}</b>.`;
    if (w > 0.015) msg = `<b>18 grams of water</b>, about a tablespoon and a bit: one mole. Molecules side by side across this view: about <b>${words(across)}</b>. Zoom in.`;
    if (w < 6e-9) msg = `Single water molecules, about 0.3 nm apart, jostling (here frozen in a snapshot). The whole spoonful holds <b>6.022 × 10²³</b> of them: pour it into a cube 2.6 cm wide and about <b>84 million</b> molecules sit along each edge. Counting one a second, day and night, would take about <b>19 thousand million million years</b>.`;
    say(msg);
  }

  api.loop((dt) => {
    if (auto && dt > 0) { z = Math.min(100, z + dt * 6.5); sl.set(z); if (z >= 100) auto = false; tell(); }
    draw();
  });

  function draw() {
    const c = api.colors();
    const w = width(), ppm = W / w, h = H / ppm;
    k.clear(c.plate);
    const X = (x) => W / 2 + x * ppm, Y = (y) => H / 2 - y * ppm;
    const waterTint = 'rgba(70,140,200,0.16)';

    // ---- the spoon (true size: bowl about 4 cm by 2.6 cm), water inside
    const bowlA = 0.020, bowlB = 0.013;
    const spoonVisible = w > 0.004;
    if (spoonVisible) {
      ctx.save();
      ctx.fillStyle = c.sheet; ctx.strokeStyle = c.muted; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X(-bowlA * 0.9), Y(0.002)); ctx.lineTo(X(-0.09), Y(0.004)); ctx.lineTo(X(-0.09), Y(-0.004)); ctx.lineTo(X(-bowlA * 0.9), Y(-0.002)); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(X(0), Y(0), bowlA * ppm, bowlB * ppm, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = waterTint; ctx.beginPath(); ctx.ellipse(X(0), Y(0), bowlA * 0.86 * ppm, bowlB * 0.84 * ppm, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else { ctx.fillStyle = waterTint; ctx.fillRect(0, 0, W, H); }

    // ---- water texture: speckle, then real molecules when they are big enough to see
    const across = w / D;
    if (across < 60) {
      const alpha = Math.max(0, Math.min(1, (60 - across) / 30));
      const i0 = Math.floor((-w / 2) / D) - 1, i1 = Math.ceil((w / 2) / D) + 1;
      const j0 = Math.floor((-h / 2) / D) - 1, j1 = Math.ceil((h / 2) / D) + 1;
      ctx.globalAlpha = alpha;
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
        const x = (i + (hash(i, j, 1) - 0.5) * 0.5 + (j % 2) * 0.5) * D, y = (j * 0.87 + (hash(i, j, 2) - 0.5) * 0.5) * D;
        const a = hash(i, j, 3) * Math.PI * 2, half = 52.25 * Math.PI / 180;
        const rO = 0.13e-9 * ppm, rH = 0.085e-9 * ppm, dOH = 0.0958e-9 * ppm;
        const ox = X(x), oy = Y(y);
        api.draw.atom(ctx, ox, oy, rO, 'O', { label: rO > 9 });
        for (const s of [-1, 1]) api.draw.atom(ctx, ox + Math.cos(a + s * half) * dOH, oy + Math.sin(a + s * half) * dOH, rH, 'H', { label: rH > 9 });
      }
      ctx.globalAlpha = 1;
    } else if (!spoonVisible || w < 0.012) {
      const n = 140, rr = api.rng(Math.round(Math.log(w) * 10));
      ctx.fillStyle = 'rgba(70,140,200,0.18)';
      for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(rr() * W, rr() * H, 1.2, 0, 7); ctx.fill(); }
    }

    // ---- landmarks for size, at true scale, placed to the right of centre
    const best = MARKS.filter((m) => m.size / w >= 0.025 && m.size / w <= 0.75)
      .sort((p, q) => Math.abs(Math.log(p.size / w / 0.3)) - Math.abs(Math.log(q.size / w / 0.3)))[0];
    for (const m of best ? [best] : []) {
      const frac = m.size / w;
      const a = Math.min(1, (frac - 0.025) / 0.04, (0.75 - frac) / 0.2);
      const s = m.size * ppm, cx = W * 0.72, cy = H * 0.46;
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      if (m.kind === 'salt') ctx.rect(cx - s / 2, cy - s / 2, s, s);
      else if (m.kind === 'hair') ctx.arc(cx, cy, s / 2, 0, 7);
      else if (m.kind === 'cell') { ctx.ellipse(cx, cy, s / 2, s / 2, 0, 0, 7); }
      else if (m.kind === 'bug') { ctx.ellipse(cx, cy, s / 2, s / 4, 0, 0, 7); }
      else if (m.kind === 'virus') { ctx.arc(cx, cy, s / 2, 0, 7); for (let t = 0; t < 12; t++) { const an = t / 12 * 7; ctx.moveTo(cx + Math.cos(an) * s / 2, cy + Math.sin(an) * s / 2); ctx.lineTo(cx + Math.cos(an) * s * 0.62, cy + Math.sin(an) * s * 0.62); } }
      else if (m.kind === 'dna') { for (let t = -1; t <= 1; t += 2) { for (let q = 0; q <= 40; q++) { const yy = cy - s * 2 + q * s * 0.1, xx = cx + t * Math.sin(q * 0.5) * s / 2; q ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } } }
      else ctx.arc(cx, cy, s / 2, 0, 7);
      ctx.fill(); ctx.stroke();
      if (m.kind === 'cell') { ctx.beginPath(); ctx.ellipse(cx, cy, s / 5, s / 5, 0, 0, 7); ctx.stroke(); }
      ctx.setLineDash([]);
      api.draw.text(ctx, `for size: ${m.name}`, cx, Math.min(H - 60, cy + Math.max(s / 2, m.kind === 'dna' ? s * 2 : 0) + 18), { size: 14, color: c.ink, align: 'center', weight: 600 });
      api.draw.text(ctx, fmtLen(m.size), cx, Math.min(H - 44, cy + Math.max(s / 2, m.kind === 'dna' ? s * 2 : 0) + 34), { size: 13, color: c.muted, align: 'center' });
      ctx.restore();
    }

    // ---- scale bar and counter
    const L = niceLen(w * 0.25), Lp = L * ppm;
    ctx.fillStyle = c.sheet; api.draw.roundRect(ctx, 14, H - 50, Math.max(150, Lp + 24), 38, 6); ctx.fill();
    ctx.fillStyle = c.ink; ctx.fillRect(26, H - 24, Lp, 4); ctx.fillRect(26, H - 29, 2, 14); ctx.fillRect(26 + Lp - 2, H - 29, 2, 14);
    api.draw.text(ctx, fmtLen(L), 26, H - 32, { size: 14, color: c.ink, weight: 600 });
    ctx.fillStyle = c.sheet; api.draw.roundRect(ctx, W - 252, 14, 238, 56, 6); ctx.fill();
    api.draw.text(ctx, 'molecules side by side across', W - 242, 34, { size: 13, color: c.muted });
    api.draw.text(ctx, `about ${words(across)}`, W - 242, 56, { size: 17, color: c.ink, weight: 600 });
    if (spoonVisible) api.draw.text(ctx, '18 g of water = 1 mole', 24, 36, { size: 17, color: c.ink, weight: 600 });
  }
  tell();
  return {};
}, { label: 'Zoom into the spoonful' });
