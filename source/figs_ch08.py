"""Figures for Chapter 8: electron transfer."""
from figs_core import Fig, figure


def sulfate(f, x, y, r=13):
    f.circle(x, y, r, 'plate')
    f.text(x, y + 4, 'SO₄²⁻', 't m', 'middle', 9.5)


@figure
def c8_zn_cu():
    f = Fig(640, 320, 'Before and after: zinc atoms in a strip give electrons to copper ions in solution; zinc ions go into the water and copper atoms stay on the strip.')
    for k, (title, x0) in enumerate((('before', 20), ('after', 335))):
        f.text(x0, 24, title, 't b', 'start', 15)
        f.rect(x0, 40, 285, 230, 'water', 6)
        # strip (left edge)
        f.rect(x0 + 6, 46, 64, 218, 'fill-sheet', 3)
        f.rect(x0 + 6, 46, 64, 218, 'ln m', 3)
        for i in range(5):
            for j in range(2):
                cx, cy = x0 + 24 + j * 28, 68 + i * 42
                if k == 1 and j == 1 and i in (1, 3):
                    f.atom(cx, cy, 'Cu', 13)
                else:
                    f.atom(cx, cy, 'Zn', 13)
        # solution particles
        if k == 0:
            ions = [(150, 80, 'Cu'), (230, 120, 'Cu'), (130, 200, 'Cu'), (215, 230, 'Cu')]
            for x, y, el in ions:
                f.ion(x0 + x - 20, y, el, '2+', 15)
            for x, y in [(240, 70), (190, 170), (260, 195), (120, 140)]:
                sulfate(f, x0 + x - 20, y)
            f.arrow(x0 + 70, 110, x0 + 100, 92, 'electron')
            f.text(x0 + 86, 132, '2 e⁻', 't e b', 'middle', 12.5)
        else:
            ions = [(150, 90, 'Zn', '2+'), (210, 150, 'Zn', '2+'), (130, 200, 'Cu', '2+'), (215, 230, 'Cu', '2+')]
            for x, y, el, q in ions:
                f.ion(x0 + x - 20, y, el, q, 15)
            for x, y in [(240, 70), (190, 180), (260, 195), (120, 140)]:
                sulfate(f, x0 + x - 20, y)
        f.text(x0 + 38, 290, 'zinc strip', 't m', 'middle', 12)
        f.text(x0 + 180, 290, 'solution', 't m', 'middle', 12)
    f.text(320, 312, 'Each Zn atom that reacts gives 2 electrons to one Cu²⁺ ion. Sulfate ions are spectators.', 't m', 'middle', 12)
    return f.svg()


def tokens(f, x, y, n, kind='e', gap=18):
    for k in range(n):
        f.nucleon(x + k * gap, y, kind, 7)


@figure
def c8_electron_balance():
    f = Fig(640, 300, 'One magnesium atom gives two electrons to two silver ions. Two aluminium atoms give six electrons to three copper ions.')
    # row 1: Mg + 2 Ag+
    f.text(20, 28, 'Mg + 2 Ag⁺ → Mg²⁺ + 2 Ag', 't s b', 'start', 16)
    f.atom(60, 82, 'Mg', 20)
    tokens(f, 100, 82, 2)
    f.text(118, 112, '2 e⁻ given', 't m', 'middle', 12)
    f.arrow(150, 82, 220, 82, 'electron')
    for k in range(2):
        f.ion(270 + k * 70, 82, 'Ag', '+', 18)
        f.nucleon(270 + k * 70, 116, 'e', 7)
    f.text(305, 140, '1 e⁻ taken by each', 't m', 'middle', 12)
    f.text(450, 78, 'given 2 = taken 2', 't g b', 'start', 14)
    f.line(20, 162, 620, 162, 'ln r')
    # row 2: 2 Al + 3 Cu2+
    f.text(20, 190, '2 Al + 3 Cu²⁺ → 2 Al³⁺ + 3 Cu', 't s b', 'start', 16)
    for k in range(2):
        f.atom(50 + k * 50, 240, 'Al', 18)
    tokens(f, 140, 240, 6, gap=15)
    f.text(178, 272, '2 × 3 = 6 e⁻ given', 't m', 'middle', 12)
    f.arrow(232, 240, 280, 240, 'electron')
    for k in range(3):
        f.ion(310 + k * 52, 240, 'Cu', '2+', 17)
    f.text(362, 278, '3 × 2 = 6 e⁻ taken', 't m', 'middle', 12)
    f.text(470, 236, 'given 6 = taken 6', 't g b', 'start', 14)
    return f.svg()


