// "The periodic table, inside out": tabs on the periodic-table page.
//   Discovered  the existing timeline (m_ptable.js)
//   Explore     lenses that recolour the table: families, blocks, state, metals, size, grip, density, melting, origin
//   Build it    add electrons one at a time and watch the rows fill: 2, 8, 8, 18...
//   Practise    retrieval practice with spaced repetition: flashcards, put it back, first twenty, which family
import App from './core.js';
import { notesBlock } from './element_notes.js';
import ELEMENTS from './ptable_data.js';
import { PROPS, ORIGIN, ORIGINS, PROPERTY_NOTES } from './atlas_data.js';

const { el, store } = App;
const E = ELEMENTS.map((e, i) => {
  const [, st, cls, rad, en, den, mp] = PROPS[i];
  return { ...e, st, cls, rad, en, den, mp, origin: ORIGIN[i] };
});
const byZ = z => E[z - 1];

// ------------------------------------------------------------------ families and blocks (from table position)
function groupOf(e) {           // 1-18, or 0 for the f-block row
  if (e.row >= 9) return 0;
  return e.col;
}
const FAMILIES = {
  h: { name: 'Hydrogen, a family of its own', short: 'Hydrogen', note: 'It sits over group 1 because it has one electron, but it is a gas that behaves like no other element.' },
  g1: { name: 'Alkali metals (group 1)', short: 'Alkali metals', note: 'Soft, shiny metals with one outer electron, which they give away so easily that they fizz in water.' },
  g2: { name: 'Alkaline earth metals (group 2)', short: 'Alkaline earth metals', note: 'Two outer electrons; calmer than group 1, and found in rocks, bones and shells.' },
  tm: { name: 'Transition metals (groups 3 to 12)', short: 'Transition metals', note: 'The everyday metals: iron, copper, silver, gold. Strong, often colourful in their compounds, and great at helping reactions along.' },
  ln: { name: 'Lanthanides', short: 'Lanthanides', note: 'Fifteen look-alike metals, once called “rare earths”, now inside every phone, magnet and LED.' },
  an: { name: 'Actinides', short: 'Actinides', note: 'All radioactive. Thorium and uranium occur naturally in substantial amounts; several other members occur in traces. Many heavier members are chiefly synthesized in laboratories and reactors.' },
  g13: { name: 'Boron group (group 13)', short: 'Boron group', note: 'Three outer electrons: boron, aluminium, gallium, indium, thallium.' },
  g14: { name: 'Carbon group (group 14)', short: 'Carbon group', note: 'Four outer electrons: carbon, the backbone of life; silicon, the heart of computer chips; then tin and lead.' },
  g15: { name: 'Nitrogen group (group 15)', short: 'Nitrogen group', note: 'Five outer electrons: nitrogen and phosphorus, both vital for living things.' },
  g16: { name: 'Oxygen group (group 16)', short: 'Oxygen group', note: 'Six outer electrons: oxygen and sulfur, which grab two electrons when they can.' },
  g17: { name: 'Halogens (group 17)', short: 'Halogens', note: 'One electron short of a full shell, so they snatch electrons fiercely. Their name means “salt-makers”.' },
  g18: { name: 'Noble gases (group 18)', short: 'Noble gases', note: 'Full shells, so they hardly react at all. They glow in coloured lights.' },
};
function familyOf(e) {
  if (e.z === 1) return 'h';
  if (e.row === 9) return 'ln';
  if (e.row === 10) return 'an';
  const g = groupOf(e);
  if (g === 1) return 'g1';
  if (g === 2) return 'g2';
  if (g >= 3 && g <= 12) return 'tm';
  return 'g' + g;
}
function blockOf(e) {
  if (e.z === 2) return 's';
  if (e.row >= 9) return 'f';
  const g = groupOf(e);
  if (g <= 2) return 's';
  if (g <= 12) return 'd';
  return 'p';
}
const BLOCK_NAMES = { s: 's-block: filling an s-orbital (2 places)', p: 'p-block: filling p-orbitals (6 places)', d: 'd-block: filling d-orbitals (10 places)', f: 'f-block: filling f-orbitals (14 places)' };

