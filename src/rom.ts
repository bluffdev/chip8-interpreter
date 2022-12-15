export default class Rom {
  private roms: Array<Uint8Array>;
  private romNames: Array<string>;

  constructor() {
    this.roms = new Array();
    this.romNames = new Array();
  }

  readExistingRom() {
    let request = new XMLHttpRequest();

    request.onload = () => {
      if (request.response) {
        this.roms.push(new Uint8Array(request.response));
        this.romNames.push('');
      }
    };

    request.open('GET', 'IBM.ch8');
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
