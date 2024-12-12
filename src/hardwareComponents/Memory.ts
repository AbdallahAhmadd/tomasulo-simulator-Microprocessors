export class Memory {
  private memory: Uint8Array;
  private dataView: DataView;

  constructor(memorySize: number) {
    this.memory = new Uint8Array(memorySize);
    this.dataView = new DataView(this.memory.buffer);
  }

  public read(address: number, bytesNumber: number, fp: boolean): number {
    if (address < 0 || address + bytesNumber > this.memory.length) {
      throw new Error(`Invalid address or bytesNumber out of range.`);
    }
    if (fp) {
      if (bytesNumber === 8) {
        return this.dataView.getFloat64(address, true);
      } else {
        return this.dataView.getFloat32(address, true);
      }
    } else {
      let result = 0;
      for (let i = 0; i < bytesNumber; i++) {
        result = (result << 8) | this.memory[address + i];
      }
      return result;
    }
  }

  public write(address: number, data: number, bytesNumber: number, fp: boolean): void {
    if (address < 0 || address + bytesNumber > this.memory.length) {
      throw new Error(`Invalid address or bytesNumber out of range.`);
    }

    if (fp) {
      if (bytesNumber === 8) {
        this.dataView.setFloat64(address, data, true);
      } else {
        this.dataView.setFloat32(address, data, true);
      }
    } else {
      for (let i = bytesNumber - 1; i >= 0; i--) {
        this.memory[address + i] = data & 0xff; // Extract the lowest 8 bits
        data >>= 8; // Shift right to process the next byte
      }
    }
  }

  public getMemory(): Uint8Array {
    return this.memory;
  }
}