// ------------------------------------------------------------------ plain-words formatting
const C = k => Math.round(k - 273.15);
const fmt = n => n.toLocaleString('en-GB');
function stateWords(e) {
  if (e.st === '?') return 'Nobody knows: only a few atoms have ever existed at once.';
  if (e.z === 31) return 'Solid, but it melts at about 30 °C: it would melt in your hand, or on a hot day in Mumbai.';
  if (e.z === 55) return 'Solid, but it melts at about 28 °C, so on a warm day it is a liquid.';
  return { s: 'Solid', l: 'Liquid', g: 'Gas' }[e.st] + ' at room temperature (25 °C).';
}
function classWords(e) {
  return {
    M: 'A metal', D: 'A metalloid: partly like a metal, partly not', N: 'A non-metal',
    'M?': 'Probably a metal, but never made in enough quantity to test', 'D?': 'Probably a metalloid; too rare and radioactive to test properly',
  }[e.cls] + (e.z === 84 ? ' (some books call polonium a metalloid)' : '') + '.';
}
function radWords(e) {
  if (e.rad == null) return 'No covalent-radius value is supplied in this reference set.';
  const h = e.rad / 32;
  return `Reference single-bond covalent radius: ${e.rad} picometres (a picometre is a millionth of a millionth of a metre). A radius is a size parameter, not a diameter or a sharp atomic edge` +
    (e.z === 1 ? '; the smallest radius in this set.' : `; about ${h >= 1.95 ? h.toFixed(0) : h.toFixed(1)} times hydrogen’s radius.`) +
    (e.z === 2 || e.z === 10 ? ' (Helium and neon form no ordinary bonds, so this is a calculated value.)' : '');
}
function enWords(e) {
  if (PROPERTY_NOTES[e.z]?.en) return PROPERTY_NOTES[e.z].en;
  if (e.en == null) return [2, 10, 18, 86].includes(e.z) ? 'No value: it forms no ordinary bonds, so there is nothing to measure.' : 'Unknown: never measured.';
  const how = e.en < 1.2 ? 'gives its electrons away very easily' : e.en < 1.8 ? 'lets electrons go fairly easily' : e.en < 2.4 ? 'holds its electrons moderately' : e.en < 3 ? 'pulls quite hard on electrons' : 'pulls on electrons harder than almost anything';
  return `${e.en.toFixed(2)} on Pauling’s scale (0.7 to 4): it ${how}.`;
}
function denWords(e) {
  if (PROPERTY_NOTES[e.z]?.density) return `${e.den} g/cm³. ${PROPERTY_NOTES[e.z].density}`;
  if (e.den == null) return 'Unknown: never measured.';
  if (e.st === 'g') {
    const gl = e.den * 1000, r = gl / 1.29;
    return `A gas: about ${gl < 1 ? gl.toFixed(2) : gl.toFixed(1)} grams per litre, ${r < 1 ? `about ${(1 / r).toFixed(r < 0.2 ? 0 : 1)} times lighter` : `about ${r.toFixed(1)} times heavier`} than air.`;
  }
  const t = e.den < 1 ? `lighter than water: it would float` : `about ${e.den < 10 ? e.den.toFixed(1) : Math.round(e.den)} times as dense as water`;
  return `${e.den.toFixed(e.den < 10 ? 2 : 1)} g per cm³: ${t}${e.z === 6 ? ' (graphite; diamond is 3.5)' : ''}.`;
}
function mpWords(e) {
  if (PROPERTY_NOTES[e.z]?.mp) return PROPERTY_NOTES[e.z].mp;
  if (e.z === 2) return 'Never freezes at ordinary pressure, even near absolute zero.';
  if (e.z === 6) return 'Does not melt at ordinary pressure: above roughly 3,600 °C it turns straight into a gas.';
  if (e.z === 33) return 'Does not melt at ordinary pressure: at 615 °C it turns straight into a gas.';
  if (e.mp == null) return 'Unknown: never measured.';
  const c = C(e.mp);
  return `${fmt(c)} °C${c < 0 ? ' (below freezing)' : c < 40 ? ' (close to room temperature)' : c > 3000 ? ' (among the hardest to melt of all)' : ''}.`;
}
function originWords(e) {
  const [a, ...rest] = e.origin;
  if (a === 'HM') return 'Made by people in laboratories and nuclear reactors; none survives in nature.';
  if (a === 'RD') return 'No long-lived atoms: any that stars made have long since decayed. Traces form on Earth as uranium and thorium decay' + ([43, 61].includes(e.z) ? ', and people make it in reactors.' : '.');
  return `Mostly from ${ORIGINS[a].toLowerCase()}` + (rest.length ? `, with a share from ${rest.map(r => ORIGINS[r].toLowerCase()).join(' and ')}` : '') + '.';
}

// ------------------------------------------------------------------ lenses
const pct = (v, lo, hi) => Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
const LENSES = [
  { id: 'family', label: 'Families', kind: 'cat', cat: e => familyOf(e),
    cats: Object.fromEntries(Object.entries(FAMILIES).map(([k, f]) => [k, f.short])),
    what: 'Each column is a family: elements with the same number of outer electrons, which behave alike.',
    notice: 'Find the halogens and the noble gases side by side. One is a single electron short of a full shell; the other has it. One is fierce, the other hardly reacts.' },
  { id: 'block', label: 'Blocks', kind: 'cat', cat: e => blockOf(e), cats: { s: 's-block', p: 'p-block', d: 'd-block', f: 'f-block' },
    what: 'The table is four blocks glued together, one for each kind of orbital the newest electron goes into.',
    notice: 'Count the columns: 2, 6, 10 and 14. Those are exactly how many electrons each kind of orbital holds. Try “Build it” to watch it happen.' },
  { id: 'state', label: 'Solid, liquid or gas', kind: 'cat', cat: e => e.st, cats: { s: 'Solid', l: 'Liquid', g: 'Gas', '?': 'Unknown' },
    what: 'What each element is like at room temperature, 25 °C.',
    notice: 'Only two are liquids: mercury and bromine. The gases huddle at the top right. (Gallium and caesium melt on a hot day.)' },
  { id: 'metal', label: 'Metal or not', kind: 'cat', cat: e => e.cls.replace('?', ''), cats: { M: 'Metal', D: 'Metalloid', N: 'Non-metal' },
    what: 'Metals are shiny and conduct electricity; non-metals mostly don’t; metalloids sit in between.',
    notice: 'Over three quarters of the elements are metals. A staircase of metalloids divides them from the non-metals.' },
  { id: 'size', label: 'Atom size', kind: 'seq', val: e => e.rad, lo: 30, hi: 240, unit: 'pm', lowLabel: 'small', highLabel: 'large',
    what: 'How far each atom reaches when it bonds (covalent radius).',
    notice: 'Atoms shrink as you go right along a row (more protons pull harder) and grow as you go down a column (more shells). Chapter 9 explains why.' },
  { id: 'grip', label: 'Grip on electrons', kind: 'seq', val: e => e.en, lo: 0.7, hi: 4, lowLabel: 'loose grip', highLabel: 'strong grip',
    what: 'Electronegativity: how strongly an atom pulls on the electrons it shares in a bond.',
    notice: 'The strongest grip is at the top right (fluorine, oxygen); the weakest at the bottom left (caesium). That is why sodium and chlorine swap an electron so readily.' },
  { id: 'density', label: 'Density', kind: 'seq', val: e => e.den, log: true, lo: Math.log10(0.00009), hi: Math.log10(23), lowLabel: 'light', highLabel: 'heavy',
    what: 'How heavy a fixed volume of each element is (gases are thousands of times lighter, so the scale is stretched).',
    notice: 'The heaviest elements, osmium and iridium, sit in the middle of row 6. Lithium, sodium and potassium are so light they would float on water.' },
  { id: 'melt', label: 'Melting point', kind: 'seq', val: e => e.mp, lo: 0, hi: 3700, lowLabel: 'melts cold', highLabel: 'melts hot',
    what: 'Reference solid-to-liquid transition temperatures. Carbon and arsenic sublime at ordinary pressure, so no melting value is coloured here; helium also has no normal melting point at 1 atm.',
    notice: 'Tungsten, in the middle of the table, holds the record among metals: 3,422 °C, which is why it glowed inside old light bulbs. Missing values are not zero.' },
  { id: 'origin', label: 'Where it came from', kind: 'cat', cat: e => e.origin[0], cats: ORIGINS,
    what: 'Where the atoms in our Solar System were mostly made (simplified from astronomer Jennifer Johnson’s 2019 table).',
    notice: 'Hydrogen comes from the Big Bang, so the water in your body is almost 14 billion years old. The gold in a ring was probably made when two dead stars collided.' },
];
const CAT_COLORS = {
  family: { h: 'var(--muted)', g1: 'var(--proton)', g2: 'var(--neutron)', tm: 'var(--electron)', ln: 'color-mix(in oklab, var(--green) 60%, var(--electron))', an: 'color-mix(in oklab, var(--proton) 55%, var(--muted))', g13: 'color-mix(in oklab, var(--neutron) 55%, var(--muted))', g14: 'var(--ink-2)', g15: 'color-mix(in oklab, var(--green) 70%, var(--neutron))', g16: 'color-mix(in oklab, var(--proton) 60%, var(--neutron))', g17: 'var(--green)', g18: 'color-mix(in oklab, var(--electron) 55%, var(--proton))' },
  block: { s: 'var(--proton)', p: 'var(--green)', d: 'var(--electron)', f: 'var(--neutron)' },
  state: { s: 'var(--ink-2)', l: 'var(--electron)', g: 'var(--proton)', '?': 'var(--rule)' },
  metal: { M: 'var(--electron)', D: 'var(--neutron)', N: 'var(--green)' },
  origin: { BB: 'var(--ink-2)', CR: 'var(--green)', LM: 'var(--neutron)', MS: 'var(--proton)', WD: 'color-mix(in oklab, var(--electron) 50%, var(--proton))', NS: 'var(--electron)', RD: 'var(--muted)', HM: 'var(--rule)' },
};

