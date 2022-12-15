import { fontSprites, keyMappings } from './utils';

export default class Chip8 {
  private memory: Uint8Array;
  private display: Array<number>;
  private V: Uint8Array;
  private I: number;
  private DT: number;
  private ST: number;
  private PC: number;
  private SP: number;
  private stack: Uint16Array;
  private keys: Array<number>;
  private drawFlag: boolean;
  private loaded: boolean;
  private readonly keyMappings: Map<string, number>;

  constructor() {
    this.memory = new Uint8Array(4096).fill(0);
    this.display = new Array(64 * 32).fill(0);
    this.V = new Uint8Array(16).fill(0);
    this.I = 0;
    this.DT = 0;
    this.ST = 0;
    this.PC = 0x200;
    this.SP = 0;
    this.stack = new Uint16Array(16).fill(0);
    this.keys = new Array(16).fill(0);
    this.drawFlag = false;
    this.loaded = false;
    this.readSprites();
    this.keyMappings = keyMappings;
  }

  readSprites() {
    for (let i = 0; i < 80; i++) {
      this.memory[i] = fontSprites[i];
    }
  }

  loadRom(rom: Uint8Array) {
    for (let i = 0; i < rom.length; i++) {
      this.memory[0x200 + i] = rom[i];
    }
  }

  setKeyPressed(k: string) {
    let key = this.keyMappings.get(k);
    if (key !== undefined) {
      this.keys[key] = 1;
    }
  }

  setKeyReleased(k: string) {
    let key = this.keyMappings.get(k);
    if (key !== undefined) {
      this.keys[key] = 0;
    }
  }

