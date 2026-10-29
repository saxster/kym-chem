"""Figures for Chapter 1. Helpers named draw_* are reusable by other chapters."""
import math
from figs_core import Fig, figure, pack_disc, catmull


def draw_nucleus(f, cx, cy, p, n, r=9, sign=True):
    """Pack p protons and n neutrons into a roughly round nucleus centred at (cx, cy)."""
    total = p + n
    kinds = []
    # interleave protons and neutrons evenly, deterministically
    ip = inn = 0
    for k in range(total):
        if (ip + 1) * total <= (k + 1) * p + total // 2 and ip < p or inn >= n:
            kinds.append('p'); ip += 1
        else:
            kinds.append('n'); inn += 1
    offs = pack_disc(total, r)
    # draw outermost first so the centre sits on top
    order = sorted(range(total), key=lambda k: -(offs[k][0] ** 2 + offs[k][1] ** 2))
    for k in order:
        f.nucleon(cx + offs[k][0], cy + offs[k][1], kinds[k], r, sign)
    radius = max(math.hypot(*o) for o in offs) + r if offs else r
    return radius


def draw_electrons(f, cx, cy, e, r_in, r_out, er=6.5, seed=0.4):
    pts = []
    golden = math.pi * (3 - math.sqrt(5))
    for k in range(e):
        frac = (k + .5) / max(e, 1)
        rr = r_in + (r_out - r_in) * (0.25 + 0.7 * ((k * 0.618) % 1))
        th = k * golden * 1.0 + seed
        x, y = cx + rr * math.cos(th), cy + rr * math.sin(th)
        pts.append((x, y))
        f.nucleon(x, y, 'e', er)
    return pts


def draw_atom(f, cx, cy, p, n, e, R=110, r=9, region=True):
    if region:
        f.circle(cx, cy, R, 'region')
    rn = draw_nucleus(f, cx, cy, p, n, r)
    draw_electrons(f, cx, cy, e, rn + 14, R - 10)
    return rn


@figure
def atom_counting(p=6, n=6, e=6, name='carbon-12'):
    f = Fig(640, 300, f'Counting model of {name}: {p} protons, {n} neutrons, {e} electrons.')
    draw_atom(f, 190, 150, p, n, e, R=120)
    f.text(190, 290, 'electron region (drawn far too small)', 't m', 'middle', 12)
    x = 380
    f.text(x, 52, name, 't b', 'start', 17)
    rows = [('proton', 'Protons', p, f'+{p}', 'p'), ('neutron', 'Neutrons', n, '0', 'nn'), ('electron', 'Electrons', e, f'−{e}', 'e')]
    for i, (k, lab, cnt, ch, c) in enumerate(rows):
        y = 92 + i * 36
        f.nucleon(x + 9, y - 5, {'proton': 'p', 'neutron': 'n', 'electron': 'e'}[k], 8)
        f.text(x + 28, y, lab, 't', 'start', 14.5)
        f.text(x + 165, y, str(cnt), 't b', 'end', 15)
        f.text(x + 240, y, f'charge {ch}', f't m', 'end', 13)
    f.line(x, 192, x + 240, 192, 'ln r')
    charge = p - e
    cs = '0 (neutral)' if charge == 0 else (f'+{charge}' if charge > 0 else f'−{-charge}')
    f.text(x, 220, 'Overall charge', 't', 'start', 14.5)
    f.text(x + 240, 220, cs, 't b', 'end', 15)
    f.text(x, 250, 'Mass number (p + n)', 't', 'start', 14.5)
    f.text(x + 240, 250, str(p + n), 't b', 'end', 15)
    return f.svg()