// ------------------------------------------------------------------ a reusable table grid
function makeGrid(label, onPick) {
  const grid = el('div', { class: 'at-grid', role: 'group', 'aria-label': label });
  const tiles = new Map();
  for (const e of E) {
    const t = el('button', { type: 'button', class: 'at-el', style: `grid-row:${e.row};grid-column:${e.col}`, tabindex: '-1', 'data-z': e.z,
      onclick: () => onPick && onPick(e, t) }, el('span', { class: 'z' }, e.z), el('span', { class: 's' }, e.symbol), el('span', { class: 'v' }));
    tiles.set(e.z, t); grid.append(t);
  }
  grid.append(el('span', { class: 'at-fmark', style: 'grid-row:6;grid-column:3', 'aria-hidden': 'true' }, '57–71'),
    el('span', { class: 'at-fmark', style: 'grid-row:7;grid-column:3', 'aria-hidden': 'true' }, '89–103'));
  tiles.get(1).tabIndex = 0;
  grid.addEventListener('keydown', ev => {
    const cur = ev.target.closest('.at-el'); if (!cur) return;
    const e = byZ(+cur.dataset.z);
    const dir = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[ev.key];
    if (!dir) return;
    ev.preventDefault();
    let best = null, bestD = Infinity;
    for (const o of E) {
      const t = tiles.get(o.z); if (t.disabled || t.hidden) continue;
      const dr = o.row - e.row, dc = o.col - e.col;
      if (dir[0] && Math.sign(dr) !== dir[0]) continue;
      if (dir[1] && (Math.sign(dc) !== dir[1] || dr !== 0)) continue;
      const d = dir[0] ? Math.abs(dr) * 100 + Math.abs(dc) : Math.abs(dc);
      if (d < bestD) { bestD = d; best = o; }
    }
    if (best) { cur.tabIndex = -1; const n = tiles.get(best.z); n.tabIndex = 0; n.focus(); }
  });
  return { grid, tiles, wrap: el('div', { class: 'at-scroll' }, grid) };
}

