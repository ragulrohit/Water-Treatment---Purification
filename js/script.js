document.addEventListener('DOMContentLoaded', () => {

  // ====== Navbar Toggle (Hamburger) ======
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // ====== Navbar Scroll Effect ======
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ====== Close menu on link click ======
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ====== Scroll Animations (Intersection Observer) ======
  const animateElements = document.querySelectorAll(
    '.service-card, .process-step, .testimonial-card, .gallery-item, ' +
    '.team-card, .blog-card, .fade-up, ' +
    '.about-image, .about-content, .contact-wrapper, .equipment-card'
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ====== Smooth Scroll for Anchor Links ======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ====== Password Toggle ======
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      btn.classList.toggle('fa-eye');
      btn.classList.toggle('fa-eye-slash');
    });
  });

  // ====== Auth Form Validation ======
  const authForms = document.querySelectorAll('.auth-form');

  authForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const inputs = form.querySelectorAll('input[required]');

      inputs.forEach(input => {
        const errorEl = input.parentElement.querySelector('.error-message') ||
          createErrorElement(input);

        if (!input.value.trim()) {
          showError(input, errorEl, 'This field is required');
          valid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          showError(input, errorEl, 'Please enter a valid email');
          valid = false;
        } else if (input.type === 'password' && input.value.length < 6) {
          showError(input, errorEl, 'Password must be at least 6 characters');
          valid = false;
        } else if (input.id === 'confirmPassword') {
          const password = form.querySelector('#signupPassword');
          if (password && input.value !== password.value) {
            showError(input, errorEl, 'Passwords do not match');
            valid = false;
          } else {
            clearError(input, errorEl);
          }
        } else {
          clearError(input, errorEl);
        }
      });

      if (valid) {
        const btn = form.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;

          const isSignup = form.closest('#signupForm');
          if (isSignup) {
            showToast('Account created successfully! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'signin.html', 1500);
          } else {
            showToast('Welcome back! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
          }
        }, 1500);
      }
    });
  });

  function createErrorElement(input) {
    const el = document.createElement('span');
    el.className = 'error-message';
    el.style.cssText =
      'color: #e74c3c; font-size: 0.8rem; margin-top: 4px; display: block;';
    input.parentElement.appendChild(el);
    return el;
  }

  function showError(input, errorEl, msg) {
    input.style.borderColor = '#e74c3c';
    errorEl.textContent = msg;
  }

  function clearError(input, errorEl) {
    input.style.borderColor = '';
    errorEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ====== Toast Notification ======
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 9999;
      padding: 16px 24px; border-radius: 12px; font-weight: 600;
      color: white; font-size: 0.95rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: slideInRight 0.4s cubic-bezier(0.4,0,0.2,1);
      background: ${type === 'success' ? 'linear-gradient(135deg, #00b894, #00cec9)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4,0,0.2,1) forwards';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // ====== FAQ Accordion ======
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // ====== Contact Form ======
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        contactForm.reset();
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      }, 1500);
    });
  }

  // ====== Counter Animation ======
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    if (!target) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.round(current) + '+';
        requestAnimationFrame(update);
      } else {
        el.textContent = target + '+';
      }
    };
    update();
  }

  const statNumbers = document.querySelectorAll('.stat-item h3');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const h3 = entry.target.querySelector('h3');
        if (h3 && h3.getAttribute('data-target')) {
          animateCounter(h3);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach(item => statsObserver.observe(item));

  // ====== Add keyframes for toast animations ======
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100px); opacity: 0; }
    }
  `;
  document.head.appendChild(styleSheet);
});
