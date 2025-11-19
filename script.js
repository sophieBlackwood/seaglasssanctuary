document.addEventListener("DOMContentLoaded", () => {

  // Theme toggle
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

  // Quick exit feature
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

  // Floating buttons (back-to-top + theme)
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
        floatingButtons.classList.remove("compact");
        floatingButtons.classList.remove("reveal");
      }
    });

    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    backToTop.addEventListener("mousedown", () => {
      if (isMobile()) {
        holdTimer = setTimeout(() => {
          floatingButtons.classList.toggle("reveal");
        }, 600);
      }
    });

    ["mouseup", "mouseleave", "touchend"].forEach((evt) => {
      backToTop.addEventListener(evt, () => clearTimeout(holdTimer));
    });
  }
});
