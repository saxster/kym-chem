"""Figures for Chapter 3."""
import math
from figs_core import Fig, figure, catmull, jitter_grid


@figure
def c3_states():
    f = Fig(640, 260, 'Twelve water molecules as a solid (ordered, packed), a liquid (close but jumbled) and a gas (far apart, moving fast).')
    titles = [('solid', 'packed, vibrating in place'), ('liquid', 'close, sliding past each other'), ('gas', 'far apart, flying freely')]
    for i, (t, d) in enumerate(titles):
        x, y, w, h = 10 + i * 212, 14, 196, 176
        f.rect(x, y, w, h, 'plate', 6)
        if i == 0:
            pts = [(x + 33 + (k % 4) * 43, y + 52 + (k // 4) * 44) for k in range(12)]
            for k, (px, py) in enumerate(pts):
                f.molecule('H2O', px, py, 0.68, rot=0)
        elif i == 1:
            pts = jitter_grid(12, x + 4, y + 52, w - 8, h - 54, seed=7, margin=14)
            for k, (px, py) in enumerate(pts):
                f.molecule('H2O', px, py, 0.68, rot=(k * 71) % 360)
            f.line(x + 6, y + 52, x + w - 6, y + 52, 'ln m dash')
        else:
            pts = jitter_grid(12, x, y, w, h, seed=11, margin=20)
            for k, (px, py) in enumerate(pts):
                f.molecule('H2O', px, py, 0.68, rot=(k * 47) % 360)
                ang = k * 2.4
                f.arrow(px + 16 * math.cos(ang), py + 16 * math.sin(ang), px + 30 * math.cos(ang), py + 30 * math.sin(ang), 'muted', 1.1)
        f.text(x + w / 2, 214, t, 't b', 'middle', 14)
        f.text(x + w / 2, 234, d, 't m', 'middle', 12)
    return f.svg()


@figure
def c3_gas_temperature():
    f = Fig(640, 270, 'Two identical sealed boxes of gas. At 400 K the molecules move faster than at 200 K and the pressure is twice as high.')
    import random
    for i, (T, P, L) in enumerate(((200, 166, 22), (400, 333, 22 * math.sqrt(2)))):
        x, y, w, h = 30 + i * 320, 40, 260, 160
        f.rect(x, y, w, h, 'plate', 4)
        f.rect(x, y, w, h, 'glass', 4)
        rnd = random.Random(5)
        pts = jitter_grid(11, x, y, w, h, seed=3, margin=24)
        for k, (px, py) in enumerate(pts):
            ang = rnd.uniform(0, 2 * math.pi)
            f.arrow(px, py, px + L * math.cos(ang), py + L * math.sin(ang), 'muted', 1.2)
            f.circle(px, py, 6.5, 'pt-e')
        f.text(x, 26, f'{T} K', 't b', 'start', 15)
        f.text(x + w, 26, f'pressure {P} kPa', 't b' + (' v' if i else ''), 'end', 14)
        f.text(x + w / 2, 222, 'same box, same 1 mole of gas', 't m', 'middle', 12)
        f.text(x + w / 2, 240, 'slower molecules' if i == 0 else 'faster molecules (about 1.4 × the speed)', 't m', 'middle', 12)
    return f.svg()


@figure
def c3_boil_vs_split():
    f = Fig(640, 300, 'Boiling separates whole water molecules (about 41 kJ per mole). Splitting water breaks bonds inside molecules to make hydrogen and oxygen (about 286 kJ per mole).')
    # left: boiling
    f.text(150, 26, 'Boiling: a change of state', 't b', 'middle', 14)
    f.rect(20, 50, 100, 120, 'plate', 4)
    for k, (px, py) in enumerate([(46, 78), (92, 80), (68, 112), (44, 148), (94, 146)]):
        f.molecule('H2O', px, py, 0.7, rot=k * 60)
    f.arrow(126, 110, 166, 110, 'ink', 1.6)
    f.rect(172, 50, 110, 120, 'plate', 4)
    for k, (px, py) in enumerate([(196, 72), (258, 82), (226, 118), (196, 154), (262, 152)]):
        f.molecule('H2O', px, py, 0.7, rot=k * 45)
    f.text(70, 190, 'liquid', 't m', 'middle', 12)
    f.text(227, 190, 'steam', 't m', 'middle', 12)
    f.text(150, 222, 'still H₂O molecules', 't b', 'middle', 13)
    f.text(150, 242, 'about 41 kJ per mole', 't g b', 'middle', 13)
    f.line(320, 20, 320, 280, 'ln r')
    # right: splitting
    f.text(480, 26, 'Splitting: a chemical change', 't b', 'middle', 14)
    f.rect(350, 50, 100, 120, 'plate', 4)
    for k, (px, py) in enumerate([(376, 80), (424, 84), (378, 136), (424, 138)]):
        f.molecule('H2O', px, py, 0.7, rot=k * 70)
    f.arrow(456, 110, 496, 110, 'proton', 1.6)
    f.text(476, 42, 'electricity', 't m', 'middle', 11.5)
    f.rect(502, 50, 118, 120, 'plate', 4)
    for k, (px, py) in enumerate([(524, 70), (594, 70), (524, 152), (594, 152)]):
        f.molecule('H2', px, py, 0.9, rot=k * 40)
    f.molecule('O2', 537, 111, 0.75, rot=20)
    f.molecule('O2', 590, 111, 0.75, rot=-30)
    f.text(400, 190, 'water', 't m', 'middle', 12)
    f.text(561, 190, 'hydrogen + oxygen', 't m', 'middle', 12)
    f.text(480, 222, 'new substances', 't b', 'middle', 13)
    f.text(480, 242, 'about 286 kJ per mole', 't p b', 'middle', 13)
    f.text(320, 290, 'Splitting 4 H₂O makes 4 H₂ and 2 O₂: every atom is kept.', 't m', 'middle', 11.5)
    return f.svg()


@figure
def c3_boyle():
    f = Fig(640, 310, 'Pressure against volume for one mole of gas at 300 K: a curve falling from about 500 kPa at 5 litres to about 125 kPa at 20 litres.')
    x0, y0, w, h = 80, 260, 500, 220
    f.axes(x0, y0, w, h)
    def X(v): return x0 + v / 25 * w
    def Y(p): return y0 - p / 650 * h
    for v in (0, 5, 10, 15, 20, 25):
        f.line(X(v), y0, X(v), y0 + 4, 'ax'); f.text(X(v), y0 + 18, str(v), 't m', 'middle', 11.5)
    for p in (0, 200, 400, 600):
        f.line(x0 - 4, Y(p), x0, Y(p), 'ax'); f.text(x0 - 8, Y(p) + 4, str(p), 't m', 'end', 11.5)
    k = 8.314462618 * 300
    pts = [(X(v), Y(k / v)) for v in [4 + i * 0.25 for i in range(85)]]
    f.path(catmull(pts), 'ln vol')
    for v, lab in ((5, '5 L: 499 kPa'), (10, '10 L: 249 kPa'), (20, '20 L: 125 kPa')):
        f.circle(X(v), Y(k / v), 5.5, 'fill-ink')
        f.text(X(v) + 10, Y(k / v) - 10, lab, 't b', 'start', 12.5)
    f.text(x0 + w, y0 + 36, 'volume (litres)', 't m', 'end', 12)
    f.text(x0, 24, 'pressure (kPa)', 't m', 'start', 12)
    f.text(X(13), Y(520), 'pressure × volume', 't', 'start', 13)
    f.text(X(13), Y(470), '≈ 2,494 at every point', 't', 'start', 13)
    return f.svg()


@figure
def c3_dilution():
    f = Fig(640, 280, 'Eight solute particles in one litre, and the same eight particles spread through two litres after adding water.')
    def beaker(x, w, level, n, seed):
        top, bot = 40, 220
        f.path(f'M{x},{top} L{x},{bot} Q{x},{bot + 8} {x + 8},{bot + 8} L{x + w - 8},{bot + 8} Q{x + w},{bot + 8} {x + w},{bot} L{x + w},{top}', 'glass')
        ly = bot + 8 - level
        f.path(f'M{x + 1},{ly} L{x + 1},{bot} Q{x + 1},{bot + 7} {x + 8},{bot + 7} L{x + w - 8},{bot + 7} Q{x + w - 1},{bot + 7} {x + w - 1},{bot} L{x + w - 1},{ly} Z', 'water')
        for (px, py) in jitter_grid(n, x, ly, w, bot + 8 - ly, seed=seed, margin=16):
            f.circle(px, py, 6.5, 'pt-p')
    beaker(90, 150, 80, 8, 2)
    f.text(165, 252, '1 L: 8 particles per litre', 't b', 'middle', 13)
    f.arrow(268, 150, 352, 150, 'ink', 1.6)
    f.text(310, 138, 'add water', 't m', 'middle', 12)
    beaker(380, 150, 160, 8, 4)
    f.text(455, 252, '2 L: 4 particles per litre', 't b', 'middle', 13)
    f.text(320, 274, 'same 8 particles; half the concentration', 't m', 'middle', 12)
    return f.svg()


@figure
def c3_boiling_points():
    f = Fig(640, 300, 'Boiling points: methane minus 161.5 degrees, ammonia minus 33.3 degrees, water plus 100 degrees Celsius. Right: water molecules linked by hydrogen bonds.')
    x0, w = 70, 260
    def Y(t): return 140 - t * 0.62
    f.line(x0, Y(0), x0 + w, Y(0), 'ax')
    f.text(x0 - 6, Y(0) + 4, '0 °C', 't m', 'end', 11.5)
    for t in (100, -100):
        f.line(x0 - 4, Y(t), x0, Y(t), 'ax'); f.text(x0 - 6, Y(t) + 4, f'{t:+d}'.replace('-', '−'), 't m', 'end', 11.5)
    f.line(x0, Y(110), x0, Y(-170), 'ax')
    data = [('CH₄', -161.5, '16 g/mol', 'bar-m'), ('NH₃', -33.3, '17 g/mol', 'bar-e'), ('H₂O', 100.0, '18 g/mol', 'bar-p')]
    for i, (n, t, m, cls) in enumerate(data):
        x = x0 + 30 + i * 80
        y1, y2 = sorted((Y(0), Y(t)))
        f.rect(x, y1, 46, y2 - y1, cls, 2)
        ty = Y(t) - 8 if t > 0 else Y(t) + 18
        f.text(x + 23, ty, f'{t:+.1f} °C'.replace('-', '−'), 't b', 'middle', 12.5)
        lab_y = Y(0) - 8 if t < 0 else Y(0) + 18
        f.text(x + 23, lab_y, n, 't s b', 'middle', 15)
        f.text(x + 23, 290, m, 't m', 'middle', 11.5)
    f.text(x0, 290 - 18, '', 't', 'start', 1)
    # hydrogen-bonded water cluster, drawn atom by atom
    mols = [((480, 140), (462, 162), (498, 162)), ((440, 214), (420, 230), (452, 236)),
            ((530, 214), (548, 232), (516, 238)), ((474, 66), (477, 92), (450, 58))]
    hb = [((462, 162), (440, 214)), ((498, 162), (530, 214)), ((477, 92), (480, 140))]
    for a_, b_ in hb:
        f.line(a_[0] + (b_[0] - a_[0]) * .3, a_[1] + (b_[1] - a_[1]) * .3, a_[0] + (b_[0] - a_[0]) * .62, a_[1] + (b_[1] - a_[1]) * .62, 'ln g', 'stroke-dasharray="2 4" stroke-width="2.5"')
    for o, h1, h2 in mols:
        f.bond(*o, *h1); f.bond(*o, *h2)
        f.atom(*h1, 'H', 10); f.atom(*h2, 'H', 10); f.atom(*o, 'O', 16)
    cx = 480
    f.text(cx, 270, 'hydrogen bonds (dotted)', 't g b', 'middle', 12.5)
    f.text(cx, 288, 'between whole molecules', 't m', 'middle', 11.5)
    return f.svg()
