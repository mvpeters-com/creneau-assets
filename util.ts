// Utility functions for filters

/**
 * Updates URL with filter parameters
 */
export function updateFilterUrl(
  params: { filter?: string; services?: string[] } = {}
): void {
  const url = new URL(window.location.href);

  if (params.filter) {
    url.searchParams.set("filter", params.filter);
  }

  if (params.services && params.services.length > 0) {
    url.searchParams.set("services", params.services.join(","));
  } else if (params.services) {
    url.searchParams.delete("services");
  }

  window.history.pushState({}, "", url.toString());
}

/**
 * Gets active filter from URL
 */
export function getActiveFilter(): string {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("filter") || "all";
}

/**
 * Gets active services from URL
 */
export function getActiveServices(): string[] {
  const urlParams = new URLSearchParams(window.location.search);
  const services = urlParams.get("services");
  return services ? services.split(",") : [];
}

/**
 * Adds view transition name to elements
 */
export function addViewTransitionNames(
  elements: HTMLElement[],
  prefix: string
): void {
  if ("startViewTransition" in document) {
    elements.forEach((element, index) => {
      element.style.viewTransitionName = `${prefix}-item-${index}`;
    });
  }
}

/**
 * Applies filtering with view transitions if supported
 */
export function applyWithViewTransition(updateDomCallback: () => void): void {
  if ("startViewTransition" in document) {
    // @ts-ignore - TypeScript might not know about this API
    document.startViewTransition(updateDomCallback);
  } else {
    // Fallback for browsers without support
    updateDomCallback();
  }
}
