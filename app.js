
document.addEventListener("DOMContentLoaded", function() {
  // Fetch and insert header
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;
      // Initialize theme toggle and mobile menu after header is loaded
      initializeThemeToggle();
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
  const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  const themeIconDesktop = themeToggleDesktop ? themeToggleDesktop.querySelector('span') : null;
  const themeIconMobile = themeToggleMobile ? themeToggleMobile.querySelector('span') : null;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeIconDesktop) themeIconDesktop.textContent = 'light_mode';
      if (themeIconMobile) themeIconMobile.textContent = 'light_mode';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIconDesktop) themeIconDesktop.textContent = 'dark_mode';
      if (themeIconMobile) themeIconMobile.textContent = 'dark_mode';
    }
  };

  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  const toggleAction = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      applyTheme('light');
      localStorage.setItem('color-theme', 'light');
    } else {
      applyTheme('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  };

  if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', toggleAction);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleAction);
  }
}

function initializeMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}
