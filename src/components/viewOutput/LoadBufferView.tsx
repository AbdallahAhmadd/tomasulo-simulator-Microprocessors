import { LoadBuffer } from "../../types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface LoadBufferProps {
  loadbuffer: LoadBuffer[];
}

export const LoadBufferView: React.FC<LoadBufferProps> = ({ loadbuffer }) => {
  return (
    <div>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Dynamic Table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Tag
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Busy
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Opcode
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Address
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Time Remaining
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadbuffer.map((buffer, index) => (
              <TableRow key={index}>
                <TableCell align="center">{buffer.tag}</TableCell>
                <TableCell align="center">{buffer.busy ? 1 : 0}</TableCell>
                <TableCell align="center">{buffer.op}</TableCell>
                <TableCell align="center">{buffer.address}</TableCell>
                <TableCell align="center">{buffer.timeRemaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
