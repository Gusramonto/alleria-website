// =============================================
// ALLERIA — main.js
// Navigation, scroll, tabs, referral banner
// =============================================

(function () {
  'use strict';

  // ===== HEADER SCROLL SHADOW =====
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ===== SMOOTH SCROLL for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== HERO IMAGE LOAD ANIMATION =====
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    const bgUrl = heroBg.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
    img.onload = () => heroBg.classList.add('loaded');
    img.src = bgUrl;
  }

  // ===== ACCORDION =====
  const accordionList = document.getElementById('accordion-list');
  if (accordionList) {
    accordionList.addEventListener('click', function (e) {
      const btn = e.target.closest('.accordion-btn');
      if (!btn) return;

      const item = btn.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      accordionList.querySelectorAll('.accordion-btn').forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded', 'false');
          b.closest('.accordion-item').querySelector('.accordion-body').hidden = true;
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isOpen));
      body.hidden = isOpen;
    });
  }

  // ===== TABS (game section) =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('aria-controls');
      const target = document.getElementById(targetId);
      if (!target) return;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) { panel.classList.remove('active'); panel.hidden = true; }
      });

      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      target.classList.add('active');
      target.hidden = false;
    });
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll(
    '.why-card, .experience-card, .product-card, .accordion-item, .review-card'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // ===== TOAST HELPER (global) =====
  window.showToast = function (message, duration = 2800) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  };

  // ===== REFERRAL CODE (URL param ?ref=ALXXXXX) =====
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');

  if (refCode && /^AL[A-Z0-9]{5}$/i.test(refCode)) {
    validateReferralCode(refCode.toUpperCase());
  }

  async function validateReferralCode(code) {
    if (!SUPABASE_CONFIGURED) {
      showReferralBanner(code);
      return;
    }

    try {
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await client
        .from('referral_codes')
        .select('code, is_active, expires_at')
        .eq('code', code)
        .single();

      if (error || !data) return;
      if (!data.is_active) return;
      if (data.expires_at && new Date(data.expires_at) < new Date()) return;

      showReferralBanner(code);
    } catch {
      // Silent fail — do not break page
    }
  }

  function showReferralBanner(code) {
    const banner = document.getElementById('referral-banner');
    const codeDisplay = document.getElementById('referral-code-display');
    const waBtn = document.getElementById('referral-whatsapp-btn');

    if (!banner) return;
    codeDisplay.textContent = code;
    waBtn.href = `https://wa.me/584122632864?text=Hola%20Alleria!%20Tengo%20el%20c%C3%B3digo%20de%20descuento%20${code}%20%F0%9F%8E%81`;
    banner.style.display = 'block';
  }

})();
