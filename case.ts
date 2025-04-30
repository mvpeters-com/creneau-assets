import Swiper from "swiper";
import BeerSlider from "beerslider";
import { create } from "@lottiefiles/lottie-interactivity";

// GSAP animations
const setupGSAPAnimations = (gsap: GSAP) => {
  gsap.matchMedia({
    "(min-width: 991px)": function () {
      // Image left text
      document
        .querySelectorAll(".case-study_image_image-left-text")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#txt_image-left-text"),
            { marginBottom: "50%" },
            { marginBottom: "0" }
          );
        });

      // All vertical text
      document
        .querySelectorAll(".case-study_images_all-vertical-text")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#img2_all-vertical-text"),
            { y: "12rem" },
            { y: "0rem" }
          );
        });

      // All vertical
      document
        .querySelectorAll(".case-study_images_all-vertical")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });

          tl.fromTo(
            element.querySelector("#img2_all-vertical"),
            { y: "15rem" },
            { y: "0rem" }
          );
        });

      // Horizontal right low
      document
        .querySelectorAll(".case-study_images_horizontal-right-low")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#img2_horizontal-right-low"),
            { marginBottom: "50%" },
            { marginBottom: "0" }
          );
        });

      // Centered big text
      document
        .querySelectorAll(".case-study_image_centered-big-text")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#txt_centered-big-text"),
            { marginBottom: "50%" },
            { marginBottom: "0" }
          );
        });

      // Horizontal right text
      document
        .querySelectorAll(".case-study_images_horizontal-right-text")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#img1_horizontal-right-text"),
            { marginBottom: "50%" },
            { marginBottom: "0" }
          );
        });

      // Image right text
      document
        .querySelectorAll(".case-study_image_image-right-text")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#txt_image-right-text"),
            { marginBottom: "50%" },
            { marginBottom: "0" }
          );
        });

      // Horizontal left
      document
        .querySelectorAll(".case-study_images_horizontal-left")
        .forEach((element) => {
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          tl.fromTo(
            element.querySelector("#img1_horizontal-left"),
            { marginBottom: "50%" },
            { marginBottom: "0" }
          );
        });
    },
  });
};

// Setup Lottie animations
const setupLottieAnimations = () => {
  for (let i = 1; i <= 5; i++) {
    let lottie = document.getElementById(`lottie${i}`);

    if (!lottie) continue;

    create({
      player: `#lottie${i}`,
      mode: "scroll",
      container: `#lottie-sticky-containerclass${i}`,
      actions: [
        {
          visibility: [0, 1.0],
          type: "seek",
          frames: [0, 150], // Lottie moet +- 90-100 frames zijn
        },
      ],
    });
  }
};

// Tricks counter functionality
const setupTricksCounter = () => {
  const tricksCountElement = document.getElementById("trickscount");
  if (!tricksCountElement) return;

  const tricksnum = tricksCountElement.textContent || "0";
  let tricksleft = +tricksnum;
  const tricksleft2 = +tricksnum;
  let tricksRefresh: number;
  let tricksTimer: number;
  const tricksTime = tricksleft * 1000;

  // Find the next case study
  const currentItem = document.querySelector(
    ".case-study_footer_collection-item .w--current"
  );
  if (!currentItem) return;

  const parent = currentItem.parentElement;
  if (!parent) return;

  const tricksNext = parent.nextElementSibling;
  let tricksNewLink = "";

  if (tricksNext) {
    tricksNext.classList.add("trickscurrent");
  } else {
    const firstItem = document.querySelector(
      ".case-study_footer_collection-item"
    );
    if (firstItem) firstItem.classList.add("trickscurrent");
  }

  // Remove siblings
  const tricksCurrent = document.querySelector(".trickscurrent");
  if (tricksCurrent) {
    const siblings = tricksCurrent.parentElement?.children || [];
    Array.from(siblings).forEach((sibling) => {
      if (!sibling.classList.contains("trickscurrent")) {
        sibling.remove();
      }
    });

    const linkElement = tricksCurrent.querySelector("a");
    if (linkElement) tricksNewLink = linkElement.getAttribute("href") || "";
  }

  function tricksCount() {
    tricksTimer = window.setInterval(function () {
      tricksleft--;
      if (tricksCountElement) {
        tricksCountElement.textContent = tricksleft.toString();
      }
      if (tricksleft <= 0) {
        clearInterval(tricksTimer);
      }
    }, 1000);
  }

  function tricksPage() {
    // Go to next page after x seconds
    tricksRefresh = window.setTimeout(function () {
      if (tricksNewLink) {
        window.location.href = tricksNewLink;
      }
    }, tricksTime);
  }

  function stopTricksCount() {
    clearTimeout(tricksTimer);
  }

  function stopTricksPage() {
    clearTimeout(tricksRefresh);
  }

  // Use IntersectionObserver instead of inview
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        tricksleft = tricksleft2;
        if (tricksCountElement) {
          tricksCountElement.textContent = tricksleft.toString();
        }
        tricksCount();
        tricksPage();
      } else {
        stopTricksCount();
        stopTricksPage();
        if (tricksCountElement) {
          tricksCountElement.textContent = tricksleft2.toString();
        }
      }
    });
  });

  const tricksnext = document.getElementById("tricksnext");
  if (tricksnext) {
    observer.observe(tricksnext);
  }
};

