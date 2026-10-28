"""Figures for Chapter 0."""
import math
from figs_core import Fig, figure, jitter_grid


@figure
def see_vs_infer():
    f = Fig(640, 330, 'Left: a glass of water with observations listed. Right: a magnified circle showing H2O molecules, labelled as an inference.')
    f.text(20, 28, 'What we observe', 't b', 'start', 15)
    f.text(360, 28, 'What we infer (a model)', 't b v', 'start', 15)
    f.line(330, 16, 330, 314, 'ln r')
    # glass
    gx, gy = 40, 70
    f.path(f'M{gx},{gy} L{gx + 10},{gy + 190} Q{gx + 11},{gy + 200} {gx + 22},{gy + 200} L{gx + 98},{gy + 200} Q{gx + 109},{gy + 200} {gx + 110},{gy + 190} L{gx + 120},{gy}', 'glass')
    f.path(f'M{gx + 4.5},{gy + 85} L{gx + 10.2},{gy + 190} Q{gx + 11},{gy + 198} {gx + 22},{gy + 198} L{gx + 98},{gy + 198} Q{gx + 109},{gy + 198} {gx + 109.8},{gy + 190} L{gx + 115.5},{gy + 85} Z', 'water')
    f.path(f'M{gx + 4.5},{gy + 85} Q{gx + 60},{gy + 80} {gx + 115.5},{gy + 85}', 'ln m')
    # observation labels
    obs = [(['clear and colourless'], 100), (['takes the shape', 'of its glass'], 140), (['freezes at 0 °C,', 'boils at 100 °C'], 192), (['100 mL has a mass', 'of about 100 g'], 244)]
    for rows, y in obs:
        f.circle(204, y - 5, 2.5, 'fill-ink')
        f.lines(213, y, rows, 't', 'start', 13, 1.3)
    # zoom line
    f.path('M150,250 C 220,300 300,300 370,232', 'ln m dash')
    # magnifier
    cx, cy, R = 480, 170, 118
    f.circle(cx, cy, R, 'plate')
    f.add(f'<clipPath id="mag0"><circle cx="{cx}" cy="{cy}" r="{R - 2}"/></clipPath><g clip-path="url(#mag0)">')
    pts = jitter_grid(14, cx - R, cy - R, 2 * R, 2 * R, seed=4, margin=10)
    for i, (x, y) in enumerate(pts):
        f.molecule('H2O', x, y, 0.95, rot=(i * 67) % 360)
    f.add('</g>')
    f.circle(cx, cy, R, 'ln')
    f.text(cx, 306, 'H₂O molecules, each about 0.3 nm across', 't m', 'middle', 13)
    f.text(cx, 323, 'the gaps between them hold nothing, not even air', 't m i', 'middle', 12)
    return f.svg()


@figure
def scale_ladder():
    f = Fig(1000, 236, 'A logarithmic scale from 1 metre down to 10 to the minus 10 metres, with familiar objects placed at their sizes.', wide=True)
    x0, x1, y = 60, 960, 190
    f.line(x0, y, x1, y, 'ax')
    step = (x1 - x0) / 10
    for k in range(11):
        x = x0 + k * step
        f.line(x, y - 6, x, y + 6, 'ax')
        lab = '1 m' if k == 0 else f'10<tspan dy="-7" font-size="10">−{k}</tspan>'
        f.text(x, y + 28, lab, 't', 'middle', 13.5)
    items = [
        (-0.18, 'you', '≈ 1.5 m', -1),
        (1.0, 'your hand', '≈ 10 cm', 1),
        (2.7, 'a raindrop', '≈ 2 mm', -1),
        (3.5, 'a grain of salt', '≈ 0.3 mm', 1),
        (4.1, 'a hair, end-on', '≈ 0.08 mm', -1),
        (5.15, 'a red blood cell', '≈ 7 µm', 1),
        (6.0, 'a bacterium', '≈ 1 µm', -1),
        (7.0, 'a virus', '≈ 100 nm', 1),
        (8.7, 'the width of DNA', '≈ 2 nm', -1),
        (9.5, 'a water molecule', '≈ 0.3 nm', 1),
    ]
    for i, (lg, name, size, side) in enumerate(items):
        x = x0 + lg * step
        ty = 52 if i % 2 == 0 else 104
        f.line(x, ty + 22, x, y - 7, 'ln r')
        f.circle(x, y, 5, 'fill-vol' if 'molecule' in name else 'fill-ink')
        f.text(x, ty, name, 't', 'middle', 13.5, 700 if 'molecule' in name else None)
        f.text(x, ty + 16, size, 't m', 'middle', 12)
    f.text(x1, 20, 'each step to the right is ten times smaller', 't m i', 'end', 12.5)
    return f.svg()


@figure
def c0_brownian():
    import random
    f = Fig(640, 280, 'Left: the zig-zag path of one resin grain, its position marked at equal time intervals as Perrin did. Right: the hidden cause, water molecules hitting the grain unevenly from every side.')
    f.text(20, 26, 'What Perrin saw', 't b', 'start', 14)
    f.text(340, 26, 'The hidden cause (a model)', 't b v', 'start', 14)
    f.line(325, 14, 325, 266, 'ln r')
    f.rect(20, 40, 290, 200, 'plate', 6)
    rnd = random.Random(11)
    x, y = 165, 140
    pts = [(x, y)]
    for _ in range(26):
        x = min(296, max(34, x + rnd.gauss(0, 20))); y = min(226, max(54, y + rnd.gauss(0, 15)))
        pts.append((x, y))
    f.path('M' + ' L'.join(f'{px:.1f},{py:.1f}' for px, py in pts), 'ln')
    for px, py in pts:
        f.circle(px, py, 2.4, 'fill-ink')
    f.circle(pts[-1][0], pts[-1][1], 9, 'fill-vol')
    f.text(165, 258, 'positions marked every 30 seconds, joined by straight lines', 't m', 'middle', 11.5)
    # right: grain and molecules
    cx, cy, R = 480, 145, 46
    f.circle(cx, cy, R, 'fill-vol', 'style="opacity:.85"')
    f.text(cx, cy + 5, 'grain', 't b', 'middle', 13, extra='style="fill:var(--sheet)"')
    rnd = random.Random(5)
    for k in range(30):
        a = rnd.uniform(0, 6.283); d = rnd.uniform(R + 14, R + 92)
        mx, my = cx + d * __import__('math').cos(a), cy + d * __import__('math').sin(a)
        if 335 < mx < 630 and 40 < my < 250:
            f.molecule('H2O', mx, my, 0.42, rot=rnd.uniform(0, 360), label=False)
    import math
    for a in (0.3, 2.2, 3.6, 4.9):
        x1, y1 = cx + (R + 34) * math.cos(a), cy + (R + 34) * math.sin(a)
        x2, y2 = cx + (R + 5) * math.cos(a), cy + (R + 5) * math.sin(a)
        f.arrow(x1, y1, x2, y2, 'electron', 1.5)
    f.text(480, 258, 'molecules drawn far too big and far too few', 't m', 'middle', 11.5)
    return f.svg()
