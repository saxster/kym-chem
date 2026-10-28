// Daniell cell: electrons flow through the wire from zinc to copper and light the bulb.
// Every two electrons that leave the zinc make one Zn2+ ion; every two that arrive at the copper turn one Cu2+
// ion into a copper atom on the electrode. In the salt bridge, nitrate ions drift towards the zinc side and
// potassium ions towards the copper side. Remove the bridge and the circuit is open: the flow stops.
import { Live } from './core.js';

const lerp = (a, b, t) => a + (b - a) * t;
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

Live.register('daniell', (stage, params, api) => {
  const c = api.colors();
  const W = 1000, H = 440;
  const k = api.canvas(W, H, 'Animated Daniell cell. Electrons flow through the wire from the zinc to the copper and the bulb glows. Zinc ions enter the left solution, copper atoms form on the right electrode, and ions drift through the salt bridge. Removing the salt bridge stops the flow.');
  const ctx = k.ctx;
  const say = api.readout();
  const ze = 110, ce = 880;                         // electrode left edges
  const wire = [[ze + 13, 120], [ze + 13, 50], [478, 50], [522, 50], [ce + 13, 50], [ce + 13, 120]];
  const segLen = []; let total = 0;
  for (let i = 1; i < wire.length; i++) { const l = Math.hypot(wire[i][0] - wire[i - 1][0], wire[i][1] - wire[i - 1][1]); segLen.push(l); total += l; }
  const at = (d) => {
    d = ((d % total) + total) % total;
    for (let i = 0; i < segLen.length; i++) {
      if (d <= segLen[i]) { const q = d / segLen[i]; return [lerp(wire[i][0], wire[i + 1][0], q), lerp(wire[i][1], wire[i + 1][1], q)]; }
      d -= segLen[i];
    }
    return wire[wire.length - 1];
  };
  // U-shaped salt bridge path (centre line), from the zinc side to the copper side
  const bridge = [[250, 330], [250, 150], [275, 125], [725, 125], [750, 150], [750, 330]];
  const bLen = []; let bTot = 0;
  for (let i = 1; i < bridge.length; i++) { const l = Math.hypot(bridge[i][0] - bridge[i - 1][0], bridge[i][1] - bridge[i - 1][1]); bLen.push(l); bTot += l; }
  const bAt = (d) => {
    d = ((d % bTot) + bTot) % bTot;
    for (let i = 0; i < bLen.length; i++) {
      if (d <= bLen[i]) { const q = d / bLen[i]; return [lerp(bridge[i][0], bridge[i + 1][0], q), lerp(bridge[i][1], bridge[i + 1][1], q)]; }
      d -= bLen[i];
    }
    return bridge[bridge.length - 1];
  };

  const NE = 16;                       // electrons drawn in the wire (always the same number: the wire never fills or empties)
  const START_CU = 8;
  let flowing = true, bridgeIn = true, moved, passed, zn, cu, deposits, glow, t, offs, trickle = 0, imbalance = 0, shown = 0;

  function setup() {
    const r = api.rng(3);
    moved = 0; passed = 0; glow = 0; t = 0; trickle = 0; imbalance = 0; shown = 0;
    zn = [[170, 270], [205, 340], [160, 372], [225, 300]].map(([x, y]) => ({ bx: x, by: y, ph: r() * 6.28, born: -10 }));
    cu = [[800, 262], [840, 330], [790, 372], [785, 305], [845, 250], [820, 360], [815, 225], [855, 295]].map(([x, y]) => ({ bx: x, by: y, ph: r() * 6.28, state: 'free' }));
    deposits = 0;
    offs = Array.from({ length: 12 }, (_, i) => ({ d: i / 12 * bTot, kind: i % 2 ? 'K' : 'N' }));
    flowing = bridgeIn && cu.some((x) => x.state === 'free');
  }
  // Without a bridge, the first electrons to cross leave the zinc side positive and the copper side negative.
  // We let a tiny trickle (two electrons, one Zn2+) through to show where the build-up comes from, then the push-back stops it.

  const speed = 70;                    // px per second along the wire
  function step(dt) {
    const free = cu.some((x) => x.state === 'free');
    flowing = free && (bridgeIn || trickle > 0);
    glow += ((flowing && bridgeIn ? 1 : 0) - glow) * Math.min(1, dt * 3);
    if (bridgeIn) imbalance = Math.max(0, imbalance - dt * 1.5);   // bridge ions cancel any build-up
    shown += (imbalance - shown) * Math.min(1, dt * 4);
    if (!flowing) return;
    const before = Math.floor(moved / (total / NE));
    moved += speed * dt;
    const after = Math.floor(moved / (total / NE));
    for (let i = before; i < after; i++) {
      passed++;                         // one electron left the zinc and, at the same moment, one reached the copper
      if (!bridgeIn) { trickle = Math.max(0, trickle - 1); imbalance += 1; }
      if (passed % 2 === 0) {
        zn.push({ bx: 152 + ((passed * 37) % 70), by: 245 + ((passed * 53) % 135), ph: passed, born: t, sx: ze + 30, sy: 220 + ((passed * 29) % 140) });
        const ion = cu.filter((x) => x.state === 'free').sort((a, b) => b.bx - a.bx)[0];
        if (ion) { ion.state = 'plating'; ion.t0 = t; ion.sx = ion.bx; ion.sy = ion.by; ion.ty = 228 + deposits * 20; deposits++; }
      }
    }
    if (bridgeIn) for (const o of offs) o.d += (o.kind === 'N' ? -1 : 1) * 14 * dt;   // NO3- towards zinc, K+ towards copper
  }

  function render() {
    k.clear();
    // beakers
    for (const bx of [60, 690]) {
      ctx.fillStyle = bx < 500 ? 'rgba(53,109,131,0.07)' : `rgba(53,109,131,${(0.06 + 0.16 * cu.filter((x) => x.state === 'free').length / START_CU).toFixed(3)})`;
      ctx.fillRect(bx + 2, 215, 246, 178);
      ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(bx, 170); ctx.lineTo(bx, 380); ctx.quadraticCurveTo(bx, 395, bx + 15, 395); ctx.lineTo(bx + 235, 395);
      ctx.quadraticCurveTo(bx + 250, 395, bx + 250, 380); ctx.lineTo(bx + 250, 170); ctx.stroke();
    }
    // salt bridge
    if (bridgeIn) {
      ctx.strokeStyle = c.rule; ctx.lineWidth = 30; ctx.lineJoin = 'round';
      ctx.beginPath(); bridge.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      for (const o of offs) {
        const [x, y] = bAt(o.d);
        if (o.kind === 'N') { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fillStyle = c.electron; ctx.fill(); api.draw.text(ctx, '−', x, y + 3.5, { size: 10, color: '#fff', align: 'center', weight: 700 }); }
        else { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fillStyle = c.proton; ctx.fill(); api.draw.text(ctx, '+', x, y + 3.5, { size: 10, color: '#fff', align: 'center', weight: 700 }); }
      }
      api.draw.text(ctx, 'salt bridge: NO₃⁻ (−) drift to the zinc side, K⁺ (+) to the copper side', 500, 165, { size: 12, color: c.muted, align: 'center' });
    } else {
      api.draw.text(ctx, 'salt bridge removed', 500, 165, { size: 12.5, color: c.proton, align: 'center', weight: 600 });
    }
    // charge build-up when there is no bridge: extra + on the zinc side, extra − on the copper side
    if (shown > 0.05) {
      const n = Math.max(1, Math.min(6, Math.round(shown)));
      ctx.globalAlpha = Math.min(1, shown);
      api.draw.text(ctx, '+ '.repeat(n) + ' extra positive charge', 226, 190, { size: 13, color: c.proton, align: 'center', weight: 700 });
      api.draw.text(ctx, '− '.repeat(n) + ' extra negative charge', 784, 190, { size: 13, color: c.electron, align: 'center', weight: 700 });
      ctx.globalAlpha = 1;
    }
    // electrodes
    ctx.fillStyle = c.sheet; ctx.strokeStyle = c.ink; ctx.lineWidth = 1.4;
    ctx.fillRect(ze, 120, 26, 240); ctx.strokeRect(ze, 120, 26, 240);
    ctx.fillRect(ce, 120, 26, 240); ctx.strokeRect(ce, 120, 26, 240);
    api.draw.text(ctx, 'zinc', ze - 8, 150, { size: 14, weight: 600, align: 'right', color: c.ink });
    api.draw.text(ctx, 'copper', ce + 34, 150, { size: 14, weight: 600, color: c.ink });
    // copper atoms deposited on the copper electrode (left face)
    for (let i = 0; i < deposits; i++) {
      const ion = cu.find((x) => x.state === 'plated' && x.slot === i);
      if (ion) api.draw.atom(ctx, ce - 8, 228 + i * 20, 10, 'Cu');
    }
    // wire and bulb
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(...wire[0]); ctx.lineTo(...wire[1]); ctx.lineTo(...wire[2]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...wire[3]); ctx.lineTo(...wire[4]); ctx.lineTo(...wire[5]); ctx.stroke();
    if (glow > 0.02) {
      const g = ctx.createRadialGradient(500, 50, 4, 500, 50, 60);
      g.addColorStop(0, `rgba(241,217,120,${(0.9 * glow).toFixed(2)})`); g.addColorStop(1, 'rgba(241,217,120,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(500, 50, 60, 0, 7); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(500, 50, 22, 0, 7); ctx.fillStyle = glow > 0.5 ? '#f6e7a6' : c.plate; ctx.fill(); ctx.strokeStyle = c.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(486, 58); ctx.quadraticCurveTo(493, 34, 500, 52); ctx.quadraticCurveTo(507, 34, 514, 58); ctx.strokeStyle = c.muted; ctx.lineWidth = 1.2; ctx.stroke();
    api.draw.text(ctx, glow > 0.5 ? 'bulb lit' : 'bulb off', 500, 92, { size: 12, color: c.muted, align: 'center' });
    // electrons on the wire: evenly spaced, moving zinc -> copper
    for (let i = 0; i < NE; i++) {
      const d = moved + i * total / NE;
      const [x, y] = at(d);
      if (Math.abs(x - 500) < 24 && y < 60) continue;   // hidden inside the bulb
      api.draw.particle(ctx, x, y, 5.5, 'e', c);
    }
    // ions in the solutions
    for (const z of zn) {
      let x = z.bx + 8 * Math.sin(t * 0.7 + z.ph), y = z.by + 6 * Math.cos(t * 0.6 + z.ph);
      if (z.sx != null) { const q = ease((t - z.born) / 1.5); x = lerp(z.sx, x, q); y = lerp(z.sy, y, q); }
      api.draw.atom(ctx, x, y, 13, 'Zn', { charge: '2+', c });
    }
    for (const ion of cu) {
      if (ion.state === 'plated') continue;
      let x = ion.bx + 8 * Math.sin(t * 0.7 + ion.ph), y = ion.by + 6 * Math.cos(t * 0.6 + ion.ph);
      if (ion.state === 'plating') {
        const q = ease((t - ion.t0) / 1.4);
        x = lerp(ion.sx, ce - 8, q); y = lerp(ion.sy, ion.ty, q);
        if (q >= 1) { ion.state = 'plated'; ion.slot = Math.round((ion.ty - 228) / 20); continue; }
      }
      api.draw.atom(ctx, x, y, 13, 'Cu', { charge: '2+', c });
    }
    api.draw.text(ctx, 'Zn → Zn²⁺ + 2e⁻', 170, 208, { size: 13, color: c.ink, align: 'center', serif: true });
    api.draw.text(ctx, 'Cu²⁺ + 2e⁻ → Cu', 822, 208, { size: 13, color: c.ink, align: 'center', serif: true });
    const formed = zn.length - 4, plated = deposits;
    api.draw.text(ctx, `electrons out of the zinc: ${passed}   =   electrons into the copper: ${passed}`, 500, 415, { size: 13, color: c.electron, align: 'center', weight: 600 });
    api.draw.text(ctx, `Zn²⁺ made: ${formed}`, 185, 425, { size: 12.5, color: c.ink, align: 'center' });
    api.draw.text(ctx, `Cu atoms made: ${plated}`, 815, 425, { size: 12.5, color: c.ink, align: 'center' });
    const left = cu.filter((x) => x.state === 'free').length;
    if (!bridgeIn) say(`With no salt bridge the circuit is open. A tiny trickle of electrons gets through (shown here as ${imbalance > 0 ? Math.round(imbalance) : 'a couple'}; in reality far too few to light anything), and it leaves the zinc side with extra positive charge and the copper side with extra negative charge. That build-up pushes back on any more electrons, so the current stops. Put the bridge back and its ions cancel the build-up.`);
    else if (!left && !cu.some((x) => x.state === 'plating')) say(`The drawn copper ions are all used up, so the reaction stops: the cell is flat. ${passed} electrons passed, making ${formed} Zn²⁺ and ${plated} copper atoms, two electrons each.`);
    else say(`Every two electrons that leave the zinc make one Zn²⁺; every two that reach the copper turn one Cu²⁺ into a copper atom. So far: ${passed} electrons, ${formed} Zn²⁺, ${plated} Cu${passed % 2 ? ' (one electron is on its way, half of the next pair)' : ''}. Ions in the salt bridge keep both solutions electrically balanced.`);
  }

  setup();
  api.button('Remove the salt bridge', (b) => {
    bridgeIn = !bridgeIn;
    trickle = bridgeIn ? 0 : 2;
    b.textContent = bridgeIn ? 'Remove the salt bridge' : 'Put the salt bridge back';
    b.setAttribute('aria-pressed', String(!bridgeIn));
  }, { pressed: false });
  api.button('Replay', () => { setup(); render(); });
  api.loop((dt) => { if (dt) { t += dt; step(dt); } render(); });
  api.account(() => ({passed}));
  return {};
}, { label: 'Watch the current flow' });
