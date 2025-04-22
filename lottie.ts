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
  // Hover animations for grid items
  grid: {
    urls: [
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc348799fe8b9d3cb895dc_hoverstate_lines.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc348701a2e88962279d6c_hoverstate_squares.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc3487215cdc512aa15ab3_hoverstate_triangles.json",
      "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc3487400dc102b11d1459_hoverstate_circles.json",
    ],
    indexNames: ["lines", "squares", "triangles", "circles"],
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

// Initialize all animations
async function initializeAllAnimations() {
  try {
    // Fetch all animation data in parallel
    await Promise.all([
      fetchAnimationData(animations.grid),
      fetchAnimationData(animations.autoplay),
      fetchAnimationData(animations.contact),
    ]);

    // Initialize different types of animations
    initializeGridAnimations();
    initializeAutoplayAnimations();
    initializeContactAnimations();
  } catch (error) {
    console.error("Error initializing animations:", error);
  }
}

// Start fetching and initializing animations
initializeAllAnimations();

// Check if the device is mobile (less than 787px)
const isMobile = () => {
  // Use matchMedia instead of innerWidth for better compatibility with emulators
  const mobileMediaQuery = window.matchMedia("(max-width: 786px)");
  return mobileMediaQuery.matches;
};

// Shared animation functions
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

// Function to initialize animations for grid hover items
function initializeGridAnimations() {
  if (animations.grid.data.length === 0) {
    console.warn("Grid animation data not loaded yet");
    return;
  }

  // Loop through grid items
  document.querySelectorAll(".grid-hover-item").forEach((item, index) => {
    const lottieContainer = item.querySelector(".hover-item-lottie");
    if (!lottieContainer) return;

    const max4index = index % animations.grid.data.length;

    // Create animation using the preloaded JSON data
    const anim = lottie.loadAnimation({
      container: lottieContainer,
      animationData: animations.grid.data[max4index],
      renderer: "svg",
      loop: false,
      autoplay: false,
    });

    // For desktop devices: use mouse events
    if (!isMobile()) {
      setupDesktopInteraction(item, anim);
    } else {
      // For mobile devices: use Intersection Observer
      setupMobileInteraction(item, anim);
    }

    // Re-initialize interactions on window resize
    window.addEventListener("resize", () => {
      // Remove existing event listeners
      item.removeEventListener("mouseenter", () => {});
      item.removeEventListener("mouseleave", () => {});

      // Setup appropriate interaction based on current screen size
      if (!isMobile()) {
        setupDesktopInteraction(item, anim);
      } else {
        setupMobileInteraction(item, anim);
      }
    });
  });
}

// Function to initialize auto-play animations
function initializeAutoplayAnimations() {
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

// Setup desktop interaction (mouseenter/mouseleave)
function setupDesktopInteraction(item: Element, anim: AnimationItem) {
  item.addEventListener("mouseenter", () => {
    playForward(anim, item);
  });

  item.addEventListener("mouseleave", () => {
    playReverse(anim, item);
  });
}

// Setup mobile interaction (Intersection Observer)
function setupMobileInteraction(item: Element, anim: AnimationItem) {
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
}

// Function to initialize animations for contact location items
function initializeContactAnimations() {
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

    console.log("backgroundColor", backgroundColor);
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
      setupDesktopInteraction(item, anim);
    } else {
      // For mobile devices: use Intersection Observer
      setupMobileInteraction(item, anim);
    }

    // Re-initialize interactions on window resize
    window.addEventListener("resize", () => {
      // Remove existing event listeners
      item.removeEventListener("mouseenter", () => {});
      item.removeEventListener("mouseleave", () => {});

      // Setup appropriate interaction based on current screen size
      if (!isMobile()) {
        setupDesktopInteraction(item, anim);
      } else {
        setupMobileInteraction(item, anim);
      }
    });
  });
}
