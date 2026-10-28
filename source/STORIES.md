# Stories behind the ideas: plan and standards

Each story is `src/stories/<id>.md` (format in stories.py's docstring; `src/stories/mole.md` is the model to match).
Terms are the words in the book that link to the story: each term belongs to exactly one story (listed below; do not add
terms that belong to another story). The build links the first mention per chapter. Never use everyday words that also have a non-chemistry meaning in the book (e.g. group, period, unit, base, reduced) as terms.

## Voice

* A true adventure, then the idea, step by step. Open with a scene (`:::scene Place, year`): a real place, a real person,
  a real puzzle. Let Kym (12) stand beside the people who worked it out: what they saw, what they tried, what went wrong,
  what surprised them. Then slow down and explain the idea with hand-holding: numbered steps (`#### Step 1: ...`),
  everyday analogies, a worked example (`:::work`), the common slip (`:::careful`), something to do (`:::home`,
  kitchen-safe only).
* 800–1,500 words for big stories, 500–900 for thinking tools. Plain words, short sentences, vivid and warm, never cute.
* History must be true. Real names, dates, places. If a famous anecdote is doubtful (Mendeleev dreaming the table,
  Kekulé's snake, Archimedes' bath), say it is a legend or leave it out. Hedge uncertain details ("around", "about").
  Compute every number with Python.
* People in the stories are people: include women and non-European scientists where the history genuinely involves them
  (e.g. Marie Curie, Harriet Brooks, Kathleen Lonsdale, Dorothy Hodgkin, Rosalind Franklin, C. V. Raman, Prafulla
  Chandra Ray, Asima Chatterjee, Yuan T. Lee, Akira Yoshino) but never shoehorn: only where it is the real story.
* No :::note, :::check, :::case, :::next or :::try blocks inside stories. Figures: reuse any existing figure function
  (`:::fig c6_mole_piles()`), or add new ones in `figs_stories_<yourgroup>.py` (names prefixed `s_`). Live figures may be
  attached with `:::live` as in chapters.
* Close with one or two sentences that tie back to the main book.

## The stories (id, title idea, group, sort year, terms, beats)

### Inside the atom (group: atoms)
- `atoms` — Can you cut forever? Democritus to Dalton. sort −400. terms: atom, atoms, atomic theory, Democritus, Dalton. Beats: Leucippus & Democritus, Aristotle's rejection, Dalton's 1808 weights & symbols, why most scientists doubted atoms until Perrin.
- `electron` — The particle in the glowing tube. sort 1897. terms: electron, electrons, cathode rays, J. J. Thomson, Thomson. Beats: Crookes tubes, Thomson's e/m, plum pudding model.
- `nucleus` — The shell that bounced back. sort 1909. terms: nucleus, nuclei, gold foil, gold-foil, Rutherford, alpha particles, Geiger, Marsden. Beats: Manchester lab, scintillation counting in the dark, Rutherford's tissue-paper line.
- `neutron` — Same element, different weight. sort 1913. terms: isotope, isotopes, neutron, neutrons, Chadwick, Soddy, mass spectrometer, Aston. Beats: Soddy names isotopes (word suggested by Margaret Todd), Aston, Chadwick 1932.
- `quantum` — Why electrons don't fall in: Bohr and the quantum. sort 1913. terms: shell, shells, energy level, energy levels, orbital, orbitals, Bohr, quantum. Beats: the problem of a collapsing atom, Bohr's levels, spectral lines, then orbitals as clouds of probability; models improving.
- `spectra` — Fingerprints of light. sort 1859. terms: flame test, spectrum, spectra, spectroscope, helium, fireworks. Beats: Bunsen & Kirchhoff discover caesium and rubidium; 1868 eclipse in Guntur, India: Janssen sees a new yellow line; Lockyer names helium; Diwali fireworks colours.
- `radioactivity` — Atoms that change. sort 1896. terms: radioactive, radioactivity, half-life, carbon-14, Marie Curie, Becquerel. Beats: Becquerel's plates, the Curies' shed, polonium & radium, Rutherford & Soddy, Libby's carbon dating 1949.

### Elements, bonds and the states of matter (group: matter)
- `periodic-table` — The patience game: the story of the periodic table. sort 1869. terms: periodic table, Mendeleev, Mendeleyev. Beats: Döbereiner triads, Newlands' octaves laughed at, Meyer, Mendeleev's gaps and predictions (eka-aluminium = gallium 1875, scandium, germanium), card legend flagged, Ramsay's noble gases, Moseley's reorder, Seaborg.
- `atomic-number` — Henry Moseley's staircase. sort 1913. terms: atomic number, Moseley. Beats: X-ray spectra, staircase, missing elements found, his death at Gallipoli.
- `elements` — From four elements to 118. sort 1661. terms: element, elements, compound, compounds, mixture, mixtures, Boyle, Davy. Beats: earth/air/fire/water, alchemists, Boyle's Sceptical Chymist, Lavoisier's list (with "light" and "caloric"), Davy's electrolysis of potash 1807, newest elements.
- `ions` — Charged travellers: Faraday's ions and Arrhenius's risky thesis. sort 1834. terms: ion, ions, electrolysis, Faraday, Arrhenius. Beats: Faraday names ion/anode/cathode with Whewell; Arrhenius 1884 thesis barely passed, Nobel 1903.
- `bonds` — Dots and lines: how atoms hold hands. sort 1916. terms: chemical bond, chemical bonds, covalent, covalent bond, shared electrons, Lewis, Pauling. Beats: G. N. Lewis's cube notes, electron-pair bond, Pauling's Nature of the Chemical Bond.
- `crystals` — The Braggs see inside salt. sort 1913. terms: crystal, crystals, lattice, X-ray crystallography, Bragg. Beats: von Laue 1912, father and son Bragg, salt has no molecules (some chemists objected!), later Lonsdale (benzene flat 1929) and Hodgkin.
- `polarity` — Who pulls harder? Polarity and electronegativity. sort 1932. terms: electronegativity, polar, polarity, dipole, dipoles, Debye. Beats: Debye's dipole moments, Pauling's scale 1932, why it matters for water.
- `carbon-forms` — Pencils, diamonds and footballs. sort 1797. terms: diamond, graphite, allotrope, allotropes, graphene, buckminsterfullerene. Beats: Lavoisier burns diamond with a giant lens 1772, Tennant 1797, Kroto/Smalley/Curl 1985, graphene with sticky tape 2004.
- `gas-laws` — Air has weight: pumps, J-tubes and balloons. sort 1662. terms: pressure, gas law, gas laws, Boyle's law, Torricelli, Charles, Gay-Lussac, ideal gas. Beats: Torricelli's barometer 1643, Boyle & Hooke's pump, J-tube; 1783 balloon race (Montgolfier hot air vs Charles hydrogen), Gay-Lussac's 1804 ascent.
- `temperature` — How cold can cold get? sort 1848. terms: temperature, kelvin, absolute zero, Kelvin. Beats: thermometers (Fahrenheit, Celsius), extrapolating gases to −273 °C, William Thomson / Lord Kelvin, nobody reaches absolute zero.
- `kinetic` — A storm of tiny billiard balls. sort 1859. terms: kinetic theory, molecular motion, Maxwell, Boltzmann, speed of molecules. Beats: Bernoulli 1738, Maxwell's speed spread, Boltzmann's struggle for atoms.
- `brownian` — The dance that proved atoms are real. sort 1905. terms: Brownian motion, Robert Brown, Einstein, Perrin, Jean Perrin. Beats: Brown 1827 pollen particles, Einstein 1905, Perrin's measurements, Ostwald convinced.
- `water` — The strange case of water. sort 1912. terms: hydrogen bond, hydrogen bonds, hydrogen bonding, ice. Beats: why ice floats and lakes freeze from the top, water's high boiling point, Latimer & Rodebush 1920 hydrogen bond idea; monsoon & sweating.

### Reactions, energy and balance (group: change)
- `lavoisier` — The man who weighed everything. sort 1774. terms: conservation of mass, Lavoisier, phlogiston, combustion, Priestley, Scheele. Beats: phlogiston theory, Scheele & Priestley find oxygen, Lavoisier's sealed vessels with Marie-Anne Paulze Lavoisier, guillotine 1794.
- `symbols` — Letters for atoms: the language of chemistry. sort 1813. terms: chemical formula, chemical formulas, chemical formulae, formula, symbol, symbols, chemical equation, chemical equations, Berzelius. Beats: alchemical symbols, Dalton's circles, Berzelius letters 1813, subscripts.
- `energy` — Heat is motion. sort 1845. terms: energy, heat, exothermic, endothermic, calorimeter, Joule, conservation of energy. Beats: caloric theory, Rumford's cannons, Joule's paddle wheel, Lavoisier & Laplace ice calorimeter.
- `catalysts` — Why the match needs striking. sort 1889. terms: activation energy, barrier, catalyst, catalysts, enzyme, enzymes, catalysis. Beats: Berzelius names catalysis 1835, Döbereiner's lamp, Arrhenius 1889, enzymes, glowstick in hot and cold water.
- `equilibrium` — The lakes of Egypt and the balance that never stops. sort 1803. terms: equilibrium, dynamic equilibrium, reversible, Le Châtelier, Berthollet. Beats: Berthollet in Napoleon's expedition sees soda at salt lakes, Guldberg & Waage 1864, Le Châtelier 1884.
- `haber` — Bread from air. sort 1909. terms: ammonia, Haber, Bosch, fertiliser, fertilizer. Beats: nitrogen hunger, Crookes' 1898 warning, Haber's table-top 1909, Bosch's giant reactors, half the nitrogen in our bodies, the darker side (chlorine gas) told honestly and gently.

### Counting the uncountable (group: quantity)
- `mole` — DONE (model story).
- `avogadro` — The forgotten idea: Avogadro's hypothesis and the Karlsruhe congress. sort 1811. terms: Avogadro, Avogadro's hypothesis, Cannizzaro, Karlsruhe. Beats: Gay-Lussac's volumes, Avogadro's 1811 paper ignored ~50 years, Karlsruhe 1860, Cannizzaro's pamphlet that Meyer read on the train home.
- `avogadro-number` — How big is Avogadro's number? sort 1865. terms: Avogadro's constant, Avogadro's number, Avogadro constant, Loschmidt. Beats: Loschmidt, Perrin, oil-drop-on-water estimate (Franklin's pond, Rayleigh), silicon sphere, 2019 exact; analogies computed.
- `relative-mass` — How do you weigh an atom? sort 1808. terms: relative atomic mass, atomic mass, atomic masses, atomic weight, atomic weights, unified atomic mass unit. Beats: Dalton H=1, Berzelius O=100, O=16, carbon-12 in 1961, why masses aren't whole numbers.
- `concentration` — How strong is your sharbat? sort 9999 (tool). terms: concentration, concentrations, mol/L, moles per litre, dilution, diluted, solute, solvent. Step-by-step with drinks.

