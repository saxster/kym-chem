// Words and stage states for the guided explainer at the top of "The periodic table, inside out".
// Every step: kicker, title, body (HTML), optional `ask` (a prediction with options and a reveal), optional `act`
// (a button that changes the stage), and `stage` (the picture on the sticky stage while this step is being read).
//
// Numbers used here, and where they come from:
//  * Row lengths 2, 8, 8, 18, 18, 32, 32 (sum 118) and the s/p/d/f room sizes 2, 6, 10, 14: standard electron
//    configurations (OpenStax Chemistry 2e, section 6.4).
//  * Atom sizes in the wave graph: the single-bond covalent radii of Pyykkö and Atsumi (2009) already used in
//    atlas_data.js (Explore tab). Peaks fall on Li (133 pm), Na (155), K (196), Rb (210), Cs (232).
//  * Lothar Meyer's 1870 curve: Annalen der Chemie, supplement 7 (1870), "Die Natur der chemischen Elemente als
//    Function ihrer Atomgewichte"; he plotted atomic volume against atomic weight. Its peaks also fall on the
//    alkali metals.
//  * Mendeleev's eka-aluminium (1871 predictions): atomic weight about 68, density about 5.9 g/cm³. Gallium
//    (Lecoq de Boisbaudran, 1875): 69.72, density first reported as 4.7, then 5.9 when remeasured.
//  * Tellurium 127.60 and iodine 126.90 (IUPAC standard atomic weights); Te 52 and I 53 protons. Moseley 1913.
//  * Sodium: 11 protons, relative atomic mass 22.99; symbol from the Latin natrium.
//  * About 63 elements known in 1869 (the convention used in ptable_data.js).

