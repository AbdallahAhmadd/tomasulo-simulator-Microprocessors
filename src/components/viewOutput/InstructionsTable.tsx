import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { instructionEntry } from "../../types";

interface InstructionTableProps {
  instructions: instructionEntry[];
  clockCycle: number;
}
export const InstructionTable: React.FC<InstructionTableProps> = ({ instructions, clockCycle }) => {
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
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              Instruction
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              i
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              j
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              k
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              Issue
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              Execution Complete
            </TableCell>
            <TableCell align="center" sx={{ backgroundColor: "#ccc", fontWeight: "bold" }}>
              Write Result
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructions.map((instructionEntry, index) => {
            let formattedExecution = instructionEntry.start_execution
              ? instructionEntry.start_execution + "..."
              : "";
            formattedExecution +=
              instructionEntry.end_execution && clockCycle >= instructionEntry.end_execution
                ? instructionEntry.end_execution
                : "";
            return (
              <TableRow key={index}>
                <TableCell align="center">{instructionEntry.instruction.opcode}</TableCell>
                <TableCell align="center">{instructionEntry.instruction.rd}</TableCell>
                <TableCell align="center">{instructionEntry.instruction.rs}</TableCell>
                <TableCell align="center">{instructionEntry.instruction.rt}</TableCell>
                <TableCell align="center">{instructionEntry.issue}</TableCell>
                <TableCell align="center">{formattedExecution}</TableCell>
                <TableCell align="center">{instructionEntry.writeResult}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
