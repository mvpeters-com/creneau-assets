function initLinks(): void {
  // Wait for DOM content to be fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    // look for elements with data-query attribute
    const queryParams: NodeListOf<Element> =
      document.querySelectorAll("[data-query]");

    queryParams.forEach((el) => {
      // Find the attribute that starts with data-query-
      const queryAttr: string | undefined = Array.from(el.attributes).find(
        (attr) => attr.name.startsWith("data-query-")
      )?.name;

      if (!queryAttr) return;

      const param: string = queryAttr.replace("data-query-", "");
      const value: string =
        (el as HTMLElement).getAttribute(`data-query-${param}`) || "";

      const anchorEl = el as HTMLAnchorElement;
      const href: string = anchorEl.href;

      const hasParams: boolean = href.includes("?");
      anchorEl.href = href + (hasParams ? "&" : "?") + param + "=" + value;
    });
  });
}

export { initLinks };
