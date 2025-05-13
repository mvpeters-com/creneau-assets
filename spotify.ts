import { SpotifyIFrameAPI, SpotifyEmbedController } from "./spotify-iframe-api";

export function initSpotify() {
  console.log("initSpotify");
  // Dynamically load the Spotify IFrame API script
  const scriptId = "spotify-iframe-api";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.head.appendChild(script);
  }

  // Set up the Spotify IFrame API ready handler
  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    const elements = document.querySelectorAll(".spotify-embed-block");

    elements.forEach((element) => {
      const uri = element?.getAttribute("data-spotify-uri");

      console.log(uri);

      if (!element) {
        console.warn("No element found with [data-embed-spotify] attribute.");
        return;
      }

      if (!uri) {
        console.warn("No URI found for [data-spotify-uri] attribute.");
        return;
      }

      const options = {
        uri: `spotify:episode:${uri}`,
      };
      const callback = (EmbedController: SpotifyEmbedController) => {
        // Optionally handle the controller here
      };

      IFrameAPI.createController(element as HTMLElement, options, callback);
    });
  };
}
