import React from "react";

interface AddressInputProps {
  value: string; // Controlled value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label>Address:</label>
      <input
        type="text"
        placeholder="Enter Address"
        value={value} // Controlled by the parent
        onChange={onChange} // Updates the parent state
      />
    </div>
  );
};

export default AddressInput;
