import { gsap } from "gsap";

/**
 * Creates a curtain-lifting text reveal effect using GSAP
 * The overlay method is used to avoid layout disruption
 */
export class TextRevealCurtain {
  private container: HTMLElement;
  private overlay: HTMLElement;
  private textElement: HTMLElement;
  private timeline: gsap.core.Timeline | null = null;

  constructor(
    containerSelector: string,
    options: {
      overlayColor?: string;
      duration?: number;
      ease?: string;
      delay?: number;
    } = {}
  ) {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) {
      throw new Error(`Container not found: ${containerSelector}`);
    }

    this.container = container;
    this.textElement =
      container.querySelector("h1, h2, h3, h4, h5, h6, p, span") || container;

    // Create and setup the overlay
    this.overlay = this.createOverlay(options.overlayColor || "#ffffff");
    this.setupContainer();
  }

  private createOverlay(color: string): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "text-reveal-overlay";
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
    `;

    this.container.appendChild(overlay);
    return overlay;
  }

  private setupContainer(): void {
    // Ensure container has relative positioning
    const computedStyle = window.getComputedStyle(this.container);
    if (computedStyle.position === "static") {
      this.container.style.position = "relative";
    }

    // Ensure text has higher z-index than overlay initially
    this.textElement.style.position = "relative";
    this.textElement.style.zIndex = "1";
  }

  /**
   * Animate the curtain lifting to reveal the text
   */
  public reveal(
    options: {
      duration?: number;
      ease?: string;
      delay?: number;
      onComplete?: () => void;
    } = {}
  ): gsap.core.Timeline {
    const {
      duration = 1,
      ease = "power2.out",
      delay = 0,
      onComplete,
    } = options;

    // Kill existing timeline if running
    if (this.timeline) {
      this.timeline.kill();
    }

    this.timeline = gsap.timeline({
      onComplete: () => {
        // Remove overlay after animation completes to clean up DOM
        this.overlay.remove();
        onComplete?.();
      },
    });

    // Animate overlay moving up (curtain lifting)
    this.timeline.to(this.overlay, {
      y: "-100%",
      duration,
      ease,
      delay,
    });

    return this.timeline;
  }

  /**
   * Animate the curtain covering the text (reverse effect)
   */
  public hide(
    options: {
      duration?: number;
      ease?: string;
      delay?: number;
      onComplete?: () => void;
    } = {}
  ): gsap.core.Timeline {
    const {
      duration = 1,
      ease = "power2.out",
      delay = 0,
      onComplete,
    } = options;

    // Recreate overlay if it was removed
    if (!this.overlay.parentNode) {
      this.overlay = this.createOverlay("#ffffff");
      gsap.set(this.overlay, { y: "-100%" });
    }

    // Kill existing timeline if running
    if (this.timeline) {
      this.timeline.kill();
    }

    this.timeline = gsap.timeline({ onComplete });

    // Animate overlay moving down (curtain falling)
    this.timeline.to(this.overlay, {
      y: "0%",
      duration,
      ease,
      delay,
    });

    return this.timeline;
  }

  /**
   * Reset the effect to initial state
   */
  public reset(): void {
    if (this.timeline) {
      this.timeline.kill();
    }

    // Reset overlay position
    gsap.set(this.overlay, { y: "0%" });
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.timeline) {
      this.timeline.kill();
    }

    if (this.overlay.parentNode) {
      this.overlay.remove();
    }
  }
}

/**
 * Utility function for simple text reveals
 */
export const createTextReveal = (
  selector: string,
  options: {
    overlayColor?: string;
    duration?: number;
    ease?: string;
    delay?: number;
    trigger?: "immediate" | "scroll" | "hover";
    scrollTriggerOptions?: any;
  } = {}
) => {
  const {
    trigger = "immediate",
    scrollTriggerOptions = {},
    ...revealOptions
  } = options;

  const textReveal = new TextRevealCurtain(selector, revealOptions);

  switch (trigger) {
    case "immediate":
      textReveal.reveal(revealOptions);
      break;

    case "scroll":
      // Import ScrollTrigger if using scroll trigger
      import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
          trigger: selector,
          start: "top 80%",
          ...scrollTriggerOptions,
          onEnter: () => textReveal.reveal(revealOptions),
        });
      });
      break;

    case "hover":
      const container = document.querySelector(selector);
      if (container) {
        container.addEventListener("mouseenter", () => {
          textReveal.reveal(revealOptions);
        });

        container.addEventListener("mouseleave", () => {
          textReveal.hide(revealOptions);
        });
      }
      break;
  }

  return textReveal;
};

/**
 * Batch create multiple text reveals with staggered timing
 */
export const createStaggeredTextReveals = (
  selectors: string[],
  options: {
    overlayColor?: string;
    duration?: number;
    ease?: string;
    stagger?: number;
    trigger?: "immediate" | "scroll";
  } = {}
) => {
  const { stagger = 0.1, ...baseOptions } = options;

  return selectors.map((selector, index) => {
    return createTextReveal(selector, {
      ...baseOptions,
      delay: index * stagger,
    });
  });
};
