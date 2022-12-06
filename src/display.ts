export default class Display {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  // private width: number;
  // private height: number;
  private scale: number;

  constructor(width: number, height: number) {
    this.canvas = document.querySelector("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.width = width;
    this.canvas.height = height;
    this.scale = width / 64;
  }

  render(pixels: number[][]) {
    let imgData = new ImageData(64, 32);

    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 32; x++) {
        const index = 4 * (y * 32 + x);
        imgData.data[index + 0] = pixels[y][x] * 255;
        imgData.data[index + 1] = pixels[y][x] * 255;
        imgData.data[index + 2] = pixels[y][x] * 255;
        imgData.data[index + 3] = 255;
      }
    }

    this.context.imageSmoothingEnabled = false;
    this.context.scale(this.scale, this.scale);
    this.context.putImageData(imgData, 0, 0);
    this.context.scale(this.scale, this.scale);
    this.context.drawImage(this.canvas, 0, 0, 64, 32);
  }
}
