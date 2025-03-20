import { animate } from "motion";

function initializeFilters() {
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

  // jQuery element selections (moved outside document ready)
  let $filterLinks: JQuery;
  let $serviceButtons: JQuery;

  // Function to initialize work items with service data
  function initializeWorkItemServices() {
    $(`.${SELECTORS.workItem}`).each((_, item) => {
      const $item = $(item);
      const services = $item
        .find(`.${SELECTORS.workItemService}`)
        .map((_, serviceEl) => $(serviceEl).data("slug"))
        .get();

      $item.attr("data-services", services.join(","));
    });
  }

  // Function to get active type filter from URL
  function getActiveFilter(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("filter") || "all";
  }

  // Function to get active service filters from URL
  function getActiveServices(): string[] {
    const urlParams = new URLSearchParams(window.location.search);
    const services = urlParams.get("services");
    return services ? services.split(",") : [];
  }

  // Function to update URL with filters
  function updateFilterUrl(typeSlug: string, servicesSlugs: string[]): void {
    const url = new URL(window.location.href);
    url.searchParams.set("filter", typeSlug);
    if (servicesSlugs.length > 0) {
      url.searchParams.set("services", servicesSlugs.join(","));
    } else {
      url.searchParams.delete("services");
    }
    window.history.pushState({}, "", url.toString());
  }

  // Function to hide service filters that have no items for current type
  function hideIrrelevantServiceFilters(currentTypeSlug: string) {
    const $workItems = $(`.${SELECTORS.workItem}`);
    const $visibleItems =
      currentTypeSlug === "all"
        ? $workItems
        : $workItems.filter(`[data-type="${currentTypeSlug}"]`);

    // Get all services from items matching current type
    const availableServices = new Set<string>();
    $visibleItems.each((_, item) => {
      const services = $(item).attr("data-services")?.split(",") || [];
      services.forEach((service) => availableServices.add(service));
    });

    // Hide service buttons that have no items in current type
    $serviceButtons.each((_, button) => {
      const $button = $(button);
      const buttonSlug = $button.data("slug");
      $button.parent().toggle(availableServices.has(buttonSlug));
    });
  }

  // Function to update available service filters based on active services
  function updateAvailableServiceFilters(
    currentTypeSlug: string,
    activeServicesSlugs: string[]
  ) {
    const $workItems = $(`.${SELECTORS.workItem}`);

    const $visibleItems =
      currentTypeSlug === "all"
        ? $workItems
        : $workItems.filter(`[data-type="${currentTypeSlug}"]`);

    $serviceButtons.filter(":visible").each((_, button) => {
      const $button = $(button);
      const buttonSlug = $button.data("slug");

      // If button is already active, keep it enabled
      if (activeServicesSlugs.includes(buttonSlug)) {
        $button.removeClass(SELECTORS.disabled);
        return;
      }

      // Check if adding this service would yield any results
      const wouldHaveResults = $visibleItems.toArray().some((item) => {
        const $item = $(item);
        const itemServices = $item.attr("data-services")?.split(",") || [];

        return (
          itemServices.includes(buttonSlug) &&
          activeServicesSlugs.every((activeService) =>
            itemServices.includes(activeService)
          )
        );
      });

      // Add/remove disabled class based on whether it would yield results
      $button.toggleClass(SELECTORS.disabled, !wouldHaveResults);
    });
  }

  // Function to filter work items (updated)
  function filterWorkItems(typeSlug: string, servicesSlugs: string[]) {
    const $workItems = $(`.${SELECTORS.workItem}`);

    $workItems.each((_, item) => {
      const $item = $(item);
      const matchesType =
        typeSlug === "all" || $item.attr("data-type") === typeSlug;
      const matchesServices =
        servicesSlugs.length === 0 ||
        servicesSlugs.every((service) =>
          $item.attr("data-services")?.includes(service)
        );

      if (matchesType && matchesServices) {
        $item.show();
      } else {
        $item.hide();
      }
    });

    // First hide irrelevant services for the type
    hideIrrelevantServiceFilters(typeSlug);
    // Then disable services that wouldn't yield results
    updateAvailableServiceFilters(typeSlug, servicesSlugs);
  }

  // Function to hide empty type filters
  function hideEmptyTypeFilters() {
    const $workItems = $(`.${SELECTORS.workItem}`);

    $filterLinks.each((_, link) => {
      const $link = $(link);
      const typeSlug = $link.data("slug");

      // "all" filter should always be visible if there are any items
      if (typeSlug === "all") {
        $link.parent().toggle($workItems.length > 0);
        return;
      }

      // Check if there are any items matching this type
      const hasItems =
        $workItems.filter(`[data-type="${typeSlug}"]`).length > 0;
      $link.parent().toggle(hasItems);
    });
  }

  // Initialize filter handling
  $(() => {
    // Initialize services data attributes first
    initializeWorkItemServices();

    // Initialize jQuery selections
    $filterLinks = $(`.${SELECTORS.filterLink}`);
    $serviceButtons = $(`.${SELECTORS.serviceButton}`);

    // Hide type filters without any items
    hideEmptyTypeFilters();

    // Set initial active states and filter items
    const activeType = getActiveFilter();
    const activeServices = getActiveServices();

    // First remove active class from all filter links
    $filterLinks.removeClass(SELECTORS.filterLinkActive);

    // Then add active class to the correct filter
    $filterLinks
      .filter(`[data-slug="${activeType}"]`)
      .addClass(SELECTORS.filterLinkActive);

    filterWorkItems(activeType, activeServices);

    // Set initial service buttons state
    $serviceButtons.each((_, element) => {
      const $button = $(element);
      if (activeServices.includes($button.data("slug"))) {
        $button.addClass(SELECTORS.serviceButtonActive);
      }
    });

    // Type filter click handler
    $filterLinks.on("click", function (e) {
      e.preventDefault();
      const $clicked = $(this);
      const typeSlug = $clicked.data("slug");

      // Update type filter state
      $filterLinks.removeClass(SELECTORS.filterLinkActive);
      $clicked.addClass(SELECTORS.filterLinkActive);

      // Reset service filters
      $serviceButtons.removeClass(SELECTORS.serviceButtonActive);
      $serviceButtons.removeClass(SELECTORS.disabled);

      // Filter items with no active services
      filterWorkItems(typeSlug, []);
      updateFilterUrl(typeSlug, []);
    });

    // Service filter click handler
    $serviceButtons.on("click", function (e) {
      e.preventDefault();
      const $clicked = $(this);
      const serviceSlug = $clicked.data("slug");

      // Toggle active state
      $clicked.toggleClass(SELECTORS.serviceButtonActive);

      // Get all active services
      const activeServicesSlugs = $serviceButtons
        .filter(`.${SELECTORS.serviceButtonActive}`)
        .map((_, el) => $(el).data("slug"))
        .get();

      filterWorkItems(getActiveFilter(), activeServicesSlugs);
      updateFilterUrl(getActiveFilter(), activeServicesSlugs);
    });

    // Listen for popstate (browser back/forward)
    $(window).on("popstate", () => {
      const newActiveType = getActiveFilter();
      const newActiveServices = getActiveServices();

      // Update type filter state
      $filterLinks.removeClass(SELECTORS.filterLinkActive);
      $filterLinks
        .filter(`[data-slug="${newActiveType}"]`)
        .addClass(SELECTORS.filterLinkActive);

      // Update service buttons state
      $serviceButtons.removeClass(SELECTORS.serviceButtonActive);
      newActiveServices.forEach((service) => {
        $serviceButtons
          .filter(`[data-slug="${service}"]`)
          .addClass(SELECTORS.serviceButtonActive);
      });

      filterWorkItems(newActiveType, newActiveServices);
    });
  });
}

// Wait for jQuery to load
declare global {
  interface Window {
    jQuery: typeof jQuery;
  }
}

// Make this file a module
export {};

const checkJquery = setInterval(() => {
  if (typeof window.jQuery !== "undefined") {
    clearInterval(checkJquery);
    initializeFilters();
  }
}, 10);
