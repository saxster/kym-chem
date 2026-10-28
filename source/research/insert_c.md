# Insert C: the periodic table as a 3D landscape (`skyline`)

New files:
- `live/w_skyline.js`: the three.js widget.
- `live/skyline_data.js`: compact data, generated from `app/ptable_data.js` and `app/atlas_data.js`, plus first ionisation energies.
- `figs_insight_c.py`: the still fallback figure `i_skyline()`, a line chart of atom size against atomic number from H to Ba, with the alkali-metal peaks labelled.

Widget parameters: `{"prop": "size" | "ie" | "en" | "mp" | "density", "view": "overview" | "rows" | "columns"}`. The defaults are `size` and `overview`.

Note on numbers: the widget uses Pyykkö's single-bond covalent radii, the set used by the periodic-table Explore tab. Figure 9.1 (`c9_radii`) quotes a slightly different published set (for example Li 128 pm there, 133 pm here). The captions below say so, so nobody is puzzled by a few picometres.

---

## 1. Chapter 9, §9.1 "Why atoms shrink across a row"

Place it immediately **before** `:::five Shielding`. That is after the paragraph ending "…Across a row, the pull wins…", so the card still comes after the idea has been taught.

```
**Predict first:** before you open the landscape, guess. If every element's atom size were a tower standing on its square of the periodic table, where would the tallest towers be: on the left, in the middle, or on the right? And would the towers in the bottom rows be taller or shorter than the ones at the top?

:::figwide i_skyline() | Atom size against atomic number, from hydrogen (1) to barium (56). Every row of the table starts with a peak, an alkali metal, and slopes down to the right. Open the 3D version to stand each element on its own square of the table. (These radii come from a slightly different published set than Figure 9.1, so a few numbers differ by a few picometres.)
:::live skyline {"prop":"size"}

Turn the landscape and you can see the whole of this section at once. Each row begins with a skyscraper on the left, an alkali metal, and the towers step down towards the right. Every step adds one proton, which pulls the same shells in a little tighter. Then the next row begins with a new, taller skyscraper, because it has a whole new shell. Press *Look along the rows* and all seven rows line up behind each other: the same downhill slope, again and again. That repeating shape is what "periodic" means.
```

## 2. Chapter 9, §9.2 "Why removing an electron always costs energy"

Place it immediately **before** `:::five Ionisation energy`, after the `:::careful` box about sodium.

```
**Predict first:** atom size had skyscrapers on the left. If you made the towers show how hard it is to pull an electron away instead, where would the tallest ones go now?

:::figwide i_skyline() | The same landscape idea, now showing first ionisation energy: the energy needed to pull one electron away from each atom in a mole of them. Open it in 3D and compare it with atom size.
:::live skyline {"prop":"ie","view":"rows"}

It is the mirror image. Now the noble gases on the far right are the mountain peaks: helium highest of all, at about 2,372 kJ/mol. The alkali metals on the left are the deepest valleys: caesium needs only about 376. Big atoms hold their outer electron loosely, far from the nucleus and behind many shielding electrons; small atoms hold it tightly. Two different measurements, one pattern, and one reason behind both. That is why chemists trust the table.
```

(The 2,372 and 376 kJ/mol values are in `skyline_data.js` and match Wikipedia's ionisation energy data page.)

## 3. Story: `src/stories/predicting.md`

Place it after the "How to play" section and before "#### Round one: francium".

```
:::figwide i_skyline() | Atom size across the table. Every row starts with a peak and slopes down; every column grows as you go down.
:::live skyline {"prop":"size","view":"columns"}

**Predict first:** francium sits at the very bottom of column 1, below caesium. Before you tap its tower, decide: taller than caesium's, or shorter? Then tap it.
```

(The data holds francium's radius, 223 pm, which is less than caesium's 232 pm. That's a real surprise worth a sentence, if the writer of the predicting story wants one: relativity pulls francium's outer electron in a little. That claim needs a check before it goes in.)

## 4. The guided periodic-table page (`app/m_ptguide.js`, owned by another agent)

The skyline can sit on that page too, for example at the "Why 'periodic'?" or "Reading the map" step. Two things are needed:

1. **It must be bundled.** `build.py`'s `bundle_live` only bundles widgets named by a `data-live="…"` attribute in the built HTML. Once any chapter or story uses `:::live skyline` (as above), the widget is in the bundle.
2. **A figure added after load must be initialised.** `live/core.js` only runs `setup()` over the `figure[data-live]` elements that exist at load. Either:
   - (a) render the figure in the static HTML (e.g. the guide's mount markup from `build.py`'s `EXPLORE_HTML`), or
   - (b) add a one-line hook in `live/core.js`: `Live.mount = setup;`. The guide can then build `<figure data-live="skyline" data-live-params='{"prop":"size"}'>` containing the still SVG and a `<figcaption>`, and call `Live.mount(fig)`.

I did not edit `core.js`; that's the owner's call.

## Data sources

- **Atom size:** Pyykkö and Atsumi (2009) single-bond covalent radii, through `app/atlas_data.js`, for H to Cm plus Fr.
- **Electronegativity, melting point and density:** `app/atlas_data.js`, which was corrected against the Wikipedia data pages.
- **First ionisation energy:** the npm package `periodic-table` 0.0.8 (ISC). 33 values (H, He, Li, Be, C, N, O, F, Ne, Na, Mg, Al, Cl, Ar, K, Ca, Zn, Ga, Br, Kr, Rb, I, Xe, Cs, Ba, Au, Hg, Rn, Fr, Ra, U, No, Lr) were checked against https://en.wikipedia.org/wiki/Ionization_energies_of_the_elements_(data_page). All agreed to within 1 kJ/mol except:
  - **astatine:** the package had 920; corrected to 899 kJ/mol (measured by Rothe et al., *Nature Communications* 2013; https://en.wikipedia.org/wiki/Astatine);
  - **lawrencium:** missing in the package; set to 479 kJ/mol (4.96 eV, measured by Sato et al., *Nature* 2015; https://en.wikipedia.org/wiki/Lawrencium).
- **Rutherfordium (104) onwards:** unknown, shown as flat ghost tiles.
