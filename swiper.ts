import { applyWithViewTransition } from "./util";
import Swiper from "swiper";
import "swiper/swiper.min.css";

function initFranchiseSlider() {
  function init() {
    // Initialize Swiper
    new Swiper("#franchise-slider", {
      slidesPerGroup: 1,
      grabCursor: true,
      spaceBetween: 28,
      allowTouchMove: true,
      breakpoints: {
        0: {
          slidesPerView: 1.2,
          slidesPerGroup: 1,
          spaceBetween: 16,
        },
        480: {
          slidesPerView: 1.2,
          slidesPerGroup: 1,
          spaceBetween: 16,
        },
        767: {
          slidesPerView: 2.75,
          slidesPerGroup: 1,
          spaceBetween: 48,
        },
        992: {
          slidesPerView: 3.2,
          slidesPerGroup: 1,
          spaceBetween: 136,
        },
      },
    });

    new Swiper("#world-slider", {
      slidesPerGroup: 1,
      grabCursor: true,
      spaceBetween: 28,
      allowTouchMove: true,
      breakpoints: {
        0: {
          slidesPerView: 1.2,
          slidesPerGroup: 1,
          spaceBetween: 16,
        },
        480: {
          slidesPerView: 1.2,
          slidesPerGroup: 1,
          spaceBetween: 16,
        },
        767: {
          slidesPerView: 2.75,
          slidesPerGroup: 1,
          spaceBetween: 32,
        },
        992: {
          slidesPerView: 3.2,
          slidesPerGroup: 1,
          spaceBetween: 32,
        },
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 1,
          spaceBetween: 32,
        },
      },
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

// Make this file a module
export { initFranchiseSlider as initFranchiseSlider };
