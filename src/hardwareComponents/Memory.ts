export class Memory {
  private memory: Uint8Array;

  constructor(memorySize: number) {
    this.memory = new Uint8Array(memorySize);
  }

  public read(address: number, bytesNumber: number): number {
    if (address < 0 || address + bytesNumber > this.memory.length) {
      throw new Error(`Invalid address or bytesNumber out of range.`);
    }

    let result = 0;
    for (let i = 0; i < bytesNumber; i++) {
      result = (result << 8) | this.memory[address + i];
    }

    return result;
  }

  public write(address: number, data: number, bytesNumber: number): void {
    if (address < 0 || address + bytesNumber > this.memory.length) {
      throw new Error(`Invalid address or bytesNumber out of range.`);
    }

    for (let i = bytesNumber - 1; i >= 0; i--) {
      this.memory[address + i] = data & 0xff; // Extract the lowest 8 bits
      data >>= 8; // Shift right to process the next byte
    }
  }
}
