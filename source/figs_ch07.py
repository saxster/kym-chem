"""Figures for Chapter 7."""
import math
from figs_core import Fig, figure, jitter_grid

KA = 1.8e-5


def hydronium(f, x, y, s=1.0):
    f.bond(x, y, x - 20 * s, y + 14 * s); f.bond(x, y, x + 20 * s, y + 14 * s); f.bond(x, y, x, y - 23 * s)
    for hx, hy in ((x - 20 * s, y + 14 * s), (x + 20 * s, y + 14 * s), (x, y - 23 * s)):
        f.atom(hx, hy, 'H', 10 * s)
    f.atom(x, y, 'O', 15.5 * s)
    _badge(f, x + 15 * s, y - 13 * s, '+', s)


def _badge(f, x, y, ch, s=1.0):
    f.circle(x, y, 7 * s, 'badge')
    f.text(x, y + 3.6 * s, ch, 'badge-t', 'middle', round(10.5 * s, 1), 700)


def acid_HA(f, x, y, s=0.62, whole=True):
    """Acetic acid CH3COOH (whole) or acetate CH3COO- (whole=False), drawn small."""
    c1, c2 = (x - 14 * s, y), (x + 14 * s, y)
    o1, o2 = (x + 28 * s, y - 22 * s), (x + 30 * s, y + 18 * s)
    f.bond(*c1, *c2); f.bond(*c2, *o1, order=2, gap=3 * s); f.bond(*c2, *o2)
    hs = [(x - 32 * s, y - 14 * s), (x - 30 * s, y + 16 * s), (x - 12 * s, y + 24 * s)]
    for h in hs:
        f.bond(*c1, *h)
    if whole:
        f.bond(*o2, x + 50 * s, y + 24 * s)
        f.atom(x + 50 * s, y + 24 * s, 'H', 10 * s)
    for h in hs:
        f.atom(*h, 'H', 10 * s)
    f.atom(*c1, 'C', 15 * s); f.atom(*c2, 'C', 15 * s)
    f.atom(*o1, 'O', 15.5 * s); f.atom(*o2, 'O', 15.5 * s)
    if not whole:
        _badge(f, o2[0] + 14 * s, o2[1] + 6 * s, '−', s * 1.2)


@figure
def c7_proton_transfer():
    f = Fig(640, 230, 'Hydrogen chloride passes a proton to a water molecule, forming a chloride ion and a hydronium ion.')
    # reactants
    f.molecule('HCl', 70, 110, 1.3)
    f.text(320 - 210, 175, 'HCl', 't s', 'middle', 18)
    f.text(165, 115, '+', 't s', 'middle', 22)
    f.molecule('H2O', 230, 108, 1.3)
    f.text(230, 175, 'H₂O', 't s', 'middle', 18)
    f.curved_arrow(55, 92, 220, 82, bend=-34, kind='proton')
    f.text(140, 40, 'a proton (H⁺) moves', 't p b', 'middle', 12.5)
    f.arrow(300, 110, 360, 110, 'ink')
    # products
    f.ion(415, 110, 'Cl', '−', 22)
    f.text(415, 175, 'Cl⁻', 't s', 'middle', 18)
    f.text(468, 115, '+', 't s', 'middle', 22)
    hydronium(f, 545, 112, 1.3)
    f.text(545, 175, 'H₃O⁺', 't s', 'middle', 18)
    f.text(415, 205, 'keeps the electrons', 't m', 'middle', 12)
    f.text(545, 205, 'hydronium ion', 't m', 'middle', 12)
    return f.svg()


def acid_beaker(f, x, y, w, h, items, seed):
    f.path(f'M{x},{y + 30} L{x},{y + h} L{x + w},{y + h} L{x + w},{y + 30} Z', 'water')
    f.path(f'M{x - 6},{y} L{x},{y + 6} L{x},{y + h} L{x + w},{y + h} L{x + w},{y + 6} L{x + w + 6},{y}', 'glass')
    pts = jitter_grid(len(items), x, y + 30, w, h - 30, seed=seed, margin=22)
    for (px, py), kind in zip(pts, items):
        if kind == 'HA':
            acid_HA(f, px, py, 0.46)
        elif kind == 'A':
            acid_HA(f, px, py, 0.46, whole=False)
        elif kind == 'H3O':
            hydronium(f, px, py, 0.62)
        elif kind == 'Cl':
            f.ion(px, py, 'Cl', '−', 10)


