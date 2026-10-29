// Where the electrons really are (Sections 1.6 and the table-shape story).
// Tab 1 shows the shells as most books draw them: rings with dots. Tab 2 shows the truth: each "seat" for
// electrons is a cloud, sampled point by point from the real hydrogen-like probability density |psi|^2
// (1s, 2s, 2p, and one 3d for the curious). Tab 3 fills neon's ten electrons into its five clouds.
// Sizes keep the real hydrogen-like ratio between clouds (2s and 2p spread about four times as far as 1s);
// the dots are where the electron is likely to be found, not tiny electrons.
import { Points, PointsMaterial, BufferGeometry, Float32BufferAttribute, Color, Group, LineLoop, LineBasicMaterial,
  Mesh, SphereGeometry, MeshStandardMaterial, Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace } from 'three';
import { Live } from './core.js';
import { makeStage, webglOK } from './three_kit.js';

// probability densities in units of the Bohr radius (hydrogen-like, Z = 1; shapes are what matter here)
const DENS = {
  '1s': (x, y, z) => { const r = Math.hypot(x, y, z); return Math.exp(-2 * r); },
  '2s': (x, y, z) => { const r = Math.hypot(x, y, z); const f = (2 - r) * Math.exp(-r / 2); return f * f; },
  '2px': (x, y, z) => { const r = Math.hypot(x, y, z); const f = x * Math.exp(-r / 2); return f * f; },
  '2py': (x, y, z) => { const r = Math.hypot(x, y, z); const f = y * Math.exp(-r / 2); return f * f; },
  '2pz': (x, y, z) => { const r = Math.hypot(x, y, z); const f = z * Math.exp(-r / 2); return f * f; },
  '3dz2': (x, y, z) => { const r = Math.hypot(x, y, z); const f = (3 * z * z - r * r) * Math.exp(-r / 3); return f * f; },
};
const BOX = { '1s': 3.2, '2s': 11, '2px': 10, '2py': 10, '2pz': 10, '3dz2': 18 };

function sample(name, n, rnd) {
  const d = DENS[name], L = BOX[name];
  let max = 0;
  for (let i = 0; i < 6000; i++) max = Math.max(max, d((rnd() * 2 - 1) * L, (rnd() * 2 - 1) * L, (rnd() * 2 - 1) * L));
  if (name === '1s') max = 1;
  const pts = [];
  let guard = 0;
  while (pts.length < n * 3 && guard++ < n * 4000) {
    const x = (rnd() * 2 - 1) * L, y = (rnd() * 2 - 1) * L, z = (rnd() * 2 - 1) * L;
    if (rnd() * max * 1.05 < d(x, y, z)) pts.push(x, y, z);
  }
  return pts;
}

function labelSprite(text, color) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
  const g = cv.getContext('2d');
  g.fillStyle = color; g.font = '600 64px Lexend, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 128, 68);
  const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace;
  const s = new Sprite(new SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(1.6, 0.8, 1); s.renderOrder = 10;
  return s;
}

