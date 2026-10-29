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
    f = Fig(1000, 550, 'A labelled pH scale with concentration approximations at 25 degrees Celsius, a separate approximate red-cabbage indicator band, and equal-volume hydronium counting bundles for pH 4, 5, 6 and 7. Everyday solution examples are listed separately so their labels do not overlap.', wide=True)
    f.text(35,28,'1. Read pH and its logarithmic concentration approximation','t b',size=18)
    f.text(35,54,'For dilute ideal solutions at 25 °C: pH ≈ −log₁₀([H₃O⁺] / (1 mol L⁻¹)).','t m',size=15)
    x0,x1,y=52,948,108;step=(x1-x0)/14
    for k in range(14):
        f.rect(x0+k*step,y-17,step,34,'wash-p' if k<7 else 'wash-e',0)
    f.rect(x0,y-17,x1-x0,34,'ln',3)
    for k in range(15):
        x=x0+k*step
        f.line(x,y-21,x,y-17,'ax')
        f.text(x,y+6,str(k),'t b','middle',16)
        power='1' if k==0 else f'10<tspan dy="-6" font-size="11">−{k}</tspan>'
        f.text(x,156,power,'t m','middle',13)
    f.text(52,183,'Approximate hydronium concentration / mol L⁻¹','t m',size=14)
    f.text(948,183,'Neutral water: pH 7 at 25 °C','t g','end',14)
    cab=['#b5122b','#c81d4a','#c42a63','#a8337f','#8a3b92','#713f9a','#5f46a0','#4a5aa8','#3570b0','#2c8aa6','#2f9b84','#5aa64c','#98b232','#c2b02a']
    for k,col in enumerate(cab):f.rect(x0+k*step,202,step+.5,17,'',0,f'fill="{col}"')
    f.text(52,243,'Red-cabbage colour is approximate; the numbered scale remains the reference.','t m',size=14)
    f.line(35,266,965,266,'ln r')
    f.text(35,296,'2. Compare equal volumes: each step left means ten times more H₃O⁺','t b',size=17)
    # A tile contains 100 symbols; the thousand is visibly ten whole tiles.
    def tile(x,y,n=100):
        for i in range(n):f.circle(x+(i%10)*3.2,y+(i//10)*3.2,1.05,'pt-p')
    for j in range(10):tile(44+(j%5)*39,330+(j//5)*39)
    tile(298,369)
    tile(409,398,10)
    tile(526,398,1)
    for x,ph,count in ((44,4,1000),(298,5,100),(409,6,10),(526,7,1)):
        f.text(x,443,f'pH {ph}','t b',size=16)
        f.text(x,468,'1 symbol' if count==1 else f'{count:,} symbols','t m',size=14)
    f.lines(40,510,['Counting comparison only: symbols are not literal ions in a drawn cup.', 'One hundred symbols per full tile; all samples represent the same volume.'],'t m',size=14,lh=1.4)
    f.line(626,316,626,527,'ln r')
    f.text(654,329,'3. Typical examples (values vary)','t b',size=16)
    for i,(name,ph) in enumerate((('Lemon juice','≈ 2–2.5'),('Black coffee','≈ 5'),('Pure water at 25 °C','7'),('Baking-soda solution','≈ 8.3'),('Household ammonia','≈ 11–12'))):
        f.text(654,363+i*34,name,'t',size=14)
        f.text(957,363+i*34,ph,'t m','end',14)
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
