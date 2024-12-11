import React, { useState } from 'react';
import { toast } from "react-toastify";

interface BufferInputProps {
  onSave: (loadSize: number, storeSize: number) => void;
}
const BufferConfiguration: React.FC <BufferInputProps> = ({onSave}) => {
  const [loadBufferSize, setLoadBufferSize] = useState<number>(0);
  const [storeBufferSize, setStoreBufferSize] = useState<number>(0);

  const handleBufferSizeSave = () => {
    if (loadBufferSize > 0 && storeBufferSize > 0) {
      toast.success('Buffer sizes saved successfully.');
      onSave(loadBufferSize, storeBufferSize);
    } else {
      toast.error('Please enter a valid positive size for the buffer.');
    }

  };

  return (
    <div className='container'>
      <h2 className='header'>Buffer Configuration</h2>
      <div className='form'>
        <div>
        <label>
          Load Buffer Size:
          <input
            type="number"
            value={loadBufferSize}
            onChange={(e) => setLoadBufferSize(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
        <div>
        <label>
          Store Buffer Size:
          <input
            type="number"
            value={storeBufferSize}
            onChange={(e) => setStoreBufferSize(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <button onClick={handleBufferSizeSave}>Save Buffer Sizes</button>
    </div>
    </div>
  );
};

export default BufferConfiguration;
