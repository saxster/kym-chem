"""Figures for Chapter 10: carbon chains and the chemistry of life."""
import math
from figs_core import Fig, figure

RC, RH, RO, RN = 13, 8.5, 13.5, 13


def struct(f, atoms, bonds, ox=0, oy=0, s=1.0, hi=None):
    """atoms: list of (el, x, y); bonds: (i, j, order). hi: indices to give a highlight halo."""
    P = [(ox + x * s, oy + y * s) for _, x, y in atoms]
    if hi:
        for k in hi:
            f.circle(*P[k], 22 * s, 'hi')
    for i, j, o in bonds:
        f.bond(*P[i], *P[j], o, gap=3.6 * s)
    R = {'C': RC, 'H': RH, 'O': RO, 'N': RN}
    for k, (el, _, _) in enumerate(atoms):
        f.atom(*P[k], el, R.get(el, 13) * s)
    return P


def with_h(heavy, bonds, hmap, L=27):
    """Add hydrogens at given angles (degrees) to heavy atoms. hmap: {index: [angles]}"""
    atoms = list(heavy)
    bonds = list(bonds)
    for i, angs in hmap.items():
        _, x, y = heavy[i]
        for a in angs:
            r = math.radians(a)
            atoms.append(('H', x + L * math.cos(r), y + L * math.sin(r)))
            bonds.append((i, len(atoms) - 1, 1))
    return atoms, bonds


def zigzag(n, dx=34, dy=20):
    return [('C', k * dx, (dy if k % 2 else 0)) for k in range(n)]


def chain_h(n, dx=34, dy=20):
    heavy = zigzag(n, dx, dy)
    bonds = [(k, k + 1, 1) for k in range(n - 1)]
    hmap = {}
    for k in range(n):
        down = k % 2 == 1
        base = [60, 120] if down else [-60, -120]
        if k == 0:
            base = base + [180]
        if k == n - 1:
            base = base + [0]
        hmap[k] = base
    return with_h(heavy, bonds, hmap)


@figure
def c10_frameworks():
    f = Fig(640, 290, 'Three carbon frameworks: a straight chain of four carbons, a branched chain of four carbons, and a ring of six carbons. Every carbon makes four bonds. These flat connectivity drawings are not reference molecular geometries; cyclohexane is nonplanar.')
    # chain: butane
    a, b = chain_h(4)
    struct(f, a, b, 40, 80, 1.0)
    f.text(91, 196, 'a chain', 't b', 'middle', 14)
    f.text(91, 214, 'butane, C₄H₁₀', 't m', 'middle', 12.5)
    # branched: isobutane
    heavy = [('C', 0, 0), ('C', -30, 18), ('C', 30, 18), ('C', 0, -34)]
    bonds = [(0, 1, 1), (0, 2, 1), (0, 3, 1)]
    hm = {0: [90], 1: [150, 210, 90], 2: [30, -30, 90], 3: [-90, -150, -30]}
    a, b = with_h(heavy, bonds, hm, 25)
    struct(f, a, b, 320, 100, 1.0)
    f.text(320, 196, 'a branch', 't b', 'middle', 14)
    f.text(320, 214, 'isobutane, also C₄H₁₀', 't m', 'middle', 12.5)
    # ring: cyclohexane skeletal + atoms
    cx, cy, R = 530, 100, 38
    pts = [(cx + R * math.cos(math.radians(90 + 60 * k)), cy + R * math.sin(math.radians(90 + 60 * k))) for k in range(6)]
    for k in range(6):
        f.bond(*pts[k], *pts[(k + 1) % 6], 1)
    for k in range(6):
        x, y = pts[k]
        ang = math.atan2(y - cy, x - cx)
        for d in (-0.45, 0.45):
            hx, hy = x + 22 * math.cos(ang + d), y + 22 * math.sin(ang + d)
            f.bond(x, y, hx, hy, 1)
            f.atom(hx, hy, 'H', 7)
    for x, y in pts:
        f.atom(x, y, 'C', 12)
    f.text(cx, 196, 'a ring', 't b', 'middle', 14)
    f.text(cx, 214, 'cyclohexane, C₆H₁₂', 't m', 'middle', 12.5)
    f.line(205, 30, 205, 225, 'ln r')
    f.line(425, 30, 425, 225, 'ln r')
    f.text(320, 272, 'Connectivity notation: saturated rings are not flat; chains have conformations.', 't m', 'middle', 13)
    return f.svg()


