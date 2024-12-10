import { useState } from "react";
import VisuallyHiddenInput from "@mui/material/VisuallyHiddenInput"; // Add this line if VisuallyHiddenInput is a part of MUI
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

export default function ReservationStation() {
  const [rows, setRows] = useState<
    {
      busy: string;
      op: string;
      vi: string;
      vk: string;
      qi: string;
      qk: string;
      a: string;
    }[]
  >([]);
  const [rowCount, setRowCount] = useState(0);

  //toDo remove input field and take input from user once
  interface Row {
    busy: string;
    op: string;
    vi: string;
    vk: string;
    qi: string;
    qk: string;
    a: string;
  }

  const handleRowCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowCount(Number(event.target.value));
  };

  const generateRows = () => {
    const newRows = Array.from({ length: rowCount }, () => ({
      busy: "0",
      op: "",
      vi: "",
      vk: "",
      qi: "",
      qk: "",
      a: "",
    }));
    setRows(newRows);
  };

  return (
    <div>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={(event) => console.log(event.target.files)}
          multiple
        />
      </Button>

      {/* Input for number of rows */}
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <TextField
          type="number"
          label="Number of Rows"
          variant="outlined"
          value={rowCount}
          onChange={handleRowCountChange}
          sx={{ width: "200px" }}
        />
        <Button variant="contained" onClick={generateRows}>
          Generate Rows
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Dynamic Table">
          <TableHead>
            <TableRow>
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
                op
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                vi
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                Vk
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                Qi
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                Qk
              </TableCell>
              <TableCell
                align="center"
                sx={{ backgroundColor: "#000", color: "#fff" }}
              >
                A
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.busy}</TableCell>
                <TableCell align="center">{row.op}</TableCell>
                <TableCell align="center">{row.vi}</TableCell>
                <TableCell align="center">{row.vk}</TableCell>
                <TableCell align="center">{row.qi}</TableCell>
                <TableCell align="center">{row.qk}</TableCell>
                <TableCell align="center">{row.a}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
