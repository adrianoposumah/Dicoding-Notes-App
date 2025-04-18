import "./components/main.js";
import home from "./script/view/home.js";
import "./style.css";
import "sweetalert2/dist/sweetalert2.min.css";
// Import AOS CSS and JS
import AOS from "aos";
import "aos/dist/aos.css";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS before loading components
  AOS.init({
    duration: 800,
    easing: "ease-out",
    once: false,
    offset: 50,
    delay: 0,
  });

  home();
});
