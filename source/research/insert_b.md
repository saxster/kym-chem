# Insert plan B: three new live figures

The widgets and their still figures are built and tested. Each passes livetest at 1280 and 390 px with no console errors, and the screenshots were checked in light and dark.

| Figure | Widget | Still |
|---|---|---|
| Water and ice in 3D | `live/w_waterice.js` | `i_waterice` |
| Why flames have colours | `live/w_spectrum.js` | `i_spectrum` |
| How many is a mole? | `live/w_molezoom.js` | `i_molezoom` |

All three stills are in `figs_insight_b.py`. Insert the blocks below exactly as written: the `:::fig` line with its caption, the `:::live` line directly under it, then the text.

---

## 1. Water and ice: src/ch03.md, §3.6 "Intermolecular forces against thermal motion"

**Where:** directly after the paragraph that begins "Hydrogen bonds sound strong, but remember the scale…", before the `:::careful` block about boiling. That puts it just after `:::story water` and the hydrogen-bond note.

```
**Predict first:** almost every substance shrinks when it freezes, because the particles settle closer together. Water does the opposite: ice floats. Before you turn the model, decide what you think the molecules in ice must be doing to take up *more* room than the same molecules in liquid water.

:::fig i_waterice() | The same 72 water molecules as a liquid and as ice. In the liquid, hydrogen bonds keep breaking and re-forming, and molecules crowd close. In ice, each molecule is held by exactly four hydrogen bonds, at the corners of a tetrahedron, in open six-sided rings with empty channels through them, so the same molecules fill more space.
:::live waterice {}

Turn the ice until you are looking straight down the channels. Each oxygen is joined to four others, never more, and the four links point to the corners of a tetrahedron, like the legs of a camera tripod with one more leg pointing up. Four links that stiff cannot fold up tightly: they build a honeycomb with holes in it. In the liquid, the links break and re-form all the time (in real water, a hydrogen bond lasts only about a million-millionth of a second), so the honeycomb keeps collapsing and molecules slip into the holes. The same molecules end up closer together. That is why liquid water is denser than ice (about 1.00 g per mL against 0.917), and why ice floats with about nine-tenths of itself under the surface.

This one odd fact matters enormously. Lakes and ponds freeze from the top down, and the floating ice blanket keeps the water underneath liquid all winter, so fish and plants survive. If ice sank, cold lakes would fill up with ice from the bottom.
```

**Optional:** in `src/stories/water.md`, after the paragraph that begins "When water freezes, each molecule settles into a position where it makes four hydrogen bonds…", add a second copy of the same figure with the simpler caption "Liquid water and ice, molecule by molecule. Turn the ice to look down its six-sided channels." followed by `:::live waterice {"mode":"ice"}`.

**Facts to keep consistent:** the densities 0.917 and about 1.00 g/mL come from `stories/water.md`. In the model, each ice molecule fills 32.4 Å³ and each liquid molecule 30.0 Å³; the readout states the model's own difference, about 7%. The hydrogen-bond lifetime "about a million-millionth of a second" (picoseconds) is the standard order of magnitude; the checker should confirm it or soften it to "far less than a billionth of a second".

---

## 2. Why flames have colours

### 2a. src/ch09.md, §9.2

**Where:** directly after the paragraph that ends "The colour is set by the size of that drop, which is different for every element."

```
**Predict first:** sodium in a flame glows yellow, and nothing else. If an electron can fall from many different heights, why does salt not give a whole rainbow? Make a guess, then press *Give it energy* a few times and watch where each colour lands.

:::fig i_spectrum() | An atom's energy levels drawn as a ladder. An electron lifted up by the heat of a flame falls back down, and gives out light whose colour is set by the size of the fall: a big fall gives blue or violet, a small fall red. Because only certain levels exist, only certain colours appear.
:::live spectrum {"atom":"sodium"}

Think of the levels as the rungs of a ladder with fixed, uneven gaps. An electron can stand on a rung, never between rungs, so it can only fall by the exact height of one gap or another. Each gap gives light of one exact colour. Sodium's ladder has only one gap that gives visible light, from its 3p level down to its 3s level, and that light is yellow, at 589 nanometres. Its other falls give infrared or ultraviolet light, which is real light that our eyes cannot see. That is why salt in a flame, and old sodium street lamps, glow one pure yellow.

Switch to hydrogen and you will see four visible lines, red, blue-green, blue and violet, all from falls that end on hydrogen's second rung. Switch to *A rainbow* and you will see the difference that Bunsen and Kirchhoff used. A hot solid, like a bulb's filament, gives every colour at once. A hot gas of separate atoms gives only its own few colours, as personal as a fingerprint.
```

