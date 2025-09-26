import { initializeGridAnimations as initGridHoverAnimations } from "./animations";
import { gsap } from "gsap";

// Export combined function that runs both the hover animations and GSAP timeline animations
export function initializeGridAnimations() {
  // Initialize hover animations from animations.ts
  initGridHoverAnimations();

  // Initialize GSAP timeline animations
  initGridTimelineAnimations();
}

// Function to initialize GSAP timeline animations for grid items
function initGridTimelineAnimations() {
  gsap.matchMedia().add("(min-width: 991px)", () => {
    // First grid item animation
    let tlhome1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".grid_item:nth-child(15n+1)",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    tlhome1.to(".grid_item:nth-child(15n+1) .grid_link-block", {
      marginTop: "auto",
    });

    // Second grid item animation
    let tlhome2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".grid_item:nth-child(15n+6)",
        start: "top bottom",
        end: "bottom 10rem",
        scrub: true,
      },
    });

    tlhome2.to(".grid_item:nth-child(15n+6) .cta_block", {
      marginTop: "auto",
    });

    // Return cleanup function
    return () => {
      // Clean up animations when media query no longer matches
      tlhome1.kill();
      tlhome2.kill();
    };
  });
}
