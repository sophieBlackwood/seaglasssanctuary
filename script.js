// =========================
// Sidenav
// =========================
function openNav() {
  const sidenav = document.getElementById("mySidenav");
  const hamburger = document.querySelector(".hamburger-menu");
  if (!sidenav || !hamburger) return;

  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  if (isMobile) {
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

// =========================
// Accessibility: Reduced Motion
// =========================
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  document.documentElement.style.scrollBehavior = "auto";
}

document.addEventListener("DOMContentLoaded", () => {

  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
  const isMid = () => window.matchMedia("(max-width: 1000px)").matches;

  // =========================
  // 🔥 Dynamic "More" Menu
  // =========================
  const moreMenu = document.querySelector(".more-menu");
  const hiddenItems = document.querySelectorAll(".hide-on-mid");
  const moreDropdown = document.querySelector(".more-dropdown");

  const populateMoreMenu = () => {
    if (!moreMenu || !moreDropdown) return;

    moreMenu.innerHTML = "";

    if (isMid() && !isMobile()) {
      hiddenItems.forEach(item => {
        const link = item.querySelector("a");
        if (!link) return;

        const clone = link.cloneNode(true);
        const li = document.createElement("li");
        li.appendChild(clone);
        moreMenu.appendChild(li);
      });

      moreDropdown.style.display = "inline-block";
    } else {
      moreDropdown.style.display = "none";
    }
  };

  populateMoreMenu();

  let moreResizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(moreResizeTimeout);
    moreResizeTimeout = setTimeout(populateMoreMenu, 150);
  });

  // =========================
  // Mobile Dropdowns
  // =========================
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown > a');

  mobileDropdowns.forEach(link => {
    link.addEventListener('click', e => {
      if (isMobile()) {
        e.preventDefault();
        const menu = link.nextElementSibling;
        if (menu) menu.classList.toggle('show');
        link.classList.toggle('open');
      }
    });
  });

  // =========================
  // Theme Toggle
  // =========================
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
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
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

      const durations = getComputedStyle(document.body).transitionDuration.split(',');
      const maxDuration = Math.max(...durations.map(d => parseFloat(d))) * 1000 || 700;

      setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, maxDuration);
    });
  }

  // =========================
  // Quick Exit Modal
  // =========================
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

  // =========================
  // Quick Exit
  // =========================
  const quickExitBtn = document.getElementById("quick-exit");
  const quickExitURL = "https://www.amazon.com/s?k=water+bottle";

  if (quickExitBtn) {
    quickExitBtn.addEventListener("click", () => {
      window.location.replace(quickExitURL);
    });
  }

  // =========================
  // Triple ESC
  // =========================
  let escPressCount = 0;
  let escTimer;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      escPressCount++;
      clearTimeout(escTimer);

      if (escPressCount >= 3) {
        window.location.replace(quickExitURL);
        escPressCount = 0;
      } else {
        escTimer = setTimeout(() => { escPressCount = 0; }, 1000);
      }
    }
  });

  // =========================
  // Floating Buttons
  // =========================
  const backToTop = document.getElementById("back-to-top");
  const floatingButtons = document.getElementById("floating-buttons");
  let holdTimer;

  if (backToTop && floatingButtons) {

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
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt =>
      backToTop.addEventListener(evt, () => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
      })
    );
  }

  // =========================
  // Smooth Scrolling
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      let targetEl;
      try {
        targetEl = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!targetEl) return;

      e.preventDefault();

      const header = document.querySelector("header");
      const yOffset = header ? -header.offsetHeight : -80;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  });

  // =========================
  // Resize Reset (Hamburger)
  // =========================
  window.addEventListener("resize", () => {
    const sidenav = document.getElementById("mySidenav");
    const hamburger = document.querySelector(".hamburger-menu");

    if (!isMobile() && sidenav && hamburger) {
      sidenav.style.width = "0";
      hamburger.style.display = "flex";
    }

    populateMoreMenu();
  });

  // =========================
  // Blog Dropdown (Mobile)
  // =========================
  const blogDropdownLinks = document.querySelectorAll('.blog-dropdown > a');

  blogDropdownLinks.forEach(link => {
    link.addEventListener('click', e => {
      if (isMobile()) {
        e.preventDefault();
        const menu = link.nextElementSibling;
        if (menu) menu.classList.toggle('show');
      }
    });
  });

  // =========================
  // 🔁 Continuous Infinite Blog Carousel
  // =========================
  const carouselTrack = document.querySelector(".blog-card-grid");
  const prevBtn = document.querySelector(".blog-carousel-btn.prev");
  const nextBtn = document.querySelector(".blog-carousel-btn.next");

  if (carouselTrack && prevBtn && nextBtn) {
    const isMobileView = () => window.innerWidth <= 900;

    const setupContinuousCarousel = () => {
      document.querySelectorAll(".blog-card.clone").forEach(el => el.remove());

      const cards = Array.from(carouselTrack.querySelectorAll(".blog-card"));
      if (!cards.length) return;

      const cardWidth = cards[0].offsetWidth + 32;

      // Clone all cards for seamless loop
      cards.forEach(c => {
        const clone = c.cloneNode(true);
        clone.classList.add("clone");
        carouselTrack.appendChild(clone);
      });

      let position = 0;
      const speed = 1; // px/frame, adjust for smoothness
      let direction = 0; // 1=next, -1=prev, 0=idle

      const move = () => {
        if (!isMobileView()) {
          position += speed * direction;
          const totalWidth = cards.length * cardWidth;
          if (position >= totalWidth) position = 0;
          if (position < 0) position = totalWidth;
          carouselTrack.style.transform = `translateX(-${position}px)`;
        }
        requestAnimationFrame(move);
      };

      requestAnimationFrame(move);

      nextBtn.onmousedown = () => direction = 1;
      nextBtn.onmouseup = () => direction = 0;
      nextBtn.onmouseleave = () => direction = 0;

      prevBtn.onmousedown = () => direction = -1;
      prevBtn.onmouseup = () => direction = 0;
      prevBtn.onmouseleave = () => direction = 0;

      nextBtn.onclick = () => { if (!isMobileView()) position += cardWidth; };
      prevBtn.onclick = () => { if (!isMobileView()) position -= cardWidth; };

      window.addEventListener("resize", setupContinuousCarousel);
    };

    setupContinuousCarousel();
  }

});
