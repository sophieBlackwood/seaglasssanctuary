document.addEventListener("DOMContentLoaded", () => {
  // ===================== THEME TOGGLE =====================
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


  // ===================== QUICK EXIT =====================
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

  dismissModal?.addEventListener("click", () => modal.classList.remove("show"));

  // Triple ESC quick-exit
  let escPressCount = 0;
  let escTimer;
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      escPressCount++;
      clearTimeout(escTimer);
      escTimer = setTimeout(() => (escPressCount = 0), 1500);
      if (escPressCount === 3) {
        window.location.href = quickExitURL;
      }
    }
  });

  // ===================== FLOATING BUTTONS =====================
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
        floatingButtons.classList.remove("compact");
        floatingButtons.classList.remove("reveal");
      }
    });

    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    backToTop.addEventListener("mousedown", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => floatingButtons.classList.toggle("reveal"), 600);
      }
    });

    ["mouseup", "mouseleave", "touchend"].forEach((evt) =>
      backToTop.addEventListener(evt, () => clearTimeout(holdTimer))
    );
  }

  // ===================== NAVBAR LOGO & HOME LINK =====================
  const logoImage = document.getElementById("logoImage");
  const homeBtn = document.getElementById("homeBtn");

  [logoImage, homeBtn].forEach((el) => {
    if (el) {
      el.addEventListener("mouseover", () => (el.style.cursor = "pointer"));
      el.addEventListener("mouseout", () => (el.style.cursor = "default"));
      el.addEventListener("click", () => (window.location.href = "index.html"));
    }
  });

  // ===================== MOBILE MENU =====================
  const mobileMenuIcon = document.querySelector(".mobile-menu-icon");
  const navbarLinks = document.querySelector(".navbar-links");

  mobileMenuIcon?.addEventListener("click", () => {
    navbarLinks?.classList.toggle("active");
  });

  // ===================== SIDE NAV =====================
  const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
    document.querySelector(".hamburger-menu").style.display = "none";
  };

  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.querySelector(".hamburger-menu").style.display = "block";
  };

  // Expose functions globally for inline HTML onclick
  window.openNav = openNav;
  window.closeNav = closeNav;
});

/* 🌸 Konami Code Pink Mode + Confetti */
const konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

let konamiPosition = 0;

document.addEventListener("keydown", (e) => {
  const key = e.key;

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

function activatePinkMode() {
  // Toggle the pink mode theme
  document.body.classList.toggle("pink-mode");

  // Trigger confetti burst
  pinkConfetti();
}

/* 🎀 Pink Confetti Burst */
function pinkConfetti() {
  const duration = 1 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 12,
      angle: 60,
      spread: 55,
