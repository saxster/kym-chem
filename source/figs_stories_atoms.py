"""Figures for the 'Inside the atom' stories."""
from figs_core import Fig, figure


def wl_color(nm):
    """Approximate visible colour for a wavelength in nm."""
    if nm < 440: r, g, b = -(nm - 440) / 60, 0.0, 1.0
    elif nm < 490: r, g, b = 0.0, (nm - 440) / 50, 1.0
    elif nm < 510: r, g, b = 0.0, 1.0, -(nm - 510) / 20
    elif nm < 580: r, g, b = (nm - 510) / 70, 1.0, 0.0
    elif nm < 645: r, g, b = 1.0, -(nm - 645) / 65, 0.0
    else: r, g, b = 1.0, 0.0, 0.0
    return '#%02x%02x%02x' % tuple(int(255 * max(0, min(1, v))) for v in (r, g, b))


LINES = [
    ('hydrogen', [410.2, 434.0, 486.1, 656.3]),
    ('sodium', [589.0, 589.6]),
    ('helium', [447.1, 471.3, 492.2, 501.6, 587.6, 667.8, 706.5]),
]


@figure
def s_spectra():
    f = Fig(640, 250, 'Bright-line spectra of hydrogen, sodium and helium: each element gives its own pattern of coloured lines.')
    x0, x1 = 120, 620
    def X(nm): return x0 + (nm - 400) / 320 * (x1 - x0)
    for i, (name, lines) in enumerate(LINES):
        y = 30 + i * 62
        f.rect(x0, y, x1 - x0, 38, 'fill-ink', 3)
        for nm in lines:
            f.rect(X(nm) - 1.6, y + 2, 3.2, 34, '', 0, f'fill="{wl_color(nm)}"')
        f.text(x0 - 12, y + 24, name, 't b', 'end', 13.5)
    for nm in (400, 450, 500, 550, 600, 650, 700):
        f.line(X(nm), 218, X(nm), 224, 'ax')
        f.text(X(nm), 240, str(nm), 't m', 'middle', 11.5)
    f.text(x1, 240, 'nm', 't m', 'start', 11.5)
    return f.svg()


@figure
def s_halflife():
    f = Fig(640, 250, 'Half-life of carbon-14: every 5,730 years half of what is left decays. The bars halve: 100%, 50%, 25%, 12.5%, 6.25%.')
    x0, y0, h = 70, 200, 160
    vals = [100, 50, 25, 12.5, 6.25, 3.125]
    for i, v in enumerate(vals):
        x = x0 + i * 92
        f.rect(x, y0 - h * v / 100, 56, h * v / 100, 'fill-vol', 3)
        f.text(x + 28, y0 - h * v / 100 - 8, f'{v:g}%', 't b', 'middle', 13)
        f.text(x + 28, y0 + 20, f'{i * 5730:,}', 't m', 'middle', 12)
    f.line(x0 - 10, y0, x0 + 5 * 92 + 70, y0, 'ax')
    f.text(x0 - 10, y0 + 40, 'years after the plant or animal died', 't m', 'start', 12)
    f.text(x0 - 10, 22, 'carbon-14 left', 't m', 'start', 12)
    return f.svg()
