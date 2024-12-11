export class Memory {
  private memory: string[];

  constructor(memorySize: number) {
    const numWords = Math.floor(memorySize / 8);
    this.memory = new Array(numWords).fill("00000000");
  }

  public read(address: number, bytesNumber: number): number {
    if (bytesNumber <= 0) {
      throw new Error(
        `Invalid bytesNumber: ${bytesNumber}. Must be greater than 0.`
      );
    }

    if (bytesNumber === 2 && address % 2 !== 0) {
      // Half word (2 bytes)
      throw new Error(
        `Address ${address} is not aligned for half word access.`
      );
    } else if (bytesNumber === 4 && address % 4 !== 0) {
      // Word (4 bytes)
      throw new Error(`Address ${address} is not aligned for word access.`);
    } else if (bytesNumber === 8 && address % 8 !== 0) {
      // Double word (8 bytes)
      throw new Error(
        `Address ${address} is not aligned for double word access.`
      );
    }
    const binaryValue = this.memory
      .slice(address, address + bytesNumber)
      .join("");

    return parseInt(binaryValue, 2);
  }

  public write(address: number, data: number, bytesNumber: number): void {
    if (bytesNumber <= 0) {
      throw new Error(
        `Invalid bytesNumber: ${bytesNumber}. Must be greater than 0.`
      );
    }

    if (bytesNumber === 2 && address % 2 !== 0) {
      // Half word (2 bytes)
      throw new Error(
        `Address ${address} is not aligned for half word access.`
      );
    } else if (bytesNumber === 4 && address % 4 !== 0) {
      // Word (4 bytes)
      throw new Error(`Address ${address} is not aligned for word access.`);
    } else if (bytesNumber === 8 && address % 8 !== 0) {
      // Double word (8 bytes)
      throw new Error(
        `Address ${address} is not aligned for double word access.`
      );
    }

    const binaryInputData = data.toString(2).padStart(bytesNumber * 8, "0");

    for (let i = 0; i < bytesNumber; i++) {
      const startBit = i * 8;
      const endBit = startBit + 8;
      this.memory[address + i] = binaryInputData.slice(startBit, endBit);
    }
  }
}
