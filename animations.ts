import lottie, { AnimationItem } from "lottie-web";

// Animation configuration types
interface AnimationConfig {
  urls: string[];
  indexNames?: string[];
  data: any[];
}

// Animation configurations
const animations = {
  contact: {
    urls: [
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e41b607149a716341289a4_hasselt.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e41b6050d8c10ff731504a_eindhoven.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e41b60f127bc68e2457845_dubai.json",
    ],
    indexNames: ["hasselt", "eindhoven", "dubai"],
    data: [],
  },
  // Auto-play animations
  autoplay: {
    urls: [
      // Add your auto-play animation URLs here
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e4227a331581bc3e2bfbcc_triangle_small.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e422795125c345407057aa_bol_small.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e422790fc4bbe9b03b1da2_square_small.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67e4227a331581bc3e2bfbc4_lines_small.json",
    ],
    indexNames: ["triangle", "circle", "square", "lines"],
    data: [],
  },
};

// Generic function to fetch animation data
async function fetchAnimationData(config: AnimationConfig): Promise<void> {
  const results = await Promise.all(
    config.urls.map((url) =>
      fetch(url)
        .then((response) => response.json())
        .catch((error) => {
          console.error(`Error fetching animation from ${url}:`, error);
          return null;
        })
    )
  );

  config.data = results.filter((data) => data !== null);
  return Promise.resolve();
}

// Check if the device is mobile (less than 787px)
const isMobile = () => {
  // Use matchMedia instead of innerWidth for better compatibility with emulators
  const mobileMediaQuery = window.matchMedia("(max-width: 786px)");
  return mobileMediaQuery.matches;
};

// Shared hover functions for image/video elements
const showHoverElement = (element: Element) => {
  // Find hover image or video
  const hoverImage = element.querySelector(
    ".grid_link_hover_image"
  ) as HTMLImageElement;
  const hoverVideo = element.querySelector(
    ".grid_link_hover_video"
  ) as HTMLVideoElement;

  if (
    hoverImage &&
    hoverImage.src &&
    hoverImage.src.trim() !== "" &&
    !hoverImage.src.trim().endsWith("/")
  ) {
    hoverImage.style.opacity = "1";
  }

  if (
    hoverVideo &&
    hoverVideo.src &&
    hoverVideo.src.trim() !== "" &&
    !hoverVideo.src.trim().endsWith("/")
  ) {
    hoverVideo.style.opacity = "1";
    hoverVideo.play().catch(console.error);
  }
};

const hideHoverElement = (element: Element) => {
  // Find hover image or video
  const hoverImage = element.querySelector(
    ".grid_link_hover_image"
  ) as HTMLImageElement;
  const hoverVideo = element.querySelector(
    ".grid_link_hover_video"
  ) as HTMLVideoElement;

  if (
    hoverImage &&
    hoverImage.src &&
    hoverImage.src.trim() !== "" &&
    !hoverImage.src.trim().endsWith("/")
  ) {
    hoverImage.style.opacity = "0";
  }

  if (
    hoverVideo &&
    hoverVideo.src &&
    hoverVideo.src.trim() !== "" &&
    !hoverVideo.src.trim().endsWith("/")
  ) {
    hoverVideo.style.opacity = "0";
    hoverVideo.pause();
    hoverVideo.currentTime = 0;
  }
};

// Store references to event listeners
const eventListeners = new WeakMap<
  Element,
  {
    mouseEnter: (e: Event) => void;
    mouseLeave: (e: Event) => void;
  }
>();

// Function to initialize hover effects for grid items
export function initializeGridAnimations() {
  // Loop through grid items
  document.querySelectorAll(".grid-hover-item").forEach((item) => {
    const hoverImage = item.querySelector(
      ".grid_link_hover_image"
    ) as HTMLImageElement;
    const hoverVideo = item.querySelector(
      ".grid_link_hover_video"
    ) as HTMLVideoElement;

    // Only proceed if there's at least one hover element with a valid (non-empty) src
    const hasHoverImage =
      hoverImage &&
      hoverImage.src &&
      hoverImage.src.trim() !== "" &&
      !hoverImage.src.trim().endsWith("/");
    const hasHoverVideo =
      hoverVideo &&
      hoverVideo.src &&
      hoverVideo.src.trim() !== "" &&
      !hoverVideo.src.trim().endsWith("/");

    if (!hasHoverImage && !hasHoverVideo) return;

    // Initialize opacity to 0
    if (hoverImage) {
      hoverImage.style.opacity = "0";
      hoverImage.style.transition = "opacity 0.15s ease-out";
    }

    if (hoverVideo) {
      hoverVideo.style.opacity = "0";
      hoverVideo.style.transition = "opacity 0.15s ease-out";
      hoverVideo.muted = true; // Ensure videos are muted for autoplay
      hoverVideo.loop = true;
    }

    // For desktop devices: use mouse events
    if (!isMobile()) {
      setupDesktopHoverInteraction(item);
    } else {
      // For mobile devices: use Intersection Observer
      setupMobileHoverInteraction(item);
    }

    // Re-initialize interactions on window resize
    window.addEventListener("resize", () => {
      // Remove existing event listeners
      cleanupInteraction(item);

      // Setup appropriate interaction based on current screen size
      if (!isMobile()) {
        setupDesktopHoverInteraction(item);
      } else {
        setupMobileHoverInteraction(item);
      }
    });
  });
}

