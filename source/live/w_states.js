// One substance, three states, with one control: heat.
// Twelve water molecules are warmed from ice at -30 °C to steam at 130 °C. A temperature trace on the right
// shows Joseph Black's discovery: while ice melts and while water boils, energy pours in but the temperature
// stays flat. The energy axis is to scale for real water (J per gram), so the boiling plateau really is about
// 6.8 times longer than the melting one. The molecules never change: every frame draws 12 whole H2O molecules,
// the same size in every state, and the space between them is empty.
import { Live } from './core.js';

const C_ICE = 2.09, C_WATER = 4.18, C_STEAM = 2.01, L_FUS = 334, L_VAP = 2257; // J per gram (per K)
const E1 = C_ICE * 30, E2 = E1 + L_FUS, E3 = E2 + C_WATER * 100, E4 = E3 + L_VAP, EMAX = E4 + C_STEAM * 30;

function stateAt(E) {
  if (E <= E1) return { T: -30 + E / C_ICE, fm: 0, fb: 0, phase: 0 };
  if (E <= E2) return { T: 0, fm: (E - E1) / L_FUS, fb: 0, phase: 1 };
  if (E <= E3) return { T: (E - E2) / C_WATER, fm: 1, fb: 0, phase: 2 };
  if (E <= E4) return { T: 100, fm: 1, fb: (E - E3) / L_VAP, phase: 3 };
  return { T: 100 + (E - E4) / C_STEAM, fm: 1, fb: 1, phase: 4 };
}

