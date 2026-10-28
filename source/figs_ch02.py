"""Figures for Chapter 2."""
import math
from figs_core import Fig, figure, catmull, jitter_grid


@figure
def c2_element_compound_mixture():
    f = Fig(640, 270, 'Four boxes of particles: hydrogen molecules (element), oxygen molecules (element), water molecules (compound), and a mixture of hydrogen and oxygen molecules.')
    boxes = [
        ('hydrogen, H₂', 'an element', [('H2', 7)]),
        ('oxygen, O₂', 'an element', [('O2', 5)]),
        ('water, H₂O', 'a compound', [('H2O', 6)]),
        ('hydrogen + oxygen', 'a mixture', [('H2', 4), ('O2', 3)]),
    ]
    for i, (name, kind, mols) in enumerate(boxes):
        x = 8 + i * 158
        f.rect(x, 14, 148, 170, 'plate', 6)
        items = [m for m, k in mols for _ in range(k)]
        pts = jitter_grid(len(items), x, 14, 148, 170, seed=i + 3, margin=22)
        for j, (m, (px, py)) in enumerate(zip(items, pts)):
            f.molecule(m, px, py, 0.82, rot=(j * 53 + i * 20) % 180)
        f.text(x + 74, 210, name, 't b', 'middle', 13.5)
        f.text(x + 74, 230, kind, 't v' if kind != 'a mixture' else 't p', 'middle', 13)
    return f.svg()


@figure
def c2_coulomb():
    f = Fig(640, 280, 'Opposite charges attract; at twice the distance the attraction is one quarter as strong. Like charges repel.')
    def charge(x, y, s):
        f.nucleon(x, y, 'p' if s == '+' else 'e', 15)
    rows = [
        (60, '+', '−', 120, 72, 'opposite charges, distance 1', 'attraction: 1'),
        (150, '+', '−', 240, 18, 'opposite charges, distance 2', 'attraction: ¼ as strong'),
        (240, '+', '+', 120, -72, 'like charges, distance 1', 'repulsion: they push apart'),
    ]
    for y, s1, s2, d, L, lab, res in rows:
        x1 = 70
        x2 = x1 + d
        charge(x1, y, s1); charge(x2, y, s2)
        f.line(x1, y + 24, x2, y + 24, 'ln m thin')
        f.line(x1, y + 20, x1, y + 28, 'ln m thin'); f.line(x2, y + 20, x2, y + 28, 'ln m thin')
        if L > 0:
            f.arrow(x1 + 18, y, x1 + 18 + L * .55, y, 'green', 2.4)
            f.arrow(x2 - 18, y, x2 - 18 - L * .55, y, 'green', 2.4)
        else:
            f.arrow(x1 - 18, y, x1 - 18 + L * .55, y, 'proton', 2.4)
            f.arrow(x2 + 18, y, x2 + 18 - L * .55, y, 'proton', 2.4)
        f.text(400, y - 4, lab, 't', 'start', 13.5)
        f.text(400, y + 14, res, 't b' + (' g' if L > 0 else ' p'), 'start', 13.5)
    return f.svg()


