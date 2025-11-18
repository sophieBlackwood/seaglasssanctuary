// =========================================================
//  BALANCE POINT JS
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

  // -------------------------
  // THEME TOGGLE
  // -------------------------
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

  // -------------------------
  // QUICK EXIT FEATURE (once per tab)
  // -------------------------
  const quickExitBtn = document.getElementById("quick-exit");
  const modal = document.getElementById("quick-exit-modal");
  const dismissModal = document.getElementById("dismiss-modal");
  const quickExitURL = "https://www.google.com/search?q=weather+today&safe=active";

  // Quick Exit button
  quickExitBtn?.addEventListener("click", () => {
    window.location.href = quickExitURL;
  });

  // Show modal once per tab on desktop
  if (modal && window.innerWidth > 768 && !sessionStorage.getItem("quick-exit-seen")) {
    modal.classList.add("show");
    sessionStorage.setItem("quick-exit-seen", "true");
  }

  // Dismiss modal button only
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

  // -------------------------
  // FLOATING BUTTONS (Back-to-Top + Theme)
  // -------------------------
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

  // -------------------------
  // COUNSELOR BOOKING MODAL + MAILTO FALLBACK
  // -------------------------
  const bookingModal = document.getElementById("booking-modal");
  const bookingForm = document.getElementById("booking-form");
  const bookingCounselorText = document.getElementById("booking-counselor");
  const formCounselorInput = document.getElementById("form-counselor");
  const openCalendlyLink = document.getElementById("open-calendly");

  if (bookingModal && bookingForm) {
    // Open modal
    document.querySelectorAll(".schedule-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-counselor") || "Counselor";
        const calendly = btn.getAttribute("data-calendly") || "#";
        openBookingModal(name, calendly);
      });
    });

    function openBookingModal(counselorName, calendlyUrl) {
      bookingCounselorText &&
        (bookingCounselorText.textContent = `For: ${counselorName}`);
      formCounselorInput && (formCounselorInput.value = counselorName);
      openCalendlyLink && (openCalendlyLink.href = calendlyUrl);
      bookingModal.setAttribute("aria-hidden", "false");
      bookingModal.querySelector('input[name="name"]')?.focus();
    }

    function closeBookingModal() {
      bookingModal.setAttribute("aria-hidden", "true");
      bookingForm.reset();
    }

    bookingModal.querySelector(".modal-close")?.addEventListener("click", closeBookingModal);
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = new FormData(bookingForm);
      const counselor = form.get("counselor");
      const name = form.get("name");
      const email = form.get("email");
      const phone = form.get("phone") || "N/A";
      const pref = form.get("pref") || "No preference";
      const reason = form.get("reason") || "N/A";

      const subject = encodeURIComponent(`Appointment request — ${counselor}`);
      const body = encodeURIComponent(
        `Counselor: ${counselor}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPreferred: ${pref}\nReason: ${reason}`
      );

      const mailTo = `mailto:example@seaglasssanctuary.org?subject=${subject}&body=${body}`;
      window.location.href = mailTo;
      setTimeout(closeBookingModal, 600);
    });
  }
});
