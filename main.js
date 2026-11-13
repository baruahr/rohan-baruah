(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ── Start the load-in once fonts are ready (so "Clarity" resolves in its real face)
  const ready = () => requestAnimationFrame(() => body.classList.add('is-ready'));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(ready);
  } else { ready(); }

  // ── Scroll-linked light for Stories; the room goes dark for the Skill
  const stage = document.querySelector('.stories__stage');
  const skill = document.querySelector('.fold--skill');

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;

    // Light rises from below the sentence as Stories scrolls into view
    const r = stage.getBoundingClientRect();
    const p = reduce ? 1 : clamp((vh * .9 - r.top) / (vh * .7));
    stage.style.setProperty('--lit', easeInOut(p).toFixed(3));

    // Flip the room to dark for the Skill fold
    const s = skill.getBoundingClientRect();
    body.classList.toggle('is-dark', s.top < vh * .55 && s.bottom > vh * .45);
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // ── Essay thumbnails: a small light follows the cursor
  document.querySelectorAll('.essay__thumb').forEach(t => {
    t.addEventListener('pointermove', ev => {
      const b = t.getBoundingClientRect();
      t.style.setProperty('--mx', ((ev.clientX - b.left) / b.width * 100).toFixed(1) + '%');
      t.style.setProperty('--my', ((ev.clientY - b.top) / b.height * 100).toFixed(1) + '%');
    });
  });

  // ── "Meaningful AI" thumbnail: a field of possibilities; on hover the noise settles toward the signal
  const field = document.querySelector('.thumb--ai .t-field');
  if (field) {
    const NS = 'http://www.w3.org/2000/svg';
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let x = 22; x < 400; x += 22) {
      for (let y = 18; y < 300; y += 22) {
        const jx = x + (rnd() - .5) * 8, jy = y + (rnd() - .5) * 8;
        const dx = 200 - jx, dy = 150 - jy, d = Math.hypot(dx, dy);
        if (d < 72) continue; // keep the centre clear
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', jx.toFixed(1)); c.setAttribute('cy', jy.toFixed(1));
        c.setAttribute('r', (0.9 + rnd() * 1.1).toFixed(2));
        c.setAttribute('opacity', (0.16 + rnd() * 0.3).toFixed(2));
        const pull = clamp(1 - (d - 72) / 240) * 0.28 + 0.06;
        c.style.setProperty('--dx', (dx * pull).toFixed(1) + 'px');
        c.style.setProperty('--dy', (dy * pull).toFixed(1) + 'px');
        field.appendChild(c);
      }
    }
  }

  // ── Gentle reveal for content below the fold
  const targets = document.querySelectorAll(
    '.essay, .skill__copy > *, .skill__pick, .skillcard, .skill__meta, .work__inner > *, .logos__label, .logos__grid li, .words__head'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    const siblings = [...el.parentElement.children];
    el.style.setProperty('--d', (Math.min(siblings.indexOf(el), 10) * 0.07).toFixed(2) + 's');
  });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('is-in'));
  }

  // ── In their words: one recommendation at a time
  const words = document.querySelector('.fold--words');
  if (words) {
    const recs = [...words.querySelectorAll('.rec')];
    const nEl = words.querySelector('.words__n');
    const bar = words.querySelector('.words__bar');
    const list = words.querySelector('.words__list');
    const pad = n => String(n).padStart(2, '0');
    words.querySelector('.words__total').textContent = pad(recs.length);

    const DWELL = 9000;
    let i = 0, t = 0, last = 0, visible = false, hovering = false;

    function show(next, announce) {
      const cur = recs[i];
      cur.querySelector('details')?.removeAttribute('open');
      i = (next + recs.length) % recs.length;
      recs.forEach((r, k) => {
        const on = k === i;
        r.classList.toggle('is-current', on);
        r.inert = !on;
        r.setAttribute('aria-hidden', String(!on));
      });
      nEl.textContent = pad(i + 1);
      list.setAttribute('aria-live', announce ? 'polite' : 'off');
      t = 0;
    }
    show(0);

    const paused = () => reduce || !visible || hovering || document.hidden ||
      words.contains(document.activeElement) && document.activeElement.matches(':focus-visible') ||
      recs[i].querySelector('details[open]');

    function tick(now) {
      const dt = last ? now - last : 0; last = now;
      if (!paused()) {
        t += dt;
        if (t >= DWELL) show(i + 1);
      }
      bar.style.setProperty('--t', Math.min(t / DWELL, 1).toFixed(4));
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    words.querySelectorAll('.words__btn').forEach(b =>
      b.addEventListener('click', () => show(i + Number(b.dataset.dir), true)));
    words.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') show(i + 1, true);
      if (e.key === 'ArrowLeft') show(i - 1, true);
    });

    const stageEl = words.querySelector('.words__stage');
    stageEl.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovering = true; });
    stageEl.addEventListener('pointerleave', () => { hovering = false; });

    // Swipe on touch
    let sx = null, sy = 0;
    stageEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stageEl.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(i + (dx < 0 ? 1 : -1), true);
      sx = null;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: .35 }).observe(stageEl);
    } else { visible = true; }
  }

  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
