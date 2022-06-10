import "plyr/dist/plyr.css";
import Plyr from "plyr";

Plyr.setup(".rfr-player");

// Mobile menu
const btn = document.querySelector("button.hamburger-menu");
const menu = document.querySelector(".mobile-menu");
const open = document.querySelector(".open");
const closed = document.querySelector(".closed");

// Add Event Listeners
btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  open.classList.toggle("hidden");
  closed.classList.toggle("hidden");
});
