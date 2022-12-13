import Chip8 from './chip8';
import Display from './display';

let display = new Display(1280, 640);
let chip8 = new Chip8();

let fileInput = document.getElementById('files') as HTMLInputElement;

fileInput.addEventListener('change', function (e) {
  let file = (<any>e.target).files[0];
  chip8.readRom(file);
  chip8.setLoaded(true);
});

function run() {
  chip8.execute();
  if (chip8.getDrawFlag() === true) {
    display.draw(chip8.getDisplay());
    chip8.setDrawFlag(false);
  }

  setTimeout(() => {
    run();
  }, 0);
}

run();