@figure
def c7_strong_weak():
    f = Fig(640, 340, 'Left: dilute hydrochloric acid, every molecule split into hydronium and chloride ions. Right: concentrated acetic acid, many whole molecules and only one split.')
    acid_beaker(f, 30, 30, 250, 240, ['H3O', 'Cl'] * 3, 2)
    acid_beaker(f, 360, 30, 250, 240, ['HA'] * 10 + ['H3O', 'A'], 5)
    f.text(155, 296, 'dilute strong acid (HCl)', 't b', 'middle', 13.5)
    f.text(155, 316, 'few acid particles, all split', 't m', 'middle', 12.5)
    f.text(485, 296, 'concentrated weak acid (acetic)', 't b', 'middle', 13.5)
    f.text(485, 316, 'many acid molecules, almost all whole', 't m', 'middle', 12.5)
    return f.svg()


@figure
def c7_ph_ladder():
    f = Fig(1000, 480, 'The pH scale from 0 to 14 with hydronium concentrations, typical everyday solutions, the colours red cabbage juice turns, and dot blocks showing that each step is ten times more hydronium.', wide=True)
    x0, x1, y = 40, 960, 160
    step = (x1 - x0) / 14
    for k in range(14):
        t = k / 13
        # acid (proton colour) to neutral to base (electron colour) via opacity bands
        cls = 'wash-p' if k < 6 else ('wash-g' if k < 8 else 'wash-e')
        f.rect(x0 + k * step, y - 18, step, 36, cls, 0)
    f.rect(x0, y - 18, x1 - x0, 36, 'ln', 4)
    for k in range(15):
        x = x0 + k * step
        f.line(x, y - 18, x, y - 12, 'ln m'); f.line(x, y + 12, x, y + 18, 'ln m')
        f.text(x, y + 6, str(k), 't b', 'middle', 15) if 0 < k < 14 else None
        f.text(x, y + 44, '1' if k == 0 else f'10<tspan dy="-6" font-size="9.5">−{k}</tspan>', 't m', 'middle', 11.5)
    f.text(x0, y + 6, '0', 't b', 'start', 15)
    f.text(x1, y + 6, '14', 't b', 'end', 15)
    f.text(x0, y + 66, 'hydronium, mol/L', 't m', 'start', 11.5)
    f.text(x0, 20, 'more acidic', 't p b', 'start', 13)
    f.text(x1, 20, 'more basic', 't e b', 'end', 13)
    f.text((x0 + x1) / 2, 20, 'neutral', 't g b', 'middle', 13)
    ex = [(1.5, 'stomach acid', 'about 1.5–3', 0), (2.3, 'lemon juice', 'about 2–2.5', 1), (2.4, 'vinegar', 'about 2.4–2.6', 2),
          (5.0, 'black coffee', 'about 5', 1), (7.0, 'pure water', '7', 0), (7.4, 'blood', '7.35–7.45', 2),
          (8.3, 'baking soda', 'about 8.3', 1), (11.5, 'household ammonia', 'about 11–12', 1),
          (13.0, 'oven cleaner', 'about 13', 0)]
    for v, name, val, row in ex:
        x = x0 + v * step
        ty = 50 + row * 30
        f.line(x, ty + 20, x, y - 20, 'ln r')
        f.circle(x, y - 20, 2.5, 'fill-ink')
        f.text(x, ty, name, 't', 'middle', 12.5)
        f.text(x, ty + 15, val, 't m', 'middle', 11)
    # red cabbage colour band (approximate colours of the juice at each pH)
    cab = ['#b5122b', '#c81d4a', '#c42a63', '#a8337f', '#8a3b92', '#713f9a', '#5f46a0', '#4a5aa8',
           '#3570b0', '#2c8aa6', '#2f9b84', '#5aa64c', '#98b232', '#c2b02a']
    by = y + 82
    for k in range(14):
        f.rect(x0 + k * step, by, step + 0.6, 16, 'none', 0, f'style="fill:{cab[k]}"')
    f.rect(x0, by, x1 - x0, 16, 'ln', 3)
    f.text(x0, by + 34, 'red cabbage juice turns this colour (roughly)', 't m', 'start', 11.5)
    # tenfold dot blocks: hydronium compared with pure water
    top = 326
    f.text((x0 + x1) / 2, top - 20, 'each step to the left: ten times more hydronium ions', 't m', 'middle', 12.5)
    dot = 'style="fill:var(--proton)"'
    sp = 4.6
    def block(bx, byy, n):
        for i in range(n):
            f.circle(bx + (i % 10) * sp, byy + (i // 10) * sp, 1.5, 'none', dot)
    for ph, n, bx in ((4, 1000, 150), (5, 100, 430), (6, 10, 520), (7, 1, 610)):
        if n <= 100:
            block(bx, top + 96 - ((n + 9) // 10 - 1) * sp, n)
        else:
            for j in range(10):
                block(bx + (j % 5) * 50, top + (j // 5) * 50, 100)
        f.text(bx, top + 116, f'pH {ph}', 't b', 'start', 12.5)
        f.text(bx, top + 131, '1 dot' if n == 1 else f'{n:,} dots', 't m', 'start', 11)
    f.text(690, top + 56, 'hydronium ions in the same volume,', 't m', 'start', 11.5)
    f.text(690, top + 71, 'counted against pure water\u2019s one dot', 't m', 'start', 11.5)
    return f.svg()


def _ph(Ct, Na, Ka=None):
    lo, hi = 0.0, 14.0
    for _ in range(80):
        pH = (lo + hi) / 2; H = 10 ** -pH; OH = 1e-14 / H
        A = Ct if Ka is None else Ct * Ka / (Ka + H)
        if H + Na - OH - A > 0: lo = pH
        else: hi = pH
    return (lo + hi) / 2


def curve(vb, weak):
    V = 25 + vb
    return _ph(2.5 / V, 0.1 * vb / V, KA if weak else None)


@figure
def c7_titration():
    f = Fig(1000, 360, 'Calculated pH against volume of 0.10 mol/L sodium hydroxide added to 25 mL of 0.10 mol/L hydrochloric acid and acetic acid. Both jump steeply at 25 mL; the acetic acid curve has a flat buffer region around pH 4.7.', wide=True)
    x0, y0, w, h = 80, 300, 860, 260
    X = lambda v: x0 + v / 50 * w
    Y = lambda p: y0 - p / 14 * h
    f.rect(X(2.5), Y(14), X(22.5) - X(2.5), h, 'wash-n', 0)
    f.text((X(2.5) + X(22.5)) / 2, Y(13.2), 'buffer region (acetic acid)', 't nn b', 'middle', 12.5)
    f.axes(x0, y0, w, h)
    for p in range(0, 15, 2):
        f.line(x0 - 4, Y(p), x0, Y(p), 'ax'); f.text(x0 - 9, Y(p) + 4, str(p), 't m', 'end', 12)
        if p: f.line(x0, Y(p), x0 + w, Y(p), 'ln r', 'stroke-dasharray="2 4"')
    for v in range(0, 51, 5):
        f.line(X(v), y0, X(v), y0 + 4, 'ax'); f.text(X(v), y0 + 19, str(v), 't m', 'middle', 12)
    f.text(x0 + w, y0 + 42, 'sodium hydroxide added (mL)', 't m', 'end', 12.5)
    f.text(x0, 22, 'pH', 't m', 'start', 12.5)
    f.line(X(25), y0, X(25), Y(14), 'ln m dash')
    f.text(X(25) + 6, Y(1.2), 'equivalence point, 25 mL', 't m', 'start', 12)
    vs = [i * 0.25 for i in range(0, 201)]
    for weak, cls, lab, lv in ((False, 'ln p', 'hydrochloric acid', 8), (True, 'ln e', 'acetic acid', 8)):
        pts = []
        for v in vs:
            pts.append((X(v), Y(curve(v, weak))))
        f.path('M' + ' L'.join(f'{a:.1f},{b:.1f}' for a, b in pts), cls)
    f.text(X(7), Y(curve(7, False)) - 10, 'hydrochloric acid (strong)', 't p b', 'start', 12.5)
    f.text(X(4), Y(curve(4, True)) - 22, 'acetic acid (weak)', 't e b', 'start', 12.5)
    xm, ym = X(12.5), Y(curve(12.5, True))
    f.circle(xm, ym, 4.5, 'fill-ink')
    f.text(xm + 4, ym + 24, 'halfway: pH 4.74', 't b', 'start', 12)
    return f.svg()
