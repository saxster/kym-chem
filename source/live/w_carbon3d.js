// Diamond and graphite in 3D (Section 2.6). Diamond: every carbon bonded to four others (1.54 Å, 109.5°).
// Graphite: flat hexagonal sheets (1.42 Å bonds) stacked 3.35 Å apart, held only by weak attractions.
import { Group } from 'three';
import { Live } from './core.js';
import { makeStage, addAtom, addBond, addDashed, webglOK } from './three_kit.js';

function diamondChunk(R = 3.3) {
  const A = 3.567;                                   // cubic cell edge, Å; bond = A·√3/4 = 1.545 Å
  const fcc = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
  const pts = [];
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) for (let k = -2; k <= 2; k++)
    for (const b of fcc) for (const o of [[0, 0, 0], [0.25, 0.25, 0.25]]) {
      const p = [(i + b[0] + o[0]) * A, (j + b[1] + o[1]) * A, (k + b[2] + o[2]) * A];
      if (Math.hypot(...p) <= R) pts.push(p);
    }
  const bonds = [];
  for (let x = 0; x < pts.length; x++) for (let y = x + 1; y < pts.length; y++) {
    const d = Math.hypot(pts[x][0] - pts[y][0], pts[x][1] - pts[y][1], pts[x][2] - pts[y][2]);
    if (Math.abs(d - 1.5446) < 0.02) bonds.push([x, y]);
  }
  return { pts, bonds };
}

function graphene(R = 4.6, d = 1.42, shift = [0, 0]) {
  const a1 = [Math.sqrt(3) * d, 0], a2 = [Math.sqrt(3) / 2 * d, 1.5 * d];
  const pts = [];
  for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++)
    for (const b of [[0, 0], [0, d]]) {
      const x = i * a1[0] + j * a2[0] + b[0] + shift[0], z = i * a1[1] + j * a2[1] + b[1] + shift[1];
      if (Math.hypot(x, z) <= R) pts.push([x, z]);
    }
  const bonds = [];
  for (let p = 0; p < pts.length; p++) for (let q = p + 1; q < pts.length; q++)
    if (Math.abs(Math.hypot(pts[p][0] - pts[q][0], pts[p][1] - pts[q][1]) - d) < 0.02) bonds.push([p, q]);
  return { pts, bonds };
}

Live.register('carbon3d', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: 400, distance: 21, label: 'Diamond and graphite as rotatable 3D models. Both are pure carbon, joined in different ways.' });
  kit.spinSpeed = 0.25;
  const say = api.readout();
  let top = null, slideBtn = null, anim = 0;
  const RC = 0.3;

  function show(i) {
    cancelAnimationFrame(anim);
    kit.clear(); kit.root.quaternion.identity();
    if (i === 0) {
      kit.root.rotation.set(0.35, 0.4, 0);
      const { pts, bonds } = diamondChunk();
      bonds.forEach(([x, y]) => addBond(kit.root, pts[x], pts[y], 1, kit.c, 0.06));
      pts.forEach((p) => addAtom(kit.root, 'C', p, { r: RC }));
      say('<b>Diamond.</b> Every carbon atom is bonded to four others, pointing to the corners of a tetrahedron. The bonds run in every direction through the whole crystal, so there is no easy way to pull it apart or slide one part past another: that is why diamond is so hard.');
    } else {
      kit.root.rotation.set(0.32, 0.3, 0);
      const d = 1.42, gap = 3.35;
      const layers = [];
      [-1, 0, 1].forEach((L, idx) => {
        const g = new Group(); g.position.y = L * gap; kit.root.add(g); layers.push(g);
        const { pts, bonds } = graphene(4.0, d, idx === 1 ? [0, d] : [0, 0]);   // ABA stacking
        bonds.forEach(([p, q]) => addBond(g, [pts[p][0], 0, pts[p][1]], [pts[q][0], 0, pts[q][1]], 1, kit.c, 0.06));
        pts.forEach(([x, z]) => addAtom(g, 'C', [x, 0, z], { r: RC }));
        g.userData.pts = pts;
      });
      // dashed lines: weak attractions between atoms lying directly above one another
      const A = graphene(4.0, d), B = graphene(4.0, d, [0, d]);
      const over = A.pts.filter(([x, z]) => B.pts.some(([u, w]) => Math.hypot(x - u, z - w) < 0.01) && Math.hypot(x, z) < 3.2);
      for (const [x, z] of over) {
        addDashed(kit.root, [x, -gap + RC, z], [x, -RC, z], kit.c.muted);
        addDashed(kit.root, [x, RC, z], [x, gap - RC, z], kit.c.muted);
      }
      top = layers[2];
      say('<b>Graphite.</b> Each carbon is bonded to only three others, in flat sheets of hexagons. The sheets are 3.35 Å apart, more than twice the length of a bond, and only weak attractions (dashed lines) hold them together. Press <i>Slide the layers</i>: sheets slip easily, which is why a pencil leaves grey marks on paper.');
    }
    if (slideBtn) slideBtn.hidden = i === 0;
    kit.render();
  }
  api.tabs(['Diamond', 'Graphite'], show, 0);
  slideBtn = api.button('Slide the layers', () => {
    if (!top) return;
    cancelAnimationFrame(anim);
    const t0 = performance.now();
    const step = (now) => {
      const t = (now - t0) / 1000, T = 3.2;
      top.position.x = 2.46 * Math.sin(Math.PI * Math.min(1, t / T));   // slide one hexagon width out and back
      kit.render();
      if (t < T) anim = requestAnimationFrame(step); else { top.position.x = 0; kit.render(); }
    };
    anim = requestAnimationFrame(step);
  });
  slideBtn.hidden = true;
  show(0);
  return { destroy() { cancelAnimationFrame(anim); } };
}, { three: true, label: 'Turn it in 3D' });
