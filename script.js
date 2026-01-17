document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- */
  /* Accessibility: Reduced Motion */
  /* -------------------- */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }

  /* -------------------- */
  /* Theme Toggle */
  /* -------------------- */
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
  /* -------------------- */
  const savedPink = localStorage.getItem("pink-mode");
  if (savedPink === "on") {
    document.body.classList.add("pink-mode");
  }

  /* -------------------- */
  /* Quick Exit */
  /* -------------------- */
  const quickExitBtn = document.getElementById("quick-exit");
  const modal = document.getElementById("quick-exit-modal");
  const dismissModal = document.getElementById("dismiss-modal");
  const quickExitURL = "https://www.google.com/search?q=weather+today&safe=active";

  quickExitBtn?.addEventListener("click", () => {
    window.location.href = quickExitURL;
  });

  if (modal && window.innerWidth > 768 && !sessionStorage.getItem("quick-exit-seen")) {
    modal.classList.add("show");
    sessionStorage.setItem("quick-exit-seen", "true");
  }

  dismissModal?.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  /* -------------------- */
  /* Pink Mode Modal */
  /* -------------------- */
  const pinkModal = document.getElementById("pink-mode-modal");
  const pinkDismiss = document.getElementById("pink-mode-dismiss");
  const pinkDeactivate = document.getElementById("pink-mode-deactivate");

  pinkDismiss?.addEventListener("click", () => {
    pinkModal.classList.remove("show");
  });

  pinkDeactivate?.addEventListener("click", () => {
    document.body.classList.remove("pink-mode");
    localStorage.setItem("pink-mode", "off");
    pinkModal.classList.remove("show");
  });

  /* -------------------- */
  /* Secret Logo Hold */
  /* -------------------- */
  const logo = document.querySelector(".logo");
  let logoHoldTimer;

  logo?.addEventListener("mousedown", () => {
    logoHoldTimer = setTimeout(() => {
      activatePinkMode();
    }, 2000);
  });

  ["mouseup", "mouseleave"].forEach(evt =>
    logo?.addEventListener(evt, () => clearTimeout(logoHoldTimer))
  );

  /* -------------------- */
  /* Triple ESC Quick Exit */
  /* -------------------- */
  let escPressCount = 0;
  let escTimer;

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      escPressCount++;
      clearTimeout(escTimer);
      escTimer = setTimeout(() => escPressCount = 0, 1500);
      if (escPressCount === 3) window.location.href = quickExitURL;
    }
  });

  /* -------------------- */
  /* Floating Buttons */
  /* -------------------- */
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
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend"].forEach(evt =>
      backToTop.addEventListener(evt, () => clearTimeout(holdTimer))
    );
  }

  /* -------------------- */
  /* Smooth Scrolling */
  /* -------------------- */
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

  /* ===================================================== */
  /* BLOG CENTER-FOCUSED CAROUSEL (MOBILE-FRIENDLY) */
  /* ===================================================== */
  const blogTrack = document.querySelector('.blog-card-grid');
  const blogPrev = document.querySelector('.blog-carousel-btn.prev');
  const blogNext = document.querySelector('.blog-carousel-btn.next');
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));

  if (blogTrack && blogCards.length > 0) {
    let blogIndex = 0; // start at first card

    function updateBlogCarousel() {
      const containerWidth = blogTrack.parentElement.offsetWidth;
      const cardGap = parseFloat(getComputedStyle(blogTrack).gap || 0);

      // Get widths of all cards dynamically
      const cardWidths = blogCards.map(card => card.offsetWidth);

      // Calculate offset to center active card
      let offset = 0;
      for (let i = 0; i < blogIndex; i++) offset += cardWidths[i] + cardGap;
      offset += cardWidths[blogIndex] / 2 - containerWidth / 2;

      // Prevent scrolling beyond first/last card
      const maxOffset = blogTrack.scrollWidth - containerWidth;
      offset = Math.min(Math.max(0, offset), maxOffset);

      blogTrack.style.transform = `translateX(-${offset}px)`;

      // Depth scaling for side cards
      blogCards.forEach((card, i) => {
        if (i === blogIndex) {
          card.classList.add('active');
          card.style.transform = 'scale(1)';
        } else {
          card.classList.remove('active');
          const distance = Math.abs(i - blogIndex);
          const scale = Math.max(0.75, 1 - 0.15 * distance);
          card.style.transform = `scale(${scale})`;
        }
      });
    }

    blogNext?.addEventListener('click', () => {
      if (blogIndex < blogCards.length - 1) {
        blogIndex++;
        updateBlogCarousel();
      }
    });

    blogPrev?.addEventListener('click', () => {
      if (blogIndex > 0) {
        blogIndex--;
        updateBlogCarousel();
      }
    });

    window.addEventListener('resize', updateBlogCarousel);
    updateBlogCarousel();
  }

  /* -------------------- */
  /* Side Navigation */
  /* -------------------- */
  window.openNav = function () {
    const sidenav = document.getElementById("mySidenav");
    const hamburger = document.querySelector(".hamburger-menu");
    if (!sidenav) return;
    sidenav.style.width = "250px";
    if (hamburger) hamburger.style.display = "none";
  };

  window.closeNav = function () {
    const sidenav = document.getElementById("mySidenav");
    const hamburger = document.querySelector(".hamburger-menu");
    if (!sidenav) return;
    sidenav.style.width = "0";
    if (hamburger) hamburger.style.display = "block";
  };

  /* -------------------- */
  /* Konami Code */
  /* -------------------- */
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
    } else {
      konamiPosition = 0;
    }
  });

  /* -------------------- */
  /* Activate Pink Mode */
  /* -------------------- */
  function activatePinkMode() {
    const pinkEnabled = document.body.classList.toggle("pink-mode");
    localStorage.setItem("pink-mode", pinkEnabled ? "on" : "off");

    if (pinkEnabled) {
      const pinkModal = document.getElementById("pink-mode-modal");
      if (pinkModal) pinkModal.classList.add("show");
    }
  }

});
