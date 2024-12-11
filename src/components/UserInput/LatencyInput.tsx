import React, { useState } from "react";
import { latencies } from "../../types";
const instructions = [
  "DADDI",
  "DSUBI",
  "ADD.D",
  "ADD.S",
  "SUB.D",
  "SUB.S",
  "MUL.D",
  "MUL.S",
  "DIV.D",
  "DIV.S",
  "LW",
  "LD",
  "L.S",
  "L.D",
  "SW",
  "SD",
  "S.S",
  "S.D",
  "BNE",
  "BEQ",
];

interface FileUploaderProps {
  onSave: (latencies: latencies) => void;
}

const InstructionLatencies: React.FC<FileUploaderProps> = ({ onSave }) => {
  const [latencies, setLatencies] = useState<Record<string, number>>(
    Object.fromEntries(instructions.map((instr) => [instr, 0])),
  );
  const [isDisabled, setIsDisabled] = useState(false);

  const handleInputChange = (instruction: string, value: string) => {
    const newLatency = parseInt(value, 10);
    if (!isNaN(newLatency)) {
      setLatencies({ ...latencies, [instruction]: newLatency });
    }
  };

  const handleSubmit = () => {
    setIsDisabled(true);

    const formattedLatencies: latencies = {
      DADDI: latencies["DADDI"] || 0,
      DSUBI: latencies["DSUBI"] || 0,
      ADD_D: latencies["ADD.D"] || 0,
      ADD_S: latencies["ADD.S"] || 0,
      SUB_D: latencies["SUB.D"] || 0,
      SUB_S: latencies["SUB.S"] || 0,
      MUL_D: latencies["MUL.D"] || 0,
      MUL_S: latencies["MUL.S"] || 0,
      DIV_D: latencies["DIV.D"] || 0,
      DIV_S: latencies["DIV.S"] || 0,
      LW: latencies["LW"] || 0,
      LD: latencies["LD"] || 0,
      L_S: latencies["L.S"] || 0,
      L_D: latencies["L.D"] || 0,
      SW: latencies["SW"] || 0,
      SD: latencies["SD"] || 0,
      S_S: latencies["S.S"] || 0,
      S_D: latencies["S.D"] || 0,
      BNE: latencies["BNE"] || 0,
      BEQ: latencies["BEQ"] || 0,
    };
    onSave(formattedLatencies);
  };

  const handleEdit = () => {
    setIsDisabled(false);
  };

  return (
    <div className="latency-container">
      <h1>Instruction Latencies</h1>
      <form>
        {instructions.map((instr) => (
          <div key={instr} className="input-group">
            <label htmlFor={instr}>{instr}</label>
            <input
              id={instr}
              type="number"
              min="0"
              value={latencies[instr]}
              onChange={(e) => handleInputChange(instr, e.target.value)}
              disabled={isDisabled}
            />
          </div>
        ))}
        {!isDisabled ? (
          <button type="button" onClick={handleSubmit}>
            Submit Latencies
          </button>
        ) : (
          <button type="button" onClick={handleEdit}>
            Edit Latencies
          </button>
        )}
      </form>
      <style>{`
        .latency-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
          padding: 20px;
          width: 20%;
          margin: auto;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          color: #333;
        }

        .input-group {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .input-group label {
          display: flex;
          justify-content: center;
          font-size: 14px;
          margin-right: 10px;
          width: 150px;
          text-align: right;
        }

        .input-group input {
          width: 100px;
          padding: 5px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007BFF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default InstructionLatencies;
