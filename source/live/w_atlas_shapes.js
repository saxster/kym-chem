// 2.7 The shapes behind polarity: the Atlas of Chemistry figure (1.6) of methane, ammonia and water at their measured
// bond lengths and angles, turned in 3D in the book's own paper and ink. The figure lives in live/atlas/ (vendored from
// the atlas by its tools/vendor.mjs; edit it there, not here). Every number on it comes from the atlas's checked model.
import { Live } from './core.js';
import { mountAtlas } from './atlas/adapters/kym-live.js';
import { CHAPTER } from './atlas/chemistry/vsepr/chapter.js';
import { MOL } from './atlas/chemistry/vsepr/model.js';

const deg = k => `${MOL[k].angle.toFixed(1)}°`;
// this book's words for the readout; the numbers are the atlas model's (NIST measurements)
const readout = () => `Measured angles between the bonds: methane ${deg('CH4')}, ammonia ${deg('NH3')}, water ${deg('H2O')}.<br>` +
  'Methane’s four bonds point to the corners of a tetrahedron and cancel. Ammonia and water are lopsided, so they are polar.';

Live.register('atlas_shapes', (stage, params, api) => mountAtlas(stage, params, api, CHAPTER, { page: 6, height: 400, readout }), {
  label: 'Turn methane, ammonia and water in 3D', three: true,
});
