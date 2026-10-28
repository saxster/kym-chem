// The 118 elements and how people found them.
// year: the year an element was first recognised as new (the date most periodic tables give; usually the first
// isolation or first clear identification). Ancient elements carry label 'Ancient' and a rough sort year.
// Sources: Wikipedia "Timeline of chemical element discoveries"; RSC Periodic Table (rsc.org/periodic-table);
// where credit is shared or disputed the `who` field says so. With these years exactly 63 elements are known by
// 1869, the number Mendeleev arranged (helium, 1868, counts though he did not know it; fluorine, isolated 1886, does not
// though he did include it). Where sources differ (e.g. H, O, Pt, Br, Eu, Lu, No, Ts) the commonly printed year is used.
// Fields: [z, symbol, name, year, label, who, place, how, story]
const RAW = [
  [1, 'H', 'Hydrogen', 1766, '', 'Henry Cavendish (named by Lavoisier)', 'London, England', 'Collected as a light, flammable gas when metals dissolve in acid; burning it makes water.', ''],
  [2, 'He', 'Helium', 1868, '', 'Pierre Janssen and Norman Lockyer; found on Earth by William Ramsay in 1895', 'Seen in the Sun from Guntur, India, and London', 'A yellow line in the light of the Sun that matched no known element.', 'ramsay'],
  [3, 'Li', 'Lithium', 1817, '', 'Johan August Arfwedson', 'Stockholm, Sweden', 'Spotted while analysing a mineral from a Swedish island.', 'lithium-ion'],
  [4, 'Be', 'Beryllium', 1798, '', 'Louis-Nicolas Vauquelin', 'Paris, France', 'Found hiding in beryl and emerald.', ''],
  [5, 'B', 'Boron', 1808, '', 'Humphry Davy; Joseph Gay-Lussac and Louis Thénard (at almost the same time)', 'London and Paris', 'Pulled out of borax, a salt used for centuries.', ''],
  [6, 'C', 'Carbon', -3750, 'Ancient', 'Known since prehistoric times', 'Everywhere', 'Charcoal, soot and diamond were known long before anyone knew they were the same element.', 'carbon-forms'],
  [7, 'N', 'Nitrogen', 1772, '', 'Daniel Rutherford', 'Edinburgh, Scotland', 'The part of air left over after a candle and a mouse had used up what they could.', ''],
  [8, 'O', 'Oxygen', 1774, '', 'Carl Wilhelm Scheele (about 1771) and Joseph Priestley (1774); named by Lavoisier (disputed credit)', 'Uppsala, Sweden, and Calne, England', 'A gas from heated mercury oxide that made a candle blaze.', 'priestley'],
  [9, 'F', 'Fluorine', 1886, '', 'Henri Moissan', 'Paris, France', 'So fierce that it took 74 years of attempts, and injured chemists, to free it.', ''],
  [10, 'Ne', 'Neon', 1898, '', 'William Ramsay and Morris Travers', 'London, England', 'Found by boiling off liquid air bit by bit; it glowed crimson in a tube.', 'ramsay'],
  [11, 'Na', 'Sodium', 1807, '', 'Humphry Davy', 'London, England', 'Torn out of molten caustic soda with a huge battery.', 'davy'],
  [12, 'Mg', 'Magnesium', 1755, '', 'Joseph Black (recognised); isolated by Humphry Davy in 1808', 'Edinburgh, Scotland', 'Recognised in Epsom salts; Davy later freed the metal with electricity.', 'davy'],
  [13, 'Al', 'Aluminium', 1825, '', 'Hans Christian Ørsted', 'Copenhagen, Denmark', 'Once more precious than gold, because it was so hard to separate from its ore.', ''],
  [14, 'Si', 'Silicon', 1824, '', 'Jöns Jacob Berzelius', 'Stockholm, Sweden', 'Freed from sand and quartz, which are mostly silicon and oxygen.', ''],
  [15, 'P', 'Phosphorus', 1669, '', 'Hennig Brand', 'Hamburg, Germany', 'Found glowing in boiled-down urine by an alchemist hunting for gold.', 'alchemy'],
  [16, 'S', 'Sulfur', -2000, 'Ancient', 'Known since ancient times', 'Middle East', 'Yellow crystals found near volcanoes; alchemists thought it was half of every metal.', 'alchemy'],
  [17, 'Cl', 'Chlorine', 1774, '', 'Carl Wilhelm Scheele (shown to be an element by Davy in 1810)', 'Uppsala, Sweden', 'A choking green-yellow gas made from hydrochloric acid.', 'scheele'],
  [18, 'Ar', 'Argon', 1894, '', 'Lord Rayleigh and William Ramsay', 'London, England', 'Nitrogen from air weighed slightly more than nitrogen from chemicals; the difference was argon.', 'ramsay'],
  [19, 'K', 'Potassium', 1807, '', 'Humphry Davy', 'London, England', 'The first metal ever freed by electricity: silvery beads that burst into flame on water.', 'davy'],
  [20, 'Ca', 'Calcium', 1808, '', 'Humphry Davy', 'London, England', 'Freed from lime with electricity.', 'davy'],
  [21, 'Sc', 'Scandium', 1879, '', 'Lars Fredrik Nilson', 'Uppsala, Sweden', 'Mendeleev’s predicted “eka-boron”, found in Scandinavian minerals.', 'mendeleev'],
  [22, 'Ti', 'Titanium', 1791, '', 'William Gregor', 'Cornwall, England', 'Found by a clergyman in black sand from a Cornish stream.', ''],
  [23, 'V', 'Vanadium', 1801, '', 'Andrés Manuel del Río (rediscovered by Nils Sefström in 1830)', 'Mexico City, Mexico', 'Found in Mexican lead ore, doubted, then found again in Sweden.', ''],
  [24, 'Cr', 'Chromium', 1797, '', 'Louis-Nicolas Vauquelin', 'Paris, France', 'Named from the Greek for colour, because its compounds are so colourful.', ''],
  [25, 'Mn', 'Manganese', 1774, '', 'Johan Gottlieb Gahn (recognised by Scheele)', 'Sweden', 'Freed from the black mineral pyrolusite.', 'scheele'],
  [26, 'Fe', 'Iron', -3000, 'Ancient', 'Known since ancient times', 'Middle East and Egypt', 'First from fallen meteorites, later smelted from rock.', 'redox'],
  [27, 'Co', 'Cobalt', 1735, '', 'Georg Brandt', 'Stockholm, Sweden', 'Named after the “kobold”, a goblin miners blamed for troublesome ore.', ''],
  [28, 'Ni', 'Nickel', 1751, '', 'Axel Fredrik Cronstedt', 'Stockholm, Sweden', 'From “Old Nick’s copper”, an ore that looked like copper but gave none.', ''],
  [29, 'Cu', 'Copper', -5000, 'Ancient', 'Known since ancient times', 'Middle East', 'One of the first metals people ever used.', 'batteries'],
  [30, 'Zn', 'Zinc', -500, 'Ancient', 'Zinc ores were used to make brass in ancient times; metalworkers in India were making the pure metal by the 1100s; described in Europe by Andreas Marggraf in 1746', 'Indian subcontinent', 'Hard to make because it boils away; Indian furnaces solved this centuries before Europe.', 'batteries'],
  [31, 'Ga', 'Gallium', 1875, '', 'Paul-Émile Lecoq de Boisbaudran', 'Paris, France', 'Mendeleev’s “eka-aluminium”: it melts in your hand.', 'mendeleev'],
  [32, 'Ge', 'Germanium', 1886, '', 'Clemens Winkler', 'Freiberg, Germany', 'Mendeleev’s “eka-silicon”, matching his predictions closely.', 'mendeleev'],
  [33, 'As', 'Arsenic', 1250, 'About 1250', 'Usually credited to Albertus Magnus (disputed); its compounds were known much earlier', 'Germany', 'Its compounds were ancient poisons and paints.', ''],
  [34, 'Se', 'Selenium', 1817, '', 'Jöns Jacob Berzelius and Johan Gahn', 'Stockholm, Sweden', 'Found in sludge from a sulfuric acid works; named after the Moon.', ''],
  [35, 'Br', 'Bromine', 1826, '', 'Antoine-Jérôme Balard (and Carl Löwig, separately)', 'Montpellier, France', 'A red-brown liquid from seaweed ash and salt marsh water.', ''],
  [36, 'Kr', 'Krypton', 1898, '', 'William Ramsay and Morris Travers', 'London, England', 'Named “the hidden one”: it hid in liquid air.', 'ramsay'],
  [37, 'Rb', 'Rubidium', 1861, '', 'Robert Bunsen and Gustav Kirchhoff', 'Heidelberg, Germany', 'Found by two deep red lines in a flame’s spectrum.', 'spectra'],
  [38, 'Sr', 'Strontium', 1790, '', 'Adair Crawford (isolated by Davy in 1808)', 'London, England', 'From a mineral found near the Scottish village of Strontian; gives fireworks their red.', 'davy'],
  [39, 'Y', 'Yttrium', 1794, '', 'Johan Gadolin', 'Turku, Finland', 'From a black rock found in a quarry at Ytterby, Sweden.', ''],
  [40, 'Zr', 'Zirconium', 1789, '', 'Martin Heinrich Klaproth', 'Berlin, Germany', 'Found in the gemstone zircon.', ''],
  [41, 'Nb', 'Niobium', 1801, '', 'Charles Hatchett', 'London, England', 'Found in an American mineral sample in the British Museum.', ''],
  [42, 'Mo', 'Molybdenum', 1778, '', 'Carl Wilhelm Scheele (isolated by Peter Hjelm in 1781)', 'Köping, Sweden', 'Told apart from graphite and lead ore, which look alike.', 'scheele'],
  [43, 'Tc', 'Technetium', 1937, '', 'Carlo Perrier and Emilio Segrè', 'Palermo, Italy', 'The first element made by people, in a particle accelerator; it fills one of Moseley’s gaps.', 'moseley'],
  [44, 'Ru', 'Ruthenium', 1844, '', 'Karl Ernst Claus', 'Kazan, Russia', 'Found in platinum ore from the Ural Mountains and named after Russia.', ''],
  [45, 'Rh', 'Rhodium', 1804, '', 'William Hyde Wollaston', 'London, England', 'Named from the Greek for rose, for its pink salts.', ''],
  [46, 'Pd', 'Palladium', 1803, '', 'William Hyde Wollaston', 'London, England', 'Found in platinum ore and first sold anonymously in a London shop.', ''],
  [47, 'Ag', 'Silver', -3000, 'Ancient', 'Known since ancient times', 'Asia Minor', 'Mined and treasured for over five thousand years.', ''],
  [48, 'Cd', 'Cadmium', 1817, '', 'Friedrich Stromeyer', 'Göttingen, Germany', 'Found as an impurity in zinc compounds.', ''],
  [49, 'In', 'Indium', 1863, '', 'Ferdinand Reich and Hieronymus Theodor Richter', 'Freiberg, Germany', 'Named after the bright indigo line it gives in a spectrum.', ''],
  [50, 'Sn', 'Tin', -3000, 'Ancient', 'Known since ancient times', 'Asia Minor', 'Mixed with copper it made bronze, which gave the Bronze Age its name.', ''],
  [51, 'Sb', 'Antimony', -3000, 'Ancient', 'Known since ancient times', 'Middle East', 'Its black ore was used as eye make-up (kohl) in ancient times.', ''],
  [52, 'Te', 'Tellurium', 1782, '', 'Franz-Joseph Müller von Reichenstein', 'Sibiu, Transylvania (now Romania)', 'Found in gold ore; Mendeleev put it before iodine even though it is heavier.', 'atomic-number'],
  [53, 'I', 'Iodine', 1811, '', 'Bernard Courtois', 'Paris, France', 'Violet fumes rose from seaweed ash treated with acid.', ''],
  [54, 'Xe', 'Xenon', 1898, '', 'William Ramsay and Morris Travers', 'London, England', 'Named “the stranger”: the rarest of the stable gases in air.', 'ramsay'],
  [55, 'Cs', 'Caesium', 1860, '', 'Robert Bunsen and Gustav Kirchhoff', 'Heidelberg, Germany', 'The first element found with a spectroscope: two sky-blue lines in spa water.', 'spectra'],
  [56, 'Ba', 'Barium', 1808, '', 'Humphry Davy (recognised by Scheele in 1772)', 'London, England', 'Freed from its ore with electricity; gives fireworks their green.', 'davy'],
  [57, 'La', 'Lanthanum', 1839, '', 'Carl Gustaf Mosander', 'Stockholm, Sweden', 'Named “the hidden one”: it hid inside cerium ore.', ''],
  [58, 'Ce', 'Cerium', 1803, '', 'Jöns Jacob Berzelius and Wilhelm Hisinger; Martin Klaproth separately', 'Sweden and Germany', 'Named after the asteroid Ceres, discovered two years before.', ''],
  [59, 'Pr', 'Praseodymium', 1885, '', 'Carl Auer von Welsbach', 'Vienna, Austria', 'Split out of “didymium”, which turned out to be two elements.', ''],
  [60, 'Nd', 'Neodymium', 1885, '', 'Carl Auer von Welsbach', 'Vienna, Austria', 'The other half of “didymium”; today it makes the strongest magnets.', ''],
  [61, 'Pm', 'Promethium', 1945, '', 'Jacob Marinsky, Lawrence Glendenin and Charles Coryell', 'Oak Ridge, USA', 'Found among the leftovers of uranium fission; it filled one of Moseley’s gaps.', 'moseley'],
  [62, 'Sm', 'Samarium', 1879, '', 'Paul-Émile Lecoq de Boisbaudran', 'Paris, France', 'Found with a spectroscope in the mineral samarskite.', ''],
  [63, 'Eu', 'Europium', 1901, '', 'Eugène-Anatole Demarçay', 'Paris, France', 'Spotted in a spectrum in 1896 and separated in 1901; it makes the red in old TV screens.', ''],
  [64, 'Gd', 'Gadolinium', 1880, '', 'Jean Charles Galissard de Marignac', 'Geneva, Switzerland', 'Named after Johan Gadolin, the first rare-earth hunter.', ''],
  [65, 'Tb', 'Terbium', 1843, '', 'Carl Gustaf Mosander', 'Stockholm, Sweden', 'Another element from the quarry at Ytterby.', ''],
  [66, 'Dy', 'Dysprosium', 1886, '', 'Paul-Émile Lecoq de Boisbaudran', 'Paris, France', 'Named from the Greek for “hard to get at”.', ''],
  [67, 'Ho', 'Holmium', 1878, '', 'Marc Delafontaine and Jacques-Louis Soret; Per Teodor Cleve separately', 'Geneva and Uppsala', 'Named after Stockholm (Holmia in Latin).', ''],
  [68, 'Er', 'Erbium', 1843, '', 'Carl Gustaf Mosander', 'Stockholm, Sweden', 'Named after Ytterby, like three other elements.', ''],
  [69, 'Tm', 'Thulium', 1879, '', 'Per Teodor Cleve', 'Uppsala, Sweden', 'Named after Thule, an old name for the far north.', ''],
  [70, 'Yb', 'Ytterbium', 1878, '', 'Jean Charles Galissard de Marignac', 'Geneva, Switzerland', 'The fourth element named after the village of Ytterby.', ''],
  [71, 'Lu', 'Lutetium', 1907, '', 'Georges Urbain; Carl Auer von Welsbach and Charles James separately', 'Paris, France', 'The last of the natural rare earths to be found; named after Paris (Lutetia).', ''],
  [72, 'Hf', 'Hafnium', 1923, '', 'Dirk Coster and George de Hevesy', 'Copenhagen, Denmark', 'Found by its X-rays, exactly where Moseley’s staircase said a gap was.', 'moseley'],
  [73, 'Ta', 'Tantalum', 1802, '', 'Anders Gustaf Ekeberg', 'Uppsala, Sweden', 'Named after Tantalus of Greek myth, because it will not dissolve in acid.', ''],
  [74, 'W', 'Tungsten', 1783, '', 'Juan José and Fausto Elhuyar (recognised by Scheele in 1781)', 'Bergara, Spain', 'The metal with the highest melting point; it made the glowing wire in old-style light bulbs.', 'scheele'],
  [75, 'Re', 'Rhenium', 1925, '', 'Walter Noddack, Ida Tacke and Otto Berg', 'Berlin, Germany', 'Found by its X-rays; one of the last stable elements to be discovered.', 'moseley'],
  [76, 'Os', 'Osmium', 1803, '', 'Smithson Tennant', 'London, England', 'Named from the Greek for smell, for the sharp odour of its oxide.', ''],
  [77, 'Ir', 'Iridium', 1803, '', 'Smithson Tennant', 'London, England', 'Named after the rainbow, for its many-coloured salts.', ''],
  [78, 'Pt', 'Platinum', 1748, '', 'Used in South America long before; described in Europe by Antonio de Ulloa', 'South America and Spain', 'Called “little silver” by Spanish explorers, who thought it a nuisance at first.', 'catalysts'],
  [79, 'Au', 'Gold', -4000, 'Ancient', 'Known since prehistoric times', 'Everywhere', 'Found as shining nuggets; the metal every alchemist dreamed of making.', 'transmutation'],
  [80, 'Hg', 'Mercury', -1500, 'Ancient', 'Known since ancient times', 'Egypt, China and India', 'The liquid metal; alchemists thought it was the other half of every metal.', 'transmutation'],
  [81, 'Tl', 'Thallium', 1861, '', 'William Crookes', 'London, England', 'Named from the Greek for green shoot, for its bright green spectral line.', ''],
  [82, 'Pb', 'Lead', -3500, 'Ancient', 'Known since ancient times', 'Asia Minor', 'Soft, heavy and easy to melt; the Romans made water pipes from it.', 'transmutation'],
  [83, 'Bi', 'Bismuth', 1500, 'About 1500', 'Known to miners and alchemists; shown to be a separate element by Claude Geoffroy in 1753', 'Germany', 'Long confused with tin and lead.', 'transmutation'],
  [84, 'Po', 'Polonium', 1898, '', 'Marie and Pierre Curie', 'Paris, France', 'Found because uranium ore was more radioactive than its uranium; named after Poland.', 'curie'],
  [85, 'At', 'Astatine', 1940, '', 'Dale Corson, Kenneth MacKenzie and Emilio Segrè', 'Berkeley, USA', 'Made in an accelerator; the rarest natural element on Earth.', ''],
  [86, 'Rn', 'Radon', 1899, '', 'Ernest Rutherford and Robert Owens (Friedrich Dorn is also credited)', 'Montreal, Canada', 'A radioactive gas that seeped out of thorium compounds.', 'radioactivity'],
  [87, 'Fr', 'Francium', 1939, '', 'Marguerite Perey', 'Paris, France', 'Found by a former assistant of Marie Curie, in the decay of actinium.', ''],
  [88, 'Ra', 'Radium', 1898, '', 'Marie and Pierre Curie', 'Paris, France', 'Glows faintly in the dark; tonnes of ore gave a tenth of a gram.', 'curie'],
  [89, 'Ac', 'Actinium', 1899, '', 'André-Louis Debierne (Friedrich Giesel separately, 1902; credit disputed)', 'Paris, France', 'Found in the leftovers of the Curies’ pitchblende.', ''],
  [90, 'Th', 'Thorium', 1829, '', 'Jöns Jacob Berzelius', 'Stockholm, Sweden', 'Named after Thor, the Norse god of thunder; later found to be radioactive.', 'radioactivity'],
  [91, 'Pa', 'Protactinium', 1913, '', 'Kasimir Fajans and Oswald Göhring; Otto Hahn and Lise Meitner found a longer-lived form in 1918', 'Karlsruhe and Berlin, Germany', 'A radioactive link in the chain from uranium.', 'meitner'],
  [92, 'U', 'Uranium', 1789, '', 'Martin Heinrich Klaproth', 'Berlin, Germany', 'Found in pitchblende and named after the newly found planet Uranus.', 'radioactivity'],
  [93, 'Np', 'Neptunium', 1940, '', 'Edwin McMillan and Philip Abelson', 'Berkeley, USA', 'The first element heavier than uranium, made by hitting uranium with neutrons.', ''],
  [94, 'Pu', 'Plutonium', 1940, '', 'Glenn Seaborg, Edwin McMillan, Joseph Kennedy and Arthur Wahl', 'Berkeley, USA', 'Made from uranium in an accelerator, and kept secret during the war.', ''],
  [95, 'Am', 'Americium', 1944, '', 'Glenn Seaborg, Ralph James, Leon Morgan and Albert Ghiorso', 'Chicago, USA', 'Made in a nuclear reactor; tiny amounts are inside smoke alarms.', ''],
  [96, 'Cm', 'Curium', 1944, '', 'Glenn Seaborg, Ralph James and Albert Ghiorso', 'Berkeley and Chicago, USA', 'Named in honour of Marie and Pierre Curie.', 'meitner'],
  [97, 'Bk', 'Berkelium', 1949, '', 'Stanley Thompson, Albert Ghiorso and Glenn Seaborg', 'Berkeley, USA', 'Made by hitting americium with alpha particles; named after Berkeley.', ''],
  [98, 'Cf', 'Californium', 1950, '', 'Stanley Thompson, Kenneth Street, Albert Ghiorso and Glenn Seaborg', 'Berkeley, USA', 'Made by hitting curium with alpha particles; named after California.', ''],
  [99, 'Es', 'Einsteinium', 1952, '', 'Albert Ghiorso and others', 'Berkeley, USA', 'Found in the debris of the first hydrogen bomb test, and kept secret for years.', ''],
  [100, 'Fm', 'Fermium', 1952, '', 'Albert Ghiorso and others', 'Berkeley, USA', 'Found in the same debris as einsteinium.', ''],
  [101, 'Md', 'Mendelevium', 1955, '', 'Albert Ghiorso, Bernard Harvey, Gregory Choppin, Stanley Thompson and Glenn Seaborg', 'Berkeley, USA', 'The first experiments made only seventeen atoms; named after Mendeleev.', 'mendeleev'],
  [102, 'No', 'Nobelium', 1966, '', 'Georgy Flerov’s team (credit long disputed with Swedish and US teams)', 'Dubna, Russia', 'Named after Alfred Nobel; several teams claimed it first.', ''],
  [103, 'Lr', 'Lawrencium', 1961, '', 'Albert Ghiorso, Torbjørn Sikkeland, Almon Larsh and Robert Latimer (shared credit with Dubna)', 'Berkeley, USA', 'Named after Ernest Lawrence, inventor of the cyclotron.', ''],
  [104, 'Rf', 'Rutherfordium', 1969, '', 'Teams at Dubna and Berkeley (disputed for years; credit shared)', 'Dubna, Russia, and Berkeley, USA', 'Named after Ernest Rutherford.', 'rutherford'],
  [105, 'Db', 'Dubnium', 1970, '', 'Teams at Dubna and Berkeley (disputed; credit shared)', 'Dubna, Russia, and Berkeley, USA', 'Named after the Russian science town of Dubna.', ''],
  [106, 'Sg', 'Seaborgium', 1974, '', 'Albert Ghiorso and others', 'Berkeley, USA', 'Named after Glenn Seaborg while he was still alive.', ''],
  [107, 'Bh', 'Bohrium', 1981, '', 'Peter Armbruster, Gottfried Münzenberg and others', 'Darmstadt, Germany', 'Made atom by atom by fusing nuclei; named after Niels Bohr.', 'bohr'],
  [108, 'Hs', 'Hassium', 1984, '', 'Peter Armbruster, Gottfried Münzenberg and others', 'Darmstadt, Germany', 'Named after the German state of Hesse.', ''],
  [109, 'Mt', 'Meitnerium', 1982, '', 'Peter Armbruster, Gottfried Münzenberg and others', 'Darmstadt, Germany', 'A single atom was enough; named after Lise Meitner.', 'meitner'],
  [110, 'Ds', 'Darmstadtium', 1994, '', 'Sigurd Hofmann and others', 'Darmstadt, Germany', 'Named after the city where it was made.', ''],
  [111, 'Rg', 'Roentgenium', 1994, '', 'Sigurd Hofmann and others', 'Darmstadt, Germany', 'Named after Wilhelm Röntgen, discoverer of X-rays.', ''],
  [112, 'Cn', 'Copernicium', 1996, '', 'Sigurd Hofmann and others', 'Darmstadt, Germany', 'Named after the astronomer Copernicus.', ''],
  [113, 'Nh', 'Nihonium', 2004, '', 'Kosuke Morita’s team', 'Wako, Japan', 'The first element found in Asia; named after Japan (Nihon).', 'periodic-table'],
  [114, 'Fl', 'Flerovium', 1999, '', 'Yuri Oganessian’s team, with US partners', 'Dubna, Russia', 'Named after the Flerov Laboratory, itself named after Georgy Flerov.', ''],
  [115, 'Mc', 'Moscovium', 2003, '', 'Yuri Oganessian’s team, with US partners', 'Dubna, Russia', 'Named after the Moscow region.', 'periodic-table'],
  [116, 'Lv', 'Livermorium', 2000, '', 'Yuri Oganessian’s team, with US partners', 'Dubna, Russia', 'Named after the Lawrence Livermore laboratory in California.', ''],
  [117, 'Ts', 'Tennessine', 2010, '', 'Yuri Oganessian’s team, with US partners', 'Dubna, Russia', 'Its target material came from Tennessee, so it was named after the state.', 'periodic-table'],
  [118, 'Og', 'Oganesson', 2002, '', 'Yuri Oganessian’s team, with US partners', 'Dubna, Russia', 'The heaviest element known; only a handful of atoms have ever existed.', 'periodic-table'],
];

// grid position: [row, col]; rows 1-7 main table, rows 9-10 the f-block shown underneath
function position(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 18];
  const starts = [[3, 2], [11, 3], [19, 4], [37, 5], [55, 6], [87, 7]];
  if (z >= 57 && z <= 71) return [9, z - 57 + 3];
  if (z >= 89 && z <= 103) return [10, z - 89 + 3];
  for (let i = starts.length - 1; i >= 0; i--) {
    const [first, period] = starts[i];
    if (z < first) continue;
    let k = z - first; // index within the period
    if (period <= 3) return [period, k < 2 ? k + 1 : k + 11];
    if (period <= 5) return [period, k + 1];
    // periods 6 and 7: first two, then (f-block taken out) group 3 is a gap marker, then d/p from group 4
    if (k < 2) return [period, k + 1];
    return [period, k - 14 + 1 + 0];
  }
  return [0, 0];
}

const ELEMENTS = RAW.map(([z, symbol, name, year, label, who, place, how, story]) => {
  const [row, col] = position(z);
  return { z, symbol, name, year, label: label || String(year), ancient: label === 'Ancient', who, place, how, story, row, col };
});

export default ELEMENTS;
