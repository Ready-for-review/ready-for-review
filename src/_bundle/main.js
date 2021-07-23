import "../styles/tailwind.css";
import "plyr/dist/plyr.css";
import Plyr from "plyr";
import Alpine from "alpinejs";

Plyr.setup(".rfr-player");
window.Alpine = Alpine;
Alpine.start();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(function () {
      console.log("ServiceWorker has been registered!");
    })
    .catch(console.error);
}