@figure
def gold_foil():
    f = Fig(640, 300, 'Alpha particles fired at gold foil: most pass straight through, a few are deflected and a very few bounce back.')
    # source
    f.rect(20, 120, 62, 56, 'fill-sheet', 4, 'stroke="currentColor"')
    f.rect(20, 120, 62, 56, 'ln', 4)
    f.text(51, 196, 'alpha', 't m', 'middle', 12)
    f.text(51, 211, 'source', 't m', 'middle', 12)
    # foil
    fx = 250
    f.rect(fx - 3, 48, 6, 204, 'fill-vol', 1)
    f.text(fx, 38, 'gold foil', 't v b', 'middle', 13)
    # beam
    for k, dy in enumerate([-12, -4, 4, 12]):
        f.line(82, 148 + dy, fx - 6, 148 + dy, 'ln m')
    f.arrow(82, 148, 150, 148, 'muted')
    # outcomes
    for dy in [-14, -6, 2, 10, 18]:
        f.arrow(fx + 6, 146 + dy, 340, 146 + dy * 1.02, 'ink', 1.2)
    f.text(298, 190, 'most go straight through', 't', 'middle', 12.5)
    f.arrow(fx + 6, 140, 330, 92, 'ink', 1.2)
    f.text(250 + 86, 86, 'a few are deflected', 't', 'start', 12.5)
    f.curved_arrow(fx - 6, 156, 150, 226, bend=-26, kind='proton')
    f.text(110, 250, 'a very few bounce back', 't p', 'middle', 12.5)
    # magnified inset
    cx, cy, R = 545, 160, 82
    f.circle(cx, cy, R, 'plate')
    f.add(f'<clipPath id="gf"><circle cx="{cx}" cy="{cy}" r="{R - 1.5}"/></clipPath><g clip-path="url(#gf)">')
    nuclei = [(cx - 40, cy - 46), (cx + 12, cy - 40), (cx - 18, cy + 4), (cx + 36, cy + 10), (cx - 44, cy + 52), (cx + 6, cy + 56)]
    for (x, y) in nuclei:
        f.circle(x, y, 24, 'region')
        f.circle(x, y, 2.6, 'fill-ink')
    f.arrow(cx - R, cy - 22, cx + R, cy - 22, 'ink', 1.1)
    f.arrow(cx - R, cy + 32, cx + R, cy + 32, 'ink', 1.1)
    f.path(catmull([(cx - R, cy - 2), (cx - 40, cy - 2), (cx - 24, cy + 1), (cx - 16, cy - 12), (cx + 10, cy - 70)]), 'ar ar-ink', 'marker-end="url(#ah-ink)"')
    f.add('</g>')
    f.circle(cx, cy, R, 'ln')
    f.text(cx, cy + R + 22, 'magnified: tiny nuclei,', 't m', 'middle', 12)
    f.text(cx, cy + R + 37, 'mostly empty space', 't m', 'middle', 12)
    return f.svg()


def mini_atom(f, cx, cy, p, n, e, ring=None, r=5.6):
    f.circle(cx, cy, 58, 'region')
    rn = draw_nucleus(f, cx, cy, p, n, r, sign=False)
    pts = []
    for k in range(e):
        th = -math.pi / 2 + 2 * math.pi * k / max(e, 1)
        rr = rn + 20 + (k % 2) * 10
        x, y = cx + rr * math.cos(th), cy + rr * math.sin(th)
        f.nucleon(x, y, 'e', 4.6, sign=False)
        pts.append((x, y))
    return rn


@figure
def identity_strip():
    f = Fig(640, 250, 'Starting from carbon-12, removing an electron or adding a neutron leaves carbon; adding a proton makes nitrogen.')
    panels = [
        ('start', 6, 6, 6, 'carbon-12', 'C', '6 p, 6 n, 6 e'),
        ('take away an electron', 6, 6, 5, 'still carbon', 'C⁺', 'charge +1'),
        ('add a neutron', 6, 7, 6, 'still carbon', 'carbon-13', 'heavier'),
        ('add a proton', 7, 6, 6, 'now nitrogen', 'N', '7 protons'),
    ]
    for i, (act, p, n, e, verdict, sym, note) in enumerate(panels):
        cx = 80 + i * 160
        f.text(cx, 24, act, 't m', 'middle', 12.5)
        mini_atom(f, cx, 104, p, n, e)
        cls = 't b p' if 'nitrogen' in verdict else 't b'
        f.text(cx, 190, verdict, cls, 'middle', 14)
        f.text(cx, 210, sym, 't s', 'middle', 15)
        f.text(cx, 230, note, 't m', 'middle', 12)
        if i:
            f.line(cx - 80, 40, cx - 80, 236, 'ln r')
    return f.svg()


