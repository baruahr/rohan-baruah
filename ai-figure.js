// Meaningful AI use in design — the rebundling figure
// Linear → Agile → Rebundled around a repo. Same parts, regrouped.
(() => {
  const fig = document.getElementById('rebundle');
  if (!fig) return;
  const svg = fig.querySelector('.rb__svg');
  const cap = fig.querySelector('.rb__cap');
  const tabs = [...fig.querySelectorAll('.rb__tab')];
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Every node in the story. Stage nodes exist in all three states; the rest arrive with the repo.
  const NODES = [
    // The six classic stages, each finding a new home in the rebundled view
    { id: 'research', stage: 'Research',   hub: 'Research',            kind: 'plug',
      say: 'Interviews, studies and notes, committed to the repo as they happen.' },
    { id: 'synth',    stage: 'Synthesise', hub: 'Synthesise research', kind: 'skill',
      say: 'Turns raw research into themes and insights, and cites its sources in the repo.' },
    { id: 'ideate',   stage: 'Ideate',     hub: 'Thought partner',     kind: 'skill',
      say: 'Ideation stops being a stage. This skill frames the problem, lays out options and pressure-tests the reasoning.' },
    { id: 'design',   stage: 'Design',     hub: 'Design interfaces',   kind: 'skill',
      say: 'Composes screens from the boilerplate and the design system, so options are real from the start.' },
    { id: 'proto',    stage: 'Prototype',  hub: 'Boilerplate',         kind: 'plug',
      say: 'A starter built on production-ready components. The prototype stage becomes something you plug in.' },
    { id: 'present',  stage: 'Present',    hub: 'Build presentations', kind: 'skill',
      say: 'Builds the story for stakeholders from everything the repo already knows.' },
    // New with the repo
    { id: 'customer', hub: 'Customer data',   kind: 'plug',
      say: 'Feedback, tickets and conversations, in the customer’s own words.' },
    { id: 'data',     hub: 'Product data',    kind: 'plug',
      say: 'Usage and telemetry the work can be checked against.' },
    { id: 'strategy', hub: 'Strategy & specs', kind: 'plug',
      say: 'Goals, roadmaps and specs, so every output knows what it is for.' },
    { id: 'system',   hub: 'Design system',   kind: 'plug',
      say: 'Tokens, components and guidelines: the rules every output has to follow.' },
    { id: 'visual',   hub: 'Visualise research', kind: 'skill',
      say: 'Makes findings legible: maps, charts and journeys drawn from the same source.' },
    { id: 'review',   hub: 'Design review',   kind: 'skill',
      say: 'Checks work against the design system, accessibility and the research before anyone else has to.' },
    { id: 'designers', hub: 'Designers', kind: 'person',
      say: 'Work on the repo together: frame the question, review the output, decide.' },
    { id: 'agent',    hub: 'Agent',     kind: 'person',
      say: 'Runs skills on the repo to do the legwork, on a designer’s direction.' },
  ];
  const STAGES = NODES.filter(n => n.stage);
  const REPO_SAY = 'The centre. One source of context that every plug feeds and every skill reads.';

  const CAPTIONS = {
    linear: ['Linear.', 'Each stage finished before the next began, and every handoff was a document.'],
    agile:  ['Agile.', 'The line bent into a loop: shorter, faster cycles — but the same stages, in the same order.'],
    hub:    ['Rebundled around AI.', 'A repo holds the context. Plugs feed it, skills act on it, designers and agents direct it. Hover or tap any part.'],
  };

  // ── Layouts. Landscape for wide screens, portrait for phones.
  const PLUGS  = ['research', 'customer', 'data', 'strategy', 'system', 'proto'];
  const SKILLS = ['synth', 'visual', 'ideate', 'design', 'review', 'present'];

  function layout(portrait) {
    const L = { W: portrait ? 400 : 1000, H: portrait ? 830 : 640, pos: { linear: {}, agile: {}, hub: {} } };
    const H = L.pos.hub;
    if (!portrait) {
      STAGES.forEach((n, i) => { L.pos.linear[n.id] = [110 + i * 156, 320, 'b']; });
      STAGES.forEach((n, i) => {
        const a = (-90 + i * 60) * Math.PI / 180, x = 500 + 200 * Math.cos(a), y = 320 + 200 * Math.sin(a);
        L.pos.agile[n.id] = [x, y, Math.abs(x - 500) < 20 ? (y < 320 ? 'a' : 'b') : (x < 500 ? 'l' : 'r')];
      });
      L.repo = { x: 500, y: 300, w: 200, h: 136 };
      PLUGS.forEach((id, i)  => { H[id] = [206, 146 + i * 62, 'l']; });
      SKILLS.forEach((id, i) => { H[id] = [794, 146 + i * 62, 'r']; });
      H.designers = [420, 568, 'b']; H.agent = [580, 568, 'b'];
      L.groups = [
        { kind: 'plug',  x: 20,  y: 58, w: 222, h: 444, title: 'Plugs', sub: 'What the repo knows', tx: 40,  anchor: 'start' },
        { kind: 'skill', x: 758, y: 58, w: 222, h: 444, title: 'Skills', sub: 'What the repo can do', tx: 960, anchor: 'end' },
      ];
    } else {
      STAGES.forEach((n, i) => { L.pos.linear[n.id] = [150, 130 + i * 116, 'r']; });
      STAGES.forEach((n, i) => {
        const a = (-90 + i * 60) * Math.PI / 180, x = 200 + 120 * Math.cos(a), y = 415 + 120 * Math.sin(a);
        L.pos.agile[n.id] = [x, y, i === 0 ? 'a' : 'b'];
      });
      L.repo = { x: 200, y: 415, w: 150, h: 100 };
      PLUGS.forEach((id, i)  => { H[id] = [i % 2 ? 292 : 108, 92 + Math.floor(i / 2) * 70, 'b']; });
      SKILLS.forEach((id, i) => { H[id] = [i % 2 ? 292 : 108, 610 + Math.floor(i / 2) * 70, 'b']; });
      H.designers = [44, 415, 'b']; H.agent = [356, 415, 'b'];
      L.groups = [
        { kind: 'plug',  x: 10, y: 14,  w: 380, h: 300, title: 'Plugs', sub: 'What the repo knows', tx: 28, anchor: 'start' },
        { kind: 'skill', x: 10, y: 532, w: 380, h: 288, title: 'Skills', sub: 'What the repo can do', tx: 28, anchor: 'start' },
      ];
    }
    // Nodes that only exist in the hub wait at their hub spot, invisible
    NODES.filter(n => !n.stage).forEach(n => { L.pos.linear[n.id] = L.pos.hub[n.id]; L.pos.agile[n.id] = L.pos.hub[n.id]; });
    return L;
  }

  const el = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  let L, state = 'linear', portrait = null, gWires, gNodes, repo, nodeEls = {}, touched = false;

  function build() {
    portrait = fig.clientWidth < 640;
    L = layout(portrait);
    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${L.W} ${L.H}`);
    svg.classList.toggle('is-portrait', portrait);

    const defs = el('defs', {}, svg);
    const mk = el('marker', { id: 'rb-arrow', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M1 1 L9 5 L1 9', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mk);

    const gGroups = el('g', { class: 'rb__groups' }, svg);
    L.groups.forEach(G => {
      const g = el('g', { class: 'rb__group g-' + G.kind }, gGroups);
      el('rect', { x: G.x, y: G.y, width: G.w, height: G.h, rx: 18 }, g);
      el('text', { class: 'rb__gT', x: G.tx, y: G.y + 30, 'text-anchor': G.anchor }, g).textContent = G.title;
      el('text', { class: 'rb__gS', x: G.tx, y: G.y + 48, 'text-anchor': G.anchor }, g).textContent = G.sub;
    });

    gWires = el('g', { class: 'rb__wires' }, svg);

    // The repo
    const R = L.repo;
    repo = el('g', { class: 'rb__repo', tabindex: '-1', 'data-id': 'repo' }, svg);
    repo.style.transform = `translate(${R.x}px, ${R.y}px)`;
    el('rect', { x: -R.w / 2, y: -R.h / 2, width: R.w, height: R.h, rx: 18 }, repo);
    const glyph = el('g', { class: 'rb__glyph', transform: `translate(0 ${portrait ? -20 : -28})` }, repo);
    el('path', { d: 'M-9 -9 V9 M-9 0 C -1 0, 9 -3, 9 -10' }, glyph);
    el('circle', { cx: -9, cy: -9, r: 3 }, glyph); el('circle', { cx: -9, cy: 9, r: 3 }, glyph); el('circle', { cx: 9, cy: -11, r: 3 }, glyph);
    el('text', { class: 'rb__repoT', y: portrait ? 14 : 18 }, repo).textContent = 'Repo';
    el('text', { class: 'rb__repoS', y: portrait ? 34 : 42 }, repo).textContent = 'source of intelligence';

    gNodes = el('g', { class: 'rb__nodes' }, svg);
    nodeEls = {};
    NODES.forEach(n => {
      const g = el('g', { class: 'rb__node', 'data-id': n.id }, gNodes);
      el('circle', { class: 'rb__halo', r: 20 }, g);
      el('circle', { class: 'rb__dot', r: 7 }, g);
      el('rect', { class: 'rb__sq', x: -9, y: -9, width: 18, height: 18, rx: 4 }, g);
      el('text', { class: 'rb__label' }, g);
      if (n.say) g.setAttribute('role', 'button');
      nodeEls[n.id] = g;
    });

    // Interaction: hover / focus / tap a part of the hub to read what it does
    [...Object.values(nodeEls), repo].forEach(g => {
      const on = () => focusNode(g.dataset.id);
      g.addEventListener('pointerenter', on);
      g.addEventListener('focus', on);
      g.addEventListener('click', on);
      g.addEventListener('pointerleave', () => focusNode(null));
      g.addEventListener('blur', () => focusNode(null));
    });

    apply(state, true);
  }

  function labelPos(anchor) {
    switch (anchor) {
      case 'l': return [-20, 5, 'end'];
      case 'r': return [20, 5, 'start'];
      case 'a': return [0, -22, 'middle'];
      default:  return [0, 34, 'middle'];
    }
  }

  function setLabel(n, g, s) {
    const t = g.querySelector('.rb__label');
    const [lx, ly, ta] = labelPos(L.pos[s][n.id][2]);
    t.setAttribute('x', lx); t.setAttribute('y', ly); t.setAttribute('text-anchor', ta);
    t.textContent = s === 'hub' ? (n.hub || n.stage) : (n.stage || n.hub);
  }

  let labelTimer;
  function apply(s, instant) {
    state = s;
    fig.dataset.state = s;
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.state === s)));
    svg.classList.toggle('is-instant', !!instant);

    NODES.forEach(n => {
      const g = nodeEls[n.id];
      const [x, y] = L.pos[s][n.id];
      g.style.transform = `translate(${x}px, ${y}px)`;
      const kind = s === 'hub' ? n.kind : (n.stage ? 'stage' : 'hidden');
      g.dataset.kind = kind;
      g.setAttribute('tabindex', s === 'hub' && n.say ? '0' : '-1');
    });

    // Labels change mid-move so they never collide in flight
    clearTimeout(labelTimer);
    svg.classList.add('is-moving');
    const swap = () => { NODES.forEach(n => setLabel(n, nodeEls[n.id], s)); svg.classList.remove('is-moving'); };
    if (instant) swap(); else labelTimer = setTimeout(swap, 480);

    drawWires(s, instant);
    focusNode(null);
  }

  function edgePoint(n, s) {
    const [x] = L.pos[s][n.id], R = L.repo;
    const list = n.kind === 'plug' ? PLUGS : SKILLS, idx = list.indexOf(n.id);
    if (!portrait) {
      if (n.kind === 'person') return [R.x + (x - R.x) * .55, R.y + R.h / 2];
      const side = n.kind === 'plug' ? -1 : 1;
      return [R.x + side * R.w / 2, R.y - R.h / 2 + 26 + idx * (R.h - 52) / (list.length - 1)];
    }
    if (n.kind === 'person') return [R.x + (x < R.x ? -1 : 1) * R.w / 2, R.y];
    const col = idx % 2 ? 1 : -1, row = Math.floor(idx / 2);
    const side = n.kind === 'plug' ? -1 : 1;
    return [R.x + col * (8 + row * 12), R.y + side * R.h / 2];
  }

  function drawWires(s, instant) {
    // Retire the old set
    [...gWires.children].forEach(c => { c.classList.add('is-out'); setTimeout(() => c.remove(), 500); });
    const set = el('g', { class: 'rb__set' + (instant ? ' is-in' : '') }, gWires);
    const P = L.pos[s];
    const seg = (d, cls, id, arrow) => {
      const p = el('path', { d, class: 'rb__wire ' + cls, pathLength: 1, 'data-for': id || '' }, set);
      if (arrow) p.setAttribute('marker-end', 'url(#rb-arrow)');
      return p;
    };

    if (s === 'linear') {
      for (let i = 0; i < STAGES.length - 1; i++) {
        const [x1, y1] = P[STAGES[i].id], [x2, y2] = P[STAGES[i + 1].id];
        portrait ? seg(`M${x1} ${y1 + 16} L${x2} ${y2 - 16}`, 'w-stage', '', true)
                 : seg(`M${x1 + 16} ${y1} L${x2 - 16} ${y2}`, 'w-stage', '', true);
      }
    } else if (s === 'agile') {
      const cx = portrait ? 200 : 500, cy = portrait ? 380 : 300, r = portrait ? 120 : 190, k = STAGES.length;
      const gap = (portrait ? 16 : 13) * Math.PI / 180;
      for (let i = 0; i < k; i++) {
        const a1 = (-90 + i * 60) * Math.PI / 180 + gap, a2 = (-90 + (i + 1) * 60) * Math.PI / 180 - gap;
        seg(`M${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}`, 'w-stage', '', true);
      }
    } else {
      NODES.filter(n => n.kind === 'plug' || n.kind === 'skill' || n.kind === 'person').forEach(n => {
        const [x, y] = P[n.id], [ex, ey] = edgePoint(n, s);
        let d;
        if (n.kind === 'person') {
          d = portrait ? `M${ex} ${ey} L${x + (x < 200 ? 12 : -12)} ${y}` : `M${ex} ${ey} L${x} ${y - 14}`;
        } else if (!portrait) {
          const sx = x + (x < L.repo.x ? 14 : -14), mx = (sx + ex) / 2;
          d = n.kind === 'plug' ? `M${sx} ${y} C${mx} ${y}, ${mx} ${ey}, ${ex} ${ey}` : `M${ex} ${ey} C${mx} ${ey}, ${mx} ${y}, ${sx} ${y}`;
        } else {
          // Leave each node sideways into the centre channel, then run straight to the repo
          const sx = x + (x < L.repo.x ? 14 : -14);
          d = n.kind === 'plug' ? `M${sx} ${y} C${ex} ${y}, ${ex} ${y}, ${ex} ${ey}` : `M${ex} ${ey} C${ex} ${y}, ${ex} ${y}, ${sx} ${y}`;
        }
        seg(d, 'w-' + n.kind, n.id, false);
        // Particles: context flows into the repo from plugs, and out through skills
        if (!reduce && n.kind !== 'person') {
          const dot = el('circle', { r: portrait ? 2.6 : 3, class: 'rb__pulse p-' + n.kind, 'data-for': n.id }, set);
          el('animateMotion', { dur: (2.2 + Math.random() * 1.2).toFixed(2) + 's', repeatCount: 'indefinite', begin: (-Math.random() * 3).toFixed(2) + 's', path: d }, dot);
        }
      });
    }
    if (!instant) requestAnimationFrame(() => requestAnimationFrame(() => set.classList.add('is-in')));
  }

  function focusNode(id) {
    svg.classList.toggle('is-focus', !!id && state === 'hub');
    Object.values(nodeEls).forEach(g => g.classList.toggle('is-on', g.dataset.id === id));
    repo.classList.toggle('is-on', id === 'repo' || (!!id && state === 'hub'));
    gWires.querySelectorAll('[data-for]').forEach(w => w.classList.toggle('is-on', w.dataset.for === id));
    if (id && state === 'hub') {
      const n = NODES.find(n => n.id === id);
      const name = id === 'repo' ? 'Repo.' : (n.hub + '.');
      const kind = id === 'repo' ? '' : n.kind === 'plug' ? 'Plug · ' : n.kind === 'skill' ? 'Skill · ' : 'People · ';
      cap.innerHTML = `<b>${name}</b> <span class="rb__kind">${kind}</span>${id === 'repo' ? REPO_SAY : n.say}`;
    } else {
      cap.innerHTML = `<b>${CAPTIONS[state][0]}</b> ${CAPTIONS[state][1]}`;
    }
  }

  tabs.forEach(t => t.addEventListener('click', () => { touched = true; clearTimeout(auto); if (t.dataset.state !== state) apply(t.dataset.state); }));

  // First view plays the story once: line → loop → rebundled
  let auto;
  function play() {
    if (touched) return;
    auto = setTimeout(() => { if (touched) return; apply('agile');
      auto = setTimeout(() => { if (!touched) apply('hub'); }, 2800);
    }, 1600);
  }

  build();
  if (reduce) { apply('hub', true); }
  else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); play(); } }, { threshold: .45 });
    io.observe(fig);
  } else { apply('hub', true); }

  // Rebuild only when crossing the phone breakpoint
  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { if ((fig.clientWidth < 640) !== portrait) build(); }, 150);
  });
})();
