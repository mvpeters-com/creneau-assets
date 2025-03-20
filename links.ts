function addQueryParams(): void {
  // add jquery page loaded
  $(() => {
    // look for elements with data-query-{param} attribute
    const $queryParams: JQuery = $("[data-query]");

    console.log($queryParams);

    $queryParams.each((_, el) => {
      // Find the attribute that starts with data-query-
      const queryAttr: string | undefined = Array.from(el.attributes).find(
        (attr) => attr.name.startsWith("data-query-")
      )?.name;

      if (!queryAttr) return;

      const param: string = queryAttr.replace("data-query-", "");
      const value: string = $(el).data("query-" + param);

      const href: string = (el as HTMLAnchorElement).href;
      const hasParams: boolean = href.includes("?");
      (el as HTMLAnchorElement).href =
        href + (hasParams ? "&" : "?") + param + "=" + value;
    });
  });
}

// Make this file a module with jQuery typings
declare global {
  interface Window {
    jQuery: typeof jQuery;
  }
}

export {};

const checkJquery = setInterval(() => {
  if (typeof window.jQuery !== "undefined") {
    clearInterval(checkJquery);
    addQueryParams();
  }
}, 10);
