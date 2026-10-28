// "The periodic table, discovered": a periodic table that fills in as you slide through time.
import App from './core.js';
import { notesBlock } from './element_notes.js';
import ELEMENTS from './ptable_data.js';

const ERAS = [
  { max: 999, label: 'Ancient times' },
  { max: 1699, label: 'Alchemists, to 1700' },
  { max: 1799, label: 'The 1700s' },
  { max: 1868, label: '1800 to 1868' },
  { max: 1912, label: 'Mendeleev to Moseley, 1869 to 1912' },
  { max: 1944, label: '1913 to 1944' },
  { max: 9999, label: 'Made in laboratories, 1945 onwards' },
];
const eraOf = y => ERAS.findIndex(e => y <= e.max);

const MILESTONES = {
  0: 'Ancient times. Gold, copper, iron and a handful of others were known, though nobody yet thought of them as “elements”.',
  1669: 'Hennig Brand finds phosphorus in boiled-down urine. It is usually called the first element whose discoverer we know by name.',
  1789: 'Lavoisier publishes a list of 33 “simple substances”. Most are real elements; a few, like light and heat, are not.',
  1869: 'Mendeleev arranges the 63 known elements into a table, and boldly leaves gaps for elements nobody has found yet.',
  1913: 'Moseley discovers atomic numbers. Now anyone can count exactly which elements are still missing.',
  1945: 'With promethium, every element up to uranium has been found. From now on, new elements have to be made.',
  2016: 'The names of the last four elements are agreed. The seventh row is complete: 118 elements.',
};
const GAPS = {
  Sc: { eka: 'eka-boron', short: 'eka-B', note: 'found in 1879' },
  Ga: { eka: 'eka-aluminium', short: 'eka-Al', note: 'found in 1875' },
  Ge: { eka: 'eka-silicon', short: 'eka-Si', note: 'found in 1886' },
};

// slider steps: every distinct discovery year (all ancient elements share one step) plus the milestone years
const stepYears = [...new Set([0, ...ELEMENTS.filter(e => e.year >= 1000).map(e => e.year), ...Object.keys(MILESTONES).map(Number)])]
  .sort((a, b) => a - b);
const knownBy = (e, y) => (e.year < 1000 ? 0 : e.year) <= y;
const yearLabel = y => {
  if (y === 0) return 'Ancient times';
  const e = ELEMENTS.find(x => x.year === y && x.label !== String(x.year));
  return e && !e.ancient ? e.label : String(y);
};

