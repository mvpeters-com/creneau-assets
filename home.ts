import type Lenis from "lenis";
import lottie from "lottie-web";

const lottieUrl =
  "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc16c4926a696f3b9a0941_hover-card-circles.json";

// Function to initialize hero section animations
const initHeroAnimations = (lenis: Lenis, gsap: GSAP) => {
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

  // Keep track of scroll direction and animation state
  let lastScrollProgress = 0;
  let isAnimatingForward = true;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero_home_section",
      start: "top top",
      end: "+=150%", // how many % of viewport height to scroll through
      scrub: 0.5,
      pin: true,
      onUpdate: (self) => {
        // Check if we've crossed the animation trigger point (50% of the timeline)
        const currentProgress = self.progress;
        const triggerPoint = 0.5;

        // Determine scroll direction
        const isScrollingDown = currentProgress > lastScrollProgress;

        // If we crossed the 0.5 mark in either direction
        if (
          (lastScrollProgress < triggerPoint &&
            currentProgress >= triggerPoint) ||
          (lastScrollProgress >= triggerPoint && currentProgress < triggerPoint)
        ) {
          // If direction changed, set animation direction
          if (isScrollingDown !== isAnimatingForward) {
            isAnimatingForward = isScrollingDown;
            heroLottie.setDirection(isAnimatingForward ? 1 : -1);
          }

          // Play from current position
          heroLottie.play();
        }

        lastScrollProgress = currentProgress;
      },
    },
  });

  tl.fromTo(
    ".home_hero_image",
    { scale: 1.2 },
    { scale: 1, ease: "none" },
    0 // start at the very beginning
  )
    .fromTo(
      ".hero-white-overlay",
      { height: 0, autoAlpha: 0 },
      { height: "calc(100vh - 100px)", autoAlpha: 1, ease: "none" },
      0 // ← same exact position
    )
    .fromTo(
      ".project-label",
      { xPercent: 100, autoAlpha: 0 },
      { xPercent: 0, autoAlpha: 1, ease: "none", duration: 0.4 },
      0
    )
    .fromTo(
      ".home-nav",
      { y: "-100%" },
      { y: "0%", ease: "none", duration: 0.1 },
      0.45
    )
    .to(
      ".home-nav .int-logo",
      {
        x: "40px",
        ease: "power2.out",
        duration: 0.1,
      },
      0.6
    )
    // Remove the nav-transparent class at 90% progress
    .call(
      () => {
        if (nav && nav.classList.contains("nav-transparent")) {
          nav.classList.remove("nav-transparent");
        } else if (nav) {
          nav.classList.add("nav-transparent");
        }
      },
      [],
      0.9
    )
    .to(".hero-white-overlay", { height: 0, autoAlpha: 1, ease: "none" }, 0.7)
    .fromTo(
      ".project-label",
      { xPercent: 0, autoAlpha: 1 },
      { xPercent: 100, autoAlpha: 0, ease: "none", duration: 0.4 },
      0.7
    )
    .fromTo(
      ".home-nav",
      { y: "0%" },
      { y: "-100%", ease: "none", duration: 0.1 },
      0.7
    );

  // Create a timeline for the What We Do section with nav reappearance
  const whatWeDotl = gsap.timeline({
    scrollTrigger: {
      trigger: ".padding-what-we-do",
      start: "top 90%",
      end: "top 30%",
      scrub: true,
    },
  });

  whatWeDotl
    .fromTo(
      ".padding-what-we-do",
      { autoAlpha: 0 },
      { autoAlpha: 1, ease: "none", duration: 0.5 }
    )
    .fromTo(
      ".home-nav",
      { y: "-100%" },
      {
        y: "0%",
        ease: "none",
        duration: 0.2,
      },
      1 // Start halfway through the fade-in
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
  const weDoTextContainers = document.querySelectorAll<HTMLElement>(
    ".we-do-text-container"
  );

  // Store scroll triggers for later cleanup
  const scrollTriggers: any[] = [];

  if (!weDoSection) return () => {};

  // Create a parent timeline with pinning
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: weDoSection,
      start: "top 0%", // Changed from 20% to 10% to make it freeze closer to the top
      end: "+=200%", // Pin for 300% of viewport height (adjust as needed)
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
        { width: "27px" },
        { width: "60px", ease: "power1.out", duration: 0.1 }
      )
      .fromTo(
        circle,
        { width: "0px", height: "0px" },
        { width: "15px", height: "15px", ease: "power1.out", duration: 0.1 },
        "<" // Start at the same time as the previous animation
      )
      // Hold for a bit (automatic due to timeline position)
      // Then animate out (except for the last item)
      .to(
        line,
        { width: "27px", ease: "power1.out", duration: 0.1 },
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
  initHeroAnimations(lenis, gsap);

  // Use GSAP matchMedia instead of manual screen size handling
  let mm = gsap.matchMedia();

  // Desktop (>= 768px) context
  mm.add("(min-width: 768px)", () => {
    // Initialize desktop view and get the cleanup function
    const cleanup = initWeDoItemsDesktop(gsap);

    // Return cleanup function for when this context is exited
    return cleanup;
  });

  // Mobile (< 768px) context
  mm.add("(max-width: 767px)", () => {
    // Initialize mobile view and get the cleanup function
    const cleanup = initWeDoItemsMobile(gsap);

    // Return cleanup function for when this context is exited
    return cleanup;
  });
};

export { initHome };
