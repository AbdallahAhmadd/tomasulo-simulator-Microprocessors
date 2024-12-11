import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface RegisterFileConfigurationProps{
    onSave: (fpSize: number, intSize: number) => void;
}
const RegisterFileConfiguration: React.FC <RegisterFileConfigurationProps> = ({onSave}) => {
  const [fpRegisterFileSize, setfpRegisterFileSize] = useState<number>(0);
  const [intRegisterFileSize, setIntRegisterFileSize] = useState<number>(0);

  const handleRegisterFileSizeSave = () => {
    if (fpRegisterFileSize > 0 && intRegisterFileSize > 0) {
        onSave(fpRegisterFileSize, intRegisterFileSize);
        toast.success("Register file sizes successfully saved!");
    } else {
        toast.error("Please enter valid positive sizes for the register files.");
    }
  };

  return (
    <div className='container'>
      <h2 className='header'>Register File Configuration</h2>
      <div className='form'>
        <div>
        <label>
          FP Register File Size:
          <input
            type="number"
            value={fpRegisterFileSize}
            onChange={(e) => setfpRegisterFileSize(Number(e.target.value))}
            min="1"
          />
        </label>
        </div>
      <div>
        <label>
          INT Register File Size:
          <input
            type="number"
            value={intRegisterFileSize}
            onChange={(e) => setIntRegisterFileSize(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <button onClick={handleRegisterFileSizeSave}>Save Register File Sizes</button>
    </div>
    </div>
  );
};

export default RegisterFileConfiguration;
