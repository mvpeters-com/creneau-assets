import type Lenis from "lenis";
import type { gsap as GSAP } from "gsap";
import lottie, { AnimationItem } from "lottie-web";

const lottieUrl =
  "https://cdn.prod.website-files.com/6786410629851043533e222c/67dc16c4926a696f3b9a0941_hover-card-circles.json";

const initHome = (lenis: Lenis, gsap: GSAP) => {
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
      trigger: ".hero_section",
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

  // Hover effects for Work We Do items
  const weDoItems = document.querySelectorAll<HTMLElement>(".we-do-item");

  weDoItems.forEach((item) => {
    const line = item.querySelector<HTMLElement>(".we-do-line");
    const img = item.querySelector<HTMLElement>(".we-do-image");
    const circle = item.querySelector<HTMLElement>(".we-do-circle");

    item.addEventListener("mouseenter", () => {
      gsap.to(line, { width: "60px", duration: 0.3, ease: "power1.out" });
      gsap.to(img, { autoAlpha: 1, duration: 0.3, ease: "power1.out" });
      gsap.to(circle, {
        width: "15px",
        height: "15px",
        duration: 0.3,
        ease: "power1.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(line, { width: "27px", duration: 0.3, ease: "power1.out" });
      gsap.to(img, { autoAlpha: 0, duration: 0.3, ease: "power1.out" });
      gsap.to(circle, {
        width: "0px",
        height: "0px",
        duration: 0.3,
        ease: "power1.out",
      });
    });
  });
};

export { initHome };
