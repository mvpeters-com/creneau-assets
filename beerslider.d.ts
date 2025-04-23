declare module "beerslider" {
  export default class BeerSlider {
    constructor(
      element: HTMLElement,
      options?: {
        start?: string | number;
        prefix?: string;
      }
    );

    start: number;
    prefix: string;
    element: HTMLElement;
    revealContainer: HTMLElement;
    revealElement: HTMLElement;
    range: HTMLInputElement;
    handle: HTMLSpanElement;

    init(): void;
    loadingImg(src: string): Promise<void>;
    loadedBoth(): Promise<void[]>;
    onImagesLoad(): void;
    addElement(tag: string, attributes: Record<string, string>): HTMLElement;
    setImgWidth(): void;
    addListeners(): void;
    move(): void;
  }
}
