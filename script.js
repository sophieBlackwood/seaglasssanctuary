/* ================================================= */
/* MAIN SCRIPT: Seaglass Sanctuary - DEBUGGED & OPTIMIZED */
/* ================================================= */

function openNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;

  if (window.innerWidth <= 900) {
    sidenav.style.width = "250px";
    hamburger.style.display = "none";
  }
}

function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;

  sidenav.style.width = "0";
  hamburger.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------- */
  /* Accessibility: Reduced Motion */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  /* -------------------- */
  /* Theme Toggle */
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }

    const setIcon = () => {
      const isDark = document.body.classList.contains("dark");
      themeToggle.innerHTML = isDark
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    };

    setIcon();

    themeToggle.addEventListener("click", () => {
      document.body.classList.add("theme-transition");
      document.body.classList.toggle("dark");

      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );

      setIcon();

      // OPTIMIZATION: Read transition duration dynamically from CSS instead of hardcoding 700ms
      const transitionDuration = parseFloat(getComputedStyle(document.body).transitionDuration) * 1000 || 700;
      setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, transitionDuration);
    });
  }

  /* -------------------- */
  /* Quick Exit Modal (Informational) */
  const quickExitModal = document.getElementById("quick-exit-modal");
  const dismissModalBtn = document.getElementById("dismiss-modal");

  if (quickExitModal && dismissModalBtn) {
    // Show modal on load if not previously dismissed
    const modalDismissed = localStorage.getItem("quickExitModalDismissed");
    if (!modalDismissed) {
      quickExitModal.classList.add("show");
    }

    // Handle dismiss button
    dismissModalBtn.addEventListener("click", () => {
      quickExitModal.classList.remove("show");
      localStorage.setItem("quickExitModalDismissed", "true"); // Mark as dismissed
    });
  }

  /* -------------------- */
  /* Quick Exit (NULL SAFE) */
  const quickExitBtn = document.getElementById("quick-exit");
  const quickExitURL = "https://www.amazon.com/s?k=water+bottle";

  if (quickExitBtn) {
    quickExitBtn.addEventListener("click", () => {
      window.location.replace(quickExitURL);
    });
  }

  /* -------------------- */
  /* Triple ESC Rerouting (Quick Exit) */
  let escPressCount = 0;
  let escTimer;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      escPressCount++;
      clearTimeout(escTimer); // Reset timer on each press

      if (escPressCount === 3) {
        // Trigger quick exit after 3 presses (same as button)
        window.location.replace(quickExitURL);
        escPressCount = 0; // Reset for safety
      } else {
        // Reset count if not 3 presses within 1 second
        escTimer = setTimeout(() => {
          escPressCount = 0;
        }, 1000);
      }
    }
  });

  /* -------------------- */
  /* Floating Buttons */
  const backToTop = document.getElementById("back-to-top");
  const floatingButtons = document.getElementById("floating-buttons");
  let holdTimer;

  if (backToTop && floatingButtons) {
    // OPTIMIZATION: Cache mobile media query to avoid repeated evaluations
    const mobileMediaQuery = window.matchMedia("(max-width: 768px)");
    const isMobile = () => mobileMediaQuery.matches;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
        floatingButtons.classList.add("compact");
      } else {
        backToTop.classList.remove("visible");
        floatingButtons.classList.remove("compact", "reveal");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    /* Touch-safe long press */
    backToTop.addEventListener("touchstart", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    // OPTIMIZATION: Clear timer on all relevant events to prevent race conditions
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt =>
      backToTop.addEventListener(evt, () => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null; // Reset to avoid stale references
        }
      })
    );
  }

  /* -------------------- */
  /* Smooth Scrolling */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const header = document.querySelector("header");
      const yOffset = header ? -header.offsetHeight : -80; // NOTE: Adjust -80 if needed for your layout

      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });

  /* ================================================= */
  /* BLOG CAROUSEL - STABLE LOOP (OPTIMIZED) */
  /* ================================================= */

  const blogTrack = document.querySelector(".blog-card-grid");
  const blogPrev = document.querySelector(".blog-carousel-btn.prev");
  const blogNext = document.querySelector(".blog-carousel-btn.next");
  const blogCards = Array.from(document.querySelectorAll(".blog-card"));

  if (blogTrack && blogCards.length > 0) {
    // OPTIMIZATION: Cache computed styles to avoid repeated getComputedStyle calls
    const trackStyle = getComputedStyle(blogTrack);
    const gap = parseFloat(trackStyle.gap) || 0;
    const transitionDuration = parseFloat(trackStyle.transitionDuration) * 1000 || 500; // Fallback to 500ms
    const total = blogCards.length;

    // Clone cards for seamless looping
    blogCards.forEach(card => blogTrack.appendChild(card.cloneNode(true)));

    let index = 0;
    let isTransitioning = false; // OPTIMIZATION: Prevent overlapping transitions

    const updateCarousel = (animate = true) => {
      if (isTransitioning && animate) return; // Skip if already transitioning
      isTransitioning = animate;

      const cardWidth = blogCards[0].offsetWidth;
      const offset = index * (cardWidth + gap);

      blogTrack.style.transition = animate ? `transform ${transitionDuration / 1000}s ease` : "none";
      blogTrack.style.transform = `translateX(${-offset}px)`;

      if (animate) {
        setTimeout(() => (isTransitioning = false), transitionDuration);
      } else {
        isTransitioning = false;
      }
    };

    const jumpToStart = () => {
      index = 0;
      updateCarousel(false);
    };

    const next = () => {
      if (isTransitioning) return; // DEBUG: Prevent rapid clicks
      index++;
      updateCarousel();
      if (index >= total) {
        setTimeout(jumpToStart, transitionDuration + 10); // OPTIMIZATION: Use dynamic duration
      }
    };

    const prev = () => {
      if (isTransitioning) return; // DEBUG: Prevent rapid clicks
      if (index === 0) {
        index = total;
        updateCarousel(false);
        requestAnimationFrame(() => {
          index--;
          updateCarousel();
        });
      } else {
        index--;
        updateCarousel();
      }
    };

    blogNext?.addEventListener("click", next);
    blogPrev?.addEventListener("click", prev);

    updateCarousel(false); // Initial setup

    /* OPTIMIZATION: Handle resize smoothly without resetting index */
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        requestAnimationFrame(() => updateCarousel(false)); // Recalculate position without animation
      }, 100); // Debounce for performance
    });
  }

  /* -------------------- */
  /* Hamburger auto-reset on desktop */
  window.addEventListener("resize", () => {
    const sidenav = document.getElementById("mySidenav");
    const hamburger = document.querySelector(".hamburger-menu");

    if (window.innerWidth > 900 && sidenav && hamburger) {
      sidenav.style.width = "0";
      hamburger.style.display = "flex";
    }
  });
});
