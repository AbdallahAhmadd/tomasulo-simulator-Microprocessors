import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useEffect } from "react";
import { block } from "../../hardwareComponents/Cache";

interface CacheViewProps {
  Cache: block[];
  blockSize: number;
  missPenalty: number;
}

const CacheView: React.FC<CacheViewProps> = ({ Cache, blockSize, missPenalty }) => {
  const [cache, setCache] = React.useState<block[]>([]);

  function deepCloneBlockArray(blocks: block[]): block[] {
    return blocks.map((block) => ({
      dirty: block.dirty,
      valid: block.valid,
      tag: block.tag,
      data: new Uint8Array(block.data),
      dataView: new DataView(block.data.buffer),
    }));
  }
  useEffect(() => {
    if (missPenalty == 0) {
      const clonedCache = deepCloneBlockArray(Cache);
      setCache(clonedCache);
    }
  }, [Cache, missPenalty]);
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
          {cache?.map((row, index) => {
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
