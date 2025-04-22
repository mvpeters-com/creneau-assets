gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
  "(min-width: 991px)": function () {
    const gridItems = document.querySelectorAll(".grid_item");

    gridItems.forEach((item, index) => {
      if ([0, 5].includes(index)) {
        const ctaBlock = item.querySelector(".cta_block");
        const gridLinkBlock = item.querySelector(".grid_link-block");

        if (ctaBlock || gridLinkBlock) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              ease: 0
            }
          });

          if (ctaBlock) {
            tl.to(ctaBlock, { marginTop: "auto" }, 0); // `0` = start at same time
          }
          if (gridLinkBlock) {
            tl.to(gridLinkBlock, { marginTop: "auto" }, 0);
          }
        } else {
          console.warn(`No targets found in .grid_item index ${index}`);
        }
      }
    });
  }
});