---
id: averages
title: Weighted averages, step by step
year: thinking tool
sort: 9999
people: Francis Aston
group: tools
terms: weighted average, average atomic mass
blurb: Why chlorine's atomic mass is 35.45 when no chlorine atom weighs 35.45.
---

:::scene Cambridge, 1920

For a hundred years, chlorine had been an embarrassment. Almost every other light element had a relative atomic mass close to a whole number: carbon 12, nitrogen 14, oxygen 16. Chlorine stubbornly measured 35.46 (the value used then), no matter how carefully it was purified. Some chemists wondered whether atoms of one element could have different weights. Others thought the idea was absurd.

Francis Aston, working in Cambridge, settled it with his new mass spectrograph, a machine that sorts atoms by mass. Chlorine split into two clean streams: one at 35 and one at 37, and nothing at all at 35.5. Chlorine is a mixture of two kinds of atom, and its famous "35.45" is a weighted average. To understand what that means, start at the market.

#### Step 1: the plain average

You buy two mangoes: one has a mass of 200 g and one 300 g. Their average mass is (200 + 300) ÷ 2 = 250 g. Neither mango weighs 250 g; the average describes the pair, not either one.

#### Step 2: when there are more of one kind

Now suppose a crate holds 3 small mangoes of 200 g and 1 big mango of 300 g. The plain average of "200 and 300" would still be 250 g, but that is wrong for this crate, because most of the mangoes are small.

:::work
Total mass = 3 × 200 + 1 × 300 = 900 g. Number of mangoes = 4.
Average mass = 900 ÷ 4 = 225 g.
:::

The average is pulled towards 200 because there are more 200 g mangoes. That is a ==weighted average==: each value counts according to how common it is.

#### Step 3: the shortcut with fractions

You can do the same sum using fractions (or percentages) instead of counts. Three out of four mangoes are small, so the fraction of small mangoes is 0.75; the fraction of big ones is 0.25.

:::work
Weighted average = 0.75 × 200 + 0.25 × 300 = 150 + 75 = 225 g.
:::

Same answer. Multiply each value by its fraction, then add up. The fractions must add to 1 (here 0.75 + 0.25 = 1), because together they cover everything in the crate.

#### Step 4: chlorine

Natural chlorine is about 75.8% chlorine-35 and 24.2% chlorine-37. The precise masses of the two isotopes are 34.969 u and 36.966 u.

:::work
Average atomic mass = 0.758 × 34.969 + 0.242 × 36.966
≈ 26.5065 + 8.9458
≈ 35.4523 u ≈ 35.45 u
:::

:::fig mass_spectrum_cl() | Chlorine sorted by mass. Two peaks, one at 35 and one at 37, and the average, 35.45, falls between them where there are no atoms at all.

That 35.45 is what you see printed on a periodic table. It is the right number to use when you weigh out a spoonful of salt, because a spoonful contains countless chlorine atoms in approximately that mixture. Natural isotope fractions vary slightly between samples. But it describes the crowd, not any single atom.

:::careful
> "The average of 35 and 37 is 36, so chlorine's atomic mass should be 36."

That would only be true if there were equal numbers of each. There are about three chlorine-35 atoms for every chlorine-37, so the average is pulled down towards 35. Always weight each value by how common it is.
:::

:::home Average a bag of coins
Take a handful of mixed coins. Weigh each kind separately on a kitchen scale (several at once, then divide to get one coin's mass) and count how many of each you have. Work out the average mass of a coin in the handful in two ways: total mass divided by number of coins, and the weighted-average shortcut with fractions. Do you get the same answer? Now add ten more of the heaviest coins and see how the average moves.
:::

Weighted averages appear wherever things come in mixtures: the average atomic mass of every element on the periodic table, a class's average mark, the average speed of the molecules in a gas. In each case, the average describes the whole mixture, and it can be a value that no single member has.
