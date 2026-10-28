// Where every scene in the book happened. resolve(sceneText) -> {key, label, lat, lon, year} or null
// (null for scenes that are not a real place and time: "your kitchen", "a school sports day", Mars ...).
// Coordinates are approximate city centres (2 decimals): plenty for a world map.

export const PLACES = {
  abdera: ['Abdera, Greece', 40.95, 24.98],
  sicily: ['Sicily', 37.31, 13.58],
  syracuse: ['Syracuse, Sicily', 37.08, 15.29],
  alexandria: ['Alexandria, Egypt', 31.20, 29.92],
  natron: ['The Natron Lakes, Egypt', 30.40, 30.30],
  cairo: ['Cairo', 30.04, 31.24],
  padua: ['Padua', 45.41, 11.88],
  florence: ['Florence', 43.77, 11.26],
  bologna: ['Bologna', 44.49, 11.34],
  turin: ['Turin', 45.07, 7.69],
  vercelli: ['Vercelli', 45.32, 8.42],
  prague: ['Prague', 50.08, 14.42],
  merchiston: ['Edinburgh', 55.93, -3.21],
  leith: ['Leith, Edinburgh', 55.98, -3.17],
  lismore: ['Lismore Castle, Ireland', 52.14, -7.93],
  woolsthorpe: ['Woolsthorpe, Lincolnshire', 52.81, -0.63],
  trinity: ['Cambridge', 52.21, 0.12],
  cambridge: ['Cambridge', 52.21, 0.12],
  oxford: ['Oxford', 51.75, -1.26],
  london: ['London', 51.51, -0.13],
  hamburg: ['Hamburg', 53.55, 9.99],
  basel: ['Basel', 47.56, 7.59],
  bern: ['Bern', 46.95, 7.45],
  zurich: ['Zürich', 47.37, 8.54],
  stralsund: ['Stralsund', 54.31, 13.09],
  birstall: ['Birstall, Yorkshire', 53.73, -1.66],
  leeds: ['Leeds', 53.80, -1.55],
  glasgow: ['Glasgow', 55.86, -4.25],
  eaglesfield: ['Eaglesfield, Cumberland', 54.64, -3.40],
  calne: ['Calne, Wiltshire', 51.44, -2.00],
  birmingham: ['Birmingham', 52.49, -1.89],
  uppsala: ['Uppsala', 59.86, 17.64],
  stockholm: ['Stockholm', 59.33, 18.07],
  paris: ['Paris', 48.86, 2.35],
  munich: ['Munich', 48.14, 11.58],
  bristol: ['Bristol', 51.45, -2.59],
  penzance: ['Penzance, Cornwall', 50.12, -5.54],
  manchester: ['Manchester', 53.48, -2.24],
  salford: ['Salford', 53.49, -2.29],
  segovia: ['Spain (Segovia and Madrid)', 40.95, -4.12],
  minesne: ['Mines of north-east England', 54.97, -1.61],
  jena: ['Jena', 50.93, 11.59],
  berlin: ['Berlin', 52.52, 13.40],
  germany: ['Germany', 51.00, 10.40],
  heidelberg: ['Heidelberg', 49.40, 8.67],
  karlsruhe: ['Karlsruhe', 49.01, 8.40],
  christiania: ['Christiania (Oslo)', 59.91, 10.75],
  ghent: ['Ghent', 51.05, 3.72],
  stpetersburg: ['St Petersburg', 59.94, 30.31],
  tobolsk: ['Tobolsk, Siberia', 58.20, 68.25],
  warsaw: ['Warsaw', 52.23, 21.01],
  vienna: ['Vienna', 48.21, 16.37],
  utrecht: ['Utrecht', 52.09, 5.12],
  copenhagen: ['Copenhagen', 55.68, 12.57],
  weymouth: ['Weymouth, England', 50.61, -2.46],
  kungalv: ['Kungälv, Sweden', 57.87, 11.98],
  cern: ['CERN, near Geneva', 46.23, 6.05],
  mediterranean: ['The Mediterranean Sea', 36.0, 18.5],
  guntur: ['Guntur, India', 16.31, 80.44],
  trichy: ['Tiruchirappalli', 10.79, 78.70],
  raruli: ['Raruli, Bengal', 22.60, 89.30],
  calcutta: ['Calcutta (Kolkata)', 22.57, 88.36],
  bangaon: ['Bangaon, West Bengal', 23.04, 88.82],
  dandi: ['Dandi, Gujarat', 21.33, 72.62],
  mumbai: ['Mumbai', 19.08, 72.88],
  brightwater: ['Brightwater, New Zealand', -41.38, 173.11],
  montreal: ['Montreal', 45.50, -73.57],
  boston: ['Boston and around', 42.37, -71.10],
  harvard: ['Harvard, Cambridge, Mass.', 42.37, -71.12],
  massachusetts: ['Woburn, Massachusetts', 42.48, -71.15],
  newjersey: ['Deepwater, New Jersey', 39.69, -75.50],
  minnesota: ['St Paul, Minnesota', 44.95, -93.09],
  titusville: ['Titusville, Pennsylvania', 41.63, -79.67],
  florida: ['Cape Canaveral, Florida', 28.61, -80.60],
  houston: ['Houston', 29.76, -95.37],
  berkeley: ['Berkeley, California', 37.87, -122.27],
  pasadena: ['Pasadena, California', 34.15, -118.14],
  bigsur: ['Big Sur, California', 36.27, -121.81],
  portland: ['Portland, Oregon', 45.52, -122.68],
  maunaloa: ['Mauna Loa, Hawaii', 19.54, -155.58],
};

