// "The periodic table, inside out": a guided, scroll-driven explainer at the top of #explore-table.
// The words live in ptguide_content.js; this module builds the page, the sticky stage and its pictures.
// Stage = 118 absolutely positioned tiles moved with transforms (FLIP-style CSS transitions) between layouts,
// plus an SVG overlay (graphs, arrows, labels) and an HTML overlay (big tile, shell diagrams).
import App from './core.js';
import ELEMENTS from './ptable_data.js';
import { PROPS } from './atlas_data.js';
import { STEPS, FAMILIES, FIVE, MORE, RECAP, DEEPER } from './ptguide_content.js';

const { el } = App;
const SVGNS = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}, kids = []) => {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const c of [].concat(kids)) if (c != null) n.append(c.nodeType ? c : document.createTextNode(String(c)));
  return n;
};
const BY_Z = Object.fromEntries(ELEMENTS.map(e => [e.z, e]));
const PROP = Object.fromEntries(PROPS.map(p => [p[0], { state: p[1], cls: p[2], r: p[3] }]));

// ------------------------------------------------------------------ positions
// The long (32-column) form: s = cols 1–2, f = 3–16, d = 17–26, p = 27–32.
function long32(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 32];
  const starts = [[3, 2], [11, 3], [19, 4], [37, 5], [55, 6], [87, 7]];
  for (let i = starts.length - 1; i >= 0; i--) {
    const [first, period] = starts[i];
    if (z < first) continue;
    const k = z - first;
    if (k < 2) return [period, k + 1];
    if (period <= 3) return [period, 27 + (k - 2)];
    if (period <= 5) return k < 12 ? [period, 17 + (k - 2)] : [period, 27 + (k - 12)];
    if (k < 16) return [period, 3 + (k - 2)];
    if (k < 26) return [period, 17 + (k - 16)];
    return [period, 27 + (k - 26)];
  }
  return [0, 0];
}
function blockOf(z) {
  if (z === 2) return 's';
  const c = long32(z)[1];
  return c <= 2 ? 's' : c <= 16 ? 'f' : c <= 26 ? 'd' : 'p';
}
// The usual 18-column form made from the long form: the f-block lifted out into two rows below
// (group 3 = Sc, Y, Lu, Lr, consistent with the long form above).
function grid18(z) {
  const [r, c] = long32(z);
  if (c <= 2) return [r, c];
  if (c <= 16) return [r + 2.5, c + 1];            // f rows under the table (rows 8.5 and 9.5)
  if (c <= 26) return [r, c - 14];                 // d: 17..26 -> 3..12
  return [r, c - 14];                              // p: 27..32 -> 13..18
}

