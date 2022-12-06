import Display from "./display";

let pixels = new Array<Array<number>>(64);

for (let i = 0; i < pixels.length; i++) {
  pixels[i] = new Array<number>(32).fill(0, 0, 32);
  if (i > pixels.length / 2) {
    pixels[i].fill(1, 0, 32);
  }
}

let display = new Display(1280, 640);
display.render(pixels);
