// spotify-iframe-api.d.ts

export enum EmbedErrorCode {
  InvalidURI = "invalid_uri",
}

export enum IframeAPIEvent {
  READY = "ready",
  PLAYBACK_STARTED = "playback_started",
  PLAYBACK_UPDATE = "playback_update",
  ERROR = "error",
}

export enum IframeCommands {
  PLAY_FROM_START = "play_from_start",
  PLAY = "play",
  PAUSE = "pause",
  RESUME = "resume",
  TOGGLE_PLAY = "toggle",
  SEEK = "seek",
  LOAD_COMPLETE_ACK = "load_complete_ack",
}

export interface SpotifyEmbedOptions {
  uri: string;
  theme?: "light" | "dark";
  view?: "list" | "coverart";
  width?: string | number;
  height?: string | number;
  color?: string;
  colorLight?: string;
  colorDark?: string;
  coverArtQuality?: "small" | "medium" | "large";
  preload?: boolean;
  loop?: boolean;
  autoplay?: boolean;
}

export interface PlaybackData {
  isPaused: boolean;
  position: number;
  duration: number;
}

export interface ErrorData {
  code: EmbedErrorCode;
  message: string;
}

export interface SpotifyEmbedController {
  // Methods
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  seek(positionMs: number): void;

  // Events
  on(event: IframeAPIEvent.READY, callback: () => void): void;
  on(event: IframeAPIEvent.PLAYBACK_STARTED, callback: () => void): void;
  on(
    event: IframeAPIEvent.PLAYBACK_UPDATE,
    callback: (data: PlaybackData) => void
  ): void;
  on(event: IframeAPIEvent.ERROR, callback: (error: ErrorData) => void): void;
  on(event: string, callback: (data?: any) => void): void;

  // Remove event listeners
  off(event: IframeAPIEvent | string, callback?: Function): void;

  // Destroy and clean up
  destroy(): void;
}

export interface SpotifyIFrameAPI {
  createController(
    element: HTMLElement,
    options: SpotifyEmbedOptions,
    callback: (controller: SpotifyEmbedController) => void
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady: (api: SpotifyIFrameAPI) => void;
  }
}
