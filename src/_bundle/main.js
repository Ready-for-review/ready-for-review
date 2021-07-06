import "../styles/tailwind.css";
import "plyr/dist/plyr.css";
import Plyr from "plyr";
import Alpine from "alpinejs";

Plyr.setup(".rfr-player");
window.Alpine = Alpine;
Alpine.start();