// ------------------------------------------------------------------ Explore
function explorePanel(stories) {
  let lens = store.get('atlas:lens', 'family');
  if (!LENSES.find(l => l.id === lens)) lens = 'family';
  let picked = null;
  const card = el('div', { class: 'at-card', hidden: true, 'aria-live': 'polite' });
  const { grid, tiles, wrap } = makeGrid('Periodic table: choose an element to see all its facts', (e, t) => pick(e));
  const lensBar = el('div', { class: 'at-lenses', role: 'radiogroup', 'aria-label': 'Colour the table by' });
  const what = el('p', { class: 'at-what' });
  const notice = el('p', { class: 'at-notice' });
  const legend = el('div', { class: 'at-legend' });
  LENSES.forEach(l => lensBar.append(el('button', { type: 'button', role: 'radio', class: 'at-lens', 'data-lens': l.id, onclick: () => setLens(l.id) }, l.label)));
  lensBar.addEventListener('keydown', ev => {
    const i = LENSES.findIndex(l => l.id === lens);
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key]; if (!d) return;
    ev.preventDefault(); setLens(LENSES[(i + d + LENSES.length) % LENSES.length].id);
    lensBar.querySelector(`[data-lens="${lens}"]`).focus();
  });

  function colourFor(L, e) {
    if (L.kind === 'cat') { const c = L.cat(e); return { c, col: CAT_COLORS[L.id][c] || 'var(--rule)' }; }
    let v = L.val(e); if (v == null) return { c: null, col: null };
    const t = pct(L.log ? Math.log10(v) : v, L.lo, L.hi);
    return { c: t, col: `color-mix(in oklab, var(--at-hi) ${Math.round(t * 100)}%, var(--at-lo))` };
  }
  function setLens(id) {
    lens = id; store.set('atlas:lens', id);
    const L = LENSES.find(l => l.id === id);
    lensBar.querySelectorAll('.at-lens').forEach(b => { const on = b.dataset.lens === id; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    what.textContent = L.what; notice.replaceChildren(el('b', {}, 'Notice the pattern: '), L.notice);
    for (const e of E) {
      const t = tiles.get(e.z), { c, col } = colourFor(L, e);
      t.classList.toggle('unk', col == null || c === '?');
      t.style.setProperty('--c', col || 'transparent');
      t.classList.toggle('seq', L.kind === 'seq');
      t.style.setProperty('--t', L.kind === 'seq' && c != null ? c : 0);
      const v = t.querySelector('.v');
      v.textContent = L.kind === 'seq' && L.val(e) != null ? (L.id === 'melt' ? (e.z === 6 ? '≈3600°' : e.z === 33 ? '615°' : C(e.mp) + '°') : L.id === 'density' ? (e.den < 0.1 ? 'gas' : e.den.toFixed(e.den < 10 ? 1 : 0)) : L.id === 'grip' ? e.en.toFixed(1) : e.rad) : '';
      t.setAttribute('aria-label', `${e.name}: ` + (L.kind === 'cat' ? (L.cats[c] || 'unknown') : v.textContent ? v.textContent + (L.unit ? ' ' + L.unit : '') : 'unknown'));
    }
    if (L.kind === 'cat') {
      const used = new Set(E.map(e => L.cat(e)));
      legend.replaceChildren(el('ul', { class: 'at-cats' }, Object.entries(L.cats).filter(([k]) => used.has(k)).map(([k, name]) =>
        el('li', { style: `--c:${CAT_COLORS[L.id][k] || 'var(--rule)'}` }, el('i', { 'aria-hidden': 'true' }), name))));
    } else {
      legend.replaceChildren(el('div', { class: 'at-ramp' }, el('span', {}, L.lowLabel), el('i', { 'aria-hidden': 'true' }), el('span', {}, L.highLabel),
        el('span', { class: 'at-unk' }, el('i', { 'aria-hidden': 'true' }), 'unknown')));
    }
    if (picked) pick(picked, false);
  }
  function pick(e, scroll = true) {
    if (picked) tiles.get(picked.z).classList.remove('sel');
    picked = e; tiles.get(e.z).classList.add('sel');
    const fam = FAMILIES[familyOf(e)], st = e.story && stories[e.story];
    const row = (k, v) => el('div', { class: 'at-row' }, el('dt', {}, k), el('dd', {}, v));
    card.replaceChildren(
      el('div', { class: 'at-card-tile', 'aria-hidden': 'true' }, el('span', { class: 'z' }, e.z), el('span', { class: 's' }, e.symbol)),
      el('div', { class: 'at-card-body' },
        el('h3', {}, e.name, el('span', {}, ` · element ${e.z}`)),
        el('dl', {},
          row('Family', `${fam.name}. ${fam.note}`),
          row('Block', BLOCK_NAMES[blockOf(e)] + '.'),
          row('At room temperature', stateWords(e)),
          row('Metal?', classWords(e)),
          row('Size', radWords(e)),
          row('Grip on electrons', enWords(e)),
          row('Density', denWords(e)),
          row('Melting point', mpWords(e)),
          row('Where its atoms came from', originWords(e)),
          row('Discovered', e.ancient ? 'Known since ancient times.' : `${e.label === String(e.year) ? e.year : e.label}: ${e.who}.`)),
        st ? el('p', { class: 'at-card-st' }, el('a', { class: 'sl', href: `#story-${st.id}`, 'data-story': st.id }, `Read the story: ${st.title}`)) : null,
        notesBlock(e.z, el)),
      el('button', { type: 'button', class: 'at-x', 'aria-label': 'Close', onclick: () => { card.hidden = true; tiles.get(e.z).classList.remove('sel'); const t = tiles.get(e.z); picked = null; t.focus(); } }, '×'));
    card.hidden = false;
    if (scroll) card.scrollIntoView({ block: 'nearest', behavior: App.reduceMotion() ? 'auto' : 'smooth' });
  }
  const panel = el('div', { class: 'at-explore full' }, el('div', { class: 'at-lensbar' }, lensBar), what, wrap, legend, notice, card);
  setLens(lens);
  return panel;
}

// ------------------------------------------------------------------ Build it
const SUBSHELLS = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6], ['5s', 2], ['4d', 10], ['5p', 6],
  ['6s', 2], ['4f', 14], ['5d', 10], ['6p', 6], ['7s', 2], ['5f', 14], ['6d', 10], ['7p', 6]];
