"""Figures for Chapter 6."""
import math
from figs_core import Fig, figure, jitter_grid


@figure
def c6_ratio_vs_mass():
    f = Fig(640, 300, 'Five water molecules. By count: 10 hydrogen atoms and 5 oxygen atoms, a 2 to 1 ratio. By mass: about 10 units of hydrogen and 80 units of oxygen, a 1 to 8 ratio.')
    for k in range(5):
        f.molecule('H2O', 60 + k * 64, 70, 1.0)
    f.text(188, 125, 'five H₂O molecules', 't m', 'middle', 12.5)
    # count panel
    f.text(20, 170, 'Counting atoms', 't b', 'start', 14)
    f.text(20, 202, 'H', 't b', 'start', 14)
    for k in range(10):
        f.atom(52 + k * 22, 197, 'H', 9, label=False)
    f.text(282, 202, '10', 't b', 'start', 14)
    f.text(20, 238, 'O', 't b', 'start', 14)
    for k in range(5):
        f.atom(52 + k * 22, 233, 'O', 9.5, label=False)
    f.text(282, 238, '5', 't b', 'start', 14)
    f.text(20, 278, 'ratio by number  2 : 1', 't v b', 'start', 13.5)
    f.line(330, 150, 330, 290, 'ln r')
    # mass panel: bars scaled
    f.text(352, 170, 'Weighing atoms (mass units)', 't b', 'start', 14)
    sc = 2.6
    f.text(352, 202, 'H', 't b', 'start', 14)
    f.rect(374, 190, 10 * sc, 16, 'bar-m', 2)
    f.text(374 + 10 * sc + 8, 203, '10 × 1 = 10', 't m', 'start', 12.5)
    f.text(352, 238, 'O', 't b', 'start', 14)
    f.rect(374, 226, 80 * sc, 16, 'bar-p', 2)
    f.text(374, 262, '5 × 16 = 80', 't m', 'start', 12.5)
    f.text(352, 290, 'ratio by mass  about 1 : 8', 't v b', 'start', 13.5)
    return f.svg()


def pile(f, cx, base, n, el, r, seed):
    import random
    rnd = random.Random(seed)
    rows = 5
    k = 0
    for row in range(rows):
        cnt = rows - row + 2
        for i in range(cnt):
            x = cx + (i - (cnt - 1) / 2) * r * 2.05 + rnd.uniform(-1.5, 1.5)
            y = base - r - row * r * 1.75
            if el == 'H2O':
                f.molecule('H2O', x, y + 2, r / 16)
            elif el == 'NaCl':
                f.atom(x, y, 'Na' if (i + row) % 2 else 'Cl', r * (0.8 if (i + row) % 2 else 1.0), label=False)
            else:
                f.atom(x, y, el, r, label=False)


@figure
def c6_mole_piles():
    f = Fig(640, 290, 'Three piles each holding one mole of particles: carbon atoms 12.0 grams, water molecules 18.0 grams, sodium chloride 58.4 grams.')
    items = [('C', 'carbon atoms', '12.0 g'), ('H2O', 'water molecules', '18.0 g'), ('NaCl', 'sodium chloride', '58.4 g')]
    for k, (el, name, mass) in enumerate(items):
        cx = 110 + k * 210
        f.line(cx - 90, 170, cx + 90, 170, 'ln')
        pile(f, cx, 168, 0, el, 11, k)
        f.text(cx, 200, name, 't b', 'middle', 14)
        f.text(cx, 222, '6.022 × 10²³ particles', 't m', 'middle', 12.5)
        f.text(cx, 256, mass, 't s', 'middle', 24, 600)
    f.text(320, 284, 'same number in each pile; different mass per particle', 't m', 'middle', 12.5)
    return f.svg()


@figure
def c6_unit_chain():
    f = Fig(640, 230, 'Conversion chain: grams divided by molar mass gives moles; moles times Avogadro’s constant gives number of particles; and back again.')
    boxes = [(20, 'grams', 'what a balance', 'measures'), (235, 'moles', 'what equations', 'count in'), (450, 'particles', 'what is really', 'there')]
    for x, t, a, b in boxes:
        f.rect(x, 80, 170, 70, 'plate', 8)
        f.text(x + 85, 112, t, 't s', 'middle', 24, 600)
        f.text(x + 85, 134, a + ' ' + b, 't m', 'middle', 11.5)
    for x0, x1, top, bot in ((190, 235, '÷ molar mass', '× molar mass'), (405, 450, '× 6.022 × 10²³', '÷ 6.022 × 10²³')):
        f.arrow(x0 + 2, 96, x1 - 3, 96, 'electron')
        f.arrow(x1 - 2, 134, x0 + 3, 134, 'proton')
        f.text((x0 + x1) / 2, 60, top, 't e b', 'middle', 13)
        f.text((x0 + x1) / 2, 178, bot, 't p b', 'middle', 13)
    f.text(320, 216, 'example: 36.0 g of water ÷ 18.0 g/mol = 2.00 mol = 1.20 × 10²⁴ molecules', 't', 'middle', 13)
    return f.svg()


