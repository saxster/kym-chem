// The periodic table as a 3D landscape. Every element is a column standing on its own tile; the height is the property
// you choose. Turned sideways, the landscape shows the pattern that gives the table its name: each row climbs or falls
// the same way, again and again. Heights are to scale within each property (zero at the floor). Unknown values (elements
// made only a few atoms at a time) are left as flat ghost tiles, never guessed.
import {
  BoxGeometry, InstancedMesh, MeshStandardMaterial, Object3D, Color, Sprite, SpriteMaterial, CanvasTexture,
  SRGBColorSpace, Raycaster, Vector2, Quaternion, Euler, Mesh, PlaneGeometry, MeshBasicMaterial, Group, Vector3,
} from 'three';
import { Live } from './core.js';
import { makeStage, webglOK } from './three_kit.js';
import { SKY } from './skyline_data.js';

const PROPS = [
  { key: 5, name: 'Atom size', unit: 'pm', max: 250, fmt: (v) => `atom size ${v} pm (its bonding radius: half the distance between two bonded atoms)`,
    say: 'Atom size. <b>Every row starts with a skyscraper</b>, an alkali metal, and slopes down to the right, because each step adds a proton that pulls the same shells in tighter. Go down a column and the towers grow: each row adds a new shell.' },
  { key: 6, name: 'Grip on its electron', unit: 'kJ/mol', max: 2400, fmt: (v) => `${v} kJ to pull one electron from each atom in a mole`,
    say: 'First ionisation energy: how much energy it takes to pull one electron away. <b>The mirror image of atom size:</b> the noble gases are the peaks and the alkali metals are the valleys. Small atoms hold on tight; big atoms let go easily.' },
  { key: 7, name: 'Pull on shared electrons', unit: '', max: 4.2, fmt: (v) => `electronegativity ${v} on Pauling’s scale`,
    say: 'Electronegativity: how strongly an atom pulls on electrons it shares in a bond. It rises across each row and falls down each column, so the summit is fluorine, top right. The noble gases have no value, because they hardly ever share.' },
  { key: 8, name: 'Melting point', unit: 'K', max: 3800, fmt: (v) => `melts at ${v} K (${Math.round(v - 273.15)} °C)`,
    say: 'Melting point, in kelvin. A mountain range in the middle (tungsten is the summit), and low ground at both edges. Carbon has no tower because it turns straight to gas at ordinary pressure.' },
  { key: 9, name: 'Density', unit: 'g/cm³', max: 23, fmt: (v) => `${v} g in every cubic centimetre`,
    say: 'Density. The heaviest metals cluster around osmium and iridium in the middle of row 6, more than twenty times as dense as water. Gases are so light their towers barely show.' },
];
const BLOCKS = { s: 'proton', p: 'electron', d: 'neutron', f: 'green' };

function textSprite(text, fg, bg) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 96;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.beginPath(); if (g.roundRect) g.roundRect(4, 8, 248, 80, 18); else g.rect(4, 8, 248, 80); g.fill(); }
  g.fillStyle = fg; g.font = '600 50px Lexend, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 128, 50);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace;
  const s = new Sprite(new SpriteMaterial({ map: t, depthTest: false, depthWrite: false, transparent: true }));
  s.scale.set(1.7, 0.64, 1); s.renderOrder = 20; return s;
}

