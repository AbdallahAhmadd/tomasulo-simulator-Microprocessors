import React from 'react';

interface OpcodeListProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Type for the onChange prop
}

const OpcodeList: React.FC<OpcodeListProps> = ({ value, onChange }) => {
  return (
    <div >
      <label>Opcode:</label>
      <select value={value} onChange={onChange}>
        <option value="" disabled selected>Select an operation</option>
        <option value="DADDI">DADDI</option>
        <option value="DSUBI">DSUBI</option>
        <option value="ADD.D">ADD.D</option>
        <option value="ADD.S">ADD.S</option>
        <option value="SUB.D">SUB.D</option>
        <option value="SUB.S">SUB.S</option>
        <option value="MUL.D">MUL.D</option>
        <option value="MUL.S">MUL.S</option>
        <option value="DIV.D">DIV.D</option>
        <option value="DIV.S">DIV.S</option>
        <option value="LW">LW</option>
        <option value="LD">LD</option>
        <option value="L.S">L.S</option>
        <option value="L.D">L.D</option>
        <option value="SW">SW</option>
        <option value="SD">SD</option>
        <option value="S.S">S.S</option>
        <option value="S.D">S.D</option>
        <option value="BNE">BNE</option>
        <option value="BEQ">BEQ</option>
      </select>
    </div>
  );
};

export default OpcodeList;
