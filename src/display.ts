export default class Display {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(pixels: number[]) {
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
        this.context.fillRect(scaledX, scaledY, pixelSize, pixelSize);
      }
    }
  }
}