@figure
def c10_functional():
    f = Fig(640, 300, 'Ethane and ethanol side by side. Ethanol has an O–H group in place of one hydrogen. Ethane boils at −88.6 °C; ethanol at 78.4 °C.')
    # ethane
    a, b = chain_h(2, 40, 0)
    struct(f, a, b, 110, 120)
    f.text(130, 210, 'ethane, C₂H₆', 't b', 'middle', 14)
    f.text(130, 230, 'gas; boils at −88.6 °C', 't m', 'middle', 12.5)
    f.text(130, 248, 'does not mix with water', 't m', 'middle', 12.5)
    # ethanol
    heavy = [('C', 0, 0), ('C', 40, 0), ('O', 76, 18), ]
    bonds = [(0, 1, 1), (1, 2, 1)]
    hm = {0: [180, -110, 110], 1: [-70, -110]}
    a, b = with_h(heavy, bonds, hm)
    a.append(('H', 106, 6)); b.append((2, len(a) - 1, 1))
    struct(f, a, b, 400, 112, hi=[2, len(a) - 1])
    f.text(440, 210, 'ethanol, C₂H₅OH', 't b', 'middle', 14)
    f.text(440, 230, 'liquid; boils at 78.4 °C', 't m', 'middle', 12.5)
    f.text(440, 248, 'mixes with water completely', 't m', 'middle', 12.5)
    f.text(560, 70, 'the –OH group', 't v b', 'middle', 13)
    f.line(545, 78, 505, 108, 'ln m')
    f.line(320, 40, 320, 260, 'ln r')
    f.text(320, 288, 'Almost the same size of molecule. One small group changes how it behaves.', 't m', 'middle', 13)
    return f.svg()


ALK = [(1, 'methane', -161.5), (2, 'ethane', -88.6), (3, 'propane', -42.1), (4, 'butane', -0.5),
       (5, 'pentane', 36.1), (6, 'hexane', 68.7), (7, 'heptane', 98.4), (8, 'octane', 125.6)]


@figure
def c10_chain_bp():
    f = Fig(1000, 360, 'Boiling points of straight-chain alkanes with 1 to 8 carbons, rising from −161.5 °C for methane to 125.6 °C for octane. Room temperature, 25 °C, falls between butane and pentane.', wide=True)
    x0, y0, w, h = 110, 300, 820, 250
    lo, hi = -180, 140
    def X(n): return x0 + 40 + (n - 1) * (w - 80) / 7
    def Y(t): return y0 - (t - lo) / (hi - lo) * h
    f.axes(x0, y0, w, h)
    f.text(x0, 30, 'boiling point (°C)', 't m', 'start', 12.5)
    for t in range(-150, 141, 50):
        f.line(x0 - 4, Y(t), x0, Y(t), 'ax')
        f.text(x0 - 8, Y(t) + 4, f'{t}'.replace('-', '−'), 't m', 'end', 12)
    # room temperature band
    f.rect(x0, Y(25) - 0.5, w, 1, 'fill-vol', 0)
    f.line(x0, Y(25), x0 + w, Y(25), 'ln vol dash')
    f.text(x0 + w, Y(25) - 8, 'room temperature, 25 °C', 't v b', 'end', 12.5)
    f.text(x0 + 10, Y(25) + 20, 'below the line: a gas in a warm room', 't m', 'start', 12)
    f.text(x0 + 10, Y(25) - 10, 'above: a liquid', 't m', 'start', 12)
    pts = [(X(n), Y(t)) for n, _, t in ALK]
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts), 'ln')
    for (n, name, t), (x, y) in zip(ALK, pts):
        f.circle(x, y, 5, 'fill-ink')
        lab = f'{t}'.replace('-', '−') + ' °C'
        if n == 1:
            f.text(x + 12, y + 4, lab, 't b', 'start', 12.5)
        elif n <= 4:
            f.text(x + 10, y + 18, lab, 't b', 'start', 12.5)
        else:
            f.text(x - 10, y - 10, lab, 't b', 'end', 12.5)
        f.text(x, y0 + 20, name, 't', 'middle', 12.5)
        f.text(x, y0 + 37, f'C{n}', 't m', 'middle', 11.5)
    return f.svg()


@figure
def c10_isomers():
    f = Fig(640, 360, 'Two pairs of isomers. Butane and isobutane are both C4H10. Ethanol and dimethyl ether are both C2H6O. Each pair has different boiling points.')
    # row 1: butane vs isobutane
    a, b = chain_h(4)
    struct(f, a, b, 60, 45)
    f.text(112, 140, 'butane: boils at −0.5 °C', 't b', 'middle', 13)
    heavy = [('C', 0, 0), ('C', -30, 18), ('C', 30, 18), ('C', 0, -34)]
    hm = {0: [90], 1: [150, 210, 90], 2: [30, -30, 90], 3: [-90, -150, -30]}
    a, b = with_h(heavy, [(0, 1, 1), (0, 2, 1), (0, 3, 1)], hm, 25)
    struct(f, a, b, 470, 75)
    f.text(470, 140, 'isobutane: boils at −11.7 °C', 't b', 'middle', 13)
    f.text(320, 70, 'both C₄H₁₀', 't m', 'middle', 13)
    f.line(30, 168, 610, 168, 'ln r')
    # row 2: ethanol vs dimethyl ether
    heavy = [('C', 0, 0), ('C', 40, 0), ('O', 76, 18)]
    a, b = with_h(heavy, [(0, 1, 1), (1, 2, 1)], {0: [180, -110, 110], 1: [-70, -110]})
    a.append(('H', 106, 6)); b.append((2, len(a) - 1, 1))
    struct(f, a, b, 70, 250, hi=[2, len(a) - 1])
    f.text(112, 325, 'ethanol: boils at 78.4 °C', 't b', 'middle', 13)
    heavy = [('C', 0, 0), ('O', 34, 18), ('C', 68, 0)]
    a, b = with_h(heavy, [(0, 1, 1), (1, 2, 1)], {0: [180, -110, 110], 2: [0, -70, 70]})
    struct(f, a, b, 436, 245)
    f.text(470, 325, 'dimethyl ether: boils at −24.8 °C', 't b', 'middle', 13)
    f.text(320, 252, 'both C₂H₆O', 't m', 'middle', 13)
    f.text(320, 350, 'highlighted: the O–H group that lets ethanol molecules hydrogen-bond to each other', 't m', 'middle', 12)
    return f.svg()


