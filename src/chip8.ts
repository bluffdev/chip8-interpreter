// import { readFileSync } from 'fs';
import { fontSprites } from './font';

export default class Chip8 {
  private memory: Uint8Array;
  private display: Array<number>;
  private V: Uint8Array;
  private I: Uint16Array;
  private DT: Uint8Array;
  private ST: Uint8Array;
  private PC: Uint16Array;
  private SP: Uint8Array;
  private stack: Uint16Array;
  private drawFlag: boolean;
  private loaded: boolean;
  private temp: boolean = false;

  constructor() {
    this.memory = new Uint8Array(4096).fill(0);
    this.display = new Array(64 * 32).fill(0);
    this.V = new Uint8Array(16).fill(0);
    this.I = new Uint16Array(1).fill(0);
    this.DT = new Uint8Array(1).fill(0);
    this.ST = new Uint8Array(1).fill(0);
    this.PC = new Uint16Array(1).fill(512);
    this.SP = new Uint8Array(1).fill(0);
    this.stack = new Uint16Array(16).fill(0);
    this.drawFlag = false;
    this.loaded = false;
    // this.readRom();
  }

  readSprites() {
    for (let i = 0; i < 80; i++) {
      this.memory[i] = fontSprites[i];
    }
  }

  getTemp() {
    return this.temp;
  }

  fetch(left: number, right: number) {
    let opcode = new Uint16Array(1);
    opcode[0] = left;
    opcode[0] <<= 8;
    opcode[0] |= right;
    return opcode;
  }

  readRom(rom: any) {
    let reader = new FileReader() as FileReader;
    reader.onload = () => {
      let buffer = new Uint8Array(reader.result as ArrayBuffer);
      for (let i = 0; i < buffer.length; i++) {
        this.memory[0x200 + i] = buffer[i];
      }
    };
    this.loaded = true;
    reader.readAsArrayBuffer(rom);
    // let input = readFileSync(`${process.cwd()}/src/roms/IBM.ch8`);
    // let pc = 512;
    // for (let i = 0; i < input.length; i++, pc++) {
    //   this.memory[pc] = input[i];
    // }
  }

