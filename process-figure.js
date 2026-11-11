// To process or not to — same principles, different dosage.
// One track from start to ship. Each context spends that time differently across the six principles.
(() => {
  const fig = document.getElementById('dosage');
  if (!fig) return;
  const track = fig.querySelector('.pd__track');
  const cap = fig.querySelector('.pd__cap');
  const passesEl = fig.querySelector('.pd__passes');
  const tabs = [...fig.querySelectorAll('.pd__tab')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const P = [
    ['Seek clarity', 'Go looking for what is actually going on before deciding what to do about it.'],
    ['Ask', 'Ask the questions that change the answer: why, for whom, and how it needs to feel.'],
    ['Converge', 'Narrow down. Choose a direction and say what you are giving up.'],
    ['Build', 'Make it real enough to learn from.'],
    ['Break', 'Test it, stress it, put it in front of people. Find where it fails.'],
    ['Come back', 'Return with what you learned, then go again or ship.'],
  ];

  const CTX = {
    medical: {
      wrong: 5, change: 5,
      say: 'High stakes, hard to undo. Research hard, know everything, verify, then move: one long, careful pass.',
      passes: [[22, 20, 12, 16, 20, 10]],
    },
    fintech: {
      wrong: 4, change: 3,
      say: 'Money and trust are on the line, and regulators are watching. Front-load clarity, then iterate inside clear guardrails.',
      passes: [[12, 12, 8, 10, 10, 4], [6, 6, 6, 10, 10, 4]],
    },
    enterprise: {
      wrong: 3, change: 2,
      say: 'Businesses depend on it, but software is cheap to change. Learn early, then iterate with the customers who use it every day.',
      passes: [[8, 8, 6, 8, 7, 3], [4, 4, 4, 8, 7, 3], [3, 3, 3, 7, 6, 3]],
    },
    consumer: {
      wrong: 2, change: 1,
      say: 'Cheap to make and cheap to break. Be scrappy: build, put it in front of people, come back, repeat.',
      passes: [[4, 3, 3, 6, 5, 2], [2, 2, 2, 6, 5, 2], [2, 2, 2, 6, 5, 2], [2, 2, 2, 6, 5, 2], [2, 2, 2, 6, 5, 2]],
    },
  };
  const MAX_PASSES = 5;

  // Build every possible segment once; contexts only change how much room each one gets
  const segs = [];
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    P.forEach((p, i) => {
      const s = document.createElement('span');
      s.className = 'pd__seg';
      s.dataset.p = i;
      s.dataset.pass = pass;
      if (i === 0) s.classList.add('is-start');
      s.addEventListener('pointerenter', () => explain(s));
      s.addEventListener('pointerleave', () => explain(null));
      track.appendChild(s);
      segs.push(s);
    });
  }

  const meters = {};
  fig.querySelectorAll('.pd__dots').forEach(d => {
    d.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
    meters[d.dataset.meter] = d;
  });

  let current = 'medical';
  function apply(key) {
    current = key;
    const c = CTX[key];
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.ctx === key)));
    segs.forEach(s => {
      const pass = c.passes[+s.dataset.pass];
      const w = pass ? pass[+s.dataset.p] : 0;
      s.style.flexGrow = w;
      s.classList.toggle('is-off', !w);
    });
    const n = c.passes.length;
    passesEl.textContent = n === 1 ? '1 pass' : `${n} passes`;
    [...meters.wrong.children].forEach((d, i) => d.classList.toggle('on', i < c.wrong));
    [...meters.change.children].forEach((d, i) => d.classList.toggle('on', i < c.change));
    explain(null);
  }

  function explain(s) {
    fig.classList.toggle('is-focus', !!s);
    segs.forEach(x => x.classList.toggle('is-on', !!s && x.dataset.p === s.dataset.p));
    fig.querySelectorAll('.pd__legend li').forEach(li => li.classList.toggle('is-on', !!s && li.dataset.p === s.dataset.p));
    if (s) {
      const [name, say] = P[+s.dataset.p];
      const n = CTX[current].passes.length;
      cap.innerHTML = `<b>${name}.</b> ${n > 1 ? `<span class="pd__kind">Pass ${+s.dataset.pass + 1} of ${n} · </span>` : ''}${say}`;
    } else {
      const label = tabs.find(t => t.dataset.ctx === current).textContent;
      cap.innerHTML = `<b>${label}.</b> ${CTX[current].say}`;
    }
  }

  // Legend hover highlights a principle everywhere it appears
  fig.querySelectorAll('.pd__legend li').forEach(li => {
    li.addEventListener('pointerenter', () => explain(segs.find(s => s.dataset.p === li.dataset.p && s.dataset.pass === '0')));
    li.addEventListener('pointerleave', () => explain(null));
  });

  let touched = false, auto;
  tabs.forEach(t => t.addEventListener('click', () => { touched = true; clearTimeout(auto); apply(t.dataset.ctx); }));

  apply('medical');

  // First view: walk from the most careful context to the scrappiest, once
  if (!reduce && 'IntersectionObserver' in window) {
    const order = ['fintech', 'enterprise', 'consumer'];
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      let k = 0;
      const step = () => { if (touched || k >= order.length) return; apply(order[k++]); auto = setTimeout(step, 2600); };
      auto = setTimeout(step, 2200);
    }, { threshold: .5 });
    io.observe(fig);
  }
})();