@figure
def c10_single_double():
    f = Fig(640, 280, 'Ethane, with a single C–C bond 154 picometres long that lets each end spin; and ethene, with a shorter C=C double bond, 134 picometres, that holds all six atoms flat and stops twisting.')
    a, b = chain_h(2, 46, 0)
    struct(f, a, b, 95, 110)
    f.curved_arrow(108, 60, 150, 60, bend=-16, kind='green')
    f.text(130, 40, 'free to spin', 't g b', 'middle', 13)
    f.bracket_label(95, 141, 150, '154 pm', 12, up=False)
    f.text(118, 210, 'ethane, C₂H₆', 't b', 'middle', 14)
    f.text(118, 230, 'single bond', 't m', 'middle', 12.5)
    # ethene
    heavy = [('C', 0, 0), ('C', 40, 0)]
    a, b = with_h(heavy, [(0, 1, 2)], {0: [120, 240], 1: [60, -60]})
    struct(f, a, b, 440, 110)
    f.text(460, 40, 'locked flat: cannot twist', 't p b', 'middle', 13)
    f.bracket_label(440, 480, 150, '134 pm', 12, up=False)
    f.text(460, 210, 'ethene, C₂H₄', 't b', 'middle', 14)
    f.text(460, 230, 'double bond; all six atoms in one plane', 't m', 'middle', 12.5)
    f.line(300, 30, 300, 245, 'ln r')
    f.text(320, 270, 'pm = picometre, a millionth of a millionth of a metre', 't m', 'middle', 12)
    return f.svg()


@figure
def c10_condensation():
    f = Fig(640, 300, 'Ethanoic acid and methanol join to make the ester methyl ethanoate. The arrows give one possible net atom mapping, not a measured pathway or unique isotope history; all atoms are retained including water.')
    # ethanoic acid: C(H3)-C(=O)-O-H
    heavy = [('C', 0, 0), ('C', 38, 0), ('O', 56, -32), ('O', 62, 24)]
    a, b = with_h(heavy, [(0, 1, 1), (1, 2, 2), (1, 3, 1)], {0: [180, -110, 110]})
    a.append(('H', 90, 30)); b.append((3, len(a) - 1, 1))
    struct(f, a, b, 40, 90, hi=[3, len(a) - 1])
    f.text(75, 165, 'ethanoic acid', 't b', 'middle', 13)
    f.text(75, 182, '(the acid in vinegar)', 't m', 'middle', 12)
    f.text(172, 108, '+', 't', 'middle', 26)
    # methanol: H-O-CH3, H on left
    heavy = [('O', 0, 0), ('C', 36, 0)]
    a, b = with_h(heavy, [(0, 1, 1)], {1: [0, -70, 70]})
    a.append(('H', -28, 0)); b.append((0, len(a) - 1, 1))
    struct(f, a, b, 252, 92, hi=[len(a) - 1])
    f.text(264, 165, 'methanol', 't b', 'middle', 13)
    f.arrow(320, 92, 370, 92, 'ink', 1.8)
    # ester: CH3-C(=O)-O-CH3
    heavy = [('C', 0, 0), ('C', 38, 0), ('O', 56, -32), ('O', 62, 24), ('C', 98, 24)]
    a, b = with_h(heavy, [(0, 1, 1), (1, 2, 2), (1, 3, 1), (3, 4, 1)], {0: [180, -110, 110], 4: [0, -70, 70]})
    struct(f, a, b, 405, 85)
    f.text(460, 165, 'methyl ethanoate', 't b', 'middle', 13)
    f.text(460, 182, '(an ester; smells fruity)', 't m', 'middle', 12)
    # water leaving
    f.curved_arrow(80, 192, 300, 240, bend=20, kind='muted', dash=True)
    f.curved_arrow(250, 180, 312, 222, bend=-8, kind='muted', dash=True)
    f.molecule('H2O', 330, 238, 1.0)
    f.text(360, 244, '+ water, H₂O', 't b', 'start', 13)
    f.text(320, 290, 'Count the atoms: C₂H₄O₂ + CH₄O → C₃H₆O₂ + H₂O. Nothing is lost.', 't m', 'middle', 12.5)
    return f.svg()
