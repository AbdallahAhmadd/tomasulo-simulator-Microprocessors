import { SystemConfig, SystemState } from "./types";
import {
  initializeLoadBuffer,
  initializeRegisterFile,
  initializeReservationStations,
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
    fpAddReservationStations: initializeReservationStations(fpAddReservationStationsSize, "A"),
    fpMulReservationStations: initializeReservationStations(fpMulReservationStationsSize, "M"),
    intAddReservationStations: initializeReservationStations(intAddReservationStationsSize, "I"),
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
    cacheMissLatency: 0,
  };
}

export function nextSystemState(systemState: SystemState): SystemState {
  const newState: SystemState = { ...systemState };

  newState.notes = [];
  newState.clockCycle++;

  if (newState.cacheMissLatency > 0) {
    newState.cacheMissLatency--;
  }

  console.log("Clock Cycle", newState.clockCycle);

  issueInstruction(newState);

  console.log("State after issuing", newState);

  execute(newState);

  console.log("State after executing", newState);

  writeBack(newState);

  console.log(newState);

  return newState;
}
