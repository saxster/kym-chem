// The cover's periodic table: every element can be hovered, focused and tapped.
// Tapping opens a small card: what it is, who found it, whether this book uses it, and where to go next.
import App from './core.js';
import ELEMENTS from './ptable_data.js';
import { notesBlock } from './element_notes.js';

const byZ = new Map(ELEMENTS.map(e => [e.z, e]));
const el = App.el;

App.ready(() => {
  const cover = document.querySelector('header.cover');
  const svg = cover && cover.querySelector('svg');
  if (!svg) return;
  const tiles = [...svg.querySelectorAll('g.el')];
  if (!tiles.length) return;

  svg.setAttribute('role', 'group');
  svg.classList.add('cover-live');
  const hint = el('p', {class: 'cv-keyboard-hint', id: 'cover-table-help'}, 'Tap an element to follow its story. With a keyboard, use the arrow keys to browse, then Enter to open.');
  svg.after(hint);
  svg.setAttribute('aria-describedby', hint.id);

  const card = el('div', { class: 'cv-card', role: 'dialog', 'aria-modal': 'false', hidden: true });
  (svg.closest('figure') || svg.parentNode).appendChild(card);
  let current = null;

  tiles.forEach(g => {
    const z = parseInt((g.getAttribute('style') || '').replace(/.*--i:\s*(\d+).*/, '$1'), 10);
    const e = byZ.get(z);
    if (!e) return;
    g.dataset.z = z;
    g.setAttribute('tabindex', g === tiles[0] ? '0' : '-1');
    g.setAttribute('role', 'button');
    const inBook = g.classList.contains('on');
    g.setAttribute('aria-label', `${e.name}, element ${z}${inBook ? ', you will meet it in this book' : ''}`);
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    t.textContent = `${e.name} (${z})`;
    g.prepend(t);
    g.addEventListener('click', ev => { ev.stopPropagation(); open(g, e, inBook); });
    g.addEventListener('focus', () => tiles.forEach(tile => tile.setAttribute('tabindex', tile === g ? '0' : '-1')));
    g.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); open(g, e, inBook); }
      if (ev.key === 'Escape') close();
      const i = tiles.indexOf(g);
      let next = null;
      if (ev.key === 'ArrowRight') next = tiles[(i + 1) % tiles.length];
      if (ev.key === 'ArrowLeft') next = tiles[(i + tiles.length - 1) % tiles.length];
      if (ev.key === 'Home') next = tiles[0];
      if (ev.key === 'End') next = tiles[tiles.length - 1];
      if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
        const box = g.getBBox(), direction = ev.key === 'ArrowDown' ? 1 : -1;
        next = tiles.filter(tile => (tile.getBBox().y - box.y) * direction > 1)
          .sort((a, b) => {
            const score = tile => {const r = tile.getBBox(); return Math.abs(r.x - box.x) * 10 + Math.abs(r.y - box.y);};
            return score(a) - score(b);
          })[0];
      }
      if (next) {ev.preventDefault(); next.focus();}
    });
  });

  function place(g) {
    const host = card.parentNode.getBoundingClientRect();
    const r = g.getBoundingClientRect();
    const w = Math.min(320, host.width - 16);
    card.style.width = w + 'px';
    let left = r.left - host.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, host.width - w - 8));
    card.style.left = left + 'px';
    card.style.top = (r.bottom - host.top + 8) + 'px';
  }

  function open(g, e, inBook) {
    if (current) current.classList.remove('cv-sel');
    current = g; g.classList.add('cv-sel');
    const when = e.ancient ? 'Known since ancient times' : `Found in ${e.label}`;
    card.replaceChildren(
      el('button', { type: 'button', class: 'cv-x', 'aria-label': 'Close', onclick: close }, '×'),
      el('p', { class: 'cv-top' }, el('span', { class: 'cv-sym' }, e.symbol),
        el('span', { class: 'cv-name' }, e.name, el('small', {}, `element ${e.z}`))),
      inBook ? el('p', { class: 'cv-in' }, 'You will meet it in this book.') : null,
      el('p', { class: 'cv-how' }, e.how),
      el('p', { class: 'cv-who' }, `${when}${e.ancient ? '' : ' · ' + e.who}`),
      notesBlock(e.z, el),
      el('p', { class: 'cv-links' },
        e.story ? el('a', { class: 'sl', href: '#story-' + e.story, 'data-story': e.story }, 'Read its story') : null,
        el('a', { href: '#explore-table', onclick: ev => { ev.preventDefault(); goTable(e.z); } }, 'See it on the periodic table'),
        inBook ? el('a', { href: '#', onclick: ev => { ev.preventDefault(); find(e.name); } }, 'Find it in this book') : null));
    card.hidden = false;
    place(g);
    card.querySelector('.cv-x').focus({ preventScroll: true });
  }

  function close() {
    card.hidden = true;
    if (current) { current.classList.remove('cv-sel'); current.focus({ preventScroll: true }); current = null; }
  }

  function goTable(z) {
    close();
    history.pushState(null, '', '#explore-table');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    const tryPick = (n) => {
      const b = document.querySelector(`#explore-table [data-mount="ptable"] [data-z="${z}"]`);
      if (b && b.offsetParent) { b.click(); b.scrollIntoView({ block: 'center' }); }
      else if (n > 0) setTimeout(() => tryPick(n - 1), 120);
    };
    const target = document.getElementById('explore-table');
    if (target) target.scrollIntoView();
    setTimeout(() => tryPick(20), 60);
  }

  function find(name) {
    close();
    if (!App.search || !App.search.open) return;
    App.search.open();
    const input = document.querySelector('dialog[open] input[type="search"], dialog[open] input');
    if (input) { input.value = name; input.dispatchEvent(new Event('input', { bubbles: true })); }
  }

  document.addEventListener('click', ev => { if (!card.hidden && !card.contains(ev.target)) close(); });
  window.addEventListener('resize', () => { if (!card.hidden && current) place(current); });
});
