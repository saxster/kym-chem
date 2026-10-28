"""Figures for Chapter 11: Earth, materials and energy."""
from figs_core import Fig, figure


def box(f, x, y, w, h, title, sub='', cls='plate'):
    f.rect(x, y, w, h, cls, 8)
    f.text(x + w / 2, y + (h / 2 + 5 if not sub else h / 2 - 3), title, 't s b', 'middle', 16)
    if sub:
        f.text(x + w / 2, y + h / 2 + 15, sub, 't m', 'middle', 11.5)


@figure
def c11_carbonate():
    f = Fig(1000, 380, 'Carbon dioxide from the air dissolves in seawater and makes carbonic acid. Its hydrogen ions are mostly taken up by carbonate ions, which become bicarbonate. That leaves fewer carbonate ions for animals building calcium carbonate shells.', wide=True)
    # air / sea
    f.rect(0, 0, 1000, 92, 'fill-paper', 0)
    f.rect(0, 92, 1000, 288, 'water', 0)
    f.line(0, 92, 1000, 92, 'ln e')
    f.text(20, 30, 'air', 't m b', 'start', 13)
    f.text(20, 118, 'sea', 't e b', 'start', 13)
    f.molecule('CO2', 150, 50, 0.9)
    f.text(196, 55, 'CO₂ from burning fuel', 't', 'start', 13)
    f.arrow(150, 70, 150, 132, 'ink', 1.8)
    f.text(160, 112, 'dissolves', 't m', 'start', 12)
    # steps
    box(f, 80, 140, 150, 54, 'CO₂ + H₂O', 'dissolved gas + water')
    f.arrow(232, 167, 300, 167, 'ink', 1.6)
    f.arrow(300, 175, 232, 175, 'ink', 1.6)
    box(f, 302, 140, 120, 54, 'H₂CO₃', 'carbonic acid')
    f.arrow(424, 167, 492, 167, 'ink', 1.6)
    f.arrow(492, 175, 424, 175, 'ink', 1.6)
    box(f, 494, 140, 170, 54, 'H⁺ + HCO₃⁻', 'hydrogen ion + bicarbonate')
    # H+ meets carbonate
    f.arrow(560, 196, 560, 250, 'proton', 1.6)
    f.text(570, 228, 'most H⁺ is taken up here', 't p', 'start', 12)
    box(f, 470, 252, 230, 54, 'H⁺ + CO₃²⁻ → HCO₃⁻', 'carbonate soaks up H⁺')
    f.text(585, 330, 'the buffer: pH falls only a little', 't m', 'middle', 12)
    f.text(585, 346, 'but carbonate is used up', 't m', 'middle', 12)
    # shells
    box(f, 780, 252, 190, 54, 'Ca²⁺ + CO₃²⁻ → CaCO₃', 'how shells and corals grow')
    f.arrow(776, 279, 704, 279, 'muted', 1.4, dash=True)
    f.text(875, 330, 'less CO₃²⁻ left over', 't m', 'middle', 12)
    f.text(875, 346, 'makes shell-building harder', 't m', 'middle', 12)
    # proportions bar
    x, y, w = 710, 140, 260
    f.text(x, y + 6, 'Dissolved carbon in seawater today, roughly:', 't m', 'start', 11.5)
    parts = [(0.90, 'bar-e', 'HCO₃⁻ ~90%'), (0.09, 'bar-n', 'CO₃²⁻ ~9%'), (0.01, 'bar-p', '')]
    xx = x
    for frac, cls, lab in parts:
        f.rect(xx, y + 16, w * frac, 18, cls, 0)
        xx += w * frac
    f.text(x, y + 52, 'HCO₃⁻ about 90%', 't e', 'start', 12)
    f.text(x, y + 68, 'CO₃²⁻ about 9%, CO₂ about 1%', 't nn', 'start', 12)
    return f.svg()


@figure
def c11_li_cell():
    f = Fig(640, 360, 'A lithium-ion cell discharging. Lithium ions leave the layers of graphite on the left, cross the electrolyte, and slip between the layers of a metal oxide on the right. Electrons take the outside path through the wire and the device. Charging pushes both back.')
    # device and wire
    f.path('M110,96 L110,40 L530,40 L530,96', 'ln')
    f.rect(270, 22, 100, 36, 'fill-sheet', 6)
    f.rect(270, 22, 100, 36, 'ln', 6)
    f.text(320, 45, 'phone', 't b', 'middle', 13)
    f.arrow(160, 40, 240, 40, 'electron', 2.2)
    f.arrow(400, 40, 480, 40, 'electron', 2.2)
    f.text(200, 30, 'e⁻', 't e b', 'middle', 14)
    f.text(440, 30, 'e⁻', 't e b', 'middle', 14)
    # cell body
    f.rect(40, 96, 560, 210, 'plate', 8)
    f.rect(300, 100, 40, 202, 'water', 0)
    f.line(320, 100, 320, 302, 'ln m dash')
    # graphite layers left
    for k in range(5):
        y = 118 + k * 32
        f.rect(60, y, 200, 6, 'bar-ink', 1)
    # metal oxide layers right
    for k in range(5):
        y = 118 + k * 32
        f.rect(380, y, 200, 6, 'bar-m', 1)
        for j in range(6):
            f.circle(392 + j * 35, y + 3, 4, 'fill-ink')
    # lithium ions: a few left (between layers), some crossing, some right
    def li(x, y):
        f.circle(x, y, 7.5, 'pt-p')
        f.text(x, y + 3.5, '+', 'pt-sign', 'middle', 10, 700)
    for x, y in [(90, 137), (150, 169), (220, 137), (110, 233), (190, 201)]:
        li(x, y)
    for x, y in [(310, 170), (330, 215)]:
        li(x, y)
    for x, y in [(410, 137), (495, 201), (460, 233), (540, 169)]:
        li(x, y)
    f.arrow(250, 268, 395, 268, 'proton', 2)
    f.text(320, 292, 'Li⁺ through the electrolyte', 't p b', 'middle', 12.5)
    f.text(160, 325, 'graphite (carbon layers)', 't b', 'middle', 13)
    f.text(160, 342, 'Li gives up its electron here', 't m', 'middle', 12)
    f.text(480, 325, 'metal oxide (e.g. CoO₂ layers)', 't b', 'middle', 13)
    f.text(480, 342, 'Li⁺ and e⁻ arrive here', 't m', 'middle', 12)
    f.text(320, 88, 'separator', 't m', 'middle', 11.5)
    return f.svg()
