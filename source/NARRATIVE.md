# Turning the chapters into one adventure

Kym's father wants the book to read as "one beautifully written story: not a textbook but a historical adventure with an
explanation". The chapters stay in their logical order (the app depends on the section numbers), but each one becomes an
episode in a single long adventure: two and a half thousand years of people asking what everything is made of.

## What changes
* **Lead with people and places.** Each chapter opens on a real scene: a person, a place, a year, a puzzle they could not
  solve. Each section opens with a puzzle Kym can feel (often the historical one), follows the people who cracked it, and
  then explains the idea plainly. History serves the explanation: it is the thread, not a list of dates.
* **The "How do we know?" boxes dissolve into the story.** Move their content into the narrative where it reads best (you
  may keep one short `:::evidence` box per chapter if it still earns its place).
* **One narrator, one journey.** Speak to Kym as "you". Use bridges that make it feel like one journey: "Fifty years after
  Dalton...", "Remember the gold foil in Chapter 1?". Chapter openings may glance back at where the story has got to.
* **Magic first, then the reason** (borrowed from MIT OpenCourseWare's "Chemistry Behind the Magic"): where it fits, open a
  section with a surprising demonstration (a glowstick in hot and cold water, a copper coin turning gold-coloured, red
  cabbage juice changing colour, Diwali fireworks colours) and let the section explain it.
* **Kitchen chemistry** (borrowed from MIT's "Kitchen Chemistry" course): add `:::home` experiments Kym can do safely at
  home, one or two per chapter, ONLY with kitchen-safe materials (water, salt, sugar, vinegar, baking soda, lemon, red
  cabbage, ice, balloons, glowsticks used whole, coins, a kitchen scale, a fridge or freezer). No flames, no heating
  beyond warm tap water, nothing to taste unless it is ordinary food. Say "ask an adult" where sensible.

## What must not change
* Section numbers and their core ideas; every `:::fig` (and the `:::live` line under it); every `:::check` (you may
  improve wording); the `:::case` and `:::next`. Keep every corrected number and fact (do not reintroduce old errors).
* Accuracy: true history only (real names, places, dates; flag legends as legends). Compute any new number in Python.
* No "atoms want" language. No exclamation-mark gush. Warm, vivid, precise.
* Length: chapters may grow by up to about a third.

## New blocks
* `:::scene Manchester, 1909` (one line): a place-and-date line that opens a scene.
* `:::home Title` ... `:::` : a kitchen-safe experiment.
* `:::story id` (one line): a card inviting Kym into a full story (ids are in STORIES.md). Use at the one or two moments
  per chapter where a deeper story matters most (e.g. `:::story mole` where the mole first appears). The build also links
  story words in the text automatically (first mention per chapter), so do not add links by hand.
