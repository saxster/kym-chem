// HCl + H2O -> Cl⁻ + H3O⁺, slowly. The hydrogen nucleus (a bare proton) moves to the water's oxygen;
// the two bonding electrons stay behind on the chlorine. Charges are counted before and after.
import { Live } from './core.js';

Live.register('protontransfer', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 270;
  const k = api.canvas(W, H, 'Animation: a hydrogen chloride molecule meets a water molecule. The proton moves to the oxygen, the bonding electron pair stays on the chlorine, making a chloride ion and a hydronium ion.');
  const ctx = k.ctx;
  const say = api.readout();
  const CYCLE = 9;
  let t = 0;
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : (1 - Math.cos(Math.PI * x)) / 2);
  api.button('Start again', () => { t = 0; });

  function pairDots(x, y, ang, col) {
    const ox = Math.cos(ang + Math.PI / 2) * 3.6, oy = Math.sin(ang + Math.PI / 2) * 3.6;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(x + ox * s, y + oy * s, 2.6, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); }
  }

  function render() {
    k.clear();
    const tt = t % CYCLE;
    const approach = ease(tt / 2);            // 0-2 s: molecules approach
    const hop = ease((tt - 2.4) / 1.8);       // 2.4-4.2 s: proton hops
    const apart = ease((tt - 5) / 1.6);       // 5-6.6 s: ions drift apart
    const showCharges = tt > 4.2;
    const clx = 150 + approach * 70 - apart * 50, cly = 140;
    const ox = 470 - approach * 70 + apart * 50, oy = 140;
    // water's two hydrogens
    const wH = [[ox + 22, oy + 24], [ox + 22, oy - 24]];
    // the transferring proton: from bonded to Cl (to its right) to bonded to O (to its left)
    const pStart = [clx + 40, cly], pEnd = [ox - 30, oy];
    const px = pStart[0] + (pEnd[0] - pStart[0]) * hop, py = pStart[1] - Math.sin(Math.PI * hop) * 36;
    // bonds
    if (hop < 0.5) api.draw.bond(ctx, clx, cly, px, py, 1, c, 3);
    if (hop > 0.5) api.draw.bond(ctx, ox, oy, px, py, 1, c, 3);
    for (const [hx, hy] of wH) api.draw.bond(ctx, ox, oy, hx, hy, 1, c, 3);
    // bonding pair: sits on the H–Cl bond, then stays with Cl
    const pairX = clx + 22 - hop * 6, pairY = cly;
    pairDots(pairX, pairY, 0, c.electron);
    // a lone pair on the oxygen becomes the new O–H bond
    const lpX = ox - 18 + hop * -2, lpY = oy;
    if (hop < 1) { ctx.globalAlpha = 1 - hop * 0.6; pairDots(lpX, lpY, 0, c.electron); ctx.globalAlpha = 1; }
    api.draw.atom(ctx, clx, cly, 24, 'Cl', showCharges ? { charge: '−', c } : {});
    api.draw.atom(ctx, ox, oy, 20, 'O', showCharges ? { charge: '+', c } : {});
    for (const [hx, hy] of wH) api.draw.atom(ctx, hx, hy, 11, 'H');
    // the proton: small, marked +
    ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fillStyle = c.proton; ctx.fill();
    api.draw.text(ctx, '+', px, py + 1, { size: 13, color: '#fff', align: 'center', weight: 700, base: 'middle' });
    if (hop > 0.05 && hop < 0.95) api.draw.text(ctx, 'H⁺, a bare proton', px, py - 18, { size: 12, color: c.proton, align: 'center', weight: 600 });
    // labels
    const before = tt < 3.3;
    api.draw.text(ctx, before ? 'HCl' : 'Cl⁻', clx, 220, { size: 17, color: c.ink, align: 'center', serif: true });
    api.draw.text(ctx, before ? 'H₂O' : 'H₃O⁺', ox, 220, { size: 17, color: c.ink, align: 'center', serif: true });
    api.draw.text(ctx, before ? 'charge 0' : 'charge −1', clx, 242, { size: 12, color: c.muted, align: 'center' });
    api.draw.text(ctx, before ? 'charge 0' : 'charge +1', ox, 242, { size: 12, color: c.muted, align: 'center' });
    api.draw.text(ctx, '● ● electron pair', 20, 26, { size: 12, color: c.electron });
    api.draw.text(ctx, before ? 'total charge: 0 + 0 = 0' : 'total charge: (−1) + (+1) = 0', W - 20, 26, { size: 13, color: c.ink, align: 'right', weight: 600 });
    say(before
      ? 'Hydrogen chloride meets a water molecule. The H–Cl bond is a shared pair of electrons (blue dots). The oxygen has a spare pair of its own.'
      : 'Only the hydrogen <b>nucleus</b>, a single proton, has moved. The electrons that held it stayed on the chlorine, so it now has one more electron than protons: Cl⁻. The water used its spare pair to hold the proton: H₃O⁺. Every atom and every charge is accounted for: the total is still 0.');
  }
  api.loop((dt) => { t += dt * 0.8; render(); });
  return {};
}, { label: 'Watch the proton move' });
