/* ============================================
   SIEGE — Portfolio Interactions
   ============================================ */

(function () {
  'use strict';

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Nav scroll state ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  function setMenuOpen(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    if (menuIcon) menuIcon.classList.toggle('hidden', open);
    if (closeIcon) closeIcon.classList.toggle('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      setMenuOpen(!isOpen);
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('#mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // ---------- Smooth section highlight (optional active nav) ----------
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    desktopLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const active = href === `#${current}`;
      link.style.color = active ? '#fff' : '';
      if (active) {
        link.style.textShadow = '0 0 12px rgba(225, 29, 58, 0.7)';
      } else {
        link.style.textShadow = '';
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---------- Gallery tabs ----------
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryPanels = document.querySelectorAll('.gallery-panel');

  function activateGalleryTab(tabId) {
    galleryTabs.forEach((tab) => {
      const active = tab.dataset.tab === tabId;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    galleryPanels.forEach((panel) => {
      const active = panel.dataset.panel === tabId;
      panel.classList.toggle('hidden', !active);
      if (active) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  galleryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateGalleryTab(tab.dataset.tab);
    });
  });

  // ---------- Gallery lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, title, tag) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || '';
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxTag) lightboxTag.textContent = tag || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }

  function bindGalleryItems(root) {
    const scope = root || document;
    scope.querySelectorAll('.gallery-item').forEach((item) => {
      if (item.dataset.bound === '1') return;
      item.dataset.bound = '1';
      item.addEventListener('click', () => {
        openLightbox(
          item.dataset.src || item.querySelector('img')?.src,
          item.dataset.title,
          item.dataset.tag
        );
      });
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  bindGalleryItems(document);

  if (lightboxClose) lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      setMenuOpen(false);
    }
  });

  // ---------- Contact form ----------
  const form = document.getElementById('contact-form');

  // ---------- Form confirmation modal ----------
  const formModal = document.getElementById('form-modal');
  const formModalIcon = document.getElementById('form-modal-icon');
  const formModalTitle = document.getElementById('form-modal-title');
  const formModalText = document.getElementById('form-modal-text');
  const formModalClose = document.getElementById('form-modal-close');
  const formModalOk = document.getElementById('form-modal-ok');

  function openFormModal(isSuccess, title, text) {
    if (!formModal) return;
    formModal.classList.remove('is-success', 'is-error');
    formModal.classList.add(isSuccess ? 'is-success' : 'is-error');
    if (formModalIcon) formModalIcon.textContent = isSuccess ? '✓' : '!';
    if (formModalTitle) formModalTitle.textContent = title;
    if (formModalText) formModalText.textContent = text;
    formModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeFormModal() {
    if (!formModal) return;
    formModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (formModalClose) formModalClose.addEventListener('click', closeFormModal);
  if (formModalOk) formModalOk.addEventListener('click', closeFormModal);
  if (formModal) {
    formModal.addEventListener('click', (e) => {
      if (e.target === formModal) closeFormModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFormModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        openFormModal(false, 'Missing Info', 'Please fill in all required fields.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then((response) => {
          if (response.ok) {
            openFormModal(
              true,
              'Request Sent',
              "Thanks! Your commission request has been sent — I'll get back to you soon."
            );
            form.reset();
          } else {
            response.json().then((data) => {
              const msg =
                data && data.errors
                  ? data.errors.map((err) => err.message).join(', ')
                  : 'Something went wrong. Please try again or DM @mk7eam on X.';
              openFormModal(false, 'Submission Failed', msg);
            }).catch(() => {
              openFormModal(
                false,
                'Submission Failed',
                'Something went wrong. Please try again or DM @mk7eam on X.'
              );
            });
          }
        })
        .catch(() => {
          openFormModal(
            false,
            'Network Error',
            'Please check your connection and try again, or DM @mk7eam on X.'
          );
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText;
          }
        });
    });
  }

  // ---------- Particle canvas ----------
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let w = 0;
  let h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor((w * h) / 22000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.12,
        alpha: Math.random() * 0.55 + 0.15,
        color: Math.random() > 0.9 ? 'cyan' : 'red',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      if (p.color === 'cyan') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha * 0.5})`;
        ctx.fill();
      } else {
        // Soft bloom for red neon particles
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255, 60, 90, ${p.alpha})`);
        g.addColorStop(0.4, `rgba(255, 42, 74, ${p.alpha * 0.5})`);
        g.addColorStop(1, 'rgba(255, 42, 74, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 80, 100, ${Math.min(1, p.alpha + 0.2)})`;
        ctx.fill();
      }
    }

    // Soft connection lines (nearby red particles only)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 42, 74, ${0.14 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function initParticles() {
    resize();
    createParticles();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initParticles, 200);
  });

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else if (!animId) {
      draw();
    }
  });

  initParticles();

  // ---------- Reveal on scroll (subtle) ----------
  const revealEls = document.querySelectorAll(
    '.mission-card, .stat-card, .gallery-item, .about-frame, #contact-form, .section-title'
  );

  if ('IntersectionObserver' in window) {
    revealEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
  }
})();