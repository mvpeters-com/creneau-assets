import type Lenis from "lenis";
import lottie, { type AnimationItem } from "lottie-web";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextRevealCurtain } from "./text-reveal";

const lottieUrl =
  "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc16c4926a696f3b9a0941_hover-card-circles.json";

// Function to create intro animation
const createIntroAnimation = (
  gsap: GSAP,
  heroLottie: AnimationItem,
  nav: HTMLElement | null
) => {
  const redOverlay = document.querySelector<HTMLElement>(".red-overlay");
  const redOverlayText =
    document.querySelector<HTMLElement>(".red-overlay-text");

  // Initialize text reveal for container-hero
  let heroTextReveal: TextRevealCurtain | null = null;
  const heroContainer = document.querySelector(".container-hero");
  if (heroContainer) {
    heroTextReveal = new TextRevealCurtain(".container-hero", {
      overlayColor: "#ffffff", // Match your design
    });
  }

  // Check if red overlay has hidden class - if so, skip intro animation
  if (!redOverlay || redOverlay.classList.contains("hidden")) {
    // Just animate nav and play lottie, but still do text reveal
    const quickIntroTl = gsap.timeline({
      onComplete: () => {
        gsap.delayedCall(0.1, () => {
          ScrollTrigger.refresh();
        });
      },
    });

    // Still reveal hero text even when skipping intro
    if (heroTextReveal) {
      quickIntroTl.add(
        heroTextReveal.reveal({
          duration: 1.2,
          ease: "power2.out",
        }),
        0
      );
    }

    return quickIntroTl;
  }

  // Disable scrolling initially
  document.body.style.overflowY = "hidden";

  // Create main intro timeline
  const introTl = gsap.timeline({
    onComplete: () => {
      // Enable scrolling after intro is complete
      document.body.style.overflowY = "auto";
      // Refresh ScrollTrigger to activate scroll animations
      gsap.delayedCall(0.1, () => {
        ScrollTrigger.refresh();
      });
    },
  });

  introTl.set(nav, { y: "-100%" });

  // Step 1: Fade in and scale down red-overlay-text
  if (redOverlayText) {
    introTl
      .fromTo(
        redOverlayText,
        {
          opacity: 0,
          scale: 1,
        },
        {
          opacity: 1,
          scale: 0.8,
          duration: 1,
          ease: "power2.out",
        }
      )
      .to(
        redOverlayText,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        "+=0.2"
      );
  }

  // Animate overlays
  // Check screen width to determine overlay size
  const overlaySize = window.innerWidth < 767 ? "150px" : "300px";

  introTl
    .fromTo(
      redOverlay,
      {
        top: 0,
      },
      {
        top: `calc(100% - ${overlaySize})`,
        ease: "power2.inOut",
      },
      "+=0.3"
    )
    .fromTo(
      redOverlay,
      {
        bottom: 0,
      },
      {
        bottom: `calc(100% - ${overlaySize})`,
        ease: "power2.inOut",
      },
      "+=0.3"
    );

  // Add text reveal animation during the red overlay bottom animation
  if (heroTextReveal) {
    introTl.add(
      heroTextReveal.reveal({
        duration: 1.2,
        ease: "power2.out",
      }),
      "-=1" // Start during the bottom overlay animation
    );
  }

  introTl.fromTo(
    nav,
    {
      y: "-100%",
    },
    {
      y: "0%",
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.5"
  );

  // Play lottie animation - but not completely on mobile
  introTl.call(
    () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // On mobile, play animation until 3/4 of the way through
        const endFrame = Math.floor(heroLottie.totalFrames * 0.75);
        heroLottie.playSegments([0, endFrame], true);
      } else {
        heroLottie.play();
      }
    },
    [],
    "-=0.5"
  );

  return introTl;
};

