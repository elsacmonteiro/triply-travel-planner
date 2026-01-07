document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-menu");
  
    if (!toggle || !menu) return;
  
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.textContent = menu.classList.contains("open") ? "✕" : "☰";
    });
  });
  