### Acids, electricity and batteries (group: electrons)
- `acids` — Sour and slippery: what is an acid? sort 1923. terms: acid, acids, Brønsted, Lowry, indicator, indicators, litmus. Beats: Boyle's syrup of violets, Lavoisier thought oxygen = acid-maker, Davy shows HCl has no oxygen, Arrhenius, Brønsted–Lowry 1923; red-cabbage indicator at home.
- `ph` — Sørensen's brewery. sort 1909. terms: pH, pH scale, Sørensen, hydronium, H₃O⁺. Beats: Carlsberg laboratory, beer and enzymes, why a log scale, the glass electrode.
- `buffers` — How your blood stays at 7.4. sort 1908. terms: buffer, buffers, buffer solution, blood. Beats: Henderson 1908, Hasselbalch, CO₂/bicarbonate, why a few tenths matter.
- `batteries` — Frogs' legs and the first battery. sort 1800. terms: battery, batteries, Volta, Galvani, voltaic pile, Daniell cell, galvanic cell, salt bridge. Beats: Galvani's twitching frogs 1780s–1791, Volta's pile 1800, Napoleon's demonstration, Daniell 1836 & telegraphs.
- `redox` — Rust, fire and moving electrons. sort 1807. terms: oxidation, reduction, redox, oxidised, oxidized, reactivity series, rust. Beats: "oxidation" from oxygen, the electron view, OIL RIG, Davy isolates sodium and potassium, the Statue of Liberty's green copper.
- `lithium-ion` — The battery in your pocket. sort 1976. terms: lithium-ion, rechargeable, rechargeable battery. Beats: Whittingham 1970s (Exxon), Goodenough's cobalt oxide 1980 (Oxford), Yoshino's carbon anode 1985, Sony 1991, Nobel 2019 (Goodenough aged 97, the oldest laureate).

