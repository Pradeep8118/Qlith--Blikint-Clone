// navbar.js

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const openModalBtn = document.getElementById("open-location-modal");
  const closeModalBtn = document.getElementById("close-location-modal");
  const modal = document.getElementById("location-modal");

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  if (openModalBtn && closeModalBtn && modal) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    // Optional: close modal if clicked outside box
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }
});