@figure
def c6_limiting():
    f = Fig(640, 300, 'Five H2 and two O2 molecules grouped into two complete sets of 2 H2 plus O2, making four water molecules, with one H2 left over.')
    f.text(20, 26, 'start: 5 H₂ + 2 O₂', 't b', 'start', 14)
    f.text(420, 26, 'after the reaction', 't b', 'start', 14)
    # two sets
    for s in range(2):
        y = 70 + s * 92
        f.rect(20, y - 32, 260, 70, 'wash', 30, 'stroke-dasharray="4 4" style="stroke:var(--vol);stroke-width:1.2"')
        f.molecule('H2', 60, y, 1.1)
        f.molecule('H2', 120, y, 1.1)
        f.molecule('O2', 190, y, 1.0)
        f.text(262, y + 4, f'set {s + 1}', 't v b', 'end', 12)
        f.arrow(292, y, 380, y, 'ink')
        f.molecule('H2O', 430, y + 2, 1.0)
        f.molecule('H2O', 500, y + 2, 1.0)
    # leftover
    y = 256
    f.molecule('H2', 60, y, 1.1)
    f.text(90, y + 5, 'left over: nothing to react with', 't p', 'start', 13)
    f.molecule('H2', 470, y, 1.1)
    f.text(500, y + 5, '1 H₂ unused', 't p', 'start', 13)
    f.text(420, 222, '4 H₂O made', 't b', 'start', 13.5)
    return f.svg()


def beaker(f, x, y, w, h, fill_frac, n_particles, seed, label1, label2):
    top = y + h * (1 - fill_frac)
    f.path(f'M{x},{top} L{x},{y + h} L{x + w},{y + h} L{x + w},{top} Z', 'water')
    f.path(f'M{x - 6},{y} L{x},{y + 6} L{x},{y + h} L{x + w},{y + h} L{x + w},{y + 6} L{x + w + 6},{y}', 'glass')
    for i, (px, py) in enumerate(jitter_grid(n_particles, x, top, w, y + h - top, seed=seed, margin=12)):
        if i % 2: f.ion(px, py, 'Na', '+', 7)
        else: f.ion(px, py, 'Cl', '−', 8)
    f.text(x + w / 2, y + h + 24, label1, 't b', 'middle', 13.5)
    f.text(x + w / 2, y + h + 42, label2, 't v b', 'middle', 13.5)


@figure
def c6_concentration():
    f = Fig(640, 310, 'Three solutions: 1 mole in 2 litres is 0.50 mol per litre; 1 mole in 4 litres is 0.25; 2 moles in 4 litres is 0.50.')
    data = [(40, 0.42, 8, '1 mol in 2 L', '0.50 mol/L'), (250, 0.84, 8, '1 mol in 4 L', '0.25 mol/L'), (460, 0.84, 16, '2 mol in 4 L', '0.50 mol/L')]
    for k, (x, frac, n, a, b) in enumerate(data):
        beaker(f, x, 40, 140, 200, frac, n, k + 3, a, b)
    f.text(320, 22, 'each drawn ion stands for a vast number of real Na⁺ and Cl⁻ ions', 't m', 'middle', 12.5)
    return f.svg()


@figure
def c6_gram_chain():
    f = Fig(640, 250, 'Two H2 plus O2 gives two H2O, read in moles (2, 1, 2) and in grams (4.0, 32.0, 36.0).')
    cols = [(110, 'H2', '2 H₂', '2 mol', '4.0 g'), (300, 'O2', 'O₂', '1 mol', '32.0 g'), (510, 'H2O', '2 H₂O', '2 mol', '36.0 g')]
    for x, m, lab, mol, g in cols:
        if m == 'O2':
            f.molecule(m, x, 58, 1.1)
        else:
            f.molecule(m, x - 36, 58, 1.1); f.molecule(m, x + 36, 58, 1.1)
        f.text(x, 110, lab, 't s', 'middle', 20, 600)
        f.text(x, 158, mol, 't e b', 'middle', 16)
        f.text(x, 208, g, 't p b', 'middle', 16)
    f.text(205, 110, '+', 't s', 'middle', 20)
    f.arrow(375, 104, 430, 104, 'ink')
    f.text(20, 158, 'moles', 't m', 'start', 12.5)
    f.text(20, 208, 'grams', 't m', 'start', 12.5)
    f.line(20, 132, 620, 132, 'ln r'); f.line(20, 182, 620, 182, 'ln r')
    f.text(320, 240, 'moles follow the equation (2 : 1 : 2); grams follow conservation (4.0 + 32.0 = 36.0)', 't m', 'middle', 12.5)
    return f.svg()
