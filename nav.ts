const initNav = () => {
  const menuToggle = document.querySelector(".nav_menu-toggle") as HTMLElement;
  const menuContainer = document.querySelector(
    ".nav_menu-container"
  ) as HTMLElement;

  if (!menuToggle || !menuContainer) return;

  // get styling
  const menuToggleStyle = window.getComputedStyle(menuToggle);

  if (menuToggleStyle.display === "none") {
    return;
  }

  // Set view-transition-name for both elements
  menuToggle.style.viewTransitionName = "nav-menu";
  menuContainer.style.viewTransitionName = "nav-menu";

  // Toggle menu function with view transitions
  const toggleMenu = () => {
    const computedStyle = window.getComputedStyle(menuContainer);
    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        if (computedStyle.display === "none") {
          menuContainer.style.display = "flex";
          menuToggle.style.display = "none";
        } else {
          menuContainer.style.display = "none";
          menuToggle.style.display = "flex";
        }
      });
    } else {
      // Fallback for browsers that don't support view transitions
      if (computedStyle.display === "none") {
        menuContainer.style.display = "flex";
        menuToggle.style.display = "none";
      } else {
        menuContainer.style.display = "none";
        menuToggle.style.display = "flex";
      }
    }
  };

  // Open menu when toggle is clicked
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    const computedStyle = window.getComputedStyle(menuContainer);
    if (
      computedStyle.display !== "none" &&
      !menuContainer.contains(e.target as Node)
    ) {
      toggleMenu();
    }
  });

  // Prevent clicks inside menu container from closing the menu
  menuContainer.addEventListener("click", (e) => {
    e.stopPropagation();
  });
};

export { initNav };
