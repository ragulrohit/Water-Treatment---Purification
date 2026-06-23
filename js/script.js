document.addEventListener('DOMContentLoaded', () => {
  ensureFooter();

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
    '.about-image, .about-content, .contact-wrapper, .equipment-card, ' +
    '.quality-card, .industry-item'
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
      const inputs = form.querySelectorAll('input[required], select[required]');

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
            const name = form.querySelector('#signupName')?.value.trim();
            const email = form.querySelector('#signupEmail')?.value.trim();
            saveDashboardUser(name, email);
            showToast('Account created successfully! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'signin.html', 1500);
          } else {
            const email = form.querySelector('#signinEmail')?.value.trim();
            saveDashboardUser(getNameFromEmail(email), email);
            showToast('Welcome back! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
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

  function saveDashboardUser(name, email) {
    if (name) localStorage.setItem('dashboardUserName', name);
    if (email) localStorage.setItem('dashboardUserEmail', email);
  }

  function getNameFromEmail(email) {
    if (!email) return 'Customer';
    return email.split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  const dashboardName = localStorage.getItem('dashboardUserName') || 'Customer';
  const dashboardEmail = localStorage.getItem('dashboardUserEmail') || 'customer@gmail.com';

  document.querySelectorAll('[data-dashboard-name]').forEach(el => {
    el.textContent = dashboardName;
  });

  document.querySelectorAll('[data-dashboard-email]').forEach(el => {
    el.textContent = dashboardEmail;
  });

  const dashboardSignOutLinks = document.querySelectorAll('.dashboard-menu a[href="signin.html"]');
  dashboardSignOutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showLogoutConfirm(link.href);
    });
  });

  function showLogoutConfirm(redirectUrl) {
    let modal = document.querySelector('.logout-modal');

    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'logout-modal';
      modal.innerHTML = `
        <div class="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logoutTitle">
          <i class="fas fa-right-from-bracket"></i>
          <h2 id="logoutTitle">Confirm Logout</h2>
          <p>Are you sure you want to sign out of your dashboard?</p>
          <div class="logout-actions">
            <button type="button" class="logout-cancel">Cancel</button>
            <button type="button" class="logout-confirm">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.logout-cancel').addEventListener('click', () => {
        modal.classList.remove('active');
      });

      modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.classList.remove('active');
      });
    }

    modal.querySelector('.logout-confirm').onclick = () => {
      localStorage.removeItem('dashboardUserName');
      localStorage.removeItem('dashboardUserEmail');
      window.location.href = redirectUrl;
    };

    modal.classList.add('active');
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

  function ensureFooter() {
    if (document.body.classList.contains('dashboard-body')) return;
    if (document.body.classList.contains('error-body')) return;
    if (document.querySelector('.footer')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <a href="index.html" class="footer-logo" aria-label="Stackly Home">
                <img src="images/Stackly_logo.png" alt="Stackly Logo" loading="lazy">
              </a>
              <h3>AquaPure</h3>
              <p>Your trusted partner in water treatment and purification. We deliver clean, safe, and great-tasting water through innovative and eco-friendly solutions.</p>
              <div class="footer-social">
                <a href="404.html" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="404.html" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="404.html" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="404.html" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div>
              <h4>Quick Links</h4>
              <div class="footer-links">
                <a href="index.html">Home</a>
                <a href="services.html">Services</a>
                <a href="about.html">About Us</a>
                <a href="gallery.html">Gallery</a>
                <a href="team.html">Our Team</a>
                <a href="contact.html">Contact</a>
              </div>
            </div>
            <div>
              <h4>Services</h4>
              <div class="footer-links">
                <a href="services.html">Water Filtration</a>
                <a href="services.html">Wastewater Treatment</a>
                <a href="services.html">Chemical Treatment</a>
                <a href="services.html">System Maintenance</a>
                <a href="contact.html">Consultation</a>
              </div>
            </div>
            <div>
              <h4>Support</h4>
              <div class="footer-links">
                <a href="index.html#faq">FAQ</a>
                <a href="contact.html">Support Center</a>
                <a href="contact.html">Careers</a>
                <a href="signin.html">Client Login</a>
                <a href="signup.html">Create Account</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2026 AquaPure. All rights reserved.</p>
            <p>Made with <i class="fas fa-heart" style="color: #e74c3c;"></i> for clean water</p>
          </div>
        </div>
      </footer>
    `);
  }
});
