import { ReservationStation } from "../../types";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface ReservationStationProps {
  reservationstation: ReservationStation[];
}

export const ReservationStationView: React.FC<ReservationStationProps> = ({
  reservationstation,
}) => {
  return (
    <div>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Reservation Stations">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Tag
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Busy
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Op
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Vj
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Vk
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Qj
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Qk
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                A
              </TableCell>
              <TableCell align="center" sx={{ backgroundColor: "#000", color: "#fff" }}>
                Time Remaining
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservationstation.map((station, index) => (
              <TableRow key={index}>
                <TableCell align="center">{station.tag}</TableCell>
                <TableCell align="center">{station.busy ? 1 : 0}</TableCell>
                <TableCell align="center">{station.op}</TableCell>
                <TableCell align="center">{station.vj}</TableCell>
                <TableCell align="center">{station.vk}</TableCell>
                <TableCell align="center">{station.qj}</TableCell>
                <TableCell align="center">{station.qk}</TableCell>
                <TableCell align="center">{station.A}</TableCell>
                <TableCell align="center">{station.timeRemaining}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
