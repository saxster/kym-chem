# Insert plan A: three new live figures

The widgets are built and tested in a temporary story (now deleted):
- `live/w_orbitals.js`
- `live/w_bondwell.js`
- `live/w_saltsteps.js`

Still SVG fallbacks are in `figs_insight_a.py`:
- `i_orbitals` is new.
- `i_bondwell` and `i_saltsteps` reuse `c2_bond_energy` and `c2_salt_energy`, for use in stories.

In the chapters, **attach the live widgets to the existing still figures** (`:::live` directly under the existing `:::fig` line). Don't add a second copy of those two figures.

---

## 1. Electron clouds: `orbitals` (three.js)

### Chapter 1, §1.6

**Where.** Insert directly after the `:::fig shells_li_na() | …` paragraph (the line after `:::story table-shape`). It goes before the paragraph "What, then, makes a full shell special?…".

```
**Predict first.** The rings in the figure above look like tracks, with electrons running round them like trains on a circle line. If you could photograph an electron in a neon atom again and again, would the dots all land on a neat circle?

They would not. Electrons don't follow paths at all. What we *can* know is where an electron is likely to be found, and that likelihood makes a cloud: thick in some places, thin in others, fading away with no edge. Each shell is made of one or more of these clouds, and **each cloud holds at most two electrons**. The first shell is a single round cloud (called 1s). The second shell is a bigger round cloud (2s) plus three dumbbell-shaped clouds (2p) at right angles to each other: 1 + 3 = 4 clouds × 2 electrons = 8, the second shell's eight. Turn the atom below and see for yourself.

:::fig i_orbitals() | Two ways to picture an atom's electrons. Left: shells as rings, a handy way to count. Right: what electrons really do, shown as clouds of likely positions: 1s, 2s (with its hollow layer) and one of the three 2p clouds. Each cloud holds at most two electrons. Dots are sampled from the real hydrogen-like shapes.
:::live orbitals {}

The rings are not wrong, they are a **model** that keeps the counting right and leaves out the shapes. You will meet the clouds again in the story of why the periodic table has its strange shape: the 2p clouds are why the second row has six columns on the right, and the five d clouds are why the middle of the table is ten columns wide.
```

### Story `table-shape`, Step 1

**Where.** Insert after the bulleted list of room sizes (s 2, p 6, d 10, f 14), before "The first floor has only an s room…".

```
Here is what those rooms actually look like. Each "seat pair" is a cloud where an electron is likely to be found: s rooms are round, p rooms are dumbbells pointing three ways.

:::fig i_orbitals() | Shells as usually drawn, and the clouds electrons really make. Each cloud holds at most two electrons.
:::live orbitals {}
```

---

## 2. Why a bond forms: `bondwell` (canvas)

### Chapter 2, §2.3

**Where.** Add one line directly under the existing `:::fig c2_bond_energy() | …` line:

```
:::live bondwell {}
```

**Accompanying text.** Insert just before the `:::fig c2_bond_energy()` line, replacing nothing; the paragraph "A bond is not a stick or a hook…" stays:

```
**Predict first.** Two hydrogen atoms drift towards each other. Will they keep getting closer until they touch, stop somewhere, or bounce away? Make your guess, then move them with the slider below.
```

**Insight.** Add after the existing paragraph "Because bonded atoms sit in an energy dip…":

```
Try *Let them come together* in the figure. The atoms roll down into the dip and rock back and forth, and they only settle at the bottom if the extra energy is carried away, as heat passed to other molecules. That is the whole secret of a bond: it is the bottom of an energy valley. Nothing holds the atoms with a hook. They stay because climbing out would cost 436 kJ for every mole, and nobody is paying.
```

### Chapter 5, §5.6

Reference only, no new figure. Add to the end of the paragraph "It follows from Chapter 2…":

```
(The figure in section 2.3 lets you try it: pull two hydrogen atoms apart and watch the energy you must supply climb to 436 kJ per mole.)
```

---

## 3. The salt energy staircase: `saltsteps` (canvas)

### Chapter 2, §2.5

**Where.** Add one line directly under the existing `:::fig c2_salt_energy() | …` line:

```
:::live saltsteps {}
```

**Accompanying text.** Insert just before the `:::fig c2_salt_energy()` line:

```
**Predict first.** Sodium "wants" to lose an electron, school books often say. If that were true, would pulling the electron off sodium give out energy or cost energy? Decide, then follow the energy one step at a time below.
```

**Insight.** Add after the figure:

```
Watch the ball. It climbs 496 kJ when sodium loses its electron, comes only part of the way back down (349 kJ) when chlorine catches it, and is still 147 kJ uphill. Only the last step, the ions packing together into a crystal, carries it far below where it started: 787 kJ down, 640 kJ below the start overall. Salt forms not because any atom wants anything, but because the finished crystal sits at the bottom of a deep energy valley.
```

### Chapter 1, §1.6, the "want" `:::careful` box

Reference only. At the end of the paragraph beginning "**The sodium paradox.**", add:

```
(In Chapter 2 you can follow this energy account step by step in a moving figure.)
```

---

## Checks done
- Numbers match the chapters: 496, 349, 147, 787 and −640 kJ/mol (ch02 §2.5, ch01 §1.6). The bond-well figure uses De 436 kJ/mol and re 74 pm, the same Morse curve as `c2_bond_energy`.
- The orbital shapes are sampled from hydrogen-like |ψ|² for 1s, 2s (radial node at 2 a₀), 2p and 3d_z². The readout says sizes are hydrogen-like.
- Opened in Playwright at 1280 and 390 wide, plus dark: no console errors. The tabs, slider and buttons were exercised.
