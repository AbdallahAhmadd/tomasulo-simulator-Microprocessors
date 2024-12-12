import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import {CacheBlock} from "../../types";

  interface CacheViewProps {
    Cache: CacheBlock[];
  }
  
  const CacheView: React.FC<CacheViewProps> = ({ Cache }) => {
    const [rows, setRows] = useState<
        {
            tag: number;
            valid: boolean;
            dirty: boolean;
            data: number[];
        }[]
      >([]);
        useEffect(() => {
          if (Cache) {
            const formattedRows = Cache.map((station: CacheBlock) => ({
                tag: station.tag,
                valid: station.valid,
                dirty: station.dirty,
                data: station.data,
              }));
              setRows(formattedRows);
          }
      }, [Cache]);
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
              <TableCell align="center" colSpan={5} sx={headerCellStyle}>
                Cache Blocks
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
              <TableCell align="center" sx={headerCellStyle}>
                Data
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Cache?.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{index}</TableCell>
                <TableCell align="center">{row.tag}</TableCell>
                <TableCell align="center">{row.valid ? "1" : "0"}</TableCell>
                <TableCell align="center">{row.dirty ? "1" : "0"}</TableCell>
                <TableCell align="center">{row.data.join("")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default CacheView;
  