"""Still figures for the 'insight' live figures: water and ice, flame colours, and zooming into a mole."""
import math
from figs_core import Fig, figure
from figs_stories_atoms import wl_color


@figure
def i_waterice():
    f = Fig(640, 300, 'Left: liquid water, molecules jumbled and close, hydrogen bonds forming and breaking. Right: ice, each molecule held by four hydrogen bonds in open six-sided rings, so the same molecules take up more room.')
    f.text(160, 24, 'Liquid water', 't b', 'middle', 14)
    f.text(480, 24, 'Ice', 't b v', 'middle', 14)
    f.rect(20, 38, 280, 196, 'plate', 6)
    f.rect(340, 38, 280, 214, 'plate', 6)
    import random
    rnd = random.Random(4)
    pts, tries = [], 0
    while len(pts) < 20 and tries < 5000:
        tries += 1
        p = (rnd.uniform(44, 276), rnd.uniform(62, 212))
        if all(math.hypot(p[0] - q[0], p[1] - q[1]) > 34 for q in pts):
            pts.append(p)
    for i, (x, y) in enumerate(pts):
        for j in range(i):
            if math.hypot(x - pts[j][0], y - pts[j][1]) < 46 and (i + j) % 3 == 0:
                f.line(x, y, *pts[j], 'ln v dash')
    for k, (x, y) in enumerate(pts):
        f.molecule('H2O', x, y, 0.62, rot=(k * 67) % 360)
    # ice: a honeycomb of oxygen positions, each linked to its neighbours by hydrogen bonds
    R = 30
    cells = [(400, 92), (400 + R * math.sqrt(3), 92), (400 + 2 * R * math.sqrt(3), 92),
             (400 + R * math.sqrt(3) / 2, 92 + 1.5 * R), (400 + R * math.sqrt(3) * 1.5, 92 + 1.5 * R),
             (400 + R * math.sqrt(3) * 2.5, 92 + 1.5 * R), (400, 92 + 3 * R), (400 + R * math.sqrt(3), 92 + 3 * R),
             (400 + 2 * R * math.sqrt(3), 92 + 3 * R)]
    verts = set()
    for cx, cy in cells:
        ring = [(round(cx + R * math.cos(math.radians(90 + 60 * t)), 1), round(cy + R * math.sin(math.radians(90 + 60 * t)), 1)) for t in range(6)]
        for t in range(6):
            f.line(*ring[t], *ring[(t + 1) % 6], 'ln v dash')
            verts.add(ring[t])
    for k, (x, y) in enumerate(sorted(verts)):
        f.atom(x, y, 'O', 8.5, label=False)
    f.text(160, 254, 'close and jumbled: about 1.00 g per mL', 't m', 'middle', 12)
    f.text(480, 272, 'open six-sided rings: about 0.917 g per mL', 't m', 'middle', 12)
    f.text(480, 290, 'oxygens shown; dashed lines are hydrogen bonds', 't m', 'middle', 11)
    return f.svg()


@figure
def i_spectrum():
    f = Fig(640, 300, 'Hydrogen energy levels as a ladder. An electron falling to the second level gives out red, blue-green, blue or violet light, depending on the size of the fall; these are the four visible lines of hydrogen.')
    x0, x1, yb, yt = 90, 250, 270, 60
    def Y(E): return yb - (E + 13.6) / 13.6 * (yb - yt)
    f.text(24, 30, 'Hydrogen: energy levels', 't b', 'start', 14)
    labelled = {1: 'n = 1', 2: 'n = 2', 3: 'n = 3'}
    for n in range(1, 7):
        y = Y(-13.6 / n ** 2)
        f.line(x0, y, x1, y, 'ln')
        if n in labelled:
            f.text(x0 - 8, y + 4, labelled[n], 't m', 'end', 11)
    f.text(x1, Y(-13.6 / 16) - 8, 'n = 4, 5, 6… crowd together', 't m', 'end', 10)
    lines = []
    for k, n in enumerate((3, 4, 5, 6)):
        nm = 1 / (1.0968e7 * (1 / 4 - 1 / n ** 2)) * 1e9
        x = x0 + 30 + k * 32
        f.add(f'<line x1="{x}" y1="{Y(-13.6 / n ** 2):.1f}" x2="{x}" y2="{Y(-3.4) - 6:.1f}" stroke="{wl_color(nm)}" stroke-width="3" marker-end="url(#ah-ink)"/>')
        lines.append(nm)
    sx0, sx1, sy = 300, 620, 196
    def X(nm): return sx0 + (nm - 380) / 370 * (sx1 - sx0)
    f.text(sx0, sy - 14, 'What reaches your eye', 't m', 'start', 13)
    f.rect(sx0, sy, sx1 - sx0, 36, 'fill-ink', 3)
    for nm in lines:
        f.rect(X(nm) - 2, sy + 2, 4, 32, '', 0, f'fill="{wl_color(nm)}"')
        f.text(X(nm), sy - 2 - (12 if nm < 450 and nm > 420 else 0), f'{nm:.0f}', 't m', 'middle', 10)
    for nm in (400, 500, 600, 700):
        f.text(X(nm), sy + 54, str(nm), 't m', 'middle', 11)
    f.text(sx1, sy + 54, 'nm', 't m', 'start', 11)
    f.lines(sx0, 72, ['A bigger fall gives bluer light,', 'a smaller fall redder light.', 'Only certain falls exist,', 'so only certain colours appear.'], 't', 'start', 14)
    return f.svg()


@figure
def i_molezoom():
    f = Fig(640, 280, 'Zooming into a spoonful of water by powers of ten: a spoon, a raindrop, a grain of salt, a hair, a blood cell, a bacterium, a virus, the width of DNA, and finally single water molecules about 0.3 nanometres apart.')
    f.text(20, 26, '18 g of water: one mole, about a tablespoon and a bit', 't b', 'start', 14)
    steps = [('spoonful', '≈ 4 cm'), ('raindrop', '2 mm'), ('salt grain', '0.3 mm'), ('hair', '0.08 mm'),
             ('blood cell', '7 µm'), ('bacterium', '1 µm'), ('virus', '100 nm'), ('DNA', '2 nm'), ('water molecules', '0.3 nm')]
    x0, step, y = 46, 69, 150
    for i, (name, size) in enumerate(steps):
        x = x0 + i * step
        if i < len(steps) - 1:
            f.circle(x, y, 22 - i * 1.6, 'fill-vol' if i == 0 else 'plate')
            f.circle(x, y, 22 - i * 1.6, 'ln')
            f.arrow(x + 24 - i * 1.6, y, x + step - 26 + (i + 1) * 1.6, y, 'muted', 1.1)
        else:
            f.molecule('H2O', x - 10, y - 8, 0.55)
            f.molecule('H2O', x + 12, y + 10, 0.55, rot=120)
        f.text(x, y + 44, name, 't', 'middle', 11.5)
        f.text(x, y + 60, size, 't m', 'middle', 11)
    f.text(320, 250, 'each arrow zooms in about ten times or more', 't m i', 'middle', 12)
    f.lines(20, 56, ['In the whole spoonful: 6.022 × 10²³ molecules,', 'about 84 million along each edge of a 2.6 cm cube.'], 't', 'start', 13)
    return f.svg()
