import { SystemConfig, SystemState } from "./types";
import {
  initializeAddStations,
  initializeLoadBuffer,
  initializeMulStations,
  initializeRegisterFile,
  initializeStoreBuffer,
  parseInstructions,
} from "./helpers.ts";
import { DMappedCache } from "./hardwareComponents/Cache.ts";
import { Memory } from "./hardwareComponents/Memory.ts";
import { issueInstruction } from "./Issue.ts";
import { execute } from "./Execution.ts";
import { writeBack } from "./WriteBack.ts";

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
  const newState = structuredClone(systemState);

  newState.notes = [];
  newState.clockCycle++;

  issueInstruction(newState);

  execute(newState);

  writeBack(newState);

  console.log(newState);

  return newState;
}
