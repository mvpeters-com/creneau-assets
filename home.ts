import type Lenis from "lenis";
import type { gsap as GSAP } from "gsap";
import lottie, { AnimationItem } from "lottie-web";

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

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero_home_section",
      start: "top top",
      end: "+=100%", // how many % of viewport height to scroll through
      scrub: 0.5,
      pin: true,
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
    .call(
      () => {
        heroLottie?.play();
      },
      [],
      0.5
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

  // Fade in the Work We Do section on scroll
  gsap.fromTo(
    ".padding-what-we-do",
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".padding-what-we-do",
        start: "top 90%",
        end: "top 40%",
        scrub: true,
      },
    }
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

  weDoItems.forEach((item, index) => {
    const line = item.querySelector<HTMLElement>(".we-do-line");
    const img = item.querySelector<HTMLElement>(".we-do-image");
    const text = item.querySelector<HTMLElement>(".we-do-text");
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
    window.addEventListener("resize", () => {
      clearTimeout(interval);

      interval = setTimeout(() => {
        checkImagePosition();
      }, 50);
    });

    // Initial check
    checkImagePosition();

    setTimeout(() => {
      checkImagePosition();
    }, 100);

    // Use shared animation function for hover effects
    item.addEventListener("mouseenter", () => {
      animateWeDoElements(gsap, line, circle, img, true);
    });

    item.addEventListener("mouseleave", () => {
      animateWeDoElements(gsap, line, circle, img, false);
    });
  });
};

// Function to handle we-do items for mobile
const initWeDoItemsMobile = (gsap: GSAP) => {
  const weDoItems = document.querySelectorAll<HTMLElement>(".we-do-item");
  const weDoSection = document.querySelector<HTMLElement>(
    ".what-we-do-container"
  );

  if (!weDoSection) return;

  // Create a parent timeline with pinning
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: weDoSection,
      start: "top 20%", // Start a bit after the section enters viewport
      end: "+=300%", // Pin for 300% of viewport height (adjust as needed)
      pin: true,
      scrub: 1, // Smooth scrubbing
      // markers: true, // Uncomment for debugging
    },
  });

  // Create individual animations for each item
  weDoItems.forEach((item, index) => {
    const line = item.querySelector<HTMLElement>(".we-do-line");
    const circle = item.querySelector<HTMLElement>(".we-do-circle");

    // Calculate the progress point for this item (spread evenly across scroll)
    const itemStartProgress = index / weDoItems.length;
    const itemEndProgress = (index + 0.8) / weDoItems.length; // Overlap slightly with next item

    // Create nested timeline for this item
    const itemTl = gsap.timeline();

    // Add animations to the item timeline
    itemTl
      .fromTo(
        line,
        { width: "27px" },
        { width: "60px", ease: "power1.out", duration: 1 }
      )
      .fromTo(
        circle,
        { width: "0px", height: "0px" },
        { width: "15px", height: "15px", ease: "power1.out", duration: 1 },
        "<" // Start at the same time as the previous animation
      );

    // Add this timeline to the main timeline at the calculated progress point
    mainTl.add(itemTl, itemStartProgress);

    // Add a reset to the main timeline for previous items when next one activates
    // (Only add reset if it's not the last item)
    if (index < weDoItems.length - 1) {
      const resetTl = gsap.timeline();
      resetTl
        .to(line, { width: "27px", ease: "power1.out", duration: 0.5 })
        .to(
          circle,
          { width: "0px", height: "0px", ease: "power1.out", duration: 0.5 },
          "<"
        );

      // Add the reset timeline slightly after the next item starts
      mainTl.add(resetTl, itemEndProgress + 0.05);
    }
  });
};

// Main initialization function
const initHome = (lenis: Lenis, gsap: GSAP) => {
  // Initialize hero animations
  initHeroAnimations(lenis, gsap);

  // Initialize we-do items based on screen size
  const handleScreenSizeChange = () => {
    if (window.innerWidth >= 768) {
      // Desktop version
      initWeDoItemsDesktop(gsap);
    } else {
      // Mobile version
      initWeDoItemsMobile(gsap);
    }
  };

  // Run initially
  handleScreenSizeChange();

  // Re-run on window resize
  window.addEventListener("resize", () => {
    // Debounce resize handling
    let resizeTimeout: number | undefined;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleScreenSizeChange, 100);
  });
};

export { initHome };