// Function to initialize hero section animations
const initHeroAnimations = (gsap: GSAP) => {
  const heroLottie = lottie.loadAnimation({
    container: document.querySelector(".hero-lottie") as HTMLElement,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: lottieUrl,
  });

  heroLottie.setSpeed(0.5);

  const nav = document.querySelector<HTMLElement>(".home-nav");

  // Add the nav-transparent class initially if needed
  if (nav && !nav.classList.contains("nav-transparent")) {
    nav.classList.add("nav-transparent");
  }

  // Add slow zoom effect to hero image (independent of intro timeline)
  const heroImage = document.querySelector(".home_hero_image");
  if (heroImage) {
    gsap.fromTo(
      heroImage,
      {
        scale: 1,
      },
      {
        scale: 1.2,
        duration: 20,
        ease: "power2.inOut",
      }
    );
  }

  // Create and run intro animation
  createIntroAnimation(gsap, heroLottie, nav);

  // Text reveal effect is now integrated into the intro animation timeline
  // The .container-hero element will have a curtain-lifting reveal effect
  // that happens during the red overlay bottom animation

  // Create scroll timeline that starts after intro animation
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero_home_section",
      start: "top top",
      end: "+=100%",
      scrub: 0.5,
      pin: true,
      refreshPriority: -1, // Lower priority so it refreshes after intro
    },
  });

  tl.to(".hero-white-overlay", { height: 0, autoAlpha: 1, ease: "none" }, 0)
    .fromTo(
      ".project-label",
      { xPercent: 150, autoAlpha: 1 },
      { xPercent: 0, autoAlpha: 1, ease: "none", duration: 0.2 },
      0.2
    )
    .to(
      ".project-label",
      { xPercent: 150, autoAlpha: 0, ease: "none", duration: 0.2 },
      0.7
    );
};

// Shared animation function for line and circle elements
const animateWeDoElements = (
  gsap: GSAP,
  line: HTMLElement | null,
  circle: HTMLElement | null,
  img: HTMLElement | null,
  expand: boolean
) => {
  if (!line || !circle) return;

  const lineWidth = expand ? "60px" : "27px";
  const circleSize = expand ? "15px" : "0px";
  const imgOpacity = expand ? 1 : 0;

  gsap.to(line, { width: lineWidth, duration: 0.3, ease: "power1.out" });
  gsap.to(circle, {
    width: circleSize,
    height: circleSize,
    duration: 0.3,
    ease: "power1.out",
  });

  // Only animate image if it exists and we're not ignoring it (for mobile)
  if (img) {
    gsap.to(img, { autoAlpha: imgOpacity, duration: 0.3, ease: "power1.out" });
  }
};

// Function to handle we-do items for desktop
const initWeDoItemsDesktop = (gsap: GSAP) => {
  const weDoItems = document.querySelectorAll<HTMLElement>(".we-do-item");

  const weDoTextContainers = document.querySelectorAll<HTMLElement>(
    ".we-do-text-container"
  );

  // Create arrays to store all event listeners for later cleanup
  const eventListeners: {
    element: HTMLElement;
    type: string;
    handler: EventListener;
  }[] = [];

  // Setup the hover animations for the text containers
  weDoTextContainers.forEach((container) => {
    const circle = container.querySelector<HTMLElement>(".we-do-circle");

    // Simple hover animation for text containers
    if (circle) {
      const mouseenterHandler = () => {
        gsap.to(circle, {
          width: "15px",
          height: "15px",
          duration: 0.3,
          ease: "power1.out",
        });
      };

      const mouseleaveHandler = () => {
        gsap.to(circle, {
          width: "0px",
          height: "0px",
          duration: 0.3,
          ease: "power1.out",
        });
      };

      container.addEventListener("mouseenter", mouseenterHandler);
      container.addEventListener("mouseleave", mouseleaveHandler);

      // Store for later cleanup
      eventListeners.push(
        {
          element: container,
          type: "mouseenter",
          handler: mouseenterHandler as EventListener,
        },
        {
          element: container,
          type: "mouseleave",
          handler: mouseleaveHandler as EventListener,
        }
      );
    }
  });

  // Store resize handlers
  const resizeHandlers: number[] = [];

  weDoItems.forEach((item, index) => {
    const line = item.querySelector<HTMLElement>(".we-do-line");
    const img = item.querySelector<HTMLElement>(".we-do-image");
    const circle = item.querySelector<HTMLElement>(".we-do-circle");

    // go img for each and translate them 10% up
    img?.style.setProperty("transform", `translateY(-${(index + 1) * 10}%)`);

    // Function to check if image is off right side of viewport
    const checkImagePosition = () => {
      if (!img) return;

      const randomOffset = 22;

      img.style.right = `-${img.offsetWidth - randomOffset}px`;

      setTimeout(() => {
        const rect = img.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Check specifically if any part of the image is off the right side
        const isOffRightSide = rect.right + 200 > viewportWidth;

        // Calculate how many pixels are off the screen
        const pixelsOffRight = isOffRightSide
          ? rect.right - viewportWidth + viewportWidth * 0.1
          : 0;

        img.style.right = `-${
          img.offsetWidth - pixelsOffRight - randomOffset
        }px`;
      }, 0);
    };

    let interval: number;

    // Check on resize
    const resizeHandler = () => {
      clearTimeout(interval);

      interval = setTimeout(() => {
        checkImagePosition();
      }, 50);
    };

    window.addEventListener("resize", resizeHandler);

    // Store for later cleanup
    eventListeners.push({
      element: window as unknown as HTMLElement,
      type: "resize",
      handler: resizeHandler as EventListener,
    });

    // Initial check
    checkImagePosition();

    setTimeout(() => {
      checkImagePosition();
    }, 100);

    // Use shared animation function for hover effects
    const mouseenterHandler = () => {
      animateWeDoElements(gsap, line, circle, img, true);
    };

    const mouseleaveHandler = () => {
      animateWeDoElements(gsap, line, circle, img, false);
    };

    item.addEventListener("mouseenter", mouseenterHandler);
    item.addEventListener("mouseleave", mouseleaveHandler);

    // Store for later cleanup
    eventListeners.push(
      {
        element: item,
        type: "mouseenter",
        handler: mouseenterHandler as EventListener,
      },
      {
        element: item,
        type: "mouseleave",
        handler: mouseleaveHandler as EventListener,
      }
    );
  });

  // Return cleanup function
  return () => {
    // Remove all event listeners
    eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });

    // Clear all timeouts
    resizeHandlers.forEach((id) => clearTimeout(id));
  };
};

