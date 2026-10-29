"""Figures for Chapter 5."""
import math
from figs_core import Fig, figure, catmull


def profile_path(X, Y, R, peak, P, x0=0, x1=10):
    """Smooth schematic energy profile from reactant level R over peak to product level P."""
    pts = [(0, R), (1.2, R), (2.6, R + (peak - R) * 0.25), (3.8, R + (peak - R) * 0.8), (5, peak),
           (6.2, P + (peak - P) * 0.8), (7.4, P + (peak - P) * 0.25), (8.8, P), (10, P)]
    return catmull([(X(x), Y(y)) for x, y in pts])


def dim_arrow(f, x, y1, y2, label, cls='ink', side='right', size=12.5, tcls='t', ly=None):
    f.arrow(x, y1, x, y2, cls, 1.4)
    ly = (y1 + y2) / 2 + 4 if ly is None else ly
    f.text(x + (8 if side == 'right' else -8), ly, label, tcls, 'start' if side == 'right' else 'end', size)


@figure
def c5_energy_levels():
    f = Fig(640, 280, 'Two energy diagrams. Exothermic: products lower than reactants, energy goes to the surroundings. Endothermic: products higher, energy taken from the surroundings.')
    for k, (title, top, bot, rlab, plab, warm) in enumerate((
            ('Exothermic (like burning gas)', 80, 190, 'reactants', 'products', True),
            ('Endothermic (like a cold pack)', 190, 80, 'start', 'end', False))):
        x0 = 30 + k * 320
        f.text(x0, 28, title, 't b', 'start', 14)
        f.line(x0, 52, x0, 236, 'ax'); f.arrow(x0, 236, x0, 50, 'ink', 1.2)
        f.text(x0 - 6, 250, 'energy', 't m', 'start', 11.5)
        f.line(x0 + 20, top, x0 + 110, top, 'ln vol')
        f.text(x0 + 65, top - 8, rlab, 't', 'middle', 12.5)
        f.line(x0 + 150, bot, x0 + 240, bot, 'ln vol')
        f.text(x0 + 195, bot - 8, plab, 't', 'middle', 12.5)
        f.line(x0 + 110, top, x0 + 150, bot, 'ln m dash')
        if warm:
            f.arrow(x0 + 255, top + 6, x0 + 255, bot - 4, 'proton', 1.6)
            f.lines(x0 + 200, 222, ['energy out:', 'surroundings warm up'], 't p', 'middle', 12)
        else:
            f.arrow(x0 + 255, top - 4, x0 + 255, bot + 6, 'electron', 1.6)
            f.lines(x0 + 200, 222, ['energy in:', 'surroundings cool down'], 't e', 'middle', 12)
    f.line(320, 14, 320, 266, 'ln r')
    return f.svg()


@figure
def c5_barrier():
    f = Fig(640, 320, 'Schematic energy profile: reactants at 50, peak at 100, products at 20. Forward barrier 50, reverse barrier 80, overall change minus 30.')
    x0, y0, w, h = 60, 270, 520, 230
    X = lambda u: x0 + u / 10 * w
    Y = lambda v: y0 - v / 120 * h
    f.axes(x0, y0, w, h)
    f.text(x0 + 4, y0 - h - 8, 'energy (made-up units)', 't m', 'start', 12)
    f.text(x0 + w, y0 + 22, 'progress of the reaction', 't m', 'end', 12)
    for v in (0, 20, 50, 100):
        f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 11.5)
    f.path(profile_path(X, Y, 50, 100, 20), 'ln vol')
    f.line(X(0), Y(100), X(10), Y(100), 'ln r dash')
    f.line(X(1.2), Y(50), X(5.5), Y(50), 'ln r dash')
    f.line(X(5), Y(20), X(9), Y(20), 'ln r dash')
    dim_arrow(f, X(3.2), Y(50), Y(100) + 2, 'forward barrier 50', 'ink', 'left', ly=Y(90))
    dim_arrow(f, X(6.6), Y(20), Y(100) + 2, 'reverse barrier 80', 'ink', ly=Y(90))
    dim_arrow(f, X(9.3), Y(50), Y(20) - 2, '−30 overall', 'proton', 'left', 12.5, 't p b')
    f.text(X(0.15), Y(50) - 8, 'reactants', 't', 'start', 12.5)
    f.text(X(9.4), Y(20) + 18, 'products', 't', 'middle', 12.5)
    f.text(X(5), Y(100) - 8, 'peak', 't', 'middle', 12.5)
    return f.svg()


def ab(t, kf, kr, a0=10.0, b0=0.0):
    tot = a0 + b0
    aeq = tot * kr / (kf + kr)
    return aeq + (a0 - aeq) * math.exp(-(kf + kr) * t)