### Carbon, life and the planet (group: carbon)
- `organic` — Life's chemistry is just chemistry. sort 1828. terms: organic, organic chemistry, vitalism, Wöhler, urea. Beats: vital force belief, Wöhler makes urea 1828, Kolbe, (myth that it killed vitalism overnight is too simple, say so), today's medicines; Asima Chatterjee's work on plant compounds.
- `tetrahedron` — Molecules in three dimensions. sort 1874. terms: tetrahedral, tetrahedron, van 't Hoff, Le Bel, structural formula, skeletal formula. Beats: van 't Hoff (first Nobel in chemistry 1901) and Le Bel independently 1874, Kolbe's scornful review.
- `isomers` — Two chemists, two silver salts. sort 1830. terms: isomer, isomers, Liebig, isomerism. Beats: Liebig's silver fulminate (explosive) vs Wöhler's silver cyanate (not), same formula, friendship, Berzelius names isomers 1830.
- `keeling` — The man who measured the air. sort 1958. terms: Keeling, carbon dioxide in the air, Mauna Loa, ocean acidification. Beats: Keeling's 1958 measurements, the curve's sawtooth (Earth breathing), ~315 to 420+ ppm, the ocean as a sponge.

### Thinking tools (group: tools; sort 9999)
- `models` — What is a scientific model? terms: model, models, scientific model. Maps, globes, the plum pudding to quantum, "all models are wrong, some are useful" (George Box).
- `powers-of-ten` — Powers of ten, step by step. terms: powers of ten, power of ten, scientific notation, standard form.
- `logarithms` — Counting zeros: logarithms without fear. terms: logarithm, logarithms, logarithmic.
- `units` — The unit-cancelling trick. terms: units cancel, conversion factor, unit-cancelling.
- `averages` — Weighted averages, step by step. terms: weighted average, average atomic mass.
- `proportion` — Doubling and halving: proportion. terms: proportional, inversely proportional, in proportion.