// ------------------------------------------------------------------ build the page
function build(section) {
  if (section.querySelector('.ptg')) return null;
  const lead = section.querySelector(':scope > p');
  const anchorAfter = lead || section.querySelector('h2');
  const stepIndex = Object.fromEntries(STEPS.map((s, i) => [s.id, i]));

  // A. the five questions, in the book-wide "Understand it" card markup (styled by j_five.css)
  const fq = f => el('div', { class: 'fq' }, el('dt', {}, f.q),
    el('dd', {}, el('p', { html: f.a + ' ' }, el('a', { href: `#ptg-${f.step}`, class: 'ptg-jump', 'data-step': f.step }, 'See it happen ↓'))));
  const five = el('div', { class: 'ptg-intro' },
    el('section', { class: 'box five', id: 'five-periodic-table', 'aria-label': 'Understand it: The periodic table' },
      el('p', { class: 'bh' }, el('span', { class: 'five-k' }, 'Understand it'), el('span', { class: 'five-t' }, 'The periodic table')),
      el('dl', { class: 'fqs' }, FIVE.map(fq)),
      el('details', { class: 'five-more' },
        el('summary', { html: 'Go deeper <span>how do we know, what it isn’t, where does it stop working</span>' }),
        el('dl', { class: 'fqs' }, DEEPER.map(fq))),
      el('div', { class: 'box check five-turn', id: 'chk-five-periodic-table' },
        el('p', { class: 'bh', html: checkIcon() + '<span>Your turn</span>' }),
        el('p', { html: 'Explain <b>the periodic table</b> to a friend in one sentence, in your own words. Then compare it with the book’s.' }),
        tpl(`<p>${FIVE[0].a}</p>`))),
    el('p', { class: 'ptg-more-h' }, 'And a few more you might be wondering about'),
    el('ul', { class: 'ptg-more' }, MORE.map(m => el('li', {},
      el('b', {}, m.q + ' '), m.a + ' ', el('a', { href: `#ptg-${m.step}`, class: 'ptg-jump', 'data-step': m.step }, 'See it ↓')))),
    el('p', { class: 'ptg-cue' }, 'Now scroll slowly. The table will build itself beside the words.'));

  // B. the guided steps + sticky stage
  const steps = el('div', { class: 'ptg-steps' }, STEPS.map((s, i) => {
    const node = el('section', { class: 'ptg-step', id: `ptg-${s.id}`, 'data-i': i, 'aria-labelledby': `ptg-h-${s.id}` },
      el('p', { class: 'ptg-k' }, s.kicker),
      el('h3', { id: `ptg-h-${s.id}` }, s.title),
      el('div', { class: 'ptg-body', html: s.body }));
    if (s.ask) node.append(askBlock(s, i));
    if (s.quiz) node.append(quizBlock(s));
    return node;
  }));
  const stage = el('div', { class: 'ptg-stage', 'aria-hidden': 'true' },
    el('div', { class: 'ptg-board' }), el('p', { class: 'ptg-cap' }));
  const guide = el('div', { class: 'ptg', role: 'region', 'aria-label': 'A guided tour of the periodic table' },
    el('div', { class: 'ptg-cols' }, steps, stage));

  // C. the recap + checks + hand-off
  const recap = el('div', { class: 'ptg-recap' },
    el('h3', {}, 'Now you can answer…'),
    el('ul', { class: 'ptg-check-list' }, RECAP.map(r => el('li', {}, el('b', {}, r.q + ' '), r.a))),
    el('p', {}, 'Say each answer aloud, without looking. Then test yourself properly:'),
    RECAP.map((r, i) => el('div', { class: 'box check', id: `chk-pt-${i + 1}` },
      el('p', { class: 'bh', html: checkIcon() + '<span>Check yourself</span>' }),
      el('p', {}, r.q),
      el('p', { class: 'ans' }, 'Answer on the card above'),
      tpl(`<p>${r.a}</p>`))));
  const handoff = el('div', { class: 'ptg-handoff' },
    el('h3', {}, 'Now play with it'),
    el('p', { class: 'at-lead' }, 'For most of history, people knew only a handful of elements. Slide through time and watch the table fill in, one discovery at a time. Tap any element to meet the people who found it.'));

  anchorAfter.after(five, guide, recap, handoff);
  // keep tabs + table after the hand-off heading
  const mount = section.querySelector('[data-mount="ptable"]');
  if (mount && handoff.nextElementSibling !== mount) handoff.after(mount);

  // jump links: scroll to the step (the page module reveals the page first)
  five.addEventListener('click', ev => {
    const a = ev.target.closest('a.ptg-jump'); if (!a) return;
    ev.preventDefault();
    const t = document.getElementById(`ptg-${a.dataset.step}`);
    if (t) t.scrollIntoView({ behavior: App.reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  });
  return { section, guide, steps, stage, stepIndex };
}
function tpl(html) { const t = document.createElement('template'); t.className = 'chk-a'; t.innerHTML = html; return t; }
function checkIcon() {
  return '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 10.2 L9 12.7 L13.8 7.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function askBlock(s, i) {
  const box = el('div', { class: 'ptg-ask' }, el('p', { class: 'ptg-q' }, s.ask.q));
  const after = el('div', { class: 'ptg-after', hidden: true, html: s.ask.after });
  if (s.ask.options) {
    const fb = el('p', { class: 'ptg-fb', role: 'status' });
    const opts = el('div', { class: 'ptg-opts' }, s.ask.options.map((o, k) => el('button', {
      type: 'button', class: 'ptg-opt', onclick: ev => {
        opts.querySelectorAll('button').forEach(b => b.classList.remove('picked'));
        ev.currentTarget.classList.add('picked');
        fb.textContent = k === s.ask.correct ? 'Yes.' : 'Not quite. Look at where the fizzing metals sit.';
        if (k === s.ask.correct) { after.hidden = false; opts.querySelectorAll('button').forEach(b => { b.disabled = true; }); ev.currentTarget.classList.add('right'); }
      },
    }, o)));
    box.append(opts, fb);
  } else {
    box.append(el('button', { type: 'button', class: 'ptg-act', onclick: ev => {
      ev.currentTarget.disabled = true; after.hidden = false;
      done.add(s.id); if (G && G.active === i) G.show(i);
    } }, s.ask.btn));
  }
  box.append(after);
  return box;
}

function quizBlock(s) {
  const wrap = el('ol', { class: 'ptg-quiz' });
  s.quiz.forEach(item => {
    const why = el('p', { class: 'ptg-why', hidden: true });
    const opts = el('div', { class: 'ptg-opts' }, item.options.map((o, k) => el('button', {
      type: 'button', class: 'ptg-opt', onclick: ev => {
        const right = k === item.correct;
        opts.querySelectorAll('button').forEach((b, j) => { b.disabled = true; if (j === item.correct) b.classList.add('right'); });
        if (!right) ev.currentTarget.classList.add('wrong');
        why.hidden = false;
        why.innerHTML = `<b>${right ? 'That is the prediction.' : 'The prediction is: ' + item.options[item.correct].toLowerCase() + '.'}</b> ${item.why}`;
      },
    }, o)));
    wrap.append(el('li', {}, el('p', { class: 'ptg-q' }, item.q), el('p', { class: 'ptg-hint' }, item.hint), opts, why));
  });
  return wrap;
}

// ------------------------------------------------------------------ the stage
const done = new Set();     // steps whose "then" state has been triggered by a button
let G = null;

function Stage(ctx) {
  const board = ctx.stage.querySelector('.ptg-board');
  const cap = ctx.stage.querySelector('.ptg-cap');
  const tiles = {};
  for (const e of ELEMENTS) {
    const t = el('div', { class: `ptg-t b-${blockOf(e.z)}` }, el('i', {}, e.z), el('b', {}, e.symbol));
    board.append(t); tiles[e.z] = t;
  }
  const ghost119 = el('div', { class: 'ptg-t ptg-119 ghost' }, el('i', {}, '119'), el('b', {}, '?'));
  board.append(ghost119);
  const over = svg('svg', { class: 'ptg-svg' });
  const html = el('div', { class: 'ptg-html' });
  board.append(over, html);
  let W = 0, H = 0, active = -1;
  const B = 40; // base tile size in px (scaled by transform)

  function measure() { const r = board.getBoundingClientRect(); W = r.width; H = r.height; return W > 0 && H > 0; }
  function place(t, x, y, size, extra = '') {
    t.style.transform = `translate(${x}px,${y}px) scale(${size / B})${extra}`;
  }
  function gridLayout(cols, rows, posFn, filter = () => true) {
    const pad = 6, gap = 0.08;
    const cell = Math.min((W - pad * 2) / cols, (H - pad * 2) / rows);
    const ox = (W - cell * cols) / 2, oy = (H - cell * rows) / 2;
    const out = {};
    for (const e of ELEMENTS) {
      if (!filter(e.z)) continue;
      const [r, c] = posFn(e.z);
      out[e.z] = { x: ox + (c - 1) * cell + cell * gap / 2, y: oy + (r - 1) * cell + cell * gap / 2, s: cell * (1 - gap) };
    }
    return { pos: out, cell, ox, oy };
  }
  function rand(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  function reset() {
    while (over.firstChild) over.firstChild.remove();
    html.innerHTML = ''; cap.textContent = '';
    ghost119.style.opacity = 0;
    for (const z in tiles) { tiles[z].className = `ptg-t b-${blockOf(+z)}`; tiles[z].style.opacity = 1; tiles[z].style.transitionDelay = '0ms'; }
    over.setAttribute('viewBox', `0 0 ${W} ${H}`); over.setAttribute('width', W); over.setAttribute('height', H);
  }
  function hideAllBut(set) { for (const z in tiles) if (!set.has(+z)) tiles[z].style.opacity = 0; }
  // delay only the movement (transform); opacity and colour change at once
  function stagger(fn) { for (const z in tiles) tiles[z].style.transitionDelay = App.reduceMotion() ? '0ms' : `${fn(+z)}ms, 0ms, 0ms, 0ms`; }
  function label(x, y, text, cls = '', anchor = 'middle') { over.append(svg('text', { x, y, class: `ptg-lab ${cls}`, 'text-anchor': anchor }, text)); }
  const FAM = Object.fromEntries(FAMILIES.flatMap(f => f.z.map(z => [z, f.key])));

  const layouts = {
    heap() {
      const r = rand(7), s = Math.min(W, H) / 9;
      for (const e of ELEMENTS) {
        const x = r() * (W - s), y = r() * (H - s), rot = (r() - .5) * 50;
        place(tiles[e.z], x, y, s, ` rotate(${rot}deg)`);
      }
      cap.textContent = '118 elements, and no map';
    },
    shuffle(sorted) {
      const ten = FAMILIES.flatMap(f => f.z);
      hideAllBut(new Set(ten));
      const s = Math.min(W / 6.2, H / 5.2, 76);
      if (!sorted) {
        const order = [11, 35, 2, 3, 17, 18, 53, 19, 10, 9];
        order.forEach((z, k) => {
          const col = k % 5, row = Math.floor(k / 5);
          place(tiles[z], W / 2 - 2.5 * s * 1.12 + col * s * 1.12, H / 2 - s * 1.1 + row * s * 1.2, s, ` rotate(${(k % 3 - 1) * 6}deg)`);
        });
        cap.textContent = 'Ten elements, shuffled';
        return;
      }
      FAMILIES.forEach((f, fi) => {
        const cx = W * (fi + .5) / 3;
        f.z.forEach((z, k) => { tiles[z].classList.add(`fam-${f.key}`); place(tiles[z], cx - s / 2, H * .18 + k * s * 1.08, s); });
        label(cx, H * .12, W < 520 ? f.label.split(' ').slice(0, 2).join(' ') : f.label, `fam-${f.key}${W < 520 ? ' ptg-small' : ''}`);
      });
      cap.textContent = 'Three families';
    },
    families() { layouts.shuffle(true); },
    row(withWave) {
      const n = 56, pad = 10, cell = (W - pad * 2) / n, y = withWave ? H * .78 : H * .5;
      hideAllBut(new Set(Array.from({ length: n }, (_, i) => i + 1)));
      for (let z = 1; z <= n; z++) {
        tiles[z].classList.add('tiny');
        if (FAM[z]) tiles[z].classList.add(`fam-${FAM[z]}`);
        else if (z === 36 || z === 54) tiles[z].classList.add('fam-nob');
        else if (z === 37 || z === 55) tiles[z].classList.add('fam-alk');
        place(tiles[z], pad + (z - 1) * cell, y - cell / 2, cell * .86);
      }
      const lab = [[3, 'Li'], [11, 'Na'], [19, 'K'], [37, 'Rb'], [55, 'Cs']];
      for (const [z, s] of lab) label(pad + (z - .5) * cell, y + cell * 1.6 + 12, s, 'fam-alk');
      for (const [z, s] of [[2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe']]) label(pad + (z - .5) * cell, y - cell - 6, s, 'fam-nob');
      if (!withWave) {
        // gaps of 8 between the first fizzing metals
        for (const [a, b] of [[3, 11], [11, 19]]) {
          const x1 = pad + (a - .5) * cell, x2 = pad + (b - .5) * cell, yy = y + cell * 1.6 + 30;
          over.append(svg('path', { d: `M${x1} ${yy - 4} V${yy} H${x2} V${yy - 4}`, class: 'ptg-brace' }));
          label((x1 + x2) / 2, yy + 16, '8 later', 'ptg-small');
        }
        cap.textContent = 'The first 56 elements, lightest first';
        return;
      }
      // the wave: atom size (covalent radius, pm) above the row
      const r = z => PROP[z].r, top = H * .1, bottom = y - cell * 2.2;
      const max = 240, min = 20;
      const pts = [];
      for (let z = 1; z <= n; z++) pts.push([pad + (z - .5) * cell, bottom - (r(z) - min) / (max - min) * (bottom - top)]);
      const d = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L');
      const path = svg('path', { d, class: 'ptg-wave' });
      over.append(path);
      if (!App.reduceMotion()) {
        const len = path.getTotalLength ? path.getTotalLength() : 1000;
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        requestAnimationFrame(() => requestAnimationFrame(() => { path.style.transition = 'stroke-dashoffset 1.6s ease'; path.style.strokeDashoffset = 0; }));
      }
      for (const [z, s] of lab) { const [x, yy] = pts[z - 1]; over.append(svg('circle', { cx: x, cy: yy, r: 3.5, class: 'ptg-peak' })); label(x, yy - 9, s, 'fam-alk'); }
      label(pad, top - 4, 'atom size', 'ptg-small', 'start');
      cap.textContent = 'Atom size rises and falls: every big peak is a fizzing metal';
    },
    wave() { layouts.row(true); },
    wrap() {
      const g = gridLayout(18, 5.6, grid18, z => z <= 56);
      hideAllBut(new Set(Object.keys(g.pos).map(Number)));
      stagger(z => z * 22);
      for (const z in g.pos) {
        const p = g.pos[z];
        if (FAM[z] || z == 36 || z == 54) tiles[z].classList.add(`fam-${FAM[z] || 'nob'}`);
        if (z == 37 || z == 55) tiles[z].classList.add('fam-alk');
        if ([1, 4, 12, 20, 38, 56].includes(+z)) {}
        place(tiles[z], p.x, p.y, p.s);
      }
      // a tiny calendar beside it: Mondays in one column
      const cw = Math.min(g.cell * .55, 14);
      const cx = W - cw * 7 - 8, cy = H - cw * 4 - 8;
      const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
        over.append(svg('rect', { x: cx + c * cw, y: cy + r * cw + cw, width: cw - 1.5, height: cw - 1.5, class: c === 0 ? 'ptg-cal mon' : 'ptg-cal' }));
      }
      days.forEach((d, c) => label(cx + c * cw + cw / 2, cy + cw * .8, d, 'ptg-tiny'));
      label(cx - 6, cy + cw * 2.6, 'like a calendar:', 'ptg-small', 'end');
      label(cx - 6, cy + cw * 3.6, 'every Monday in one column', 'ptg-small', 'end');
      cap.textContent = 'Start a new row at every fizzing metal, and the families fall into columns';
    },
    lengths() {
      const g = gridLayout(19.6, 10, grid18);
      for (const z in g.pos) place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s);
      const L = [2, 8, 8, 18, 18, 32, 32];
      L.forEach((n, i) => label(g.ox + 18.35 * g.cell, g.oy + (i + .62) * g.cell, String(n), 'ptg-len', 'start'));
      label(g.ox + 18.35 * g.cell, g.oy - 6, 'in the row', 'ptg-small', 'start');
      cap.textContent = 'Rows of 2, 8, 8, 18, 18, 32 and 32: 118 in all';
    },
    mendeleev(withGa) {
      const g = gridLayout(18, 10, grid18);
      for (const z in g.pos) {
        const e = BY_Z[z], p = g.pos[z];
        // what Mendeleev's 1869 table actually held: the floating rows were not part of it; fluorine was in it
        // (though not isolated until 1886); helium was not (seen only in the Sun's light, 1868)
        const known = z == 9 || (e.year <= 1869 && z != 2 && blockOf(+z) !== 'f');
        if (!known) tiles[z].classList.add('ghost');
        if ([21, 31, 32].includes(+z)) { tiles[z].classList.remove('ghost'); tiles[z].classList.add('gap'); }
        place(tiles[z], p.x, p.y, p.s);
      }
      if (withGa) {
        tiles[31].classList.remove('gap'); tiles[31].classList.add('found');
        const p = g.pos[31];
        label(p.x + p.s / 2, g.oy + 7.55 * g.cell, '↑ gallium, found in 1875', 'ptg-small fam-alk');
      } else {
        const p = g.pos[31];
        label(p.x + p.s / 2, g.oy + 7.55 * g.cell, '↑ “eka-aluminium”: predicted, not yet found', 'ptg-small');
      }
      cap.textContent = withGa ? 'The gap below aluminium, filled exactly as predicted' : 'The table in 1869: about 63 elements, and three gaps Mendeleev dared to predict';
    },
    'mendeleev-ga'() { layouts.mendeleev(true); },
    tile() {
      const g = gridLayout(18, 10, grid18);
      for (const z in g.pos) { tiles[z].style.opacity = 0; place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s); }
      html.innerHTML = `<div class="ptg-bigtile"><div class="bt"><span class="bt-z">11</span><span class="bt-s">Na</span><span class="bt-n">Sodium</span><span class="bt-m">22.99</span></div>
<ul class="bt-notes"><li><b>11</b> atomic number: 11 protons. This is what makes it sodium.</li><li><b>Na</b> symbol, from its Latin name, natrium</li><li><b>Sodium</b> name</li><li><b>22.99</b> relative atomic mass: how heavy, on average</li></ul>
<div class="bt-pair"><span><i>52</i>Te<em>127.6</em></span><span class="bt-arrow">then</span><span><i>53</i>I<em>126.9</em></span><p>Heavier first, because it has fewer protons.</p></div></div>`;
      cap.textContent = 'Read any square: the atomic number is its identity';
    },
    shells() {
      const g = gridLayout(18, 10, grid18);
      const k = .55;
      for (const z in g.pos) {
        const p = g.pos[z]; tiles[z].classList.add(p && [1].includes(+z) ? 'dim' : 'dim');
        place(tiles[z], p.x * k, p.y * k, p.s * k);
      }
      for (const z of [3, 11, 19, 37, 55, 87]) { tiles[z].classList.replace('dim', 'fam-alk'); }
      // shell diagrams
      const S = [['Li', [2, 1]], ['Na', [2, 8, 1]], ['K', [2, 8, 8, 1]]];
      const area = { x: W * .02, y: H * .6, w: W * .96, h: H * .38 };
      S.forEach(([sym, shells], i) => {
        const cx = area.x + area.w * (i + .5) / 3, cy = area.y + area.h * .5;
        const R = Math.min(area.w / 6.6, area.h / 2.6);
        over.append(svg('circle', { cx, cy, r: R * .16, class: 'ptg-nuc' }));
        shells.forEach((n, si) => {
          const rr = R * (.32 + .68 * (si + 1) / shells.length);
          over.append(svg('circle', { cx, cy, r: rr, class: 'ptg-shell' }));
          for (let j = 0; j < n; j++) {
            const a = -Math.PI / 2 + j * 2 * Math.PI / n;
            const outer = si === shells.length - 1;
            over.append(svg('circle', { cx: cx + rr * Math.cos(a), cy: cy + rr * Math.sin(a), r: outer ? 4.2 : 2.4, class: outer ? 'ptg-e out' : 'ptg-e' }));
          }
        });
        label(cx, cy + R + 16, `${sym}: ${shells.join(', ')}`, 'ptg-small');
      });
      label(W * .5, area.y - 6, 'one electron on the outermost shell, every time', 'ptg-small fam-alk');
      cap.textContent = 'Same number of outer electrons, same family';
    },
    long() {
      const g = gridLayout(32, 7.6, long32);
      for (const z in g.pos) place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s);
      tiles[2].className = 'ptg-t b-s';
      // block labels
      const blocks = [['s', 1, 2], ['f', 3, 16], ['d', 17, 26], ['p', 27, 32]];
      for (const [b, c1, c2] of blocks) {
        const x = g.ox + ((c1 + c2) / 2 - .5) * g.cell;
        label(Math.max(x, 14), g.oy + 7.45 * g.cell, W < 520 ? b : `${b}: ${c2 - c1 + 1} wide`, `ptg-small blk-${b}`);
      }
      cap.textContent = 'Every row in one piece: 32 squares wide';
    },
    folded() {
      const g = gridLayout(18, 10, grid18);
      for (const z in g.pos) place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s);
      stagger(z => (blockOf(z) === 'f' ? 250 + (z % 32) * 15 : 0));
      label(g.ox + 10 * g.cell, g.oy + 9.95 * g.cell, '↑ the f-block, lifted out and set underneath', `ptg-small blk-f`);
      cap.textContent = 'Fold out the f-block, and you get the familiar shape';
    },
    map() {
      const g = gridLayout(18, 11, grid18);
      for (const z in g.pos) {
        const c = (PROP[z] && PROP[z].cls) || 'M';
        tiles[z].className = `ptg-t cls-${c.replace('?', '')}${c.includes('?') ? ' unsure' : ''}`;
        place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s);
      }
      tiles[1].className = 'ptg-t cls-N';
      const c = g.cell, x0 = g.ox, y0 = g.oy;
      const arrow = (x1, y1, x2, y2, t, tx, ty) => {
        over.append(svg('line', { x1, y1, x2, y2, class: 'ptg-arrow', 'marker-end': 'url(#ptg-ah)' }));
        label(tx, ty, t, 'ptg-small ptg-arrow-lab');
      };
      over.append(svg('defs', {}, svg('marker', { id: 'ptg-ah', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, svg('path', { d: 'M0 0 L10 5 L0 10 z', class: 'ptg-ah' }))));
      arrow(x0 + 1.2 * c, y0 - .35 * c, x0 + 16.8 * c, y0 - .35 * c, 'atoms get smaller across a row', x0 + 9 * c, y0 - .55 * c);
      if (x0 > .45 * c) arrow(x0 - .3 * c, y0 + 1.2 * c, x0 - .3 * c, y0 + 6.8 * c, '', 0, 0);
      label(x0, y0 + 7.36 * c, '↓ atoms get bigger down a family', 'ptg-small ptg-arrow-lab', 'start');
      const key = [['M', 'metals'], ['D', 'metalloids'], ['N', 'non-metals']];
      key.forEach(([k, t], i) => {
        const x = x0 + (3 + i * 4.2) * c, y = y0 + 10.6 * c;
        over.append(svg('rect', { x, y: y - c * .55, width: c * .6, height: c * .6, class: `ptg-key cls-${k}` }));
        label(x + c * .8, y - c * .05, t, 'ptg-small', 'start');
      });
      cap.textContent = 'Metals left and centre, non-metals right, a staircase of metalloids between';
    },
    predict() {
      const g = gridLayout(18, 10.8, grid18);
      for (const z in g.pos) { tiles[z].classList.add('dim'); place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s); }
      for (const z of [9, 17, 35, 53]) tiles[z].classList.replace('dim', 'fam-hal');
      tiles[85].classList.replace('dim', 'pulse');
      for (const z of [3, 11, 19, 37, 55, 87]) tiles[z].classList.replace('dim', 'fam-alk');
      const p = g.pos[87];
      place(ghost119, p.x, p.y + g.cell * 1.15, p.s); ghost119.style.opacity = 1;
      cap.textContent = 'Astatine glows at the bottom of its family (green); a ghost 119 waits under francium';
    },
    blocks(with119) {
      const g = gridLayout(18, 10.8, grid18);
      for (const z in g.pos) place(tiles[z], g.pos[z].x, g.pos[z].y, g.pos[z].s);
      tiles[2].className = 'ptg-t b-s';
      const p = g.pos[87];
      place(ghost119, p.x, p.y + g.cell * 1.15, p.s); ghost119.style.opacity = .9;
      const keys = [['s', 's-block'], ['p', 'p-block'], ['d', 'd-block'], ['f', 'f-block']];
      keys.forEach(([k, t], i) => {
        const x = g.ox + (4 + i * 3.4) * g.cell, y = g.oy + 10.4 * g.cell;
        over.append(svg('rect', { x, y: y - g.cell * .55, width: g.cell * .6, height: g.cell * .6, class: `ptg-key blk-${k}` }));
        label(x + g.cell * .8, y - g.cell * .05, t, 'ptg-small', 'start');
      });
      cap.textContent = 'The whole map, coloured by the four kinds of electron room';
    },
  };

  function show(i) {
    if (!measure()) return false;
    active = i;
    const s = STEPS[i];
    const name = s.stage.then && done.has(s.id) ? s.stage.then : s.stage.layout;
    ctx.stage.dataset.layout = name;
    reset();
    (layouts[name] || layouts.heap)();
    return true;
  }
  return { show, get active() { return active; }, measure };
}

