// Molecular geometry helpers for the organic 3D widgets: real bond lengths, tetrahedral and trigonal angles.
// Coordinates are in ångströms. Molecule format: {atoms: [[el, x, y, z], ...], bonds: [[i, j, order], ...]}.

export const LEN = { CC: 1.54, CdC: 1.34, CH: 1.09, CO: 1.43, OH: 0.96 };
const TET = 109.4712 * Math.PI / 180;

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a) || 1; return mul(a, 1 / l); };
export const vec = { sub, add, mul, dot, cross, norm };

function perp(d, hint) {
  let h = hint ? norm(hint) : (Math.abs(d[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]);
  let u = sub(h, mul(d, dot(h, d)));
  if (Math.hypot(...u) < 1e-6) u = sub([0, 0, 1], mul(d, dot([0, 0, 1], d)));
  return norm(u);
}

/** Directions for the missing bonds of an sp3 atom, given unit vectors to its existing neighbours. */
export function tetraFill(dirs, hint) {
  if (dirs.length === 0) {
    const r = 1 / Math.sqrt(3);
    return [[r, r, r], [r, -r, -r], [-r, r, -r], [-r, -r, r]];
  }
  if (dirs.length === 1) {
    const d = dirs[0];
    const u = perp(d, hint), v = cross(d, u);
    return [0, 1, 2].map((k) => {
      const ph = k * 2 * Math.PI / 3;
      return norm(add(mul(d, Math.cos(TET)), mul(add(mul(u, Math.cos(ph)), mul(v, Math.sin(ph))), Math.sin(TET))));
    });
  }
  if (dirs.length === 2) {
    const m = norm(mul(add(dirs[0], dirs[1]), -1));
    const n = norm(cross(dirs[0], dirs[1]));
    const h = TET / 2;
    return [norm(add(mul(m, Math.cos(h)), mul(n, Math.sin(h)))), norm(add(mul(m, Math.cos(h)), mul(n, -Math.sin(h))))];
  }
  if (dirs.length === 3) return [norm(mul(add(add(dirs[0], dirs[1]), dirs[2]), -1))];
  return [];
}

/** Builder: add heavy atoms and bonds, then fill every carbon with hydrogens. */
export function builder() {
  const atoms = [], bonds = [];
  const api = {
    atoms, bonds,
    add(el, pos) { atoms.push([el, ...pos]); return atoms.length - 1; },
    bond(i, j, o = 1) { bonds.push([i, j, o]); return api; },
    neighbours(i) { return bonds.filter((b) => b[0] === i || b[1] === i).map((b) => (b[0] === i ? b[1] : b[0])); },
    pos(i) { return atoms[i].slice(1); },
    /** Give atom i hydrogens until it has `valence` bonds (sp3 geometry). hint picks the staggering. */
    fillH(i, valence = 4, len = LEN.CH, hint) {
      const p = api.pos(i);
      const nb = api.neighbours(i);
      const used = bonds.filter((b) => b[0] === i || b[1] === i).reduce((s, b) => s + b[2], 0);
      const dirs = nb.map((j) => norm(sub(api.pos(j), p)));
      const free = tetraFill(dirs, hint).slice(0, valence - used);
      for (const d of free) { const h = api.add('H', add(p, mul(d, len))); api.bond(i, h, 1); }
      return api;
    },
    mol() { return { atoms, bonds }; },
  };
  return api;
}

/** Zig-zag positions in the xy-plane for a chain with the given bond lengths (tetrahedral angle at each joint). */
export function zigzag(lengths, start = [0, 0, 0]) {
  const s = Math.sin(TET / 2), c = Math.cos(TET / 2);
  const pts = [start];
  lengths.forEach((L, k) => {
    const p = pts[pts.length - 1];
    pts.push([p[0] + L * s, p[1] + (k % 2 === 0 ? c : -c) * L, p[2]]);
  });
  return pts;
}

export function butane() {
  const b = builder();
  const P = zigzag([LEN.CC, LEN.CC, LEN.CC]);
  const C = P.map((p) => b.add('C', p));
  b.bond(C[0], C[1]).bond(C[1], C[2]).bond(C[2], C[3]);
  C.forEach((i) => b.fillH(i, 4, LEN.CH, [0, 0, 1]));
  return b.mol();
}

export function isobutane() {
  const b = builder();
  const c0 = b.add('C', [0, 0, 0]);
  const T = tetraFill([]);
  // three methyl carbons, one hydrogen on the central carbon (pointing up)
  const up = norm([0, 1, 0]);
  // rotate tetrahedron so that T[0] points up
  const rot = (v) => { // map [1,1,1]/√3 to +y using Rodrigues
    const a = T[0], axis = norm(cross(a, up)), ang = Math.acos(dot(a, up));
    const k = axis, cs = Math.cos(ang), sn = Math.sin(ang);
    return add(add(mul(v, cs), mul(cross(k, v), sn)), mul(k, dot(k, v) * (1 - cs)));
  };
  const D = T.map(rot);
  const h = b.add('H', mul(D[0], LEN.CH)); b.bond(c0, h);
  for (let k = 1; k < 4; k++) { const ci = b.add('C', mul(D[k], LEN.CC)); b.bond(c0, ci); }
  for (let k = 1; k <= 3; k++) b.fillH(k + 1, 4, LEN.CH, [0, 1, 0]);
  return b.mol();
}

export function cyclohexane() {
  const b = builder();
  // chair: ring atoms at 60° steps, alternately up and down; h chosen to give C–C 1.54 and ~111° angles
  const h = 0.255, r = Math.sqrt(LEN.CC * LEN.CC - 4 * h * h);
  const C = [];
  for (let k = 0; k < 6; k++) {
    const a = k * Math.PI / 3;
    C.push(b.add('C', [r * Math.cos(a), k % 2 ? h : -h, r * Math.sin(a)]));
  }
  for (let k = 0; k < 6; k++) b.bond(C[k], C[(k + 1) % 6]);
  C.forEach((i) => b.fillH(i));
  return b.mol();
}

export function ethanol() {
  const b = builder();
  const P = zigzag([LEN.CC, LEN.CO, LEN.OH]);
  const c1 = b.add('C', P[0]), c2 = b.add('C', P[1]), o = b.add('O', P[2]), hO = b.add('H', P[3]);
  b.bond(c1, c2).bond(c2, o).bond(o, hO);
  b.fillH(c1, 4, LEN.CH, [0, 0, 1]); b.fillH(c2, 4, LEN.CH, [0, 0, 1]);
  const m = b.mol(); m.highlight = [o, hO]; return m;
}

export function dimethylEther() {
  const b = builder();
  const P = zigzag([LEN.CO, LEN.CO]);
  const c1 = b.add('C', P[0]), o = b.add('O', P[1]), c2 = b.add('C', P[2]);
  b.bond(c1, o).bond(o, c2);
  b.fillH(c1, 4, LEN.CH, [0, 0, 1]); b.fillH(c2, 4, LEN.CH, [0, 0, 1]);
  const m = b.mol(); m.highlight = [o]; return m;
}
