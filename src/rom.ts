export default class Rom {
  private roms: Array<Uint8Array>;
  private romNames: Array<string>;

  constructor() {
    this.roms = new Array();
    this.romNames = new Array();
  }

  readRomInput(rom: any) {
    let reader = new FileReader() as FileReader;
    reader.onload = () => {
      this.roms.push(new Uint8Array(reader.result as ArrayBuffer));
      this.romNames.push('');
    };
    reader.readAsArrayBuffer(rom);
  }

  readExistingRom() {
    let request = new XMLHttpRequest();

    request.onload = () => {
      if (request.response) {
        this.roms.push(new Uint8Array(request.response));
        this.romNames.push('');
      }
    };

    request.open('GET', 'src/roms/' + 'IBM.ch8');
    request.responseType = 'arraybuffer';

    request.send();
  }

  getIBMRom() {
    return this.roms[0];
  }

  getRomsLength() {
    return this.roms.length;
  }
}
