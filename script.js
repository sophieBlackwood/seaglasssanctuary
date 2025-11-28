document.addEventListener("DOMContentLoaded", () => {

  //Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");

    // Restore saved theme
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    // Toggle theme
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      const darkMode = document.body.classList.contains("dark");
      themeToggle.innerHTML = darkMode
        ? '<i class="fa-regular fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      localStorage.setItem("theme", darkMode ? "dark" : "light");
    });
  }


  //Restore Pink Mode
  const savedPink = localStorage.getItem("pink-mode");
  if (savedPink === "on") {
    document.body.classList.add("pink-mode");
  }


  //Quick Exit Button and Modal
  const quickExitBtn = document.getElementById("quick-exit");
  const modal = document.getElementById("quick-exit-modal");
  const dismissModal = document.getElementById("dismiss-modal");
  const quickExitURL = "https://www.google.com/search?q=weather+today&safe=active";

  // Quick exit redirect
  quickExitBtn?.addEventListener("click", () => {
    window.location.href = quickExitURL;
  });

  // Show modal once per session (desktop only)
  if (modal && window.innerWidth > 768 && !sessionStorage.getItem("quick-exit-seen")) {
    modal.classList.add("show");
    sessionStorage.setItem("quick-exit-seen", "true");
  }

  dismissModal?.addEventListener("click", () => modal.classList.remove("show"));


  //Pink Mode Modal
  const pinkModal = document.getElementById("pink-mode-modal");
  const pinkDismiss = document.getElementById("pink-mode-dismiss");

  pinkDismiss?.addEventListener("click", () => {
    pinkModal.classList.remove("show");
  });


  //Triple Esc Quick Exit
  let escPressCount = 0;
  let escTimer;

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      escPressCount++;
      clearTimeout(escTimer);

      escTimer = setTimeout(() => (escPressCount = 0), 1500);

      if (escPressCount === 3) window.location.href = quickExitURL;
    }
  });


 //Floating Buttons and Back to Top
  const backToTop = document.getElementById("back-to-top");
  const floatingButtons = document.getElementById("floating-buttons");
  let holdTimer;

  if (backToTop && floatingButtons) {
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    // Scroll behavior
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
        floatingButtons.classList.add("compact");
      } else {
        backToTop.classList.remove("visible");
        floatingButtons.classList.remove("compact", "reveal");
      }
    });

    // Smooth scroll to top
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    // Long-press reveal (mobile)
    backToTop.addEventListener("mousedown", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend"].forEach((evt) =>
      backToTop.addEventListener(evt, () => clearTimeout(holdTimer))
    );
  }
});


//Side Nav
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


// Secret Pink Mode :)
const konamiCode = [
  "arrowup", "arrowup",
  "arrowdown", "arrowdown",
  "arrowleft", "arrowright",
  "arrowleft", "arrowright",
  "b", "a",
];

let konamiPosition = 0;

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (key === konamiCode[konamiPosition]) {
    konamiPosition++;

    // Completed sequence → activate pink mode
    if (konamiPosition === konamiCode.length) {
      activatePinkMode();
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
});


// Toggle Pink Mode
function activatePinkMode() {
  const enabled = document.body.classList.toggle("pink-mode");
  localStorage.setItem("pink-mode", enabled ? "on" : "off");

  // Show modal ONLY when turning pink mode on
  if (enabled) {
    const pinkModal = document.getElementById("pink-mode-modal");
    if (pinkModal) pinkModal.classList.add("show");
  }
}