@figure
def mass_spectrum_cl():
    f = Fig(640, 290, 'Mass spectrum of chlorine: a tall peak at mass 35 (about 76%) and a shorter one at 37 (about 24%). The average, 35.45, lies between them.')
    x0, y0, w, h = 70, 240, 520, 190
    f.axes(x0, y0, w, h, 'mass of atom (u)', 'how common (%)')
    def X(m): return x0 + (m - 33) / 6 * w
    def Y(v): return y0 - v / 80 * h
    for v in (0, 20, 40, 60, 80):
        f.line(x0 - 4, Y(v), x0, Y(v), 'ax')
        f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 11.5)
        if v: f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    for m in range(33, 40):
        f.line(X(m), y0, X(m), y0 + 4, 'ax')
        f.text(X(m), y0 + 18, str(m), 't m', 'middle', 11.5)
    for m, v, lab in ((35, 75.8, 'chlorine-35'), (37, 24.2, 'chlorine-37')):
        f.rect(X(m) - 14, Y(v), 28, y0 - Y(v), 'fill-ink', 2)
        f.text(X(m) + 20, Y(v) + 12, lab, 't b', 'start', 12.5)
        f.text(X(m) + 20, Y(v) + 27, f'{v}%', 't m', 'start', 12)
    xa = X(35.45)
    f.line(xa, y0, xa, Y(78), 'ln vol dash')
    f.text(590, 24, 'average ≈ 35.45 u: not a separate isotope', 't v b', 'end', 12.5)
    return f.svg()


@figure
def charge_tally():
    f = Fig(640, 260, 'A sodium atom has 11 protons and 11 electrons, charge zero. A sodium ion has 11 protons and 10 electrons, charge plus one.')
    for col, (title, e, total) in enumerate((('sodium atom, Na', 11, '11 − 11 = 0'), ('sodium ion, Na⁺', 10, '11 − 10 = +1'))):
        x0 = 30 + col * 320
        f.text(x0, 30, title, 't b', 'start', 15)
        f.text(x0, 72, 'protons', 't m', 'start', 12)
        f.text(x0, 132, 'electrons', 't m', 'start', 12)
        for k in range(11):
            x = x0 + 18 + k * 24
            f.nucleon(x, 92, 'p', 9.5)
            if k < e:
                f.nucleon(x, 152, 'e', 9.5)
                f.line(x, 103, x, 141, 'ln r')
            else:
                f.circle(x, 152, 10, 'ln m dash')
                f.circle(x, 92, 14, 'ln vol')
        f.text(x0, 200, 'charge', 't m', 'start', 12)
        f.text(x0, 226, total, 't b' + (' v' if e < 11 else ''), 'start', 19)
    f.line(318, 20, 318, 240, 'ln r')
    return f.svg()


@figure
def nuclide_notation():
    f = Fig(640, 250, 'Nuclear symbol for oxygen-17 with charge 2 minus. Top left: mass number 17. Bottom left: atomic number 8. Top right: charge 2 minus.')
    cx, cy = 320, 140
    f.text(cx, cy + 34, 'O', 't s', 'middle', 104, 400)
    f.text(cx - 40, cy - 28, '17', 't s', 'end', 44)
    f.text(cx - 40, cy + 34, '8', 't s', 'end', 44)
    f.text(cx + 40, cy - 28, '2−', 't s', 'start', 44)
    # leaders and labels
    f.line(cx - 100, cy - 44, 205, 52, 'ln m')
    f.lines(20, 30, ['mass number, A', 'protons + neutrons = 17'], 't', 'start', 13.5)
    f.line(cx - 92, cy + 22, 205, 210, 'ln m')
    f.lines(20, 206, ['atomic number, Z', 'protons = 8 (always 8 for O)'], 't', 'start', 13.5)
    f.line(cx + 96, cy - 44, 448, 52, 'ln m')
    f.lines(452, 30, ['charge', 'protons − electrons', '8 − 10 = −2'], 't', 'start', 13.5)
    f.lines(452, 190, ['neutrons = 17 − 8 = 9', 'electrons = 8 + 2 = 10'], 't m', 'start', 13)
    return f.svg()