@figure
def c5_rate_curves():
    f = Fig(1000, 340, 'Amounts of A and B against time in the A to B model. A falls from 10 and B rises from 0, levelling off at 3.33 and 6.67. With doubled rate constants the same levels are reached twice as fast.', wide=True)
    x0, y0, w, h = 80, 280, 860, 230
    X = lambda t: x0 + t / 3 * w
    Y = lambda v: y0 - v / 10 * h
    f.axes(x0, y0, w, h)
    f.text(x0, 30, 'amount (units)', 't m', 'start', 12.5)
    f.text(x0 + w, y0 + 34, 'time (seconds)', 't m', 'end', 12.5)
    for v in (0, 2, 4, 6, 8, 10):
        f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 12)
        if v: f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    for t in (0, 0.5, 1, 1.5, 2, 2.5, 3):
        f.line(X(t), y0, X(t), y0 + 5, 'ax')
        f.text(X(t), y0 + 19, f'{t:g}', 't m', 'middle', 12)
    ts = [i / 60 for i in range(181)]
    for kf, kr, dash in ((4, 2, True), (2, 1, False)):
        a = [(X(t), Y(ab(t, kf, kr))) for t in ts]
        b = [(X(t), Y(10 - ab(t, kf, kr))) for t in ts]
        d = ' stroke-dasharray="6 5"' if dash else ''
        f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in a), 'ln p', d + (' stroke-opacity=".55"' if dash else ''))
        f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in b), 'ln e', d + (' stroke-opacity=".55"' if dash else ''))
    f.text(X(3) - 4, Y(10 / 3) - 9, 'A settles at 3.33', 't p b', 'end', 13)
    f.text(X(3) - 4, Y(20 / 3) - 9, 'B settles at 6.67', 't e b', 'end', 13)
    f.text(X(0.08), Y(10) + 4, 'A', 't p b', 'start', 14)
    f.text(X(0.04), Y(0.5) - 2, 'B', 't e b', 'start', 14)
    t1 = 1.0
    f.circle(X(t1), Y(ab(t1, 2, 1)), 4.5, 'fill-ink'); f.circle(X(t1), Y(10 - ab(t1, 2, 1)), 4.5, 'fill-ink')
    f.text(X(t1) + 10, Y(ab(t1, 2, 1)) + 18, 'after 1 s: A 3.67, B 6.33', 't', 'start', 12.5)
    f.line(X(1.75), 50, X(1.95), 50, 'ln m', 'stroke-dasharray="6 5"')
    f.text(X(1.98), 54, 'dashed: both rate constants doubled', 't m', 'start', 12.5)
    return f.svg()


@figure
def c5_catalyst():
    f = Fig(640, 320, 'Energy profile with and without a catalyst. Uncatalysed peak 130, catalysed peak 90; reactants 50 and products 20 unchanged.')
    x0, y0, w, h = 60, 280, 520, 240
    X = lambda u: x0 + u / 10 * w
    Y = lambda v: y0 - v / 140 * h
    f.axes(x0, y0, w, h)
    f.text(x0 + 4, y0 - h - 6, 'energy (made-up units)', 't m', 'start', 12)
    f.text(x0 + w, y0 + 22, 'progress of the reaction', 't m', 'end', 12)
    for v in (20, 50, 90, 130):
        f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 11.5)
        f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    f.path(profile_path(X, Y, 50, 130, 20), 'ln')
    f.path(profile_path(X, Y, 50, 90, 20), 'ln g', 'stroke-dasharray="7 5"')
    f.text(X(5), Y(130) - 9, 'without catalyst', 't', 'middle', 12.5)
    f.text(X(5), Y(90) + 22, 'with catalyst', 't g b', 'middle', 12.5)
    dim_arrow(f, X(2.2), Y(50), Y(130) + 2, 'forward 80 → 40', 'ink', 'left')
    dim_arrow(f, X(7.8), Y(20), Y(130) + 2, 'reverse 110 → 70', 'ink')
    f.text(X(0.15), Y(50) - 8, 'start', 't', 'start', 12.5)
    f.text(X(9.4), Y(20) - 8, 'finish', 't', 'middle', 12.5)
    return f.svg()


@figure
def c5_equilibrium_rates():
    f = Fig(640, 300, 'Forward rate falls from 20 and reverse rate rises from 0; both reach 6.67 units per second at equilibrium.')
    x0, y0, w, h = 60, 250, 540, 200
    X = lambda t: x0 + t / 2.5 * w
    Y = lambda v: y0 - v / 20 * h
    f.axes(x0, y0, w, h)
    f.text(x0, 30, 'rate (units per second)', 't m', 'start', 12)
    f.text(x0 + w, y0 + 34, 'time (seconds)', 't m', 'end', 12)
    for v in (0, 5, 10, 15, 20):
        f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 11.5)
    for t in (0, 0.5, 1, 1.5, 2, 2.5):
        f.text(X(t), y0 + 18, f'{t:g}', 't m', 'middle', 11.5)
    ts = [i / 60 for i in range(151)]
    fw = [(X(t), Y(2 * ab(t, 2, 1))) for t in ts]
    rv = [(X(t), Y(1 * (10 - ab(t, 2, 1)))) for t in ts]
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in fw), 'ln p')
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in rv), 'ln e')
    f.text(X(0.12), Y(17), 'forward: 2 × A', 't p b', 'start', 13)
    f.text(X(0.3), Y(1.6), 'reverse: 1 × B', 't e b', 'start', 13)
    f.line(X(1.4), Y(20 / 3), X(2.5), Y(20 / 3), 'ln r dash')
    f.text(X(2.5), Y(20 / 3) - 10, 'equal: 6.67 each way', 't b', 'end', 13)
    return f.svg()


