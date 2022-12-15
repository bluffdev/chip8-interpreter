import Chip8 from './chip8';
// import Chip8 from './temp';
import Display from './display';
import Rom from './rom';

let display = new Display(1280, 640);
let chip8 = new Chip8();
let roms = new Rom();

display.render(new Array(2048).fill(0));
document.addEventListener('keydown', (e: KeyboardEvent) => {
  e.preventDefault();
  if (e.key === '1') {
    chip8.setKeyPressed(0);
  }
  if (e.key === '2') {
    chip8.setKeyPressed(1);
  }
  if (e.key === '3') {
    chip8.setKeyPressed(2);
  }
  if (e.key === '4') {
    chip8.setKeyPressed(3);
  }
  if (e.key === 'q') {
    chip8.setKeyPressed(4);
  }
  if (e.key === 'w') {
    chip8.setKeyPressed(5);
  }
  if (e.key === 'e') {
    chip8.setKeyPressed(6);
  }
  if (e.key === 'r') {
    chip8.setKeyPressed(7);
  }
  if (e.key === 'a') {
    chip8.setKeyPressed(8);
  }
  if (e.key === 's') {
    chip8.setKeyPressed(9);
  }
  if (e.key === 'd') {
    chip8.setKeyPressed(10);
  }
  if (e.key === 'f') {
    chip8.setKeyPressed(11);
  }
  if (e.key === 'z') {
    chip8.setKeyPressed(12);
  }
  if (e.key === 'x') {
    chip8.setKeyPressed(13);
  }
  if (e.key === 'c') {
    chip8.setKeyPressed(14);
  }
  if (e.key === 'v') {
    chip8.setKeyPressed(15);
  }
});

document.addEventListener('keyup', (e: KeyboardEvent) => {
  e.preventDefault();
  if (e.key === '1') {
    chip8.setKeyReleased(0);
  }
  if (e.key === '2') {
    chip8.setKeyReleased(1);
  }
  if (e.key === '3') {
    chip8.setKeyReleased(2);
  }
  if (e.key === '4') {
    chip8.setKeyReleased(3);
  }
  if (e.key === 'q') {
    chip8.setKeyReleased(4);
  }
  if (e.key === 'w') {
    chip8.setKeyReleased(5);
  }
  if (e.key === 'e') {
    chip8.setKeyReleased(6);
  }
  if (e.key === 'r') {
    chip8.setKeyReleased(7);
  }
  if (e.key === 'a') {
    chip8.setKeyReleased(8);
  }
  if (e.key === 's') {
    chip8.setKeyReleased(9);
  }
  if (e.key === 'd') {
    chip8.setKeyReleased(10);
  }
  if (e.key === 'f') {
    chip8.setKeyReleased(11);
  }
  if (e.key === 'z') {
    chip8.setKeyReleased(12);
  }
  if (e.key === 'x') {
    chip8.setKeyReleased(13);
  }
  if (e.key === 'c') {
    chip8.setKeyReleased(14);
  }
  if (e.key === 'v') {
    chip8.setKeyReleased(15);
  }
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
