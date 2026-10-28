"""Cover art and front-matter figures."""
from figs_core import Fig, figure

SYMBOLS = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr '
           'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu '
           'Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg '
           'Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split()

NAMES = ('hydrogen helium lithium beryllium boron carbon nitrogen oxygen fluorine neon sodium magnesium aluminium silicon '
         'phosphorus sulfur chlorine argon potassium calcium').split()
EXTRA = {'Fe': 'iron', 'Cu': 'copper', 'Zn': 'zinc', 'Br': 'bromine', 'Ag': 'silver', 'Au': 'gold', 'Hg': 'mercury',
         'Pb': r'lead-acid|lead \(pb\)|lead atoms?|lead ions?', 'Co': 'cobalt', 'Ni': 'nickel', 'Mn': 'manganese', 'I': 'iodine', 'Pt': 'platinum', 'U': 'uranium',
         'Ti': 'titanium', 'Cr': 'chromium', 'Sn': 'tin', 'Ba': 'barium', 'Sr': 'strontium', 'Ra': 'radium', 'Kr': 'krypton', 'Xe': 'xenon'}


def featured():
    import glob, os, re
    text = ' '.join(open(p, encoding='utf-8').read().lower() for p in glob.glob(os.path.join(os.path.dirname(__file__), 'src', 'ch*.md')))
    out = set()
    for i, n in enumerate(NAMES):
        if re.search(r'\b' + n + r'\b', text): out.add(SYMBOLS[i])
    for sym, n in EXTRA.items():
        if re.search(r'\b(' + n + r')\b', text): out.add(sym)
    return out


def table_positions():
    """(symbol, Z, column 1-18, row) using the standard 18-column layout with f-block rows 9-10."""
    pos = []
    for i, s in enumerate(SYMBOLS):
        z = i + 1
        if z == 1: c, r = 1, 1
        elif z == 2: c, r = 18, 1
        elif z <= 10: r = 2; c = z - 2 if z <= 4 else z + 8
        elif z <= 18: r = 3; c = z - 10 if z <= 12 else z
        elif z <= 36: r, c = 4, z - 18
        elif z <= 54: r, c = 5, z - 36
        elif z <= 86:
            r = 6
            if z <= 56: c = z - 54
            elif z <= 71: r, c = 9, z - 57 + 3
            else: c = z - 68
        else:
            r = 7
            if z <= 88: c = z - 86
            elif z <= 103: r, c = 10, z - 89 + 3
            else: c = z - 100
        pos.append((s, z, c, r))
    return pos


@figure
def cover_art():
    cell, gap = 52, 5
    W = 18 * (cell + gap) + 10
    H = 10 * (cell + gap) + 30
    FEATURED = featured()
    f = Fig(W, H, f'A periodic table of all 118 elements. The {len(FEATURED)} elements discussed in this book are filled in dark ink; carbon is highlighted.')
    for s, z, c, r in table_positions():
        x = 5 + (c - 1) * (cell + gap)
        y = 5 + (r - 1) * (cell + gap) + (18 if r >= 9 else 0)
        # each element is its own group so the cover can assemble it, tile by tile (see book.css .cover .art g.el)
        f.add(f'<g class="el{" on" if s in FEATURED else ""}" style="--i:{z}">')
        if s in FEATURED:
            cls = 'fill-vol' if s == 'C' else 'fill-ink'
            f.rect(x, y, cell, cell, cls, 4)
            f.text(x + 6, y + 15, str(z), 't', 'start', 10.5, extra='style="fill:var(--sheet);opacity:.75"')
            f.text(x + cell / 2, y + cell - 13, s, 't s', 'middle', 21, 600, 'style="fill:var(--sheet)"')
        else:
            f.rect(x, y, cell, cell, 'plate', 4)
            f.text(x + cell / 2, y + cell / 2 + 6, s, 't m', 'middle', 15, extra='style="opacity:.55"')
        f.add('</g>')
    return f.svg()
