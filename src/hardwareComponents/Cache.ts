// working with addresses in bytes each address has 1 byte (4 bits)

interface block {
    dirty: boolean;
    valid: boolean;
    tag: number;
    data: number[];
    decimalData: number;
}

export class Cache {
    private cache: block[];
    private cacheSize: number;
    private blockSize: number;
    
    constructor(cacheSize: number, blockSize: number) {
        if (cacheSize <= 0 || blockSize <= 0 || cacheSize % blockSize !== 0) {
            throw new Error('Invalid cache size or block size. Cache size must be a multiple of block size.');
        }

        this.cacheSize = cacheSize;
        this.blockSize = blockSize;
        const numBlocks = Math.floor (cacheSize / blockSize);

        this.cache = Array.from({ length: numBlocks }, () => ({
            dirty: false,
            valid: false,
            tag: -1,
            data: new Array(blockSize).fill(0),
        }));
    }
    private getBlockNumber(address: number): number {
        return Math.floor(address / this.blockSize) % this.cache.length;
    }
    public getBlock(address: number): block {
        const blockNumber = Math.floor(address / this.blockSize);
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        return this.cache[blockNumber];
    }
    public writeBlock(blockNumber: number, data: number[]): void {
        this.cache[blockNumber].data = data;
        this.cache[blockNumber].dirty = true;
    }        
    public isHit(address: number): boolean {
        const blockNumber = this.getBlockNumber(address);
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        const block = this.cache[blockNumber];
        const tag = Math.floor(address / this.blockSize);
        return block.valid && block.tag === tag;
    }
    public isMiss(address: number): boolean {
        return !this.isHit(address);
    }
    public getDirtyBit(blockNumber: number): boolean {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        return this.cache[blockNumber].dirty;
    }
    public setDirtyBit(blockNumber: number, value: boolean): void {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        this.cache[blockNumber].dirty = value;
    }
    public getValidBit(blockNumber: number): boolean {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        return this.cache[blockNumber].valid;
    }
    public setValidBit(blockNumber: number, value: boolean): void {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        this.cache[blockNumber].valid = value;
    }
    public getTag(blockNumber: number): number {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        return this.cache[blockNumber].tag;
    }
    public setTag(blockNumber: number, value: number): void {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        this.cache[blockNumber].tag = value;
    }
    public getData(blockNumber: number): number[] {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        return this.cache[blockNumber].data;
    }
    public setData(blockNumber: number, data: number[]): void {
        if (blockNumber < 0 || blockNumber >= this.cache.length) {
            throw new Error(`Invalid block number: ${blockNumber}.`);
        }
        this.cache[blockNumber].data = data;
    }
   

}