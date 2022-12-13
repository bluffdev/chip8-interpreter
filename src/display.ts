export default class Display {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  // private width: number;
  // private height: number;
  private scale: number;

  constructor(width: number, height: number) {
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = width;
    this.canvas.height = height;
    this.scale = width / 64;
  }

  // render(pixels: number[]) {
  //   this.context.fillStyle = 'black';
  //   this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  //   let imgData = new ImageData(64, 32);
  //   for (let y = 0; y < 32; y++) {
  //     for (let x = 0; x < 64; x++) {
  //       const index = 4 * (y * 64 + x);
  //       imgData.data[index + 0] = pixels[y * 64 + x] * 255;
  //       imgData.data[index + 1] = pixels[y * 64 + x] * 255;
  //       imgData.data[index + 2] = pixels[y * 64 + x] * 255;
  //       imgData.data[index + 3] = 255;
  //     }
  //   }
  //   this.context.imageSmoothingEnabled = false;
  //   this.context.scale(this.scale, this.scale);
  //   this.context.putImageData(imgData, 0, 0);
  //   this.context.scale(this.scale, this.scale);
  //   this.context.drawImage(this.canvas, 0, 0, 64, 32);
  // }

  draw(pixels: number[]) {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const pixelSize = this.canvas.height / 32;

    this.context.fillStyle = 'white';
    const displayData = pixels;
    for (let i = 0; i < displayData.length; i++) {
      const y = Math.floor(i / 64);
      const x = i % 64;
      if (displayData[i] !== 0) {
        const scaledX = x * pixelSize,
          scaledY = y * pixelSize;
        // this.ctx.shadowBlur = this.shadowBlur;
        // this.ctx.shadowColor = this.shadowColor;
        this.context.fillRect(scaledX, scaledY, pixelSize, pixelSize);
      }
    }
  }
}
