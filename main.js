const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setupMenu = () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  if (!menuToggle || !primaryNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
};

const animateOnScroll = () => {
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (animatedElements.length === 0) {
    return;
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    animatedElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("motion-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -30px 0px" }
  );

  animatedElements.forEach((element) => observer.observe(element));
};

const setupHeroMascotPointer = () => {
  const mascotImage = document.querySelector(".hero-mascot");
  if (!mascotImage || prefersReducedMotion) {
    return;
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) {
    return;
  }

  let frameId = 0;
  const updateOffsets = (x, y) => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    frameId = requestAnimationFrame(() => {
      mascotImage.style.setProperty("--mouse-x", `${x.toFixed(2)}px`);
      mascotImage.style.setProperty("--mouse-y", `${y.toFixed(2)}px`);
    });
  };

  mascotImage.addEventListener("pointermove", (event) => {
    const rect = mascotImage.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (event.clientY - rect.top) / rect.height - 0.5;
    updateOffsets(xRatio * 8, yRatio * 6);
  });

  const resetPosition = () => updateOffsets(0, 0);
  mascotImage.addEventListener("pointerleave", resetPosition);
  mascotImage.addEventListener("pointercancel", resetPosition);
};

setupMenu();
animateOnScroll();
setupHeroMascotPointer();
