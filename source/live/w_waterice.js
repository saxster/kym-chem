// Why ice floats: liquid water (jostling molecules, hydrogen bonds forming and breaking)
// against ice Ih (every molecule hydrogen-bonded to exactly four neighbours, in open six-sided rings).
// Ice: oxygen atoms on the real hexagonal (wurtzite-type) network, O–O 2.76 Å; hydrogens placed by the
// "ice rules" (two near each oxygen, one on every O–O link), found with an Euler-circuit orientation.
// Liquid: the same number of molecules at the real liquid density (about 30 Å³ each, against ice's 32.6).
import { Live } from './core.js';
import { makeStage, addAtom, addBond, addDashed, webglOK } from './three_kit.js';
import { Group, Vector3, Quaternion, Matrix4, BufferGeometry, LineBasicMaterial, LineSegments, Float32BufferAttribute, Color, Mesh, CylinderGeometry, MeshStandardMaterial } from 'three';

const OO = 2.76, OH = 0.96, HALF = 52.25 * Math.PI / 180;
const SC = 0.42; // ångström -> scene units

function buildIce(nx, ny, nz) {
  const a = OO / (3 / 8 * Math.sqrt(8 / 3)); // ideal hexagonal network: O–O link = 3/8 of c, with c = a·√(8/3)
  const c = a * Math.sqrt(8 / 3);
  const A1 = [a, 0, 0], A2 = [-a / 2, a * Math.sqrt(3) / 2, 0], C = [0, 0, c];
  const basis = [[1 / 3, 2 / 3, 0], [2 / 3, 1 / 3, 0.5], [1 / 3, 2 / 3, 3 / 8], [2 / 3, 1 / 3, 7 / 8]];
  const frac = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let k = 0; k < nz; k++) for (const b of basis) frac.push([(i + b[0]) / nx, (j + b[1]) / ny, (k + b[2]) / nz]);
  const cart = (f) => [0, 1, 2].map((d) => f[0] * nx * A1[d] + f[1] * ny * A2[d] + f[2] * nz * C[d]);
  const pos = frac.map(cart);
  // neighbours under periodic boundaries (minimum image in fractional coordinates)
  const edges = [], nb = pos.map(() => []);
  for (let p = 0; p < frac.length; p++) for (let q = p + 1; q < frac.length; q++) {
    const df = frac[q].map((v, d) => { let x = v - frac[p][d]; return x - Math.round(x); });
    const v = cart(df), dist = Math.hypot(...v);
    if (Math.abs(dist - OO) < 0.15) { const e = { p, q, v }; edges.push(e); nb[p].push(e); nb[q].push(e); }
  }
  // Euler circuit (every vertex has degree 4) -> orient each edge so every O donates exactly 2 hydrogens
  const used = new Set(), adjIdx = nb.map(() => 0), stack = [[0, null]], dir = new Map();
  while (stack.length) {
    const [v] = stack[stack.length - 1];
    while (adjIdx[v] < nb[v].length && used.has(nb[v][adjIdx[v]])) adjIdx[v]++;
    if (adjIdx[v] < nb[v].length) {
      const e = nb[v][adjIdx[v]]; used.add(e);
      const w = e.p === v ? e.q : e.p;
      dir.set(e, v); // walked from v to w: v donates the hydrogen on this link
      stack.push([w, e]);
    } else stack.pop();
  }
  const center = pos.reduce((s, p) => s.map((x, d) => x + p[d] / pos.length), [0, 0, 0]);
  const P = pos.map((p) => p.map((x, d) => x - center[d]));
  const hyd = P.map(() => []);
  const hbonds = [];
  for (const e of edges) {
    const donor = dir.get(e), acc = donor === e.p ? e.q : e.p;
    const v = donor === e.p ? e.v : e.v.map((x) => -x);
    const u = v.map((x) => x / Math.hypot(...v));
    hyd[donor].push(u);
    // draw the hydrogen bond only if the partner is really there (not across the periodic seam)
    const direct = P[acc].map((x, d) => x - P[donor][d]);
    if (Math.abs(Math.hypot(...direct) - OO) < 0.2) hbonds.push([donor, acc, u]);
  }
  const vol = Math.abs(a * a * Math.sqrt(3) / 2 * c) * nx * ny * nz;
  return { P, hyd, hbonds, n: P.length, vol, cell: { A1: A1.map((x) => x * nx), A2: A2.map((x) => x * ny), C: C.map((x) => x * nz) } };
}

