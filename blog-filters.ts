import {
  updateFilterUrl,
  getActiveFilter,
  addViewTransitionNames,
  applyWithViewTransition,
} from "./util";

function initBlogFilters() {
  // Constants
  const SELECTORS = {
    filterLink: "work-type-filter-link",
    filterLinkActive: "work-type-filter-link-active",
    blogItem: "work-list-item",
    disabled: "filter-disabled",
  } as const;

  // DOM element selections
  let filterLinks: HTMLElement[] = [];
  let blogItems: HTMLElement[] = [];

  // Function to initialize blog items with transition names
  function initializeBlogItems() {
    blogItems = Array.from(document.querySelectorAll(`.${SELECTORS.blogItem}`));

    // Add view transition names
    addViewTransitionNames(blogItems, "blog");
  }

  // Function to filter blog items
  function filterBlogItems(typeSlug: string) {
    // The function that will update the DOM
    const updateDOM = () => {
      blogItems.forEach((item) => {
        const matchesType =
          typeSlug === "all" || item.getAttribute("data-type") === typeSlug;

        if (matchesType) {
          item.classList.remove("item-hidden");
        } else {
          item.classList.add("item-hidden");
        }
      });
    };

    // Apply with view transition if supported
    applyWithViewTransition(updateDOM);
  }

  // Function to hide empty type filters
  function hideEmptyTypeFilters() {
    filterLinks.forEach((link) => {
      const typeSlug = link.getAttribute("data-slug") || "";
      const parentElement = link.parentElement;

      if (!parentElement) return;

      // "all" filter should always be visible if there are any items
      if (typeSlug === "all") {
        parentElement.style.display = blogItems.length > 0 ? "" : "none";
        return;
      }

      // Check if there are any items matching this type
      const hasItems = blogItems.some(
        (item) => item.getAttribute("data-type") === typeSlug
      );
      parentElement.style.display = hasItems ? "" : "none";
    });
  }

  // Initialize filter handling
  function init() {
    // Initialize blog items with transition names first
    initializeBlogItems();

    // Initialize DOM selections
    filterLinks = Array.from(
      document.querySelectorAll(`.${SELECTORS.filterLink}`)
    );

    // Hide type filters without any items
    hideEmptyTypeFilters();

    // Set initial active states and filter items
    const activeType = getActiveFilter();

    // First remove active class from all filter links
    filterLinks.forEach((link) =>
      link.classList.remove(SELECTORS.filterLinkActive)
    );

    // Then add active class to the correct filter
    filterLinks
      .filter((link) => link.getAttribute("data-slug") === activeType)
      .forEach((link) => link.classList.add(SELECTORS.filterLinkActive));

    filterBlogItems(activeType);

    // Type filter click handler
    filterLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const typeSlug = this.getAttribute("data-slug") || "all";

        // Update type filter state
        filterLinks.forEach((link) =>
          link.classList.remove(SELECTORS.filterLinkActive)
        );
        this.classList.add(SELECTORS.filterLinkActive);

        // Filter items
        filterBlogItems(typeSlug);
        updateFilterUrl({ filter: typeSlug });
      });
    });

    // Listen for popstate (browser back/forward)
    window.addEventListener("popstate", () => {
      const newActiveType = getActiveFilter();

      // Update type filter state
      filterLinks.forEach((link) =>
        link.classList.remove(SELECTORS.filterLinkActive)
      );
      filterLinks
        .filter((link) => link.getAttribute("data-slug") === newActiveType)
        .forEach((link) => link.classList.add(SELECTORS.filterLinkActive));

      filterBlogItems(newActiveType);
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}

// Make this file a module
export { initBlogFilters };
