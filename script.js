/**
 * portfolio/script.js
 * Author: Your Name · IIIT Kalyani
 *
 * Modules:
 *  1. Loader
 *  2. Custom Cursor
 *  3. Navbar (scroll & hamburger)
 *  4. Scroll Progress Bar
 *  5. Hero Canvas — Constellation
 *  6. Typing Animation
 *  7. Scroll Reveal
 *  8. Skill Bar Animation
 *  9. Back To Top
 * 10. Contact Form (mock send)
 * 11. Smooth Scroll for anchor links
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. LOADER
   ═══════════════════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after fill animation completes (~1.7 s)
  const DELAY = 1800;
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, DELAY);
  });

  // Safety: hide if page loads slowly
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), DELAY + 400);
  });
})();

/* ═══════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════ */
(function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');
  if (!cursor || !cursorTrail) return;

  // Only for pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  // Track raw mouse
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smoothly trail the cursor dot
  function animateTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, input, textarea, .tool-badge, .project-card, .contact-link-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovered');
      cursorTrail.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovered');
      cursorTrail.classList.remove('hovered');
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   3. NAVBAR — scroll state & mobile hamburger
   ═══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Add .scrolled class after scrolling 60 px
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct.toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   5. HERO CANVAS — Constellation / Particle Field
      Signature visual: mouse-reactive star network
   ═══════════════════════════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse;

  /* ── Config ── */
  const CONFIG = {
    count:         80,
    maxRadius:     2,
    speed:         0.4,
    connectDist:   130,
    mouseRadius:   180,
    lineOpacity:   0.15,
    colors:        ['#6C63FF', '#00D4FF', '#FF6B9D'],
  };

  mouse = { x: -999, y: -999 };

  /* ── Resize handler ── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    if (particles) particles.forEach((p) => { p.x = Math.random() * W; p.y = Math.random() * H; });
  }

  /* ── Particle factory ── */
  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.r  = Math.random() * CONFIG.maxRadius + 0.5;
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  }
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  /* ── Init particles ── */
  function init() {
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  /* ── Draw connections ── */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      // Mouse connection
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < CONFIG.mouseRadius) {
        const alpha = (1 - md / CONFIG.mouseRadius) * 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = a.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth   = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Particle-to-particle connections
      for (let j = i + 1; j < particles.length; j++) {
        const b  = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONFIG.connectDist) {
          const alpha = (1 - d / CONFIG.connectDist) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  /* ── Render loop ── */
  let rafId;
  function render() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawConnections();
    rafId = requestAnimationFrame(render);
  }

  /* ── Pause when not visible (perf) ── */
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { rafId = requestAnimationFrame(render); }
    else { cancelAnimationFrame(rafId); }
  });
  observer.observe(canvas);

  /* ── Mouse / touch tracking ── */
  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  /* ── Boot ── */
  resize();
  init();
  window.addEventListener('resize', resize, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   6. TYPING ANIMATION
   ═══════════════════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Aspiring Software Developer',
    'Frontend Web Developer',
    'Problem Solver',
    'ECE Engineer at IIIT Kalyani',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  const SPEED_TYPE   = 85;
  const SPEED_DELETE = 45;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 400;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
      setTimeout(type, SPEED_TYPE);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting  = false;
        phraseIdx   = (phraseIdx + 1) % phrases.length;
        setTimeout(type, PAUSE_START);
        return;
      }
      setTimeout(type, SPEED_DELETE);
    }
  }

  // Start after loader delay
  setTimeout(type, 2000);
})();

/* ═══════════════════════════════════════════════════════════
   7. SCROLL REVEAL
   ═══════════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => obs.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   8. SKILL BAR ANIMATION
   ═══════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-item');
  if (!bars.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item  = entry.target;
          const level = item.dataset.level || '0';
          const fill  = item.querySelector('.skill-fill');
          if (fill) {
            // Short delay so CSS transition fires after paint
            requestAnimationFrame(() => { fill.style.width = level + '%'; });
          }
          obs.unobserve(item);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((b) => obs.observe(b));
})();

/* ═══════════════════════════════════════════════════════════
   9. BACK TO TOP
   ═══════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ═══════════════════════════════════════════════════════════
   10. CONTACT FORM (mock send — swap for real API/EmailJS)
   ═══════════════════════════════════════════════════════════ */
(function initContactForm() {
  const sendBtn = document.getElementById('send-btn');
  const nameEl  = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const msgEl   = document.getElementById('contact-message');
  const success = document.getElementById('form-success');
  const label   = document.getElementById('send-label');

  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    // Basic validation
    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();
    const msg   = msgEl.value.trim();

    if (!name || !email || !msg) {
      // Shake inputs that are empty
      [nameEl, emailEl, msgEl].forEach((el) => {
        if (!el.value.trim()) {
          el.style.borderColor = '#FF6B9D';
          el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    // Simulate sending (replace with real API call)
    sendBtn.disabled   = true;
    label.textContent  = 'Sending…';

    setTimeout(() => {
      sendBtn.disabled  = false;
      label.textContent = 'Send Message';
      success.hidden    = false;
      nameEl.value = emailEl.value = msgEl.value = '';

      // Hide success after 5 s
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 1400);
  });
})();

/* ═══════════════════════════════════════════════════════════
   11. SMOOTH SCROLL for anchor links
   ═══════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();