export const STEPS = [
  {
    id: 'heap', kicker: 'Start here', title: 'What problem did the table solve?',
    body: `<p class="ptg-ans">It turned what looked like a jumbled heap of ingredients into a map.</p>
<p>Everything you have ever touched, eaten or breathed is built from a short list of ingredients called <b>elements</b>. About ninety of them are found in nature; people have made the rest in laboratories, for 118 in all.</p>
<p>Imagine each one written on a card and tipped into a heap: gold and oxygen, iron and helium, all jumbled together. For most of the 1800s, that is more or less what chemistry looked like. Dozens of elements, each with its own personality, and no map.</p>
<p>The periodic table is that map. Scroll slowly, and you will build it yourself, the way it was first built. By the end you will know why it has its strange shape, and how to read it like a chemist.</p>`,
    stage: { layout: 'heap' },
  },
  {
    id: 'families', kicker: 'Step 1', title: 'Do elements really come in families?',
    body: `<p class="ptg-ans">Yes. Some elements behave so alike that chemists grouped them into <b>families</b> long before anyone drew a table.</p>
<p>Lithium, sodium and potassium are soft metals you can cut with a knife, and all three fizz in water: lithium gently, sodium furiously, potassium so fiercely it bursts into lilac flame. Fluorine, chlorine, bromine and iodine are harsh, choking, bleaching elements that attack metals; chlorine is what keeps swimming pools clean. Helium, neon and argon are the opposite: they hardly react with anything at all.</p>`,
    ask: { q: 'Predict first: here are those ten cards, shuffled. Can you see three families?', btn: 'Sort them', after: '<p>Three families. Which raises the real puzzle: <em>why</em> should elements come in families at all?</p>' },
    stage: { layout: 'shuffle', then: 'families' },
  },
  {
    id: 'row', kicker: 'Step 2', title: 'What happens if you line them up?',
    body: `<p class="ptg-ans">The families turn up again and again, at regular intervals.</p>
<p>By the 1860s chemists could weigh atoms against each other (you met the trick in the mole story), so the obvious thing to try was a line: lightest to heaviest. Here are the first 56 elements in that order, from hydrogen to barium. (It is almost exactly the order of their weights; the few awkward exceptions come later.)</p>
<p>Look where our families have landed. Lithium is number 3, sodium 11, potassium 19. The gaps are the same each time: eight, then eight again.</p>`,
    ask: {
      q: 'Predict first: argon, one of the gases that hardly react, is number 18. Which family will number 19 belong to?',
      options: ['The soft metals that fizz', 'The harsh bleaching ones', 'The gases that hardly react'], correct: 0,
      after: '<p>A fizzing metal: number 19 is potassium. And it happens every time. Straight after each unreactive gas (helium 2, neon 10, argon 18, krypton 36, xenon 54) comes a fizzing metal (lithium 3, sodium 11, potassium 19, rubidium 37, caesium 55).</p>',
    },
    stage: { layout: 'row' },
  },
  {
    id: 'wave', kicker: 'Step 3', title: 'Why is it called “periodic”?',
    body: `<p class="ptg-ans">Because the elements’ properties repeat at regular intervals, the way the days of the week repeat.</p>
<p>Measure something about every atom and draw it as a graph. Here is how big each atom is.</p>
<p>The line climbs and falls, climbs and falls, and every big peak is a fizzing metal: lithium, sodium, potassium, rubidium, caesium. In 1870 the German chemist Lothar Meyer drew a curve very like this one. (He plotted how much room the same number of atoms of each element takes up as a solid, called its atomic volume, rather than atom size, but his peaks land on the same elements.)</p>
<p>Something that repeats is called <b>periodic</b>, like the days of the week, the phases of the Moon, or the tides at Haji Ali. That is where the periodic table gets its name.</p>`,
    stage: { layout: 'wave' },
  },
  {
    id: 'wrap', kicker: 'Step 4', title: 'So what exactly is the periodic table?',
    body: `<p class="ptg-ans">A graph of that repeating pattern, folded into rows, so that elements that behave alike land in the same column.</p>
<p>A calendar does a simple trick with the days of the year. Instead of one endless line, it starts a new row every Monday, so all the Mondays stack up in one column and all the Sundays in another.</p>
<p>Do the same with the elements: start a new row every time you reach a fizzing metal. Watch.</p>
<p>The fizzing metals stack up on the left. The gases that hardly react stack up on the far right, and the bleaching ones line up beside them. Nobody had to sort the families: wrapping the line sorted them by itself.</p>
<p class="ptg-big">That is the whole secret. The periodic table is a graph of a repeating pattern, folded into rows.</p>
<p>Each row is called a <b>period</b>. Each column is called a <b>group</b>, and a group is a family.</p>`,
    stage: { layout: 'wrap' },
  },
  {
    id: 'lengths', kicker: 'Step 5', title: 'Why are the rows different lengths?',
    body: `<p class="ptg-ans">Because each row is as long as the number of electron “seats” filled along it, and that number is 2, then 8, then 18, then 32.</p>
<p>Here is the whole table. Our calendar has one odd feature: its rows are not all the same length. The first row has 2 elements, the next two have 8, the next two have 18, and the last two have 32.</p>
<p>To keep every family in its own column, the short rows at the top are split, with a gap in the middle. That is why the table looks like a castle with two towers.</p>
<p>Why 2, 8, 18 and 32? Hold on to that question. The answer is coming, and it is the best part.</p>`,
    stage: { layout: 'lengths' },
  },
  {
    id: 'mendeleev', kicker: 'Step 6', title: 'Who made it, and how did anyone know it was right?',
    body: `<p class="ptg-ans">Several chemists saw parts of the pattern, but Dmitri Mendeleev made the first great version in 1869, and it was proved right when elements he predicted were found.</p>
<p>When <a class="sl" href="#story-mendeleev" data-story="mendeleev">Dmitri Mendeleev</a> built his table in 1869, about 63 elements were known, and some of his families refused to line up. Instead of forcing them, he did something daring. He left gaps, and said the gaps were elements nobody had found yet.</p>
<p>(Mendeleev knew a few of the elements that now sit in the two floating rows at the bottom, but nobody yet understood where they belonged; those rows were worked out decades later, so they are shown here as outlines.)</p>
<p>Below aluminium he left a space and described the missing element in detail: an atomic weight of about 68, and a density of about 5.9 grams per cubic centimetre.</p>`,
    ask: { q: 'In 1875, a French chemist found a new metal.', btn: 'Drop it in', after: '<p>It was <b>gallium</b>: atomic weight 69.7, density 5.9 (once Mendeleev had persuaded its discoverer to measure it again). A table that could predict things nobody had ever seen was not just a list. It was a law of nature.</p>' },
    stage: { layout: 'mendeleev', then: 'mendeleev-ga' },
  },
  {
    id: 'number', kicker: 'Step 7', title: 'What is the true order?',
    body: `<p class="ptg-ans">Not weight, but the number of protons in each atom: its <b>atomic number</b>.</p>
<p>One thing still nagged. A few pairs sat in the wrong order by weight. Tellurium (127.6) is heavier than iodine (126.9), yet tellurium clearly belongs with oxygen and sulfur, and iodine with chlorine. Mendeleev trusted the chemistry and swapped them.</p>
<p>In 1913 a young physicist in Manchester, <a class="sl" href="#story-moseley" data-story="moseley">Henry Moseley</a>, found the real answer. Every element has a number of its own: the number of protons in its nucleus. That is the true order. Tellurium has 52 protons and iodine 53, so tellurium comes first after all. The weights were never the point.</p>
<p>Now you can read any square on the table.</p>`,
    stage: { layout: 'tile' },
  },
  {
    id: 'electrons', kicker: 'Step 8', title: 'Why does the pattern exist at all?',
    body: `<p class="ptg-ans">Because of the electrons. Elements with the same number of electrons in their outer shell behave alike, and as you go from one element to the next, the outer shell fills up and a new one starts, so the pattern repeats.</p>
<p>They sit around the nucleus in <b>shells</b>, like the floors of a building, and each floor holds only so many. Lithium has 2 electrons on the inside floor and 1 on the outside. Sodium has 2, then 8, then 1. Potassium has 2, 8, 8, then 1.</p>
<p>Three different sizes, but each has exactly <b>one</b> electron on its outermost floor. That outer electron is what other atoms meet first, so the three behave alike. That is what a family is: elements with the same number of outer electrons.</p>
<p>Going down a family adds a floor. Going along a row fills up one floor. In the main families, the columns at the two sides, the column tells you how many outer electrons there are: one in the first column, two in the second, and three to eight across the six columns on the right. (Helium, with only two, is the one exception.)</p>`,
    stage: { layout: 'shells' },
  },
  {
    id: 'blocks', kicker: 'Step 9', title: 'Why that strange shape, and why do two rows float underneath?',
    body: `<p class="ptg-ans">The shape comes from the four sizes of “room” that electrons fill, and the two floating rows are a slice cut out of the middle so the table fits on a page.</p>
<p>Each floor of electrons is divided into rooms, and the rooms come in four sizes, with <b>2, 6, 10 and 14</b> seats. Chemists call them s, p, d and f. As you move along a row, electrons fill the rooms seat by seat, and each kind of room makes one block of the table: 2 columns of s, 6 of p, 10 of d, 14 of f.</p>
<p>Add them up. 2. Then 2 + 6 = <b>8</b>. Then 2 + 6 + 10 = <b>18</b>. Then 2 + 6 + 10 + 14 = <b>32</b>. Those are exactly the row lengths.</p>
<p>Here is the table drawn honestly, with every row in one piece. It is 32 squares wide.</p>`,
    ask: { q: 'Far too wide for a page. So what do printers do?', btn: 'Fold it', after: '<p>They lift out the 14-wide f-block and set it underneath. That is why two rows float below the table: they really belong inside it.</p><p>The rooms do not fill in quite the order you might expect, and chemists still argue about exactly which elements belong in the third column. <a class="sl" href="#story-table-shape" data-story="table-shape">Why the table has that strange shape</a> tells the whole story.</p>' },
    stage: { layout: 'long', then: 'folded' },
  },
  {
    id: 'map', kicker: 'Step 10', title: 'How does it help? Reading the map',
    body: `<p class="ptg-ans">An element’s position tells you what it is like: metal or non-metal, big atoms or small, gentle or fierce.</p>
<p>Once you know why the table is shaped this way, you can read it like a map.</p>
<p><b>Across a row, atoms get smaller.</b> Each step adds a proton, and its extra pull draws the same floors of electrons in tighter. <b>Down a family, atoms get bigger,</b> because each step adds a whole new floor.</p>
<p><b>Metals</b> live on the left and in the middle, <b>non-metals</b> on the right, and a thin staircase of in-between elements, the <b>metalloids</b> such as silicon, runs between them. The most reactive metals sit at the bottom left. The most reactive non-metal, fluorine, sits at the top right, right next to the gases that hardly react at all.</p>`,
    stage: { layout: 'map' },
  },
  {
    id: 'predict', kicker: 'Step 11', title: 'How does it help? Predicting the unknown',
    body: `<p class="ptg-ans">It lets you predict how an element behaves even if you have never seen it, exactly as Mendeleev did.</p>
<p><b>Astatine</b> sits at the bottom of the bleaching family, under iodine. Nobody has ever seen a lump of it: it is so radioactive that only tiny amounts have ever been made. But its address tells you a lot.</p>`,
    quiz: [
      { q: 'Gas, liquid or solid at room temperature?', hint: 'Fluorine and chlorine are gases, bromine is a liquid, iodine is a solid.', options: ['Gas', 'Liquid', 'Solid'], correct: 2,
        why: 'Going down the family the elements go from gas, to liquid, to solid, so astatine should be a solid. Too little has ever been made to see it, so this is a prediction, not an observation.' },
      { q: 'Lighter or darker in colour than iodine?', hint: 'Fluorine is pale yellow, chlorine yellow-green, bromine red-brown, iodine violet-black.', options: ['Lighter', 'Darker'], correct: 1,
        why: 'Each step down the family is darker, so astatine is expected to be darker still, probably black.' },
      { q: 'More like a non-metal, or creeping towards a metal?', hint: 'Down the carbon family: carbon, silicon, germanium, tin, lead.', options: ['Even more of a non-metal', 'Creeping towards a metal'], correct: 1,
        why: 'Down every family on the right, elements become more metallic. Some scientists’ calculations suggest astatine may even be a metal. Nobody has had enough of it to be sure: a real, open question.' },
      { q: 'Element 119 has not been made yet. It would start an eighth row, under francium. Which family would it join?', hint: 'Which family starts every row after the first?', options: ['The fizzing metals', 'The gases that hardly react'], correct: 0,
        why: 'Every row after the first starts with a fizzing metal, so 119 should be one too. Laboratories are trying to make it. If they succeed, you will be able to check this prediction yourself.' },
    ],
    stage: { layout: 'predict' },
  },
  {
    id: 'finished', kicker: 'Step 12', title: 'Is it finished?',
    body: `<p class="ptg-ans">The seven rows are complete, but the table may not be.</p>
<p>The last gaps in the seventh row were filled when elements 113, 115, 117 and 118 were officially confirmed at the end of 2015; they were given their names in 2016. Element 119 has not been made yet. If a laboratory manages it, it will start an eighth row, and the table will grow.</p>
<p>You have now built the periodic table the way it was first built, and you know why it looks the way it does: a repeating pattern, folded into rows, shaped by the rooms that electrons fill.</p>`,
    stage: { layout: 'blocks' },
  },
];

