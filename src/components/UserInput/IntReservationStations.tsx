import React, { useState } from 'react';
import "./UserInput.css";
import { toast } from "react-toastify";

interface IntReservationStationInputProps {
    onSave: (addSize: number, mulSize: number) => void;
}

const IntReservationStationInput: React.FC<IntReservationStationInputProps> = ({ onSave }) => {
    const [intAddReservationStationsNums, setIntAddReservationStationsNums] = useState<number>(0);
    const [intMulReservationStationsNums, setIntMulReservationStationsNums] = useState<number>(0);

    const handleSaveReservationStations = () => {
        if (intAddReservationStationsNums > 0 && intMulReservationStationsNums > 0) {
            onSave(intAddReservationStationsNums, intMulReservationStationsNums);
            toast.success("Integer reservation station sizes successfully saved!");
        } else {
            toast.error("Please enter valid positive sizes for the reservation stations.");
        }
    };

    return (
        <div className="container">
            <h2 className="header">Integer Reservation Station Configuration</h2>
            <div className="form">
                <div>
                    <label>
                        Add Reservation Station Size for int:
                        <input
                            type="number"
                            value={intAddReservationStationsNums}
                            onChange={(e) => setIntAddReservationStationsNums(Number(e.target.value))}
                            min="1"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Multiply Reservation Station Size for int:
                        <input
                            type="number"
                            value={intMulReservationStationsNums}
                            onChange={(e) => setIntMulReservationStationsNums(Number(e.target.value))}
                            min="1"
                        />
                    </label>
                </div>
                <button onClick={handleSaveReservationStations}>Save Sizes</button>
            </div>
        </div>
    );
};

export default IntReservationStationInput;
