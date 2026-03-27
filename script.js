const MOBILE_BREAKPOINT = 560; // ✅ matches your CSS

function openNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    sidenav.style.width = "250px";
    hamburger.style.display = "none";
  }
}

function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;
  sidenav.style.width = "0";
  if (window.innerWidth <= MOBILE_BREAKPOINT) {
    hamburger.style.display = "flex";
  }
}

// Accessibility: Reduced Motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
  document.documentElement.style.scrollBehavior = "auto";
}

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------
  // Mobile Dropdowns
  // -----------------------
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown > a');
  mobileDropdowns.forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        e.preventDefault();
        const menu = link.nextElementSibling;
        menu.classList.toggle('show');
        link.classList.toggle('open');
      }
    });
  });

  // Blog Dropdown (mobile only)
  const blogDropdownLinks = document.querySelectorAll('.blog-dropdown > a');
  blogDropdownLinks.forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        e.preventDefault();
        const menu = link.nextElementSibling;
        menu.classList.toggle('show');
      }
    });
  });

  // -----------------------
  // Theme Toggle
  // -----------------------
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

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
      const transitionDuration =
        parseFloat(getComputedStyle(document.body).transitionDuration) * 1000 || 700;
      setTimeout(() => document.body.classList.remove("theme-transition"), transitionDuration);
    });
  }

  // -----------------------
  // Quick Exit Modal
  // -----------------------
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

  // -----------------------
  // Quick Exit Button
  // -----------------------
  const quickExitBtn = document.getElementById("quick-exit");
  const quickExitURL = "https://www.amazon.com/s?k=water+bottle";
  if (quickExitBtn) {
    quickExitBtn.addEventListener("click", () => window.location.replace(quickExitURL));
  }

  // -----------------------
  // Triple ESC Rerouting
  // -----------------------
  let escPressCount = 0;
  let escTimer;
  document.addEventListener("keydown", e => {
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

  // -----------------------
  // Floating Buttons
  // -----------------------
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
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    backToTop.addEventListener("touchstart", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt => {
      backToTop.addEventListener(evt, () => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      });
    });
  }

  // -----------------------
  // Smooth Scrolling
  // -----------------------
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

  // -----------------------
  // Blog Carousel: Seamless Infinite
  // -----------------------
  const blogTrack = document.querySelector(".blog-card-grid");
  const blogCards = Array.from(document.querySelectorAll(".blog-card"));

  if (blogTrack && blogCards.length > 0) {
    const gap = parseFloat(getComputedStyle(blogTrack).gap) || 0;
    const total = blogCards.length;

    // Clone cards at start and end for seamless infinite scroll
    const clonesStart = blogCards.map(card => card.cloneNode(true));
    const clonesEnd = blogCards.map(card => card.cloneNode(true));
    clonesStart.forEach(clone => blogTrack.insertBefore(clone, blogTrack.firstChild));
    clonesEnd.forEach(clone => blogTrack.appendChild(clone));

    // Card width and start position
    let cardWidth = blogCards[0].offsetWidth + gap;
    const startPosition = total * cardWidth;
    let index = 0;
    blogTrack.scrollLeft = startPosition;

    // Scroll function
    const scrollToIndex = (i, smooth = true) => {
      blogTrack.scrollTo({
        left: startPosition + i * cardWidth,
        behavior: smooth ? "smooth" : "auto"
      });
    };

    // Next / Prev arrows (desktop only)
    const blogPrev = document.querySelector(".blog-carousel-btn.prev");
    const blogNext = document.querySelector(".blog-carousel-btn.next");

    const next = () => { index++; scrollToIndex(index); };
    const prev = () => { index--; scrollToIndex(index); };

    blogNext?.addEventListener("click", next);
    blogPrev?.addEventListener("click", prev);

    // Infinite scroll reset when reaching clones
    blogTrack.addEventListener("scroll", () => {
      if (blogTrack.scrollLeft <= 0 || blogTrack.scrollLeft >= (total * 3) * cardWidth) {
        blogTrack.scrollLeft = startPosition + index * cardWidth;
      }
    });

    // Resize
    window.addEventListener("resize", () => {
      cardWidth = blogCards[0].offsetWidth + gap;
      blogTrack.scrollLeft = startPosition + index * cardWidth;
    });
  }

  // -----------------------
  // Resize Sync Fix
  // -----------------------
  window.addEventListener("resize", () => {
    const sidenav = document.getElementById("mySidenav");
    const hamburger = document.querySelector(".hamburger-menu");
    if (window.innerWidth > MOBILE_BREAKPOINT && sidenav && hamburger) {
      sidenav.style.width = "0";
      hamburger.style.display = "flex";
    }
  });
});
