// working with addresses in bytes each address has 1 byte (4 bits)
interface block {
    dirty: boolean;
    valid: boolean;
    tag: string;
    data: string[];
}

export class DMappedCache {
    private cache: block[];
    private cacheSize: number;
    private blockSize: number;

    constructor(cacheSize: number, blockSize: number) {
        if (cacheSize <= 0 || blockSize <= 0 || cacheSize % blockSize !== 0) {
            throw new Error('Invalid cache size or block size. Cache size must be a multiple of block size.');
        }

        this.cacheSize = cacheSize;
        this.blockSize = blockSize;
        const numBlocks = Math.floor(cacheSize / blockSize);

        this.cache = Array.from({length: numBlocks}, () => ({
            dirty: false,
            valid: false,
            tag: "",
            data: new Array(blockSize).fill("00000000"),
        }));
    }

    public read(address: number, bytesNumber: number): number {
        if (bytesNumber <= 0) {
            throw new Error(`Invalid bytesNumber: ${bytesNumber}. Must be greater than 0.`);
        }

        if (bytesNumber === 2 && address % 2 !== 0) { // Half word (2 bytes)
            throw new Error(`Address ${address} is not aligned for half word access.`);
        } else if (bytesNumber === 4 && address % 4 !== 0) { // Word (4 bytes)
            throw new Error(`Address ${address} is not aligned for word access.`);
        } else if (bytesNumber === 8 && address % 8 !== 0) { // Double word (8 bytes)
            throw new Error(`Address ${address} is not aligned for double word access.`);
        }

        const binaryAddress = address.toString(2).padStart(7, '0');

        const offsetBits = Math.log2(this.blockSize);
        const indexBits = Math.log2(Math.floor(this.cacheSize / this.blockSize));
        const tagBits = 7 - offsetBits - indexBits;
        const tag = binaryAddress.slice(0, tagBits);
        const index = binaryAddress.slice(tagBits, tagBits + indexBits);
        const offset = binaryAddress.slice(tagBits + indexBits);

        const decimalIndex = parseInt(index, 2);
        const block = this.cache[decimalIndex];


        if (block.valid && block.tag === tag) {
            const decimalOffset = parseInt(offset, 2);
            const readBytes = block.data.slice(decimalOffset, decimalOffset + bytesNumber);

            const binaryValue = readBytes.join('');
            return parseInt(binaryValue, 2);
        } else {
            throw new Error(`Cache miss for address: ${address}.`);
        }
    }

    public write(address: number, data: number, bytesNumber: number): void {
        if (bytesNumber <= 0) {
            throw new Error(`Invalid bytesNumber: ${bytesNumber}. Must be greater than 0.`);
        }

        if (bytesNumber === 2 && address % 2 !== 0) { // Half word (2 bytes)
            throw new Error(`Address ${address} is not aligned for half word access.`);
        } else if (bytesNumber === 4 && address % 4 !== 0) { // Word (4 bytes)
            throw new Error(`Address ${address} is not aligned for word access.`);
        } else if (bytesNumber === 8 && address % 8 !== 0) { // Double word (8 bytes)
            throw new Error(`Address ${address} is not aligned for double word access.`);
        }

        const binaryAddress = address.toString(2).padStart(7, '0');

        const offsetBits = Math.log2(this.blockSize);
        const indexBits = Math.log2(Math.floor(this.cacheSize / this.blockSize));
        const tagBits = 7 - offsetBits - indexBits;
        const tag = binaryAddress.slice(0, tagBits);
        const index = binaryAddress.slice(tagBits, tagBits + indexBits);
        const offset = binaryAddress.slice(tagBits + indexBits);

        const decimalIndex = parseInt(index, 2);
        const block = this.cache[decimalIndex];

        if (!block.valid || block.tag !== tag) {
            block.valid = true;
            block.tag = tag;
        }

        const binaryInputData = data.toString(2).padStart(bytesNumber * 8, '0');

        const decimalOffset = parseInt(offset, 2);
        for (let i = 0; i < bytesNumber; i++) {
            block.data[decimalOffset + i] = binaryInputData.slice(i * 8, (i + 1) * 8);
        }

        block.dirty = true;
    }
}