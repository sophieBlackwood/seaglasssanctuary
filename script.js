/* ================================================= */
/* MAIN SCRIPT: Seaglass Sanctuary - PRODUCTION FIXED */
/* ================================================= */

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
  /* Theme Toggle (Light / Dark ONLY) */
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }

    // Set initial icon
    const isDark = document.body.classList.contains("dark");
    themeToggle.innerHTML = isDark
      ? '<i class="fa-regular fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';

    themeToggle.addEventListener("click", () => {
      document.body.classList.add("theme-transition");

      document.body.classList.toggle("dark");
      const darkMode =
        document.body.classList.contains("dark");

      themeToggle.innerHTML = darkMode
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      localStorage.setItem("theme", darkMode ? "dark" : "light");

      setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, 700);
    });
  }

  /* -------------------- */
  /* Quick Exit */
  const quickExitBtn = document.getElementById("quick-exit");
  const quickExitURL =
    "https://www.google.com/search?q=weather+today&safe=active";

  quickExitBtn?.addEventListener("click", () => {
    window.location.replace(quickExitURL);
  });

  /* -------------------- */
  /* Floating Buttons */
  const backToTop = document.getElementById("back-to-top");
  const floatingButtons = document.getElementById("floating-buttons");
  let holdTimer;

  if (backToTop && floatingButtons) {
    const isMobile = () =>
      window.matchMedia("(max-width: 768px)").matches;

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

    backToTop.addEventListener("mousedown", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend"].forEach(evt =>
      backToTop.addEventListener(evt, () =>
        clearTimeout(holdTimer)
      )
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
  /* BLOG CAROUSEL - NO FLICKER LOOP */
  /* ================================================= */

  const blogTrack = document.querySelector(".blog-card-grid");
  const blogPrev = document.querySelector(".blog-carousel-btn.prev");
  const blogNext = document.querySelector(".blog-carousel-btn.next");
  const blogCards = Array.from(
    document.querySelectorAll(".blog-card")
  );

  if (blogTrack && blogCards.length > 0) {
    blogTrack.style.opacity = "0";

    const gap =
      parseFloat(getComputedStyle(blogTrack).gap) || 0;
    const total = blogCards.length;

    blogCards.forEach(card =>
      blogTrack.appendChild(card.cloneNode(true))
    );

    let index = 0;

    const updateCarousel = (animate = true) => {
      const cardWidth = blogCards[0].offsetWidth;
      const offset = index * (cardWidth + gap);
      blogTrack.style.transition = animate
        ? "transform 0.5s ease"
        : "none";
      blogTrack.style.transform =
        `translateX(${-offset}px)`;
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

    updateCarousel(false);
    blogTrack.style.opacity = "1";

    window.addEventListener("resize", () =>
      updateCarousel(false)
    );
  }

});
