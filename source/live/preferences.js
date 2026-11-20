// Preferences are shared with the companion laboratory on this origin. Sound is
// opt-in for the current visit; no files, services or telemetry are requested.
let chosen = false,
  sound = false,
  audio = null;
const query = window.matchMedia('(prefers-reduced-motion: reduce)');
try {
  chosen = localStorage.getItem('kymaia.chemistry.still') === 'true';
} catch {}
window.KymaiaBookStill = () => chosen || query.matches;
window.KymaiaBookSound = async (kind) => {
  if (!sound) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    audio ??= new AC();
    await audio.resume();
    if (!sound) return;
    if (kind === 'balanced' || kind === 'neutral' || kind === 'probe' || kind === 'snap') {
      const notes =
        kind === 'balanced'
          ? [392, 587.3]
          : kind === 'neutral'
            ? [330, 495]
            : kind === 'snap'
              ? [660, 880]
              : [493.88];
      const now = audio.currentTime;
      notes.forEach((freq, idx) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = now + idx * 0.06;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.035, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
        osc.connect(gain).connect(audio.destination);
        osc.start(start);
        osc.stop(start + 0.15);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      });
      return;
    }
    const n = Math.floor(audio.sampleRate * 0.09),
      buffer = audio.createBuffer(1, n, audio.sampleRate),
      data = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = audio.createBufferSource(),
      gain = audio.createGain(),
      filter = audio.createBiquadFilter();
    src.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = kind === 'stamp' ? 220 : 1200;
    gain.gain.value = 0.045;
    src.connect(filter).connect(gain).connect(audio.destination);
    src.start();
    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  } catch {
    /* Silent fallback when audio is unavailable. */
  }
};
export function initPreferences() {
  function paint() {
    document.documentElement.classList.toggle('book-still', window.KymaiaBookStill());
    try {
      const rawPrefs = localStorage.getItem('kymaia.chemistry.prefs.v1');
      const parsed = rawPrefs ? JSON.parse(rawPrefs) : null;
      document.documentElement.classList.toggle(
        'interactive-highlights',
        Boolean(parsed && parsed.interactiveHighlights),
      );
    } catch {}
    window.dispatchEvent(new Event('kymaia-motion-change'));
  }
  paint();
  query.addEventListener('change', paint);
  const add = () => {
    const app = window.App;
    if (!app) return;
    const existingStill = document.getElementById('tb-still');
    if (existingStill) existingStill.remove();
    let syncingFromSettings = false;
    const still = app.tool({
      id: 'still',
      label: 'Still',
      title: 'Still mode',
      icon: '◐',
      order: 87,
      onClick: () => {
        chosen = !chosen;
        try {
          localStorage.setItem('kymaia.chemistry.still', String(chosen));
        } catch {}
        paint();
        update();
        if (!syncingFromSettings && typeof window.__applyKymBioSettings === 'function') {
          try {
            window.__applyKymBioSettings({ still: chosen });
          } catch {}
        }
      },
    });
    function update() {
      if (still) {
        still.disabled = query.matches;
        still.setAttribute('aria-pressed', String(window.KymaiaBookStill()));
        still.title = query.matches
          ? 'Still mode follows your device’s reduced-motion preference.'
          : 'Freeze automatic motion; manual steps remain available.';
      }
    }
    const dedupeStill = () => {
      document.querySelectorAll('#tb-still').forEach((node) => {
        if (node !== still) node.remove();
      });
    };
    dedupeStill();
    queueMicrotask(dedupeStill);
    query.addEventListener('change', update);
    if (typeof app.on === 'function') {
      app.on('ready', dedupeStill);
      app.on('still:change', (nextStill) => {
        const nextVal = Boolean(nextStill);
        if (nextVal === chosen) return;
        syncingFromSettings = true;
        chosen = nextVal;
        try {
          localStorage.setItem('kymaia.chemistry.still', String(chosen));
        } catch {}
        paint();
        update();
        syncingFromSettings = false;
      });
    }
    update();
    const snd = app.tool({
      id: 'sound',
      label: 'Sound',
      title: 'Optional quiet paper and stamp sounds',
      icon: '♪',
      order: 88,
      onClick: () => {
        sound = !sound;
        snd?.setAttribute('aria-pressed', String(sound));
        if (sound) window.KymaiaBookSound('paper');
        else audio?.suspend();
      },
    });
    snd?.setAttribute('aria-pressed', 'false');
  };
  if (window.App) window.App.ready(add);
  else setTimeout(add, 0);
  document.querySelectorAll('.eq').forEach((eq) => {
    const t = eq.textContent;
    let rows = [];
    if (/charge =/.test(t))
      rows = [
        [
          'charge / e',
          'Signed charge in elementary-charge units. Each proton contributes +1; each electron −1; a neutron zero.',
        ],
        [
          'protons, electrons',
          'Particle counts, dimensionless. The proton count defines the element.',
        ],
      ];
    else if (/concentration =|concentration \(mol/.test(t))
      rows = [
        ['c', 'Concentration in mol/L; c = n/V.'],
        ['n', 'Amount of specified solute, in mol.'],
        ['V', 'Final solution volume, in L. Dilution can change V while n remains fixed.'],
      ];
    else if (/mass \(g\)|grams of reactant/.test(t))
      rows = [
        ['m', 'Mass, in g.'],
        ['n', 'Amount of specified entities, in mol; n = m/M.'],
        ['M', 'Molar mass, in g/mol. A balanced equation relates mole ratios, not equal masses.'],
      ];
    else if (/Avogadro|1 mole =/.test(t))
      rows = [
        [
          'mol',
          'SI unit of amount of substance. Name the counted entity: atoms, molecules, ions or formula units.',
        ],
        ['Nₐ', 'Avogadro constant: exactly 6.022 140 76 × 10²³ mol⁻¹. Entity count N = n × Nₐ.'],
      ];
    else if (/[→⇌]/.test(t))
      rows = [
        [
          'Coefficient',
          'The number before a formula multiplies every atom in it. It gives molecule-count or mole ratios, not equal masses.',
        ],
        [
          'Subscript',
          'A small number within a formula counts atoms per molecule or formula unit. Changing it changes the chemical formula.',
        ],
        [
          'Charge superscript',
          'A signed charge in units of e. Sum charge separately from the atom inventory on each side.',
        ],
        [
          'Arrow',
          t.includes('⇌')
            ? '⇌ denotes opposing processes. At equilibrium their rates match; the two inventories need not match.'
            : '→ indicates the direction as written. A balanced account does not prove the reaction occurs under the stated conditions.',
        ],
      ];
    if (!rows.length) return;
    const details = document.createElement('details');
    details.className = 'book-symbols';
    const summary = document.createElement('summary');
    summary.textContent = 'Inspect this equation: symbols, counts and units';
    details.append(summary);
    const dl = document.createElement('dl');
    for (const [symbol, meaning] of rows) {
      const dt = document.createElement('dt'),
        dd = document.createElement('dd');
      dt.textContent = symbol;
      dd.textContent = meaning;
      dl.append(dt, dd);
    }
    details.append(dl);
    eq.after(details);
  });
}