  execute() {
    if (this.loaded === false) return;

    let opcode = this.fetch(this.memory[this.PC[0]], this.memory[this.PC[0] + 1]);
    let nnn = new Uint16Array([opcode[0] & 0x0fff]);
    let n = new Uint8Array([opcode[0] & 0x000f]);
    let x = new Uint8Array([(opcode[0] & 0x0f00) >> 8]);
    let y = new Uint8Array([(opcode[0] & 0x00f0) >> 8]);
    let kk = new Uint8Array([opcode[0] & 0xff]);

    switch (opcode[0] & 0xf000) {
      case 0x0000:
        if (opcode[0] === 0x00e0) {
          this.drawFlag = true;
          this.PC[0] += 2;
          console.log('0x00E0: CLS');
        } else if (opcode[0] === 0x00ee) {
          this.PC[0] = this.stack[this.SP[0]];
          this.SP[0] -= 1;
          this.PC[0] += 2;
          console.log('0x00EE: RET');
        }
        break;
      case 0x1000:
        console.log('1nnn: JP nnn');
        this.PC[0] = nnn[0];
        this.temp = true;
        break;
      case 0x2000:
        console.log('2nnn: Call nnn');
        this.SP[0] += 1;
        if (this.SP[0] >= 16) {
          console.log('Error: Stack Overflow');
        } else {
          this.stack[this.SP[0]] = this.PC[0];
          this.PC[0] = nnn[0];
        }
        break;
      case 0x3000:
        if (this.V[x[0]] === kk[0]) {
          this.PC[0] += 4;
        } else {
          this.PC[0] += 2;
        }
        console.log('3xkk: SE Vx, kk');
        break;
      case 0x4000:
        if (this.V[x[0]] !== kk[0]) {
          this.PC[0] += 4;
        } else {
          this.PC[0] += 2;
        }
        console.log('4xkk: SNE Vx, kk');
        break;
      case 0x5000:
        if (this.V[x[0]] === this.V[y[0]]) {
          this.PC[0] += 4;
        } else {
          this.PC[0] += 2;
        }
        console.log('5xy0: Se Vx, Vy');
        break;
      case 0x6000:
        this.V[x[0]] = kk[0];
        this.PC[0] += 2;
        console.log('6xkk: LD Vx, kk ', kk[0].toString(16));
        break;
      case 0x7000:
        this.V[x[0]] += kk[0];
        this.PC[0] += 2;
        console.log('7xkk: ADD Vx, kk', kk[0].toString(16));
        break;
      case 0x8000:
        switch (n[0]) {
          case 0x0:
            this.V[x[0]] = this.V[y[0]];
            this.PC[0] += 2;
            console.log('8xy0: LD Vx, Vy');
            break;
          case 0x1:
            this.V[x[0]] |= this.V[y[0]];
            this.PC[0] += 2;
            console.log('8xy1: OR Vx, Vy');
            break;
          case 0x2:
            this.V[x[0]] &= this.V[y[0]];
            this.PC[0] += 2;
            console.log('8x02: AND Vx, Vy');
            break;
          case 0x3:
            this.V[x[0]] ^= this.V[y[0]];
            this.PC[0] += 2;
            console.log('8xy3: XOR Vx, Vy');
            break;
          case 0x4:
            this.V[x[0]] += this.V[y[0]];
            if (this.V[x[0]] > 255) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.PC[0] += 2;
            console.log('8xy4: ADD Vx, Vy');
            break;
          case 0x5:
            if (this.V[x[0]] > this.V[y[0]]) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.V[x[0]] -= this.V[y[0]];
            this.PC[0] += 2;
            console.log('8xy5: SUB Vx, Vy');
            break;
          case 0x6:
            if ((this.V[x[0]] & 0x1) === 1) {
              this.V[15] = 1;
            }
            this.V[x[0]] >>= 1;
            this.PC[0] += 2;
            console.log('8xy6: SHR Vx {, Vy}');
            break;
          case 0x7:
            if (this.V[y[0]] > this.V[x[0]]) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.V[x[0]] = this.V[y[0]] - this.V[x[0]];
            this.PC[0] += 2;
            console.log('8xy7: SUBN Vx, Vy');
            break;
          case 0xe:
            if (this.V[x[0]] >> 7 === 1) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.V[x[0]] <<= 1;
            this.PC[0] += 2;
            console.log('8xyE: SHL Vx {, Vy}');
            break;
          default:
            console.log('INVALID OPCODE REEEEEEEEEEEEEEE (its fine)');
            break;
        }
        break;
      case 0x9000:
        if (this.V[x[0]] !== this.V[y[0]]) {
          this.PC[0] += 4;
        } else {
          this.PC[0] += 2;
        }
        console.log('9xy0: SNE Vx, Vy');
        break;
      case 0xa000:
        this.I[0] = nnn[0];
        this.PC[0] += 2;
        console.log('Annn: LD I, nnn ', nnn[0].toString(16), this.I[0].toString(16));
        break;
      case 0xb000:
        this.PC[0] = nnn[0] + this.V[0];
        console.log('Bnnn: JP V0, nnn');
        break;
      case 0xc000:
        let rand = Math.random() * 255;
        this.V[x[0]] = rand & kk[0];
        this.PC[0] += 2;
        console.log('Cxkk: RND Vx, kk');
        break;
      case 0xd000:
        const N = opcode[0] & 0x000f;
        const X = (opcode[0] & 0x0f00) >> 8;
        const Y = (opcode[0] & 0x00f0) >> 4;
        this.V[0xf] = 0;
        for (let row = 0; row < N; row++) {
          const spriteRow = this.memory[this.I[0] + row];

          for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
            const bit = spriteRow & (0b10000000 >> bitIndex);

            if (!bit) continue;

            const targetX = (this.V[X] + bitIndex) % 64; // modulus to make it wrap to screen
            const targetY = (this.V[Y] + row) % 32;
            const displayPosition = targetX + targetY * 64; // Transform 2D to 1D -> i = x + width*y;

            // If the display will be unset, set VF
            if (this.display[displayPosition] !== 0) {
              this.V[0xf] = 0x1;
            }

            this.display[displayPosition] ^= 1;
          }
        }
        this.drawFlag = true;
        this.PC[0] += 2;
        console.log('Dxyn: DRW Vx, Vy, nibble ', n[0].toString(16));
        break;
      case 0xe000:
        if (kk[0] === 0x9e) {
          // TODO
          this.PC[0] += 2;
          console.log('Ex9E: SKP Vx');
        } else if (kk[0] === 0xa1) {
          // TODO
          this.PC[0] += 2;
          console.log('ExA1: SKNP Vx');
        }
        break;
      case 0xf000:
        switch (kk[0]) {
          case 0x07:
            this.V[x[0]] = this.DT[0];
            this.PC[0] += 2;
            console.log('Fx07: LD Vx, DT');
            break;
          case 0x0a:
            // TODO
            this.PC[0] += 2;
            console.log('Fx0A: LD Vx, K');
            break;
          case 0x15:
            this.DT[0] = this.V[x[0]];
            this.PC[0] += 2;
            console.log('Fx15: LD DT, Vx');
            break;
          case 0x18:
            this.ST[0] = this.V[x[0]];
            this.PC[0] += 2;
            console.log('Fx18: LD St, Vx');
            break;
          case 0x1e:
            this.I[0] += this.V[x[0]];
            this.PC[0] += 2;
            console.log('Fx1E: ADD I, Vx');
            break;
          case 0x29:
            this.I[0] = this.V[x[0]] * 0x5;
            this.PC[0] += 2;
            console.log('Fx29: LD F, Vx');
            break;
          case 0x33:
            // TODO
            console.log('Fx33: LD B, Vx');
            break;
          case 0x55:
            // TODO
            console.log('Fx55: LD [I], Vx');
            break;
          case 0x65:
            // TODO
            console.log('Fx65: LD Vx, [I]');
            break;
          default:
            console.log('INVALID OPCODE REEEEEEEEEEEEEEE (its fine)', opcode[0].toString(16));
            break;
        }
        break;
      default:
        console.log('False flag');
    }
    // }
  }
  getDisplay() {
    return this.display;
  }

  getDrawFlag() {
    return this.drawFlag;
  }

  setDrawFlag(val: boolean) {
    this.drawFlag = val;
  }

  setLoaded(val: boolean) {
    this.loaded = val;
  }
}