// Function to handle we-do items for mobile
const initWeDoItemsMobile = (gsap: GSAP) => {
  const weDoItems = document.querySelectorAll<HTMLElement>(".we-do-item");

  const weDoSection = document.querySelector<HTMLElement>(
    ".what-we-do-container"
  );

  // Store scroll triggers for later cleanup
  const scrollTriggers: any[] = [];

  if (!weDoSection) return () => {};

  // Create a parent timeline with pinning
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: weDoSection,
      start: "top 20%", // Changed from 20% to 10% to make it freeze closer to the top
      end: "+=50%", // Pin for 300% of viewport height (adjust as needed)
      pin: true,
      scrub: 1, // Smooth scrubbing
      // markers: true, // Uncomment for debugging
    },
  });

  // Store the main ScrollTrigger
  scrollTriggers.push(mainTl.scrollTrigger);

  // Create individual animations for each item
  weDoItems.forEach((item, index) => {
    const line = item.querySelector<HTMLElement>(".we-do-line");
    const circle = item.querySelector<HTMLElement>(".we-do-circle");
    const img = item.querySelector<HTMLElement>(".we-do-image");

    // Calculate the progress point for this item (spread evenly across scroll)
    const itemStartProgress = index / weDoItems.length;
    const itemDuration = (1 / weDoItems.length) * 0.8; // Duration for this item's visibility (80% of its slot)

    // Create nested timeline for this item
    const itemTl = gsap.timeline();

    // Add both in and out animations to the same timeline
    // First animate in
    itemTl
      .fromTo(
        line,
        { width: "25px" },
        { width: "50px", ease: "power1.out", duration: 0.1 }
      )
      .fromTo(
        circle,
        { width: "0px", height: "0px" },
        { width: "15px", height: "15px", ease: "power1.out", duration: 0.1 },
        "<" // Start at the same time as the previous animation
      );

    // Add out animations for line and circle
    itemTl
      .to(
        line,
        { width: "25px", ease: "power1.out", duration: 0.1 },
        itemDuration // Start the out animation after the hold period
      )
      .to(
        circle,
        { width: "0px", height: "0px", ease: "power1.out", duration: 0.1 },
        "<" // Start at the same time as line animation out
      );

    // Add this timeline to the main timeline at the calculated progress point
    mainTl.add(itemTl, itemStartProgress);
  });

  // Return cleanup function
  return () => {
    // Kill all scroll triggers
    scrollTriggers.forEach((trigger) => {
      if (trigger && typeof trigger.kill === "function") {
        trigger.kill();
      }
    });
  };
};

// Main initialization function
const initHome = (lenis: Lenis, gsap: GSAP) => {
  // Initialize hero animations
  initHeroAnimations(gsap);

  // Use GSAP matchMedia instead of manual screen size handling
  let mm = gsap.matchMedia();

  // Desktop (>= 768px) context
  mm.add("(min-width: 768px)", () => {
    console.log("desktop");
    // Initialize desktop view and get the cleanup function
    const cleanup = initWeDoItemsDesktop(gsap);

    // Return cleanup function for when this context is exited
    return cleanup;
  });
};

export { initHome };
