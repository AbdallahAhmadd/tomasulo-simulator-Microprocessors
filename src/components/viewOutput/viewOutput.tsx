import React from 'react'
import {SystemState } from '../../types'
import { ReservationStationView } from './ReservationStation'
import { InstructionTable } from './InstructionsTable'
import { IntReservationStationView } from './IntReservationStationView'
import { LoadBufferView } from './LoadBufferView'
import { StoreBufferView } from './StoreBufferView'
import CacheView from './CacheView'
import { RegisterFile } from './RegFile'

interface viewOutputProps {
  systemState: SystemState  
}

export const viewOutput: React.FC<viewOutputProps> = ({ systemState }) => {
  
  return (
    <div>
      <div>
        <h1>Cycle: {systemState.clockCycle}</h1>
      </div>
      <div>
        <InstructionTable instructions = {systemState.instructionTable} />
      </div>
      <div>
        <ReservationStationView reservationstation = {systemState.fpAddReservationStations} />
      </div>
      <div>
        <ReservationStationView reservationstation = {systemState.fpMulReservationStations} />
      </div>
      <div>
        <IntReservationStationView reservationstation = {systemState.intAddReservationStations} />
      </div>
      <div>
        <IntReservationStationView reservationstation = {systemState.intMulReservationStations} />
      </div>
      <div>
         <LoadBufferView loadbuffer = {systemState.loadBuffer}/>
      </div>
      <div>
        <StoreBufferView storebuffer = {systemState.storeBuffer}/>
      </div>
      <div>
        <CacheView Cache = {systemState.cache.block}/>
      </div>
      <div>
        {/*add memory*/}
      </div>
      <div>
        <RegisterFile registerFile= {systemState.fpRegisterFile}/>
      </div>
      <div>
        <RegisterFile registerFile= {systemState.intRegisterFile}/>
      </div>
      <div>
        <h2> notes: {systemState.notes} </h2>
      </div>


      
    </div>
  )
}

export default viewOutput
