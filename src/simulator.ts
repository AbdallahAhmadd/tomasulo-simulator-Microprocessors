import { SystemConfig, SystemState } from "./types";
import {
  initializeAddStations,
  initializeLoadBuffer,
  initializeMulStations,
  initializeRegisterFile,
  initializeStoreBuffer,
  parseInstructions,
} from "./helpers";
import { DMappedCache } from "./hardwareComponents/Cache";
import { Memory } from "./hardwareComponents/Memory";
import { issueInstruction } from "./Issue";
import { execute } from "./Execution";
import { writeBack } from "./WriteBack";

export function initializeSystem(instructionQueue: string[], config: SystemConfig): SystemState {
  const {
    fpAddReservationStationsSize,
    fpMulReservationStationsSize,
    intAddReservationStationsSize,
    intMulReservationStationsSize,
    fpRegisterFileSize,
    intRegisterFileSize,
    loadBufferSize,
    storeBufferSize,
    cacheSize,
    blockSize,
    latencies,
  } = config;
  return {
    instructionQueue: parseInstructions(instructionQueue),
    fpAddReservationStations: initializeAddStations(fpAddReservationStationsSize),
    fpMulReservationStations: initializeMulStations(fpMulReservationStationsSize),
    intAddReservationStations: initializeAddStations(intAddReservationStationsSize),
    intMulReservationStations: initializeMulStations(intMulReservationStationsSize),
    loadBuffer: initializeLoadBuffer(loadBufferSize),
    storeBuffer: initializeStoreBuffer(storeBufferSize),
    fpRegisterFile: initializeRegisterFile(fpRegisterFileSize, "F"),
    intRegisterFile: initializeRegisterFile(intRegisterFileSize, "R"),
    latencies: latencies,
    memory: new Memory(1024),
    cache: new DMappedCache(cacheSize, blockSize),
    CDB: { tag: "", value: 0 },
    instructionTable: [],
    clockCycle: 0,
    pc: 0,
    notes: [],
  };
}

export function nextSystemState(systemState: SystemState): SystemState {
  const newState: SystemState = { ...systemState };

  newState.notes = [];
  newState.clockCycle++;

  issueInstruction(newState);

  execute(newState);

  //   writeBack(newState);

  console.log(newState);

  return newState;
}