// The three families used in steps 1–3, and the labels for the clusters.
export const FAMILIES = [
  { key: 'alk', label: 'Soft metals that fizz', z: [3, 11, 19] },
  { key: 'hal', label: 'Harsh and bleaching', z: [9, 17, 35, 53] },
  { key: 'nob', label: 'Hardly react at all', z: [2, 10, 18] },
];

// The opening block: the big questions, each answered plainly, each pointing to the step that shows it.
export const FIVE = [
  { q: 'What is it?', a: 'A map of every kind of atom there is, 118 so far, arranged so that elements that behave alike sit in the same column. Each row is called a period and each column a group, or family. One glance tells a chemist roughly how an element will behave.', step: 'wrap' },
  { q: 'Why is it called this?', a: 'It is called periodic because the properties of the elements repeat, the way the days of the week repeat. Line the elements up in order and every so often the same kind of element comes round again: a soft, fizzing metal, then later another, then another. “Periodic” just means repeating at regular intervals.', step: 'wave' },
  { q: 'What problem did it solve?', a: 'By the 1860s chemists knew more than sixty elements. They had spotted a few families, but had no single scheme that organised them all, so most had to be learned one by one. The table turned that heap into a pattern: learn one family and you know a lot about all its members. And because the pattern is real, it predicted elements nobody had found yet, and they were found.', step: 'heap' },
  { q: 'Why does it work?', a: 'Because of electrons. They fill shells around the nucleus, and elements with the same number of electrons in their outer shell behave alike, because the outer electrons are what other atoms meet. From one element to the next the outer shell fills up, then a new one starts, so the pattern repeats.', step: 'electrons' },
  { q: 'How does it help?', a: 'It lets you predict. From an element’s position alone you can say whether it is a metal, roughly how big its atoms are, and how fiercely it will react. Chemists use it every day to guess how substances will behave before they make them, the way you use a map to find a place you have never been.', step: 'map' },
];
export const MORE = [
  { q: 'Who made it?', a: 'Dmitri Mendeleev, in 1869, though others saw parts of the pattern. Henry Moseley fixed its true order in 1913.', step: 'mendeleev' },
  { q: 'Why that strange shape?', a: 'The rows are 2, 8, 18 and 32 long, because of the sizes of the “rooms” electrons fill.', step: 'lengths' },
  { q: 'Why do two rows float underneath?', a: 'They are a slice cut out of the middle so the table fits on a page.', step: 'blocks' },
  { q: 'Is it finished?', a: 'The seventh row was completed in 2015 and 2016, when its last four elements were confirmed and named. Element 119 has not been made yet.', step: 'finished' },
];