function mount(root) {
  const { el } = App;
  const stories = Object.fromEntries((App.data.stories || []).map(s => [s.id, s]));
  let step = stepYears.length - 1;
  let gaps = false;
  let timer = null;
  let selected = null;

  const yearEl = el('p', { class: 'pt-year', 'aria-hidden': 'true' });
  const countEl = el('p', { class: 'pt-count', 'aria-hidden': 'true' });
  const live = el('p', { class: 'pt-caption', 'aria-live': 'polite' });
  const range = el('input', {
    type: 'range', min: 0, max: stepYears.length - 1, step: 1, value: step, class: 'pt-range',
    'aria-label': 'Year', oninput: () => { stop(); gaps = false; gapBox.checked = false; setStep(+range.value); },
  });
  const playBtn = el('button', { type: 'button', class: 'pt-play', onclick: () => (timer ? stop() : play()) });
  const gapBox = el('input', { type: 'checkbox', id: 'pt-gaps', onchange: () => { stop(); gaps = gapBox.checked; if (gaps) setStep(stepYears.indexOf(1869)); else render(); } });
  const ticks = el('div', { class: 'pt-ticks' }, Object.keys(MILESTONES).map(Number).map(y => {
    const i = stepYears.indexOf(y);
    return el('button', {
      type: 'button', class: 'pt-tick' + (y === 1669 ? ' nolabel' : ''), style: `--p:${i / (stepYears.length - 1)}`, title: yearLabel(y),
      'aria-label': `Jump to ${yearLabel(y)}`, onclick: () => { stop(); gaps = false; gapBox.checked = false; setStep(i); },
    }, el('span', {}, y === 0 ? 'Ancient' : String(y)));
  }));

  const controls = el('div', { class: 'pt-ctl' },
    el('div', { class: 'pt-top' },
      el('div', { class: 'pt-when' }, yearEl, countEl),
      el('div', { class: 'pt-btns' }, playBtn,
        el('label', { class: 'pt-gapl', for: 'pt-gaps' }, gapBox, el('span', {}, 'Mendeleev’s gaps')))),
    el('div', { class: 'pt-slider' }, range, ticks),
    live);

  const grid = el('div', { class: 'pt-grid', role: 'group', 'aria-label': 'Periodic table: choose an element' });
  const tiles = new Map();
  for (const e of ELEMENTS) {
    const t = el('button', {
      type: 'button', class: `pt-el era-${eraOf(e.year)}`, style: `grid-row:${e.row};grid-column:${e.col}`, tabindex: '-1',
      'data-z': e.z, onclick: () => select(e, true),
    }, el('span', { class: 'z' }, e.z), el('span', { class: 's' }, e.symbol), el('span', { class: 'nm' }, e.name),
      el('span', { class: 'eka', 'aria-hidden': 'true' }));
    tiles.set(e.z, t);
    grid.append(t);
  }
  grid.append(el('span', { class: 'pt-fmark', style: 'grid-row:6;grid-column:3', 'aria-hidden': 'true' }, '57–71'),
    el('span', { class: 'pt-fmark', style: 'grid-row:7;grid-column:3', 'aria-hidden': 'true' }, '89–103'),
    el('span', { class: 'pt-gapline', style: 'grid-row:8;grid-column:1 / -1', 'aria-hidden': 'true' }));
  tiles.get(1).tabIndex = 0;

  grid.addEventListener('keydown', ev => {
    const cur = ev.target.closest('.pt-el'); if (!cur) return;
    const e = ELEMENTS[+cur.dataset.z - 1];
    const dir = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }[ev.key];
    if (!dir) return;
    ev.preventDefault();
    let best = null, bestD = Infinity;
    for (const o of ELEMENTS) {
      const dr = o.row - e.row, dc = o.col - e.col;
      if (dir[0] && Math.sign(dr) !== dir[0]) continue;
      if (dir[1] && (Math.sign(dc) !== dir[1] || dr !== 0)) continue;
      const d = dir[0] ? Math.abs(dr) * 100 + Math.abs(dc) : Math.abs(dc);
      if (d < bestD) { bestD = d; best = o; }
    }
    if (best) { cur.tabIndex = -1; const n = tiles.get(best.z); n.tabIndex = 0; n.focus(); }
  });

  const legend = el('ul', { class: 'pt-legend', 'aria-label': 'Colours show when each element was found' },
    ERAS.map((er, i) => el('li', { class: `era-${i}` }, el('i', { 'aria-hidden': 'true' }), er.label)));

  const card = el('div', { class: 'pt-card', hidden: true, 'aria-live': 'polite' });

  function select(e, scroll) {
    if (selected) tiles.get(selected.z).classList.remove('sel');
    selected = e;
    const t = tiles.get(e.z);
    t.classList.add('sel');
    grid.querySelectorAll('.pt-el').forEach(x => (x.tabIndex = -1)); t.tabIndex = 0;
    const y = stepYears[step];
    const st = e.story && stories[e.story];
    const when = e.ancient ? 'Known since ancient times' : e.label === String(e.year) ? `Found in ${e.year}` : `Known from ${e.label.toLowerCase()}`;
    card.replaceChildren(
      el('div', { class: `pt-card-tile era-${eraOf(e.year)}`, 'aria-hidden': 'true' }, el('span', { class: 'z' }, e.z), el('span', { class: 's' }, e.symbol)),
      el('div', { class: 'pt-card-body' },
        el('h3', {}, e.name, el('span', { class: 'pt-card-z' }, ` · element ${e.z}`)),
        el('p', { class: 'pt-card-when' }, when, e.place && e.place !== 'Everywhere' ? ` · ${e.place}` : ''),
        el('p', { class: 'pt-card-how' }, e.how),
        el('p', { class: 'pt-card-who' }, el('b', {}, 'Who: '), e.who),
        !knownBy(e, y) ? el('p', { class: 'pt-card-not' }, `In ${yearLabel(y).toLowerCase() === 'ancient times' ? 'ancient times' : yearLabel(y)}, nobody knew about it yet.`) : null,
        st ? el('p', { class: 'pt-card-st' }, el('a', { class: 'sl', href: `#story-${st.id}`, 'data-story': st.id }, `Read the story: ${st.title}`)) : null,
        notesBlock(e.z, el)),
      el('button', { type: 'button', class: 'pt-card-x', 'aria-label': 'Close', onclick: () => { card.hidden = true; t.classList.remove('sel'); selected = null; t.focus(); } }, '×'));
    card.hidden = false;
    if (scroll) card.scrollIntoView({ block: 'nearest', behavior: App.reduceMotion() ? 'auto' : 'smooth' });
  }

  let prevYear = null;
  function render() {
    const y = stepYears[step];
    const known = ELEMENTS.filter(e => knownBy(e, y));
    yearEl.textContent = yearLabel(y);
    countEl.textContent = `${known.length} of 118 elements known`;
    range.value = step;
    range.setAttribute('aria-valuetext', `${yearLabel(y)}: ${known.length} of 118 elements known`);
    const anim = prevYear != null && y > prevYear && !App.reduceMotion();
    for (const e of ELEMENTS) {
      const t = tiles.get(e.z);
      const k = knownBy(e, y);
      const isNew = anim && k && !knownBy(e, prevYear);
      t.classList.toggle('ghost', !k);
      t.classList.toggle('new', isNew);
      if (isNew) { t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; }
      const g = gaps && GAPS[e.symbol];
      t.classList.toggle('gap', !!g);
      t.querySelector('.eka').textContent = g ? g.short : '';
      t.setAttribute('aria-label', `${e.name}, element ${e.z}, ` + (g ? `a gap Mendeleev left for ${g.eka}, ${g.note}` : k ? (e.ancient ? 'known since ancient times' : `found ${e.label === String(e.year) ? 'in ' + e.year : e.label.toLowerCase()}`) : `not yet discovered`));
    }
    const msg = gaps
      ? 'In 1869 Mendeleev left gaps in his table and predicted what would fill them. He named three of them eka-boron, eka-aluminium and eka-silicon. Within seventeen years all three had been found, almost exactly as he said.'
      : MILESTONES[y] || newsFor(y);
    live.textContent = msg;
    root.classList.toggle('gaps-on', gaps);
    prevYear = y;
    if (selected) select(selected, false);
  }
  function newsFor(y) {
    const found = ELEMENTS.filter(e => e.year === y);
    if (!found.length) return '';
    const names = found.map(e => e.name);
    const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
    return `${yearLabel(y)}: ${list}.`;
  }
  function setStep(i) { step = Math.max(0, Math.min(stepYears.length - 1, i)); render(); }
  function play() {
    if (step >= stepYears.length - 1) { prevYear = null; setStep(0); }
    playBtn.textContent = 'Pause';
    playBtn.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => {
      if (step >= stepYears.length - 1) return stop();
      setStep(step + 1);
    }, App.reduceMotion() ? 900 : 420);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    playBtn.textContent = step >= stepYears.length - 1 ? 'Play history' : 'Play';
    playBtn.setAttribute('aria-pressed', 'false');
  }

  const wrap = el('div', { class: 'pt-scroll', tabindex: '-1' }, grid);
  const ptRoot = el('div', { class: 'pt full' }, controls, wrap, card, legend);
  root.replaceChildren(ptRoot);
  stop();
  render();
  const onScroll = () => {
    const top = parseFloat(getComputedStyle(controls).top) || 0;
    const r = controls.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    controls.classList.toggle('stuck', r.top <= top + 0.5 && w.bottom > r.bottom);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(x => { if (!x.isIntersecting) stop(); })).observe(ptRoot);
  }
}

App.ready(() => {
  document.querySelectorAll('[data-mount="ptable"]').forEach(mount);
});