@figure
def c5_bond_ledger():
    f = Fig(640, 330, 'Energy ledger for 2 H2 + O2 to 2 H2O: breaking bonds raises energy by 1370.4 kJ, making bonds lowers it by 1854.0 kJ, net minus 483.6 kJ.')
    x0, w = 70, 520
    Y = lambda v: 60 + (1450 - v) / 2050 * 240   # v from -600 to 1450
    f.line(x0, Y(0), x0 + w, Y(0), 'ln r dash')
    cols = [(110, 0, '2 H₂ + O₂', 'start'), (300, 1370.4, '4 H + 2 O', 'separate atoms'), (480, -483.6, '2 H₂O', 'products')]
    for x, v, lab, sub in cols:
        f.line(x - 60, Y(v), x + 60, Y(v), 'ln vol')
        f.text(x, Y(v) - 22, lab, 't s', 'middle', 15)
        f.text(x, Y(v) - 6, sub, 't m', 'middle', 11.5)
    f.arrow(185, Y(0) - 2, 236, Y(1370.4) + 4, 'proton', 1.8)
    f.lines(140, Y(760), ['break bonds', '+1,370.4 kJ in'], 't p b', 'middle', 13)
    f.arrow(364, Y(1370.4) + 4, 416, Y(-483.6) - 2, 'green', 1.8)
    f.lines(396, Y(720), ['make bonds', '−1,854.0 kJ out'], 't g b', 'start', 13)
    f.line(545, Y(0), 560, Y(0), 'ln')
    f.line(545, Y(-483.6), 560, Y(-483.6), 'ln')
    f.arrow(553, Y(0), 553, Y(-483.6) - 2, 'ink', 1.4)
    f.lines(566, Y(-241) - 4, ['net', '−483.6 kJ'], 't b', 'start', 13)
    f.text(320, 318, 'gas-phase bond estimate; gas-water reference near −484 kJ', 't m', 'middle', 12)
    return f.svg()


@figure
def c5_perturb():
    f = Fig(1000, 340, 'A and B amounts over time. At 2 seconds, 4 units of A are added; A jumps to 7.33 then falls to 4.67 while B rises from 6.67 to 9.33.', wide=True)
    x0, y0, w, h = 80, 280, 860, 230
    T = 5.0
    X = lambda t: x0 + t / T * w
    Y = lambda v: y0 - v / 11 * h
    f.axes(x0, y0, w, h)
    f.text(x0, 30, 'amount (units)', 't m', 'start', 12.5)
    f.text(x0 + w, y0 + 34, 'time (seconds)', 't m', 'end', 12.5)
    for v in (0, 2, 4, 6, 8, 10):
        f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 12)
        if v: f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    for t in range(6):
        f.line(X(t), y0, X(t), y0 + 5, 'ax')
        f.text(X(t), y0 + 19, str(t), 't m', 'middle', 12)
    tp = 2.0
    a_tp = ab(tp, 2, 1); b_tp = 10 - a_tp
    A, B = [], []
    for i in range(301):
        t = i / 60
        if t <= tp:
            a = ab(t, 2, 1); b = 10 - a
        else:
            a = ab(t - tp, 2, 1, a_tp + 4, b_tp); b = 14 - a
        A.append((X(t), Y(a))); B.append((X(t), Y(b)))
    cut = int(tp * 60)
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in A[:cut + 1]), 'ln p')
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in A[cut + 1:]), 'ln p')
    f.line(A[cut][0], A[cut][1], A[cut + 1][0], Y(a_tp + 4), 'ln p dash')
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in B), 'ln e')
    f.arrow(X(tp) - 40, Y(10.4), X(tp) - 4, Y(a_tp + 4) - 6, 'ink', 1.3)
    f.text(X(tp) - 44, Y(10.4) + 4, 'add 4 units of A', 't b', 'end', 13)
    f.text(X(T) - 4, Y(14 / 3) + 18, 'A settles at 4.67', 't p b', 'end', 13)
    f.text(X(T) - 4, Y(28 / 3) - 9, 'B settles at 9.33', 't e b', 'end', 13)
    f.text(X(1.95), Y(10 / 3) + 18, 'A 3.33', 't p', 'end', 12.5)
    f.text(X(1.95), Y(20 / 3) - 9, 'B 6.67', 't e', 'end', 12.5)
    f.text(X(0.08), Y(10) + 4, 'A', 't p b', 'start', 14)
    f.text(X(0.04), Y(0.5) - 2, 'B', 't e b', 'start', 14)
    return f.svg()
