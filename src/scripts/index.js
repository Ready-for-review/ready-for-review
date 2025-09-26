import Plyr from "plyr";
import "plyr/dist/plyr.css";

Plyr.setup(".rfr-player");

// Professional Theme Management System
class ThemeManager {
  constructor() {
    this.storageKey = "theme-preference";
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
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

    // Listen for system theme changes
    this.mediaQuery.addEventListener("change", () => {
      if (
        this.getStoredTheme() === this.themes.AUTO ||
        !this.getStoredTheme()
      ) {
        this.applyTheme(this.getSystemTheme());
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
  }

  applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    this.updateThemeIcon(theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content =
        theme === this.themes.DARK ? "#0f172a" : "#ffffff";
    }
  }

  updateThemeIcon(theme) {
    const themeIcon = document.querySelector(".theme-icon");
    if (themeIcon) {
      const storedTheme = this.getStoredTheme();

      // Show different icons based on stored preference
      if (storedTheme === this.themes.AUTO || !storedTheme) {
        themeIcon.textContent = "🌓"; // Auto mode
      } else {
        themeIcon.textContent = theme === this.themes.LIGHT ? "☀️" : "🌙";
      }
    }
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
    this.toggle = document.querySelector(".mobile-menu-toggle");
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
    this.toggle.innerHTML = "✕";
    this.toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    this.isOpen = true;

    // Focus trap for accessibility
    const firstFocusable = this.mobileNav.querySelector("a, button");
    firstFocusable?.focus();
  }

  close() {
    if (!this.mobileNav) return;

    this.mobileNav.classList.remove("active");
    this.toggle.innerHTML = "☰";
    this.toggle.setAttribute("aria-expanded", "false");
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

// Initialize all managers
let themeManager, mobileMenuManager, scrollEffectManager, smoothScrollManager;

document.addEventListener("DOMContentLoaded", function () {
  themeManager = new ThemeManager();
  mobileMenuManager = new MobileMenuManager();
  scrollEffectManager = new ScrollEffectManager();
  smoothScrollManager = new SmoothScrollManager();

  // Make functions globally available for onclick handlers
  window.toggleTheme = () => themeManager.toggle();
  window.toggleMobileMenu = () => mobileMenuManager.toggle();
  window.closeMobileMenu = () => mobileMenuManager.close();
});

// Prefers-reduced-motion support
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
if (prefersReducedMotion.matches) {
  document.documentElement.style.setProperty("scroll-behavior", "auto");
}
