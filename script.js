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

  /* ================================================= */
  /* BLOG CAROUSEL (DESKTOP + MOBILE SAFE) */
  /* ================================================= */

  const blogTrack = document.querySelector('.blog-card-grid');
  const blogContainer = document.querySelector('.blog-carousel-track-container');
  const blogPrev = document.querySelector('.blog-carousel-btn.prev');
  const blogNext = document.querySelector('.blog-carousel-btn.next');
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));

  const isMobileCarousel = () => window.matchMedia("(max-width: 768px)").matches;

  if (blogTrack && blogCards.length > 0) {

    /* ---------- MOBILE: native scroll + active sync ---------- */
    if (isMobileCarousel()) {

      const updateActiveOnScroll = () => {
        const containerCenter =
          blogContainer.scrollLeft + blogContainer.offsetWidth / 2;

        let closestCard = null;
        let closestDistance = Infinity;

        blogCards.forEach(card => {
          const cardCenter =
            card.offsetLeft + card.offsetWidth / 2;

          const distance = Math.abs(containerCenter - cardCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
          }
        });

        blogCards.forEach(card =>
          card.classList.toggle("active", card === closestCard)
        );
      };

      blogContainer.addEventListener("scroll", () => {
        requestAnimationFrame(updateActiveOnScroll);
      });

      updateActiveOnScroll();
      return;
    }

    /* ---------- DESKTOP: transform-based infinite carousel ---------- */

    const firstClone = blogCards[0].cloneNode(true);
    const lastClone = blogCards[blogCards.length - 1].cloneNode(true);

    blogTrack.appendChild(firstClone);
    blogTrack.insertBefore(lastClone, blogTrack.firstChild);

    let blogIndex = 0;
    let isMoving = false;

    function updateBlogCarousel(animate = true) {
      const allCards = Array.from(blogTrack.children);
      const containerWidth = blogTrack.parentElement.offsetWidth;
      const cardGap = parseFloat(getComputedStyle(blogTrack).gap || 0);
      const cardWidth = allCards[0].offsetWidth;

      const offset =
        (blogIndex + 1) * (cardWidth + cardGap) -
        (containerWidth / 2) +
        (cardWidth / 2);

      blogTrack.style.transition = animate ? 'transform 0.4s ease-in-out' : 'none';
      blogTrack.style.transform = `translateX(${-offset}px)`;

      allCards.forEach((card, i) => {
        const isCenter = i === blogIndex + 1;
        card.classList.toggle('active', isCenter);

        const distance = Math.abs(i - (blogIndex + 1));
        const scale = isCenter ? 1 : Math.max(0.8, 1 - 0.1 * distance);
        card.style.transform = `scale(${scale})`;
        card.style.opacity = isCenter ? '1' : '0.6';
      });
    }

    function handleTransitionEnd() {
      isMoving = false;

      if (blogIndex >= blogCards.length) {
        blogIndex = 0;
        updateBlogCarousel(false);
      } else if (blogIndex < 0) {
        blogIndex = blogCards.length - 1;
        updateBlogCarousel(false);
      }
    }

    function moveNext() {
      if (isMoving) return;
      isMoving = true;
      blogIndex++;
      updateBlogCarousel(true);
    }

    function movePrev() {
      if (isMoving) return;
      isMoving = true;
      blogIndex--;
      updateBlogCarousel(true);
    }

    blogNext?.addEventListener('click', moveNext);
    blogPrev?.addEventListener('click', movePrev);
    blogTrack.addEventListener('transitionend', handleTransitionEnd);

    window.addEventListener('resize', () => {
      updateBlogCarousel(false);
    });

    updateBlogCarousel(false);
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
