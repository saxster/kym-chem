// Zinc in copper sulfate: Cu2+ ions reach the zinc strip; two electrons pass from a zinc atom to each one;
// the zinc atom leaves as Zn2+ and a copper atom stays on the strip. Sulfate ions are spectators.
// Counters show that zinc, copper, electrons and charge are all conserved on every frame.
import { Live } from './core.js';

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a, b, t) => a + (b - a) * t;

Live.register('zncu', (stage, params, api) => {
  const c = api.colors();
  const W = 640, H = 330;
  const k = api.canvas(W, H, 'Animation: copper ions in blue solution reach a zinc strip. Two electrons pass from a zinc atom to each copper ion. The zinc atom leaves as a zinc ion and a copper atom stays on the strip.');
  const ctx = k.ctx;
  const say = api.readout();
  const sol = { x: 20, y: 40, w: 600, h: 230 };
  const strip = { x: 26, y: 46, w: 64, h: 218 };
  const N = 5;                         // copper ions (and surface sites that will react)
  let sites, ions, sulf, events, t, nextAt, done;

  function setup() {
    const r = api.rng(5);
    sites = [];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++)
      sites.push({ x: strip.x + 18 + j * 28, y: strip.y + 22 + i * 42, el: 'Zn', surface: j === 1, row: i });
    const spots = [[200, 80], [330, 130], [250, 215], [450, 90], [520, 200]];
    ions = spots.map(([x, y], i) => ({ el: 'Cu', x, y, bx: x, by: y, ph: r() * 6.28, state: 'free' }));
    sulf = [[300, 70], [410, 230], [560, 140], [180, 160], [470, 170]].map(([x, y]) => ({ bx: x, by: y, ph: r() * 6.28 }));
    events = []; t = 0; nextAt = 1.2; done = false;
  }

  function wander(o, tt, amp = 10) {
    return [o.bx + amp * Math.sin(tt * 0.7 + o.ph), o.by + amp * 0.8 * Math.cos(tt * 0.55 + o.ph * 1.3)];
  }

  function startEvent() {
    const site = sites.find((s) => s.surface && s.el === 'Zn');
    const ion = ions.filter((i) => i.el === 'Cu' && i.state === 'free')
      .sort((a, b) => a.bx - b.bx)[0];
    if (!site || !ion) { done = true; return; }
    ion.state = 'moving';
    const [sx, sy] = wander(ion, t);
    events.push({ t0: t, site, ion, sx, sy, phase: 0 });
  }

  // event timeline: 0–1.4 s ion approaches; 1.4–2.2 s two electrons cross; 2.2–3.6 s zinc ion leaves
  function updateEvents() {
    for (const e of events) {
      const u = t - e.t0;
      const tx = e.site.x + 34, ty = e.site.y;
      if (u < 1.4) { const q = ease(u / 1.4); e.ion.x = lerp(e.sx, tx, q); e.ion.y = lerp(e.sy, ty, q); }
      else { e.ion.x = tx; e.ion.y = ty; }
      if (u >= 2.2 && e.phase < 2) {
        // electrons have arrived: the copper ion is now a copper atom on the strip; the zinc atom is now an ion
        e.phase = 2;
        e.site.el = 'Cu'; e.ion.state = 'gone';
        e.zn = { el: 'Zn', x: e.site.x, y: e.site.y, ph: e.ion.ph, state: 'leaving', t0: t,
          bx: 160 + ((events.indexOf(e) * 97) % 380), by: 70 + ((events.indexOf(e) * 53) % 170) };
        ions.push(e.zn);
      }
      if (e.zn && e.zn.state === 'leaving') {
        const q = ease((t - e.zn.t0) / 1.6);
        e.zn.x = lerp(e.site.x, e.zn.bx, q); e.zn.y = lerp(e.site.y, e.zn.by, q);
        if (q >= 1) e.zn.state = 'free';
      }
    }
  }

  function counts() {
    const znStrip = sites.filter((s) => s.el === 'Zn').length;
    const cuMetal = sites.filter((s) => s.el === 'Cu').length;
    const znIon = ions.filter((i) => i.el === 'Zn').length;
    const cuIon = ions.filter((i) => i.el === 'Cu' && i.state !== 'gone').length;
    return { znStrip, cuMetal, znIon, cuIon, e: cuMetal * 2 };
  }

  function render() {
    k.clear();
    const n = counts();
    // solution: blue tint fades as Cu2+ is used up
    const blue = 0.05 + 0.2 * n.cuIon / N;
    ctx.fillStyle = `rgba(53,109,131,${blue.toFixed(3)})`;
    api.draw.roundRect(ctx, sol.x, sol.y, sol.w, sol.h, 6); ctx.fill();
    ctx.strokeStyle = c.electron; ctx.globalAlpha = 0.4; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = c.sheet; ctx.fillRect(strip.x, strip.y, strip.w, strip.h);
    ctx.strokeStyle = c.muted; ctx.strokeRect(strip.x, strip.y, strip.w, strip.h);
    api.draw.text(ctx, 'zinc strip', strip.x + strip.w / 2, sol.y + sol.h + 18, { size: 12, color: c.muted, align: 'center' });
    api.draw.text(ctx, 'copper sulfate solution', 330, sol.y + sol.h + 18, { size: 12, color: c.muted, align: 'center' });
    for (const s of sites) api.draw.atom(ctx, s.x, s.y, 13, s.el);
    for (const s of sulf) {
      const [x, y] = wander(s, t, 8);
      ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fillStyle = c.sheet; ctx.fill(); ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.stroke();
      api.draw.text(ctx, 'SO₄', x, y + 4, { size: 9.5, color: c.ink, align: 'center', weight: 600 });
      api.draw.text(ctx, '2−', x + 12, y - 8, { size: 9, color: c.muted, align: 'left', weight: 600 });
    }
    for (const i of ions) {
      if (i.state === 'gone') continue;
      let x = i.x, y = i.y;
      if (i.state === 'free') { [x, y] = wander(i, t); i.x = x; i.y = y; }
      api.draw.atom(ctx, x, y, 14, i.el, { charge: '2+', c });
    }
    // electrons in flight: two per event, from the zinc atom to the copper ion
    for (const e of events) {
      const u = t - e.t0;
      if (u >= 1.4 && u < 2.2) {
        const q = ease((u - 1.4) / 0.8);
        for (const off of [-7, 7]) {
          const x = lerp(e.site.x + 6, e.ion.x - 6, q), y = lerp(e.site.y + off, e.ion.y + off * 0.6, q) - Math.sin(Math.PI * q) * 12;
          api.draw.particle(ctx, x, y, 5.5, 'e', c);
        }
      }
    }
    // counters
    const y0 = 22;
    api.draw.text(ctx, `zinc atoms in strip ${n.znStrip}   Zn²⁺ in water ${n.znIon}   (zinc total ${n.znStrip + n.znIon})`, 20, y0, { size: 12, color: c.ink });
    api.draw.text(ctx, `Cu²⁺ in water ${n.cuIon}   copper atoms on strip ${n.cuMetal}   (copper total ${n.cuIon + n.cuMetal})`, 20, H - 16, { size: 12, color: c.ink });
    api.draw.text(ctx, `electrons passed: ${n.e}`, W - 20, H - 16, { size: 12, color: c.electron, align: 'right', weight: 600 });
    const charge = 2 * (n.znIon + n.cuIon);
    say(done
      ? `All the copper ions have reacted: the blue colour has gone. ${n.e} electrons passed, two for every zinc atom that dissolved and two for every copper atom that formed. The water still holds ${n.znIon} ions with charge 2+ and ${sulf.length} sulfate ions with charge 2−, so it stays neutral.`
      : `Each copper ion that reaches the strip takes two electrons from a zinc atom. Charge in the water: +${charge} from metal ions and −${2 * sulf.length} from sulfate ions, balanced on every frame. The sulfate ions never change: they are spectators.`);
  }

  setup();
  api.button('Replay', () => { setup(); render(); });
  api.loop((dt) => {
    if (dt) {
      t += dt;
      if (!done && t >= nextAt) { startEvent(); nextAt = t + 2.6; }
      updateEvents();
    }
    render();
  });
  api.account(() => counts());
  return {};
}, { label: 'Watch the electrons move' });
