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

const setupWhoMascotInteractions = () => {
  const mascotStage = document.querySelector("[data-mascot-stage]");
  if (!mascotStage) {
    return;
  }

  const mascotButton = mascotStage.querySelector(".who-mascot-3d-wrap");
  const reactionTriggers = document.querySelectorAll(".keyword-trigger[data-mascot-reaction]");
  if (!mascotButton) {
    return;
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let frameId = 0;
  let jumpTimeoutId = 0;

  const setTilt = (xDeg, yDeg) => {
    if (prefersReducedMotion) {
      return;
    }
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    frameId = requestAnimationFrame(() => {
      mascotStage.style.setProperty("--tilt-x", `${xDeg.toFixed(2)}deg`);
      mascotStage.style.setProperty("--tilt-y", `${yDeg.toFixed(2)}deg`);
    });
  };

  const resetTilt = () => {
    mascotStage.style.setProperty("--tilt-x", "0deg");
    mascotStage.style.setProperty("--tilt-y", "0deg");
  };

  if (canHover) {
    mascotButton.addEventListener("pointermove", (event) => {
      const rect = mascotButton.getBoundingClientRect();
      const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
      const yRatio = (event.clientY - rect.top) / rect.height - 0.5;
      setTilt(-yRatio * 9, xRatio * 12);
    });

    mascotButton.addEventListener("pointerleave", resetTilt);
    mascotButton.addEventListener("pointercancel", resetTilt);
  }

  mascotButton.addEventListener("click", () => {
    if (prefersReducedMotion) {
      return;
    }
    mascotStage.classList.remove("is-jumping");
    void mascotStage.offsetWidth;
    mascotStage.classList.add("is-jumping");
    clearTimeout(jumpTimeoutId);
    jumpTimeoutId = window.setTimeout(() => {
      mascotStage.classList.remove("is-jumping");
    }, 560);
  });

  reactionTriggers.forEach((trigger) => {
    const reaction = trigger.dataset.mascotReaction;
    let mobileReactionTimeout = 0;

    const activate = () => {
      if (reaction === "vigilancia") {
        mascotStage.classList.add("is-vigilant");
      }
      if (reaction === "naturaleza") {
        mascotStage.classList.add("is-nature");
      }
    };

    const deactivate = () => {
      if (reaction === "vigilancia") {
        mascotStage.classList.remove("is-vigilant");
      }
      if (reaction === "naturaleza") {
        mascotStage.classList.remove("is-nature");
      }
    };

    trigger.addEventListener("mouseenter", activate);
    trigger.addEventListener("mouseleave", deactivate);
    trigger.addEventListener("focus", activate);
    trigger.addEventListener("blur", deactivate);
    trigger.addEventListener("click", () => {
      activate();
      clearTimeout(mobileReactionTimeout);
      mobileReactionTimeout = window.setTimeout(deactivate, 850);
    });
  });
};

setupMenu();
animateOnScroll();
setupWhoMascotInteractions();
