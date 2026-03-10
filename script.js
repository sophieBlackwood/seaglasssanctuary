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

      const transitionDuration = parseFloat(getComputedStyle(document.body).transitionDuration) * 1000 || 700;
      setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, transitionDuration);
    });
  }

  /* -------------------- */
  /* Quick Exit Modal */
  const quickExitModal = document.getElementById("quick-exit-modal");
  const dismissModalBtn = document.getElementById("dismiss-modal");

  if (quickExitModal && dismissModalBtn) {
    const modalDismissed = localStorage.getItem("quickExitModalDismissed");
    if (!modalDismissed) quickExitModal.classList.add("show");

    dismissModalBtn.addEventListener("click", () => {
      quickExitModal.classList.remove("show");
      localStorage.setItem("quickExitModalDismissed", "true");
    });
  }

  /* -------------------- */
  /* Quick Exit */
  const quickExitBtn = document.getElementById("quick-exit");
  const quickExitURL = "https://www.amazon.com/s?k=water+bottle";

  if (quickExitBtn) {
    quickExitBtn.addEventListener("click", () => {
      window.location.replace(quickExitURL);
    });
  }

  /* -------------------- */
  /* Triple ESC Rerouting */
  let escPressCount = 0;
  let escTimer;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      escPressCount++;
      clearTimeout(escTimer);
      if (escPressCount === 3) {
        window.location.replace(quickExitURL);
        escPressCount = 0;
      } else {
        escTimer = setTimeout(() => { escPressCount = 0; }, 1000);
      }
    }
  });

  /* -------------------- */
  /* Floating Buttons */
  const backToTop = document.getElementById("back-to-top");
  const floatingButtons = document.getElementById("floating-buttons");
  let holdTimer;

  if (backToTop && floatingButtons) {
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
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    backToTop.addEventListener("touchstart", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => { floatingButtons.classList.toggle("reveal"); }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt =>
      backToTop.addEventListener(evt, () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } })
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
      const yOffset = header ? -header.offsetHeight : -80;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ================================================= */
  /* BLOG CAROUSEL */
  /* ================================================= */
  const blogTrack = document.querySelector(".blog-card-grid");
  const blogPrev = document.querySelector(".blog-carousel-btn.prev");
  const blogNext = document.querySelector(".blog-carousel-btn.next");
  const blogCards = Array.from(document.querySelectorAll(".blog-card"));

  if (blogTrack && blogCards.length > 0) {
    const trackStyle = getComputedStyle(blogTrack);
    const gap = parseFloat(trackStyle.gap) || 0;
    const transitionDuration = parseFloat(trackStyle.transitionDuration) * 1000 || 500;
    const total = blogCards.length;

    blogCards.forEach(card => blogTrack.appendChild(card.cloneNode(true)));

    let index = 0;
    let isTransitioning = false;

    const updateCarousel = (animate = true) => {
      if (isTransitioning && animate) return;
      isTransitioning = animate;
      const cardWidth = blogCards[0].offsetWidth;
      const offset = index * (cardWidth + gap);
      blogTrack.style.transition = animate ? `transform ${transitionDuration / 1000}s ease` : "none";
      blogTrack.style.transform = `translateX(${-offset}px)`;
      if (animate) setTimeout(() => (isTransitioning = false), transitionDuration);
      else isTransitioning = false;
    };

    const jumpToStart = () => { index = 0; updateCarousel(false); };
    const next = () => { if (isTransitioning) return; index++; updateCarousel(); if (index >= total) setTimeout(jumpToStart, transitionDuration + 10); };
    const prev = () => { if (isTransitioning) return; if (index === 0) { index = total; updateCarousel(false); requestAnimationFrame(() => { index--; updateCarousel(); }); } else { index--; updateCarousel(); } };

    blogNext?.addEventListener("click", next);
    blogPrev?.addEventListener("click", prev);

    updateCarousel(false);

    let resizeTimeout;
    window.addEventListener("resize", () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { requestAnimationFrame(() => updateCarousel(false)); }, 100); });
  }

  /* -------------------- */
  /* Hamburger auto-reset on desktop */
  window.addEventListener("resize", () => {
    const sidenav = document.getElementById("mySidenav");
    const hamburger = document.querySelector(".hamburger-menu");
    if (window.innerWidth > 900 && sidenav && hamburger) { sidenav.style.width = "0"; hamburger.style.display = "flex"; }
  });

  /* ================================================= */
  /* BLOG DROPDOWN NAVIGATION */
  /* ================================================= */
  const blogDropdownLinks = document.querySelectorAll('.blog-dropdown > a');
  blogDropdownLinks.forEach(link => {
    link.addEventListener('click', e => {
      // On mobile only, toggle dropdown menu
      if (window.innerWidth <= 640) {
        e.preventDefault();
        const menu = link.nextElementSibling;
        menu.classList.toggle('show');
      }
    });
  });
});
