/* ─────────────────────────────────────────────────────────
   OneSearch-V2  |  main.js
   ───────────────────────────────────────────────────────── */

/* ══ Navbar: add .scrolled shadow when page scrolls ══ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const updateNavbar = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ══ Mobile nav toggle ══ */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close on any link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
})();

/* ══ Smooth active nav link highlight ══ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ══ Copy BibTeX ══ */
function copyBibtex() {
  const el  = document.getElementById('bibtexContent');
  const btn = document.getElementById('copyBibtex');
  if (!el || !btn) return;

  const text = el.textContent;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showCopied(btn));
  } else {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showCopied(btn); } catch (_) {}
    document.body.removeChild(ta);
  }
}

function showCopied(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg> Copied!`;
  btn.classList.add('copied');
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.classList.remove('copied');
  }, 2200);
}

/* ══ Scroll-reveal animation ══ */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const targets = [
    '.feature-card',
    '.finding-card',
    '.innovation-section',
    '.figure-card',
    '.abstract-card',
    '.bibtex-card',
    '.table-wrapper',
    '.hero-stats',
    '.reward-card',
    '.mini-card',
  ];

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      // Start invisible
      el.style.opacity = '0';
      revealObserver.observe(el);
    });
  });

  // Stagger cards in a grid
  document.querySelectorAll('.cards-grid').forEach(grid => {
    grid.querySelectorAll(':scope > *').forEach((card, i) => {
      card.style.animationDelay = `${i * 80}ms`;
    });
  });
})();

/* ══ PDF figure fallback: try loading as <img> first for comparison.pdf ══ */
(function fixPdfFigures() {
  document.querySelectorAll('img[src$=".pdf"]').forEach(img => {
    img.addEventListener('error', function () {
      // Already handled by onerror attr in HTML
    });
  });
})();

/* ══ Smooth number counter for hero stats ══ */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-value');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el   = entry.target;
      const text = el.textContent.trim();
      // Only animate values like "+3.98%"
      const match = text.match(/^([+\-]?)(\d+\.?\d*)(.*)/);
      if (!match) return;

      const sign   = match[1];
      const target = parseFloat(match[2]);
      const suffix = match[3];
      const start  = 0;
      const duration = 1200;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = start + (target - start) * eased;
        el.textContent = sign + value.toFixed(target < 10 ? 2 : 0) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
