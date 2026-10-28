"""Insight figures, set C: the periodic landscape (still fallback for the 3D `skyline` live figure)."""
from __future__ import annotations
from figs_core import Fig, figure

# Single-bond covalent radii in pm (Pyykkö and Atsumi 2009, as used in app/atlas_data.js and live/skyline_data.js),
# hydrogen (1) to barium (56).
RADII = [32, 46, 133, 102, 85, 75, 71, 63, 64, 67, 155, 139, 126, 116, 111, 103, 99, 96, 196, 171, 148, 136, 134, 122,
         119, 116, 111, 110, 112, 118, 124, 121, 121, 116, 114, 117, 210, 185, 163, 154, 147, 138, 128, 125, 125, 120,
         128, 136, 142, 140, 140, 136, 133, 131, 232, 196]
SYM = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr '
       'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba').split()
ALKALI = {3, 11, 19, 37, 55}
NOBLE = {2, 10, 18, 36, 54}


@figure
def i_skyline():
    f = Fig(1000, 325, 'Atom size plotted against atomic number from hydrogen to barium. The line rises to a sharp peak at '
                       'every alkali metal (lithium, sodium, potassium, rubidium, caesium) and slopes down across each row: '
                       'the same pattern repeats, which is why the table is called periodic.', wide=True)
    x0, y0, w, h = 70, 270, 890, 220
    zmax, rmax = 56, 250
    X = lambda z: x0 + (z - 1) / (zmax - 1) * w
    Y = lambda r: y0 - r / rmax * h
    for r in (50, 100, 150, 200, 250):
        f.line(x0, Y(r), x0 + w, Y(r), 'gridln')
        f.text(x0 - 10, Y(r) + 4, str(r), 't m', 'end', 12)
    f.axes(x0, y0, w, h, '', 'atom size, pm')
    f.text(x0 + w, y0 + 40, 'atomic number (protons) →', 't m', 'end', 13)
    # shade each row of the table behind the curve
    rows = [(1, 2), (3, 10), (11, 18), (19, 36), (37, 54), (55, 56)]
    for k, (a, b) in enumerate(rows):
        if k % 2:
            f.rect(X(a) - 6, Y(rmax), X(b) - X(a) + 12, h, 'region', rx=0)
        f.text((X(a) + X(b)) / 2, y0 + 16, f'row {k + 1}', 't m', 'middle', 11)
    pts = ' '.join(f'{X(z):.1f},{Y(r):.1f}' for z, r in enumerate(RADII, start=1))
    f.add(f'<polyline points="{pts}" class="ln e" fill="none" style="stroke-width:2.4"/>')
    for z, r in enumerate(RADII, start=1):
        cls = 'ln p' if z in ALKALI else ('ln e' if z in NOBLE else 'ln thin')
        f.circle(X(z), Y(r), 4.2 if z in ALKALI else 2.6, cls)
        if z in ALKALI:
            f.text(X(z), Y(r) - 12, SYM[z - 1], 't b p', 'middle', 14)
    f.text(x0 + 10, Y(rmax) + 4, 'every row starts with a peak, an alkali metal, then slopes down', 't i', 'start', 13)
    return f.svg()
