(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  const menu = $('#menu'), burger = $('#burger');
  const toggleMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? '✕' : '☰';
  };
  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => e.key === 'Escape' && toggleMenu(false));

  /* Typing effect */
  const words = ['software developer', 'full-stack engineer', 'problem solver'];
  const typed = $('#typed');
  if (reduce) typed.textContent = words[0];
  else {
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = words[w];
      typed.textContent = word.slice(0, c += del ? -1 : 1);
      let wait = del ? 40 : 90;
      if (!del && c === word.length) { del = true; wait = 1400; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 400; }
      setTimeout(tick, wait);
    })();
  }

  /* Reveal sections, skill bars, counters */
  const countUp = el => {
    const end = +el.dataset.count; let n = 0;
    const step = () => { n = Math.min(end, n + Math.max(1, end / 40)); el.textContent = Math.round(n); if (n < end) requestAnimationFrame(step); };
    reduce ? (el.textContent = end) : step();
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.bar i', e.target).forEach(b => b.style.width = b.dataset.level + '%');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Project filter */
  const chips = $$('.chip'), cards = $$('.card'), empty = $('#empty');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => { c.classList.toggle('active', c === chip); c.setAttribute('aria-pressed', c === chip); });
    const f = chip.dataset.filter; let shown = 0;
    cards.forEach(card => { const show = f === 'all' || card.dataset.cat === f; card.classList.toggle('hide', !show); shown += show; });
    empty.hidden = shown > 0;
  }));

  /* Active nav link while scrolling */
  const links = $$('#menu a');
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section').forEach(s => spy.observe(s));

  /* Back to top */
  const top = $('#top');
  addEventListener('scroll', () => { top.hidden = scrollY < 600; }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* Contact form: validates, then opens the visitor's email app */
  const RECEIVER = 'riverofst6@gmail.com'; // change to your email
  const form = $('#form'), status = $('#formStatus');
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    msg: v => v.trim().length >= 10 || 'Write at least 10 characters.'
  };
  const check = id => {
    const input = $('#' + id), res = rules[id](input.value), label = input.closest('label');
    label.classList.toggle('err', res !== true);
    $('small', label).textContent = res === true ? '' : res;
    return res === true;
  };
  Object.keys(rules).forEach(id => $('#' + id).addEventListener('input', () => check(id)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!Object.keys(rules).map(check).every(Boolean)) { status.textContent = 'Fix the highlighted fields and try again.'; return; }
    const body = `${$('#msg').value}\n\nFrom: ${$('#name').value} (${$('#email').value})`;
    location.href = `mailto:${RECEIVER}?subject=${encodeURIComponent('Portfolio message from ' + $('#name').value)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app to send the message.';
    form.reset();
  });

  $('#year').textContent = new Date().getFullYear();
})();
