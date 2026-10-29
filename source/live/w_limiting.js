// Limiting reactant: molecules drift, then group into complete "2 H2 + O2" sets that react into water.
// Whatever cannot make a complete set is left over. Atoms are tracked one by one, so the tally of
// hydrogen and oxygen atoms is the same on every frame.
import { Live } from './core.js';

const MIXES = [[5, 2], [5, 3], [6, 2], [4, 3]];
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a, b, t) => a + (b - a) * t;

Live.register('limiting', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 300;
  const k = api.canvas(W, H, 'Animated hydrogen and oxygen molecules grouping into complete sets of two hydrogen molecules and one oxygen molecule, which react to make water. Molecules that cannot make a complete set are left over.');
  const ctx = k.ctx;
  const say = api.readout();
  let atoms = [], before = [], after = [], nSets = 0, leftH = 0, leftO = 0, mix = MIXES[0], t = 0;

  function setup(m) {
    mix = m; t = 0;
    const [nH2, nO2] = m;
    const r = api.rng(11 + nH2 * 7 + nO2);
    nSets = Math.min(Math.floor(nH2 / 2), nO2);
    leftH = nH2 - 2 * nSets; leftO = nO2 - nSets;
    atoms = []; before = []; after = [];
    const rowY = (s) => 74 + s * (nSets > 2 ? 62 : 92);
    // molecule list with drift start positions, set positions and (for reacting ones) product slots
    const mols = [];
    for (let i = 0; i < nH2; i++) mols.push({ kind: 'H2' });
    for (let i = 0; i < nO2; i++) mols.push({ kind: 'O2' });
    // scatter start positions over the left two-thirds without overlaps
    mols.forEach((mm, i) => {
      let x, y, ok, tries = 0;
      do {
        x = 50 + r() * 330; y = 60 + r() * 170; tries++;
        ok = mols.slice(0, i).every((o) => Math.hypot(o.sx - x, o.sy - y) > 52);
      } while (!ok && tries < 200);
      mm.sx = x; mm.sy = y; mm.ph = r() * 6.28; mm.rot = r() * 3.14;
    });
    // assign sets
    let h = 0, o = 0;
    const H2s = mols.filter((m2) => m2.kind === 'H2'), O2s = mols.filter((m2) => m2.kind === 'O2');
    for (let s = 0; s < nSets; s++) {
      const y = rowY(s);
      const a = H2s[h++], b = H2s[h++], ox = O2s[o++];
      a.tx = 60; a.ty = y; b.tx = 120; b.ty = y; ox.tx = 190; ox.ty = y;
      a.set = b.set = ox.set = s;
      a.prod = [0, 1]; b.prod = [1, 1]; ox.prod = [0, 1];  // which water each atom ends up in
      a.water = 0; b.water = 1;
    }
    let lx = 60;
    const ly = 262;
    for (; h < H2s.length; h++) { H2s[h].tx = lx; H2s[h].ty = ly; H2s[h].left = true; lx += 62; }
    for (; o < O2s.length; o++) { O2s[o].tx = lx + 8; O2s[o].ty = ly; O2s[o].left = true; lx += 70; }
    // atoms
    for (const m2 of mols) {
      const el = m2.kind === 'H2' ? 'H' : 'O';
      const d = m2.kind === 'H2' ? 11 : 15;
      const ids = [];
      for (const side of [-1, 1]) {
        const a = { el, mol: m2, side, d };
        atoms.push(a); ids.push(a);
      }
      before.push(ids);
      m2.atoms = ids;
    }
    // products: for each set, water w gets O from the O2 (side -1 -> water 0, +1 -> water 1) and both H of H2 #w
    for (let s = 0; s < nSets; s++) {
      const y = rowY(s) + 2;
      const setMols = mols.filter((m2) => m2.set === s);
      const ox = setMols.find((m2) => m2.kind === 'O2');
      const hs = setMols.filter((m2) => m2.kind === 'H2');
      for (let w = 0; w < 2; w++) {
        const cx = 440 + w * 78;
        const O = ox.atoms[w], Ha = hs[w].atoms[0], Hb = hs[w].atoms[1];
        O.px = cx; O.py = y - 5;
        Ha.px = cx - 19; Ha.py = y + 10; Hb.px = cx + 19; Hb.py = y + 10;
        after.push([O, Ha, Hb]);
      }
    }
    for (const a of atoms) if (a.mol.left) { a.px = null; }
  }

  // timeline (seconds)
  const T1 = 1.6, T2 = 3.6, T3 = 4.2, T4 = 6.4;
  function atomPos(a, tt) {
    const m2 = a.mol;
    const wob = tt * 1.3 + m2.ph;
    const driftX = m2.sx + 10 * Math.sin(wob), driftY = m2.sy + 8 * Math.cos(wob * 0.8);
    const g = ease((tt - T1) / (T2 - T1));
    const settled = tt > T2 ? Math.sin(tt * 1.1 + m2.ph) * 1.5 : 0;
    let mx = lerp(driftX, m2.tx, g), my = lerp(driftY, m2.ty, g) + settled;
    const rot = lerp(m2.rot, 0, g);
    let x = mx + a.side * a.d * Math.cos(rot), y = my + a.side * a.d * Math.sin(rot);
    if (a.px != null && !m2.left) {
      const q = ease((tt - T3) / (T4 - T3));
      // atoms lift slightly apart before regrouping, so you see the old bonds break
      const lift = Math.sin(Math.PI * q) * 16 * a.side;
      x = lerp(x, a.px, q); y = lerp(y, a.py, q) + lift * (a.el === 'O' ? -0.5 : 0.5);
    }
    return [x, y];
  }

  function render() {
    k.clear();
    const tt = t;
    const g = ease((tt - T1) / (T2 - T1));
    const q = ease((tt - T3) / (T4 - T3));
    const [nH2, nO2] = mix;
    api.draw.text(ctx, `start: ${nH2} H₂ + ${nO2} O₂`, 20, 24, { size: 14, weight: 600, color: c.ink });
    // set frames
    if (g > 0) {
      ctx.globalAlpha = g;
      for (let s = 0; s < nSets; s++) {
        const y = 74 + s * (nSets > 2 ? 62 : 92);
        api.draw.roundRect(ctx, 22, y - 32, 248, 64, 30);
        ctx.fillStyle = c.plate; ctx.fill();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = c.vol; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
        api.draw.text(ctx, `set ${s + 1}`, 262, y + 4, { size: 12, color: c.vol, align: 'right', weight: 600 });
        if (tt > T3) api.draw.arrow(ctx, 292, y, 380, y, c.ink, 1.6);
      }
      if (leftH + leftO > 0) {
        const parts = [];
        if (leftH) parts.push(`${leftH} H₂`);
        if (leftO) parts.push(`${leftO} O₂`);
        api.draw.text(ctx, `left over: ${parts.join(' and ')}, nothing to complete a set`, 20, 296, { size: 12.5, color: c.proton, weight: 600 });
      }
      ctx.globalAlpha = 1;
    }
    if (tt > T3) api.draw.text(ctx, 'after the reaction', 420, 24, { size: 14, weight: 600, color: c.ink, });
    // bonds: reactant bonds fade out, product bonds fade in
    const pos = new Map(atoms.map((a) => [a, atomPos(a, tt)]));
    const bondAlpha = (reacting) => (reacting ? Math.max(0, 1 - q * 2.2) : 1);
    for (const [a, b] of before) {
      const al = bondAlpha(!a.mol.left);
      if (al <= 0) continue;
      ctx.globalAlpha = al;
      const [x1, y1] = pos.get(a), [x2, y2] = pos.get(b);
      api.draw.bond(ctx, x1, y1, x2, y2, a.el === 'O' ? 2 : 1, c, 3);
      ctx.globalAlpha = 1;
    }
    const pa = Math.max(0, (q - 0.55) / 0.45);
    if (pa > 0) {
      ctx.globalAlpha = pa;
      for (const [O, Ha, Hb] of after) {
        const [ox, oy] = pos.get(O);
        for (const h of [Ha, Hb]) { const [hx, hy] = pos.get(h); api.draw.bond(ctx, ox, oy, hx, hy, 1, c, 3); }
      }
      ctx.globalAlpha = 1;
    }
    // atoms: draw O first (bigger), then H
    for (const el of ['O', 'H']) for (const a of atoms) {
      if (a.el !== el) continue;
      const [x, y] = pos.get(a);
      api.draw.atom(ctx, x, y, el === 'O' ? 15 : 10, el);
    }
    // tally: the same atoms before and after, on every frame
    const nH = 2 * nH2, nO = 2 * nO2, made = q >= 0.999 ? 2 * nSets : 0;
    ctx.fillStyle = c.sheet; api.draw.roundRect(ctx, 396, 232, 236, 50, 8); ctx.fill();
    ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.stroke();
    api.draw.text(ctx, `hydrogen atoms: ${nH}   oxygen atoms: ${nO}`, 514, 252, { size: 12, color: c.ink, align: 'center' });
    api.draw.text(ctx, made ? `${made} H₂O made` : 'water made so far: 0', 514, 271, { size: 12.5, color: made ? c.green : c.muted, align: 'center', weight: 600 });
    let msg;
    if (tt < T1) msg = `${nH2} hydrogen molecules and ${nO2} oxygen molecules, mixed. Each complete set needs exactly 2 H₂ and 1 O₂.`;
    else if (tt < T3) msg = `They make ${nSets} complete set${nSets === 1 ? '' : 's'}. ${leftH ? `${leftH} H₂ ` : ''}${leftH && leftO ? 'and ' : ''}${leftO ? `${leftO} O₂ ` : ''}cannot complete another set.`;
    else if (tt < T4) msg = 'Inside each set, the old bonds break and the same atoms join up again as water molecules. No atom is added or lost.';
    else {
      const remainder = leftH > 0 && leftO > 0
        ? `${leftH} H₂ and ${leftO} O₂ remain: neither token stock is exhausted, but another complete written group cannot fit.`
        : leftH === 0 && leftO === 0
          ? 'Both token stocks are exhausted in the written ratio.'
          : `${leftH === 0 ? 'Hydrogen' : 'Oxygen'} tokens are exhausted; ${leftH || leftO} ${leftH ? 'H₂' : 'O₂'} remain.`;
      msg = `${2 * nSets} water tokens made in this complete-group puzzle. ${remainder} Count the atoms: ${nH} hydrogen and ${nO} oxygen, before and after. This grouping rule does not predict molecular collisions or round down bulk amounts in moles.`;
    }
    say(msg);
  }
  api.tabs(MIXES.map(([a, b]) => `${a} H₂ + ${b} O₂`), (i) => { setup(MIXES[i]); render(); });
  api.button('Replay', () => { t = 0; render(); });
  setup(MIXES[0]);
  api.loop((dt) => { if (dt) t = Math.min(T4 + 30, t + dt); render(); });
  api.account(() => ({mix,nSets,leftH,leftO}));
  return {};
}, { label: 'Watch the sets form' });