Live.register('orbitals', (stage, params, api) => {
  if (!webglOK()) { stage.textContent = 'This device cannot show 3D graphics, so the drawing above is the best view.'; return {}; }
  const kit = makeStage(stage, api, { height: 400, distance: 30,
    label: 'A turnable 3D view of an atom. One view shows electron shells as rings; another shows the real electron clouds: hydrogen-like 1s and 2s density models with a radial node in 2s, and three dumbbell-shaped 2p clouds at right angles.' });
  kit.spinSpeed = 0.18;
  const c = kit.c;
  const say = api.readout();
  const rnd = api.rng(11);
  const S = 1.0;                       // scene units per Bohr radius
  const COL = { '1s': c.electron, '2s': c.vol || c.electron, '2px': c.proton, '2py': c.green, '2pz': c.neutron, '3dz2': c.ink_2 || c.ink };

  // nucleus (drawn far larger than real: a real nucleus would be invisible at this scale)
  const nucleus = new Mesh(new SphereGeometry(0.28, 24, 16), new MeshStandardMaterial({ color: new Color(c.proton), roughness: 0.5 }));
  kit.root.add(nucleus);

  // --- the clouds
  const clouds = {};
  const sliceGroup = {};
  for (const name of Object.keys(DENS)) {
    const n = name === '1s' ? 2200 : name === '3dz2' ? 3600 : 2600;
    const pts = sample(name, n, rnd).map((v) => v * S);
    const geo = new BufferGeometry(); geo.setAttribute('position', new Float32BufferAttribute(pts, 3));
    const mat = new PointsMaterial({ color: new Color(COL[name]), size: name === '1s' ? 0.06 : 0.12, transparent: true, opacity: 0.8, depthWrite: false });
    const p = new Points(geo, mat);
    // the same cloud cut in half (only points with |z| small), to show the inside
    const cut = []; for (let i = 0; i < pts.length; i += 3) if (Math.abs(pts[i + 2]) < (name === '1s' ? 0.35 : 0.9)) cut.push(pts[i], pts[i + 1], pts[i + 2]);
    const g2 = new BufferGeometry(); g2.setAttribute('position', new Float32BufferAttribute(cut, 3));
    const half = new Points(g2, new PointsMaterial({ color: new Color(COL[name]), size: mat.size * 1.25, transparent: true, opacity: 0.9, depthWrite: false }));
    const grp = new Group(); grp.add(p); kit.root.add(grp); grp.visible = false;
    const grpCut = new Group(); grpCut.add(half); kit.root.add(grpCut); grpCut.visible = false;
    clouds[name] = grp; sliceGroup[name] = grpCut;
  }
  const labels = {
    '1s': labelSprite('1s', c.ink), '2s': labelSprite('2s', c.ink), '2px': labelSprite('2p', c.ink),
    '2py': labelSprite('2p', c.ink), '2pz': labelSprite('2p', c.ink), '3dz2': labelSprite('3d', c.ink),
  };
  const LPOS = { '1s': [0, 2.0, 0], '2s': [0, 8.6, 0], '2px': [9.2, 0, 0], '2py': [0, 9.2, 0], '2pz': [0, 0, 9.2], '3dz2': [0, 15, 0] };
  for (const [k, s] of Object.entries(labels)) { s.position.set(...LPOS[k].map((v) => v * S)); kit.root.add(s); s.visible = false; }

  // --- Bohr rings, as usually drawn (flat circles with electrons as dots)
  const bohr = new Group(); kit.root.add(bohr);
  const ringMat = new LineBasicMaterial({ color: new Color(c.muted), transparent: true, opacity: 0.8 });
  const ring = (rad) => { const pts = []; for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2; pts.push(Math.cos(a) * rad, Math.sin(a) * rad, 0); } const g = new BufferGeometry(); g.setAttribute('position', new Float32BufferAttribute(pts, 3)); return new LineLoop(g, ringMat); };
  const R1 = 2.6, R2 = 6.2;
  bohr.add(ring(R1), ring(R2));
  const dotGeo = new SphereGeometry(0.3, 16, 12), dotMat = new MeshStandardMaterial({ color: new Color(c.electron), roughness: 0.5 });
  const dots = [];
  for (let i = 0; i < 2; i++) { const m = new Mesh(dotGeo, dotMat); bohr.add(m); dots.push({ m, r: R1, a: i * Math.PI, w: 0.9 }); }
  for (let i = 0; i < 8; i++) { const m = new Mesh(dotGeo, dotMat); bohr.add(m); dots.push({ m, r: R2, a: i * Math.PI / 4, w: 0.45 }); }
  const placeDots = () => { for (const d of dots) d.m.position.set(Math.cos(d.a) * d.r, Math.sin(d.a) * d.r, 0); };
  placeDots();

  const ORDER = ['1s', '2s', '2p', '3d'];
  let mode = 1, which = 0, cut = false;
  function show() {
    bohr.visible = mode === 0;
    const on = new Set();
    if (mode === 1) {
      const w = ORDER[which];
      if (w === '2p') on.add('2px').add('2py').add('2pz'); else if (w === '3d') on.add('3dz2'); else on.add(w);
    } else if (mode === 2) ['1s', '2s', '2px', '2py', '2pz'].forEach((k) => on.add(k));
    for (const k of Object.keys(clouds)) {
      clouds[k].visible = on.has(k) && !cut;
      sliceGroup[k].visible = on.has(k) && cut;
      labels[k].visible = on.has(k) && (mode === 1 || k === '1s' || k === '2s' || k === '2pz');
    }
    if (mode === 2) { labels['2pz'].visible = true; }
    const z = mode === 0 ? 22 : mode === 2 ? 30 : { '1s': 10, '2s': 30, '2p': 30, '3d': 46 }[ORDER[which]];
    kit.camera.position.set(0, 0, z); kit.camera.updateProjectionMatrix();
    kit.dirty = true; kit.render();
    btnNext.hidden = mode !== 1; btnCut.hidden = mode === 0;
    if (mode === 0) {
      say('This is how atoms are usually drawn: stationary count tokens grouped on circles. It is a useful way to <b>count</b> electrons (2 in the first shell, 8 in the second), but it is not what electrons do. Switch to <b>Hydrogen-like density model</b>.');
    } else if (mode === 1) {
      const w = ORDER[which];
      const txt = {
        '1s': '<b>1s</b>: the first and smallest seat. The dots show points sampled from a hydrogen-like probability density, not electrons or acquired positions: thickest near the nucleus, fading outwards. There is no edge and no track. <b>Each cloud holds at most 2 electrons.</b>',
        '2s': '<b>2s</b>: round like 1s but about four times as wide, with a thin hollow layer inside where the electron is never found (try <b>Cut in half</b>). It is the first seat of the second shell. <b>At most 2 electrons.</b>',
        '2p': '<b>2p</b>: three dumbbells at right angles, one along each direction (left–right, up–down, front–back). Three clouds × 2 electrons = 6 seats. With 2s that makes the <b>8</b> of the second shell, and the 8 columns of the short rows of the periodic table.',
        '3d': '<b>3d</b> (one of five): from the third shell on, more complicated shapes appear. Five d clouds × 2 = 10 seats: the 10 columns of the transition metals in the middle of the periodic table.',
      }[w];
      say(txt + (cut ? ' <i>Showing a thin slice through the middle.</i>' : ''));
    } else {
      say('<b>Neon</b>, element 10: 2 electrons in 1s, 2 in 2s, and 2 in each of the three 2p clouds. 2 + 2 + 6 = 10, every seat in the first two shells taken. A full set like this is very hard to disturb, which helps explain neon’s low chemical reactivity under ordinary conditions. (Sizes are hydrogen-like: in real neon, 10 protons pull every cloud in much tighter.)');
    }
  }
  api.tabs(['Counting groups', 'Hydrogen-like density model', 'Neon occupancy schematic'], (i) => { mode = i; cut = false; btnCut.setAttribute('aria-pressed', 'false'); show(); }, 1);
  const btnNext = api.button('Next cloud', () => { which = (which + 1) % ORDER.length; show(); });
  const btnCut = api.button('Cut in half', (b) => { cut = !cut; b.setAttribute('aria-pressed', String(cut)); show(); }, { pressed: false });
  // Counting tokens remain stationary: rings never depict electron trajectories.
  kit.root.rotation.set(0.35, -0.5, 0);
  show();
  return {};
}, { three: true, label: 'See the electron clouds in 3D' });
