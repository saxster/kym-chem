"""Figures for the stories on gases, temperature, motion, water and models."""
import math
from figs_core import Fig, figure
from figs_ch01 import draw_nucleus


@figure
def s_torricelli():
    f = Fig(640, 320, "Torricelli's barometer: a glass tube full of mercury upended in a dish. The mercury falls until its column is about 76 centimetres tall, leaving empty space at the top. Air pressing on the dish holds the column up.")
    # dish
    f.path('M150,272 L170,300 L370,300 L390,272', 'glass')
    f.path('M156,280 L171,298 L369,298 L384,280 Z', 'fill-ink', 'style="opacity:.55"')
    # tube
    tx, top, bot = 255, 30, 290
    f.rect(tx - 15, top, 30, bot - top, 'plate', 6)
    f.rect(tx - 11, 92, 22, bot - 92 - 2, 'fill-ink', 2, 'style="opacity:.55"')
    f.rect(tx - 15, top, 30, bot - top, 'glass', 6)
    f.text(tx + 26, 64, 'empty space at the top', 't m', 'start', 12.5)
    f.text(tx + 26, 80, '(no air, almost nothing at all)', 't m', 'start', 12)
    # height bracket
    f.line(tx - 40, 92, tx - 40, 280, 'ln m')
    f.line(tx - 46, 92, tx - 34, 92, 'ln m'); f.line(tx - 46, 280, tx - 34, 280, 'ln m')
    f.text(tx - 52, 182, 'about 76 cm', 't b', 'end', 13.5)
    f.text(tx - 52, 198, 'of mercury', 't m', 'end', 12.5)
    # air arrows on the dish
    for x in (330, 362):
        f.arrow(x, 200, x, 262, 'electron')
    f.text(346, 170, 'air presses', 't e b', 'middle', 13)
    f.text(346, 186, 'on the dish', 't e', 'middle', 12.5)
    # water comparison
    f.text(470, 140, 'With water instead', 't b', 'start', 13.5)
    f.text(470, 158, 'of mercury the column', 't', 'start', 13)
    f.text(470, 175, 'would be about', 't', 'start', 13)
    f.text(470, 192, '10.3 metres tall:', 't', 'start', 13)
    f.text(470, 209, 'taller than a', 't', 'start', 13)
    f.text(470, 226, 'three-storey house.', 't', 'start', 13)
    return f.svg()


@figure
def s_model_ladder():
    f = Fig(640, 250, 'Five models of the atom, each an improvement on the one before: a solid ball, a ball with electrons dotted through it, a tiny nucleus with electrons around it, electrons in fixed energy levels, and a cloud showing where electrons are likely to be.')
    labels = [('Dalton, 1808', ['a solid,', 'uncuttable ball']),
              ('Thomson, 1904', ['positive ball,', 'electrons dotted in']),
              ('Rutherford, 1911', ['tiny nucleus,', 'mostly empty']),
              ('Bohr, 1913', ['electrons in', 'energy levels']),
              ('today', ['a cloud of', 'likelihood'])]
    for i, (who, what) in enumerate(labels):
        cx, cy = 64 + i * 128, 100
        if i == 0:
            f.circle(cx, cy, 46, 'fill-ink', 'style="opacity:.75"')
        elif i == 1:
            f.circle(cx, cy, 46, 'wash-p')
            f.circle(cx, cy, 46, 'ln p')
            for k in range(9):
                a = k * 2.4
                rr = 12 + (k * 37 % 26)
                f.nucleon(cx + rr * math.cos(a), cy + rr * math.sin(a), 'e', 5.5)
        elif i == 2:
            f.circle(cx, cy, 46, 'region')
            f.circle(cx, cy, 3.5, 'pt-p')
            for k in range(6):
                a = k * 1.05 + .3
                f.nucleon(cx + 34 * math.cos(a), cy + 26 * math.sin(a * 1.3), 'e', 4.5)
        elif i == 3:
            for rr in (20, 36):
                f.circle(cx, cy, rr, 'shell')
            f.circle(cx, cy, 7, 'pt-p')
            for k, rr in ((0, 20), (1, 20), (2, 36), (3, 36), (4, 36), (5, 36)):
                a = k * 1.7
                f.nucleon(cx + rr * math.cos(a), cy + rr * math.sin(a), 'e', 4.5)
        else:
            for k, (rr, op) in enumerate(((46, .07), (37, .09), (28, .12), (19, .16), (10, .2))):
                f.circle(cx, cy, rr, 'fill-vol', f'style="opacity:{op}"')
            f.circle(cx, cy, 3.5, 'pt-p')
        f.text(cx, 180, who, 't b', 'middle', 12.5)
        for j, line in enumerate(what):
            f.text(cx, 198 + j * 15, line, 't m', 'middle', 11.5)
        if i:
            f.arrow(cx - 80, cy, cx - 50, cy, 'muted')
    return f.svg()
