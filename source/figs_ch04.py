"""Figures for Chapter 4."""
import math
from figs_core import Fig, figure, jitter_grid


@figure
def c4_physical_vs_chemical():
    f = Fig(640, 300, 'Left: ice melting, the same water molecules end up more loosely arranged. Right: hydrogen and oxygen molecules react and their atoms regroup into water molecules.')
    f.text(160, 24, 'Physical change: melting', 't b', 'middle', 14)
    f.text(480, 24, 'Chemical change: a reaction', 't b', 'middle', 14)
    f.line(320, 14, 320, 290, 'ln r')
    # ice: ordered grid
    for r in range(3):
        for c in range(2):
            f.molecule('H2O', 50 + c * 50, 76 + r * 46, 0.85, rot=(r + c) % 2 * 180)
    f.arrow(132, 122, 168, 122, 'ink')
    # liquid: jumbled
    for i, (x, y) in enumerate([(200, 70), (262, 84), (222, 124), (288, 136), (196, 176), (258, 186)]):
        f.molecule('H2O', x, y, 0.85, rot=i * 67 + 20)
    f.text(75, 220, 'ice', 't m', 'middle', 12.5)
    f.text(248, 220, 'liquid water', 't m', 'middle', 12.5)
    f.lines(160, 252, ['same molecules,', 'new arrangement'], 't', 'middle', 13)
    # reaction
    f.molecule('H2', 370, 82, 0.9); f.molecule('H2', 370, 132, 0.9)
    f.molecule('O2', 370, 182, 0.85)
    f.arrow(412, 132, 470, 132, 'ink')
    f.molecule('H2O', 530, 98, 0.95); f.molecule('H2O', 530, 168, 0.95, rot=180)
    f.text(370, 220, '2 H₂ + O₂', 't s', 'middle', 14)
    f.text(530, 220, '2 H₂O', 't s', 'middle', 14)
    f.lines(480, 252, ['same atoms,', 'new molecules'], 't', 'middle', 13)
    return f.svg()


@figure
def c4_formula_reading():
    f = Fig(640, 250, 'Three separate water molecules labelled 3 H2O, compared with one hydrogen peroxide molecule labelled H2O2.')
    f.text(190, 30, '3 H₂O', 't s', 'middle', 26)
    f.text(190, 52, 'coefficient 3: three whole molecules', 't m', 'middle', 12.5)
    for k in range(3):
        f.molecule('H2O', 100 + k * 90, 120, 1.25)
    f.text(190, 186, '6 hydrogen atoms, 3 oxygen atoms', 't', 'middle', 13)
    f.text(190, 206, 'still water', 't b', 'middle', 13)
    f.line(390, 18, 390, 230, 'ln r')
    f.text(515, 30, 'H₂O₂', 't s', 'middle', 26)
    f.text(515, 52, 'subscript 2 on O: a new molecule', 't m', 'middle', 12.5)
    f.molecule('H2O2', 515, 120, 1.35)
    f.text(515, 186, '2 hydrogen atoms, 2 oxygen atoms', 't', 'middle', 13)
    f.text(515, 206, 'hydrogen peroxide: not water', 't b p', 'middle', 13)
    return f.svg()


@figure
def c4_balance_tiles():
    f = Fig(640, 330, 'Methane plus two oxygen molecules give carbon dioxide plus two water molecules, with a table showing 1 carbon, 4 hydrogen and 4 oxygen atoms on each side.')
    # molecules
    f.molecule('CH4', 70, 90, 1.05)
    f.text(118, 96, '+', 't', 'middle', 22)
    f.molecule('O2', 162, 70, 0.95); f.molecule('O2', 162, 118, 0.95)
    f.arrow(212, 92, 268, 92, 'ink', 1.8)
    f.molecule('CO2', 330, 92, 1.0)
    f.text(388, 98, '+', 't', 'middle', 22)
    f.molecule('H2O', 440, 72, 1.0); f.molecule('H2O', 440, 124, 1.0)
    f.text(70, 162, 'CH₄', 't s', 'middle', 16)
    f.text(162, 162, '2 O₂', 't s', 'middle', 16)
    f.text(330, 162, 'CO₂', 't s', 'middle', 16)
    f.text(440, 162, '2 H₂O', 't s', 'middle', 16)
    # count table
    y0 = 200
    f.text(60, y0, 'atom count', 't m', 'start', 12.5)
    f.text(240, y0, 'left side', 't b', 'middle', 13)
    f.text(420, y0, 'right side', 't b', 'middle', 13)
    rows = [('C', '1', '1'), ('H', '4', '2 × 2 = 4'), ('O', '2 × 2 = 4', '2 + 2 × 1 = 4')]
    for i, (el, l, r) in enumerate(rows):
        y = y0 + 34 + i * 32
        f.atom(74, y - 5, el, 11)
        f.text(240, y, l, 't', 'middle', 14)
        f.text(420, y, r, 't', 'middle', 14)
        f.text(560, y, 'balanced', 't g b', 'middle', 13)
        f.line(60, y + 12, 600, y + 12, 'ln r')
    return f.svg()


@figure
def c4_spark():
    f = Fig(640, 270, 'Two flasks of hydrogen and oxygen. Left, at room temperature, nothing happens. Right, a spark makes the mixture react almost instantly to form water.')
    for k, (cx, title, sub) in enumerate(((160, 'room temperature, no spark', 'nothing measurable, even for years'),
                                          (480, 'add a spark', 'reacts in a fraction of a second'))):
        f.text(cx, 26, title, 't b', 'middle', 14)
        # flask
        f.path(f'M{cx - 18},44 L{cx - 18},92 L{cx - 82},196 Q{cx - 88},212 {cx - 70},212 L{cx + 70},212 Q{cx + 88},212 {cx + 82},196 L{cx + 18},92 L{cx + 18},44', 'glass')
        pts = [(cx - 40, 180), (cx + 2, 176), (cx + 44, 182), (cx - 22, 146), (cx + 22, 140), (cx, 112)]
        if k == 0:
            kinds = ['H2', 'O2', 'H2', 'H2', 'H2', 'O2']
            for (x, y), m in zip(pts, kinds):
                f.molecule(m, x, y, 0.62, rot=(x * 7) % 180)
        else:
            for (x, y) in pts[:4]:
                f.molecule('H2O', x, y, 0.62, rot=(x * 11) % 360)
            # spark
            sx, sy = cx + 50, 120
            f.path(f'M{sx},{sy - 20} L{sx - 7},{sy - 2} L{sx + 3},{sy - 2} L{sx - 5},{sy + 18}', 'ln p')
            f.circle(sx - 1, sy, 16, 'ln p dash')
        f.text(cx, 238, sub, 't m', 'middle', 12.5)
    f.text(320, 262, 'Both flasks: 2 H₂ + O₂ → 2 H₂O balances. Only one reaction actually happens.', 't', 'middle', 12.5)
    return f.svg()
