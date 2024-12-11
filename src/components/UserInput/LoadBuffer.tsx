import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { LoadBuffer } from "../../types";

export default function LoadBufferTable({
  loadBuffers,
}: {
  loadBuffers: LoadBuffer[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Load Buffer Table">
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
              Time Remaining
            </TableCell>
            <TableCell
              align="center"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Name
            </TableCell>
            <TableCell
              align="center"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Busy
            </TableCell>
            <TableCell
              align="center"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Address
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {loadBuffers.map((loadBuffer, index) => (
            <TableRow key={index}>
              <TableCell align="center">{loadBuffer.timeRemaining}</TableCell>
              <TableCell align="center">{"L" + (index + 1)}</TableCell>
              <TableCell align="center">
                {loadBuffer.busy ? "Yes" : "No"}
              </TableCell>
              <TableCell align="center">{loadBuffer.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
