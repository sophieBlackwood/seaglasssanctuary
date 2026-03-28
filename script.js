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

// Blog Carousel  
const blogTrack = document.querySelector(".blog-card-grid");
const blogPrev = document.querySelector(".blog-carousel-btn.prev");
const blogNext = document.querySelector(".blog-carousel-btn.next");
const blogCards = Array.from(document.querySelectorAll(".blog-card"));

if (blogTrack && blogCards.length > 0) {
  const trackStyle = getComputedStyle(blogTrack);
  const gap = parseFloat(trackStyle.gap) || 0;
  const transitionDuration = parseFloat(trackStyle.transitionDuration) * 1000 || 500;
  const total = blogCards.length;

  // Step 1: Duplicate all cards (original + clones)
  const clones = [...blogCards].map(card => card.cloneNode(true));
  clones.forEach(clone => blogTrack.appendChild(clone));

  const allCards = [...blogCards, ...clones]; // Combining original and cloned cards
  let index = blogCards.length; // Start from the first original card after the last clone
  let isTransitioning = false;

  // Helper function to update the carousel's position
  const updateCarousel = (animate = true) => {
    if (isTransitioning && animate) return;
    isTransitioning = animate;

    const cardWidth = blogCards[0].offsetWidth;  // Get card width (same for all cards)
    const offset = index * (cardWidth + gap);  // Calculate the offset based on the current index
    blogTrack.style.transition = animate ? `transform ${transitionDuration / 1000}s ease` : "none";
    blogTrack.style.transform = `translateX(${-offset}px)`;  // Apply transform

    // Reset the transition and allow further interaction after the animation is complete
    if (animate) setTimeout(() => (isTransitioning = false), transitionDuration);
    else isTransitioning = false;
  };

  // Function to jump to the start (first card)
  const jumpToStart = () => {
    index = 0;
    updateCarousel(false); // Instantly reset position without transition
  };

  // Function to move to the next card
  const next = () => {
    if (isTransitioning) return;  // Prevent multiple clicks during transition
    index++;  // Move forward

    // If we reach the last card (clone), reset to the first original card
    if (index >= allCards.length) {
      setTimeout(jumpToStart, transitionDuration + 10);
    } else {
      updateCarousel(); // Apply normal transition
    }
  };

  // Function to move to the previous card
  const prev = () => {
    if (isTransitioning) return;  // Prevent multiple clicks during transition

    // If we are at the first card (the first clone), reset to the last original card
    if (index === 0) {
      index = allCards.length - 1;
      updateCarousel(false); // Instantly reset position without transition
      requestAnimationFrame(() => {
        index--; // Move to the actual last card
        updateCarousel();  // Apply transition
      });
    } else {
      index--; // Move backward
      updateCarousel();  // Apply normal transition
    }
  };

  // Event listeners for next/previous buttons
  blogNext?.addEventListener("click", next);
  blogPrev?.addEventListener("click", prev);

  // Initial setup (without transition)
  updateCarousel(false);

  // Reposition carousel on window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      requestAnimationFrame(() => updateCarousel(false));
    }, 100);
  });
}
});
