"""Still figures for the 'insight' live figures: water and ice, flame colours, and zooming into a mole."""
import math
from figs_core import Fig, figure
from figs_stories_atoms import wl_color


@figure
def i_waterice():
    f = Fig(640, 300, 'Left: liquid water, molecules jumbled and close, hydrogen bonds forming and breaking. Right: ice, each molecule held by four hydrogen bonds in open six-sided rings, so the same molecules take up more room.')
    f.text(160, 24, 'Liquid water', 't b', 'middle', 14)
    f.text(480, 24, 'Ice', 't b v', 'middle', 14)
    f.rect(20, 38, 280, 196, 'plate', 6)
    f.rect(340, 38, 280, 214, 'plate', 6)
    import random
    rnd = random.Random(4)
    pts, tries = [], 0
    while len(pts) < 20 and tries < 5000:
        tries += 1
        p = (rnd.uniform(44, 276), rnd.uniform(62, 212))
        if all(math.hypot(p[0] - q[0], p[1] - q[1]) > 34 for q in pts):
            pts.append(p)
    for i, (x, y) in enumerate(pts):
        for j in range(i):
            if math.hypot(x - pts[j][0], y - pts[j][1]) < 46 and (i + j) % 3 == 0:
                f.line(x, y, *pts[j], 'ln v dash')
    for k, (x, y) in enumerate(pts):
        f.molecule('H2O', x, y, 0.62, rot=(k * 67) % 360)
    # ice: a honeycomb of oxygen positions, each linked to its neighbours by hydrogen bonds
    R = 30
    cells = [(400, 92), (400 + R * math.sqrt(3), 92), (400 + 2 * R * math.sqrt(3), 92),
             (400 + R * math.sqrt(3) / 2, 92 + 1.5 * R), (400 + R * math.sqrt(3) * 1.5, 92 + 1.5 * R),
             (400 + R * math.sqrt(3) * 2.5, 92 + 1.5 * R), (400, 92 + 3 * R), (400 + R * math.sqrt(3), 92 + 3 * R),
             (400 + 2 * R * math.sqrt(3), 92 + 3 * R)]
    verts = set()
    for cx, cy in cells:
        ring = [(round(cx + R * math.cos(math.radians(90 + 60 * t)), 1), round(cy + R * math.sin(math.radians(90 + 60 * t)), 1)) for t in range(6)]
        for t in range(6):
            f.line(*ring[t], *ring[(t + 1) % 6], 'ln v dash')
            verts.add(ring[t])
    for k, (x, y) in enumerate(sorted(verts)):
        f.atom(x, y, 'O', 8.5, label=False)
    f.text(160, 254, 'close and jumbled: about 1.00 g per mL', 't m', 'middle', 12)
    f.text(480, 272, 'open six-sided rings: about 0.917 g per mL', 't m', 'middle', 12)
    f.text(480, 290, 'oxygens shown; dashed lines are hydrogen bonds', 't m', 'middle', 11)
    return f.svg()


@figure
def i_spectrum():
    f = Fig(1000, 450, 'Hydrogen energy levels on a linear energy scale, with separate callouts for crowded upper levels. Four downward transitions to n = 2 correspond to Balmer emission lines near 656, 486, 434 and 410 nanometres. Colours supplement wavelength labels; this is an energy-level model, not electron trajectories.', wide=True)
    Y = lambda energy: 378 - (energy + 13.6) / 13.6 * 310
    f.text(28, 28, '1. Read the energy levels', 't b', size=18)
    f.text(532, 28, '2. Match each transition to emitted light', 't b', size=18)
    f.line(496, 42, 496, 416, 'ln r')
    f.arrow(62, 386, 62, 55, 'ink')
    f.text(30, 45, 'E / eV', 't m', size=14)
    for energy in (-13.6, -3.4, 0):
        f.line(58,Y(energy),66,Y(energy),'ax')
        f.text(52,Y(energy)+5,str(energy),'t m','end',14)
    for n in range(1,7):
        y=Y(-13.6/n**2)
        f.line(86,y,260,y,'ln')
        if n<=2:
            f.text(100 if n==2 else 274,y+25 if n==2 else y+5,f'n = {n}','t b',size=16)
    f.line(86,Y(0),260,Y(0),'ln m dash')
    f.text(274,55,'ionization limit','t m',size=14)
    # Upper energies remain correctly spaced; leaders move only their labels.
    for n,ty in ((6,83),(5,113),(4,143),(3,173)):
        y=Y(-13.6/n**2)
        f.path(f'M260,{y:.2f} L{275+(6-n)*6},{y:.2f} L316,{ty-5}', 'ln r')
        f.text(324,ty,f'n = {n}: {-13.6/n**2:.3f} eV','t',size=14)
    wavelengths=[]
    for k,n in enumerate((3,4,5,6)):
        nm=1/(1.0968e7*(1/4-1/n**2))*1e9
        x=111+k*36;col=wl_color(nm)
        f.add(f'<line x1="{x}" y1="{Y(-13.6/n**2):.2f}" x2="{x}" y2="{Y(-3.4)-4:.2f}" stroke="{col}" stroke-width="3" marker-end="url(#ah-ink)"/>')
        wavelengths.append((n,nm,col))
    f.lines(97,235,['All four arrows end at n = 2.', 'Arrow height represents an energy difference,', 'not the distance travelled by an electron.'],'t',size=15,lh=1.5)
    f.text(150,417,'Upper levels crowd near 0 eV on this linear scale.','t m','middle',13)
    # A directly labelled wavelength ruler is separate from the level diagram.
    x0,x1,yy=545,954,270
    X=lambda nm:x0+(nm-380)/330*(x1-x0)
    f.rect(x0,yy,x1-x0,42,'fill-ink',3)
    for n,nm,col in wavelengths:
        f.rect(X(nm)-2,yy+2,4,38,'',0,f'fill="{col}"')
    for nm in (400,500,600,700):
        f.line(X(nm),yy+43,X(nm),yy+49,'ax')
        f.text(X(nm),yy+70,str(nm),'t m','middle',14)
    f.text(750,yy+98,'Wavelength / nm','t m','middle',15)
    for k,(n,nm,col) in enumerate(wavelengths):
        y=77+k*38
        f.circle(551,y-5,5,'',f'fill="{col}" stroke="var(--ink)" stroke-width=".5"')
        f.text(570,y,f'n = {n} → 2','t b',size=16)
        f.text(915,y,f'≈ {nm:.0f} nm','t','end',16)
    f.text(750,415,'Shorter wavelength corresponds to a larger energy drop.','t m','middle',13)
    return f.svg()