const ROW_END = { 2: 1, 10: 2, 18: 3, 36: 4, 54: 5, 86: 6, 118: 7 };
function buildPanel() {
  let n = store.get('atlas:build', 0);
  let timer = null;
  const { grid, tiles, wrap } = makeGrid('The table so far');
  const count = el('p', { class: 'at-bcount' });
  const msg = el('p', { class: 'at-bmsg', 'aria-live': 'polite' });
  const shells = el('div', { class: 'at-shells', 'aria-hidden': 'true' });
  const sub = SUBSHELLS.map(([name, cap]) => {
    const boxes = Array.from({ length: cap }, () => el('i'));
    const s = el('div', { class: `at-sub b-${name[1]}` }, el('span', {}, name), el('b', {}, boxes));
    shells.append(s); return { name, cap, boxes, s };
  });
  const btn = (label, f, cls = '') => el('button', { type: 'button', class: 'at-btn ' + cls, onclick: f }, label);
  const playB = btn('Play', () => (timer ? stop() : play()));
  const ctl = el('div', { class: 'at-bctl' },
    btn('Add an electron', () => { stop(); set(n + 1); }, 'primary'), btn('Take one away', () => { stop(); set(n - 1); }),
    btn('Fill the row', () => { stop(); const end = Object.keys(ROW_END).map(Number).find(z => z > n) || 118; set(end); }), playB,
    btn('Start again', () => { stop(); set(0); }, 'quiet'));
  function where(z) {           // which subshell the z-th electron goes into (in simple filling order)
    let k = z;
    for (const s of sub) { if (k <= s.cap) return [s, k]; k -= s.cap; }
    return [sub[sub.length - 1], 0];
  }
  function set(v) {
    n = Math.max(0, Math.min(118, v)); store.set('atlas:build', n);
    for (const e of E) {
      const t = tiles.get(e.z), on = e.z <= n;
      t.classList.toggle('ghost', !on); t.classList.toggle('now', e.z === n);
      t.dataset.b = blockOf(e);
      t.setAttribute('aria-label', on ? `${e.name}, ${blockOf(e)}-block` : `${e.name}, not built yet`);
    }
    let left = n;
    sub.forEach(s => { const f = Math.max(0, Math.min(s.cap, left)); left -= f; s.boxes.forEach((b, i) => b.classList.toggle('on', i < f)); s.s.classList.remove('active'); s.s.classList.toggle('used', f > 0); });
    const e = n ? byZ(n) : null;
    count.textContent = n ? `${n} electron${n > 1 ? 's' : ''}: ${e.name} (${e.symbol})` : 'No electrons yet. Add the first one.';
    if (!n) { msg.textContent = 'Each new element has one more proton and one more electron than the one before. Watch where each new electron goes, and the shape of the table appears by itself.'; return; }
    const [s, k] = where(n);
    s.s.classList.add('active');
    let m = `The new electron goes into ${s.name} (place ${k} of ${s.cap}), so ${e.name} sits in the ${blockOf(e)}-block.`;
    if (ROW_END[n]) {
      const lens = { 1: 2, 2: 8, 3: 8, 4: 18, 5: 18, 6: 32, 7: 32 }[ROW_END[n]];
      m = `${e.name} completes row ${ROW_END[n]}: ${lens} elements long. A full set of outer orbitals makes a noble gas, and the next electron has to start a new shell.`;
    } else if (n === 21) m = 'Scandium: the new electron skips back into 3d. A whole new block of ten opens up in the middle: the transition metals. That is why row 4 is 18 long, not 8.';
    else if (n === 19) m = 'Potassium starts row 4. Its newest electron goes into 4s, which fills before 3d. (Why? In atoms this size the 4s orbital is the cheaper place for the next electron.)';
    else if (n === 57) m = 'Lanthanum: now the 4f orbitals start to fill, fourteen places. Those fourteen elements are so wide that tables print them as a separate strip below.';
    else if (n === 24 || n === 29) m += ' (Honest note: in real chromium and copper atoms one 4s electron moves into 3d, because a half-full or full 3d is especially comfortable. The simple filling order is a very good guide, not a perfect law.)';
    msg.textContent = m;
  }
  function play() {
    if (n >= 118) set(0);
    playB.textContent = 'Pause';
    timer = setInterval(() => { if (n >= 118) return stop(); set(n + 1); }, App.reduceMotion() ? 900 : 380);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; playB.textContent = 'Play'; }
  const panel = el('div', { class: 'at-build full' },
    el('p', { class: 'at-what' }, 'Why is the table this strange shape, with rows of 2, 8, 8, 18, 18 and 32? Build it yourself: add electrons one at a time and see where each one has to go.'),
    ctl, count, wrap, el('div', { class: 'at-shellbox' }, el('p', { class: 'at-shell-h' }, 'Orbitals, in the order they fill'), shells), msg,
    el('p', { class: 'at-note' }, 'The filling order here (1s, 2s, 2p, 3s, 3p, 4s, 3d …) is the simple rule that explains the table’s shape. Real atoms break it in a few places, and chemists still argue about exactly where lanthanum, lutetium, actinium and lawrencium belong.'));
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(x => { if (!x.isIntersecting) stop(); })).observe(panel);
  set(n);
  return { panel, stop };
}

// ------------------------------------------------------------------ Practise (spaced repetition)
const INTERVALS = [0, 1, 2, 4, 8, 16];          // days until the next review, by box
const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
const LEVELS = {
  first20: { label: 'The first 20', zs: E.slice(0, 20).map(e => e.z) },
  families: { label: 'The famous families', zs: [3, 11, 19, 37, 55, 4, 12, 20, 38, 56, 9, 17, 35, 53, 2, 10, 18, 36, 54, 86, 26, 29, 30, 47, 79, 80, 82, 50, 28, 6, 7, 8, 14, 15, 16, 13, 22, 24, 78, 92] },
  all: { label: 'The whole table', zs: E.map(e => e.z) },
};
const LATIN = { Na: 'natrium', K: 'kalium', Fe: 'ferrum', Cu: 'cuprum', Ag: 'argentum', Sn: 'stannum', Sb: 'stibium', Au: 'aurum', Hg: 'hydrargyrum, “liquid silver”', Pb: 'plumbum', W: 'wolfram' };
const ALT = { aluminium: ['aluminum'], sulfur: ['sulphur'], caesium: ['cesium'] };

