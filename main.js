const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const yearEl = document.getElementById('year');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canUseCustomCursor = window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion;

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const cursor = document.querySelector('.custom-cursor');
if (cursor && canUseCustomCursor) {
  document.body.classList.add('has-custom-cursor');
  window.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  const interactiveTargets = document.querySelectorAll('a, button, .cursor-fun');
  interactiveTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
} else if (cursor) {
  document.body.classList.remove('has-custom-cursor');
}

const confettiColors = ['#0167b1', '#e30119', '#83b410', '#fcc302'];
const createConfetti = (x, y) => {
  if (prefersReducedMotion) {
    return;
  }
  for (let i = 0; i < 10; i += 1) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti';
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.background = confettiColors[i % confettiColors.length];
    confetti.style.setProperty('--x', `${(Math.random() - 0.5) * 160}px`);
    confetti.style.setProperty('--y', `${80 + Math.random() * 140}px`);
    document.body.appendChild(confetti);

    confetti.addEventListener('animationend', () => confetti.remove());
  }
};

const confettiTriggers = document.querySelectorAll('.confetti-trigger, .cursor-fun');
confettiTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    createConfetti(event.clientX, event.clientY);
  });
  trigger.addEventListener('mouseenter', (event) => {
    if (window.innerWidth >= 768) {
      createConfetti(event.clientX, event.clientY);
    }
  });
});

const revealElements = document.querySelectorAll('[data-animate]');
const parallaxItems = document.querySelectorAll('.parallax');

if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.from('.hero-title', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power3.out'
  });

  window.gsap.from('.hero-logo', {
    opacity: 0,
    scale: 0.8,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.2
  });

  revealElements.forEach((element) => {
    window.gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%'
        }
      }
    );
  });

  parallaxItems.forEach((item, index) => {
    window.gsap.to(item, {
      y: (index + 1) * 24,
      scrollTrigger: {
        trigger: item.closest('section') || item,
        start: 'top bottom',
        scrub: true
      }
    });
  });
} else if (revealElements.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
} else {
  revealElements.forEach((el) => el.classList.add('is-visible'));
}

if (window.lucide) {
  window.lucide.createIcons();
}