// Set margin for hero content
const setupHeroMargin = () => {
  const setMargin = () => {
    document
      .querySelectorAll(".case-study_hero_content-wrapper")
      .forEach((element) => {
        const height = element.clientHeight;
        const marginTop = (height / 2) * -1;
        (element as HTMLElement).style.marginTop = `${marginTop}px`;
      });
  };

  setMargin();
  window.addEventListener("resize", setMargin);
};

// Setup Swiper
const setupSwiper = () => {
  const caseSlider = document.getElementById("case-slider");
  if (!caseSlider) return;

  new Swiper("#case-slider", {
    slidesPerView: 2,
    slidesPerGroup: 1,
    grabCursor: true,
    spaceBetween: 3,
    navigation: {
      nextEl: "#right-button",
      prevEl: "#left-button",
    },
    breakpoints: {
      0: {
        slidesPerView: 1.2,
        slidesPerGroup: 1,
        spaceBetween: 3,
      },
      480: {
        slidesPerView: 1.5,
        slidesPerGroup: 1,
        spaceBetween: 3,
      },
      767: {
        slidesPerView: 2.5,
        slidesPerGroup: 1,
        spaceBetween: 3,
      },
      992: {
        slidesPerView: 2.5,
        slidesPerGroup: 1,
        spaceBetween: 3,
      },
    },
  });
};

// Setup BeerSlider
const setupBeerSlider = () => {
  const imageWrappers = document.getElementsByClassName("image-wrapper");

  for (const imageWrapper of Array.from(imageWrappers)) {
    const images = imageWrapper.querySelectorAll("img");
    if (images.length < 2) continue;

    const firstImage = images[0].src;
    const secondImage = images[1].src;

    const template = `
      <div class="beer-slider">
        <img src="${firstImage}">
        <div class="beer-reveal">
          <img src="${secondImage}">
        </div>
      </div>
    `;

    images[1].remove();
    images[0].remove();

    imageWrapper.insertAdjacentHTML("afterbegin", template);
  }

  const beerSliders = document.getElementsByClassName("beer-slider");

  for (const beerSlider of Array.from(beerSliders)) {
    new BeerSlider(beerSlider as HTMLElement, {
      start: (beerSlider as any).dataset?.start,
    });
  }
};

const initCase = (gsap: GSAP) => {
  setupGSAPAnimations(gsap);

  // Ensure DOM is fully loaded before initializing Lottie animations
  if (document.readyState === "loading") {
    console.log("DOM is loading, setting up Lottie animations");
    document.addEventListener("DOMContentLoaded", setupLottieAnimations);
  } else {
    console.log(
      document.readyState,
      "DOM is loaded, setting up Lottie animations"
    );
    setupLottieAnimations();
  }

  setupTricksCounter();
  setupHeroMargin();
  setupSwiper();
  setupBeerSlider();
};

export { initCase };