// Orientation that points the two O–H bonds roughly at the two nearest neighbouring oxygens.
function aimAtNeighbours(P, i, rng, gauss) {
  const near = P.map((q, j) => [j, Math.hypot(q[0] - P[i][0], q[1] - P[i][1], q[2] - P[i][2])]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
  const pick = (rng() < 0.25 ? [near[0], near[2]] : [near[0], near[1]]).map(([j]) => new Vector3(...P[j]).sub(new Vector3(...P[i])).normalize());
  const bis = pick[0].clone().add(pick[1]).normalize();
  let perp = pick[0].clone().sub(pick[1]); perp.addScaledVector(bis, -perp.dot(bis)); perp.normalize();
  if (!isFinite(perp.x)) perp = new Vector3(1, 0, 0);
  const nrm = bis.clone().cross(perp).normalize();
  // molecule frame: H's at (±sin h, −cos h, 0) => −y is the bisector, x is the in-plane perpendicular
  const m = new Matrix4().makeBasis(perp, bis.clone().negate(), nrm);
  const q = new Quaternion().setFromRotationMatrix(m);
  const wob = new Quaternion().setFromAxisAngle(new Vector3(gauss(rng), gauss(rng), gauss(rng)).normalize(), gauss(rng) * 0.25);
  return wob.multiply(q).normalize();
}

function buildLiquid(n, rng, gauss) {
  const per = 18.015 / 0.997 / 6.022e23 * 1e24; // Å³ per molecule at 25 °C (about 30.0)
  const L = Math.cbrt(n * per);
  const P = [];
  let tries = 0;
  while (P.length < n && tries < 200000) {
    tries++;
    const p = [(rng() - 0.5) * L, (rng() - 0.5) * L, (rng() - 0.5) * L];
    if (P.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) > 2.55)) P.push(p);
  }
  const Q = P.map(() => new Quaternion());
  for (let i = 0; i < P.length; i++) Q[i] = aimAtNeighbours(P, i, rng, gauss);
  return { P, Q, L, vol: L * L * L, n: P.length };
}