// Ordered: the first rule that matches decides. Specific names before general ones.
const RULES = [
  [/market street in Mumbai|Mumbai local train/i, 'mumbai'],
  [/kitchen|sports day|rooftop in India|^Mars\b/i, null],
  [/Cavendish Laboratory/, 'cambridge'],
  [/Abdera/, 'abdera'], [/Syracuse/, 'syracuse'], [/^Sicily/, 'sicily'],
  [/Alexandria/, 'alexandria'], [/Natron|salt lakes of Egypt/i, 'natron'], [/Cairo/, 'cairo'],
  [/Padua/, 'padua'], [/^Florence/, 'florence'], [/Bologna/, 'bologna'], [/Vercelli/, 'vercelli'], [/^Turin/, 'turin'],
  [/Prague/, 'prague'], [/Merchiston/, 'merchiston'], [/Leith/, 'merchiston'], [/Lismore/, 'lismore'],
  [/Woolsthorpe/, 'woolsthorpe'], [/Trinity College/, 'trinity'],
  [/Hamburg/, 'hamburg'], [/Basel/, 'basel'], [/Bern\b/, 'bern'], [/^Zürich/, 'zurich'], [/Stralsund/, 'stralsund'],
  [/Birstall/, 'birstall'], [/^Leeds/, 'leeds'], [/Glasgow/, 'glasgow'], [/Eaglesfield/, 'eaglesfield'],
  [/Calne/, 'calne'], [/Birmingham/, 'birmingham'], [/Clapham|Blandford Street|Sotheby|Royal Institution|King's College London|University College London/, 'london'],
  [/^Uppsala/, 'uppsala'], [/Stockholm|^Sweden, 1889/, 'stockholm'],
  [/^Paris/, 'paris'], [/School of Physics and Chemistry, Paris/, 'paris'], [/Munich/, 'munich'],
  [/^Bristol/, 'bristol'], [/Penzance/, 'penzance'], [/^Salford/, 'manchester'], [/Manchester/, 'manchester'],
  [/^Spain/, 'segovia'], [/coal mines/i, 'minesne'], [/^Jena/, 'jena'], [/^Berlin/, 'berlin'], [/^Germany/, 'germany'],
  [/Heidelberg/, 'heidelberg'], [/Karlsruhe/, 'karlsruhe'], [/Christiania/, 'christiania'], [/Ghent/, 'ghent'],
  [/St Petersburg/, 'stpetersburg'], [/Tobolsk/, 'tobolsk'], [/Warsaw/, 'warsaw'], [/^Vienna/, 'vienna'],
  [/Utrecht/, 'utrecht'], [/Copenhagen|Carlsberg/, 'copenhagen'], [/Weymouth/, 'weymouth'], [/Kungälv/, 'kungalv'],
  [/CERN/, 'cern'], [/Mediterranean/, 'mediterranean'],
  [/Guntur/, 'guntur'], [/Tiruchirappalli/, 'trichy'], [/Raruli/, 'raruli'], [/Calcutta|Kolkata/, 'calcutta'],
  [/Bangaon/, 'bangaon'], [/Dandi/, 'dandi'],
  [/Brightwater/, 'brightwater'], [/Montreal/, 'montreal'], [/^Boston/, 'boston'], [/^Harvard/, 'boston'],
  [/^Massachusetts/, 'boston'], [/New Jersey/, 'newjersey'], [/Minnesota/, 'minnesota'],
  [/Titusville/, 'titusville'], [/Florida/, 'florida'], [/Houston/, 'houston'],
  [/^Berkeley/, 'berkeley'], [/^Pasadena/, 'pasadena'], [/Big Sur/, 'bigsur'], [/^Portland/, 'portland'],
  [/Mauna Loa/, 'maunaloa'],
  [/King[’']s College London/, 'london'], [/^Cambridge/, 'cambridge'], [/^Oxford/, 'oxford'], [/^London/, 'london'], [/^East London/, 'london'],
];

// A sortable year from the scene text: "about 450 BCE" -> -450, "about 2,250 years ago" -> -225,
// "the 1780s" -> 1780, "1912 to 1913" -> 1912, "about the year 300" -> 300. null if there is none.
export function yearOf(text) {
  let m = /([\d,]+)\s*years ago/.exec(text);
  if (m) return 2026 - parseInt(m[1].replace(/,/g, ''), 10);
  m = /(\d{1,4})\s*BCE/.exec(text);
  if (m) return -parseInt(m[1], 10);
  m = /\b(1[0-9]{3}|20[0-9]{2})s?\b/.exec(text);
  if (m) return parseInt(m[1], 10);
  m = /the year (\d{1,4})/.exec(text);
  if (m) return parseInt(m[1], 10);
  return null;
}

export function resolve(text) {
  const t = (text || '').trim();
  for (const [rx, key] of RULES) {
    if (rx.test(t)) {
      if (!key) return null;
      const [label, lat, lon] = PLACES[key];
      return { key, label, lat, lon, year: yearOf(t) };
    }
  }
  return null;
}
