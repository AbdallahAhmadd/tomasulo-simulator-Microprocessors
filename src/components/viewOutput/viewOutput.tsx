import React from "react";
import { SystemState } from "../../types";
import { ReservationStationView } from "./ReservationStation";
import { InstructionTable } from "./InstructionsTable";
import { IntReservationStationView } from "./IntReservationStationView";
import { LoadBufferView } from "./LoadBufferView";
import { StoreBufferView } from "./StoreBufferView";
import CacheView from "./CacheView";
import { RegisterFile } from "./RegFile";
import { MemoryView } from "./memoryView";
import InstructionQueue from "./InstructionQueue";
import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface viewOutputProps {
  systemState: SystemState;
  instructionQueue?: string[];
  clockCycle: number;
  onForwardClick: () => void;
}

export const ViewOutput: React.FC<viewOutputProps> = ({
  systemState,
  instructionQueue = [],
  onForwardClick,
  clockCycle,
}) => {
  console.log(systemState);
  return (
    <div className="view-output">
      <h3>Clock Cycle</h3>
      <Button
        variant="contained"
        onClick={onForwardClick}
        endIcon={<ArrowForwardIcon />}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: 150, // Adjust for consistent button size
          padding: "8px 16px",
          fontSize: "16px",
        }}
      >
        {clockCycle}
      </Button>
      <div className="cycle-info">
        <h1>Cycle: {systemState.clockCycle}</h1>
      </div>
      <div className="section">
        <h2>Instruction Queue:</h2>
        <InstructionQueue instructionQueue={instructionQueue} />
      </div>
      <div className="section">
        <h2>Instruction Table:</h2>
        <InstructionTable
          instructions={systemState.instructionTable}
          clkCycle={systemState.clockCycle}
        />
      </div>
      <div className="section">
        <h2>Floating Point Addition Reservation Stations:</h2>
        <ReservationStationView reservationstation={systemState.fpAddReservationStations} />
      </div>
      <div className="section">
        <h2>Floating Point Multiplication Reservation Stations:</h2>
        <ReservationStationView reservationstation={systemState.fpMulReservationStations} />
      </div>
      <div className="section">
        <h2>Integer Addition Reservation Stations:</h2>
        <IntReservationStationView reservationstation={systemState.intAddReservationStations} />
      </div>
      <div className="section">
        <h2>Load Buffer:</h2>
        <LoadBufferView loadbuffer={systemState.loadBuffer} />
      </div>
      <div className="section">
        <h2>Store Buffer:</h2>
        <StoreBufferView storebuffer={systemState.storeBuffer} />
      </div>
      <div className="section">
        <h2>Cache:</h2>
        {/* <CacheView
          Cache={systemState.cache.getCache()}
          blockSize={systemState.cache.getBlockSize()}
        /> */}
      </div>
      <div className="section">
        <h2>Memory:</h2>
        <MemoryView memory={systemState.memory} />
      </div>
      <div className="section">
        <h2>Floating Point Register File:</h2>
        <RegisterFile registerFile={systemState.fpRegisterFile} />
      </div>
      <div className="section">
        <h2>Integer Register File:</h2>
        <RegisterFile registerFile={systemState.intRegisterFile} />
      </div>
      <div className="notes">
        <h2>Notes: {systemState.notes}</h2>
      </div>
    </div>
  );
};
