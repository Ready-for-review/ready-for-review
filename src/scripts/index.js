import Plyr from "plyr";
import "plyr/dist/plyr.css";

Plyr.setup(".rfr-player");

// Professional Theme Management System
class ThemeManager {
  constructor() {
    this.storageKey = "theme-preference";
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.themeMenu = null;
    this.isMenuOpen = false;
    this.themes = {
      AUTO: "auto",
      LIGHT: "light",
      DARK: "dark",
    };

    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.getStoredTheme() || this.themes.AUTO);

    // Get theme menu reference
    this.themeMenu = document.getElementById("themeMenu");

    // Listen for system theme changes
    this.mediaQuery.addEventListener("change", () => {
      if (
        this.getStoredTheme() === this.themes.AUTO ||
        !this.getStoredTheme()
      ) {
        this.applyTheme(this.getSystemTheme());
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (this.isMenuOpen && !e.target.closest(".theme-selector")) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  getStoredTheme() {
    return localStorage.getItem(this.storageKey);
  }

  getSystemTheme() {
    return this.mediaQuery.matches ? this.themes.DARK : this.themes.LIGHT;
  }

  getCurrentTheme() {
    const stored = this.getStoredTheme();
    if (stored === this.themes.AUTO || !stored) {
      return this.getSystemTheme();
    }
    return stored;
  }

  setTheme(theme) {
    localStorage.setItem(this.storageKey, theme);

    const actualTheme =
      theme === this.themes.AUTO ? this.getSystemTheme() : theme;
    this.applyTheme(actualTheme);
    this.updateMenuActiveState();
  }

  applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    this.updateThemeIcon();

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content =
        theme === this.themes.DARK ? "#0f172a" : "#ffffff";
    }
  }

  updateThemeIcon() {
    const themeIcon = document.querySelector(".theme-icon");
    if (themeIcon) {
      const currentTheme = this.getCurrentTheme();

      // Show icon based on CURRENT theme state (not stored preference)
      // This shows what the user actually sees
      if (currentTheme === this.themes.LIGHT) {
        themeIcon.textContent = "☀️"; // Light mode
      } else {
        themeIcon.textContent = "🌙"; // Dark mode
      }
    }
  }

  updateMenuActiveState() {
    if (!this.themeMenu) return;

    const storedTheme = this.getStoredTheme() || this.themes.AUTO;
    const buttons = this.themeMenu.querySelectorAll("button");

    buttons.forEach((button) => {
      button.classList.remove("active");
    });

    // Add active class to current selection
    const activeButton = Array.from(buttons).find((button) => {
      const onClick = button.getAttribute("onclick");
      return onClick && onClick.includes(`'${storedTheme}'`);
    });

    if (activeButton) {
      activeButton.classList.add("active");
    }
  }

  toggleMenu() {
    if (!this.themeMenu) return;

    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.themeMenu.classList.add("active");
      this.updateMenuActiveState();
    } else {
      this.themeMenu.classList.remove("active");
    }
  }

  closeMenu() {
    if (!this.themeMenu) return;

    this.isMenuOpen = false;
    this.themeMenu.classList.remove("active");
  }

  toggle() {
    const current = this.getStoredTheme() || this.themes.AUTO;
    let next;

    // Cycle through: auto -> light -> dark -> auto
    switch (current) {
      case this.themes.AUTO:
        next = this.themes.LIGHT;
        break;
      case this.themes.LIGHT:
        next = this.themes.DARK;
        break;
      case this.themes.DARK:
        next = this.themes.AUTO;
        break;
      default:
        next = this.themes.AUTO;
    }

    this.setTheme(next);
  }
}

// Mobile Menu Management
class MobileMenuManager {
  constructor() {
    this.mobileNav = document.getElementById("mobileNav");
    this.toggleButton = document.querySelector(".mobile-menu-toggle");
    this.isOpen = false;

    this.init();
  }

