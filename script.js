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
  /* BLOG CAROUSEL (DESKTOP + MOBILE SAFE) */
  /* ================================================= */

  const blogTrack = document.querySelector(".blog-card-grid");
  const blogContainer = document.querySelector(".blog-carousel-track-container");
  const blogPrev = document.querySelector(".blog-carousel-btn.prev");
  const blogNext = document.querySelector(".blog-carousel-btn.next");
  const blogCards = Array.from(document.querySelectorAll(".blog-card"));

  const isMobileCarousel = () => window.matchMedia("(max-width: 768px)").matches;

  if (blogTrack && blogCards.length > 0) {

    /* ---------- MOBILE ---------- */
    if (isMobileCarousel()) {
      const updateActiveOnScroll = () => {
        const center = blogContainer.scrollLeft + blogContainer.offsetWidth / 2;
        let closest = null;
        let dist = Infinity;

        blogCards.forEach(card => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const d = Math.abs(center - cardCenter);
          if (d < dist) {
            dist = d;
            closest = card;
          }
        });

        blogCards.forEach(card => card.classList.toggle("active", card === closest));
      };

      blogContainer.addEventListener("scroll", () => requestAnimationFrame(updateActiveOnScroll));
      updateActiveOnScroll();
      return;
    }

    /* ---------- DESKTOP (NO JUMPING) ---------- */
    const firstClone = blogCards[0].cloneNode(true);
    const lastClone = blogCards[blogCards.length - 1].cloneNode(true);
    blogTrack.appendChild(firstClone);
    blogTrack.insertBefore(lastClone, blogTrack.firstChild);

    let index = 0;
    let isMoving = false;
    const total = blogCards.length;

    function update(animate = true) {
      const cards = Array.from(blogTrack.children);
      const gap = parseFloat(getComputedStyle(blogTrack).gap) || 0;
      const cardWidth = cards[0].offsetWidth;
      const containerWidth = blogTrack.parentElement.offsetWidth;

      const visualIndex = index + 1;
      const offset =
        visualIndex * (cardWidth + gap) -
        containerWidth / 2 +
        cardWidth / 2;

      blogTrack.style.transition = animate ? "transform 0.4s ease" : "none";
      blogTrack.style.transform = `translateX(${-offset}px)`;

      cards.forEach((card, i) => {
        const active = i === visualIndex;
        card.classList.toggle("active", active);
        const inner = card.querySelector(".blog-card-inner");
        if (inner) {
          inner.style.transform = `scale(${active ? 1 : 0.9})`;
          inner.style.opacity = active ? "1" : "0.6";
          inner.style.boxShadow = active
            ? "0 14px 36px rgba(0,0,0,0.25)"
            : "0 6px 20px rgba(0,0,0,0.12)";
        }
      });
    }

    function jump() {
      blogTrack.style.transition = "none";
      requestAnimationFrame(() => {
        update(false);
        requestAnimationFrame(() => {
          blogTrack.style.transition = "transform 0.4s ease";
        });
      });
    }

    function onEnd(e) {
      if (e.target !== blogTrack || e.propertyName !== "transform") return;
      isMoving = false;
      if (index >= total) {
        index = 0;
        jump();
      }
      if (index < 0) {
        index = total - 1;
        jump();
      }
    }

    function next() {
      if (isMoving) return;
      isMoving = true;
      index++;
      update(true);
    }

    function prev() {
      if (isMoving) return;
      isMoving = true;
      index--;
      update(true);
    }

    blogNext?.addEventListener("click", next);
    blogPrev?.addEventListener("click", prev);
    blogTrack.addEventListener("transitionend", onEnd);
    window.addEventListener("resize", () => update(false));

    update(false);
  }

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
