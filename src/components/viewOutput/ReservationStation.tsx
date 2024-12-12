import { useState, useEffect } from "react";
import { ReservationStation } from "../../types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

interface ReservationStationProps {
  reservationstation: ReservationStation[];
}

export const ReservationStationView: React.FC<ReservationStationProps> = ({
  reservationstation,
}) => {
  const [rows, setRows] = useState<
    {
      tag: string;
      busy: string;
      op: string;
      vj: number;
      vk: number;
      qj: string;
      qk: string;
      a: number;
      timeRemaining: number;
    }[]
  >([]);

  useEffect(() => {
    if (reservationstation) {
      const formattedRows = reservationstation.map((station: ReservationStation) => ({
        tag: station.tag,
        busy: station.busy ? "1 " : "0",
        op: station.op,
        vj: station.vj,
        vk: station.vk,
        qj: station.qj,
        qk: station.qk,
        a: station.A,
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
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                time remaining
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                tag
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                busy
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                op
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                vi
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Vk
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Qi
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Qk
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                A
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.timeRemaining}</TableCell>
                <TableCell align="center">{row.tag}</TableCell>
                <TableCell align="center">{row.busy}</TableCell>
                <TableCell align="center">{row.op}</TableCell>
                <TableCell align="center">{row.vj}</TableCell>
                <TableCell align="center">{row.vk}</TableCell>
                <TableCell align="center">{row.qj}</TableCell>
                <TableCell align="center">{row.qk}</TableCell>
                <TableCell align="center">{row.a}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