  keyPressed() {
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] === 1) {
        return true;
      }
    }

    return false;
  }

  fetch(left: number, right: number) {
    let opcode = left;
    opcode <<= 8;
    opcode |= right;
    return opcode;
  }

  execute() {
    if (this.loaded === false) return;

    if (this.DT > 0) {
      this.DT -= 1;
    }

    let opcode = this.fetch(this.memory[this.PC], this.memory[this.PC + 1]);
    let nnn = opcode & 0x0fff;
    let n = opcode & 0x000f;
    let x = (opcode & 0x0f00) >> 8;
    let y = (opcode & 0x00f0) >> 4;
    let kk = opcode & 0xff;

    switch (opcode & 0xf000) {
      case 0x0000:
        if (opcode === 0x00e0) {
          this.drawFlag = true;
          this.display = new Array<number>(2048).fill(0);
          this.PC += 2;
          console.log('00E0: CLS');
        } else if (opcode === 0x00ee) {
          if (this.SP === 0) {
            console.log('Stack underflow');
            return;
          }
          this.SP -= 1;
          this.PC = this.stack[this.SP];
          this.PC += 2;
          console.log('00EE: RET');
        }
        break;
      case 0x1000:
        this.PC = nnn;
        console.log('1nnn: JP nnn ', nnn.toString(16), this.PC.toString(16));
        break;
      case 0x2000:
        this.stack[this.SP] = this.PC;
        this.SP += 1;
        this.PC = nnn;
        console.log('3nnn: Call nnn', this.PC.toString(16), nnn.toString(16));
        break;
      case 0x3000:
        if (this.V[x] === kk) {
          this.PC += 4;
          console.log('skip');
        } else {
          console.log('no skip');
          this.PC += 2;
        }
        console.log(
          '3xkk: SE Vx, kk ',
          this.V[x].toString(16),
          kk.toString(16),
          opcode.toString(16)
        );
        break;
      case 0x4000:
        if (this.V[x] !== kk) {
          this.PC += 4;
        } else {
          this.PC += 2;
        }
        console.log('4xkk: SNE Vx, kk');
        break;
      case 0x5000:
        if (this.V[x] === this.V[y]) {
          this.PC += 4;
        } else {
          this.PC += 2;
        }
        console.log('5xy0: Se Vx, Vy');
        break;
      case 0x6000:
        this.V[x] = kk;
        this.PC += 2;
        console.log('6xkk: LD Vx, kk ', kk.toString(16));
        break;
      case 0x7000:
        this.V[x] += kk;
        this.PC += 2;
        console.log('7xkk: ADD Vx, kk', kk.toString(16));
        break;
      case 0x8000:
        switch (n) {
          case 0x0:
            this.V[x] = this.V[y];
            this.PC += 2;
            console.log('8xy0: LD Vx, Vy');
            break;
          case 0x1:
            this.V[x] |= this.V[y];
            this.PC += 2;
            console.log('8xy1: OR Vx, Vy');
            break;
          case 0x2:
            this.V[x] &= this.V[y];
            this.PC += 2;
            console.log('8x02: AND Vx, Vy');
            break;
          case 0x3:
            this.V[x] ^= this.V[y];
            this.PC += 2;
            console.log('8xy3: XOR Vx, Vy');
            break;
          case 0x4:
            this.V[x] += this.V[y];
            if (this.V[x] > 255) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.PC += 2;
            console.log('8xy4: ADD Vx, Vy');
            break;
          case 0x5:
            if (this.V[x] > this.V[y]) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.V[x] -= this.V[y];
            this.PC += 2;
            console.log('8xy5: SUB Vx, Vy');
            break;
          case 0x6:
            if ((this.V[x] & 0x1) === 1) {
              this.V[15] = 1;
            }
            this.V[x] >>= 1;
            this.PC += 2;
            console.log('8xy6: SHR Vx {, Vy}');
            break;
          case 0x7:
            if (this.V[y] > this.V[x]) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.V[x] = this.V[y] - this.V[x];
            this.PC += 2;
            console.log('8xy7: SUBN Vx, Vy');
            break;
          case 0xe:
            if (this.V[x] >> 7 === 1) {
              this.V[15] = 1;
            } else {
              this.V[15] = 0;
            }
            this.V[x] <<= 1;
            this.PC += 2;
            console.log('8xyE: SHL Vx {, Vy}');
            break;
          default:
            console.log('INVALID OPCODE REEEEEEEEEEEEEEE (its fine)');
            break;
        }
        break;
      case 0x9000:
        if (this.V[x] !== this.V[y]) {
          this.PC += 4;
        } else {
          this.PC += 2;
        }
        console.log('9xy0: SNE Vx, Vy');
        break;
      case 0xa000:
        this.I = nnn;
        this.PC += 2;
        console.log('Annn: LD I, nnn ', nnn.toString(16), this.I.toString(16));
        break;
      case 0xb000:
        this.PC = nnn + this.V[0];
        console.log('Bnnn: JP V0, nnn');
        break;
      case 0xc000:
        let rand = Math.random() * 255;
        this.V[x] = rand & kk;
        this.PC += 2;
        console.log('Cxkk: RND Vx, kk');
        break;
      case 0xd000:
        this.V[0xf] = 0;
        for (let row = 0; row < n; row++) {
          const spriteRow = this.memory[this.I + row];

          for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
            const bit = spriteRow & (0b10000000 >> bitIndex);

            if (!bit) continue;

            const targetX = (this.V[x] + bitIndex) % 64;
            const targetY = (this.V[y] + row) % 32;
            const displayPosition = targetX + targetY * 64;

            if (this.display[displayPosition] !== 0) {
              this.V[0xf] = 0x1;
            }

            this.display[displayPosition] ^= 1;
          }
        }
        this.drawFlag = true;
        this.PC += 2;
        console.log('Dxyn: DRW Vx, Vy, nibble ', n.toString(16));
        break;
      case 0xe000:
        if (kk === 0x9e) {
          // TODO
          if (this.keys[this.V[x]] === 1) {
            this.PC += 4;
          } else {
            this.PC += 2;
          }
          console.log('Ex9E: SKP Vx');
        } else if (kk === 0xa1) {
          // TODO
          if (this.keys[this.V[x]] === 0) {
            this.PC += 4;
          } else {
            this.PC += 2;
          }
          console.log('ExA1: SKNP Vx');
        }
        break;
      case 0xf000:
        switch (kk) {
          case 0x07:
            this.V[x] = this.DT;
            this.PC += 2;
            console.log('Fx07: LD Vx, DT');
            break;
          case 0x0a:
            if (this.keyPressed() === false) {
              return;
            }
            this.PC += 2;
            console.log('Fx0A: LD Vx, K');
            break;
          case 0x15:
            this.DT = this.V[x];
            this.PC += 2;
            console.log('Fx15: LD DT, Vx');
            break;
          case 0x18:
            this.ST = this.V[x];
            this.PC += 2;
            console.log('Fx18: LD St, Vx');
            break;
          case 0x1e:
            this.I += this.V[x];
            this.PC += 2;
            console.log('Fx1E: ADD I, Vx');
            break;
          case 0x29:
            this.I = this.V[x] * 0x5;
            this.PC += 2;
            console.log('Fx29: LD F, Vx');
            break;
          case 0x33:
            this.memory[this.I] = Math.floor(this.V[x] / 100) % 10;
            this.memory[this.I + 1] = Math.floor(this.V[x] / 10) % 10;
            this.memory[this.I + 2] = this.V[x] % 10;
            this.PC += 2;
            console.log('Fx33: LD B, Vx');
            break;
          case 0x55:
            for (let i = 0; i <= x; i++) {
              this.memory[this.I] = this.V[i];
              this.I = (this.I + 1) & 0xffff;
            }
            this.PC += 2;
            console.log('Fx55: LD [I], Vx');
            break;
          case 0x65:
            for (let i = 0; i <= x; i++) {
              this.V[i] = this.memory[this.I];
              this.I = (this.I + 1) & 0xffff;
            }
            this.PC += 2;
            console.log('Fx65: LD Vx, [I]');
            break;
          default:
            console.log('INVALID OPCODE', opcode.toString(16));
            break;
        }
        break;
      default:
        console.log('INVALID OPCODE', opcode.toString(16));
    }
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

  getLoaded() {
    return this.loaded;
  }

  setLoaded(val: boolean) {
    this.loaded = val;
  }
}
