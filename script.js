/* ================================================= */
/* MAIN SCRIPT: Seaglass Sanctuary */
/* ================================================= */

/* -------------------- */
/* Side Navigation */
function openNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;

  if (window.innerWidth <= 768) {
    sidenav.style.width = "250px";
    hamburger.style.display = "none";
  }
}

function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;

  sidenav.style.width = "0";
  hamburger.style.display = "block";
}

/* -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  /* -------------------- */
  /* Accessibility: Reduced Motion */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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
      themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const darkMode = document.body.classList.contains("dark");
      themeToggle.innerHTML = darkMode
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    });
  }

  /* -------------------- */
  /* Restore Pink Mode */
  const savedPink = localStorage.getItem("pink-mode");
  if (savedPink === "on") document.body.classList.add("pink-mode");

  /* -------------------- */
  /* Quick Exit */
  const quickExitBtn = document.getElementById("quick-exit");
  const quickExitURL = "https://www.google.com/search?q=weather+today&safe=active";
  quickExitBtn?.addEventListener("click", () => {
    window.location.href = quickExitURL;
  });

  /* -------------------- */
  /* Floating Buttons */
  const backToTop = document.getElementById("back-to-top");
  const floatingButtons = document.getElementById("floating-buttons");
  let holdTimer;

  if (backToTop && floatingButtons) {
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

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

    backToTop.addEventListener("mousedown", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => floatingButtons.classList.toggle("reveal"), 600);
      }
    });

    ["mouseup", "mouseleave", "touchend"].forEach(evt =>
      backToTop.addEventListener(evt, () => clearTimeout(holdTimer))
    );
  }

  /* -------------------- */
  /* Smooth Scrolling */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const header = document.querySelector("header");
      const yOffset = header ? -header.offsetHeight : -80;

      const y =
        targetEl.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });

/* ================================================= */
/* BLOG CAROUSEL - SIMPLE INFINITE LOOP */
/* ================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const blogTrack = document.querySelector(".blog-card-grid");
  const blogPrev = document.querySelector(".blog-carousel-btn.prev");
  const blogNext = document.querySelector(".blog-carousel-btn.next");
  const blogCards = Array.from(document.querySelectorAll(".blog-card"));
  const blogContainer = document.querySelector(".blog-carousel-track-container");

  if (!blogTrack || blogCards.length === 0) return;

  const isMobileCarousel = () => window.matchMedia("(max-width: 768px)").matches;

  /* ---------- MOBILE SCROLL ---------- */
  if (isMobileCarousel()) {
    return; // mobile handles scroll natively
  }

  /* ---------- DESKTOP INFINITE LOOP ---------- */
  const total = blogCards.length;
  const gap = parseFloat(getComputedStyle(blogTrack).gap) || 0;

  // Clone all cards for seamless looping
  blogCards.forEach(card => blogTrack.appendChild(card.cloneNode(true)));

  let index = 0;

  const cardWidth = blogCards[0].offsetWidth;

  const updateCarousel = (animate = true) => {
    const offset = index * (cardWidth + gap);
    blogTrack.style.transition = animate ? "transform 0.5s ease" : "none";
    blogTrack.style.transform = `translateX(${-offset}px)`;
  };

  const jumpToStart = () => {
    index = 0;
    updateCarousel(false);
  };

  const next = () => {
    index++;
    updateCarousel();
    if (index >= total) {
      setTimeout(jumpToStart, 510);
    }
  };

  const prev = () => {
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

  // Initial render
  updateCarousel(false);

  // Adjust on window resize
  window.addEventListener("resize", () => updateCarousel(false));
});

  /* -------------------- */
  /* Konami Code */
  const konamiCode = [
    "arrowup","arrowup","arrowdown","arrowdown",
    "arrowleft","arrowright","arrowleft","arrowright","b","a"
  ];
  let konamiPosition = 0;

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === konamiCode[konamiPosition]) {
      konamiPosition++;
      if (konamiPosition === konamiCode.length) {
        activatePinkMode();
        konamiPosition = 0;
      }
    } else konamiPosition = 0;
  });

  /* -------------------- */
  /* Activate Pink Mode */
  function activatePinkMode() {
    const enabled = document.body.classList.toggle("pink-mode");
    localStorage.setItem("pink-mode", enabled ? "on" : "off");

    if (enabled) {
      const modal = document.getElementById("pink-mode-modal");
      modal?.classList.add("show");
    }
  }
});
