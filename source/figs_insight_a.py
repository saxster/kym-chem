"""Insight figures, set A: the still versions of the orbitals, bond-well and salt-staircase live figures."""
import math, random
from figs_core import Fig, figure, FIGS


def _cloud(f, cx, cy, scale, dens, box, n, seed, cls):
    """Scatter dots by rejection sampling a 2D slice (z = 0) of a hydrogen-like |psi|^2."""
    rnd = random.Random(seed)
    mx = max(dens(rnd.uniform(-box, box), rnd.uniform(-box, box)) for _ in range(4000)) or 1
    k = 0
    tries = 0
    while k < n and tries < n * 400:
        tries += 1
        x, y = rnd.uniform(-box, box), rnd.uniform(-box, box)
        if rnd.random() * mx * 1.05 < dens(x, y):
            f.circle(cx + x * scale, cy - y * scale, 1.15, cls)
            k += 1


@figure
def i_orbitals():
    f = Fig(640, 300, 'Left: the shell picture, electrons as dots on two circles. Right: what electrons really do, shown as clouds of likely positions: a small round 1s cloud, a wider round 2s cloud with a hollow ring inside, and a 2p cloud shaped like a dumbbell.')
    # the shell picture
    cx, cy = 110, 140
    f.circle(cx, cy, 34, 'ln m thin'); f.circle(cx, cy, 78, 'ln m thin')
    f.nucleon(cx, cy, 'p', 9, sign=False)
    for i in range(2):
        a = i * math.pi + 0.4
        f.nucleon(cx + 34 * math.cos(a), cy + 34 * math.sin(a), 'e', 6)
    for i in range(8):
        a = i * math.pi / 4 + 0.2
        f.nucleon(cx + 78 * math.cos(a), cy + 78 * math.sin(a), 'e', 6)
    f.text(cx, 254, 'shells, as usually drawn', 't b', 'middle', 13)
    f.text(cx, 272, 'good for counting', 't m', 'middle', 12.5)
    # clouds (2D slices through the middle)
    def d1s(x, y): r = math.hypot(x, y); return math.exp(-2 * r)
    def d2s(x, y): r = math.hypot(x, y); v = (2 - r) * math.exp(-r / 2); return v * v
    def d2p(x, y): r = math.hypot(x, y); v = x * math.exp(-r / 2); return v * v
    _cloud(f, 280, 140, 22, d1s, 3.0, 380, 1, 'pt-e')
    f.text(280, 254, '1s', 't b', 'middle', 13)
    _cloud(f, 410, 140, 8.2, d2s, 11, 700, 2, 'pt-e')
    f.text(410, 254, '2s (note the hollow ring)', 't b', 'middle', 13)
    _cloud(f, 560, 140, 8.2, d2p, 10, 700, 3, 'pt-e')
    f.text(560, 254, '2p (one of three)', 't b', 'middle', 13)
    for x in (280, 410, 560):
        f.circle(x, 140, 3.5, 'pt-p')
    f.text(420, 280, 'what electrons really do: clouds of likely positions, at most 2 electrons each', 't m', 'middle', 12.5)
    return f.svg()


@figure
def i_bondwell():
    """Same drawing as Figure c2_bond_energy, for use in stories."""
    return FIGS['c2_bond_energy']()


@figure
def i_saltsteps():
    """Same drawing as Figure c2_salt_energy, for use in stories."""
    return FIGS['c2_salt_energy']()
