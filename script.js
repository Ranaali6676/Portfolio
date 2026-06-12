/**
 * RANA ALI ZAFAR — PORTFOLIO JAVASCRIPT
 * Handles: navigation, typing effect, scroll reveal,
 *          skill bar animation, contact form, back-to-top
 */

'use strict';

/* ─── 1. UTILITY ──────────────────────────────────────── */

/**
 * Returns true if the user prefers reduced motion.
 */
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── 2. NAVIGATION ───────────────────────────────────── */

(function initNavigation() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = navLinks.querySelectorAll('a');

  // Scroll: add .scrolled class + active link highlight
  function onScroll() {
    // Sticky bg
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active section highlight
    const scrollPos = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile menu toggle
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open', !expanded);
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ─── 3. HERO TYPING EFFECT ───────────────────────────── */

(function initTypingEffect() {
  const el = document.getElementById('terminalText');
  if (!el) return;

  const phrases = [
    'cloud engineer --platform huawei',
    'ai_developer --stack python+ml',
    'frontend build --framework js',
    'deploying infrastructure...',
    'solving real-world problems',
  ];

  if (prefersReducedMotion()) {
    // Show static text if motion is reduced
    el.textContent = phrases[0];
    return;
  }

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        // Pause before deleting
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
    }

    const speed = isDeleting ? 40 : 70;
    setTimeout(type, speed);
  }

  // Short delay before starting
  setTimeout(type, 900);
})();

/* ─── 4. SCROLL REVEAL ────────────────────────────────── */

(function initScrollReveal() {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  // Stagger cards inside the same grid
  document.querySelectorAll(
    '.skills-grid, .projects-grid, .cert-grid, .achievements-grid, .edu-grid'
  ).forEach(grid => {
    grid.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─── 5. SKILL BAR ANIMATION ──────────────────────────── */

(function initSkillBars() {
  if (prefersReducedMotion()) {
    // Immediately fill all bars
    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.style.getPropertyValue('--pct');
    });
    return;
  }

  const section = document.getElementById('skills');
  if (!section) return;

  let animated = false;

  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        // Small delay so the reveal animation can start first
        setTimeout(() => {
          document.querySelectorAll('.skill-fill').forEach(bar => {
            bar.classList.add('animate');
          });
        }, 300);
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
})();

/* ─── 6. CONTACT FORM ─────────────────────────────────── */

(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const statusEl   = document.getElementById('formStatus');
  const submitBtn  = document.getElementById('submitBtn');
  if (!form) return;

  /**
   * Basic client-side validation
   * Returns an error message string, or '' if valid.
   */
  function validate(data) {
    if (!data.name.trim())    return 'Please enter your name.';
    if (!data.email.trim())   return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return 'Please enter a valid email address.';
    if (!data.subject.trim()) return 'Please enter a subject.';
    if (!data.message.trim()) return 'Please enter your message.';
    return '';
  }

  function setStatus(msg, type) {
    statusEl.textContent  = msg;
    statusEl.className    = `form-note ${type}`;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = {
      name:    form.name.value,
      email:   form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    // Validate
    const error = validate(data);
    if (error) {
      setStatus(error, 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    setStatus('', '');

    /**
     * NOTE: This portfolio uses mailto: as a fallback since there's
     * no back-end server. To use a real form submission service
     * (Formspree, EmailJS, etc.), replace the setTimeout block below
     * with your API call.
     */
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate delay

    // Build mailto link as a simple fallback
    const mailto = `mailto:ranaalizafar190@gmail.com`
      + `?subject=${encodeURIComponent(data.subject)}`
      + `&body=${encodeURIComponent(
          `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
        )}`;

    window.location.href = mailto;

    setStatus('✓ Your email client should open now. Thank you for reaching out!', 'success');
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message →';
    form.reset();
  });
})();

/* ─── 7. BACK TO TOP ──────────────────────────────────── */

(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('visible', window.scrollY > 500),
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
})();

/* ─── 8. FOOTER YEAR ──────────────────────────────────── */

(function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─── 9. SMOOTH ANCHOR SCROLL (keyboard / external) ───── */

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      // Update URL without jump
      history.pushState(null, '', anchor.getAttribute('href'));
    });
  });
})();
