// Rotatable 3D organic molecules (Chapter 10): carbon frameworks and isomer pairs, with real bond lengths and angles.
import { Live } from './core.js';
import { makeStage, addMolecule, addAtom, webglOK } from './three_kit.js';
import { butane, isobutane, cyclohexane, ethanol, dimethylEther } from './molgeom.js';

const SETS = {
  frameworks: [
    { name: 'Chain', mol: butane, note: '<b>Butane, C₄H₁₀.</b> Four carbons in a row. The chain zig-zags because the four bonds around each carbon point to the corners of a tetrahedron, about 109.5° apart.' },
    { name: 'Branch', mol: isobutane, note: '<b>Isobutane, C₄H₁₀.</b> The same atoms as butane, joined differently: three carbons hang off a central one. Count the bonds at any carbon: always four.' },
    { name: 'Ring', mol: cyclohexane, note: '<b>Cyclohexane, C₆H₁₂.</b> Six carbons joined in a ring. The ring is not flat: it bends into a "chair" so that every carbon keeps its bonds about 109.5° apart.' },
  ],
  isomers: [
    { name: 'Butane', mol: butane, note: '<b>Butane, C₄H₁₀</b>, boils at −0.5 °C. Long and stretched out, so neighbouring molecules can touch along their whole length.' },
    { name: 'Isobutane', mol: isobutane, note: '<b>Isobutane, C₄H₁₀</b>, boils at −11.7 °C. Exactly the same atoms, but bunched into a compact shape that touches its neighbours less.' },
    { name: 'Ethanol', mol: ethanol, note: '<b>Ethanol, C₂H₆O</b>, boils at 78.4 °C. The highlighted O–H is what lets ethanol molecules hydrogen-bond to each other.' },
    { name: 'Dimethyl ether', mol: dimethylEther, note: '<b>Dimethyl ether, C₂H₆O</b>, boils at −24.8 °C. The same atoms as ethanol, but the oxygen sits in the middle and every hydrogen is on a carbon: no O–H, so no hydrogen bonds between its molecules.' },
  ],
};

Live.register('organic3d', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const items = SETS[params.set] || SETS.frameworks;
  const kit = makeStage(stage, api, { height: 320, distance: 9.5, label: 'A rotatable 3D model of an organic molecule. Drag, or use the arrow keys, to turn it.' });
  kit.spinSpeed = 0.3;
  const say = api.readout();
  function show(i) {
    kit.clear(); kit.root.quaternion.identity(); kit.root.rotation.set(0.35, 0, 0);
    const mol = items[i].mol();
    const built = addMolecule(kit.root, mol, { scale: 1, c: kit.c });
    (mol.highlight || []).forEach((k) => addAtom(built.group, 'X', built.positions[k], { r: 0.72, label: false, color: '#f1d978', opacity: 0.38 }));
    say(items[i].note);
    kit.render();
  }
  api.tabs(items.map((x) => x.name), show, 0);
  show(0);
  return {};
}, { three: true, label: 'Turn it in 3D' });
