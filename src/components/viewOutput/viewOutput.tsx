import React from 'react';
import { SystemState } from '../../types';
import { ReservationStationView } from './ReservationStation';
import { InstructionTable } from './InstructionsTable';
import { IntReservationStationView } from './IntReservationStationView';
import { LoadBufferView } from './LoadBufferView';
import { StoreBufferView } from './StoreBufferView';
import CacheView from './CacheView';
import { RegisterFile } from './RegFile';
import { MemoryView } from './memoryView';

interface viewOutputProps {
  systemState: SystemState;
}

export const ViewOutput: React.FC<viewOutputProps> = ({ systemState }) => {
  return (
    <div className="view-output">
      <div className="cycle-info">
        <h1>Cycle: {systemState.clockCycle}</h1>
      </div>
      <div className="section">
        <h2>Instructions:</h2>  
        <InstructionTable instructions={systemState.instructionTable} />
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
        <h2>Integer Multiplication Reservation Stations:</h2>
        <IntReservationStationView reservationstation={systemState.intMulReservationStations} />
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
        <CacheView Cache={systemState.cache.block} />
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
