// Energy barrier: particles jiggle in the reactant valley with a spread of energies. Every so often a collision
// gives one particle a new energy (drawn from a Boltzmann-like spread whose average rises with temperature).
// If that energy reaches the peak, the particle crosses into the product valley (and products can cross back,
// but their barrier is higher). Made-up units, as in Figures 5.2 and 5.4. params.catalyst adds a lower route.
import { Live } from './core.js';

Live.register('barrier', (stage, params, api) => {
  const c = api.colors();
  const cat = !!params.catalyst;
  const W = 640, H = 330;
  const k = api.canvas(W, H, cat
    ? 'Particles crossing an energy barrier, with a switch for a catalyst that lowers the peak. Crossings speed up in both directions.'
    : 'Particles with a spread of energies in the reactant valley. Only the occasional high-energy particle crosses the peak; a temperature slider changes how often.');
  const ctx = k.ctx;
  const Rlev = 50, Plev = 20, peakU = cat ? 130 : 100, peakC = 90;
  const vmax = cat ? 140 : 120;
  const x0 = 60, y0 = 280, w = 520, h = 230;
  const X = (u) => x0 + u / 10 * w, Y = (v) => y0 - v / vmax * h;
  let useCat = false;
  let kT = cat ? 13 : 10;                     // "temperature" as an average spare energy, made-up units
  const COLL = 2.2;                           // new energy draws per particle per second (slowed down)
  const N = 50, r = api.rng(5);
  const peak = () => (useCat ? peakC : peakU);
  // profile shape (same control points as the still figure)
  function profile(pk) {
    return [[0, Rlev], [1.2, Rlev], [2.6, Rlev + (pk - Rlev) * 0.25], [3.8, Rlev + (pk - Rlev) * 0.8], [5, pk],
      [6.2, Plev + (pk - Plev) * 0.8], [7.4, Plev + (pk - Plev) * 0.25], [8.8, Plev], [10, Plev]];
  }
  function curveY(u, pk) { // linear interpolation between control points (good enough for riding along)
    const p = profile(pk);
    for (let i = 0; i < p.length - 1; i++) if (u <= p[i + 1][0]) { const f = (u - p[i][0]) / (p[i + 1][0] - p[i][0]); const s = (1 - Math.cos(f * Math.PI)) / 2; return p[i][1] + (p[i + 1][1] - p[i][1]) * s; }
    return Plev;
  }
  const draw = () => -kT * Math.log(1 - r() * 0.999999);   // exponential spread: few have a lot
  const parts = [];
  function reset() {
    parts.length = 0;
    for (let i = 0; i < N; i++) parts.push({ side: 0, u: 0.15 + r() * 1.1, e: draw(), ph: r() * 6.28, cross: null });
    times.length = 0;
  }
  const times = [];   // [model time, direction] of recent crossings
  let t = 0;
  reset();

  api.slider('Temperature', { min: 6, max: 18, step: 1, value: kT, fmt: (v) => (v <= 8 ? 'cool' : v <= 12 ? 'warm' : v <= 15 ? 'hot' : 'very hot'), onInput: (v) => { kT = v; } });
  if (cat) api.button('Catalyst', (b) => { useCat = !useCat; b.setAttribute('aria-pressed', String(useCat)); }, { pressed: false });
  api.button('Start again', () => reset());
  const say = api.readout();

  function step(dt) {
    t += dt;
    for (const p of parts) {
      if (p.cross) {
        p.cross.f += dt / 1.4;
        const f = Math.min(1, p.cross.f), dir = p.cross.dir;
        p.u = dir > 0 ? 1.3 + f * (8.95 - 1.3) : 8.95 - f * (8.95 - 1.3);
        if (f >= 1) { p.side = dir > 0 ? 1 : 0; p.u = p.side ? 8.85 + r() * 1.0 : 0.15 + r() * 1.1; p.cross = null; p.e = draw(); }
        continue;
      }
      p.ph += dt * (2 + p.e / 10);
      if (r() < COLL * dt) {
        p.e = draw();
        const barrier = peak() - (p.side ? Plev : Rlev);
        if (p.e >= barrier) { p.cross = { f: 0, dir: p.side ? -1 : 1 }; times.push([t, p.side ? -1 : 1]); }
      }
    }
    while (times.length && t - times[0][0] > 10) times.shift();
  }

  function render() {
    k.clear();
    // axes
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x0, y0 - h); ctx.lineTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.stroke();
    api.draw.text(ctx, 'energy (made-up units)', x0 + 4, y0 - h - 8, { size: 12, color: c.muted });
    api.draw.text(ctx, 'progress of the reaction', x0 + w, y0 + 22, { size: 12, color: c.muted, align: 'right' });
    for (const v of cat ? [20, 50, 90, 130] : [20, 50, 100]) api.draw.text(ctx, String(v), x0 - 8, Y(v) + 4, { size: 11.5, color: c.muted, align: 'right' });
    // paths
    const pathOf = (pk) => { ctx.beginPath(); for (let i = 0; i <= 120; i++) { const u = i / 12; i ? ctx.lineTo(X(u), Y(curveY(u, pk))) : ctx.moveTo(X(u), Y(curveY(u, pk))); } };
    pathOf(peakU); ctx.strokeStyle = cat ? c.ink : c.vol; ctx.lineWidth = useCat ? 1.2 : 2.2; ctx.globalAlpha = useCat ? 0.4 : 1; ctx.stroke(); ctx.globalAlpha = 1;
    if (cat) { pathOf(peakC); ctx.setLineDash([7, 5]); ctx.strokeStyle = c.green; ctx.lineWidth = useCat ? 2.4 : 1.2; ctx.globalAlpha = useCat ? 1 : 0.45; ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
    api.draw.text(ctx, 'reactants', X(0.15), Y(Rlev) + 22, { size: 12.5, color: c.ink });
    api.draw.text(ctx, 'products', X(9.4), Y(Plev) + 22, { size: 12.5, color: c.ink, align: 'center' });
    // particles: height above the valley floor shows each one's energy right now
    let nR = 0, nP = 0;
    for (const p of parts) {
      let x, y;
      if (p.cross) { x = X(p.u); y = Y(curveY(p.u, peak())) - 6; }
      else {
        const floor = p.side ? Plev : Rlev;
        const lift = Math.min(p.e, peak() - floor) * 0.92;
        x = X(p.u) + Math.sin(p.ph) * 3; y = Y(floor + lift) - 6;
        p.side ? nP++ : nR++;
      }
      ctx.beginPath(); ctx.arc(x, y, 4.6, 0, Math.PI * 2);
      ctx.fillStyle = p.cross ? c.proton : (p.side ? c.electron : c.neutron); ctx.fill();
    }
    if (parts.some((p) => p.cross)) for (const p of parts) if (p.cross) { ctx.beginPath(); ctx.arc(X(p.u), Y(curveY(p.u, peak())) - 6, 9, 0, Math.PI * 2); ctx.strokeStyle = c.proton; ctx.lineWidth = 1.4; ctx.stroke(); }
    const fwd = times.filter((x) => x[1] > 0).length, back = times.length - fwd;
    const span = Math.min(10, Math.max(t, 0.001));
    api.draw.text(ctx, `crossings in the last ${span < 10 ? span.toFixed(0) : 10} s:  forward ${fwd},  back ${back}`, x0 + w, 24, { size: 12.5, color: c.ink, align: 'right', weight: 600 });
    api.draw.text(ctx, `${nR} on the reactant side, ${nP} on the product side`, x0 + w, 42, { size: 12, color: c.muted, align: 'right' });
    const fb = peak() - Rlev, rb = peak() - Plev;
    say(`Each dot's height shows its energy at this moment. Collisions keep handing out new energies; most are small, a few are large. Only a dot that gets at least ${fb} units (the forward barrier${useCat ? ' on the catalysed route' : ''}) can cross; going back needs ${rb}. ${kT >= 14 ? 'Hotter: high energies are far more common, so crossings speed up a lot.' : kT <= 8 ? 'Cool: high energies are rare, so crossings are rare.' : ''} ${cat ? (useCat ? 'With the catalyst both barriers are 40 lower, so crossings speed up in <b>both</b> directions; the start and finish levels have not moved.' : 'Switch on the catalyst to open the lower route.') : ''} (Made-up units; slowed down.)`);
  }
  api.loop((dt) => { if (dt) step(dt); render(); });
  api.account(() => ({Rlev,Plev,peak:peak(),kT,useCat}));
  return {};
}, { label: 'Watch particles cross' });
