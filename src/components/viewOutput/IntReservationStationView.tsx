import { useState, useEffect } from "react";
import { intReservationStation } from "../../types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

interface ReservationStationProps {
    reservationstation: intReservationStation[];
  
}


export const IntReservationStationView: React.FC<ReservationStationProps> = ({ reservationstation }) => {
  const [rows, setRows] = useState<
    {
        tag: string;
        busy: string;
        value: number;
        v: number;
        q: string;
        timeRemaining: number;
    }[]
  >([]);
  useEffect(() => {
    if (reservationstation) {
      const formattedRows = reservationstation.map((station: intReservationStation) => ({
            tag: station.tag,
            busy: station.busy ? "1 " : "0",
            value: station.value,
            v: station.v, 
            q: station.q,
            timeRemaining: station.timeRemaining,
        }));
        setRows(formattedRows);
    }
}, [reservationstation]);
  
  

  return (
    <div>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Dynamic Table">
          <TableHead>
            <TableRow>
            <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                time remaining
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                tag
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                busy
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                value
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                v
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                Q
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.timeRemaining}</TableCell>
                <TableCell align="center">{row.tag}</TableCell>

                <TableCell align="center">{row.busy}</TableCell>
                <TableCell align="center">{row.value}</TableCell>
                <TableCell align="center">{row.v}</TableCell>
                <TableCell align="center">{row.q}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
