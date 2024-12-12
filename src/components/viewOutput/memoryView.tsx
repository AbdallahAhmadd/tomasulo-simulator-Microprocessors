import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { Memory } from "../../hardwareComponents/Memory";

interface MemoryProps {
  memory: Memory;
}

export const MemoryView: React.FC<MemoryProps> = ({ memory }) => {
  const [rows, setRows] = useState<{ address: number; value: string }[]>([]);

  useEffect(() => {
    const memoryRows: { address: number; value: string }[] = [];

    for (let address = 0; address < memory["memory"].length; address++) {
      memoryRows.push({
        address,
        value: memory["memory"][address],
      });
    }

    setRows(memoryRows);
  }, [memory]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Memory Table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#000", color: "#fff", fontWeight: "bold" }}
            >
              Address
            </TableCell>
            <TableCell
              align="center"
              sx={{ backgroundColor: "#000", color: "#fff", fontWeight: "bold" }}
            >
              Value (Binary)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.address}>
              <TableCell align="center">{row.address}</TableCell>
              <TableCell align="center">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
