"""Figures for the carbon, life and planet stories."""
import math
from figs_core import Fig, figure

# Mauna Loa annual mean CO2 (ppm), NOAA Global Monitoring Laboratory
MLO = [(1959, 315.98), (1965, 320.04), (1970, 325.68), (1975, 331.11), (1980, 338.76), (1985, 346.35),
       (1990, 354.45), (1995, 360.97), (2000, 369.71), (2005, 379.98), (2010, 389.90), (2015, 401.01),
       (2020, 414.24), (2023, 421.08)]


@figure
def s_keeling_curve():
    f = Fig(640, 320, 'The Keeling curve: carbon dioxide in the air at Mauna Loa rising from about 316 parts per million in 1959 to about 421 in 2023, with a yearly up-and-down wiggle.')
    x0, y0, w, h = 70, 270, 540, 220
    def X(t): return x0 + (t - 1958) / (2024 - 1958) * w
    def Y(v): return y0 - (v - 300) / (430 - 300) * h
    f.axes(x0, y0, w, h)
    f.text(x0, 30, 'carbon dioxide in the air (parts per million)', 't m', 'start', 12.5)
    for v in range(300, 431, 25):
        f.line(x0 - 4, Y(v), x0, Y(v), 'ax'); f.text(x0 - 8, Y(v) + 4, str(v), 't m', 'end', 11.5)
        f.line(x0, Y(v), x0 + w, Y(v), 'ln r', 'stroke-dasharray="2 4"')
    for t in range(1960, 2021, 10):
        f.line(X(t), y0, X(t), y0 + 4, 'ax'); f.text(X(t), y0 + 18, str(t), 't m', 'middle', 11.5)
    # smooth annual trend by linear interpolation, plus a schematic seasonal wiggle (about 6 ppm peak to peak)
    pts = []
    t = 1958.5
    while t <= 2023.9:
        for (a, va), (b, vb) in zip(MLO, MLO[1:]):
            if a <= t <= b:
                v = va + (vb - va) * (t - a) / (b - a); break
        else:
            v = MLO[0][1] if t < MLO[0][0] else MLO[-1][1]
        v += 3 * math.cos(2 * math.pi * (t - 0.38))  # peak in May, low in autumn
        pts.append((X(t), Y(v)))
        t += 1 / 24
    f.path('M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts), 'ln e', 'stroke-width="1.4"')
    for yr, v in (MLO[0], MLO[-1]):
        f.circle(X(yr), Y(v), 4, 'fill-vol')
    f.text(X(1959) + 8, Y(315.98) + 20, '1959: about 316', 't b', 'start', 12.5)
    f.text(X(2023) - 8, Y(421.08) - 10, '2023: about 421', 't b', 'end', 12.5)
    f.text(X(1990), Y(395), 'each year: down in the northern summer,', 't m', 'middle', 12)
    f.text(X(1990), Y(395) + 15, 'up in the winter (the Earth breathing)', 't m', 'middle', 12)
    return f.svg()
