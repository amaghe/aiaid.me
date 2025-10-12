
document.addEventListener("DOMContentLoaded", function() {
  // Fetch and insert header
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;
      // Initialize theme toggle after header is loaded
      initializeThemeToggle();
      // Initialize mobile menu toggle after header is loaded
      initializeMobileMenu();
    });

  // Fetch and insert footer
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
});

function initializeThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const themeIcon = themeToggle.querySelector('span');

    // Check for saved theme or default to light
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }

    themeToggle.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
        if (themeIcon) themeIcon.textContent = 'light_mode';
      }
    });
  }
}

function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden'); // Or 'active' if you use that class
    });
  }
}
