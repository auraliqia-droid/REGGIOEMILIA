/**
 * Comunidad Educativa Reggio Emilia — main.js
 * Vanilla JS: menu, scroll animations, mascot, lightbox, FAQ, form validation
 */

"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Utilities ─────────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. Mobile Menu ─────────────────────────────────────────── */
const setupMenu = () => {
  const toggle = qs(".menu-toggle");
  const nav    = qs(".primary-nav");
  if (!toggle || !nav) return;

  const open  = () => { nav.classList.add("open"); toggle.classList.add("open"); toggle.setAttribute("aria-expanded", "true"); };
  const close = () => { nav.classList.remove("open"); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };

  toggle.addEventListener("click", () =>
    nav.classList.contains("open") ? close() : open()
  );

  // Close on nav link click
  qsa("a", nav).forEach(link => link.addEventListener("click", close));

  // Close on outside click
  document.addEventListener("click", e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
};

/* ── 2. Header scroll effect ────────────────────────────────── */
const setupHeaderScroll = () => {
  const header = qs(".site-header");
  if (!header) return;

  const update = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", update, { passive: true });
  update();
};

/* ── 3. Scroll-triggered animations ─────────────────────────── */
const setupScrollAnimations = () => {
  const elements = qsa("[data-animate]");
  if (!elements.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("motion-ready");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach(el => observer.observe(el));
};

/* ── 4. Mascot interactions ─────────────────────────────────── */
const setupMascot = () => {
  const stage   = qs("[data-mascot-stage]");
  if (!stage) return;

  const btn       = qs(".who-mascot-3d-wrap", stage);
  const triggers  = qsa(".keyword-trigger[data-mascot-reaction]");
  if (!btn) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let rafId = 0;
  let jumpTimer = 0;

  const setTilt = (x, y) => {
    if (prefersReducedMotion) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      stage.style.setProperty("--tilt-x", `${x.toFixed(2)}deg`);
      stage.style.setProperty("--tilt-y", `${y.toFixed(2)}deg`);
    });
  };

  const resetTilt = () => {
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
  };

  if (canHover) {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      const xRatio = (e.clientX - r.left) / r.width  - 0.5;
      const yRatio = (e.clientY - r.top)  / r.height - 0.5;
      setTilt(-yRatio * 9, xRatio * 12);
    });
    btn.addEventListener("pointerleave", resetTilt);
    btn.addEventListener("pointercancel", resetTilt);
  }

  btn.addEventListener("click", () => {
    if (prefersReducedMotion) return;
    stage.classList.remove("is-jumping");
    void stage.offsetWidth; // reflow to restart animation
    stage.classList.add("is-jumping");
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(() => stage.classList.remove("is-jumping"), 560);
  });

  triggers.forEach(trigger => {
    const reaction = trigger.dataset.mascotReaction;
    let mobileTimer = 0;

    const activate   = () => stage.classList.add(`is-${reaction}`);
    const deactivate = () => stage.classList.remove(`is-${reaction}`);

    trigger.addEventListener("mouseenter", activate);
    trigger.addEventListener("mouseleave", deactivate);
    trigger.addEventListener("focus",      activate);
    trigger.addEventListener("blur",       deactivate);
    trigger.addEventListener("click", () => {
      activate();
      clearTimeout(mobileTimer);
      mobileTimer = setTimeout(deactivate, 900);
    });
  });
};

