import "lenis/dist/lenis.css";
import Lenis from "lenis";

import "./main.css";

// Import all module initializers
import { initBlogFilters } from "./blog-filters";
import { initWorkFilters } from "./work-filters";
import { initNav } from "./nav";
import { initLinks } from "./links";
import { initHome } from "./home";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import {
  initializeAutoplayAnimations,
  initializeContactAnimations,
  initializeCtaAnimations,
} from "./animations";
import { initializeGridAnimations } from "./grid";
import { initFranchiseSlider } from "./swiper";
import { initCase } from "./case";

console.log("app.ts");

gsap.registerPlugin(ScrollTrigger);
// Initialize smooth scrolling for all pages
const lenis = new Lenis({
  autoRaf: true,
});

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on("scroll", ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

// Map paths to initialization functions
const pathModuleMap: Record<string, Array<() => void>> = {
  // Default modules run on all pages
  default: [initNav, initLinks, initializeCtaAnimations.bind(null, gsap)],
  "/": [
    initHome.bind(null, lenis, gsap),
    initializeGridAnimations,
    initFranchiseSlider,
  ],
  // Page-specific modules
  "/work": [initWorkFilters],
  "/work/*": [initCase.bind(null, gsap)],
  "/world-of-creneau": [initBlogFilters, initializeGridAnimations],
  "/contact": [initializeContactAnimations],
  "/vacancies/*": [initializeAutoplayAnimations],
};

// Initialize appropriate modules based on current path
function initializeModules() {
  // Get current path
  const path = window.location.pathname;

  // Always run default modules
  const modulesToRun = [...pathModuleMap.default];

  console.log(modulesToRun);

  // Add page-specific modules
  Object.entries(pathModuleMap).forEach(([pagePath, modules]) => {
    if (pagePath !== "default") {
      // Check if pagePath contains an asterisk
      if (pagePath.includes("*")) {
        // For paths with asterisk, use startsWith with the part before the asterisk
        const pathPrefix = pagePath.split("*")[0];
        if (path.startsWith(pathPrefix)) {
          modulesToRun.push(...modules);
        }
      } else {
        // For paths without asterisk, use exact matching
        if (path === pagePath) {
          modulesToRun.push(...modules);
        }
      }
    }
  });

  // Run all relevant modules
  modulesToRun.forEach((initFn) => initFn());

  console.log(`Initialized modules for path: ${path}`);
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeModules);
} else {
  initializeModules();
}
