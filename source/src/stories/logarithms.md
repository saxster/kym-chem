---
id: logarithms
title: Counting zeros: logarithms without fear
year: thinking tool
sort: 9999
people: John Napier, Henry Briggs
group: tools
terms: logarithm, logarithms, logarithmic
blurb: A Scottish laird's twenty-year project to make multiplication easy, and the reason the pH scale counts in powers of ten.
---

:::scene Merchiston Castle, Edinburgh, 1614

In the early 1600s, astronomers and sailors spent weeks of their lives doing sums. Working out where a planet would be, or where a ship was on the ocean, meant multiplying long numbers like 7,382,915 by 4,106,447, by hand, over and over, and a single slip could wreck everything.

John Napier, the laird of Merchiston Castle near Edinburgh, was a mathematician (and, his neighbours suspected, a bit of a wizard). He spent about twenty years building tables of special numbers that would turn hard multiplications into easy additions. In 1614 he published them and gave them a name he invented: ==logarithms==. An English professor, Henry Briggs, was so excited that he travelled all the way to Edinburgh to meet him, and together they agreed to make a version based on powers of ten, which Briggs published over the following ten years. Astronomers like Johannes Kepler seized on them. It was said that logarithms doubled the working life of an astronomer, by halving the time spent on sums.

#### Step 1: a logarithm counts tens

You already know powers of ten (if not, read [powers of ten](#story-powers-of-ten) first). A logarithm just asks the question backwards.

:::work
1,000 = 10³. So the logarithm of 1,000 is 3.
1,000,000 = 10⁶. So the logarithm of a million is 6.
10 = 10¹. The logarithm of 10 is 1.
1 = 10⁰. The logarithm of 1 is 0.
:::

For a number that is a 1 followed by zeros, the logarithm is simply *how many zeros*. That is all a (base-ten) logarithm is: a way of counting zeros.

#### Step 2: small numbers have minus logarithms

:::work
0.001 = 10⁻³. So the logarithm of 0.001 is −3.
0.000 000 1 = 10⁻⁷. The logarithm is −7.
:::

The smaller the number, the more negative its logarithm. It is still counting the zeros, just on the other side of the decimal point.

#### Step 3: what about numbers in between?

Numbers that are not neat powers of ten have logarithms in between. Here is one worth remembering:

:::work
2 is about 10⁰·³, so the logarithm of 2 is about 0.3.
That means: multiplying by 2 adds 0.3 to the logarithm.
Multiplying by 10 adds exactly 1.
:::

This is Napier's trick in action: multiplying numbers is the same as *adding* their logarithms. Before calculators, sailors and engineers looked logarithms up in printed tables, added them, and looked the answer back up. Slide rules, which engineers used to design bridges, aeroplanes and even the rockets that flew to the Moon, are just two logarithm rulers sliding past each other.

#### Step 4: why chemists love logarithms

For an illustrative aqueous range near 25 °C, compare hydronium concentrations from about 1 mole per litre (in concentrated strong acid) to about 0.000 000 000 000 01 moles per litre (in concentrated strong alkali). These concentrations are model inputs, not measurements of every acid or base. Those numbers are horrible to compare. Their logarithms are 0 and −14: easy.

That is why a logarithmic scale is useful. pH is the negative base-ten logarithm of hydrogen-ion activity. In the ideal concentration approximation, pH ≈ −log₁₀([H₃O⁺] / (1 mol/L)). The following numbers illustrate that approximation; pH is not restricted to positive values:

:::work
Hydronium at 0.001 mol/L = 10⁻³ mol/L, so pH = 3.
Hydronium at 0.000 000 1 mol/L = 10⁻⁷ mol/L, so pH = 7.
Each step of 1 in pH is a factor of 10 in hydronium.
A step of 0.3 in pH is a factor of about 2.
:::

:::figwide c7_ph_ladder() | The pH scale is a logarithm ruler. Each step to the left multiplies the hydronium concentration by ten.

:::careful
> "pH 4 is twice as acidic as pH 2, because 4 is twice 2."

Logarithm scales do not work like that. pH 2 has 100 times *more* hydronium than pH 4 (two steps, ten times each), so it is much more acidic, not less. Whenever you see a logarithm scale, translate each step into "times ten".
:::

Logarithms turn up in more places than chemistry. The loudness of sound in decibels, the strength of earthquakes and the brightness of stars all use logarithm scales, for the same reason: the real numbers stretch across too many powers of ten to handle comfortably.

:::home A logarithm ruler on your wall
Take a long strip of paper and mark 0, 1, 2, 3, 4, 5 at equal steps of 10 cm. Above them write 1, 10, 100, 1,000, 10,000, 100,000. Now find where 2 goes: it is about 0.3 of the way from the 0 mark to the 1 mark, so 3 cm along. Where does 20 go? (Hint: 20 is 10 × 2, so add the steps.) You have just made the scale that a slide rule, a pH meter and an earthquake scale all use.
:::

So when you meet pH in Chapter 7, remember Napier in his castle: a logarithm is simply a way of counting zeros, so that numbers spanning many powers of ten fit on one friendly ruler.