// Function to initialize auto-play animations
export async function initializeAutoplayAnimations() {
  await fetchAnimationData(animations.autoplay);

  if (animations.autoplay.data.length === 0) {
    console.warn("Autoplay animation data not loaded yet");
    return;
  }

  // Find all elements with data-lottie attribute
  document.querySelectorAll("[data-lottie]").forEach((element, index) => {
    const animationName = element.getAttribute("data-lottie");
    if (!animationName) return;

    // Determine which animation to use (either by name or index)
    let animationIndex = 0;

    if (animations.autoplay.indexNames) {
      // Find by name first
      animationIndex = animations.autoplay.indexNames.indexOf(animationName);

      // If not found by name, try using it as a numeric index
      if (animationIndex === -1 && !isNaN(Number(animationName))) {
        animationIndex =
          Number(animationName) % animations.autoplay.data.length;
      } else if (animationIndex === -1) {
        // Default to first animation if name not found
        console.warn(
          `Animation name "${animationName}" not found, using default`
        );
        animationIndex = 0;
      }
    }

    // Create animation with loop set to false
    const anim = lottie.loadAnimation({
      container: element,
      animationData: animations.autoplay.data[animationIndex],
      renderer: "svg",
      loop: false, // Don't use internal looping
      autoplay: true, // Start playing immediately
    });

    // Current direction state
    let isForward = true;

    // Add complete listener to reverse and restart
    anim.addEventListener("complete", () => {
      // Toggle direction
      isForward = !isForward;
      anim.setDirection(isForward ? 1 : -1);

      setTimeout(() => {
        // Restart animation
        anim.play();
      }, 500);
    });
  });
}

// Function to clean up existing interaction listeners
function cleanupInteraction(item: Element) {
  const listeners = eventListeners.get(item);

  if (listeners) {
    item.removeEventListener("mouseenter", listeners.mouseEnter);
    item.removeEventListener("mouseleave", listeners.mouseLeave);

    // Also disconnect the IntersectionObserver if it exists
    const observer = (item as any)._intersectionObserver;
    if (observer) {
      observer.disconnect();
      delete (item as any)._intersectionObserver;
    }
  }
}

// Setup desktop interaction (mouseenter/mouseleave)
function setupDesktopHoverInteraction(item: Element) {
  // Create named handler functions
  const mouseEnterHandler = (e: Event) => {
    showHoverElement(item);
  };

  const mouseLeaveHandler = (e: Event) => {
    hideHoverElement(item);
  };

  // Store references to the handlers
  eventListeners.set(item, {
    mouseEnter: mouseEnterHandler,
    mouseLeave: mouseLeaveHandler,
  });

  // Add listeners using the stored references
  item.addEventListener("mouseenter", mouseEnterHandler);
  item.addEventListener("mouseleave", mouseLeaveHandler);
}

// Setup mobile interaction (Intersection Observer)
function setupMobileHoverInteraction(item: Element) {
  // Clean up any existing observer
  if ((item as any)._intersectionObserver) {
    (item as any)._intersectionObserver.disconnect();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const ratio = entry.intersectionRatio;

      console.log(ratio);

      // Element is entering viewport (passed 1/3 of the screen)
      if (entry.isIntersecting && ratio >= 0.8) {
        showHoverElement(item);
      } else {
        hideHoverElement(item);
      }
    },
    {
      rootMargin: "-15% 0px -15% 0px",
      // Use thresholds to track multiple intersection points
      threshold: [0.5, 1],
    }
  );

  observer.observe(item);

  (item as any)._intersectionObserver = observer;
}

const playForward = (anim: AnimationItem, element: Element) => {
  const currentFrame = anim.currentFrame;
  anim.setDirection(1);
  anim.goToAndPlay(currentFrame, true);
  element.classList.add("grid-hover-item-zoom");
};

const playReverse = (anim: AnimationItem, element: Element) => {
  const currentFrame = anim.currentFrame;
  anim.setDirection(-1);
  anim.goToAndPlay(currentFrame, true);
  element.classList.remove("grid-hover-item-zoom");
};

// Setup desktop interaction for contact animations (mouseenter/mouseleave)
function setupDesktopContactInteraction(item: Element, anim: AnimationItem) {
  // Create named handler functions
  const mouseEnterHandler = (e: Event) => {
    playForward(anim, item);
  };

  const mouseLeaveHandler = (e: Event) => {
    playReverse(anim, item);
  };

  // Store references to the handlers
  eventListeners.set(item, {
    mouseEnter: mouseEnterHandler,
    mouseLeave: mouseLeaveHandler,
  });

  // Add listeners using the stored references
  item.addEventListener("mouseenter", mouseEnterHandler);
  item.addEventListener("mouseleave", mouseLeaveHandler);
}