  init() {
    // Close menu on resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Close menu when clicking on overlay (if exists)
    this.mobileNav?.addEventListener("click", (e) => {
      if (e.target === this.mobileNav) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (!this.mobileNav) return;

    this.mobileNav.classList.add("active");
    this.toggleButton.innerHTML = "✕";
    this.toggleButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    this.isOpen = true;

    // Focus trap for accessibility
    const firstFocusable = this.mobileNav.querySelector("a, button");
    firstFocusable?.focus();
  }

  close() {
    if (!this.mobileNav) return;

    this.mobileNav.classList.remove("active");
    this.toggleButton.innerHTML = "☰";
    this.toggleButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    this.isOpen = false;
  }
}

// Enhanced Scroll Effects
class ScrollEffectManager {
  constructor() {
    this.header = document.querySelector("header");
    this.isScrolled = false;
    this.throttleTimer = null;

    this.init();
  }

  init() {
    window.addEventListener("scroll", this.throttleScroll.bind(this), {
      passive: true,
    });
  }

  throttleScroll() {
    if (this.throttleTimer) return;

    this.throttleTimer = setTimeout(() => {
      this.handleScroll();
      this.throttleTimer = null;
    }, 16); // ~60fps
  }

  handleScroll() {
    const shouldBeScrolled = window.scrollY > 100;

    if (shouldBeScrolled !== this.isScrolled) {
      this.isScrolled = shouldBeScrolled;

      if (this.header) {
        this.header.style.boxShadow = shouldBeScrolled
          ? "0 2px 20px var(--shadow)"
          : "none";
      }
    }
  }
}

// Smooth Scrolling Enhancement
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", this.handleAnchorClick.bind(this));
    });
  }

  handleAnchorClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      // Account for header height
      const headerHeight = document.querySelector("header")?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra padding

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Update URL without triggering navigation
      history.pushState(null, null, targetId);
    }
  }
}

// Search Manager
class SearchManager {
  constructor() {
    this.dropdown = document.getElementById("searchDropdown");
    this.searchInitialized = false;

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.dropdown?.classList.contains("active") &&
        !e.target.closest(".search-selector")
      ) {
        this.close();
      }
    });

    // Close dropdown on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.dropdown?.classList.contains("active")) {
        this.close();
      }
    });
  }

  async open() {
    this.dropdown?.classList.add("active");

    // Initialize Pagefind UI only once
    if (!this.searchInitialized) {
      await this.initializePagefind();
      this.searchInitialized = true;
    }

    // Focus search input
    setTimeout(() => {
      const input = document.querySelector(".pagefind-ui__search-input");
      input?.focus();
    }, 100);
  }

  close() {
    this.dropdown?.classList.remove("active");
  }

  toggle() {
    if (this.dropdown?.classList.contains("active")) {
      this.close();
    } else {
      this.open();
    }
  }

  async initializePagefind() {
    // Dynamically load Pagefind CSS if not already loaded
    if (!document.querySelector('link[href*="pagefind-ui.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/pagefind/pagefind-ui.css";
      document.head.appendChild(link);
    }

    // Dynamically load Pagefind JS if not already loaded
    if (!window.PagefindUI) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/pagefind/pagefind-ui.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    // Initialize Pagefind UI
    new window.PagefindUI({
      element: "#search",
      showImages: false,
      showSubResults: true,
    });
  }
}

// Initialize all managers
let themeManager,
  mobileMenuManager,
  scrollEffectManager,
  smoothScrollManager,
  searchManager;

document.addEventListener("DOMContentLoaded", function () {
  themeManager = new ThemeManager();
  mobileMenuManager = new MobileMenuManager();
  scrollEffectManager = new ScrollEffectManager();
  smoothScrollManager = new SmoothScrollManager();
  searchManager = new SearchManager();

  // Make functions globally available for onclick handlers
  window.toggleTheme = () => themeManager.toggle();
  window.toggleThemeMenu = () => themeManager.toggleMenu();
  window.setTheme = (theme) => {
    themeManager.setTheme(theme);
    themeManager.closeMenu();
  };
  window.toggleMobileMenu = () => mobileMenuManager.toggle();
  window.closeMobileMenu = () => mobileMenuManager.close();
  window.toggleSearch = () => searchManager.toggle();
  window.closeSearch = () => searchManager.close();
});

// Prefers-reduced-motion support
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty("scroll-behavior", "auto");
}