Live.register('states', (stage, params, api) => {
  const c = api.colors();
  const W = 720, H = 300;
  const k = api.canvas(W, H, 'Animation: twelve water molecules heated from ice to steam, beside a graph of temperature against energy added.');
  const ctx = k.ctx;
  const r = api.rng(9);
  const box = { x: 16, y: 20, w: 384, h: 232 };
  const N = 12, D = 36;
  const HA = 52.25 * Math.PI / 180;
  const sites = [];
  const sx0 = box.x + box.w / 2 - 1.5 * 46, sy0 = box.y + box.h - 30 - 2 * 46;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) sites.push([sx0 + i * 46, sy0 + j * 46]);
  const M = sites.map(([x, y], i) => ({ x, y, vx: 0, vy: 0, a: (i % 2) * Math.PI, w: 0, ph: r() * 6.28, ph2: r() * 6.28, s: 0 }));
  // the top row melts first; boiling picks molecules in a fixed random order
  const meltRank = M.map((_, i) => i).sort((a, b) => sites[a][1] - sites[b][1] || a - b);
  const boilOrder = M.map((_, i) => i).sort(() => r() - 0.5);

  let E = 0, auto = false, showGap = false;
  const say = api.readout();
  const heatBtn = api.button('Heat it steadily', () => {
    if (E >= EMAX - 1) E = 0;
    auto = !auto; heatBtn.setAttribute('aria-pressed', String(auto)); heatBtn.textContent = auto ? 'Stop heating' : 'Heat it steadily';
  }, { pressed: false });
  const sl = api.slider('Energy added', { min: 0, max: Math.round(EMAX), step: 5, value: 0, fmt: (v) => `${v} J per gram`, onInput: (v) => { E = v; auto = false; heatBtn.setAttribute('aria-pressed', 'false'); heatBtn.textContent = 'Heat it steadily'; } });
  const gapBtn = api.button('Show the empty space', () => { showGap = !showGap; gapBtn.setAttribute('aria-pressed', String(showGap)); }, { pressed: false });

  function assign(st) {
    const nSolid = Math.round((1 - st.fm) * N), nGas = Math.round(st.fb * N);
    const free = new Set(meltRank.slice(0, N - nSolid));
    const gas = new Set(boilOrder.filter((i) => free.has(i)).slice(0, nGas));
    M.forEach((m, i) => {
      const want = !free.has(i) ? 0 : gas.has(i) ? 2 : 1;
      if (want === m.s) return;
      if (want === 2) { const sp = 170 + r() * 60, th = -Math.PI / 2 + (r() - 0.5) * 2.4; m.vx = sp * Math.cos(th); m.vy = sp * Math.sin(th); m.w = (r() - 0.5) * 6; }
      if (want === 1) { m.vx *= 0.25; m.vy *= 0.25; }
      m.s = want;
    });
  }

  function step(dt, t, st) {
    const TK = st.T + 273.15;
    const vib = st.phase === 0 ? 1.5 + 2.5 * (st.T + 30) / 30 : 4;   // ice vibrates more as it warms
    const jig = 900 * (0.75 + 0.5 * Math.max(0, st.T) / 100);
    const gasSpeed = 170 * Math.sqrt(TK / 373);
    M.forEach((m, i) => {
      if (m.s !== 0) return;
      const [sx, sy] = sites[i];
      const tx = sx + vib * Math.sin(t * 9 + m.ph), ty = sy + vib * Math.cos(t * 8 + m.ph2);
      m.x += (tx - m.x) * Math.min(1, dt * 4); m.y += (ty - m.y) * Math.min(1, dt * 4);
      const ta = (i % 2) * Math.PI + 0.06 * vib * Math.sin(t * 7 + m.ph);
      m.a += (ta - m.a) * Math.min(1, dt * 4);
      m.vx = m.vy = 0;
    });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = M[i], b = M[j];
      if (a.s === 0 && b.s === 0) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, nx = dx / d, ny = dy / d;
      if (d < D && (a.s === 2 || b.s === 2)) {          // any collision with a gas molecule: elastic bounce
        const vr = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vr < 0) {
          if (a.s === 0) { b.vx -= 2 * vr * nx; b.vy -= 2 * vr * ny; }
          else if (b.s === 0) { a.vx += 2 * vr * nx; a.vy += 2 * vr * ny; }
          else { a.vx += vr * nx; a.vy += vr * ny; b.vx -= vr * nx; b.vy -= vr * ny; }
        }
        const push = D - d;
        if (a.s === 0) { b.x += nx * push; b.y += ny * push; } else if (b.s === 0) { a.x -= nx * push; a.y -= ny * push; }
        else { a.x -= nx * push / 2; a.y -= ny * push / 2; b.x += nx * push / 2; b.y += ny * push / 2; }
        continue;
      }
      let f = 0;
      if (d < D) f = -(D - d) * 60;
      else if (a.s !== 2 && b.s !== 2 && d < D * 1.45) f = (d - D) * 7;   // short-range attraction between touching molecules
      if (a.s !== 0) { a.vx += f * nx * dt; a.vy += f * ny * dt; }
      if (b.s !== 0) { b.vx -= f * nx * dt; b.vy -= f * ny * dt; }
    }
    for (const m of M) {
      if (m.s === 0) continue;
      if (m.s === 1) {
        m.vx += (r() - 0.5) * jig * dt; m.vy += (r() - 0.5) * jig * dt;
        m.vx *= Math.exp(-2.2 * dt); m.vy *= Math.exp(-2.2 * dt);
        m.vy += 260 * dt;
        m.w += (r() - 0.5) * 18 * dt; m.w *= Math.exp(-1.5 * dt);
      } else {
        const sp = Math.hypot(m.vx, m.vy) || 1;            // gently hold gas molecules near the speed for this temperature
        const kf = 1 + (gasSpeed / sp - 1) * Math.min(1, dt * 1.5);
        m.vx *= kf; m.vy *= kf;
      }
      m.x += m.vx * dt; m.y += m.vy * dt; m.a += m.w * dt;
      const R = D / 2, soft = m.s === 1 ? 0.3 : 1;
      if (m.x < box.x + R) { m.x = box.x + R; m.vx = Math.abs(m.vx); }
      if (m.x > box.x + box.w - R) { m.x = box.x + box.w - R; m.vx = -Math.abs(m.vx); }
      if (m.y < box.y + R) { m.y = box.y + R; m.vy = Math.abs(m.vy); }
      if (m.y > box.y + box.h - R) { m.y = box.y + box.h - R; m.vy = -Math.abs(m.vy) * soft; }
    }
  }

  function water(m, x = m.x, y = m.y, a = m.a, sc = 1) {
    const ox = x, oy = y - 3 * sc;
    const hs = [-1, 1].map((s) => [ox + 17 * sc * Math.sin(a + s * HA), oy + 17 * sc * Math.cos(a + s * HA)]);
    for (const [hx, hy] of hs) api.draw.bond(ctx, ox, oy, hx, hy, 1, c, 2.6 * sc);
    for (const [hx, hy] of hs) api.draw.atom(ctx, hx, hy, 7.5 * sc, 'H');
    api.draw.atom(ctx, ox, oy, 11.5 * sc, 'O');
  }

  // where to point at "empty space": in a gas, the biggest gap anywhere; when the molecules are packed
  // (solid or liquid), a gap *between* neighbouring molecules inside the packed cluster
  function emptiest() {
    const packed = M.filter((m) => m.s !== 2);
    const inGas = packed.length < 4;
    let x0 = box.x + 30, x1 = box.x + box.w - 30, y0 = box.y + 26, y1 = box.y + box.h - 26;
    if (!inGas) {
      x0 = Math.min(...packed.map((m) => m.x)); x1 = Math.max(...packed.map((m) => m.x));
      y0 = Math.min(...packed.map((m) => m.y)); y1 = Math.max(...packed.map((m) => m.y));
    }
    let best = [box.x + box.w / 2, box.y + box.h / 2], bd = -1;
    for (let gx = 0; gx <= 24; gx++) for (let gy = 0; gy <= 12; gy++) {
      const x = x0 + gx * (x1 - x0) / 24, y = y0 + gy * (y1 - y0) / 12;
      let d = Math.min(x - box.x, box.x + box.w - x, y - box.y, box.y + box.h - y) + 12;
      for (const m of M) d = Math.min(d, Math.hypot(m.x - x, m.y - y) - D / 2);
      if (d > bd) { bd = d; best = [x, y]; }
    }
    return { x: best[0], y: best[1], r: Math.max(4, Math.min(bd - 2, 44)), packed: !inGas, top: y0 };
  }

  // temperature-energy trace
  const P = { x: 452, y: 26, w: 248, h: 196 };
  const ex = (e) => P.x + (e / EMAX) * P.w, ty = (T) => P.y + P.h - ((T + 30) / 160) * P.h;
  function trace(st) {
    ctx.strokeStyle = c.rule; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(P.x, P.y - 6); ctx.lineTo(P.x, P.y + P.h); ctx.lineTo(P.x + P.w + 6, P.y + P.h); ctx.stroke();
    for (const T of [0, 100]) {
      ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(P.x, ty(T)); ctx.lineTo(P.x + P.w, ty(T)); ctx.stroke(); ctx.setLineDash([]);
      api.draw.text(ctx, `${T} °C`, P.x - 6, ty(T) + 4, { size: 11, color: c.muted, align: 'right' });
    }
    const pts = [[0, -30], [E1, 0], [E2, 0], [E3, 100], [E4, 100], [EMAX, 130]];
    ctx.strokeStyle = c.rule_2 || c.rule; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath(); pts.forEach(([e, T], i) => (i ? ctx.lineTo(ex(e), ty(T)) : ctx.moveTo(ex(e), ty(T)))); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = c.vol; ctx.lineWidth = 3; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(ex(0), ty(-30));
    for (const [e, T] of pts.slice(1)) { if (e >= E) break; ctx.lineTo(ex(e), ty(T)); }
    ctx.lineTo(ex(E), ty(st.T)); ctx.stroke();
    ctx.fillStyle = c.vol; ctx.beginPath(); ctx.arc(ex(E), ty(st.T), 5, 0, 7); ctx.fill();
    api.draw.text(ctx, 'melting', ex((E1 + E2) / 2), ty(0) - 8, { size: 11, color: st.phase === 1 ? c.vol : c.muted, align: 'center', weight: 600 });
    api.draw.text(ctx, 'boiling: the longest flat part', ex((E3 + E4) / 2), ty(100) - 8, { size: 11, color: st.phase === 3 ? c.vol : c.muted, align: 'center', weight: 600 });
    api.draw.text(ctx, 'energy added →', P.x + P.w, P.y + P.h + 16, { size: 11, color: c.muted, align: 'right' });
    api.draw.text(ctx, 'temperature', P.x - 6, P.y - 10, { size: 11, color: c.muted, align: 'left' });
  }

  const PH = ['Ice', 'Melting', 'Water', 'Boiling', 'Steam'];
  function render(st) {
    k.clear();
    ctx.fillStyle = c.plate; ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.strokeStyle = c.ink; ctx.lineWidth = 1.6; ctx.strokeRect(box.x, box.y, box.w, box.h);
    let gap = null;
    if (showGap) gap = emptiest();
    M.forEach((m) => water(m));
    if (gap) {
      ctx.strokeStyle = c.vol; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(gap.x, gap.y, gap.r, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      const msg = gap.packed ? 'between the molecules: nothing, not even air' : 'nothing here, not even air';
      let lx = Math.min(Math.max(gap.x, box.x + 140), box.x + box.w - 140), ly;
      if (gap.packed) {
        ly = Math.max(box.y + 18, gap.top - 46);
        ctx.strokeStyle = c.vol; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, ly + 4); ctx.lineTo(gap.x, gap.y - gap.r); ctx.stroke();
      } else ly = gap.y + gap.r + 14 > box.y + box.h - 4 ? gap.y - gap.r - 8 : gap.y + gap.r + 14;
      api.draw.text(ctx, msg, lx, ly, { size: 12, color: c.vol, align: 'center', weight: 600 });
    }
    trace(st);
    const t = Math.round(st.T);
    api.draw.text(ctx, `${PH[st.phase]} · ${t} °C · 12 whole H₂O molecules`, box.x, H - 14, { size: 13, color: c.ink, weight: 600 });
    // a fixed size marker: one molecule, the same size in every state
    const mx = P.x + 18, my = H - 22;
    water({ x: mx, y: my, a: Math.PI }, mx, my, Math.PI, 0.62);
    api.draw.text(ctx, 'one molecule: the same size in every state', mx + 16, my + 4, { size: 11, color: c.muted });
    const freed = M.filter((m) => m.s !== 0).length, flying = M.filter((m) => m.s === 2).length;
    const msg = [
      `<b>Ice at ${t} °C.</b> Each molecule vibrates about its own place, held by its neighbours. Warming makes the vibrations bigger. The molecules are never still.`,
      `<b>Melting, stuck at 0 °C.</b> Energy keeps pouring in, but the temperature does not rise: it is pulling molecules out of the ice pattern instead of speeding them up. This is Joseph Black's vanishing heat. ${freed} of 12 have broken free.`,
      `<b>Water at ${t} °C.</b> The molecules still touch, so the volume hardly changes, but they jiggle hard enough to slide past each other. Warmer means faster jiggling.`,
      `<b>Boiling, stuck at 100 °C.</b> Flat again, and for much longer: pulling a molecule right away from all its neighbours takes about 6.8 times as much energy as melting it. ${flying} of 12 are flying free. A bubble holds whole H₂O molecules, and nothing else.`,
      `<b>Steam at ${t} °C.</b> The molecules fly freely and meet only in brief collisions. (In real steam they would be about ten times farther apart than this box allows.)`,
    ][st.phase];
    say(msg + ' The graph is to scale for real water.');
  }

  let lastSet = -1;
  api.loop((dt, t) => {
    if (dt && auto) {
      E = Math.min(EMAX, E + 125 * dt);
      if (E >= EMAX) { auto = false; heatBtn.setAttribute('aria-pressed', 'false'); heatBtn.textContent = 'Heat it steadily'; }
      const v = Math.round(E / 5) * 5; if (v !== lastSet) { sl.set(v); lastSet = v; }
    }
    const st = stateAt(E);
    assign(st);
    if (dt) step(dt, t, st);
    render(st);
  });
  api.account(() => ({E}));
  return {};
}, { label: 'Heat it and watch' });
