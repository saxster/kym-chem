// Authored companions to the book's existing models. No measured output is inferred
// from a canvas: each numerical account reads explicit state published by its widget.
const spec = (lesson, idea, note, task, question, answers, correct, change) => ({
  lesson,
  idea,
  note,
  task,
  question,
  answers,
  correct,
  change,
});
export const ACCOUNTS = {
  brownian: spec(
    'observation-inference',
    'Keep the visible evidence and the proposed mechanism in separate columns: the grain moves; the water-molecule collisions are the model explaining it.',
    'Molecules are enlarged and slowed. Their drawn paths are computed, not microscope observations.',
    'Show the water molecules, then explain what pushes the grain.',
    'Which is experimental evidence?',
    ['The visible grain’s irregular movement', 'The exact coloured molecule paths in this drawing'],
    0,
    ['button', 'Show the water molecules'],
  ),
  goldfoil: spec(
    'inside-atoms',
    'Reconcile the event tally: straight + turned + back = total. A rare outcome can constrain a model even when most events look ordinary.',
    'Nuclei are hugely enlarged and large deflections exaggerated. These counts are simulated, not Geiger–Marsden measurements.',
    'Collect a tally and identify what the rare large turns imply.',
    'What do the rare large deflections support?',
    ['A small region with concentrated positive charge', 'Electrons on measured circular tracks'],
    0,
  ),
  orbitals: spec(
    'electron-patterns',
    'Electron occupancy is a count; a cloud describes a probability distribution. Counting seats does not give an electron’s measured position.',
    'Cloud dots sample a model probability distribution, not measured positions or little electron paths. Full occupancy does not establish stability.',
    'Choose the cloud view and inspect a section.',
    'What does a cloud represent?',
    ['A probability distribution in this model', 'A photograph of the electron’s orbit'],
    0,
    ['button', 'Cut in half'],
  ),
  bondwell: spec(
    'bond-energy-ledger',
    'Use separate entries for the energy of the atoms and energy transferred to or from their surroundings. Returning to separated atoms requires energy input.',
    'The curve between its reference points is an illustrative Morse potential, not a solved quantum calculation. Energy is per mole of bonds.',
    'Set the separation to 74 pm, the minimum of this model.',
    'Separating a bond from its minimum requires…',
    ['Energy input', 'Energy release from breaking the bond'],
    0,
    ['slider', 'Distance between the nuclei', 74],
  ),
  lattice3d: spec(
    'ionic-structures',
    'A formula unit is a ratio in a repeating inventory, not a separate NaCl molecule. Count neighbours around an interior ion.',
    'A finite, enlarged fragment of a repeating lattice; boundary ions have missing neighbours outside the picture.',
    'Show one ion’s neighbours and count them.',
    'An interior ion in this NaCl model has…',
    ['Six nearest neighbours of opposite charge', 'One partner forming a separate NaCl molecule'],
    0,
    ['button', "Show one ion's neighbours"],
  ),
  saltsteps: spec(
    'bond-energy-ledger',
    'Like payments and receipts: +496 − 349 − 787 = −640 kJ per mole, starting from separate gaseous atoms. Energy released by the system goes to the surroundings.',
    'Rounded reference steps start from gaseous atoms, not sodium metal and chlorine molecules. They are not the enthalpy of formation from the elements.',
    'Reach the final stair and reconcile all three signed entries.',
    'The final system is 640 kJ/mol lower, so the surroundings…',
    ['Receive 640 kJ per mole in this account', 'Must supply another 640 kJ per mole'],
    0,
    ['repeat', 'Next step', 3],
  ),
  carbon3d: spec(
    'structure-properties',
    'The stock is carbon in both structures; the connections differ. Equal inventories do not guarantee equal properties.',
    'A finite ball-and-stick fragment. Rods represent bonds; they are not literal rigid sticks or a full macroscopic crystal.',
    'Choose graphite and slide its layers.',
    'What differs between diamond and graphite?',
    ['The arrangement and connections of carbon atoms', 'The identity of the carbon element'],
    0,
    ['tab', 0, 1],
  ),
  molecule3d: spec(
    'bond-polarity-dipoles',
    'A dipole account adds directed contributions. Equal bond contributions can cancel when their arrows oppose.',
    'Schematic molecular geometry and dipole arrows; sphere sizes and arrow lengths are not measured in this display.',
    'Compare the molecules and explain why geometry matters.',
    'To add dipoles, keep…',
    ['Magnitude and direction', 'Only the number of bonds'],
    0,
    ['tab', 0, 1],
  ),
  states: spec(
    'phase-changes',
    'Keep identity, energy and temperature in separate accounts. During a phase change energy can enter while temperature stays at a plateau.',
    'Twelve drawn water molecules represent a sample. Heating uses rounded near-1-atm reference values per gram; motion and expansion are schematic.',
    'Set added energy to 200 J per gram, inside the melting plateau.',
    'On the melting plateau, added energy chiefly changes…',
    [
      'The arrangement and interactions, not the temperature',
      'The identity of the water molecules',
    ],
    0,
    ['slider', 'Energy added', 200],
  ),
  gasbox: spec(
    'gas-pressure',
    'Keep the amount fixed at 1 mol. Pressure is a response to temperature and volume, not another stock of matter. A count of simulated wall pushes is still model output.',
    'Sixty representatives in a 2D box, with a calibrated pressure indicator. The ideal-gas calculation ignores molecular size and attractions; it is not an experimental measurement.',
    'Double temperature at fixed volume, or double volume at fixed temperature.',
    'At fixed amount and temperature, doubling volume makes ideal pressure…',
    ['Half as large', 'Twice as large'],
    0,
    ['gas'],
  ),
  dilution: spec(
    'concentration',
    'Like spreading the same stock across twice the shelf space: solute amount stays fixed while concentration halves. Stock and stock per litre are different quantities.',
    'Eight symbols represent solute, not eight literal molecules in a real litre. Final volume is idealized; no reaction, loss or mixing contraction is simulated.',
    'Add water until the same eight symbols occupy 2 L.',
    'After dilution, which account is unchanged?',
    ['Total solute amount', 'Concentration per litre'],
    0,
    ['button', 'Add a litre of water'],
  ),
  waterice: spec(
    'phase-changes',
    'The items remain H₂O while the network and spacing change. Hydrogen bonds between molecules are separate from covalent bonds inside each molecule.',
    'Finite schematic samples, not a simulation of a real freezing transition. Dashed intermolecular links are a model convention.',
    'Select ice and distinguish the two kinds of connection.',
    'When ice melts, water molecules chiefly…',
    ['Rearrange their intermolecular network', 'Split into hydrogen and oxygen elements'],
    0,
    ['tab', 0, 1],
  ),
  rearrange: spec(
    'conserve-atoms',
    'Reconcile each element: 4 H before = 4 H after; 2 O before = 2 O after. Two H₂O molecules contain all six starting atoms.',
    'A scripted rearrangement, not a measured reaction path or a prediction that mixing hydrogen and oxygen reacts immediately.',
    'Follow the rearrangement and reconcile hydrogen and oxygen separately.',
    'Which operation balances an equation?',
    ['Changing whole-molecule coefficients', 'Changing subscripts inside a molecule'],
    0,
  ),
  barrier: spec(
    'energy-barriers',
    'Net change is the difference between product and reactant levels. The barrier is a separate temporary requirement; lowering it does not change the net account.',
    'Invented energy units and slowed stochastic crossings. The temperature slider controls an illustrative energy spread, not kelvin.',
    'Warm the model; if offered, switch on the catalyst. Compare the peak with the endpoint levels.',
    'A catalyst changes…',
    [
      'The barrier, while leaving endpoint energy levels fixed',
      'The net energy difference between reactants and products',
    ],
    0,
    ['barrier'],
  ),
  equilibrium: spec(
    'dynamic-equilibrium',
    'Like a stockroom with deliveries and dispatches: inventories A and B are stocks; forward and reverse changes per second are rates. Equal rates do not require equal stocks.',
    'A stochastic first-order A ⇌ B teaching model: six symbols per model unit. Rate constants are illustrative; finite counts fluctuate.',
    'Double both rate constants and compare the eventual stock ratio.',
    'At dynamic equilibrium, the quantities that match are…',
    ['Opposing rates', 'Necessarily the two inventories'],
    0,
    ['button', 'Both constants doubled'],
  ),
  molezoom: spec(
    'the-mole',
    'Like converting a counted order to its size: a mole specifies a count of entities, not a particular mass or length. Always name the entity.',
    'A schematic journey across scales; positions and intermediate pictures are illustrative, not a microscope zoom recording.',
    'Zoom to the atomic end and distinguish a count from a size.',
    'One mole specifies…',
    ['A number of specified entities', 'The same mass for every substance'],
    0,
    ['slider', 'Zoom', 100],
  ),
  limiting: spec(
    'limiting-reactant',
    'Like packing orders from a stockroom: only complete 2 H₂ + 1 O₂ sets react. Starting atoms = atoms in water + atoms in leftover reactants.',
    'A scripted complete-reaction counting model. Leftovers are included; collisions, conditions and reaction feasibility are not predicted.',
    'Choose 5 H₂ + 3 O₂ and account for both leftovers.',
    'After complete reacting sets, the leftovers are…',
    ['1 H₂ and 1 O₂', 'No reactants'],
    0,
    ['tab', 0, 1],
  ),
  protontransfer: spec(
    'proton-transfer',
    'The proton changes partner; the bonding electron pair remains with chlorine. Atom totals and signed charge must each reconcile.',
    'A scripted representation of HCl reacting with water. The free proton is not shown as an isolated stable species in water.',
    'Follow the proton and the electron pair into the products.',
    'The total product charge is…',
    ['Zero: +1 on H₃O⁺ and −1 on Cl⁻', '+2 because both products are ions'],
    0,
  ),
  weakacid: spec(
    'strong-vs-concentrated',
    'Keep total acid units separate from ionized acid units. Strength is the tendency to ionize; concentration is total amount per volume.',
    'Ionization is exaggerated to about 1 in 18 for visibility, rather than the roughly 1 in 240 reference example at 1 mol/L. Rates and motion are illustrative.',
    'Watch an acid unit split and rejoin, then identify the conserved inventory.',
    'An ionized acid unit gives…',
    ['One hydronium and one conjugate-base ion', 'A missing atom that leaves the account'],
    0,
  ),
  titration: spec(
    'titration-buffers',
    'Reconcile amounts before calculating concentration: incoming OH⁻ consumes acid. Then use the new total volume and equilibrium to calculate pH.',
    '25 °C dilute-solution model with ideal activities, 25 mL of 0.100 mol/L acid and 0.100 mol/L titrant. Indicator colours are illustrative.',
    'Add 25.0 mL of base and compare the strong and weak acid accounts.',
    'Equal acid and base amounts necessarily give pH 7 for…',
    ['This strong acid–strong base case at 25 °C', 'Every weak acid titration too'],
    0,
    ['slider', 'Base added', 25],
  ),
  zncu: spec(
    'electron-transfer',
    'A matched transfer: one Zn loses 2 e⁻; one Cu²⁺ gains those same 2 e⁻. Keep the two element inventories and the ionic charge ledger separate.',
    'A few scripted surface events, not a quantitative rate model. Sulfate spectators balance solution charge but do not receive the electrons.',
    'Follow one completed transfer and reconcile both half-reactions.',
    'Electrons lost by zinc equal…',
    ['Electrons gained by copper ions', 'Protons gained by copper ions'],
    0,
  ),
  daniell: spec(
    'galvanic-electrolytic-cells',
    'Match electrons out of zinc with electrons into copper. Salt-bridge ions carry charge through solution; electrons take the external wire.',
    'A few enlarged scripted transfers. Charge build-up and current are qualitative, not predictions of amperes or cell voltage.',
    'Remove the salt bridge and explain why flow stops.',
    'The salt bridge carries…',
    ['Ions, maintaining charge balance in the solutions', 'Electrons between the two beakers'],
    0,
    ['button', 'Remove the salt bridge'],
  ),
  skyline: spec(
    'ionization-energy-trend',
    'Compare like columns: atomic radius is a length and ionization energy is energy per mole. They cannot share an additive balance.',
    'Element-reference values and missing entries have the conditions and limitations in the periodic-table sources. Bar height is a visual mapping, not a literal atom.',
    'Choose a property and compare a period with a group.',
    'Before comparing heights, check…',
    ['The property, units and reference convention', 'Only the element’s colour'],
    0,
    ['tab', 0, 1],
  ),
  spectrum: spec(
    'electron-patterns',
    'Energy is transferred in discrete differences between levels. A wavelength is not itself an energy balance; shorter wavelength means a larger photon energy.',
    'A schematic level model with selected spectral lines; brightness and event timings are illustrative, not a complete experimental spectrum.',
    'Give the atom energy and follow the emitted lines.',
    'A photon is emitted when an electron…',
    ['Moves to a lower energy level', 'Stays at the same energy level'],
    0,
    ['button', 'Give it energy'],
  ),
  organic3d: spec(
    'structural-isomers-connectivity',
    'An atom inventory is like a parts list; connectivity describes assembly. Isomers can have equal counts but different structures.',
    'Ball-and-stick examples with schematic bond lengths and conformations. Formula equality alone does not determine a boiling point or stability.',
    'Compare the available structures; count first, then trace the connections.',
    'Structural isomers differ in…',
    ['Connectivity, even with the same molecular formula', 'The meaning of the carbon element'],
    0,
    ['tab', 0, 1],
  ),
  ethane3d: spec(
    'unsaturated-bonds-geometry',
    'Inventory and geometry are separate entries: ethane is C₂H₆ and ethene is C₂H₄. Changing the displayed example does not perform a chemical reaction.',
    'Twisting is slowed or exaggerated. A double bond restricts rotation; rods and fixed sphere sizes are representational conventions.',
    'Choose ethene and try to twist the double bond.',
    'Compared with the single bond, the double bond…',
    ['Restricts rotation', 'Allows free rotation without changing the bond'],
    0,
    ['tab', 0, 1],
  ),
  licell: spec(
    'rechargeable-lithium-cells',
    'Reconcile lithium on both sides plus lithium in transit. Li⁺ crosses the electrolyte while matched electrons take the external circuit. Charging needs an external energy input.',
    'Eight lithium representatives and scripted movement; this does not calculate capacity, voltage, degradation or safe charging conditions.',
    'Switch from discharge to charge and follow the two paths.',
    'During charging, energy is supplied by…',
    ['The charger', 'Breaking bonds for free'],
    0,
    ['tab', 0, 1],
  ),
};
export const number = (v) =>
  Number(v.toPrecision(5)).toLocaleString('en-GB', { maximumSignificantDigits: 5 });
