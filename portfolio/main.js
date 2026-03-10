/* ============================================================
   ALEX RIVERA — PORTFOLIO  |  main.js
   ============================================================

   PROMPT 7.1 — Intersection Observer scroll animations
   PROMPT 7.1 — Smooth scrolling for nav + CTA links
   PROMPT 7.1 — Active nav-link highlight on scroll
   PROMPT 7.2 — Glassmorphism navbar + hamburger menu
   PROMPT 3   — Custom cursor glow effect
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ───────────────────────────────────────────── */
  const $  = (sel)       => document.querySelector(sel);
  const $$ = (sel, root) => (root || document).querySelectorAll(sel);


  /* ===========================================================
     PROMPT 3 — Custom Cursor Glow
     Follows mouse with a smooth lag. Expands on hover over
     interactive elements. Hidden when mouse leaves window.
     =========================================================== */
  const cursor    = $('#cursor');
  const cursorDot = $('#cursorDot');

  if (cursor && cursorDot) {
    let mouseX = 0, mouseY = 0;
    let curX   = 0, curY   = 0;

    // Dot snaps instantly
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    // Ring lags behind with lerp
    function lerpCursor () {
      curX += (mouseX - curX) * 0.11;
      curY += (mouseY - curY) * 0.11;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      requestAnimationFrame(lerpCursor);
    }
    lerpCursor();

    // Expand ring on interactive elements
    const hoverTargets = $$('a, button, .skill-badge, .project-card, .tag');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // Hide when leaving viewport
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity    = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity    = '1';
      cursorDot.style.opacity = '1';
    });
  }


  /* ===========================================================
     PROMPT 7.2 — Sticky Navbar (glassmorphism on scroll)
     =========================================================== */
  const navbar = $('#navbar');

  function updateNavbar () {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run on load


  /* ===========================================================
     PROMPT 7.2 — Hamburger Mobile Menu
     Toggles .open on the nav links list and the button.
     Closes when a link is clicked.
     =========================================================== */
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');

  function openNav () {
    navToggle.classList.add('open');
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav () {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    navToggle.classList.contains('open') ? closeNav() : openNav();
  });

  // Close on any nav link click
  $$('.nav-link').forEach(link => link.addEventListener('click', closeNav));

  // Close if click outside the nav area
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navbar.contains(e.target)) {
      closeNav();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });


  /* ===========================================================
     PROMPT 7.1 — Intersection Observer Scroll Animations
     Watches .animate-on-scroll elements. Adds .animated when
     they enter the viewport (fade-in + slide-up from CSS).
     =========================================================== */
  const animEls = $$('.animate-on-scroll');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // fire once only
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animEls.forEach(el => observer.observe(el));

  // Trigger hero elements immediately on load (they're already in viewport)
  function triggerHero () {
    $$('.hero .animate-on-scroll').forEach((el, i) => {
      setTimeout(() => el.classList.add('animated'), 80 + i * 110);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerHero);
  } else {
    triggerHero();
  }


  /* ===========================================================
     PROMPT 7.1 — Smooth Scrolling
     Intercepts all anchor clicks for href="#section" and
     scrolls with an offset to account for the fixed navbar.
     =========================================================== */
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navH  = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68',
      10
    );
    const top = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
    closeNav();
  });


  /* ===========================================================
     PROMPT 7.1 — Active Nav Link Highlight
     Watches which section is currently in view and marks
     the corresponding nav link with .active.
     =========================================================== */
  const sections = $$('section[id]');
  const navItems = $$('.nav-link');

  function updateActiveNav () {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ===========================================================
     Bonus: Ticker pause on hover (lightweight, no extra deps)
     =========================================================== */
  const tickerTrack = $('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

})();
