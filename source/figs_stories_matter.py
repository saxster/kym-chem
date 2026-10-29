"""Figures for the stories in the 'matter' group."""
from figs_core import Fig, figure


def _tile(f, x, y, sym, line2, line3='', cls='plate', tcls='t s', w=118, h=92):
    f.rect(x, y, w, h, cls, 6)
    f.text(x + w / 2, y + 40, sym, tcls, 'middle', 28, 600)
    f.text(x + w / 2, y + 62, line2, 't m', 'middle', 12)
    if line3:
        f.text(x + w / 2, y + 78, line3, 't m', 'middle', 12)


@figure
def s_mendeleev_gaps():
    f = Fig(640, 330, 'A small piece of the periodic table around gallium: aluminium above, indium below, zinc to the left, and the gap Mendeleev called eka-aluminium in the middle.')
    cx, cy = 260, 118
    _tile(f, cx, cy - 104, 'Al', 'aluminium', 'weight 27.0')
    _tile(f, cx, cy + 104, 'In', 'indium', 'weight 114.8')
    _tile(f, cx - 130, cy, 'Zn', 'zinc', 'weight 65.4')
    f.rect(cx, cy, 118, 92, 'wash', 6)
    f.rect(cx, cy, 118, 92, 'ln vol', 6, 'stroke-dasharray="6 4"')
    f.text(cx + 59, cy + 44, '?', 't v', 'middle', 34, 600)
    f.text(cx + 59, cy + 70, 'eka-aluminium', 't v b', 'middle', 12)
    f.rect(cx + 130, cy, 118, 92, 'plate', 6, 'stroke-dasharray="6 4"')
    f.text(cx + 189, cy + 44, '?', 't m', 'middle', 28)
    f.text(cx + 189, cy + 70, 'eka-silicon', 't m', 'middle', 12)
    for (x1, y1, x2, y2) in ((cx + 59, cy - 12, cx + 59, cy - 2), (cx + 59, cy + 104, cx + 59, cy + 94), (cx - 12, cy + 46, cx - 2, cy + 46)):
        f.arrow(x1, y1, x2, y2, 'muted', 1.2)
    f.lines(20, 24, ['Mendeleev, 1871:', 'predicted weight about 68,', 'density about 5.9'], 't', 'start', 12.5)
    f.lines(470, 230, ['Found in 1875: gallium.', 'Weight 69.7,', 'density 5.9'], 't v', 'start', 12.5)
    return f.svg()


KALPHA = [('Ca', 20, 3.692), ('Sc', 21, 4.091), ('Ti', 22, 4.511), ('V', 23, 4.952), ('Cr', 24, 5.415), ('Mn', 25, 5.899),
          ('Fe', 26, 6.404), ('Co', 27, 6.930), ('Ni', 28, 7.478), ('Cu', 29, 8.048), ('Zn', 30, 8.639)]


@figure
def s_moseley_staircase():
    import math
    f = Fig(640, 320, 'Square root of modern reference K-alpha X-ray energies for calcium to zinc rises in nearly equal steps, one per element; this is not an exact linear law or the original dataset.')
    x0, y0, w, h = 70, 260, 530, 210
    f.axes(x0, y0, w, h)
    f.text(x0, 34, 'square root of the X-ray energy (each point one element)', 't m', 'start', 12)
    lo, hi = 1.85, 3.0
    def X(i): return x0 + 25 + i * (w - 50) / 10
    def Y(v): return y0 - (v - lo) / (hi - lo) * h
    pts = [(X(i), Y(math.sqrt(e))) for i, (_, _, e) in enumerate(KALPHA)]
    for i in range(len(pts) - 1):
        (xa, ya), (xb, yb) = pts[i], pts[i + 1]
        f.path(f'M{xa:.1f},{ya:.1f} H{xb:.1f} V{yb:.1f}', 'ln m dash')
    for i, ((s, z, e), (x, y)) in enumerate(zip(KALPHA, pts)):
        f.circle(x, y, 5, 'fill-vol')
        f.text(x, y0 + 20, s, 't b', 'middle', 12.5)
        f.text(x, y0 + 36, str(z), 't m', 'middle', 11)
    f.text(x0 + w, y0 + 54, 'atomic number', 't m', 'end', 11.5)
    return f.svg()


@figure
def s_lewis_water():
    f = Fig(640, 250, 'Lewis dot drawing of water: H, O, H in a row with a shared pair of dots between O and each H, and two lone pairs of dots on the oxygen.')
    cy = 128
    f.text(200, cy + 14, 'H', 't s', 'middle', 40, 600)
    f.text(320, cy + 14, 'O', 't s', 'middle', 44, 600)
    f.text(440, cy + 14, 'H', 't s', 'middle', 40, 600)
    def pair(x, y, vertical):
        dx, dy = (0, 7) if vertical else (7, 0)
        f.circle(x - dx, y - dy, 4.2, 'pt-e'); f.circle(x + dx, y + dy, 4.2, 'pt-e')
    pair(260, cy, True); pair(380, cy, True)          # shared pairs
    pair(320, cy - 42, False); pair(320, cy + 40, False)  # lone pairs
    f.rect(240, cy - 22, 40, 44, 'ln vol dash', 8); f.rect(360, cy - 22, 40, 44, 'ln vol dash', 8)
    f.line(260, cy - 24, 220, 62, 'ln m'); f.lines(70, 40, ['shared pair:', 'one bond'], 't v b', 'start', 13)
    f.line(334, cy - 42, 450, 52, 'ln m'); f.lines(455, 40, ['lone pair:', 'oxygen’s own'], 't b', 'start', 13)
    f.text(320, 232, 'each blue dot is one outer electron: 1 from each H, 6 from O', 't m', 'middle', 12.5)
    return f.svg()
