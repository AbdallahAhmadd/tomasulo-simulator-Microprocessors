import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React from "react";
import { block } from "../../hardwareComponents/Cache";

interface CacheViewProps {
  Cache: block[];
  blockSize: number;
}

const CacheView: React.FC<CacheViewProps> = ({ Cache, blockSize }) => {
  const headerCellStyle = {
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "bold",
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={4} sx={headerCellStyle}>
              Cache Blocks
            </TableCell>
            <TableCell align="center" colSpan={blockSize} sx={headerCellStyle}>
              Data
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" sx={headerCellStyle}>
              Block Index
            </TableCell>
            <TableCell align="center" sx={headerCellStyle}>
              Tag
            </TableCell>
            <TableCell align="center" sx={headerCellStyle}>
              Valid
            </TableCell>
            <TableCell align="center" sx={headerCellStyle}>
              Dirty
            </TableCell>
            {Array.from({ length: blockSize }, (_, i) => (
              <TableCell align="center" sx={headerCellStyle} key={i}>
                {i}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Cache?.map((row, index) => {
            return (
              <TableRow key={index}>
                <TableCell align="center">{index}</TableCell>
                <TableCell align="center">{row.tag}</TableCell>
                <TableCell align="center">{row.valid ? "1" : "0"}</TableCell>
                <TableCell align="center">{row.dirty ? "1" : "0"}</TableCell>
                {Array.from({ length: blockSize }, (_, i) => (
                  <TableCell align="center" key={i}>
                    {row.data[i]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CacheView;
