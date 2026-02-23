const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

if (menuToggle && primaryNav) {
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
}

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
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );

  animatedElements.forEach((element) => observer.observe(element));
};

const setupMascotInteractions = () => {
  const mascotButtons = document.querySelectorAll(".mascot-interactive");
  if (mascotButtons.length === 0) {
    return;
  }

  const closeAllMascots = (exceptButton = null) => {
    mascotButtons.forEach((button) => {
      if (button !== exceptButton) {
        button.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  };

  mascotButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = button.classList.contains("is-open");
      closeAllMascots(button);
      button.classList.toggle("is-open", !isOpen);
      button.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        button.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      }
    });

    if (!prefersReducedMotion) {
      button.addEventListener("pointermove", (event) => {
        if (window.innerWidth < 768) {
          return;
        }
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        button.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
        button.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
      });

      button.addEventListener("pointerleave", () => {
        button.style.setProperty("--tilt-x", "0deg");
        button.style.setProperty("--tilt-y", "0deg");
      });
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".mascot-interactive")) {
      closeAllMascots();
    }
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const mascotObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            mascotObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    mascotButtons.forEach((button) => mascotObserver.observe(button));
  }
};

const setupAccordion = () => {
  const accordionRoot = document.querySelector("[data-accordion]");
  if (!accordionRoot) {
    return;
  }

  const detailsElements = accordionRoot.querySelectorAll("details");
  detailsElements.forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) {
        return;
      }
      detailsElements.forEach((otherDetails) => {
        if (otherDetails !== details) {
          otherDetails.open = false;
        }
      });
    });
  });
};

animateOnScroll();
setupMascotInteractions();
setupAccordion();
