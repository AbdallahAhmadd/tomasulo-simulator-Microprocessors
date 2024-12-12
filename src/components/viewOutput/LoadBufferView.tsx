import { useState, useEffect } from "react";
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
  const [rows, setRows] = useState<
    {
      opcode: string;
      tag: string;
      busy: number;
      address: number;
      timeRemaining: number;
    }[]
  >([]);
  useEffect(() => {
    if (loadbuffer) {
      const formattedRows = loadbuffer.map((buffer: LoadBuffer) => ({
        opcode: buffer.op,
        tag: buffer.tag,
        busy: buffer.busy ? 1 : 0,
        address: buffer.address,
        timeRemaining: buffer.timeRemaining,
      }));
      setRows(formattedRows);
    }
  }, [loadbuffer]);

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
                Opcode
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Busy
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
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.tag}</TableCell>
                <TableCell align="center">{row.busy}</TableCell>
                <TableCell align="center">{row.opcode}</TableCell>
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
