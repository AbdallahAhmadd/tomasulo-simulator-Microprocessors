import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { registerFileEntry } from "../../types";

export default function RegisterFileTable({
  registerFileEntries,
}: {
  registerFileEntries: registerFileEntry[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Register File Table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Register Name
            </TableCell>
            <TableCell
              align="center"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Q (Tag)
            </TableCell>
            <TableCell
              align="center"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Value
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {registerFileEntries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell align="center">{entry.registerName}</TableCell>
              <TableCell align="center">{entry.Q}</TableCell>
              <TableCell align="center">{entry.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
