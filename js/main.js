(() => {
  const header = document.querySelector('.site-header');
  const revealEls = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const heroArt = document.querySelector('.hero-art');

  // Sticky glass header
  const headerTick = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', headerTick, {passive:true});
  headerTick();

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el => observer.observe(el));

  // Count-up statistics
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const duration = 1200;
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * ease(p));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, {threshold:0.6});
  counters.forEach(c => countObserver.observe(c));

  // Desktop custom cursor
  if (window.matchMedia('(pointer:fine)').matches) {
    let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const cursorLoop = () => {
      rx += (mx-rx)*.13; ry += (my-ry)*.13;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();
    document.querySelectorAll('a,button,.service-card,.tech-pill,.project').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; });
      el.addEventListener('mouseleave', () => { ring.style.width='34px'; ring.style.height='34px'; });
    });
  }

  // Subtle hero parallax
  if (heroArt && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth - .5);
      const y = (e.clientY / innerHeight - .5);
      heroArt.style.transform = `translate3d(${x*18}px, calc(-50% + ${y*14}px), 0)`;
    }, {passive:true});
  }

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (!window.matchMedia('(pointer:fine)').matches) return;
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*.12}px, ${y*.12}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });

  // Mobile menu
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    header.classList.toggle('menu-open', !open);
  });

  // Smooth anchor navigation and close mobile menu
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      header.classList.remove('menu-open');
      menu?.setAttribute('aria-expanded','false');
    });
  });

  // Active navigation section
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+entry.target.id));
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s => activeObserver.observe(s));
})();
