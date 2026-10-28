import { ACCOUNTS, entries } from './accounts.js';
const node = (tag, text, cls) => {
  const el = document.createElement(tag);
  if (text != null) el.textContent = text;
  if (cls) el.className = cls;
  return el;
};
const button = (label, fn) => {
  const b = node('button', label, 'live-ctl');
  b.type = 'button';
  b.addEventListener('click', fn);
  return b;
};
export function changeSetup(change, api, params) {
  if (!change) return;
  const [kind, key, value] = change;
  if (kind === 'slider') api._sliders.find((s) => s.label === key)?.apply(value);
  if (kind === 'tab') api._tabs[key]?.[value]?.click();
  if (kind === 'button') {
    const b = api._buttons.find((b) => b.textContent === key);
    if (b && b.getAttribute('aria-pressed') !== 'true') b.click();
  }
  if (kind === 'repeat')
    for (let i = 0; i < value; i++) api._buttons.find((b) => b.textContent === key)?.click();
  if (kind === 'gas') api._sliders[0]?.apply(params.mode === 'volume' ? 20 : 400);
  if (kind === 'barrier') {
    api._sliders[0]?.apply(18);
    if (params.catalyst) changeSetup(['button', 'Catalyst'], api, params);
  }
}
function reached(name, s, api, params) {
  if (name === 'dilution') return s.litres === 2;
  if (name === 'gasbox') return params.mode === 'volume' ? s.V === 20 : s.T === 400;
  if (name === 'bondwell') return Math.abs(s.r - 74) < 0.5;
  if (name === 'states') return s.E === 200;
  if (name === 'limiting') return s.mix[0] === 5 && s.mix[1] === 3;
  if (name === 'saltsteps') return s.step === 3;
  if (name === 'equilibrium') return s.doubled;
  if (name === 'barrier') return s.kT === 18 && (!params.catalyst || s.useCat);
  if (name === 'goldfoil') return s.n.straight + s.n.turned + s.n.back > 0;
  const change = ACCOUNTS[name]?.change;
  if (change?.[0] === 'tab')
    return api._tabs[change[1]]?.[change[2]]?.getAttribute('aria-pressed') === 'true';
  if (change?.[0] === 'button') return api._actions.has(change[1]);
  if (change?.[0] === 'slider')
    return +api._sliders.find((x) => x.label === change[1])?.input.value === change[2];
  return true;
}
export function accountPanel(fig, name, params, api) {
  const spec = ACCOUNTS[name];
  if (!spec) return null;
  const panel = node('section', null, 'live-account');
  panel.setAttribute('aria-label', 'Figure accounting and challenge');
  panel.append(node('h4', 'Keep the account'), node('p', spec.idea, 'live-analogy'));
  const table = node('table');
  const caption = node('caption', 'Your numbers · calculated model account');
  table.append(caption);
  const body = node('tbody');
  table.append(body);
  const working = node('p', null, 'live-working');
  const inspector = node(
    'p',
    'Select an entry to inspect its quantity and unit.',
    'live-inspector',
  );
  inspector.setAttribute('role', 'status');
  panel.append(table, working, inspector);
  const note = node('p', null, 'live-model-note');
  note.append(node('strong', 'Model note: '), document.createTextNode(spec.note));
  panel.append(note);
  const challenge = node('div', null, 'live-challenge');
  challenge.append(node('h4', 'Challenge'), node('p', spec.task));
  if (name === 'gasbox')
    challenge.append(
      node('p', params.mode === 'volume' ? 'Target: 20 L at 300 K.' : 'Target: 400 K at 10 L.'),
    );
  if (name === 'barrier')
    challenge.append(
      node('p', params.catalyst ? 'Target: very hot, with catalyst on.' : 'Target: very hot.'),
    );
  const field = node('fieldset');
  field.append(node('legend', spec.question));
  const select = node('select');
  select.setAttribute('aria-label', 'Accounting explanation');
  select.append(new Option('Choose an explanation…', ''));
  const choices = spec.answers.map((answer, index) => ({ answer, index }));
  if ([...fig.id].reduce((n, c) => n + c.charCodeAt(0), 0) % 2) choices.reverse();
  choices.forEach(({ answer, index }) => select.append(new Option(answer, String(index))));
  field.append(select);
  challenge.append(field);
  const status = node(
    'p',
    'Guided practice: a stamp records this target, not independent understanding.',
  );
  status.setAttribute('role', 'status');
  const key = `iw:account-v1:${fig.id}`;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved?.version === 1 && saved.passed === true && saved.answer === spec.correct)
      status.textContent =
        '✓ Earlier guided target saved in this browser. Try your own setup again or continue in the laboratory notebook.';
  } catch {
    /* Invalid stamp data is not used or overwritten until an explicit new check. */
  }
  challenge.append(
    button('Check my account', () => {
      const state = api._account?.() || {};
      if (select.value === '') {
        status.textContent = 'Choose an explanation after exploring the figure.';
        return;
      }
      if (!reached(name, state, api, params)) {
        status.textContent =
          'The target setup has not been reached yet. Check the challenge above.';
        return;
      }
      if (+select.value !== spec.correct) {
        status.textContent =
          'Recheck the account and the model note, then try your explanation again.';
        return;
      }
      let saved = false;
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ version: 1, passed: true, answer: spec.correct, state }),
        );
        saved = true;
      } catch {}
      status.textContent = saved
        ? '✓ Target reconciled · guided practice saved in this browser. Use the laboratory notebook for a backed-up explanation.'
        : '✓ Target reconciled for this visit. Browser saving is unavailable; record your explanation in an exported laboratory notebook.';
      status.classList.add('live-stamp');
      window.KymaiaBookSound?.('stamp');
    }),
    status,
  );
  panel.append(challenge);
  const link = node('a', 'Continue this account in the laboratory notebook');
  const lesson =
    name === 'barrier' && params.catalyst
      ? 'catalysts'
      : name === 'equilibrium' && params.perturb
        ? 'le-chatelier-perturbations'
        : name === 'skyline' && params.prop === 'size'
          ? 'effective-nuclear-charge'
          : name === 'organic3d' && params.set === 'frameworks'
            ? 'carbon-catenation-geometries'
            : spec.lesson;
  link.href = `lab/?investigation=${lesson}`;
  panel.append(link);
  const details = node('details');
  details.append(
    node('summary', 'Sources, units and course connections'),
    node(
      'p',
      'Chosen settings, scripted paths and representative counts are model inputs. Reference facts need their stated substance, conditions and approximation.',
    ),
  );
  const source = node('a', 'Book sources and model assumptions');
  source.href = '#models';
  const guide = node(
    'a',
    'Open the matching investigation: numeric sources, symbols, parent questions and Cambridge / AQA / CBSE / IB connections',
  );
  guide.href = link.href;
  details.append(source, node('br'), guide);
  panel.append(details);
  let previous = '';
  function update() {
    const data = entries(name, api._account?.() || {}),
      signature = JSON.stringify(data);
    if (signature === previous) return;
    previous = signature;
    table.hidden = !data.rows.length;
    inspector.hidden = !data.rows.length;
    working.hidden = !data.equation;
    body.replaceChildren();
    for (const [label, value, unit] of data.rows) {
      const tr = node('tr'),
        th = node('th'),
        td = node('td', `${value} ${unit}`);
      th.scope = 'row';
      const b = button(label, () => {
        inspector.textContent = `${label}: ${value} ${unit}. This entry belongs to the calculated model account, with the boundary stated below.`;
      });
      th.append(b);
      tr.append(th, td);
      body.append(tr);
    }
    working.textContent = data.equation;
  }
  api._updateAccount = update;
  update();
  return panel;
}
// A second, disposable instance keeps worked examples out of the learner's own state.
export function demonstration(fig, name, params, widget, makeApi, pauseOwn) {
  const spec = ACCOUNTS[name];
  if (!spec) return null;
  const details = node('details', null, 'live-watch');
  details.append(node('summary', 'Watch / step through a worked account'));
  const text = node(
    'p',
    'Five directed steps. The worked preview is separate; your own figure inputs are restored at handover.',
  );
  details.append(text);
  const actions = node('div', null, 'live-tour-actions'),
    status = node('p');
  status.setAttribute('role', 'status');
  details.append(actions, status);
  let preview = null,
    step = -1,
    timer = 0,
    raf = 0,
    last = 0,
    auto = false;
  const labels = [
    'Opening account',
    'Inspect the evidence',
    'Look inside the model',
    'Change one condition',
    'Reconcile · your turn',
  ];
  const captions = [
    spec.idea,
    'Read the original figure caption. Distinguish what could be observed from what this model computes.',
    spec.note,
    spec.task,
    'Your turn: return to your own setup, reach the target and explain which quantities stayed fixed.',
  ];
  function clearPreview() {
    cancelAnimationFrame(raf);
    if (preview) {
      preview.inst?.destroy?.();
      preview.api._cleanups.forEach((f) => f());
      preview.wrap.remove();
      preview = null;
    }
    fig.classList.remove('live-previewing');
  }
  function stop() {
    clearTimeout(timer);
    auto = false;
    play.textContent = 'Play five steps';
    play.setAttribute('aria-pressed', 'false');
  }
  function frame(ts) {
    if (!preview) return;
    const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0);
    last = ts;
    preview.api._loops.forEach((f) => f(dt, ts / 1000));
    preview.api._updateAccount?.();
    raf = requestAnimationFrame(frame);
  }
  function show(i) {
    clearPreview();
    pauseOwn();
    step = i;
    const wrap = node('div', null, 'live-preview'),
      stage = node('div', null, 'live-stage'),
      controls = node('div', null, 'live-controls');
    wrap.append(
      node('p', 'Worked preview · your own setup is paused', 'live-preview-label'),
      stage,
      controls,
    );
    details.append(wrap);
    fig.classList.add('live-previewing');
    const api = makeApi(fig, stage, controls);
    const inst = widget.factory(stage, params, api) || {};
    preview = { wrap, api, inst };
    // Manual shots have a deterministic time as well as a camera position.
    // Advance only this disposable instance, using the model's normal small steps.
    if (!widget.meta.three)
      for (let n = 0; n < i * 30; n++) api._loops.forEach((f) => f(0.05, n * 0.05));
    if (i === 2 && name === 'orbitals') changeSetup(['button', 'Cut in half'], api, params);
    // Change only this disposable instance, never the original model.
    if (i >= 3) changeSetup(spec.change, api, params);
    api._tourPose?.(i);
    api._loops.forEach((f) => f(0, 0));
    const account = accountPanel(fig, name, params, api);
    if (account) {
      account.querySelector('.live-challenge')?.remove();
      account.querySelectorAll('a,details').forEach((e) => e.remove());
      controls.append(account);
    }
    status.textContent = `${i + 1}/5 · ${labels[i]}. ${captions[i]}`;
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    if (auto && !api.reduced) {
      last = 0;
      raf = requestAnimationFrame(frame);
      timer = setTimeout(() => {
        if (i < 4) show(i + 1);
        else {
          stop();
          clearPreview();
          step = -1;
          buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
          status.textContent = 'Your own setup is restored. Your turn: ' + spec.task;
        }
      }, 2400);
    }
  }
  const buttons = labels.map((label, i) => {
    const b = button(`${i + 1}. ${label}`, () => {
      stop();
      show(i);
    });
    b.setAttribute('aria-pressed', 'false');
    actions.append(b);
    return b;
  });
  const play = button('Play five steps', () => {
    if (auto) {
      stop();
      cancelAnimationFrame(raf);
      return;
    }
    auto = true;
    play.textContent = 'Pause demonstration';
    play.setAttribute('aria-pressed', 'true');
    show(step < 0 ? 0 : step);
  });
  play.disabled = window.KymaiaBookStill?.() ?? false;
  actions.append(
    play,
    button('Return to my setup', () => {
      stop();
      clearPreview();
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      status.textContent = 'Your own setup is shown. Check the challenge using your own controls.';
      step = -1;
    }),
  );
  const motion = () => {
    play.disabled = window.KymaiaBookStill?.() ?? false;
    if (play.disabled) {
      stop();
      cancelAnimationFrame(raf);
    }
  };
  window.addEventListener('kymaia-motion-change', motion);
  details.addEventListener('toggle', () => {
    if (!details.open) {
      stop();
      clearPreview();
      step = -1;
      buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    }
  });
  // Off-screen worked previews pause instead of consuming CPU in the background.
  const observer = new IntersectionObserver(
    (es) => {
      if (!es[0].isIntersecting) {
        stop();
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0 },
  );
  observer.observe(details);
  return {
    el: details,
    destroy() {
      stop();
      clearPreview();
      observer.disconnect();
      window.removeEventListener('kymaia-motion-change', motion);
    },
  };
}
