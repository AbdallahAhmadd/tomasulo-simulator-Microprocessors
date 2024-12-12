import { Memory } from "./Memory";
interface block {
  dirty: boolean;
  valid: boolean;
  tag: string;
  data: Uint8Array;
}

export class DMappedCache {
  private cache: block[];
  private cacheSize: number;
  private blockSize: number;

  constructor(cacheSize: number, blockSize: number) {
    if (cacheSize <= 0 || blockSize <= 0 || cacheSize % blockSize !== 0) {
      throw new Error(
        "Invalid cache size or block size. Cache size must be a multiple of block size.",
      );
    }

    this.cacheSize = cacheSize;
    this.blockSize = blockSize;
    const numBlocks = Math.floor(cacheSize / blockSize);

    this.cache = Array.from({ length: numBlocks }, () => ({
      dirty: false,
      valid: false,
      tag: "",
      data: new Uint8Array(blockSize),
    }));
  }

  public read(address: number, bytesNumber: number, memory: Memory): number {
    if (bytesNumber <= 0) {
      throw new Error(`Invalid bytesNumber: ${bytesNumber}. Must be greater than 0.`);
    }

    if (bytesNumber === 2 && address % 2 !== 0) {
      // Half word (2 bytes)
      throw new Error(`Address ${address} is not aligned for half word access.`);
    } else if (bytesNumber === 4 && address % 4 !== 0) {
      // Word (4 bytes)
      throw new Error(`Address ${address} is not aligned for word access.`);
    } else if (bytesNumber === 8 && address % 8 !== 0) {
      // Double word (8 bytes)
      throw new Error(`Address ${address} is not aligned for double word access.`);
    }

    const binaryAddress = address.toString(2).padStart(10, "0");

    const { index, tag, offset } = this.decodeCacheAddress(binaryAddress);

    const decimalIndex = parseInt(index, 2);
    const block = this.cache[decimalIndex];

    if (block.valid && block.tag === tag) {
      const decimalOffset = parseInt(offset, 2);
      const readBytes = block.data.slice(decimalOffset, decimalOffset + bytesNumber);

      return readBytes.reduce((acc, byte, idx) => acc + (byte << (8 * (bytesNumber - idx - 1))), 0);
    } else {
      for (let i = 0; i < this.blockSize; i++) {
        block.data[i] = memory.read(address + i, 1);
      }
      block.tag = tag;
      block.valid = true;
      throw new Error(`Cache miss for address: ${address}.`);
    }
  }

  private decodeCacheAddress(binaryAddress: string) {
    const offsetBits = Math.log2(this.blockSize);
    const indexBits = Math.log2(Math.floor(this.cacheSize / this.blockSize));
    const tagBits = 10 - offsetBits - indexBits;
    const tag = binaryAddress.slice(0, tagBits);
    const index = binaryAddress.slice(tagBits, tagBits + indexBits);
    const offset = binaryAddress.slice(tagBits + indexBits);
    return { index, tag, offset };
  }

  public write(address: number, data: number, bytesNumber: number): void {
    if (bytesNumber <= 0) {
      throw new Error(`Invalid bytesNumber: ${bytesNumber}. Must be greater than 0.`);
    }

    if (bytesNumber === 2 && address % 2 !== 0) {
      // Half word (2 bytes)
      throw new Error(`Address ${address} is not aligned for half word access.`);
    } else if (bytesNumber === 4 && address % 4 !== 0) {
      // Word (4 bytes)
      throw new Error(`Address ${address} is not aligned for word access.`);
    } else if (bytesNumber === 8 && address % 8 !== 0) {
      // Double word (8 bytes)
      throw new Error(`Address ${address} is not aligned for double word access.`);
    }

    const binaryAddress = address.toString(2).padStart(10, "0");

    const { index, tag, offset } = this.decodeCacheAddress(binaryAddress);

    const decimalIndex = parseInt(index, 2);
    const block = this.cache[decimalIndex];

    if (!block.valid || block.tag !== tag) {
      block.valid = true;
      block.tag = tag;
    }

    const decimalOffset = parseInt(offset, 2);
    for (let i = 0; i < bytesNumber; i++) {
      block.data[decimalOffset + i] = (data >> (8 * (bytesNumber - i - 1))) & 0xff;
    }

    block.dirty = true;
  }
}