Live.register('waterice', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: params.height || 380, distance: 17, label: 'A rotatable 3D model of water molecules: liquid water, jostling, and ice, an open network of six-sided rings. Drag, or use the arrow keys, to turn it.' });
  kit.spinSpeed = 0.18;
  const say = api.readout();
  const c = kit.c;
  const rng = api.rng(11);
  const ice = buildIce(3, 3, 2);
  const liq = buildLiquid(ice.n, rng, api.gauss);
  let mode = params.mode === 'ice' ? 1 : 0, showH = true;
  let mols = [], hbLines = null, tH = 0, liquidBonds = 0;

  function molecule(parent, o, hs) {
    const g = new Group(); parent.add(g); g.position.set(...o.map((x) => x * SC));
    addAtom(g, 'O', [0, 0, 0], { r: 0.30, label: false });
    for (const u of hs) {
      const h = u.map((x) => x * OH * SC);
      addAtom(g, 'H', h, { r: 0.18, label: false });
      addBond(g, [0, 0, 0], h, 1, c, 0.05);
    }
    return g;
  }
  function boxOutline(parent, corners) {
    const segs = [];
    const E = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [i, j] of E) segs.push(...corners[i], ...corners[j]);
    const geo = new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(segs, 3));
    parent.add(new LineSegments(geo, new LineBasicMaterial({ color: new Color(c.muted), transparent: true, opacity: 0.55 })));
  }
  const rodGeo = new CylinderGeometry(1, 1, 1, 8);
  const rodMat = new MeshStandardMaterial({ color: new Color(c.electron || '#3b6ea8'), transparent: true, opacity: 0.75, roughness: 0.6 });
  function hbondGeometry(pairs) {
    if (hbLines) { kit.root.remove(hbLines); hbLines = null; }
    if (!showH || !pairs.length) return;
    const g = new Group();
    for (const [a, b] of pairs) {
      const A = new Vector3(...a), B = new Vector3(...b), d = B.clone().sub(A), len = d.length();
      // dashed look: three short pieces along the link
      for (let t = 0; t < 3; t++) {
        const m = new Mesh(rodGeo, rodMat);
        m.scale.set(0.035, len / 5, 0.035);
        m.position.copy(A).addScaledVector(d, (t * 2 + 0.5) / 5 + 0.1 / 5);
        m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), d.clone().normalize());
        g.add(m);
      }
    }
    hbLines = g; kit.root.add(g);
  }
  function showIce() {
    kit.clear(); mols = [];
    ice.P.forEach((o, i) => mols.push(molecule(kit.root, o, ice.hyd[i])));
    // hydrogen bonds: from each hydrogen to the oxygen it points at
    const pairs = ice.hbonds.map(([d, a, u]) => [ice.P[d].map((x, k) => (x + u[k] * (OH + 0.25)) * SC), ice.P[a].map((x, k) => (x - u[k] * 0.45) * SC)]);
    hbondGeometry(pairs);
    const { A1, A2, C } = ice.cell, o = ice.P.length ? [-(A1[0] + A2[0] + C[0]) / 2, -(A1[1] + A2[1] + C[1]) / 2, -(A1[2] + A2[2] + C[2]) / 2] : [0, 0, 0];
    const corner = (i, j, k) => [0, 1, 2].map((d) => (o[d] + i * A1[d] + j * A2[d] + k * C[d]) * SC);
    boxOutline(kit.root, [corner(0, 0, 0), corner(1, 0, 0), corner(0, 1, 0), corner(1, 1, 0), corner(0, 0, 1), corner(1, 0, 1), corner(0, 1, 1), corner(1, 1, 1)]);
    kit.root.quaternion.identity(); // looking straight down the six-sided channels
    kit.spinSpeed = 0;
    tell();
  }
  function liquidHydrogens(i) {
    const q = liq.Q[i];
    return [-1, 1].map((s) => new Vector3(Math.sin(HALF) * s, -Math.cos(HALF), 0).applyQuaternion(q).toArray());
  }
  function showLiquid() {
    kit.clear(); mols = [];
    liq.P.forEach((o, i) => mols.push(molecule(kit.root, o, liquidHydrogens(i))));
    const h = liq.L / 2 * SC, s = [-h, h];
    const corners = []; for (const z of s) for (const y of s) for (const x of s) corners.push([x, y, z]);
    boxOutline(kit.root, [corners[0], corners[1], corners[2], corners[3], corners[4], corners[5], corners[6], corners[7]]);
    kit.root.quaternion.setFromAxisAngle(new Vector3(1, 0.4, 0).normalize(), 0.5);
    kit.spinSpeed = 0.18;
    updateLiquidBonds(); tell();
  }
  function updateLiquidBonds() {
    // a hydrogen bond: a hydrogen within 2.2 Å of another molecule's oxygen, roughly in line
    const pairs = []; let count = 0;
    for (let i = 0; i < liq.P.length; i++) {
      const hs = liquidHydrogens(i);
      for (const u of hs) {
        const H = liq.P[i].map((x, d) => x + u[d] * OH);
        for (let j = 0; j < liq.P.length; j++) {
          if (j === i) continue;
          const dv = liq.P[j].map((x, d) => x - H[d]), dist = Math.hypot(...dv);
          if (dist < 2.45) { const cos = (dv[0] * u[0] + dv[1] * u[1] + dv[2] * u[2]) / dist; if (cos > 0.6) { pairs.push([H.map((x) => x * SC), liq.P[j].map((x) => x * SC)]); count++; } }
        }
      }
    }
    liquidBonds = count; hbondGeometry(pairs);
  }
  function tell() {
    if (mode === 1) {
      say(`<b>Ice.</b> Every molecule holds exactly <b>four</b> neighbours by hydrogen bonds (blue lines), at the corners of a tetrahedron. Looking straight on, you see open <b>six-sided rings</b> with empty channels through them. ${ice.n} molecules here fill about <b>${Math.round(ice.vol)} Å³</b>. (Density about 0.917 g/mL.)`);
    } else {
      const per = (2 * liquidBonds / liq.P.length).toFixed(1);
      say(`<b>Liquid water.</b> The same ${liq.P.length} molecules, jostling. Hydrogen bonds keep forming and breaking, and the rings collapse, so molecules can crowd closer: they fill only about <b>${Math.round(liq.vol)} Å³</b>, about ${Math.round((1 - liq.vol / ice.vol) * 100)}% less than ice. That is why ice floats. (In this simplified snapshot each molecule has about ${per} hydrogen bonds at a time; real water averages roughly 3 to 3.5.)`);
    }
  }
  api.tabs(['Liquid water', 'Ice'], (i) => { mode = i; i ? showIce() : showLiquid(); kit.render(); }, mode);
  api.button('Hydrogen bonds on/off', (b) => {
    showH = !showH; b.setAttribute('aria-pressed', String(showH));
    if (mode === 1) showIce(); else updateLiquidBonds();
    kit.render();
  }, { pressed: true });

  kit.onFrame = (dt) => {
    if (mode !== 0 || dt <= 0) return;
    // gentle thermal jostling (slowed down a million million times)
    for (let i = 0; i < liq.P.length; i++) {
      const p = liq.P[i];
      for (let d = 0; d < 3; d++) {
        p[d] += api.gauss(rng) * 0.3 * dt * 2;
        const lim = liq.L / 2;
        if (p[d] > lim) p[d] = lim - (p[d] - lim); if (p[d] < -lim) p[d] = -lim - (p[d] + lim);
      }
      const dq = new Quaternion().setFromAxisAngle(new Vector3(api.gauss(rng), api.gauss(rng), api.gauss(rng)).normalize(), api.gauss(rng) * 0.35 * dt);
      liq.Q[i].premultiply(dq).normalize();
      const g = mols[i]; if (!g) continue;
      g.position.set(...p.map((x) => x * SC));
      const hs = liquidHydrogens(i);
      // children: O, then for each H: H sphere, bond rod
      const kids = g.children;
      for (let s = 0; s < 2; s++) {
        const h = hs[s].map((x) => x * OH * SC);
        const hm = kids[1 + s * 2], rod = kids[2 + s * 2];
        if (hm) hm.position.set(...h);
        if (rod) { const v = new Vector3(...h); rod.position.copy(v.clone().multiplyScalar(0.5)); rod.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), v.clone().normalize()); }
      }
    }
    tH += dt;
    if (tH > 0.25) {
      tH = 0;
      // molecules keep turning towards new partners: bonds break and re-form
      for (let n = 0; n < 6; n++) { const i = Math.floor(rng() * liq.P.length); liq.Q[i].slerp(aimAtNeighbours(liq.P, i, rng, api.gauss), 0.8); }
      updateLiquidBonds(); tell();
    }
    kit.dirty = true;
  };
  mode ? showIce() : showLiquid();
  return {};
}, { three: true, label: 'Compare water and ice in 3D' });
