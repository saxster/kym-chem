// Lithium-ion cell. Discharge: Li+ ions leave the graphite layers, cross the electrolyte and slip into the
// metal-oxide layers, while one electron per ion goes the long way round through the phone.
// Charge: the charger pushes both back. Lithium is conserved: graphite + electrolyte + oxide is always 8.
import { Live } from './core.js';

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a, b, t) => a + (b - a) * t;

Live.register('licell', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 360;
  const k = api.canvas(W, H, 'Schematic lithium-ion host transfer. Selected lithium-ion markers move between graphite and oxide while compensating electrons use the external circuit. The step meter and complete marker transfer are teaching choices, not calibrated state of charge or complete extraction in a real cell.');
  const ctx = k.ctx;
  const say = api.readout();
  const NLI = 8;
  // sites between layers
  const gSites = [], oSites = [];
  for (let r = 0; r < 4; r++) for (let j = 0; j < 2; j++) {
    gSites.push([95 + j * 90 + (r % 2) * 40, 137 + r * 32]);
    oSites.push([420 + j * 90 + (r % 2) * 40, 137 + r * 32]);
  }
  let mode = 0;              // 0 discharge, 1 charge
  let li, moves, t, nextAt;
  function setup(full = true) {
    li = gSites.map((p, i) => ({ side: full ? 'g' : 'o', slot: i, x: 0, y: 0 }));
    if (!full) li.forEach((l, i) => { l.slot = i; });
    moves = []; t = 0; nextAt = 0.6;
  }
  const where = (l) => (l.side === 'g' ? gSites[l.slot] : oSites[l.slot]);
  function startMove() {
    const from = mode === 0 ? 'g' : 'o', to = mode === 0 ? 'o' : 'g';
    const cand = li.filter((l) => l.side === from && !l.moving);
    if (!cand.length) return false;
    const used = new Set(li.filter((l) => l.side === to || (l.moving && l.to === to)).map((l) => (l.moving && l.to === to ? l.toSlot : l.slot)));
    const free = [...Array(NLI).keys()].filter((s) => !used.has(s));
    const l = from === 'g' ? cand.sort((a, b) => gSites[b.slot][0] - gSites[a.slot][0])[0] : cand.sort((a, b) => oSites[a.slot][0] - oSites[b.slot][0])[0];
    const toSlot = to === 'o' ? free.sort((a, b) => oSites[a][0] - oSites[b][0])[0] : free.sort((a, b) => gSites[b][0] - gSites[a][0])[0];
    const [sx, sy] = where(l);
    l.moving = true; l.to = to; l.toSlot = toSlot;
    const [tx, ty] = to === 'o' ? oSites[toSlot] : gSites[toSlot];
    moves.push({ l, t0: t, sx, sy, tx, ty, to, toSlot, dir: mode });
    return true;
  }
  const DUR = 2.4;
  function update() {
    for (const m of moves) {
      const q = (t - m.t0) / DUR;
      if (q >= 1 && m.l.moving) { m.l.moving = false; m.l.side = m.to; m.l.slot = m.toSlot; }
    }
    moves = moves.filter((m) => t - m.t0 < DUR + 0.01 || m.l.moving);
  }

  function render() {
    k.clear();
    // outside circuit
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(110, 96); ctx.lineTo(110, 40); ctx.lineTo(270, 40); ctx.moveTo(370, 40); ctx.lineTo(530, 40); ctx.lineTo(530, 96); ctx.stroke();
    ctx.fillStyle = c.sheet; api.draw.roundRect(ctx, 270, 22, 100, 36, 6); ctx.fill(); ctx.stroke();
    api.draw.text(ctx, mode === 0 ? 'phone' : 'charger', 320, 45, { size: 13, weight: 600, color: c.ink, align: 'center' });
    // cell body
    ctx.fillStyle = c.plate; api.draw.roundRect(ctx, 40, 96, 560, 210, 8); ctx.fill(); ctx.strokeStyle = c.rule; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(53,109,131,0.12)'; ctx.fillRect(300, 100, 40, 202);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = c.muted; ctx.beginPath(); ctx.moveTo(320, 100); ctx.lineTo(320, 302); ctx.stroke(); ctx.setLineDash([]);
    api.draw.text(ctx, 'separator', 320, 88, { size: 11.5, color: c.muted, align: 'center' });
    for (let r = 0; r < 5; r++) {
      const y = 118 + r * 32;
      ctx.fillStyle = c.ink; ctx.fillRect(60, y, 200, 6);
      ctx.fillStyle = c.rule; ctx.fillRect(380, y, 200, 6);
      ctx.fillStyle = c.ink; for (let j = 0; j < 6; j++) { ctx.beginPath(); ctx.arc(392 + j * 35, y + 3, 4, 0, 7); ctx.fill(); }
    }
    // lithium ions
    const drawLi = (x, y) => {
      ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = c.proton; ctx.fill();
      ctx.strokeStyle = c.sheet; ctx.lineWidth = 1; ctx.stroke();
      api.draw.text(ctx, 'Li', x, y + 3.2, { size: 8.5, color: '#fff', align: 'center', weight: 700 });
      api.draw.text(ctx, '+', x + 8, y - 5, { size: 10, color: c.proton, weight: 700 });
    };
    for (const l of li) if (!l.moving) { const [x, y] = where(l); drawLi(x, y); }
    for (const m of moves) {
      if (!m.l.moving) continue;
      const q = ease((t - m.t0) / DUR);
      // through the electrolyte: dip down to cross low, through the separator
      const midY = 268;
      let x, y;
      if (q < 0.3) { const u = q / 0.3; x = lerp(m.sx, m.dir === 0 ? 270 : 370, u); y = lerp(m.sy, midY, u); }
      else if (q < 0.7) { const u = (q - 0.3) / 0.4; x = lerp(m.dir === 0 ? 270 : 370, m.dir === 0 ? 370 : 270, u); y = midY; }
      else { const u = (q - 0.7) / 0.3; x = lerp(m.dir === 0 ? 370 : 270, m.tx, u); y = lerp(midY, m.ty, u); }
      drawLi(x, y);
      // a compensating electron marker uses the external path; no unique electron identity is inferred
      const path = m.dir === 0 ? [[110, 96], [110, 40], [530, 40], [530, 96]] : [[530, 96], [530, 40], [110, 40], [110, 96]];
      const lens = [56, 420, 56], tot = 532;
      let d = q * tot, i = 0;
      while (i < 2 && d > lens[i]) { d -= lens[i]; i++; }
      const u = Math.min(1, d / lens[i]);
      const ex = lerp(path[i][0], path[i + 1][0], u), ey = lerp(path[i][1], path[i + 1][1], u);
      if (!(ex > 268 && ex < 372 && ey < 60)) api.draw.particle(ctx, ex, ey, 5.5, 'e', c);
    }
    // labels and counts
    const nG = li.filter((l) => l.side === 'g' && !l.moving).length;
    const nO = li.filter((l) => l.side === 'o' && !l.moving).length;
    const nE = li.filter((l) => l.moving).length;
    api.draw.text(ctx, `graphite: ${nG} Li⁺`, 160, 326, { size: 13, weight: 600, color: c.ink, align: 'center' });
    api.draw.text(ctx, `metal oxide: ${nO} Li⁺`, 480, 326, { size: 13, weight: 600, color: c.ink, align: 'center' });
    api.draw.text(ctx, `crossing: ${nE}`, 320, 326, { size: 12, color: c.proton, align: 'center' });
    api.draw.text(ctx, `total lithium: ${nG + nO + nE}`, 320, 346, { size: 12, color: c.muted, align: 'center' });
    // battery level = share of lithium stored in the graphite
    const level = (nG + nE * 0.5) / NLI;
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.4; ctx.strokeRect(560, 18, 50, 22); ctx.fillStyle = c.ink; ctx.fillRect(610, 24, 4, 10);
    ctx.fillStyle = level > 0.25 ? c.green : c.proton; ctx.fillRect(563, 21, 44 * level, 16);
    api.draw.text(ctx, `${Math.round(level * 100)}% steps`, 552, 34, { size: 12, color: c.ink, align: 'right', weight: 600 });
    const arrow = mode === 0 ? [[160, 40], [240, 40], [400, 40], [480, 40]] : [[480, 40], [400, 40], [240, 40], [160, 40]];
    api.draw.arrow(ctx, ...arrow[0], ...arrow[1], c.electron, 1.6);
    api.draw.arrow(ctx, ...arrow[2], ...arrow[3], c.electron, 1.6);
    if (mode === 0) say(nG === 0 && !nE ? 'Selected transfer complete: all eight model markers are in the oxide host. This endpoint is not complete lithium extraction or a calibrated empty real cell. Choose Charge to reverse the teaching steps.' :
      'Discharging. Li⁺ crosses the electrolyte while compensating electrons pass through the phone and reduce the oxide host. Lithium stays ionic; the total model inventory is conserved. The meter tracks selected transfer steps, not measured state of charge.');
    else say(nO === 0 && !nE ? 'Selected return complete: all eight model markers are back in graphite. The host compensates their ionic charge electronically. Complete marker transfer is a schematic choice, not a real-cell operating limit.' :
      'Charging. The charger pushes electrons back to the graphite side, and Li⁺ ions follow through the electrolyte. This direction is uphill: it needs the charger’s energy.');
  }

  setup(true);
  api.tabs(['Discharge (powering a phone)', 'Charge (plugged in)'], (i) => { mode = i; nextAt = t + 0.3; render(); });
  api.loop((dt) => {
    if (dt) {
      t += dt;
      if (t >= nextAt) { startMove(); nextAt = t + 1.3; }
      update();
    }
    render();
  });
  api.account(() => ({g:li.filter(l=>!l.moving&&l.side==='g').length,o:li.filter(l=>!l.moving&&l.side==='o').length,transit:li.filter(l=>l.moving).length}));
  return {};
}, { label: 'Watch it discharge and charge' });