@figure
def c8_series():
    f = Fig(640, 300, 'A grid of three metals against three solutions: zinc reacts with copper and silver ions; copper reacts with silver ions only; silver reacts with none.')
    metals = ['zinc, Zn', 'copper, Cu', 'silver, Ag']
    sols = ['Zn²⁺ solution', 'Cu²⁺ solution', 'Ag⁺ solution']
    x0, y0, cw, chh = 170, 70, 145, 62
    f.text(20, 40, 'metal put in ↓', 't m', 'start', 12.5)
    for j, s in enumerate(sols):
        f.text(x0 + cw * j + cw / 2, 52, s, 't b', 'middle', 13.5)
    for i, m in enumerate(metals):
        y = y0 + i * chh
        f.text(20, y + chh / 2 + 5, m, 't b', 'start', 14)
        for j in range(3):
            x = x0 + cw * j
            if j > i:
                f.rect(x + 4, y + 4, cw - 8, chh - 8, 'wash-g', 6)
                f.text(x + cw / 2, y + chh / 2 - 1, 'reacts', 't g b', 'middle', 13.5)
                coat = ['', 'copper', 'silver'][j]
                f.text(x + cw / 2, y + chh / 2 + 16, f'{coat} forms', 't m', 'middle', 11.5)
            elif j == i:
                f.rect(x + 4, y + 4, cw - 8, chh - 8, 'plate', 6)
                f.text(x + cw / 2, y + chh / 2 + 5, 'same metal', 't m', 'middle', 12.5)
            else:
                f.rect(x + 4, y + 4, cw - 8, chh - 8, 'plate', 6)
                f.text(x + cw / 2, y + chh / 2 + 5, 'no reaction', 't m', 'middle', 12.5)
    f.arrow(625, 80, 625, 245, 'muted')
    f.text(612, 270, 'gives electrons away less readily', 't m', 'end', 11.5)
    f.text(612, 288, 'going down the list', 't m', 'end', 11.5)
    return f.svg()


@figure
def c8_daniell():
    f = Fig(1000, 420, 'A Daniell cell: zinc in zinc sulfate and copper in copper sulfate, joined by a wire through a bulb and by a salt bridge. Electrons flow through the wire from zinc to copper; nitrate ions move towards the zinc side and potassium ions towards the copper side.', wide=True)
    B = [(60, 'zinc', 'Zn'), (690, 'copper', 'Cu')]
    for bx, name, el in B:
        f.path(f'M{bx},170 L{bx},380 Q{bx},395 {bx + 15},395 L{bx + 235},395 Q{bx + 250},395 {bx + 250},380 L{bx + 250},170', 'glass')
        f.rect(bx + 2, 215, 246, 178, 'water', 4)
    ze, ce = 110, 880   # electrode x (left edge)
    for ex, name in ((ze, 'zinc'), (ce, 'copper')):
        f.rect(ex, 120, 26, 240, 'fill-sheet', 2); f.rect(ex, 120, 26, 240, 'ln', 2)
        f.text(ex + 13 + (-22 if name == 'zinc' else 22), 150, name, 't b', 'end' if name == 'zinc' else 'start', 14)
    # wire and bulb
    f.path(f'M{ze + 13},120 L{ze + 13},50 L478,50', 'ln')
    f.path(f'M522,50 L{ce + 13},50 L{ce + 13},120', 'ln')
    f.circle(500, 50, 22, 'plate'); f.circle(500, 50, 22, 'ln')
    f.path('M486,58 Q493,34 500,52 Q507,34 514,58', 'ln m')
    f.text(500, 90, 'bulb (or a meter: 1.10 V)', 't m', 'middle', 12)
    for x in (210, 330):
        f.arrow(x, 50, x + 60, 50, 'electron', 2)
    for x in (610, 730):
        f.arrow(x, 50, x + 60, 50, 'electron', 2)
    f.text(300, 38, 'electrons', 't e b', 'middle', 13)
    f.text(700, 38, 'electrons', 't e b', 'middle', 13)
    # salt bridge
    d = 'M250,330 L250,150 Q250,125 275,125 L725,125 Q750,125 750,150 L750,330'
    f.path(d, 'ln', 'style="stroke:var(--rule);stroke-width:30;stroke-linecap:butt"')
    f.path(d, 'ln m', 'style="stroke-width:1"')
    f.text(500, 168, 'salt bridge (potassium nitrate solution)', 't m', 'middle', 12)
    f.arrow(560, 119, 440, 119, 'electron', 1.8)
    f.arrow(440, 131, 560, 131, 'proton', 1.8)
    f.text(500, 192, 'NO₃⁻ ions (blue arrow) drift towards the zinc side', 't e', 'middle', 12.5)
    f.text(500, 210, 'K⁺ ions (red arrow) drift towards the copper side', 't p', 'middle', 12.5)
    # ions
    for x, y in [(170, 260), (200, 330), (165, 370), (225, 290)]:
        f.ion(x, y, 'Zn', '2+', 13)
    for x, y in [(800, 260), (830, 330), (780, 370), (760, 300)]:
        f.ion(x, y, 'Cu', '2+', 13)
    f.text(193, 238, 'Zn → Zn²⁺ + 2e⁻', 't s', 'middle', 13)
    f.text(818, 238, 'Cu²⁺ + 2e⁻ → Cu', 't s', 'middle', 13)
    f.text(185, 414, 'anode: oxidation, plate gets thinner', 't m', 'middle', 12.5)
    f.text(815, 414, 'cathode: reduction, plate gets thicker', 't m', 'middle', 12.5)
    return f.svg()
