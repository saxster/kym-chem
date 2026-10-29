---
id: units
title: The unit-cancelling trick
year: thinking tool
sort: 9999
group: tools
terms: units cancel, conversion factor, unit-cancelling
blurb: Why a spacecraft was lost over Mars, and the simple habit that stops you making the same mistake.
---

:::scene Mars, 23 September 1999

After a journey of more than nine months, NASA's Mars Climate Orbiter fired its engine to slip into orbit around Mars. Then it passed behind the planet, and was never heard from again. It had flown far too low and was almost certainly destroyed in the Martian atmosphere.

The investigation found the cause. One team's software reported the push from the spacecraft's small thrusters in American units (pound-force seconds). The navigation team's software expected metric units (newton seconds). One pound-force is about 4.45 newtons, so every number was off by a factor of more than four, and nobody's computer noticed. A spacecraft worth around 125 million dollars was lost because a number was written without its unit being checked.

Chemists juggle grams, moles, litres, molecules and kilojoules all day. This tool is the habit that keeps them, and you, from crashing into Mars.

#### Step 1: a unit is part of the number

"18" means nothing on its own. 18 grams? 18 moles? 18 molecules? These are wildly different amounts. So in science, a number always travels with its unit, and you treat the unit almost like a word that is multiplied by the number: 18 g means "18 × gram".

#### Step 2: units cancel like fractions

You know from fractions that 3 × (5 ÷ 3) = 5: the 3s cancel. Units do the same.

:::work
2 hours × 60 minutes/hour = 120 minutes
The word "hour" appears on top and on the bottom, so it cancels, leaving minutes.
:::

The "60 minutes per hour" is a ==conversion factor==. It is really just a fancy way of writing 1, because 60 minutes and 1 hour are the same amount of time. Multiplying by 1 never changes an amount; it only changes the units you describe it in.

#### Step 3: chemistry's favourite chain

The most useful chain in this book goes from grams to moles to particles. Each link is a conversion factor, and the units tell you whether to multiply or divide.

:::work
**How many molecules in 36 g of water?**
36 g × (1 mol / 18 g) = 2 mol (grams cancel)
2 mol × (6.022 × 10²³ molecules / 1 mol) = 1.2 × 10²⁴ molecules (moles cancel)
:::

:::fig c6_unit_chain() | The bridge between grams and particles. Each arrow is a conversion factor; the units tell you which way to go.

If you set up a chain and the units do *not* cancel to what you want (for example you end up with g² per mol), you have flipped a factor upside down. The units have caught your mistake before it caught you.

:::careful
> "To get from grams to moles I just multiply by the molar mass."

Check the units: 36 g × 18 g/mol gives 648 g² per mol, which is nonsense. Grams to moles needs the factor written so that grams cancel: 36 g × (1 mol / 18 g) = 2 mol. Whenever you are not sure whether to multiply or divide, write the units in and let them decide.
:::

#### Step 4: the habit

Write every number with its unit. Write every conversion factor as a fraction. Cross out units that appear on top and bottom. If what is left is the unit you wanted, the chain has passed a dimensional check. Still check the factors, specified entities, assumptions and arithmetic: compatible units alone cannot prove the answer is right.

:::home A recipe in two languages
Find a recipe that gives amounts in cups or spoons. Using a kitchen scale, find how many grams of flour (or sugar, or rice) are in one cup. Write it as a conversion factor, like "130 g / 1 cup". Now convert the whole recipe into grams, writing the units at every step. Then make the recipe (with an adult) using the scale instead of the cups. Do the units cancel properly all the way through?
:::

Every calculation in this book, from moles to concentrations to energies, is a little chain of conversion factors. Write the units, let them cancel, and you will always know where you are.
