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
    let count = 0;

    for (let i = 0; i < input.length; i += 2) {
      count++;
      let opcode = this.fetch(input[i], input[i + 1]);
      // console.log(opcode[0].toString(16));
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
          console.log("8000: A bunch of options");
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
          console.log("E000: A few of them");
          break;
        case 0xf000:
          console.log("F000: A few of them");
          break;
        default:
          console.log("Invalid Opcode");
      }
    }

    console.log(count, input.length / 2);
  }
}

let test = new Dissasembler();
test.dump();