### 2b. src/stories/spectra.md

**Where:** after the first paragraph explaining that each element glows with its own lines; the paragraph beginning "Think of Diwali night…" is a good anchor, placed just after its follow-on explanation. Add the hydrogen version:

```
:::fig i_spectrum() | Hydrogen's energy ladder and its four visible colours: each comes from an electron falling to the second rung.
:::live spectrum {"atom":"hydrogen"}
```

**Facts:**
- Hydrogen levels: E = −13.6 eV/n². The Balmer lines computed with R = 1.0968 × 10⁷ m⁻¹ are 656, 486, 434 and 410 nm, matching the `s_spectra` figure (656.3, 486.1, 434.0, 410.2).
- Sodium levels: 3p at 2.104 eV, 4s at 3.191 eV, 3d at 3.617 eV. These give 589 nm (yellow), 4s→3p at 1140 nm and 3d→3p at 819 nm, both infrared.
- The widget's readout notes that the routes down are simplified.

---

## 3. How many is a mole?: src/ch06.md, §6.2 "Counting beyond what we can see"

**Where:** directly after the `:::fig c6_mole_piles()` line, before the paragraph that begins "Here is the clever part, the trick that made the whole of quantitative chemistry possible."

```
**Predict first:** a tablespoon and a bit of water (18 grams) is one mole of water molecules. If you could line those molecules up side by side across the width of the spoon, roughly how many would fit: a thousand? a million? a thousand million? Write your guess, then zoom in.

:::fig i_molezoom() | Zooming into a spoonful of water, ten times at a step, past a raindrop, a grain of salt, a hair, a blood cell, a bacterium, a virus and the width of DNA, until single water molecules appear, about 0.3 nanometres apart.
:::live molezoom {}

Every view is drawn at its true size, and the box in the corner counts how many water molecules would fit side by side across it. Across the spoon it is roughly a hundred million. Shrink the view to the width of a hair and it is still a quarter of a million. Only at the very bottom, a few nanometres across, can you count them on your fingers.

Now the real surprise. A hundred million across sounds enormous, but the spoon is three-dimensional. Pour the water into a cube 2.6 centimetres wide and about 84 million molecules sit along each edge, so the whole cube holds 84 million × 84 million × 84 million: about 6 × 10²³, one mole. Multiplying the same big number by itself three times is what makes a mole so unimaginably large. And yet it is only a tablespoon and a bit of water. That is how small molecules are.
```

**Facts, computed in Python:**
- Spacing in liquid water: (18 mL ÷ 6.022 × 10²³)^(1/3) = 0.310 nm.
- A cube of 18 mL is 2.621 cm on an edge, holding 8.44 × 10⁷ molecules per edge; 8.44 × 10⁷ cubed is 6.02 × 10²³.
- Molecules across a view: 6 cm gives 1.9 × 10⁸; 0.08 mm (a hair) gives 2.6 × 10⁵ ("still a quarter of a million").
- Counting time: 6.022 × 10²³ s ÷ 3.156 × 10⁷ s/yr = 1.9 × 10¹⁶ years. This matches `stories/mole.md` ("about 19 thousand million million years").
- The landmark sizes are taken from Chapter 0's `scale_ladder`: raindrop 2 mm, salt 0.3 mm, hair 0.08 mm, red blood cell 7 µm, bacterium 1 µm, virus 100 nm, DNA 2 nm, water molecule 0.3 nm.
- "18 g ≈ a tablespoon and a bit" matches `ch06.md` line 77.