// Setup mobile interaction for contact animations (Intersection Observer)
function setupMobileContactInteraction(item: Element, anim: AnimationItem) {
  // Clean up any existing observer
  if ((item as any)._intersectionObserver) {
    (item as any)._intersectionObserver.disconnect();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const ratio = entry.intersectionRatio;

      // Element is entering viewport (passed 1/3 of the screen)
      if (entry.isIntersecting && ratio === 1) {
        playForward(anim, item);
      }

      // Element is exiting viewport (passed 2/3 of the screen)
      if (ratio < 1) {
        playReverse(anim, item);
      }
    },
    {
      rootMargin: "-15% 0px -15% 0px",
      // Use thresholds to track multiple intersection points
      threshold: [0.5, 1],
    }
  );

  observer.observe(item);

  // Store reference to the observer for cleanup
  (item as any)._intersectionObserver = observer;
}

export async function initializeContactAnimations() {
  await fetchAnimationData(animations.contact);

  if (animations.contact.data.length === 0) {
    console.warn("Contact animation data not loaded yet");
    return;
  }

  // Loop through contact location items
  document.querySelectorAll(".contact-location-item").forEach((item, index) => {
    const contactLottie = item.querySelector(".contact-lottie");
    if (!contactLottie) return;

    const lottieContainer = item.querySelector(".contact-lottie-container");

    if (!lottieContainer) return;

    // Get animation name from the attribute if specified
    const animationName = item.getAttribute("contact-lottie");
    const backgroundColor = item.getAttribute("contact-bg");

    lottieContainer.setAttribute(
      "style",
      `background-color: ${backgroundColor}`
    );

    let animationIndex = index % animations.contact.data.length; // Default to cycling through

    // If a specific animation name is provided, use it
    if (animationName && animations.contact.indexNames) {
      const nameIndex = animations.contact.indexNames.indexOf(animationName);
      if (nameIndex !== -1) {
        animationIndex = nameIndex;
      }
    }

    // Create animation using the preloaded JSON data
    const anim = lottie.loadAnimation({
      container: contactLottie,
      animationData: animations.contact.data[animationIndex],
      renderer: "svg",
      loop: false,
      autoplay: false,
    });

    // For desktop devices: use mouse events
    if (!isMobile()) {
      setupDesktopContactInteraction(item, anim);
    } else {
      // For mobile devices: use Intersection Observer
      setupMobileContactInteraction(item, anim);
    }

    // Re-initialize interactions on window resize
    window.addEventListener("resize", () => {
      // Remove existing event listeners
      cleanupInteraction(item);

      // Setup appropriate interaction based on current screen size
      if (!isMobile()) {
        setupDesktopContactInteraction(item, anim);
      } else {
        setupMobileContactInteraction(item, anim);
      }
    });
  });
}

// Initialize CTA animations using GSAP
export function initializeCtaAnimations(gsap: GSAP) {
  // Find all CTA blocks
  document.querySelectorAll(".cta_block").forEach((block) => {
    // Mouse enter handler
    block.addEventListener("mouseenter", (e) => {
      const mouseEvent = e as MouseEvent;
      const rect = block.getBoundingClientRect();

      // Calculate relative position (0-1)
      const relX = (mouseEvent.clientX - rect.left) / rect.width;
      const relY = (mouseEvent.clientY - rect.top) / rect.height;

      // Determine start position based on entry point
      let startX, startY;

      // Coming from left/right edge
      if (relX < 0.1) startX = "-100%";
      else if (relX > 0.5) startX = "100%";
      else startX = "0%";

      // Coming from top/bottom edge
      if (relY < 0.1) startY = "-100%";
      else if (relY > 0.5) startY = "100%";
      else startY = "0%";

      const backgroundFill = block.querySelector(".cta_background-fill");

      if (backgroundFill) {
        gsap.fromTo(
          backgroundFill,
          {
            scale: 0,
            x: startX,
            y: startY,
          },
          {
            scale: 1,
            x: "0%",
            y: "0%",
            duration: 0.35,
            ease: "cta-in",
          }
        );
      }

      gsap.to(block, {
        color: "#efefef",
      });
    });

    // Mouse leave handler
    block.addEventListener("mouseleave", (e) => {
      const mouseEvent = e as MouseEvent;
      const rect = block.getBoundingClientRect();

      // Calculate relative position (0-1)
      const relX = (mouseEvent.clientX - rect.left) / rect.width;
      const relY = (mouseEvent.clientY - rect.top) / rect.height;

      // Determine end position based on exit point
      let endX, endY;

      // Leaving toward left/right edge
      if (relX < 0) endX = "-100%";
      else if (relX > 1) endX = "100%";
      else endX = relX < 0.5 ? "-100%" : "100%";

      // Leaving toward top/bottom edge
      if (relY < 0) endY = "-100%";
      else if (relY > 1) endY = "100%";
      else endY = relY < 0.5 ? "-100%" : "100%";

      const backgroundFill = block.querySelector(".cta_background-fill");

      if (backgroundFill) {
        gsap.to(backgroundFill, {
          x: endX,
          y: endY,
          scale: 0,
          duration: 0.35,
          ease: "cta-out",
        });
      }

      gsap.to(block, {
        color: "#be2721",
      });
    });
  });
}
