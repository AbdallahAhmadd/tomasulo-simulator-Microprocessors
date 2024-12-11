import React, { useState } from "react";
import { latencies } from "../../types";
import { Instructions } from "../../enums";
interface InstructionLatenciesProps {
  onSave: (latencies: latencies) => void;
}

const InstructionLatencies: React.FC<InstructionLatenciesProps> = ({ onSave }) => {
  const [latencies, setLatencies] = useState<Record<string, number>>(
    Object.fromEntries(Object.values(Instructions).map((instr) => [instr, 0])),
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
      DADDI: latencies[Instructions.DADDI] || 0,
      DSUBI: latencies[Instructions.DSUBI] || 0,
      ADD_D: latencies[Instructions.ADD_D] || 0,
      ADD_S: latencies[Instructions.ADD_S] || 0,
      SUB_D: latencies[Instructions.SUB_D] || 0,
      SUB_S: latencies[Instructions.SUB_S] || 0,
      MUL_D: latencies[Instructions.MUL_D] || 0,
      MUL_S: latencies[Instructions.MUL_S] || 0,
      DIV_D: latencies[Instructions.DIV_D] || 0,
      DIV_S: latencies[Instructions.DIV_S] || 0,
      LW: latencies[Instructions.LW] || 0,
      LD: latencies[Instructions.LD] || 0,
      L_S: latencies[Instructions.L_S] || 0,
      L_D: latencies[Instructions.L_D] || 0,
      SW: latencies[Instructions.SW] || 0,
      SD: latencies[Instructions.SD] || 0,
      S_S: latencies[Instructions.S_S] || 0,
      S_D: latencies[Instructions.S_D] || 0,
      BNE: latencies[Instructions.BNE] || 0,
      BEQ: latencies[Instructions.BEQ] || 0,
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
        {Object.values(Instructions).map((instr) => (
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
