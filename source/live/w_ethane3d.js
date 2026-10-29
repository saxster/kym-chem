// Ethane vs ethene (Section 10.5): one end of ethane turns freely about its single bond;
// ethene's double bond keeps the molecule flat, and a twist springs back.
import { Group } from 'three';
import { Live } from './core.js';
import { makeStage, addAtom, addBond, webglOK } from './three_kit.js';
import { builder, LEN } from './molgeom.js';

function ethaneParts() {
  const b = builder();
  const c1 = b.add('C', [-LEN.CC / 2, 0, 0]), c2 = b.add('C', [LEN.CC / 2, 0, 0]);
  b.bond(c1, c2); b.fillH(c1, 4, LEN.CH, [0, 1, 0]); b.fillH(c2, 4, LEN.CH, [0, -1, 0]); // staggered
  return b;
}

Live.register('ethane3d', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: 320, distance: 8, label: 'Ethane and ethene in 3D. In ethane one end turns about the single bond; ethene stays flat.' });
  kit.spinSpeed = 0.15;
  const say = api.readout();
  let mode = 0, right = null, twistBtn = null, twistAnim = 0;

  function build(i) {
    mode = i; kit.clear(); kit.root.quaternion.identity(); kit.root.rotation.set(0.45, -0.5, 0);
    const left = new Group(); right = new Group(); kit.root.add(left, right);
    if (i === 0) {
      const b = ethaneParts();
      const P = (k) => b.pos(k);
      addBond(left, P(0), P(1), 1, kit.c);
      addAtom(left, 'C', P(0)); addAtom(right, 'C', P(1));
      b.bonds.forEach(([x, y]) => {
        if (x === 0 && y === 1) return;
        const g = x === 1 || y === 1 ? right : left;
        addBond(g, P(x), P(y), 1, kit.c); addAtom(g, 'H', P(y));
      });
      say('<b>Ethane, C₂H₆.</b> A single bond is like an axle: the right-hand CH₃ group can rotate around it, crossing a torsional energy barrier. Real molecules spin like this billions of times a second; here it is slowed right down.');
    } else {
      const d = LEN.CdC / 2, s = Math.sin(Math.PI / 3) * LEN.CH, cx = Math.cos(Math.PI / 3) * LEN.CH;
      addBond(left, [-d, 0, 0], [d, 0, 0], 2, kit.c);
      addAtom(left, 'C', [-d, 0, 0]); addAtom(right, 'C', [d, 0, 0]);
      for (const sg of [1, -1]) {
        addBond(left, [-d, 0, 0], [-d - cx, sg * s, 0], 1, kit.c); addAtom(left, 'H', [-d - cx, sg * s, 0]);
        addBond(right, [d, 0, 0], [d + cx, sg * s, 0], 1, kit.c); addAtom(right, 'H', [d + cx, sg * s, 0]);
      }
      say('<b>Ethene, C₂H₄.</b> All six atoms lie flat, with bonds 120° apart. The double bond is shorter (134 pm against 154 pm) and it locks the two ends: press <i>Try to twist</i>.');
    }
    if (twistBtn) twistBtn.hidden = i === 0;
    kit.render();
  }
  api.tabs(['Ethane', 'Ethene'], build, 0);
  twistBtn = api.button('Try to twist', () => {
    if (mode !== 1) return;
    // No spring animation or inferred mechanism. A counterfactual distortion costs energy.
    right.rotation.x = right.rotation.x ? 0 : 0.35;
    say('Counterfactual distorted ethene: twisting disrupts π overlap and costs energy. This is not free rotation or a predicted trajectory. Reset the molecule to restore its planar reference geometry.');
    kit.render();
  });
  api.slider('Single-bond torsion', {min:0,max:360,step:15,value:0,fmt:v=>`${v}°`,onInput:v=>{if(mode===0&&right){right.rotation.x=v*Math.PI/180;kit.render();}}});
  kit.onFrame = (dt) => { if (mode === 0 && right && dt) { right.rotation.x += dt * 1.6; kit.dirty = true; } };
  build(0);
  return { destroy() { cancelAnimationFrame(twistAnim); } };
}, { three: true, label: 'Turn it in 3D' });
