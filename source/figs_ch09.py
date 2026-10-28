"""Figures for Chapter 9: periodic trends."""
import math
from figs_core import Fig, figure
from figs_ch01 import shell_atom

ROW2 = [('Li', 128), ('Be', 96), ('B', 84), ('C', 76), ('N', 71), ('O', 66), ('F', 57)]
GROUP1 = [('Li', 128), ('Na', 166), ('K', 203)]


@figure
def c9_radii():
    f = Fig(1000, 260, 'Covalent radii: across row 2 from lithium 128 pm to fluorine 57 pm the atoms shrink; down column 1 lithium 128, sodium 166, potassium 203 pm they grow.', wide=True)
    s = 0.25  # px per pm (radius)
    base = 165
    f.text(20, 26, 'across row 2', 't b', 'start', 14)
    x = 30
    for sym, r in ROW2:
        R = r * s
        f.circle(x + R, base - R, R, 'wash-e')
        f.circle(x + R, base - R, R, 'ln e')
        f.text(x + R, base - R + 5, sym, 't b', 'middle', 14)
        f.text(x + R, base + 22, f'{r} pm', 't m', 'middle', 12)
        x += 2 * R + 14
    f.arrow(40, 212, x - 20, 212, 'muted')
    f.text((40 + x) / 2, 236, 'one more proton and one more outer electron each step', 't m', 'middle', 12)
    f.line(690, 20, 690, 245, 'ln r')
    f.text(720, 26, 'down column 1', 't b', 'start', 14)
    x = 720
    for sym, r in GROUP1:
        R = r * s
        f.circle(x + R, base - R, R, 'wash-p')
        f.circle(x + R, base - R, R, 'ln p')
        f.text(x + R, base - R + 5, sym, 't b', 'middle', 14)
        f.text(x + R, base + 22, f'{r} pm', 't m', 'middle', 12)
        x += 2 * R + 12
    f.arrow(735, 212, x - 10, 212, 'muted')
    f.text((735 + x) / 2, 236, 'one more shell each step', 't m', 'middle', 12)
    return f.svg()


@figure
def c9_shielding():
    f = Fig(640, 320, 'Shell models of lithium and fluorine. Each has two inner electrons screening the nucleus; fluorine has nine protons and seven outer electrons, lithium three protons and one outer electron.')
    shell_atom(f, 160, 140, 3, [2, 1], 'lithium: 3 protons, 2 inner + 1 outer')
    shell_atom(f, 470, 140, 9, [2, 7], 'fluorine: 9 protons, 2 inner + 7 outer')
    f.text(320, 292, 'Same two inner electrons screening in both. Fluorine’s six extra protons pull its outer shell closer.', 't m', 'middle', 12)
    f.text(320, 310, 'Shells drawn the same size for comparison; the real fluorine atom is smaller.', 't m', 'middle', 12)
    return f.svg()


@figure
def c9_successive_li():
    f = Fig(640, 320, 'Successive ionisation energies of lithium: 520, 7298 and 11815 kilojoules per mole.')
    x0, y0, w, h = 90, 260, 500, 210
    f.axes(x0, y0, w, h, '', '')
    f.text(x0, 30, 'energy to remove the next electron (kJ/mol)', 't m', 'start', 12.5)
    def Y(v): return y0 - v / 12000 * h
    for v in range(0, 12001, 3000):
        f.line(x0 - 4, Y(v), x0, Y(v), 'ax')
        f.text(x0 - 8, Y(v) + 4, f'{v:,}', 't m', 'end', 11.5)
        if v: f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    data = [('1st', 520, 'outer shell', 'bar-e'), ('2nd', 7298, 'inner shell', 'bar-p'), ('3rd', 11815, 'inner shell', 'bar-p')]
    for i, (lab, v, where, cls) in enumerate(data):
        x = x0 + 70 + i * 150
        f.rect(x, Y(v), 70, y0 - Y(v), cls, 2)
        f.text(x + 35, Y(v) - 8, f'{v:,}', 't b', 'middle', 13.5)
        f.text(x + 35, y0 + 20, f'{lab} electron', 't', 'middle', 13)
        f.text(x + 35, y0 + 37, where, 't m', 'middle', 12)
    f.text(x0 + 180, Y(3600), 'about 14 ×', 't p b', 'middle', 13)
    return f.svg()