// ------------------------------------------------------------------ wiring
function init() {
  const section = document.getElementById('explore-table');
  if (!section) return;
  const ctx = build(section);
  if (!ctx) return;
  G = Stage(ctx);
  const stepEls = [...ctx.steps.querySelectorAll('.ptg-step')];
  let current = -1, raf = 0, pending = true;

  function pick() {
    raf = 0;
    if (section.offsetParent === null && getComputedStyle(section).display === 'none') return;
    const vh = window.innerHeight;
    const narrow = window.matchMedia('(max-width: 959px)').matches;
    const line = narrow ? vh * .66 : vh * .5;
    let idx = 0;
    for (let k = 0; k < stepEls.length; k++) if (stepEls[k].getBoundingClientRect().top < line) idx = k;
    stepEls.forEach((s, k) => s.classList.toggle('on', k === idx));
    if (idx !== current || pending) { if (G.show(idx)) { current = idx; pending = false; } }
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { pending = true; onScroll(); });
  App.on('page:change', () => { pending = true; setTimeout(onScroll, 60); });
  // re-show the current step when a "then" button fires
  const origShow = G.show;
  G.show = i => origShow(i);
  pending = true; setTimeout(onScroll, 0);
}

// Build at load (before App.ready callbacks run) so the checks module upgrades our "Check yourself" boxes
// and the atlas tabs mount beneath the hand-off heading.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
