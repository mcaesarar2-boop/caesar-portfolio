/* ── Scroll reveal ─────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries, observer) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
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
if (heroEl && stickyBar) stickyObserver.observe(heroEl);

/* ── Mobile nav ────────────────────────────────────────── */
const hamburger  = document.querySelector('.nav-hamburger');
const mobileNav  = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

function closeNav() {
  if (hamburger && mobileNav) {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* Close nav when clicking outside */
document.addEventListener('click', e => {
  if (mobileNav && mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      hamburger && !hamburger.contains(e.target)) {
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

/* ── Tech Stack Modal (Pop-up) ─────────────────────────── */
const techChips = document.querySelectorAll('.tech-chip');
const techModal = document.getElementById('techModal');
const techModalOverlay = document.getElementById('techModalOverlay');
const techModalClose = document.getElementById('techModalClose');
const techModalTitle = document.getElementById('techModalTitle');
const techModalList = document.getElementById('techModalList');

if (techChips.length > 0 && techModal) {
  function openModal(title, skills) {
    // Set judul pop-up
    techModalTitle.textContent = title;
    
    // Potong teks dari data-skills dan map langsung ke HTML secara fluent
    techModalList.innerHTML = skills.split(',')
      .map(skill => `<li>${skill.trim()}</li>`)
      .join('');

    // Munculin pop-up
    techModal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Kunci background biar gak bisa di-scroll
  }

  function closeModal() {
    techModal.classList.remove('open');
    document.body.style.overflow = ''; // Balikin scroll background
  }

  // Pasang tombol klik di semua tech-chip
  techChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const title = chip.getAttribute('data-title');
      const skills = chip.getAttribute('data-skills');
      openModal(title, skills);
    });
  });

  // Tombol X dan klik di luar kotak buat nutup pop-up
      if (techModalClose) techModalClose.addEventListener('click', closeModal);
      if (techModalOverlay) techModalOverlay.addEventListener('click', closeModal);
}

/* ── World Clocks Logic ──────────────────────────────────────────────── */
// Cache formatter di luar fungsi agar tidak membebani memory (Garbage Collection) tiap detik
const options = { hour: '2-digit', minute: '2-digit', hour12: false };
const formatJkt = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'Asia/Jakarta' });
const formatLA = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'America/Los_Angeles' });
const formatMecca = new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'Asia/Riyadh' });

const jktEl = document.getElementById('clock-jkt');
const laEl = document.getElementById('clock-la');
const meccaEl = document.getElementById('clock-mecca');

function updateWorldClocks() {
  try {
    const now = new Date();
    if (jktEl) jktEl.textContent = formatJkt.format(now);
    if (laEl) laEl.textContent = formatLA.format(now);
    if (meccaEl) meccaEl.textContent = formatMecca.format(now);
  } catch (error) {
    console.error("Error updating clocks:", error);
  }
}

// Jalankan langsung pas halaman kebuka, lalu update tiap 1 detik
if (jktEl || laEl || meccaEl) {
  updateWorldClocks();
  setInterval(updateWorldClocks, 1000);
}