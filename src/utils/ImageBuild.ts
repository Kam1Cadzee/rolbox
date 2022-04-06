export class ImageBuild {
  static PIXEL_WIDTH = 4;
  static PIXEL_HEIGHT = 3;

  private pixelW: number;
  private pixelH: number;
  private width: number;
  private height: number;

  constructor({
    height,
    pixelH = ImageBuild.PIXEL_HEIGHT,
    pixelW = ImageBuild.PIXEL_WIDTH,
    width,
  }: {
    pixelW?: number;
    pixelH?: number;
    width?: number;
    height?: number;
  }) {
    this.pixelH = pixelH;
    this.pixelW = pixelW;
    if (width) {
      this.height = (width / pixelW) * pixelH;
      this.width = width;
    } else if (height) {
      this.width = (height / pixelH) * pixelW;
      this.height = height;
    }
  }

  get Height() {
    return this.height;
  }

  get Width() {
    return this.width;
  }

  get PixelW() {
    return this.pixelW;
  }

  get PixelH() {
    return this.pixelH;
  }
}