@figure
def i_molezoom():
    f = Fig(1000, 320, 'Nine illustrated size references from a spoonful to a water molecule. Each arrow states its own magnification factor; the steps are not equal. The icons are enlarged separately, not drawn to one scale.', wide=True)
    f.text(20, 26, 'From a spoonful to a molecule', 't b', 'start', 17)
    f.text(20, 51, 'About 18 g of water is about 1 mol: 6.02 × 10²³ molecules.', 't', 'start', 14)
    steps = [('spoonful', '4 cm', .04), ('raindrop', '2 mm', .002), ('salt grain', '0.3 mm', .0003),
             ('hair width', '0.08 mm', .00008), ('blood cell', '7 µm', 7e-6), ('bacterium', '1 µm', 1e-6),
             ('virus', '100 nm', 1e-7), ('DNA width', '2 nm', 2e-9), ('water molecule', '0.3 nm', 3e-10)]
    for i, (name, size, length) in enumerate(steps):
        x, y = 53 + i * 111, 153
        f.circle(x, y, 38, 'plate')
        if i == 0:
            f.add(f'<ellipse cx="{x-9}" cy="{y-3}" rx="14" ry="21" class="water"/>')
            f.path(f'M{x+2},{y+12} l18,19', 'ln', 'stroke-width="6"')
        elif i == 1:
            f.path(f'M{x},{y-24} C{x-5},{y-9} {x-24},{y+5} {x-18},{y+16} C{x-11},{y+33} {x+19},{y+27} {x+20},{y+10} C{x+20},{y-1} {x+4},{y-16} {x},{y-24} Z', 'water')
        elif i == 2:
            f.path(f'M{x-22},{y-12} l28,-10 18,13 -28,11 Z M{x-22},{y-12} v29 l28,13 v-28 M{x+24},{y-9} v28 l-18,11', 'ln')
        elif i == 3:
            f.path(f'M{x-31},{y+12} Q{x},{y-2} {x+31},{y-12}', 'ln', 'stroke-width="12"')
            f.path(f'M{x-31},{y+9} Q{x},{y-5} {x+31},{y-15}', 'ln m')
        elif i == 4:
            f.add(f'<ellipse cx="{x}" cy="{y}" rx="28" ry="21" class="wash-p"/>')
            f.add(f'<ellipse cx="{x}" cy="{y}" rx="28" ry="21" class="ln p"/>')
            f.add(f'<ellipse cx="{x}" cy="{y}" rx="12" ry="8" class="ln p"/>')
        elif i == 5:
            f.rect(x-27,y-13,54,26,'wash-g',13); f.rect(x-27,y-13,54,26,'ln g',13)
            f.path(f'M{x+27},{y} q12,-20 13,-2 t-1,20', 'ln g')
        elif i == 6:
            f.circle(x,y,21,'wash-e'); f.circle(x,y,21,'ln e')
            for k in range(10):
                a=k*math.tau/10
                f.line(x+22*math.cos(a),y+22*math.sin(a),x+29*math.cos(a),y+29*math.sin(a),'ln e')
                f.circle(x+30*math.cos(a),y+30*math.sin(a),2.5,'fill-vol')
        elif i == 7:
            for side in (-1,1):
                pts=[(x+side*17*math.sin(k*.55),y-29+k*5.8) for k in range(11)]
                f.path('M'+' L'.join(f'{px:.1f},{py:.1f}' for px,py in pts),'ln e' if side<0 else 'ln p')
            for k in range(11):
                dy=-29+k*5.8; dx=17*math.sin(k*.55)
                f.line(x-dx,y+dy,x+dx,y+dy,'ln r')
        else:
            f.molecule('H2O',x,y-5,1.05)
        f.text(x,218,name,'t b','middle',12.5)
        f.text(x,240,'≈ '+size,'t m','middle',13)
        if i < len(steps)-1:
            factor=length/steps[i+1][2]
            f.arrow(x+41,y,x+69,y,'muted',1.2)
            f.text(x+55,112,f'×{factor:.1f}'.replace('.0',''),'t v b','middle',12)
    f.text(500,282,'Read each arrow as a change of size reference, not a process turning one object into another.', 't m', 'middle', 13)
    f.text(500,306,'Icons are separately enlarged. Actual reference sizes and successive magnifications are written below and above them.', 't m', 'middle', 12)
    return f.svg()