// The closing checklist, also used as five "Check yourself" questions.
export const RECAP = [
  { q: 'What is the periodic table?', a: 'A map of all the elements, arranged so that elements that behave alike sit in the same column (a group, or family); each row is a period.' },
  { q: 'Why is it called “periodic”?', a: 'Because the elements’ properties repeat at regular intervals, like the days of the week; the table wraps that repeating pattern into rows, the way a calendar wraps days into weeks.' },
  { q: 'What problem did it solve?', a: 'It turned a heap of unrelated elements into a pattern you can learn family by family, and it predicted elements before they were found, such as gallium in 1875.' },
  { q: 'Why does the pattern exist?', a: 'Because elements with the same number of outer electrons behave alike, and the outer shell fills up and starts again as you go from element to element.' },
  { q: 'How does it help?', a: 'Position predicts behaviour: whether an element is a metal, how big its atoms are and how it reacts, even for an element you have never seen, like astatine.' },
];

// "Go deeper" questions for the Understand-it card.
export const DEEPER = [
  { q: 'How do we know?', a: 'Because the table made predictions that came true. Mendeleev described three missing elements in detail, and all three were found: gallium in 1875, scandium in 1879 and germanium in 1886, each very close to his description. Then in 1913 Henry Moseley’s X-ray measurements showed that every element has its own whole number, the electric charge of its nucleus (we now say: the number of protons), and that this number, not weight, sets the order.', step: 'mendeleev' },
  { q: 'What it isn’t', a: 'It is not a list sorted by weight, and it is not a chart to memorise square by square. The order is by atomic number, and the point is the pattern. One more trap: elements in the same <em>row</em> are not alike. Sodium and chlorine sit in the same row, and they could hardly be more different. It is the <em>columns</em> that are families.', step: 'wrap' },
  { q: 'Where does it stop working?', a: 'Hydrogen fits nowhere perfectly: it has one outer electron like the fizzing metals, but it is a gas that behaves very differently. The order in which electrons fill their rooms has quirks, so a few elements break the simple rule. And at the very bottom of the table, calculations suggest that electrons near a huge nucleus move so fast that Einstein’s relativity changes how they behave, so some of the heaviest elements may not act like the rest of their family. So few atoms of them have ever been made that most of this has not been tested.', step: 'blocks' },
];
