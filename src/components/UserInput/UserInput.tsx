import React, { useState } from "react";
import AddressInput from "./AddressInput";
import OpcodeList from "./OpcodeList";
import F_Input from "./F_Input";
import R_Input from "./R_Input";
import './UserInput.css'
import { toast } from "react-toastify";


// Define types for the instruction fields
interface Instruction {
  opcode: string;
  address: string;
  registerR1: string;
  registerR2: string;
  registerR3: string;
  registerF1: string;
  registerF2: string;
  registerF3: string;
}

const UserInput: React.FC = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState<Instruction>({
    opcode: "",
    address: "",
    registerR1: "",
    registerR2: "",
    registerR3: "",
    registerF1: "",
    registerF2: "",
    registerF3: "",
  });

  
  // Function to handle adding an instruction
  const handleAddInstruction = () => {
    const { opcode, address, registerR1, registerR2, registerR3, registerF1, registerF2, registerF3 } = currentInstruction;

    // Validation
    if (!opcode) {
      toast.error("Please select an opcode.");
      return;
    }
    
    if (isLoadOrStoreInstruction(opcode)) {
      // Load/Store instructions need an address and one register (either R1 or F1)
      if (!address) {
        toast.error("Address is required for Load/Store instructions.");
        return;
      }
      if (isFloatingPointInstruction(opcode) && !registerF1) {
        toast.error("A floating-point register (F1) is required for Load/Store instructions.");
        return;
      }
      if (isIntegerInstruction(opcode) && !registerR1) {
        toast.error("An integer register (R1) is required for Load/Store instructions.");
        return;
      }
    }
    
    if (isIntegerInstruction(opcode) && !isLoadOrStoreInstruction(opcode)) {
      // Integer instructions need R1 and may need R2 and R3
      if (!registerR1) {
        toast.error("At least one integer register (R1) is required.");
        return;
      }
      if (!["BNE", "BEQ"].includes(opcode) && !registerR2) {
        toast.error("A second integer register (R2) is required.");
        return;
      }
      if (!["BNE", "BEQ"].includes(opcode) && !registerR3) {
        toast.error("A third integer register (R3) is required for ALU operations.");
        return;
      }
    }
    
    if (isFloatingPointInstruction(opcode)) {
      // Floating-point instructions need F1 and may need F2 and F3
      if (!registerF1 ) {
        toast.error("At least one floating-point register (F1) is required.");
        return;
      }
      if (isLoadOrStoreInstruction(opcode)) { 
        // Load/Store instructions need an address and one register (either F1 or R1)
        if (!address) {
          toast.error("Address is required for Load/Store instructions.");
          return;
        }
        if (isIntegerInstruction(opcode) &&!registerR1) {
          toast.error("An integer register (R1) is required for Load/Store instructions.");
          return;
        }
      }
      else{
        // ALU instructions need F1 and may need F2 and F3
        if (!registerF1) {
          toast.error("At least one floating-point register (F1) is required.");
          return;
        }
        if (!["ADD", "SUB", "MUL", "DIV"].includes(opcode) &&!registerF2) {
          toast.error("A second floating-point register (F2) is required.");
          return;
        }
        if (!["ADD", "SUB", "MUL", "DIV"].includes(opcode) &&!registerF3) {
          toast.error("A third floating-point register (F3) is required for floating-point operations.");
          return;
        }
      }
      
    }
    
    if (["BNE", "BEQ"].includes(opcode)) {
      // Branch instructions need R1, R2, and an address
      if (!registerR1 || !registerR2 || !address) {
        toast.error("Both source registers (R1, R2) and an address are required for branch instructions.");
        return;
      }
    }
    
    // Check for duplicate instructions
    if (instructions.some((instr) => JSON.stringify(instr) === JSON.stringify(currentInstruction))) {
      toast.error("This instruction has already been added.");
      return;
    }
    
    // If all validations pass, clear error and add instruction
    setInstructions((prev) => [...prev, currentInstruction]);
    setCurrentInstruction({
      opcode: "",
      address: "",
      registerR1: "",
      registerR2: "",
      registerR3: "",
      registerF1: "",
      registerF2: "",
      registerF3: "",
    }); 
  };

  const handleStartExecution = () => {
    console.log("Executing instructions:", instructions);
  };

  const updateCurrentInstruction = (field: keyof Instruction, value: string) => {
    setCurrentInstruction((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isLoadOrStoreInstruction = (opcode: string) => {
    return ["LW", "LD", "L.S", "L.D", "SW", "SD", "S.D", "S.S"].includes(opcode);
  };

  const isIntegerInstruction = (opcode: string) => {
    return [
      "DADDI", "DSUBI", "LW", "LD", "SW", "SD", "BNE", "BEQ",
    ].includes(opcode);
  };

  const isFloatingPointInstruction = (opcode: string) => {
    return [
      "ADD.D", "ADD.S", "SUB.D", "SUB.S", "MUL.D", "MUL.S", "DIV.D", "DIV.S",
      "L.S", "L.D", "S.S", "S.D"
    ].includes(opcode);
  };

  // Function to format the instruction for display
  const formatInstruction = (instr: Instruction) => {
    const { opcode, address, registerR1, registerR2, registerR3, registerF1, registerF2, registerF3 } = instr;

    if (isLoadOrStoreInstruction(opcode)) {
      // For Load/Store instructions, we need one register and an address
      return `${opcode} ${isFloatingPointInstruction(opcode) ? registerF1 : registerR1}, ${address}`;
    }

    if (isIntegerInstruction(opcode)) {
      if (opcode === "BNE" || opcode === "BEQ") {
        return `${opcode} ${registerR1}, ${registerR2}, ${address}`;
      }
      return `${opcode} ${registerR1}, ${registerR2}, ${registerR3}`;
    }

    if (isFloatingPointInstruction(opcode)) {
      return `${opcode} ${registerF1}, ${registerF2}, ${registerF3}`;
    }

    return "";
  };

  return (
    <div className="container">
      <h1 className="header">Instruction Manager</h1>

      <div>
        <h2 className="sub-header">Add Instruction</h2>

        <div className="form">
        <OpcodeList
          value={currentInstruction.opcode}
          onChange={(e) => updateCurrentInstruction("opcode", e.target.value)}
        />

          {isLoadOrStoreInstruction(currentInstruction.opcode) ? (
            <>
              {/* For Load and Store instructions, we need one register and an address */}
              {isFloatingPointInstruction(currentInstruction.opcode) ? (
                <F_Input
                  label="1"
                  value={currentInstruction.registerF1} // Controlled value
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateCurrentInstruction("registerF1", e.target.value)
                  }
                />
              ) : (
            <R_Input
              label="1"
              value={currentInstruction.registerR1} // Controlled value
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                updateCurrentInstruction("registerR1", e.target.value)
              }
            />
              )}
              <AddressInput
                value={currentInstruction.address} // Controlled value
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateCurrentInstruction("address", e.target.value)
                }
              />
            </>
          ) : (
            <>
              {/* For ALU and other instructions, we need two source registers and one destination register */}
              {isFloatingPointInstruction(currentInstruction.opcode) ? (
                <>
                  <F_Input
                    label="1"
                    value = {currentInstruction.registerF1}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateCurrentInstruction("registerF1", e.target.value)
                    }
                  />
                  <F_Input
                    label="2"
                    value={currentInstruction.registerF2} // Controlled value
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateCurrentInstruction("registerF2", e.target.value)
                    }
                  />
                  <F_Input
                    label="3"
                    value={currentInstruction.registerF3} // Controlled value
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateCurrentInstruction("registerF3", e.target.value)
                    }
                  />
                </>
              ) : isIntegerInstruction(currentInstruction.opcode) && !["BNE", "BEQ"].includes(currentInstruction.opcode) ? (
                <>
              <R_Input
                label="1"
                value={currentInstruction.registerR1} // Controlled value
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateCurrentInstruction("registerR1", e.target.value)
                }
              />
              <R_Input
                label="2"
                value={currentInstruction.registerR2} // Controlled value
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateCurrentInstruction("registerR2", e.target.value)
                }
             />
              <R_Input
                label="3"
                value={currentInstruction.registerR3} // Controlled value
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateCurrentInstruction("registerR3", e.target.value)
                }
              />
                </>
              ) : (
                <>
                  {/* For BNE and BEQ, we need two source registers and one address (branch target) */}
                <R_Input
                  label="1"
                  value={currentInstruction.registerR1} // Controlled value
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateCurrentInstruction("registerR1", e.target.value)
                  }
                />
                <R_Input
                  label="2"
                  value={currentInstruction.registerR2} // Controlled value
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateCurrentInstruction("registerR2", e.target.value)
                  }
                />
                  <AddressInput
                    value={currentInstruction.address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCurrentInstruction("address", e.target.value)
                    }
                  />
                </>
              )}
            </>
          )}

          <button onClick={handleAddInstruction}>Add Instruction</button>
        </div>
      </div>

      <div>
        <h2 className="sub-header">Instructions to Execute</h2>
        <ul>
          {instructions.map((instr, idx) => (
            <li key={idx}>
              {formatInstruction(instr)}
            </li>
          ))}
        </ul>
        <button className= "execute" onClick={handleStartExecution}>Start Execution</button>
      </div>
    </div>
  );
};

export default UserInput;
