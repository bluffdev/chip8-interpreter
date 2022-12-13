import Chip8 from './chip8';
import Display from './display';
import Rom from './rom';

let display = new Display(1280, 640);
let chip8 = new Chip8();
let roms = new Rom();

display.render(new Array(2048).fill(0));

let fileInput = document.getElementById('files') as HTMLInputElement;
let start = document.getElementById('start') as HTMLButtonElement;

function check() {
  if (roms.getRomsLength() !== 0) {
    chip8.loadRom(roms.getIBMRom());
    chip8.setLoaded(true);
    return;
  }

  check();
}

// roms.readExistingRom();
// chip8.setLoaded(true);

fileInput.addEventListener('change', (e: Event) => {
  let file = (<any>e.target).files[0];
  roms.readRomInput(file);

  setTimeout(() => {
    check();
  }, 1);
});

function run() {
  chip8.execute();
  if (chip8.getDrawFlag() === true) {
    display.render(chip8.getDisplay());
    chip8.setDrawFlag(false);
  }

  setTimeout(() => {
    run();
  }, 1);
}

start.addEventListener('click', (e: Event) => {
  e.preventDefault();
  if (chip8.getLoaded() === true) {
    chip8.loadRom(roms.getIBMRom());
    run();
  }
});
