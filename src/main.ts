import Chip8 from './chip8';
import Display from './display';
import Rom from './rom';

(function main() {
  const display = new Display(1280, 640);
  const chip8 = new Chip8();

  display.render(new Array(2048).fill(0));

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    e.preventDefault();
    chip8.setKeyPressed(e.key);
  });

  document.addEventListener('keyup', (e: KeyboardEvent) => {
    e.preventDefault();
    chip8.setKeyReleased(e.key);
  });

  let timeout: NodeJS.Timeout;

  function run() {
    chip8.execute();
    if (chip8.getDrawFlag() === true) {
      display.render(chip8.getDisplay());
      chip8.setDrawFlag(false);
    }

    if (chip8.getPauseFlag() === true) {
      clearTimeout(timeout);
      return;
    }

    if (chip8.getResetFlag() === true) {
      chip8.setResetFlag(false);
      clearTimeout(timeout);
      return;
    }

    timeout = setTimeout(() => {
      run();
    }, 1);
  }

  const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
  const romNames = ['IBM.ch8', 'MAZE.ch8', 'PONG.ch8', 'TETRIS.ch8', 'SPACE_INVADERS.ch8'];
  const romMappings = new Map<string, Rom>();

  for (const r of romNames) {
    let newRom = new Rom();
    newRom.readExistingRom(r);
    romMappings.set(r, newRom);
  }

  function selectRom(romName: string) {
    let curRom = romMappings.get(romName);
    if (curRom !== undefined) {
      chip8.loadRom(curRom.getContents());
    }
  }

  const start = document.getElementById('start') as HTMLButtonElement;
  const pause = document.getElementById('pause') as HTMLButtonElement;
  const reset = document.getElementById('reset') as HTMLButtonElement;

  start.addEventListener('click', (e: Event) => {
    e.preventDefault();
    if (chip8.getLoadedFlag() === false && dropdown.value !== 'NONE') {
      selectRom(dropdown.value);
      chip8.setResetFlag(false);
      run();
    }
  });

  pause.addEventListener('click', (e: Event) => {
    e.preventDefault();
    if (chip8.getLoadedFlag() === true && chip8.getPauseFlag() === false) {
      chip8.setPauseFlag(true);
    } else if (chip8.getPauseFlag() === true) {
      chip8.setPauseFlag(false);
      run();
    }
  });

  reset.addEventListener('click', (e: Event) => {
    e.preventDefault();
    if (chip8.getResetFlag() === false) {
      chip8.reset();
      display.render(new Array(2048).fill(0));
    }
  });
})();
