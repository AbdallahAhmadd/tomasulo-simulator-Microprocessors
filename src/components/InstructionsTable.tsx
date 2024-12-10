import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const data = [
  { instruction: "L.D", j: "F6", k: "32", issue: "R2", exec: "", write: "" },
  { instruction: "L.D", j: "F2", k: "44", issue: "R3", exec: "", write: "" },
  { instruction: "MUL.D", j: "F0", k: "F2", issue: "F4", exec: "", write: "" },
  { instruction: "SUB.D", j: "F8", k: "F6", issue: "F2", exec: "", write: "" },
  { instruction: "DIV.D", j: "F10", k: "F0", issue: "F6", exec: "", write: "" },
  { instruction: "ADD.D", j: "F6", k: "F8", issue: "F2", exec: "", write: "" },
];

export default function InstructionTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Instruction Table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              colSpan={3}
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
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.instruction}</TableCell>
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
}
