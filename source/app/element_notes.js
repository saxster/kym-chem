// Short profiles of all 118 elements (what it's like, where you meet it, one true surprise, why it matters, links).
// Written in three parts; merged here. The Royal Society of Chemistry link comes first wherever there is one.
import A from './element_notes_1.js';
import B from './element_notes_2.js';
import C from './element_notes_3.js';

const NOTES = Object.assign({}, A, B, C);

export function notesFor(z) { return NOTES[z] || null; }

// A DOM block for an element card. `el` is App.el.
export function notesBlock(z, el) {
  const n = NOTES[z];
  if (!n) return null;
  const row = (label, text) => text ? el('p', { class: 'en-row' }, el('b', {}, label), ' ', text) : null;
  return el('div', { class: 'en' },
    row('What it’s like:', n.looks),
    row('Where you meet it:', n.life),
    n.wow ? el('p', { class: 'en-wow' }, n.wow) : null,
    row('Its place in the table:', n.why),
    n.links && n.links.length ? el('p', { class: 'en-links' }, 'Read more: ',
      n.links.map(([label, url], i) => [i ? ' · ' : '', el('a', { href: url, target: '_blank', rel: 'noopener' }, label)])) : null);
}

export default NOTES;
