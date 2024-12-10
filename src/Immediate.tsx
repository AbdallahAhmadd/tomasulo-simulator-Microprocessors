import React, { useState } from "react";


type Immediate = { 
    op: string; 
    rs: String;
    rt: String;
    immediate: number;
}


const [instructions, setInstructions] = useState<Immediate[]>([]); 

  const [op, setOp] = useState<string>(""); 
  const [rs, setRs] = useState<string>(""); 
  const [rt, setRt] = useState<string>(""); 
  const [immediate, setImmediate] = useState<number>(0); 
  const [result, setResult] = useState<number>(0); 

  const functionality = (instruction: Immediate): number => {
    const { op, immediate } = instruction;
    switch (op) {
      case "DADDI":
        return result + immediate;
      case "DSUBI":
        return result - immediate;
      default:
        throw new Error("Unsupported operation");
    }
  };

export default Immediate;
