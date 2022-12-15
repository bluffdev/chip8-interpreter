import Chip8 from './chip8';
import Display from './display';
import Rom from './rom';

let display = new Display(1280, 640);
let chip8 = new Chip8();
let roms = new Rom();

display.render(new Array(2048).fill(0));
document.addEventListener('keydown', (e: KeyboardEvent) => {
  e.preventDefault();
  chip8.setKeyPressed(e.key);
});

document.addEventListener('keyup', (e: KeyboardEvent) => {
  e.preventDefault();
  chip8.setKeyReleased(e.key);
});

let start = document.getElementById('start') as HTMLButtonElement;

roms.readExistingRom();
chip8.setLoaded(true);

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
    console.log(roms.getIBMRom().length);
    chip8.loadRom(roms.getIBMRom());
    run();
  }
});