export function entries(name, s = {}) {
  const row = (label, value, unit) => [label, number(value), unit];
  switch (name) {
    case 'dilution':
      return {
        rows: [
          row('Solute stock', s.N, 'representative symbols'),
          row('Final volume', s.litres, 'L'),
          row('Stock per litre', s.N / s.litres, 'symbols/L'),
        ],
        equation: `c = N/V = ${s.N} ÷ ${s.litres} = ${s.N / s.litres} representative symbols/L. Opening stock 8 + solute in 0 − solute out 0 = closing stock 8.`,
      };
    case 'gasbox':
      return {
        rows: [
          row('Amount', 1, 'mol'),
          row('Temperature', s.T, 'K'),
          row('Final volume', s.V, 'L'),
          row('Ideal pressure', (8.314462618 * s.T) / s.V, 'kPa'),
        ],
        equation: `P = nRT/V = 1 × 8.314462618 × ${s.T} / ${s.V} = ${number((8.314462618 * s.T) / s.V)} kPa. R uses kPa·L/(mol·K).`,
      };
    case 'limiting':
      return {
        rows: [
          row('Starting H₂', s.mix[0], 'molecules'),
          row('Starting O₂', s.mix[1], 'molecules'),
          row('Water after complete sets', 2 * s.nSets, 'molecules'),
          row('Leftover H₂', s.leftH, 'molecules'),
          row('Leftover O₂', s.leftO, 'molecules'),
        ],
        equation: `H: ${2 * s.mix[0]} before = ${4 * s.nSets} in water + ${2 * s.leftH} in leftovers. O: ${2 * s.mix[1]} before = ${2 * s.nSets} in water + ${2 * s.leftO} in leftovers. These are end-of-reaction counts, not the current animation frame.`,
      };
    case 'equilibrium': {
      const [a, b] = s.counts;
      return {
        rows: [
          row('Stock A', a / 6, 'model units'),
          row('Stock B', b / 6, 'model units'),
          row('Expected forward rate', (s.kf * a) / 6, 'model units/model s'),
          row('Expected reverse rate', (s.kr * b) / 6, 'model units/model s'),
        ],
        equation: `Total stock = A + B = ${number((a + b) / 6)} model units. Rate constants: k_forward = ${s.kf}, k_reverse = ${s.kr} per model second. Counted stochastic rates fluctuate around their expectations.`,
      };
    }
    case 'barrier':
      return {
        rows: [
          row('Reactant level', s.Rlev, 'model energy units'),
          row('Product level', s.Plev, 'model energy units'),
          row('Peak', s.peak, 'model energy units'),
          row('Forward barrier', s.peak - s.Rlev, 'model energy units'),
        ],
        equation: `Net change = ${s.Plev} − ${s.Rlev} = ${s.Plev - s.Rlev}; barrier = ${s.peak} − ${s.Rlev} = ${s.peak - s.Rlev} model energy units. They are different entries.`,
      };
    case 'bondwell':
      return {
        rows: [
          row('Nuclear separation', s.r, 'pm'),
          row('Illustrative energy relative to separate atoms', s.energy, 'kJ/mol'),
        ],
        equation: `E(r) = 436[1 − exp(−0.0194(r − 74))]² − 436 kJ/mol; r = ${number(s.r)} pm gives ${number(s.energy)} kJ/mol. At 74 pm the teaching level is −436 kJ/mol. This scale uses rounded 298 K bond enthalpy, not electronic well depth De or spectroscopic D0.`,
      };
    case 'saltsteps':
      return {
        rows: [
          row('Steps completed', s.step, 'steps'),
          row('System energy level', [0, 496, 147, -640][s.step], 'kJ/mol'),
        ],
        equation:
          'Closing level = opening level + signed changes = 0 + 496 − 349 − 787 = −640 kJ/mol after all three steps.',
      };
    case 'titration':
      return {
        rows: [
          row('Initial acid amount', 2.5, 'mmol'),
          row('Added hydroxide', 0.1 * s.vb, 'mmol'),
          row('Total volume', 25 + s.vb, 'mL'),
          row('Calculated pH', s.pH, 'dimensionless'),
        ],
        equation: `n(OH⁻) = 0.100 mol/L × ${s.vb} mL = ${number(0.1 * s.vb)} mmol. At 25 mL: 2.5 mmol acid matches 2.5 mmol base. pH still depends on the acid equilibrium.`,
      };
    case 'goldfoil': {
      const n = s.n;
      return {
        rows: Object.entries(n).map(([k, v]) => row(k, v, 'simulated events')),
        equation: `Total simulated events = ${n.straight} + ${n.turned} + ${n.back} = ${n.straight + n.turned + n.back}. This is a model tally, not experimental data.`,
      };
    }
    case 'zncu':
      return {
        rows: [
          row('Zn on strip', s.znStrip, 'atoms'),
          row('Zn in solution', s.znIon, 'ions'),
          row('Cu on strip', s.cuMetal, 'atoms'),
          row('Cu in solution', s.cuIon, 'ions'),
          row('Electrons transferred', s.e, 'electrons'),
        ],
        equation: `Zn → Zn²⁺ + 2e⁻; Cu²⁺ + 2e⁻ → Cu. ${s.e} electrons lost = ${s.e} gained. Transfers are staged; reconcile completed events.`,
      };
    case 'daniell':
      return {
        rows: [
          row('Electrons out of zinc', s.passed, 'electrons'),
          row('Electrons into copper', s.passed, 'electrons'),
        ],
        equation: `Matched transfer: ${s.passed} electrons out = ${s.passed} electrons in. Half-reactions use pairs; an odd running count is a partly completed pair.`,
      };
    case 'licell':
      return {
        rows: [
          row('Lithium at graphite', s.g, 'representatives'),
          row('Lithium at oxide', s.o, 'representatives'),
          row('Lithium in transit', s.transit, 'representatives'),
        ],
        equation: `Total lithium = ${s.g} + ${s.o} + ${s.transit} = 8 representatives. Motion changes location, not the lithium inventory.`,
      };
    case 'states':
      return {
        rows: [
          row('Energy added per gram', s.E, 'J/g'),
          row('Water molecules drawn', 12, 'representatives'),
        ],
        equation: `Opening water inventory 12 + water in 0 − water out 0 = closing inventory 12. Energy added is a different account: ${number(s.E)} J/g.`,
      };
    case 'rearrange':
      return {
        rows: [
          row('Hydrogen before', 4, 'atoms'),
          row('Hydrogen after', 4, 'atoms'),
          row('Oxygen before', 2, 'atoms'),
          row('Oxygen after', 2, 'atoms'),
        ],
        equation:
          '2 H₂ + O₂ → 2 H₂O. Each element reconciles; atom conservation alone does not predict a reaction rate.',
      };
    case 'protontransfer':
      return {
        rows: [
          row('H atoms, each side', 3, 'atoms'),
          row('O atoms, each side', 1, 'atom'),
          row('Cl atoms, each side', 1, 'atom'),
          row('Total charge, each side', 0, 'elementary charge units'),
        ],
        equation:
          'HCl + H₂O → Cl⁻ + H₃O⁺. Charge: 0 + 0 = −1 + 1 = 0. An individual ion can be charged while the whole account balances.',
      };
    default:
      return { rows: [], equation: '' };
  }
}
