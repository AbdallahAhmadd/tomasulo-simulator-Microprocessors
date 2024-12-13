import { DMappedCache } from "./hardwareComponents/Cache";
import { Memory } from "./hardwareComponents/Memory";
import { Instructions } from "./enums.ts";
export interface instruction {
  opcode: Instructions;
  rd: string;
  rs: string;
  rt: string;
  labelAddress?: string;
}

export interface ReservationStation {
  tag: string;
  busy: boolean;
  op: string;
  vj: number;
  vk: number;
  qj: string;
  qk: string;
  A: number;
  timeRemaining?: number;
  result?: number;
  instructionTableIndex?: number;
}

export interface LoadBuffer {
  tag: string;
  busy: boolean;
  op: string;
  q: string;
  address: number;
  timeRemaining?: number;
  result?: number;
  instructionTableIndex?: number;
  latencyAdded?: boolean;
}

export interface StoreBuffer {
  tag: string;
  busy: boolean;
  op: string;
  address: number;
  v: number;
  qj: string;
  qk: string;
  timeRemaining?: number;
  instructionTableIndex?: number;
}
export interface registerFileEntry {
  registerName: string;
  Q: string;
  value: number;
}

export interface instructionEntry {
  instruction: instruction;
  issue?: number;
  start_execution?: number;
  end_execution?: number;
  writeResult?: number;
}

export interface commonDataBus {
  tag: string;
  value: number;
}

export interface latencies {
  DADDI: number;
  DSUBI: number;
  ADD_D: number;
  ADD_S: number;
  SUB_D: number;
  SUB_S: number;
  MUL_D: number;
  MUL_S: number;
  DIV_D: number;
  DIV_S: number;
  LW: number;
  LD: number;
  L_S: number;
  L_D: number;
  SW: number;
  SD: number;
  S_S: number;
  S_D: number;
  BNE: number;
  BEQ: number;
}

export interface SystemState {
  /* tomasulo architecture */
  instructionQueue: instruction[];
  fpAddReservationStations: ReservationStation[];
  fpMulReservationStations: ReservationStation[];
  intAddReservationStations: ReservationStation[];
  loadBuffer: LoadBuffer[];
  storeBuffer: StoreBuffer[];
  fpRegisterFile: registerFileEntry[];
  intRegisterFile: registerFileEntry[];
  CDB: commonDataBus;
  memory: Memory;
  cache: DMappedCache;
  /* simulation state */
  instructionTable: instructionEntry[];
  clockCycle: number;
  pc: number;
  latencies: latencies;
  notes: string[];
  cacheMissLatency: number;
}

export interface SystemConfig {
  fpAddReservationStationsSize: number;
  fpMulReservationStationsSize: number;
  intAddReservationStationsSize: number;
  fpRegisterFileSize: number;
  intRegisterFileSize: number;
  loadBufferSize: number;
  storeBufferSize: number;
  cacheSize: number;
  blockSize: number;
  latencies: latencies;
}

export interface CacheBlock {
  dirty: boolean;
  valid: boolean;
  tag: string;
  data: Uint8Array;
  dataView: DataView;
}