function practisePanel() {
  const S = () => store.get('atlas:srs', { name: {}, place: {}, fam: {} });
  let level = store.get('atlas:level', 'first20');
  const day = () => { const d = store.get('atlas:day', { d: 0, n: 0 }); return d.d === today() ? d : { d: today(), n: 0 }; };
  const GOAL = 10;
  const body = el('div', { class: 'at-pbody' });
  const status = el('div', { class: 'at-pstatus' });
  const mapWrap = el('div', { class: 'at-pmap' });
  const map = makeGrid('Elements you know');
  map.grid.classList.add('mini');
  mapWrap.append(el('p', { class: 'at-shell-h' }, 'Your table: each element fills in as you learn it'), map.wrap);

  function record(skill, z, ok) {
    const s = S(); const r = s[skill][z] || [0, 0];
    let box = ok ? Math.min(5, r[0] + 1) : 1;
    s[skill][z] = [box, today() + (ok ? INTERVALS[box] : 0)];
    store.set('atlas:srs', s);
    if (ok) { const d = day(); d.n++; store.set('atlas:day', d); }
    refresh();
  }
  function pickItems(skill, k = 8) {
    const s = S()[skill], zs = LEVELS[level].zs.filter(z => skill !== 'fam' || z !== 1);
    const due = zs.filter(z => s[z] && s[z][1] <= today()).sort((a, b) => s[a][0] - s[b][0]);
    const fresh = zs.filter(z => !s[z]);
    const later = zs.filter(z => s[z] && s[z][1] > today()).sort((a, b) => s[a][1] - s[b][1]);
    const pool = [...due, ...fresh, ...later].slice(0, k);
    return shuffle(pool);
  }
  function refresh() {
    const s = S().name, d = day();
    const known = Object.entries(s).filter(([, r]) => r[0] >= 3).length;
    status.replaceChildren(...[
      el('span', { class: 'at-goal', style: `--p:${Math.min(1, d.n / GOAL)}` }, el('i', { 'aria-hidden': 'true' }), `Today: ${Math.min(d.n, GOAL)} of ${GOAL}`),
      el('span', {}, `Names you know well: ${known} of 118`),
      !store.available ? el('span', { class: 'at-warn' }, 'This browser won’t save your progress, so it lasts only while the page is open.') : null].filter(Boolean));
    for (const e of E) {
      const r = s[e.z], b = r ? r[0] : 0;
      const t = map.tiles.get(e.z);
      t.dataset.box = b; t.tabIndex = -1;
      t.setAttribute('aria-label', `${e.name}: ${b >= 3 ? 'known well' : b ? 'learning' : 'not practised yet'}`);
    }
  }

  const levelSel = el('div', { class: 'at-levels', role: 'radiogroup', 'aria-label': 'Which elements' },
    Object.entries(LEVELS).map(([k, L]) => el('button', { type: 'button', role: 'radio', class: 'at-lens', 'data-l': k, onclick: () => { level = k; store.set('atlas:level', k); markLevel(); home(); } }, L.label)));
  function markLevel() { levelSel.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', b.dataset.l === level)); }

  const GAMES = [
    ['cards', 'Flashcards', 'See a symbol, recall the name (or the other way round).'],
    ['place', 'Put it back', 'Find where each element lives on an empty table.'],
    ['seq', 'First 20 in order', 'Tap the first twenty elements in order, H to Ca.'],
    ['fam', 'Which family?', 'Sort elements into their families.'],
  ];
  function home() {
    body.replaceChildren(el('div', { class: 'at-games' }, GAMES.map(([id, t, d]) =>
      el('button', { type: 'button', class: 'at-game', onclick: () => start(id) }, el('b', {}, t), el('span', {}, d)))),
    el('p', { class: 'at-note' }, 'How this works: trying to remember something, even when you get it wrong, fixes it in memory far better than reading it again. Elements you get right come back after longer and longer gaps (1, 2, 4, 8, 16 days); ones you miss come back soon. Ten a day is plenty. Understanding helps too: once you know the families, half the table remembers itself.'));
  }
  function start(id) { ({ cards, place, seq, fam })[id](); }
  const back = () => el('button', { type: 'button', class: 'at-btn quiet', onclick: home }, '← All games');

  function cards() {
    let dir = store.get('atlas:dir', 'sym');      // 'sym': show symbol, recall name
    let typing = store.get('atlas:typing', false);
    const items = pickItems('name');
    let i = 0, right = 0;
    const stage = el('div', { class: 'at-stage' });
    const opts = el('div', { class: 'at-opts' });
    function show() {
      if (i >= items.length) return done(`You tried ${items.length} and got ${right}. The ones you missed will come back soon.`);
      const e = byZ(items[i]);
      const prompt = dir === 'sym' ? e.symbol : e.name, want = dir === 'sym' ? e.name : e.symbol;
      const fb = el('p', { class: 'at-fb', 'aria-live': 'polite' });
      const answer = ok => {
        record('name', e.z, ok); if (ok) right++;
        const extra = LATIN[e.symbol] ? ` Its symbol comes from the Latin ${LATIN[e.symbol]}.` : '';
        fb.replaceChildren(el('b', {}, ok ? 'Yes. ' : `It’s ${want}. `), `${e.symbol} is ${e.name}, element ${e.z}.${extra} ${e.how}`);
        fb.className = 'at-fb ' + (ok ? 'ok' : 'no');
        stage.querySelectorAll('.at-opt, input, .at-check').forEach(x => (x.disabled = true));
        stage.append(el('button', { type: 'button', class: 'at-btn primary', onclick: () => { i++; show(); } }, i + 1 < items.length ? 'Next' : 'Finish'));
        stage.querySelector('.at-btn.primary:last-child').focus();
      };
      let input;
      if (typing) {
        input = el('input', { type: 'text', class: 'at-input', 'aria-label': dir === 'sym' ? 'Element name' : 'Symbol', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
          onkeydown: ev => { if (ev.key === 'Enter') check(); } });
        const check = () => {
          const v = input.value.trim().toLowerCase(); if (!v) return;
          const ok = dir === 'sym' ? (v === e.name.toLowerCase() || (ALT[e.name.toLowerCase()] || []).includes(v)) : v === e.symbol.toLowerCase() && input.value.trim() === e.symbol;
          answer(ok);
        };
        opts.replaceChildren(input, el('button', { type: 'button', class: 'at-btn primary at-check', onclick: check }, 'Check'));
      } else {
        const pool = shuffle(E.filter(o => o.z !== e.z && Math.abs(o.z - e.z) < 30)).slice(0, 3);
        opts.replaceChildren(...shuffle([e, ...pool]).map(o => el('button', { type: 'button', class: 'at-opt', onclick: () => answer(o.z === e.z) }, dir === 'sym' ? o.name : o.symbol)));
      }
      stage.replaceChildren(el('p', { class: 'at-progress' }, `${i + 1} of ${items.length}`),
        el('div', { class: 'at-big' + (dir === 'sym' ? ' sym' : '') }, prompt),
        el('p', { class: 'at-q' }, dir === 'sym' ? 'Which element has this symbol?' : 'What is its symbol?'), opts, fb);
      (input || opts.querySelector('button')).focus({ preventScroll: true });
    }
    const toggles = el('div', { class: 'at-toggles' },
      el('label', {}, el('input', { type: 'checkbox', checked: dir === 'name', onchange: ev => { dir = ev.target.checked ? 'name' : 'sym'; store.set('atlas:dir', dir); show(); } }), ' Show the name, ask for the symbol'),
      el('label', {}, el('input', { type: 'checkbox', checked: typing, onchange: ev => { typing = ev.target.checked; store.set('atlas:typing', typing); show(); } }), ' Type the answer (harder, and better for memory)'));
    body.replaceChildren(back(), toggles, stage); show();
  }

  function place() {
    const items = pickItems('place');
    let i = 0, right = 0;
    const g = makeGrid('Empty periodic table: choose where the element goes', (e, t) => guess(e, t));
    const placedNow = new Set(Object.entries(S().place).filter(([, r]) => r[0] >= 3).map(([z]) => +z));
    const prompt = el('p', { class: 'at-q big' });
    const fb = el('p', { class: 'at-fb', 'aria-live': 'polite' });
    g.grid.classList.add('empty');
    for (const e of E) { const t = g.tiles.get(e.z); t.classList.toggle('filled', placedNow.has(e.z)); t.tabIndex = e.z === 1 ? 0 : -1; t.setAttribute('aria-label', placedNow.has(e.z) ? e.name : `Row ${e.row > 8 ? e.row - 3 + ' (the strip below)' : e.row}, column ${e.col}`); }
    let lock = false;
    function ask() {
      if (i >= items.length) return done(`You placed ${right} of ${items.length} first time. Look at the map below: your table is filling in.`);
      const e = byZ(items[i]); prompt.replaceChildren('Where does ', el('b', {}, `${e.name} (${e.symbol})`), ' go?');
      fb.textContent = 'Tap its place on the table.'; fb.className = 'at-fb'; lock = false;
    }
    function guess(e, t) {
      if (lock) return;
      const want = byZ(items[i]);
      const ok = e.z === want.z;
      record('place', want.z, ok); if (ok) right++;
      const wt = g.tiles.get(want.z);
      wt.classList.add('filled', ok ? 'flash-ok' : 'flash-no');
      wt.setAttribute('aria-label', want.name);
      if (!ok) t.classList.add('miss');
      const hint = want.row >= 9 ? `in the strip below, ${want.row === 9 ? 'the first' : 'the second'} row` : `in row ${want.row}, column ${want.col}`;
      fb.replaceChildren(el('b', {}, ok ? 'Right. ' : 'Not quite. '), ok ? `${want.name} is ${hint}${want.z > 1 ? `, in the ${FAMILIES[familyOf(want)].short.toLowerCase()}` : ''}.` :
        `That spot is ${e.name}. ${want.name} lives ${hint}${want.z > 1 ? `, in the ${FAMILIES[familyOf(want)].short.toLowerCase()}` : ''}.`);
      fb.className = 'at-fb ' + (ok ? 'ok' : 'no'); lock = true;
      setTimeout(() => { wt.classList.remove('flash-ok', 'flash-no'); t.classList.remove('miss'); i++; ask(); }, ok ? 1200 : 2600);
    }
    body.replaceChildren(back(), prompt, fb, g.wrap); ask();
  }

  function seq() {
    const zs = E.slice(0, 20).map(e => e.z);
    let next = 1, slips = 0;
    const slots = el('ol', { class: 'at-slots' }, zs.map(z => el('li', { 'data-z': z }, el('span', { class: 'n' }, z), el('span', { class: 's' }))));
    const fb = el('p', { class: 'at-fb', 'aria-live': 'polite' }, 'Tap hydrogen first.');
    const tray = el('div', { class: 'at-tray' }, shuffle(zs).map(z => el('button', { type: 'button', class: 'at-chip', onclick: ev => tap(z, ev.currentTarget) }, byZ(z).symbol)));
    function tap(z, b) {
      if (z === next) {
        b.disabled = true; b.classList.add('used');
        slots.querySelector(`[data-z="${z}"] .s`).textContent = byZ(z).symbol;
        next++;
        if (next > 20) {
          const best = store.get('atlas:seqbest', null);
          if (best == null || slips < best) store.set('atlas:seqbest', slips);
          return done(slips ? `All twenty, with ${slips} slip${slips > 1 ? 's' : ''}. Try again tomorrow and see if the slips shrink.` : 'All twenty, without a single slip. That is the first two rows of the table, and the start of the third, in your head.');
        }
        fb.textContent = `${byZ(z).name}. Next: element ${next}.`; fb.className = 'at-fb ok';
      } else {
        slips++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
        fb.textContent = `${byZ(z).symbol} is ${byZ(z).name}, element ${z}. You need element ${next}.`; fb.className = 'at-fb no';
      }
    }
    const best = store.get('atlas:seqbest', null);
    body.replaceChildren(back(), el('p', { class: 'at-q' }, 'Tap the symbols in order, from 1 to 20.' + (best != null ? ` Your best: ${best} slip${best === 1 ? '' : 's'}.` : '')), slots, tray, fb,
      el('p', { class: 'at-note' }, 'A trick many people use: make up a silly sentence from the first letters, like “Happy Henry Likes Beer But Could Not Obtain Food” for H, He, Li, Be, B, C, N, O, F. Your own sentence will stick better than anyone else’s.'));
  }

  function fam() {
    const items = pickItems('fam');
    let i = 0, right = 0;
    const stage = el('div', { class: 'at-stage' });
    function show() {
      if (i >= items.length) return done(`You sorted ${right} of ${items.length} correctly. Families are the secret to the whole table: learn the family and you know how the element behaves.`);
      const e = byZ(items[i]), f = familyOf(e);
      const opts = shuffle([f, ...shuffle(Object.keys(FAMILIES).filter(k => k !== f && k !== 'h')).slice(0, 3)]);
      const fb = el('p', { class: 'at-fb', 'aria-live': 'polite' });
      const box = el('div', { class: 'at-opts col' }, opts.map(k => el('button', { type: 'button', class: 'at-opt', onclick: () => {
        const ok = k === f; record('fam', e.z, ok); if (ok) right++;
        box.querySelectorAll('button').forEach(b => (b.disabled = true));
        fb.replaceChildren(el('b', {}, ok ? 'Yes. ' : `${e.name} is in the ${FAMILIES[f].short.toLowerCase()}. `), FAMILIES[f].note);
        fb.className = 'at-fb ' + (ok ? 'ok' : 'no');
        const nb = el('button', { type: 'button', class: 'at-btn primary', onclick: () => { i++; show(); } }, i + 1 < items.length ? 'Next' : 'Finish');
        stage.append(nb); nb.focus();
      } }, FAMILIES[k].short)));
      stage.replaceChildren(el('p', { class: 'at-progress' }, `${i + 1} of ${items.length}`), el('div', { class: 'at-big' }, e.symbol, el('small', {}, e.name)),
        el('p', { class: 'at-q' }, 'Which family does it belong to?'), box, fb);
      box.querySelector('button').focus({ preventScroll: true });
    }
    body.replaceChildren(back(), stage); show();
  }
  function done(text) {
    body.replaceChildren(el('div', { class: 'at-done' }, el('p', {}, text), el('button', { type: 'button', class: 'at-btn primary', onclick: home }, 'Choose another game')));
    body.querySelector('button').focus({ preventScroll: true });
  }

  const panel = el('div', { class: 'at-practise full' },
    el('p', { class: 'at-what' }, 'Nobody needs to memorise all 118, and understanding the pattern matters more than any list. But knowing the first twenty and the famous families by heart makes the rest of chemistry much easier to read.'),
    levelSel, status, body, mapWrap);
  markLevel(); refresh(); home();
  return panel;
}

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ------------------------------------------------------------------ tabs
function mount(section) {
  const mountEl = section.querySelector('[data-mount="ptable"]');
  if (!mountEl || section.querySelector('.at-tabs')) return;
  const stories = Object.fromEntries((App.data.stories || []).map(s => [s.id, s]));
  // the guided tour (m_ptguide) adds its own lead for the tabs; fall back to the page's first paragraph
  const lead = section.querySelector('.at-lead') || section.querySelector(':scope > p');
  const TABS = [
    { id: 'discovered', label: 'Discovered', lead: 'For most of history, people knew only a handful of elements. Slide through time and watch the table fill in, one discovery at a time. Tap any element to meet the people who found it.' },
    { id: 'explore', label: 'Explore', lead: 'The table is a map. Colour it by different properties and patterns jump out: that is why chemists can predict how an element behaves just from where it sits.' },
    { id: 'build', label: 'Build it', lead: 'Where does the table’s shape come from? From the order in which electrons fill their orbitals.' },
    { id: 'practise', label: 'Practise', lead: 'A few minutes a day, and the table becomes something you simply know.' },
  ];
  const tabsEl = el('div', { class: 'at-tabs', role: 'tablist', 'aria-label': 'Ways to explore the periodic table' });
  const panels = {};
  let built = {};
  let current = store.get('atlas:tab', 'discovered');
  if (!TABS.find(t => t.id === current)) current = 'discovered';
  TABS.forEach(t => {
    const b = el('button', { type: 'button', role: 'tab', class: 'at-tab', id: `at-tab-${t.id}`, 'aria-controls': `at-panel-${t.id}`, onclick: () => select(t.id, true) }, t.label);
    tabsEl.append(b);
  });
  tabsEl.addEventListener('keydown', ev => {
    const i = TABS.findIndex(t => t.id === current);
    const d = { ArrowRight: 1, ArrowLeft: -1, Home: -99, End: 99 }[ev.key]; if (d == null) return;
    ev.preventDefault();
    const j = d === -99 ? 0 : d === 99 ? TABS.length - 1 : (i + d + TABS.length) % TABS.length;
    select(TABS[j].id, true); tabsEl.querySelectorAll('[role="tab"]')[j].focus();
  });
  mountEl.setAttribute('role', 'tabpanel'); mountEl.id = 'at-panel-discovered'; mountEl.setAttribute('aria-labelledby', 'at-tab-discovered');
  panels.discovered = mountEl;
  const make = { explore: () => explorePanel(stories), build: () => { const b = buildPanel(); built.buildStop = b.stop; return b.panel; }, practise: practisePanel };
  function select(id, user) {
    current = id; store.set('atlas:tab', id);
    if (!panels[id]) {
      panels[id] = el('div', { role: 'tabpanel', id: `at-panel-${id}`, 'aria-labelledby': `at-tab-${id}`, class: 'at-panel', tabindex: '-1' }, make[id]());
      mountEl.after(panels[id]);
    }
    for (const t of TABS) {
      const on = t.id === id, b = tabsEl.querySelector(`#at-tab-${t.id}`);
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      if (panels[t.id]) panels[t.id].hidden = !on;
    }
    if (id !== 'build' && built.buildStop) built.buildStop();
    if (lead) lead.textContent = TABS.find(t => t.id === id).lead;
    if (id !== 'discovered') { const pb = mountEl.querySelector('.pt-play'); if (pb && /Pause/.test(pb.textContent)) pb.click(); }
  }
  mountEl.before(tabsEl);
  select(current, false);
}

App.ready(() => setTimeout(() => document.querySelectorAll('#explore-table').forEach(mount), 0));
