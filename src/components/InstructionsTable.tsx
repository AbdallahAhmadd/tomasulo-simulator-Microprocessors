import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const data = [
  { instruction: "L.D", i: "R2", j: "F6", k: "32", issue: "", exec: "", write: "" },
  { instruction: "L.D", i: "R3", j: "F2", k: "44", issue: "", exec: "", write: "" },
  { instruction: "MUL.D", i: "F4", j: "F0", k: "F2", issue: "", exec: "", write: "" },
  { instruction: "SUB.D", i: "F2", j: "F8", k: "F6", issue: "", exec: "", write: "" },
  { instruction: "DIV.D", i: "F6", j: "F10", k: "F0", issue: "", exec: "", write: "" },
  { instruction: "ADD.D", i: "F2", j: "F6", k: "F8", issue: "", exec: "", write: "" },
];

export default function InstructionTable() {
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
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="center">{row.instruction}</TableCell>
              <TableCell align="center">{row.i}</TableCell>
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