import { StoreBuffer } from "../../types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface StoreBufferprops {
  storebuffer: StoreBuffer[];
}

export const StoreBufferView: React.FC<StoreBufferprops> = ({ storebuffer }) => {
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
                Vj
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Qj
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Qk
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
            {storebuffer.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.tag}</TableCell>
                <TableCell align="center">{row.busy ? 1 : 0}</TableCell>
                <TableCell align="center">{row.v}</TableCell>
                <TableCell align="center">{row.qj}</TableCell>
                <TableCell align="center">{row.qk}</TableCell>
                <TableCell align="center">{row.address}</TableCell>
                <TableCell align="center">{row.timeRemaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
