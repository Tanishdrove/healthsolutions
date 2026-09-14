/* ============================================================
   P3 Health Solutions LLP — Main JavaScript
   ============================================================ */

'use strict';

/* ---------- Utility: query helpers ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. STICKY HEADER + ACTIVE NAV LINK
============================================================ */
(function initHeader() {
  const header    = $('#header');
  const navLinks  = $$('.nav__link');
  const sections  = $$('section[id]');

  // Scrolled class for shadow
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    highlightNav();
    toggleBackToTop();
  }, { passive: true });

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  // Initial call
  highlightNav();
})();

/* ============================================================
   2. MOBILE HAMBURGER MENU
============================================================ */
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close on link click
  $$('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#header')) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });
})();

/* ============================================================
   3. ANIMATED COUNTER
============================================================ */
(function initCounters() {
  const counters = $$('.stat-card__number[data-target]');
  if (!counters.length) return;

  let animated = false;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3); // cubic ease-out

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800; // ms
    const start   = performance.now();

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);
      const current  = Math.round(eased * target);

      // Format with comma for thousands
      el.textContent = current.toLocaleString('en-IN') + suffix;

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(c => animateCounter(c));
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = $('#stats');
  if (statsSection) observer.observe(statsSection);
})();

/* ============================================================
   4. TESTIMONIALS SLIDER
============================================================ */
(function initTestimonialsSlider() {
  const track    = $('#testimonialsTrack');
  const dotsWrap = $('#testimonialsDots');
  const prevBtn  = $('#prevBtn');
  const nextBtn  = $('#nextBtn');

  if (!track) return;

  const cards    = $$('.testimonial-card', track);
  const total    = cards.length;
  let   current  = 0;
  let   autoTimer;

  // Determine how many cards are visible
  function visibleCount() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  let perView = visibleCount();

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = total - perView + 1;
    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.className  = 'testimonial-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Testimonial ${i + 1}`);
      btn.setAttribute('aria-selected', String(i === 0));
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    $$('.testimonial-dot', dotsWrap).forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  }

  function goTo(index) {
    const maxIndex = total - perView;
    current = Math.max(0, Math.min(index, maxIndex));

    // Card width + gap
    const cardWidth = cards[0].offsetWidth;
    const gap       = 28;
    const offset    = current * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!$('#testimonials').contains(document.activeElement)) return;
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  // Auto-play
  function startAuto() {
    autoTimer = setInterval(() => {
      const maxIndex = total - perView;
      if (current >= maxIndex) goTo(0);
      else next();
    }, 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPer = visibleCount();
      if (newPer !== perView) {
        perView = newPer;
        current = 0;
        buildDots();
        goTo(0);
      }
    }, 200);
  });

  // Init
  buildDots();
  goTo(0);
  startAuto();
})();

/* ============================================================
   5. INTERSECTION OBSERVER — FADE IN ANIMATIONS
============================================================ */
(function initFadeIn() {
  // Add class to animatable elements
  const targets = [
    ...$$('.service-card'),
    ...$$('.package-card'),
    ...$$('.why-card'),
    ...$$('.testimonial-card'),
    ...$$('.gallery-item'),
    ...$$('.stat-card'),
    ...$$('.about__content'),
    ...$$('.about__visual'),
    ...$$('.contact__info'),
    ...$$('.contact__form-wrap'),
  ];

  targets.forEach(el => el.classList.add('fade-in-up'));

  // Add stagger to grids
  $$('.services__grid, .packages__grid, .why-us__grid, .stats__grid, .gallery__grid').forEach(grid => {
    grid.classList.add('stagger');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. BACK TO TOP BUTTON
============================================================ */
function toggleBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 500);
}

(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   7. CONTACT FORM VALIDATION & SUBMISSION
============================================================ */
(function initContactForm() {
  const form      = $('#contactForm');
  const successEl = $('#formSuccess');
  const submitBtn = $('#submitBtn');

  if (!form) return;

  // Set min date for date picker to today
  const dateInput = $('#date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Field validation rules
  const rules = {
    name:  { required: true, minLen: 2, message: 'Please enter your full name (at least 2 characters).' },
    phone: { required: true, pattern: /^[+\d\s\-()]{7,15}$/, message: 'Please enter a valid phone number.' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address.' },
    date:  { required: true, message: 'Please choose a preferred date.' },
    test:  { required: true, message: 'Please select a test or package.' },
  };

  function validateField(fieldId) {
    const input  = form.elements[fieldId];
    const error  = $(`#${fieldId}Error`);
    const rule   = rules[fieldId];

    if (!input || !rule || !error) return true;

    const value = input.value.trim();
    let msg = '';

    if (rule.required && !value) {
      msg = rule.message;
    } else if (rule.minLen && value.length < rule.minLen) {
      msg = rule.message;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      msg = rule.message;
    }

    error.textContent = msg;
    input.classList.toggle('error', !!msg);
    return !msg;
  }

  // Live validation on blur
  Object.keys(rules).forEach(id => {
    const input = form.elements[id];
    if (input) {
      input.addEventListener('blur', () => validateField(id));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(id);
      });
    }
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validFields = Object.keys(rules).map(id => validateField(id));
    const isValid     = validFields.every(Boolean);

    if (!isValid) {
      // Focus the first error field
      const firstError = form.querySelector('.form-input.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate async submission
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Submitting…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Submit Booking Request';

      // Show success
      if (successEl) {
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { successEl.hidden = true; }, 6000);
      }
    }, 1200);
  });
})();

/* ============================================================
   8. FOOTER COPYRIGHT YEAR
============================================================ */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   9. SMOOTH SCROLL FOR ALL ANCHOR LINKS
============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const headerH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-h'), 10) || 72;

    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();
