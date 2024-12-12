import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Memory } from "../../hardwareComponents/Memory";

interface MemoryProps {
  memory: Memory;
}

interface MemoryRow {
  address: number;
  value: string;
}

export const MemoryView: React.FC<MemoryProps> = ({ memory }) => {
  const [rows, setRows] = useState<MemoryRow[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true); // State to track if rows are collapsed

  useEffect(() => {
    const memoryRows: MemoryRow[] = [];

    for (let address = 0; address < memory["memory"].length; address++) {
      memoryRows.push({
        address,
        value: memory["memory"][address].toString(2).padStart(8, "0"),
      });
    }

    setRows(memoryRows);
  }, [memory]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapse state
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Memory Table">
        <TableHead>
          <TableRow>
            <TableCell>
              <IconButton aria-label="expand/collapse rows" size="small" onClick={toggleCollapse}>
                {isCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
              </IconButton>
            </TableCell>
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
          {rows.slice(0, isCollapsed ? 4 : rows.length).map((row) => (
            <TableRow key={row.address}>
              <TableCell />
              <TableCell align="center">{row.address}</TableCell>
              <TableCell align="center">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
