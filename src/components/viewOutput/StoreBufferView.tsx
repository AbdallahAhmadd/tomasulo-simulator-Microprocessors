import { useState, useEffect } from "react";
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
  const [rows, setRows] = useState<
    {
      tag: string;
      busy: number;
      address: number;
      v: number;
      q: string;
      timeRemaining: number;
    }[]
  >([]);
  useEffect(() => {
    if (storebuffer) {
      const formattedRows = storebuffer.map((buffer: StoreBuffer) => ({
        tag: buffer.tag,
        busy: buffer.busy ? 1 : 0,
        address: buffer.address,
        v: buffer.v,
        q: buffer.q,
        timeRemaining: buffer.timeRemaining,
      }));
      setRows(formattedRows);
    }
  }, [storebuffer]);

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
                Address
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                V
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Q
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
                <TableCell align="center">{row.address}</TableCell>
                <TableCell align="center">{row.v}</TableCell>
                <TableCell align="center">{row.q}</TableCell>
                <TableCell align="center">{row.timeRemaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
