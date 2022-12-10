import { readFileSync } from "fs";

class Dissasembler {
  constructor() {}

  fetch(left: number, right: number) {
    let opcode = new Uint16Array(1);
    opcode[0] = left;
    opcode[0] <<= 8;
    opcode[0] |= right;
    return opcode;
  }

  dump() {
    let input = readFileSync(`${process.cwd()}/src/roms/IBM.ch8`);
    // let cool = Buffer.alloc(4096);

    // for (let i = 0; i < input.length; i += 2) {
    //   console.log(input[i].toString(16) + input[i + 1].toString(16));
    // }
    for (let i = 0; i < input.length; i += 2) {
      let opcode = this.fetch(input[i], input[i + 1]);
      // let nnn = new Uint16Array([(opcode[0] >> 0) & 0x0fff]);
      let n = new Uint8Array([opcode[0] & 0xf]);
      // let x = new Uint8Array([(opcode[0] >> 8) & 0xf]);
      let kk = new Uint8Array([(opcode[0] >> 0) & 0xff]);

      switch (opcode[0] & 0xf000) {
        case 0x0000:
          if (opcode[0] === 0x00e0) {
            console.log("0x00E0: CLS");
          } else if (opcode[0] === 0x00ee) {
            console.log("0x00EE: RET");
          }
          break;
        case 0x1000:
          console.log("1nnn: JP nnn");
          break;
        case 0x2000:
          console.log("2nnn: Call nnn");
          break;
        case 0x3000:
          console.log("3xkk: SE Vx, kk");
          break;
        case 0x4000:
          console.log("4xkk: SNE Vx, kk");
          break;
        case 0x5000:
          console.log("5xy0: Se Vx, Vy");
          break;
        case 0x6000:
          console.log("6xkk: LD Vx, kk");
          break;
        case 0x7000:
          console.log("7xkk: ADD Vx, kk");
          break;
        case 0x8000:
          switch (n[0]) {
            case 0x0:
              console.log("8xy0: LD Vx, Vy");
              break;
            case 0x1:
              console.log("8xy1: OR Vx, Vy");
              break;
            case 0x2:
              console.log("8x02: AND Vx, Vy");
              break;
            case 0x3:
              console.log("8xy3: XOR Vx, Vy");
              break;
            case 0x4:
              console.log("8xy4: ADD Vx, Vy");
              break;
            case 0x5:
              console.log("8xy5: SUB Vx, Vy");
              break;
            case 0x6:
              console.log("8xy6: SHR Vx {, Vy}");
              break;
            case 0x7:
              console.log("8xy7: SUBN Vx, Vy");
              break;
            case 0xe:
              console.log("8xyE: SHL Vx {, Vy}");
              break;
            default:
              console.log("INVALID OPCODE REEEEEEEEEEEEEEE (its fine)");
              break;
          }
          break;
        case 0x9000:
          console.log("9xy0: SNE Vx, Vy");
          break;
        case 0xa000:
          console.log("Annn: LD I, nnn");
          break;
        case 0xb000:
          console.log("Bnnn: JP V0, nnn");
          break;
        case 0xc000:
          console.log("Cxkk: RND Vx, kk");
          break;
        case 0xd000:
          console.log("Dxyn: DRW Vx, Vy, nibble");
          break;
        case 0xe000:
          if (kk[0] === 0x9e) {
            console.log("Ex9E: SKP Vx");
          } else if (kk[0] === 0xa1) {
            console.log("ExA1: SKNP Vx");
          }
          break;
        case 0xf000:
          console.log("F000: A few of them");
          break;
        default:
          console.log("False flag");
      }
    }
  }
}

let test = new Dissasembler();
test.dump();