Live.register('skyline', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: params.height || 440, distance: 30,
    label: 'A rotatable 3D landscape of the periodic table: one column per element, its height showing the chosen property.' });
  kit.spinSpeed = 0;
  // keep the whole table in frame at any width: pull the camera back on narrow screens
  const baseResize = kit.resize;
  kit.resize = () => {
    const w = kit.wrap.clientWidth || 600;
    const want = Math.round(Math.min(params.height || 440, Math.max(300, w * 0.82)));
    if (kit.wrap.style.height !== want + 'px') kit.wrap.style.height = want + 'px';
    const h = kit.wrap.clientHeight || want;
    const hfov = 2 * Math.atan(Math.tan((35 * Math.PI) / 360) * (w / h));
    kit.camera.position.set(0, 0, Math.max(30, 12 / Math.tan(hfov / 2)));
    baseResize();
  };
  kit.resize();
  const c = kit.c, say = api.readout();
  const reduce = api.reduced;
  const H = 6.2;                                  // tallest column, scene units
  const X = (col) => (col - 9.5) * 1.0, Z = (row) => (row - 5) * 1.0 + (row >= 9 ? 0.9 : 0);
  const land = new Group(); land.position.set(0, -2.4, -0.9); kit.root.add(land);

  // floor tiles for every element (ghosts show where the unknowns sit)
  const tileGeo = new PlaneGeometry(0.9, 0.9);
  const ghostMat = new MeshBasicMaterial({ color: new Color(c.rule), transparent: true, opacity: 0.55 });
  SKY.forEach(([, , col, row]) => {
    const t = new Mesh(tileGeo, ghostMat); t.rotation.x = -Math.PI / 2; t.position.set(X(col), 0.002, Z(row)); land.add(t);
  });

  // two instanced meshes: the main table, and the two f-block rows that float below it. The f-block is drawn
  // see-through so it never hides the main table, and is laid flat in the side views.
  const box = new BoxGeometry(0.84, 1, 0.84); box.translate(0, 0.5, 0);
  const dummy = new Object3D();
  const blockCol = {}; for (const [b, k] of Object.entries(BLOCKS)) blockCol[b] = new Color(c[k] || c.vol);
  const mainIdx = [], fIdx = [];
  SKY.forEach((e, i) => (e[4] === 'f' ? fIdx : mainIdx).push(i));
  const mainMesh = new InstancedMesh(box, new MeshStandardMaterial({ roughness: 0.6, metalness: 0.0 }), mainIdx.length);
  const fMesh = new InstancedMesh(box, new MeshStandardMaterial({ roughness: 0.6, metalness: 0.0, transparent: true, opacity: 0.55, depthWrite: false }), fIdx.length);
  const slot = new Map();                                  // element index -> [mesh, instance]
  mainIdx.forEach((i, k) => { mainMesh.setColorAt(k, blockCol[SKY[i][4]]); slot.set(i, [mainMesh, k]); });
  fIdx.forEach((i, k) => { fMesh.setColorAt(k, blockCol.f); slot.set(i, [fMesh, k]); });
  land.add(mainMesh, fMesh);
  const meshes = [mainMesh, fMesh];
  const elementAt = (mesh, k) => (mesh === fMesh ? fIdx[k] : mainIdx[k]);

  // landmark labels: the alkali metals and the noble gases, the two edges of every row
  const marks = new Map();
  const LAND = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr', 'He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
  const fg = c.ink, bg = c.sheet;
  SKY.forEach((e, i) => { if (LAND.includes(e[0])) { const s = textSprite(e[0], fg, bg); s.scale.multiplyScalar(0.8); land.add(s); marks.set(i, s); } });
  const pick = textSprite('', fg, bg); pick.visible = false; land.add(pick);

  let prop = 0, from = SKY.map(() => 0.02), to = from.slice(), tween = 1;
  let flatF = false;
  function heights(p) {
    const P = PROPS[p];
    return SKY.map((e) => {
      const v = e[P.key];
      if (v == null || (flatF && e[4] === 'f')) return 0;
      return Math.max(0.03, (v / P.max) * H);
    });
  }
  function place(k) {
    const ease = k < 1 ? 1 - Math.pow(1 - k, 3) : 1;
    SKY.forEach((e, i) => {
      const h = from[i] + (to[i] - from[i]) * ease;
      dummy.position.set(X(e[2]), 0, Z(e[3])); dummy.scale.set(1, Math.max(0.0001, h), 1); dummy.updateMatrix();
      const [mesh, k2] = slot.get(i); mesh.setMatrixAt(k2, dummy.matrix);
      const m = marks.get(i);
      if (m) { m.position.set(X(e[2]), h + 0.5, Z(e[3])); m.visible = SKY[i][PROPS[prop].key] != null; }
    });
    for (const m of meshes) { m.instanceMatrix.needsUpdate = true; m.computeBoundingSphere(); }
    kit.dirty = true;
  }
  function retarget() {
    const k = Math.min(1, tween), ease = k < 1 ? 1 - Math.pow(1 - k, 3) : 1;
    from = to.map((v, i) => from[i] + (v - from[i]) * ease); // the heights on screen now
    to = heights(prop); tween = reduce ? 1 : 0; place(tween);
  }
  function setProp(p) { prop = p; retarget(); pick.visible = false; describe(); kit.render(); }

  // views: the root turns (drag still works); the camera stays put
  const VIEWS = [
    { name: 'Overview', e: [0.98, -0.3, 0] },
    { name: 'Look along the rows', e: [0.1, 0, 0], say: 'You are looking at the rows side on, all seven lined up behind each other. Watch the left-to-right profile: the same slope repeats in every row.' },
    { name: 'Look down the columns', e: [0.3, -Math.PI / 2, 0], say: 'Now you are looking along the columns: each family runs across your view, with the top of the table on the right and the bottom on the left, and the noble gases nearest you. Follow any family from right to left and watch it climb or fall: that is the pattern going down a column.' },
  ];
  let view = 0, viewFrom = new Quaternion(), viewTo = new Quaternion(), vt = 1;
  function setView(v) {
    view = v; viewFrom.copy(kit.root.quaternion); viewTo.setFromEuler(new Euler(...VIEWS[v].e, 'XYZ'));
    if (flatF !== (v !== 0)) { flatF = v !== 0; retarget(); }
    vt = reduce ? 1 : 0; if (reduce) { kit.root.quaternion.copy(viewTo); kit.render(); }
    describe();
  }
  kit.root.quaternion.setFromEuler(new Euler(...VIEWS[0].e, 'XYZ'));

  function describe(extra) {
    const v = VIEWS[view].say ? ` <i>${VIEWS[view].say} (The two rows that float below the table are laid flat in this view so they don't block it.)</i>` : '';
    say((extra ? extra + '<br>' : '') + PROPS[prop].say + v);
  }

  // params: {"prop": "size" | "ie" | "en" | "mp" | "density", "view": "overview" | "rows" | "columns"}
  const P0 = Math.max(0, ['size', 'ie', 'en', 'mp', 'density'].indexOf(params.prop || 'size'));
  const V0 = Math.max(0, ['overview', 'rows', 'columns'].indexOf(params.view || 'overview'));
  api.tabs(PROPS.map((p) => p.name), (i) => setProp(i), P0);
  api.tabs(VIEWS.map((v) => v.name), (i) => setView(i), V0);
  let fly = 0;
  if (!reduce) api.button('Fly over the table', () => { fly = 7; });

  // tap or hover a column to read it
  const ray = new Raycaster(), ndc = new Vector2();
  function probe(ev) {
    const r = kit.renderer.domElement.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, kit.camera);
    const hit = ray.intersectObjects(meshes, false)[0];
    if (!hit) { if (pick.visible) { pick.visible = false; kit.render(); } return; }
    const ei = elementAt(hit.object, hit.instanceId);
    const e = SKY[ei], P = PROPS[prop], v = e[P.key];
    const cv = pick.material.map.image, g = cv.getContext('2d');
    g.clearRect(0, 0, cv.width, cv.height); g.fillStyle = bg; g.beginPath(); if (g.roundRect) g.roundRect(4, 8, 248, 80, 18); else g.rect(4, 8, 248, 80); g.fill();
    g.fillStyle = fg; g.font = '600 50px Lexend, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(e[0], 128, 50);
    pick.material.map.needsUpdate = true;
    const hNow = to[ei];
    pick.position.set(X(e[2]), hNow + 0.8, Z(e[3])); pick.visible = true;
    describe(`<b>${e[1]}</b> (${e[0]}): ${v == null ? 'not known: too few atoms have ever been made to measure it' : P.fmt(v)}.`);
    kit.render();
  }
  kit.wrap.addEventListener('pointermove', (ev) => { if (ev.pointerType === 'mouse' && !ev.buttons) probe(ev); });
  kit.wrap.addEventListener('click', probe);

  kit.onFrame = (dt) => {
    if (dt === 0) {                                   // paused or reduced motion: finish any movement at once
      if (tween < 1) { tween = 1; place(1); }
      if (vt < 1) { vt = 1; kit.root.quaternion.copy(viewTo); }
      fly = 0;
    }
    if (tween < 1 && dt > 0) { tween = Math.min(1, tween + dt / 0.7); place(tween); }
    if (vt < 1 && dt > 0) { vt = Math.min(1, vt + dt / 0.9); const k = 1 - Math.pow(1 - vt, 3); kit.root.quaternion.copy(viewFrom).slerp(viewTo, k); kit.dirty = true; }
    if (fly > 0 && dt > 0) {
      fly -= dt; const t = 1 - fly / 7;
      kit.root.quaternion.setFromEuler(new Euler(0.55 - 0.3 * Math.sin(t * Math.PI), -0.9 + 1.8 * t, 0, 'XYZ')); kit.dirty = true;
      if (fly <= 0) setView(view);
    }
  };

  prop = P0; view = V0; flatF = V0 !== 0; to = heights(P0); tween = 1; from = to.slice(); place(1);
  kit.root.quaternion.setFromEuler(new Euler(...VIEWS[V0].e, 'XYZ')); viewTo.copy(kit.root.quaternion);
  describe(); kit.render();
  return {};
}, { three: true, label: 'Turn the landscape in 3D' });