@figure
def c2_bond_energy():
    f = Fig(640, 320, 'Energy of two hydrogen atoms against the distance between their nuclei: a dip with its lowest point at 74 picometres, 436 kJ per mole below separate atoms.')
    x0, y0, w, h = 70, 40, 520, 230
    De, re, a = 436, 74, 0.0194
    def V(r): return De * (1 - math.exp(-a * (r - re))) ** 2 - De
    def X(r): return x0 + (r - 0) / 320 * w
    def Y(v): return y0 + (200 - v) / 700 * h
    f.line(x0, y0, x0, y0 + h, 'ax')
    f.line(x0, Y(0), x0 + w, Y(0), 'ln m dash')
    f.text(x0 + w, Y(0) - 8, 'separate atoms (zero)', 't m', 'end', 12)
    pts = [(X(r), Y(V(r))) for r in [r / 2 for r in range(56, 641)] if V(r) < 200]
    f.path(catmull(pts[::3] + [pts[-1]]), 'ln vol')
    xm, ym = X(re), Y(-De)
    f.circle(xm, ym, 5, 'fill-vol')
    
    f.text(xm, y0 + h + 18, '74 pm', 't b', 'middle', 12.5)
    f.arrow(xm, Y(0) + 3, xm, ym - 7, 'ink', 1.3)
    f.arrow(xm, ym - 7, xm, Y(0) + 3, 'ink', 1.3)
    f.text(xm + 14, ym + 24, '436 kJ per mole to pull the atoms apart', 't', 'start', 12.5)
    f.text(x0 + w, y0 + h + 18, 'distance between nuclei', 't m', 'end', 12)
    f.text(x0 - 8, y0 + 10, 'energy', 't m', 'end', 12)
    f.text(X(56), Y(170), 'too close:', 't m', 'start', 12)
    f.text(X(56), Y(140), 'nuclei repel', 't m', 'start', 12)
    f.atom(X(262), Y(-150), 'H', 9); f.atom(X(296), Y(-150), 'H', 9)
    f.text(X(279), Y(-200), 'atoms far apart', 't m', 'middle', 11.5)
    f.text(xm - 10, ym + 16, 'the bond', 't v b', 'end', 12)
    return f.svg()


@figure
def c2_three_co2():
    f = Fig(640, 200, 'Three separate carbon dioxide molecules, containing 3 carbon atoms and 6 oxygen atoms in total.')
    for i in range(3):
        f.molecule('CO2', 110 + i * 150, 70, 1.25)
        f.text(110 + i * 150, 116, f'molecule {i + 1}', 't m', 'middle', 12)
    f.bracket_label(40, 400, 140, '', up=False)
    f.text(220, 170, '3 CO₂: 3 carbon atoms, 6 oxygen atoms', 't b', 'middle', 14)
    f.text(530, 64, 'not one', 't m', 'middle', 13)
    f.text(530, 92, 'C₃O₆', 't s', 'middle', 22)
    f.line(500, 85, 562, 85, 'ln p')
    return f.svg()


@figure
def c2_nacl_lattice():
    f = Fig(640, 300, 'One layer of the sodium chloride lattice: alternating sodium and chloride ions in a square grid. The highlighted sodium ion has four chloride neighbours in this layer and one above and one below.')
    s = 52
    x0, y0 = 60, 40
    cols, rows = 7, 5
    for j in range(rows):
        f.line(x0, y0 + j * s, x0 + (cols - 1) * s, y0 + j * s, 'ln r')
    for i in range(cols):
        f.line(x0 + i * s, y0, x0 + i * s, y0 + (rows - 1) * s, 'ln r')
    ci, cj = 3, 2
    for j in range(rows):
        for i in range(cols):
            x, y = x0 + i * s, y0 + j * s
            if (i + j) % 2 == 1:
                f.atom(x, y, 'Na', 13)
            else:
                f.atom(x, y, 'Cl', 20)
    # highlight
    cx, cy = x0 + ci * s, y0 + cj * s
    if (ci + cj) % 2 == 1:
        f.circle(cx, cy, 19, 'ln vol')
        for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            f.circle(cx + di * s, cy + dj * s, 25, 'ln vol dash')
    f.text(430, 70, 'Na⁺', 't b', 'start', 14)
    f.atom(500, 65, 'Na', 11)
    f.text(430, 100, 'Cl⁻', 't b', 'start', 14)
    f.atom(500, 95, 'Cl', 16)
    f.lines(430, 150, ['The ringed Na⁺ has', '4 Cl⁻ neighbours here,', '1 above this layer', 'and 1 below: 6 in all.'], 't', 'start', 13, 1.35)
    return f.svg()


