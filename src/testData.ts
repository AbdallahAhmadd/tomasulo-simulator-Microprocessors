import { parseInstructions } from './helpers';

const testInstructions = [
  "DADDI R1 R1 24",
  "DADDI R2 R2, 0",
  "LOOP:L.D F0, R1",
  "MUL.D F4 F0, F2",
  "S.D F4 R1",
  "BNE R1 R2 LOOP",
  "ADD.D F1 F2 F3",
  "END:DSUBI R3 R3 10",
  "DADDI R4 R4 1",
  "BNE R4 R3 END",
  "DADDI R5 R5 1",
  "BNE R5 R3 END",
  
];

const result = parseInstructions(testInstructions);
console.log(result);
