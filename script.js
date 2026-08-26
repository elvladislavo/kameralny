// ==========================================================
// KAMERALNY Barbershop — site interactions
//
// NOTE: the services list used to be built here from a JS array.
// It now lives directly in index.html so that search engines,
// social scrapers and AI crawlers can read it without executing
// JavaScript. Edit the services in index.html, not here.
// ==========================================================

// ---------- Stamp SVG (K-4 badge, circular text) ----------
const stampSVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pieczęć Kameralny Barbershop">
  <defs>
    <path id="circlePath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
  </defs>
  <circle class="stamp-bg" cx="100" cy="100" r="98"/>
  <circle class="stamp-ring" cx="100" cy="100" r="98" fill="none" stroke-width="2"/>
  <text class="stamp-ink" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="12.4" letter-spacing="2.5">
    <textPath href="#circlePath" startOffset="0%">BARBERSHOP · KAMERALNY · BARBERSHOP · KAMERALNY ·</textPath>
  </text>
  <text class="stamp-ink" x="100" y="122" font-family="Anton, sans-serif" font-size="58" text-anchor="middle">K-4</text>
</svg>`;

document.querySelectorAll('.stamp').forEach(el => { el.innerHTML = stampSVG; });

// ---------- Ticker: build a seamless, always-moving loop ----------
// Duplicates the item set until one "half" is wider than the viewport,
// then mirrors it so the -50% keyframe loops with no visible jump or gap.
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;

  if (!track.dataset.originalHtml) {
    track.dataset.originalHtml = track.innerHTML;
  }
  const unit = track.dataset.originalHtml;

  track.innerHTML = unit;
  // Grow one half until it comfortably exceeds the screen width.
  let guard = 0;
  while (track.scrollWidth < window.innerWidth && guard < 20) {
    track.innerHTML += unit;
    guard++;
  }

  const halfWidth = track.scrollWidth;
  track.innerHTML += track.innerHTML; // mirror for the seamless -50% loop

  // Keep a constant pixel-per-second speed regardless of how much we duplicated.
  const PIXELS_PER_SECOND = 60;
  track.style.animationDuration = (halfWidth / PIXELS_PER_SECOND) + 's';
}

buildTicker();

let tickerResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(tickerResizeTimer);
  tickerResizeTimer = setTimeout(buildTicker, 200);
});

// ---------- Header scroll state ----------
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ---------- Mobile menu ----------
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Otwórz menu');
  }));
}

// ---------- Scroll reveal ----------
// Content is visible in the HTML regardless; this only animates it in.
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
