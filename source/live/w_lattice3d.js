// A 3×3×3 block of the sodium chloride crystal (Section 2.5). Ions alternate in all three directions.
// Sizes keep the real ratio of ionic radii (Na⁺ 102 pm, Cl⁻ 181 pm) but are shrunk so you can see inside;
// in the real crystal the ions touch.
import { Live } from './core.js';
import { makeStage, addAtom, addBond, webglOK } from './three_kit.js';

Live.register('lattice3d', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: 380, distance: 21, label: 'A rotatable 3D block of the sodium chloride crystal: 27 ions, sodium and chloride alternating in every direction.' });
  kit.spinSpeed = 0.25;
  const say = api.readout();
  const a = 2.82;                          // Na–Cl distance in Å
  const shrink = 0.4;
  const R = { Na: 1.02 * shrink, Cl: 1.81 * shrink };
  const ions = [];
  kit.root.rotation.set(0.5, 0.6, 0);
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
    const el = (i + j + k) % 2 === 0 ? 'Na' : 'Cl';
    const p = [i * a, j * a, k * a];
    const m = addAtom(kit.root, el, p, { r: R[el] });
    m.material = m.material.clone();
    ions.push({ m, el, p, d: Math.abs(i) + Math.abs(j) + Math.abs(k) });
  }
  // thin lines joining each ion to its nearest neighbours
  const lines = [];
  for (const x of ions) for (const y of ions) {
    const dist = Math.hypot(x.p[0] - y.p[0], x.p[1] - y.p[1], x.p[2] - y.p[2]);
    if (x !== y && Math.abs(dist - a) < 0.01 && x.p.join() < y.p.join()) {
      const bs = addBond(kit.root, x.p, y.p, 1, kit.c, 0.016);
      bs.forEach((b) => { b.material = b.material.clone(); b.material.transparent = true; b.material.opacity = 0.35; });
      lines.push({ bs, x, y });
    }
  }
  let focus = false;
  function apply() {
    for (const ion of ions) {
      const keep = !focus || ion.d <= 1;          // the centre Na⁺ and its 6 Cl⁻ neighbours
      ion.m.material.transparent = !keep; ion.m.material.opacity = keep ? 1 : 0.12; ion.m.material.needsUpdate = true;
      ion.m.material.depthWrite = keep;
      const lab = ion.m.userData.label; if (lab) lab.material.opacity = keep ? 1 : 0.1;
    }
    for (const l of lines) {
      const keep = focus ? (l.x.d === 0 || l.y.d === 0) : true;
      l.bs.forEach((b) => { b.material.opacity = focus ? (keep ? 0.9 : 0.05) : 0.35; });
    }
    say(focus
      ? 'The sodium ion in the middle is surrounded by <b>6 chloride ions</b>: above, below, left, right, in front and behind. Every chloride is surrounded by 6 sodiums in the same way. Which of the six is &ldquo;its&rdquo; chloride, the one that took its electron? There is no way to tell, and it does not matter: all six are the same distance away and pull equally.'
      : 'Sodium ions (Na⁺, purple) and chloride ions (Cl⁻, green) alternate in every direction. The sizes keep the real ratio (chloride is bigger), but the ions are shrunk so you can see inside: in real salt they touch.');
    kit.dirty = true; kit.render();
  }
  const btn = api.button("Show one ion's neighbours", () => { focus = !focus; btn.setAttribute('aria-pressed', String(focus)); apply(); }, { pressed: false });
  apply();
  return {};
}, { three: true, label: 'Turn it in 3D' });
