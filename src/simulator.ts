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

  //   console.log("State after issuing", newState);

  execute(newState);

  //   console.log("State after executing", newState);

  writeBack(newState);

  console.log(newState);

  return newState;
}
/*
note for the next system state, I had two choices to implememt the order of the functions to be called:
    1. I can call the issueInstruction, execute and then writeBack
    2. I can call the writeBack, execute and then issueInstruction
I chose the first option because it makes more sense to issue the instructions first and then go down the pipeline.
However, there is only one issue with this approach, which is that if a file register will be written to in the writeBack stage
and in the same clock cycle, the same register will have  a tag placed on it due to some instruction being issued in the issue stage,
the value in the writeBack stage will never be written to the register file since issue is executed before writeBack.
However, this is not a problem since this is only a simulation and whoever will need this value the correct value will be obtained from the CDB.
In real life, this happens all at the same time not one after the other.
To avoid this problem, I could have called the writeBack function first, then the execute function and then the issue function,
but I tested the first option so many times so I don't want to change it now.
*/

/*
My assumption on cache misses:
My implementation handles any cache miss (not only the compulsory cache miss).
I assume that when the compulsory miss happens, all loads issued after the miss will have to wait for the miss to be resolved.
The miss latency will be added to each of their latencies.
*/
