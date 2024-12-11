import React, { useState } from 'react';
import {Cache} from '../../hardwareComponents/Cache'; // Import the Cache class
import './UserInput.css'
import { toast } from 'react-toastify';

interface CacheInputProps {
    onSave: (cacheSize: number, blockSize: number) => void;
}

const CacheInput: React.FC<CacheInputProps> = ({ onSave }) => {
    const [cacheSize, setCacheSize] = useState<number>(0);
    const [blockSize, setBlockSize] = useState<number>(0);
    const [cacheInfo, setCacheInfo] = useState<{ cacheSize: number, blockSize: number, numberOfBlocks: number } | null>(null); // Store cache info
    //const [cache, setCache] = useState<Cache | null>(null);


    const handleCreateCache = () => {
        if ((cacheSize > 0 && blockSize > 0) && !(blockSize >= cacheSize)) {
            //const newCache = new Cache(cacheSize, blockSize);
            //setCache(newCache);
            const numberOfBlocks = Math.floor(cacheSize / blockSize);
            setCacheInfo({ cacheSize, blockSize, numberOfBlocks }); // Store cache info
            onSave(cacheSize, blockSize);
            toast.success('Cache successfully created!');
        } else {
            toast.error('Please enter valid positive values for cache size and block size.');
        }
    };

    return (
        <div className='container'>
            <h2 className='header'>Cache Configuration</h2>
            <div className='form'>
            <div >
                <label>
                    Cache Size (bytes):
                    <input
                        type="number"
                        value={cacheSize}
                        onChange={(e) => setCacheSize(Number(e.target.value))}
                        min="1"
                    />
                </label>
            </div>
            <div>
                <label>
                    Block Size (bytes):
                    <input
                        type="number"
                        value={blockSize}
                        onChange={(e) => setBlockSize(Number(e.target.value))}
                        min="1"
                    />
                </label>
            </div>
            <button onClick={handleCreateCache}>Create Cache</button>
            </div>

            {cacheInfo && (
                <div className='cache-info-container'>
                    <h3>Cache Created</h3>
                    <p>Cache Size: {cacheSize} bytes</p>
                    <p>Block Size: {blockSize} bytes</p>
                    <p>Number of Blocks: {cacheSize / blockSize}</p>
                </div>
            )}
        </div>
    );
};

export default CacheInput;