IE1 = [('H', 1312), ('He', 2372), ('Li', 520), ('Be', 900), ('B', 801), ('C', 1086), ('N', 1402), ('O', 1314), ('F', 1681),
       ('Ne', 2081), ('Na', 496), ('Mg', 738), ('Al', 578), ('Si', 787), ('P', 1012), ('S', 1000), ('Cl', 1251), ('Ar', 1521)]


@figure
def ionisation_plot():
    f = Fig(1000, 350, 'First ionisation energies of elements 1 to 18, with peaks at helium, neon and argon and sharp drops at lithium and sodium.', wide=True)
    x0, y0, w, h = 90, 290, 860, 230
    f.axes(x0, y0, w, h, '', '')
    f.text(x0, 22, 'energy needed to remove one electron (kJ per mole of atoms)', 't m', 'start', 12.5)
    def X(i): return x0 + 22 + i * (w - 44) / 17
    def Y(v): return y0 - v / 2500 * h
    for v in range(0, 2501, 500):
        f.line(x0 - 4, Y(v), x0, Y(v), 'ax')
        f.text(x0 - 8, Y(v) + 4, f'{v:,}', 't m', 'end', 12)
        if v: f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    pts = [(X(i), Y(v)) for i, (_, v) in enumerate(IE1)]
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts), 'ln')
    for i, (s, v) in enumerate(IE1):
        x, y = pts[i]
        cls = 'fill-vol' if s in ('He', 'Ne', 'Ar') else ('fill-ink')
        f.circle(x, y, 5.5 if s in ('He', 'Ne', 'Ar', 'Li', 'Na') else 4, cls)
        if s in ('Li', 'Na'):
            f.circle(x, y, 8.5, 'ln p')
        f.text(x, y0 + 20, s, 't b' if s in ('He', 'Ne', 'Ar', 'Li', 'Na') else 't', 'middle', 13)
        f.text(x, y0 + 36, str(i + 1), 't m', 'middle', 10.5)
        if s in ('He', 'Ne', 'Ar'):
            f.text(x, y - 13, f'{s} {v:,}', 't v b', 'middle', 12.5)
        if s in ('Li', 'Na'):
            f.text(x + 12, y + 18, f'{s} {v}', 't p b', 'start', 12.5)
    return f.svg()


def shell_atom(f, cx, cy, Z, shells, label):
    radii = [38, 66, 94][:len(shells)]
    for rr in radii:
        f.circle(cx, cy, rr, 'shell')
    f.circle(cx, cy, 17, 'pt-p')
    f.text(cx, cy + 5, f'{Z}+', 'pt-sign', 'middle', 13, 700)
    for rr, cnt in zip(radii, shells):
        for k in range(cnt):
            th = -math.pi / 2 + 2 * math.pi * k / cnt + (0.3 if rr == radii[-1] and cnt == 1 else 0)
            f.nucleon(cx + rr * math.cos(th), cy + rr * math.sin(th), 'e', 6, sign=False)
    f.text(cx, cy + 122, label, 't b', 'middle', 14)


@figure
def shells_li_na():
    f = Fig(640, 290, 'Shell counts: lithium 2, 1 and sodium 2, 8, 1. Each has one electron in its outermost shell.')
    shell_atom(f, 160, 140, 3, [2, 1], 'lithium: 2, 1')
    shell_atom(f, 460, 140, 11, [2, 8, 1], 'sodium: 2, 8, 1')
    f.text(320, 285, 'nucleus shown as one disc; rings are energy groupings, not paths', 't m', 'middle', 12)
    return f.svg()
