"""Figures for Chapter 11: Earth, materials and energy."""
from figs_core import Fig, figure


def box(f, x, y, w, h, title, sub='', cls='plate'):
    f.rect(x, y, w, h, cls, 8)
    f.text(x + w / 2, y + (h / 2 + 5 if not sub else h / 2 - 3), title, 't s b', 'middle', 16)
    if sub:
        f.text(x + w / 2, y + h / 2 + 15, sub, 't m', 'middle', 11.5)


@figure
def c11_carbonate():
    f = Fig(1000, 530, 'A numbered carbonate-chemistry explanation: carbon dioxide enters seawater, acid equilibria redistribute inorganic carbon toward bicarbonate, and carbonate availability and saturation affect calcium carbonate formation. Composition percentages are an approximate illustration near surface seawater pH, not a universal or current measurement.', wide=True)
    f.rect(0,0,1000,92,'fill-paper',0);f.rect(0,92,1000,438,'water',0)
    f.text(24,28,'1. Exchange with the atmosphere','t b',size=18)
    f.molecule('CO2',148,58,.85)
    f.text(205,64,'CO₂ enters the dissolved-carbon system','t',size=16)
    f.arrow(148,80,148,122,'ink',1.8)
    f.line(0,92,1000,92,'ln e')
    box(f,34,132,286,70,'CO₂(aq) + H₂O ⇌ H₂CO₃','hydration equilibrium')
    box(f,359,132,309,70,'H₂CO₃ ⇌ H⁺ + HCO₃⁻','acid–base equilibrium')
    f.arrow(324,166,352,166,'ink',1.5)
    f.text(34,231,'2. Carbonate accepts H⁺','t b',size=18)
    box(f,241,270,427,68,'H⁺ + CO₃²⁻ ⇌ HCO₃⁻','carbonate accepts a proton; bicarbonate increases')
    f.arrow(513,205,513,263,'proton',1.8)
    f.text(532,255,'H⁺ transfer','t p',size=14)
    # Composition is a separate, explicitly conditional comparison.
    f.text(713,126,'Illustrative surface seawater','t b',size=15)
    f.text(713,147,'near pH 8; conditions matter','t m',size=14)
    xx=713
    for frac,cls in ((.90,'bar-e'),(.09,'bar-n'),(.01,'bar-p')):
        f.rect(xx,165,247*frac,18,cls,0);xx+=247*frac
    f.text(713,212,'HCO₃⁻ ≈ 90%','t e',size=15)
    f.text(713,238,'CO₃²⁻ ≈ 9%; CO₂* ≈ 1%','t nn',size=14)
    f.text(713,263,'CO₂* includes dissolved CO₂','t m',size=13)
    f.text(713,282,'and hydrated carbonic acid.','t m',size=13)
    f.text(34,378,'3. Carbonate availability is relevant to calcification','t b',size=18)
    box(f,35,402,428,72,'Ca²⁺ + CO₃²⁻ ⇌ CaCO₃(s)','precipitation / dissolution account')
    f.path('M241,304 H20 V438','ln m dash')
    f.arrow(20,438,30,438,'muted',1.4,dash=True)
    f.lines(511,416,['More dissolved CO₂ generally lowers pH', 'and carbonate availability in seawater.', 'Saturation state and biology also affect calcification.'],'t',size=16,lh=1.5)
    f.text(35,511,'This diagram is an explanatory model, not a measured record or a prediction that a balanced equation must proceed.','t m',size=14)
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