/* ── 5. Lightbox ─────────────────────────────────────────────── */
const setupLightbox = () => {
  const lightbox   = qs("#lightbox");
  if (!lightbox) return;

  const imgEl      = qs(".lightbox-img",     lightbox);
  const captionEl  = qs(".lightbox-caption", lightbox);
  const closeBtn   = qs(".lightbox-close",   lightbox);
  const prevBtn    = qs(".lightbox-prev",    lightbox);
  const nextBtn    = qs(".lightbox-next",    lightbox);

  const items = qsa("[data-lightbox]");
  if (!items.length) return;

  let current = 0;
  const sources = items.map(el => ({ src: el.dataset.src, caption: el.dataset.caption || "" }));

  const show = (idx) => {
    current = (idx + sources.length) % sources.length;
    imgEl.src    = "";          // force reload animation
    imgEl.alt    = sources[current].caption;
    captionEl.textContent = sources[current].caption;

    // Tiny delay so animation replays
    requestAnimationFrame(() => { imgEl.src = sources[current].src; });

    prevBtn.style.display = sources.length < 2 ? "none" : "";
    nextBtn.style.display = sources.length < 2 ? "none" : "";
  };

  const openLightbox = (idx) => {
    show(idx);
    lightbox.removeAttribute("hidden");
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.setAttribute("hidden", "");
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    items[current].focus();
  };

  items.forEach((el, i) => {
    el.addEventListener("click", () => openLightbox(i));
  });

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click",  () => show(current - 1));
  nextBtn.addEventListener("click",  () => show(current + 1));

  // Background click closes
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (lightbox.hasAttribute("hidden")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   show(current - 1);
    if (e.key === "ArrowRight")  show(current + 1);
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend",   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });
};

/* ── 6. FAQ Accordion ─────────────────────────────────────────── */
const setupFAQ = () => {
  // Native <details> handles toggle; we just add smooth animation
  const items = qsa(".faq-item");

  items.forEach(details => {
    const summary = qs("summary", details);
    const answer  = qs(".faq-answer", details);
    if (!summary || !answer) return;

    summary.addEventListener("click", e => {
      // Close others (accordion behavior)
      items.forEach(other => {
        if (other !== details && other.open) {
          other.removeAttribute("open");
        }
      });
    });
  });
};

/* ── 7. Contact Form Validation ──────────────────────────────── */
const setupContactForm = () => {
  const form       = qs("#contact-form");
  if (!form) return;

  const submitBtn  = qs("#submit-btn",  form);
  const successMsg = qs("#form-success", form);
  const btnText    = qs(".btn-text",    submitBtn);
  const btnLoading = qs(".btn-loading", submitBtn);

  const rules = {
    nombre:   { required: true, minLength: 2,  message: "Ingresa tu nombre completo (mínimo 2 caracteres)." },
    email:    { required: true, isEmail: true,  message: "Ingresa un correo electrónico válido." },
    telefono: { required: false, pattern: /^[0-9]{10}$/, message: "El teléfono debe tener 10 dígitos (solo números)." },
    mensaje:  { required: true, minLength: 10,  message: "El mensaje debe tener al menos 10 caracteres." },
  };

  const showError = (fieldId, msg) => {
    const input = qs(`#${fieldId}`, form);
    const error = qs(`#${fieldId}-error`, form);
    if (input) input.classList.add("is-error");
    if (error) error.textContent = msg;
  };

  const clearError = (fieldId) => {
    const input = qs(`#${fieldId}`, form);
    const error = qs(`#${fieldId}-error`, form);
    if (input) input.classList.remove("is-error");
    if (error) error.textContent = "";
  };

  const isValidEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validateField = (id, value) => {
    const rule = rules[id];
    if (!rule) return true;

    if (rule.required && !value.trim()) {
      showError(id, rule.message);
      return false;
    }
    if (value.trim() && rule.minLength && value.trim().length < rule.minLength) {
      showError(id, rule.message);
      return false;
    }
    if (value.trim() && rule.isEmail && !isValidEmail(value)) {
      showError(id, rule.message);
      return false;
    }
    if (value.trim() && rule.pattern && !rule.pattern.test(value.trim())) {
      showError(id, rule.message);
      return false;
    }

    clearError(id);
    return true;
  };

  // Live validation on blur
  Object.keys(rules).forEach(id => {
    const input = qs(`#${id}`, form);
    if (!input) return;
    input.addEventListener("blur", () => validateField(id, input.value));
    input.addEventListener("input", () => {
      if (input.classList.contains("is-error")) validateField(id, input.value);
    });
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Validate all fields
    let valid = true;
    Object.keys(rules).forEach(id => {
      const input = qs(`#${id}`, form);
      if (input && !validateField(id, input.value)) valid = false;
    });

    if (!valid) {
      const firstError = qs(".is-error", form);
      if (firstError) firstError.focus();
      return;
    }

    // Submit
    btnText.hidden    = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;

    try {
      const data     = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body:   data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        form.hidden        = true;
        successMsg.hidden  = false;
        successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        throw new Error("Server error");
      }
    } catch {
      btnText.hidden    = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
      showError("mensaje", "Hubo un error al enviar. Intenta de nuevo o contáctanos por WhatsApp.");
    }
  });
};

/* ── 8. Smooth scroll offset for sticky header ─────────────── */
const setupSmoothScroll = () => {
  document.addEventListener("click", e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id  = anchor.getAttribute("href").slice(1);
    const el  = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    const headerH = qs(".site-header")?.offsetHeight || 72;
    const top     = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "instant" : "smooth" });

    // Update URL without jumping
    history.pushState(null, "", `#${id}`);
  });
};

/* ── 9. Active nav link on scroll ──────────────────────────── */
const setupActiveNav = () => {
  const sections = qsa("section[id]");
  const navLinks = qsa(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.style.color    = isActive ? "var(--blue)" : "";
          link.style.fontWeight = isActive ? "800" : "";
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach(s => observer.observe(s));
};

/* ── 10. Lazy-load iframe map ───────────────────────────────── */
const setupLazyMap = () => {
  const mapWrap = qs(".contact-map");
  if (!mapWrap) return;

  const iframe = qs("iframe", mapWrap);
  if (!iframe) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // iframe already has src set; just ensure it loads
      if (!iframe.getAttribute("src")) {
        iframe.setAttribute("src", iframe.dataset.src || "");
      }
      observer.unobserve(mapWrap);
    });
  }, { rootMargin: "200px" });

  observer.observe(mapWrap);
};

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupHeaderScroll();
  setupScrollAnimations();
  setupMascot();
  setupLightbox();
  setupFAQ();
  setupContactForm();
  setupSmoothScroll();
  setupActiveNav();
  setupLazyMap();
});
