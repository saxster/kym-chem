// Titration explorer: drag the burette slider and follow the local calculated pH curve (exact charge balance,
// Ka = 1.8 × 10⁻⁵, 25 mL of 0.10 mol/L acid against 0.10 mol/L sodium hydroxide) while a beaker shows
// the particles present at that point (1 drawn particle = 0.125 mmol; amounts too small to draw are said so).
import { Live } from './core.js';

const KA = 1.8e-5, KW = 1e-14;
function solve(vb, weak) {          // returns concentrations (mol/L) at vb mL of base added
  const V = 25 + vb, Ct = 2.5 / V, Na = 0.1 * vb / V;
  let lo = 0, hi = 14, pH = 7;
  for (let i = 0; i < 80; i++) {
    pH = (lo + hi) / 2; const H = 10 ** -pH, OH = KW / H;
    const A = weak ? Ct * KA / (KA + H) : Ct;
    if (H + Na - OH - A > 0) lo = pH; else hi = pH;
  }
  const H = 10 ** -pH, OH = KW / H, A = weak ? Ct * KA / (KA + H) : Ct;
  return { pH, V, H, OH, A, HA: Ct - A, Na, Ct };
}

Live.register('titration', (stage, params, api) => {
  const c = api.colors();
  const W = 1000, H = 380;
  const k = api.canvas(W, H, 'Interactive titration: a slider adds sodium hydroxide; a dot moves along the calculated pH curve and a beaker shows the particles present.');
  const ctx = k.ctx;
  let weak = true, vb = 0;
  const x0 = 70, y0 = 320, w = 560, h = 270;
  const X = (v) => x0 + v / 50 * w, Y = (p) => y0 - p / 14 * h;
  const curves = { true: [], false: [] };
  for (const wk of [true, false]) for (let v = 0; v <= 50.001; v += 0.25) curves[wk].push([v, solve(v, wk).pH]);
  const say = api.readout();
  api.tabs(['Acetic acid (weak)', 'Hydrochloric acid (strong)'], (i) => { weak = i === 0; render(); }, 0);
  api.slider('Base added', { min: 0, max: 50, step: 0.5, value: 0, fmt: (v) => `${v.toFixed(1)} mL`, onInput: (v) => { vb = v; render(); } });

  function token(x, y, label, col, dark = true) {
    ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    api.draw.text(ctx, label, x, y + 0.5, { size: label.length > 2 ? 7.6 : 9, color: dark ? '#fff' : c.ink, align: 'center', weight: 700, base: 'middle' });
  }

  function render() {
    k.clear();
    const s = solve(vb, weak);
    // axes and grid
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x0, y0 - h); ctx.lineTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.stroke();
    for (let p = 0; p <= 14; p += 2) {
      api.draw.text(ctx, String(p), x0 - 8, Y(p) + 4, { size: 12, color: c.muted, align: 'right' });
      if (p) { ctx.strokeStyle = c.rule; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(p)); ctx.lineTo(x0 + w, Y(p)); ctx.stroke(); ctx.setLineDash([]); }
    }
    for (let v = 0; v <= 50; v += 10) api.draw.text(ctx, String(v), X(v), y0 + 18, { size: 12, color: c.muted, align: 'center' });
    api.draw.text(ctx, 'sodium hydroxide added (mL)', x0 + w, y0 + 40, { size: 12.5, color: c.muted, align: 'right' });
    api.draw.text(ctx, 'pH', x0, 30, { size: 12.5, color: c.muted });
    ctx.strokeStyle = c.muted; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(25), y0); ctx.lineTo(X(25), Y(14)); ctx.stroke(); ctx.setLineDash([]);
    api.draw.text(ctx, 'equivalence, 25 mL', X(25) + 6, Y(0.6), { size: 11.5, color: c.muted });
    // both curves, the chosen one bold
    for (const wk of [false, true]) {
      ctx.strokeStyle = wk ? c.electron : c.proton; ctx.lineWidth = wk === weak ? 2.6 : 1.1; ctx.globalAlpha = wk === weak ? 1 : 0.35;
      ctx.beginPath(); curves[wk].forEach(([v, p], i) => (i ? ctx.lineTo(X(v), Y(p)) : ctx.moveTo(X(v), Y(p)))); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // marker
    ctx.beginPath(); ctx.arc(X(vb), Y(s.pH), 7, 0, Math.PI * 2); ctx.fillStyle = c.ink; ctx.fill();
    ctx.beginPath(); ctx.arc(X(vb), Y(s.pH), 11, 0, Math.PI * 2); ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2; ctx.stroke();
    api.draw.text(ctx, `pH ${s.pH.toFixed(2)}`, X(vb) + (vb > 38 ? -16 : 16), Y(s.pH) + (s.pH > 12 ? 22 : -14), { size: 14, color: c.ink, weight: 700, align: vb > 38 ? 'right' : 'left' });

    // beaker
    const bx = 690, by = 60, bw = 280, bh = 250;
    const unit = 0.125;                                         // mmol per drawn particle
    const mm = (conc) => conc * s.V;                            // mol/L × mL = mmol
    const n = (conc) => Math.round(mm(conc) / unit);
    const groups = [
      [weak ? 'HA' : 'HCl', n(s.HA), c.neutron, weak ? 'acetic acid, whole' : 'hydrogen chloride, whole'],
      [weak ? 'A⁻' : 'Cl⁻', n(s.A), weak ? c.green : '#5c9a52', weak ? 'acetate ion' : 'chloride ion'],
      ['H₃O⁺', n(s.H), c.proton, 'hydronium ion'],
      ['OH⁻', n(s.OH), c.electron, 'hydroxide ion'],
      ['Na⁺', n(s.Na), '#8a6bb5', 'sodium ion'],
    ];
    const level = by + bh - Math.min(bh - 20, 110 + vb * 2.6);
    ctx.fillStyle = 'rgba(53,109,131,.10)'; ctx.fillRect(bx + 2, level, bw - 4, by + bh - level - 2);
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    api.draw.text(ctx, `${s.V.toFixed(1)} mL of liquid`, bx + bw / 2, by - 10, { size: 12, color: c.muted, align: 'center' });
    let col = 0, row = 0;
    const perRow = 10, sx = bx + 20, sy = by + bh - 18;
    const tooFew = [];
    for (const [lab, cnt, colr, name] of groups) {
      if (cnt === 0 && mm(lab === 'H₃O⁺' ? s.H : lab === 'OH⁻' ? s.OH : 0) > 0) tooFew.push(name);
      for (let i = 0; i < cnt && row < 9; i++) {
        token(sx + col * 26, sy - row * 25, lab, colr, colr !== c.neutron || true);
        if (++col >= perRow) { col = 0; row++; }
      }
    }
    // legend with counts
    let ly = 334;
    api.draw.text(ctx, 'in the beaker (1 dot = 0.125 mmol):', bx, ly, { size: 11.5, color: c.muted });
    const parts = groups.map(([lab, cnt]) => `${lab} ${cnt}`).join('   ');
    api.draw.text(ctx, parts, bx, ly + 18, { size: 12, color: c.ink, weight: 600 });

    const added = 0.1 * vb;
    let what;
    if (vb === 0) what = weak ? 'Only acetic acid in water: almost every molecule is whole, so the pH starts at 2.87, not 1.' : 'Hydrochloric acid in water: every molecule has already given its proton to water, so the pH starts at 1.';
    else if (vb < 24.5) what = weak
      ? `Each hydroxide ion added takes a proton from a whole acetic acid molecule, making acetate. When both acid and acetate remain appreciable, they provide a <b>buffer region</b>. Resistance to further base diminishes as the acid reserve becomes small.${vb === 12.5 ? ' At formal halfway, acid and acetate amounts are approximately equal, and pH is about 4.74.' : ''}`
      : 'Added hydroxide reacts with hydronium to form water. The remaining acid amount and total solution volume set the pH; the change becomes steep near equivalence.';
    else if (vb < 25) what = `<b>Before equivalence.</b> ${added.toFixed(2)} mmol of hydroxide is less than the initial 2.50 mmol acid amount. A formal acid reserve remains; equilibrium determines the displayed pH.`;
    else if (vb === 25) what = `<b>Formal equivalence.</b> 2.50 mmol added hydroxide matches the initial 2.50 mmol acid. ${weak ? 'Acetate hydrolysis gives pH about 8.7; a small equilibrium amount of HA remains.' : 'This strong acid–strong base case is neutral at 25 °C, pH about 7.'}`;
    else what = `<b>After equivalence: excess base.</b> ${added.toFixed(2)} mmol added hydroxide exceeds the initial 2.50 mmol acid. Excess titrant dominates the pH; trace equilibrium species can still be present.`;
    say(`${vb.toFixed(1)} mL added (${added.toFixed(2)} mmol of hydroxide). pH ${s.pH.toFixed(2)}. ${what}${tooFew.length ? ` (There are some ${tooFew.join(' and ')}s too, but fewer than one dot's worth.)` : ''}`);
  }
  api.loop(() => render());
  // the canvas is re-sized (and cleared) after opening; redraw whenever that happens
  const ro = new ResizeObserver(() => requestAnimationFrame(render)); ro.observe(k.cv); api.onCleanup(() => ro.disconnect());
  api.account(() => ({vb,pH:solve(vb,weak).pH}));
  return {};
}, { label: 'Try the titration', static: true });