@figure
def c2_salt_energy():
    f = Fig(640, 320, 'Energy ladder for making solid sodium chloride from gas-phase atoms: up 496 kJ, down 349 kJ, then down 787 kJ, ending 640 kJ below the start.')
    def Y(v): return 150 - v * 0.21
    f.line(20, Y(0), 620, Y(0), 'ln r', 'stroke-dasharray="2 4"')
    levels = [(0, 'Na + Cl atoms', 20, 150), (496, 'Na⁺ + e⁻ + Cl', 170, 290), (147, 'Na⁺ + Cl⁻, far apart', 310, 430), (-640, 'solid NaCl lattice', 450, 620)]
    for v, lab, xa, xb in levels:
        f.line(xa, Y(v), xb, Y(v), 'ln')
        f.text(xa, Y(v) - 8, lab, 't b' if v == -640 else 't', 'start', 12.5)
    steps = [(0, 496, 160, 'proton', '+496 kJ', 'remove an electron', 'from sodium'),
             (496, 147, 300, 'green', '−349 kJ', 'chlorine captures', 'the electron'),
             (147, -640, 440, 'green', '−787 kJ', 'ions pack into', 'a lattice')]
    for a, b, x, k, lab, d1, d2 in steps:
        f.arrow(x, Y(a), x, Y(b), k, 2)
        m = (Y(a) + Y(b)) / 2
        f.text(x - 8, m - 10, lab, 't b ' + ('p' if k == 'proton' else 'g'), 'end', 13)
        f.text(x - 8, m + 6, d1, 't m', 'end', 11.5)
        f.text(x - 8, m + 20, d2, 't m', 'end', 11.5)
    f.text(620, Y(-640) + 22, 'overall: 640 kJ lower', 't b v', 'end', 13)
    f.text(20, 18, 'energy per mole (kJ); dotted line = starting energy', 't m', 'start', 12)
    return f.svg()


def _proj(p, rx=0.5, ry=0.35):
    x, y, z = p
    # rotate about y then x
    cx, sx = math.cos(rx), math.sin(rx)
    x, z = x * cx + z * sx, -x * sx + z * cx
    cy_, sy = math.cos(ry), math.sin(ry)
    y, z = y * cy_ - z * sy, y * sy + z * cy_
    return x, y, z


@figure
def c2_diamond_graphite():
    f = Fig(640, 300, 'Diamond: each carbon atom bonded to four others in a three-dimensional network. Graphite: flat sheets of hexagons stacked in layers with weak attraction between them.')
    # diamond fragment: centre, 4 neighbours, 12 second neighbours
    d = [(1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)]
    atoms = {(0, 0, 0)}
    bonds = []
    for v in d:
        a1 = v
        atoms.add(a1); bonds.append(((0, 0, 0), a1))
        for w in d:
            a2 = (a1[0] - w[0], a1[1] - w[1], a1[2] - w[2])
            if a2 != (0, 0, 0):
                atoms.add(a2); bonds.append((a1, a2))
    S, cx, cy = 34, 165, 150
    P = {a: _proj(a) for a in atoms}
    def xy(a): return cx + P[a][0] * S, cy + P[a][1] * S
    for a, b in sorted(bonds, key=lambda ab: P[ab[0]][2] + P[ab[1]][2]):
        f.bond(*xy(a), *xy(b), 1, cls='bond')
    for a in sorted(atoms, key=lambda a: P[a][2]):
        z = P[a][2]
        f.atom(*xy(a), 'C', 10.5 + z * 1.2, label=False)
    f.text(cx, 284, 'diamond: 4 bonds per atom, a 3D network', 't b', 'middle', 13)
    # graphite: two sheets
    hexr = 22
    def sheet(ox, oy):
        pts = []
        for i in range(-3, 4):
            for j in range(-2, 3):
                for k in (0, 1):
                    x = i * hexr * math.sqrt(3) + (j % 2) * hexr * math.sqrt(3) / 2
                    y = j * hexr * 1.5 + (hexr if k else 0) * 0
                    pts.append((x, y + k * hexr))
        return pts
    # honeycomb via axial lattice
    a1 = (hexr * math.sqrt(3), 0); a2 = (hexr * math.sqrt(3) / 2, hexr * 1.5)
    base = [(0, 0), (0, hexr)]
    def honey(ox, oy, shift):
        nodes = {}
        for i in range(-3, 4):
            for j in range(-2, 3):
                for bx, by in base:
                    x = i * a1[0] + j * a2[0] + bx + shift
                    y = j * a2[1] + by
                    if abs(x) < 80 and abs(y) < 52:
                        nodes[(round(x, 1), round(y, 1))] = 1
        pts = list(nodes)
        def scr(p): return ox + p[0] + p[1] * 0.55, oy + p[1] * 0.42
        edges = [(p, q) for i_, p in enumerate(pts) for q in pts[i_ + 1:] if abs(math.hypot(p[0] - q[0], p[1] - q[1]) - hexr) < 0.5]
        return pts, edges, scr
    for layer, oy in ((1, 90), (0, 190)):
        pts, edges, scr = honey(470, oy, 0 if layer else hexr * math.sqrt(3) / 2)
        for p, q in edges:
            f.bond(*scr(p), *scr(q), 1, cls='bond')
        for p in pts:
            f.atom(*scr(p), 'C', 7.5, label=False)
    for x in (420, 470, 520):
        f.line(x + 10, 118, x + 10, 168, 'ln m dash')
    f.text(600, 146, 'weak', 't m', 'start', 12)
    f.text(600, 161, 'pull', 't m', 'start', 12)
    f.text(470, 284, 'graphite: flat sheets of hexagons', 't b', 'middle', 13)
    f.line(320, 20, 320, 270, 'ln r')
    return f.svg()


