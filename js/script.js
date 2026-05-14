/* ── Scroll reveal ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Trigger hero reveals immediately */
document.querySelectorAll('#hero .reveal').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 80);
});

/* ── Sticky bar ────────────────────────────────────────── */
const stickyBar  = document.getElementById('stickyBar');
const heroEl     = document.getElementById('hero');

const stickyObserver = new IntersectionObserver(
  ([entry]) => stickyBar.classList.toggle('visible', !entry.isIntersecting),
  { threshold: 0.1 }
);
stickyObserver.observe(heroEl);

/* ── Mobile nav ────────────────────────────────────────── */
const hamburger  = document.querySelector('.nav-hamburger');
const mobileNav  = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

function closeNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Close nav when clicking outside */
document.addEventListener('click', e => {
  if (mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeNav();
  }
});

/* ── Active nav link on scroll ─────────────────────────── */
const sections = document.querySelectorAll('section[id], main > section');
const navLinks = document.querySelectorAll('.global-nav__links a');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.style.color = '');
        const active = document.querySelector(
          `.global-nav__links a[href="#${entry.target.id}"]`
        );
        if (active) active.style.color = '#ffffff';
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px' }
);
document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

