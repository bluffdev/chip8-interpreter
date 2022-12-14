import Chip8 from './chip8';
// // import Chip8 from './temp';
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
    console.log('pressed 1');
  }
  if (e.key === '2') {
    chip8.setKeyPressed(1);
    console.log('pressed 2');
  }
  if (e.key === '3') {
    chip8.setKeyPressed(2);
    console.log('pressed 3');
  }
  if (e.key === '4') {
    chip8.setKeyPressed(3);
    console.log('pressed 4');
  }
  if (e.key === 'q') {
    chip8.setKeyPressed(4);
    console.log('pressed Q');
  }
  if (e.key === 'w') {
    chip8.setKeyPressed(5);
    console.log('pressed W');
  }
  if (e.key === 'e') {
    chip8.setKeyPressed(6);
    console.log('pressed E');
  }
  if (e.key === 'r') {
    chip8.setKeyPressed(7);
    console.log('pressed R');
  }
  if (e.key === 'a') {
    chip8.setKeyPressed(8);
    console.log('pressed A');
  }
  if (e.key === 's') {
    chip8.setKeyPressed(9);
    console.log('pressed S');
  }
  if (e.key === 'd') {
    chip8.setKeyPressed(10);
    console.log('pressed D');
  }
  if (e.key === 'f') {
    chip8.setKeyPressed(11);
    console.log('pressed F');
  }
  if (e.key === 'z') {
    chip8.setKeyPressed(12);
    console.log('pressed Z');
  }
  if (e.key === 'x') {
    chip8.setKeyPressed(13);
    console.log('pressed X');
  }
  if (e.key === 'c') {
    chip8.setKeyPressed(14);
    console.log('pressed C');
  }
  if (e.key === 'v') {
    chip8.setKeyPressed(15);
    console.log('pressed V');
  }
});

document.addEventListener('keyup', (e: KeyboardEvent) => {
  e.preventDefault();
  if (e.key === '1') {
    chip8.setKeyReleased(0);
    console.log('released 1');
  }
  if (e.key === '2') {
    chip8.setKeyReleased(1);
    console.log('released 2');
  }
  if (e.key === '3') {
    chip8.setKeyReleased(2);
    console.log('released 3');
  }
  if (e.key === '4') {
    chip8.setKeyReleased(3);
    console.log('released 4');
  }
  if (e.key === 'q') {
    chip8.setKeyReleased(4);
    console.log('released Q');
  }
  if (e.key === 'w') {
    chip8.setKeyReleased(5);
    console.log('released W');
  }
  if (e.key === 'e') {
    chip8.setKeyReleased(6);
    console.log('released E');
  }
  if (e.key === 'r') {
    chip8.setKeyReleased(7);
    console.log('released R');
  }
  if (e.key === 'a') {
    chip8.setKeyReleased(8);
    console.log('released A');
  }
  if (e.key === 's') {
    chip8.setKeyReleased(9);
    console.log('released S');
  }
  if (e.key === 'd') {
    chip8.setKeyReleased(10);
    console.log('released D');
  }
  if (e.key === 'f') {
    chip8.setKeyReleased(11);
    console.log('released F');
  }
  if (e.key === 'z') {
    chip8.setKeyReleased(12);
    console.log('released Z');
  }
  if (e.key === 'x') {
    chip8.setKeyReleased(13);
    console.log('released X');
  }
  if (e.key === 'c') {
    chip8.setKeyReleased(14);
    console.log('released C');
  }
  if (e.key === 'v') {
    chip8.setKeyReleased(15);
    console.log('released V');
  }
});

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

roms.readExistingRom();
chip8.setLoaded(true);

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
  // chip8.cycle();
  // if (chip8.getShouldDraw() === true) {
  //   display.render(chip8.getDisplay());
  //   chip8.setShouldDraw(false);
  // }

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
  // if (chip8.getLoaded() === true) {
  //   chip8.loadRom(roms.getIBMRom());
  //   run();
  // }
});
