import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import {instructionEntry } from "../../types";
import { useEffect, useState } from "react";


interface InstructionTableProps{
  instructions: instructionEntry[];
}
export const InstructionTable: React.FC<InstructionTableProps> = ({ instructions }) => {
  const [rows, setRows] = useState<
    {
      opcode: string;
      rd: string;
      j: string;
      k: string;
      issue?: number;
      exec?: string;
      write?: number;
    }[]
  >([]);

  // Map instruction type to determine how to populate j, k
  useEffect(() => {
    if (instructions) {
      const formattedRows = instructions.map((inst: instructionEntry) => {
        let j = "";
        let k = "";

        // Logic to set j, k, and rd based on opcode type
        switch (inst.instruction.opcode) {
          case "LW":
          case "LD":
          case "L.S":
          case "L.D":
            j = inst.instruction.rs;
            k = inst.instruction.labelAddress || "0"; 
            break;
          case "SW":
          case "SD":
          case "S.S":
          case "S.D":
            j = inst.instruction.rs; 
            k = inst.instruction.labelAddress || "0"; 
            break;
          case "DADDI":
          case "DSUBI":
            j = inst.instruction.rs; // Source register
            k = inst.instruction.labelAddress || "Immediate"; 
            break;
          case "ADD.D":
          case "ADD.S":
          case "SUB.D":
          case "SUB.S":
          case "MUL.D":
          case "MUL.S":
          case "DIV.D":
          case "DIV.S":
            j = inst.instruction.rs;
            k = inst.instruction.rt;
            break;
          case "BNE":
          case "BEQ":
            j = inst.instruction.rs; 
            k = inst.instruction.rt; 
            break;
          default:
            break;
        }

        return {
          opcode: inst.instruction.opcode,
          rd: inst.instruction.rd,
          j,
          k,
          issue: inst.issue, 
          exec: inst.execution_complete, 
          write: inst.writeResult, 
        };
      });

      setRows(formattedRows);
    }
  }, [instructions]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Instruction Table">
        <TableHead>
          {/* First row with merged headers */}
          <TableRow>
            <TableCell
              align="center"
              colSpan={2}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Instruction
            </TableCell>
            <TableCell
              align="center"
              colSpan={1}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              j
            </TableCell>
            <TableCell
              align="center"
              colSpan={1}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              k
            </TableCell>
            <TableCell
              align="center"
              colSpan={1}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Issue
            </TableCell>
            <TableCell
              align="center"
              colSpan={1}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Execution Complete
            </TableCell>
            <TableCell
              align="center"
              colSpan={1}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Write Result
            </TableCell>
          </TableRow>
          {/* Second row with sub-headers */}
          <TableRow>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              Instruction
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              i
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              j
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              k
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              Issue
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              Execution Complete
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}
            >
              Write Result
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.opcode}</TableCell>
              <TableCell align="center">{row.rd}</TableCell>
              <TableCell align="center">{row.j}</TableCell>
              <TableCell align="center">{row.k}</TableCell>
              <TableCell align="center">{row.issue}</TableCell>
              <TableCell align="center">{row.exec}</TableCell>
              <TableCell align="center">{row.write}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
