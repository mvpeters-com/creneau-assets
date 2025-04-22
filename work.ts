import {
  updateFilterUrl,
  getActiveFilter,
  getActiveServices,
  addViewTransitionNames,
  applyWithViewTransition,
} from "./util";

function initWorkFilters() {
  // Constants
  const SELECTORS = {
    filterLink: "work-type-filter-link",
    filterLinkActive: "work-type-filter-link-active",
    workItem: "work-list-item",
    workItemService: "work-list-item-service",
    serviceButton: "work-service-filter-button",
    serviceButtonActive: "work-service-filter-button-active",
    disabled: "filter-disabled",
  } as const;

  // DOM element selections
  let filterLinks: HTMLElement[] = [];
  let serviceButtons: HTMLElement[] = [];
  let workItems: HTMLElement[] = [];

  // Function to initialize work items with service data
  function initializeWorkItemServices() {
    workItems = Array.from(document.querySelectorAll(`.${SELECTORS.workItem}`));

    workItems.forEach((item, index) => {
      const serviceElements = item.querySelectorAll(
        `.${SELECTORS.workItemService}`
      );

      const services: string[] = [];

      serviceElements.forEach((serviceEl) => {
        const slug = serviceEl.getAttribute("data-slug");
        if (slug) services.push(slug);
      });

      item.setAttribute("data-services", services.join(","));
    });

    // Add view transition names
    addViewTransitionNames(workItems, "work");
  }

  // Function to hide service filters that have no items for current type
  function hideIrrelevantServiceFilters(currentTypeSlug: string) {
    const visibleItems =
      currentTypeSlug === "all"
        ? workItems
        : workItems.filter(
            (item) => item.getAttribute("data-type") === currentTypeSlug
          );

    // Get all services from items matching current type
    const availableServices = new Set<string>();
    visibleItems.forEach((item) => {
      const services = item.getAttribute("data-services")?.split(",") || [];
      services.forEach((service) => availableServices.add(service));
    });

    // Hide service buttons that have no items in current type
    serviceButtons.forEach((button) => {
      const buttonSlug = button.getAttribute("data-slug") || "";
      const parentElement = button.parentElement;
      if (parentElement) {
        parentElement.style.display = availableServices.has(buttonSlug)
          ? ""
          : "none";
      }
    });
  }

  // Function to update available service filters based on active services
  function updateAvailableServiceFilters(
    currentTypeSlug: string,
    activeServicesSlugs: string[]
  ) {
    const visibleItems =
      currentTypeSlug === "all"
        ? workItems
        : workItems.filter(
            (item) => item.getAttribute("data-type") === currentTypeSlug
          );

    const visibleButtons = serviceButtons.filter((button) => {
      const parentElement = button.parentElement;
      return (
        parentElement &&
        window.getComputedStyle(parentElement).display !== "none"
      );
    });

    visibleButtons.forEach((button) => {
      const buttonSlug = button.getAttribute("data-slug") || "";

      // If button is already active, keep it enabled
      if (activeServicesSlugs.includes(buttonSlug)) {
        button.classList.remove(SELECTORS.disabled);
        return;
      }

      // Check if adding this service would yield any results
      const wouldHaveResults = visibleItems.some((item) => {
        const itemServices =
          item.getAttribute("data-services")?.split(",") || [];

        return (
          itemServices.includes(buttonSlug) &&
          activeServicesSlugs.every((activeService) =>
            itemServices.includes(activeService)
          )
        );
      });

      // Add/remove disabled class based on whether it would yield results
      if (wouldHaveResults) {
        button.classList.remove(SELECTORS.disabled);
      } else {
        button.classList.add(SELECTORS.disabled);
      }
    });
  }

  // Function to filter work items
  function filterWorkItems(typeSlug: string, servicesSlugs: string[]) {
    // The function that will update the DOM
    const updateDOM = () => {
      workItems.forEach((item) => {
        const matchesType =
          typeSlug === "all" || item.getAttribute("data-type") === typeSlug;
        const itemServices =
          item.getAttribute("data-services")?.split(",") || [];
        const matchesServices =
          servicesSlugs.length === 0 ||
          servicesSlugs.every((service) => itemServices.includes(service));

        if (matchesType && matchesServices) {
          item.classList.remove("item-hidden");
        } else {
          item.classList.add("item-hidden");
        }
      });

      // First hide irrelevant services for the type
      hideIrrelevantServiceFilters(typeSlug);
      // Then disable services that wouldn't yield results
      updateAvailableServiceFilters(typeSlug, servicesSlugs);
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
        parentElement.style.display = workItems.length > 0 ? "" : "none";
        return;
      }

      // Check if there are any items matching this type
      const hasItems = workItems.some(
        (item) => item.getAttribute("data-type") === typeSlug
      );
      parentElement.style.display = hasItems ? "" : "none";
    });
  }

  // Initialize filter handling
  function init() {
    // Initialize services data attributes first
    initializeWorkItemServices();

    // Initialize DOM selections
    filterLinks = Array.from(
      document.querySelectorAll(`.${SELECTORS.filterLink}`)
    );
    serviceButtons = Array.from(
      document.querySelectorAll(`.${SELECTORS.serviceButton}`)
    );

    // Hide type filters without any items
    hideEmptyTypeFilters();

    // Set initial active states and filter items
    const activeType = getActiveFilter();
    const activeServices = getActiveServices();

    // First remove active class from all filter links
    filterLinks.forEach((link) =>
      link.classList.remove(SELECTORS.filterLinkActive)
    );

    // Then add active class to the correct filter
    filterLinks
      .filter((link) => link.getAttribute("data-slug") === activeType)
      .forEach((link) => link.classList.add(SELECTORS.filterLinkActive));

    filterWorkItems(activeType, activeServices);

    // Set initial service buttons state
    serviceButtons.forEach((button) => {
      const buttonSlug = button.getAttribute("data-slug") || "";
      if (activeServices.includes(buttonSlug)) {
        button.classList.add(SELECTORS.serviceButtonActive);
      }
    });

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

        // Reset service filters
        serviceButtons.forEach((button) => {
          button.classList.remove(SELECTORS.serviceButtonActive);
          button.classList.remove(SELECTORS.disabled);
        });

        // Filter items with no active services
        filterWorkItems(typeSlug, []);
        updateFilterUrl({ filter: typeSlug, services: [] });
      });
    });

    // Service filter click handler
    serviceButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        // Toggle active state
        this.classList.toggle(SELECTORS.serviceButtonActive);

        // Get all active services
        const activeServicesSlugs = serviceButtons
          .filter((btn) =>
            btn.classList.contains(SELECTORS.serviceButtonActive)
          )
          .map((btn) => btn.getAttribute("data-slug") || "")
          .filter((slug) => slug !== "");

        filterWorkItems(getActiveFilter(), activeServicesSlugs);
        updateFilterUrl({
          filter: getActiveFilter(),
          services: activeServicesSlugs,
        });
      });
    });

    // Listen for popstate (browser back/forward)
    window.addEventListener("popstate", () => {
      const newActiveType = getActiveFilter();
      const newActiveServices = getActiveServices();

      // Update type filter state
      filterLinks.forEach((link) =>
        link.classList.remove(SELECTORS.filterLinkActive)
      );
      filterLinks
        .filter((link) => link.getAttribute("data-slug") === newActiveType)
        .forEach((link) => link.classList.add(SELECTORS.filterLinkActive));

      // Update service buttons state
      serviceButtons.forEach((button) => {
        const buttonSlug = button.getAttribute("data-slug") || "";
        button.classList.remove(SELECTORS.serviceButtonActive);
        if (newActiveServices.includes(buttonSlug)) {
          button.classList.add(SELECTORS.serviceButtonActive);
        }
      });

      filterWorkItems(newActiveType, newActiveServices);
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
export { initWorkFilters };
