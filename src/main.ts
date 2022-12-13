import Chip8 from './chip8';
import Display from './display';

let pixels = new Uint8Array(64 * 32).fill(0);

// for (let i = 0; i < pixels.length; i++) {
//   pixels[i] = new Array<number>(32).fill(0, 0, 32);
//   if (i > pixels.length / 2) {
//     pixels[i].fill(1, 0, 32);
//   }
// }

// for (let i = 0; i < pixels.length; i++) {
//   if (i > pixels.length / 2 - 1) {
//     pixels[i] = 1;
//   }
// }

let display = new Display(1280, 640);
let chip8 = new Chip8();
// display.render(pixels);

// function main() {
//   chip8.execute();
//   if (chip8.getDrawFlag() === true) {
//     display.render(chip8.getDisplay());
//   }

//   requestAnimationFrame(() => main());
// }

for (let i = 0; i < 25; i++) {
  chip8.execute();
}

display.render(pixels);

// main();
