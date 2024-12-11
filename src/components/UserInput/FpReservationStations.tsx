import React, { useState } from 'react';
import "./UserInput.css";
import { toast } from "react-toastify";

interface FpReservationStationInputProps {
    onSave: (addSize: number, mulSize: number) => void;
}

const FpReservationStationInput: React.FC<FpReservationStationInputProps> = ({onSave}) => {
    const [fpAddReservationStationsNums, setfpAddReservationStationsNums] = useState<number>(0);
    const [fpMulReservationStationsNums, setfpMulReservationStationsNums] = useState<number>(0);
  const handleSaveReservationStations = () => {
    if (fpAddReservationStationsNums > 0 && fpMulReservationStationsNums > 0) {
      onSave(fpAddReservationStationsNums, fpMulReservationStationsNums);
      toast.success("Reservation station sizes successfully saved!");
    } else {
      toast.error("Please enter valid positive sizes for the reservation stations.");
    }
  };

  return (
    <div className="container">
      <h2 className="header">FP Reservation Station Configuration</h2>
      <div className="form">
        <div>
          <label>
            Add Reservation Station Size for fp:
            <input
              type="number"
              value={fpAddReservationStationsNums}
              onChange={(e) => setfpAddReservationStationsNums(Number(e.target.value))}
              min="1"
            />
          </label>
        </div>
        <div>
          <label>
            Multiply Reservation Station Size for fp:
            <input
              type="number"
              value={fpMulReservationStationsNums}
              onChange={(e) => setfpMulReservationStationsNums(Number(e.target.value))}
              min="1"
            />
          </label>
        </div>
        <button onClick={handleSaveReservationStations}>Save Sizes</button>
      </div>
    </div>
  );
};

export default FpReservationStationInput;