@figure
def c2_dipoles():
    f = Fig(640, 315, 'Carbon dioxide: two bond pulls in opposite directions cancel, so the molecule is non-polar. Water: two bond pulls at an angle add up, so the molecule is polar.')
    # CO2
    cx, cy = 160, 130
    f.molecule('CO2', cx, cy, 1.9)
    f.arrow(cx - 8, cy - 46, cx - 50, cy - 46, 'electron', 1.6)
    f.arrow(cx + 8, cy - 46, cx + 50, cy - 46, 'electron', 1.6)
    f.text(cx - 57, cy + 50, 'δ⁻', 't s', 'middle', 16)
    f.text(cx, cy + 50, 'δ⁺', 't s', 'middle', 16)
    f.text(cx + 57, cy + 50, 'δ⁻', 't s', 'middle', 16)
    f.text(cx, 240, 'CO₂, straight', 't b', 'middle', 14)
    f.text(cx, 258, 'the two pulls cancel:', 't', 'middle', 13)
    f.text(cx, 276, 'not polar overall', 't b v', 'middle', 13)
    # H2O
    hx, hy = 470, 110
    s = 2.2
    f.molecule('H2O', hx, hy, s)
    ang = math.radians(104.5 / 2)
    ox, oy = hx, hy - 5 * s
    for sign in (-1, 1):
        hxx, hyy = hx + sign * 24 * math.sin(ang) * s, hy - 5 * s + 24 * math.cos(ang) * s
        dx, dy = ox - hxx, oy - hyy
        n = math.hypot(dx, dy); px, py = -dy / n, dx / n
        if px * sign < 0: px, py = -px, -py
        off = 46
        f.arrow(hxx + px * off + dx * .15, hyy + py * off + dy * .15, hxx + px * off + dx * .75, hyy + py * off + dy * .75, 'electron', 1.6)
        f.text(hxx + sign * 6, hyy + 38, 'δ⁺', 't s', 'middle', 16)
    f.text(hx + 30, oy - 26, 'δ⁻', 't s', 'middle', 16)
    f.arrow(hx, hy + 108, hx, hy + 62, 'electron', 4.5)
    f.text(hx + 10, hy + 100, 'overall pull', 't e b', 'start', 12.5)
    f.text(hx, 240, 'H₂O, bent (104.5°)', 't b', 'middle', 14)
    f.text(hx, 258, 'the two pulls add up:', 't', 'middle', 13)
    f.text(hx, 276, 'polar', 't b p', 'middle', 13)
    f.line(320, 20, 320, 280, 'ln r')
    f.text(20, 306, 'Thin arrows point to the atom that pulls shared electrons harder.', 't m', 'start', 11.5)
    return f.svg()
