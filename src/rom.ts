export default class Rom {
  private contents: Uint8Array;

  constructor() {
    this.contents = new Uint8Array();
  }

  async readExistingRom(name: string) {
    return await fetch(name, { method: 'GET' })
      .then((response) => response.arrayBuffer())
      .then((data) => (this.contents = new Uint8Array(data)))
      .catch((err) => console.error(err));
  }

  getContents() {
    return this.contents;
  }
}
