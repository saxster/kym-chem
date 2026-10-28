// Rotatable 3D molecules. params.set picks which molecules appear as tabs.
//   set 'dipoles': CO2, H2O, CH4, NH3 with bond pulls (thin arrows) and the overall pull (thick arrow).
// Other chapters add sets by calling registerSet(name, [{name, mol, extras(kit, built)}]).
import { Live } from './core.js';
import { makeStage, addMolecule, addArrow, MOLS, webglOK } from './three_kit.js';
import { Vector3 } from 'three';

const SETS = {};
export function registerSet(name, items) { SETS[name] = items; }

function bondPulls(kit, built, pairs, scale) {
  // arrows along each bond, from the less to the more electron-pulling atom, drawn just outside the bond
  for (const [from, to] of pairs) {
    const a = new Vector3(...built.positions[from]), b = new Vector3(...built.positions[to]);
    const dir = b.clone().sub(a).normalize();
    const side = new Vector3(0, 0, 1).cross(dir).normalize().multiplyScalar(0.32 * scale);
    if (side.length() < 1e-3) side.set(0, 0.32 * scale, 0);
    const s = a.clone().addScaledVector(dir, 0.18 * scale).add(side), e = b.clone().addScaledVector(dir, -0.3 * scale).add(side);
    addArrow(built.group, s.toArray(), e.toArray(), kit.c.electron, 0.03);
  }
}

registerSet('dipoles', [
  { name: 'CO₂', mol: MOLS.CO2, note: 'Straight. The two bond pulls point in opposite directions and cancel: <b>no overall pull</b>.',
    extras(kit, b) { bondPulls(kit, b, [[0, 1], [0, 2]], 1.6); } },
  { name: 'H₂O', mol: MOLS.H2O, note: 'Bent (104.5°). The two bond pulls add up to an <b>overall pull towards the oxygen</b>: water is polar.',
    extras(kit, b) {
      bondPulls(kit, b, [[1, 0], [2, 0]], 1.6);
      const o = new Vector3(...b.positions[0]);
      addArrow(b.group, [o.x, o.y - 1.25, o.z], [o.x, o.y + 0.75, o.z], kit.c.green, 0.06);
    } },
  { name: 'CH₄', mol: MOLS.CH4, note: 'A tetrahedron (109.5°). Four small pulls point to the corners and cancel exactly: <b>no overall pull</b>.',
    extras(kit, b) { bondPulls(kit, b, [[1, 0], [2, 0], [3, 0], [4, 0]], 1.6); } },
  { name: 'NH₃', mol: MOLS.NH3, note: 'A low pyramid (107°). The three bond pulls add up to an <b>overall pull towards the nitrogen</b>: ammonia is polar.',
    extras(kit, b) {
      bondPulls(kit, b, [[1, 0], [2, 0], [3, 0]], 1.6);
      const n = new Vector3(...b.positions[0]);
      addArrow(b.group, [n.x, n.y - 1.3, n.z], [n.x, n.y + 0.85, n.z], kit.c.green, 0.06);
    } },
]);

Live.register('molecule3d', (stage, params, api) => {
  const items = SETS[params.set] || SETS.dipoles;
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: params.height || 340, distance: params.distance || 7.5, label: params.label || 'A rotatable 3D model of a molecule. Drag, or use the arrow keys, to turn it.' });
  const say = api.readout();
  const scale = params.scale || 1.6;
  function show(i) {
    kit.clear();
    kit.root.quaternion.identity();
    const it = items[i];
    const built = addMolecule(kit.root, it.mol, { scale, c: kit.c });
    it.extras?.(kit, built, api);
    if (it.tilt) kit.root.rotation.set(...it.tilt);
    say(`<b>${it.name}</b>. ${it.note || ''}`);
    kit.render();
  }
  if (items.length > 1) api.tabs(items.map((x) => x.name), show, 0);
  show(0);
  return {};
}, { three: true, label: 'Turn it in 3D' });
