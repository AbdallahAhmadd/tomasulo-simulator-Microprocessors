import type {
  LoadBuffer,
  ReservationStation,
  StoreBuffer,
  registerFileEntry,
  instruction,
  latencies,
} from "./types.d.ts";
import { Instructions } from "./enums";

{
  /*********** Issue ***********/
}

export const parseInstructions = (StringInstructions: string[]) => {
  const parsedInstructions: instruction[] = [];
  let labelAddress = "";

  StringInstructions.forEach((instruction) => {
    if (instruction.includes(":")) {
      const split = instruction.split(":"); // ["LOOP", "L.D F0, R1"]
      labelAddress = split[0].trim(); // "LOOP"
      split.shift(); //[ "L.D F0, R1"]
      instruction = split.join("").trim(); // "L.D F0, R1"
    }

    const [opcode, rd, rs, rt] = instruction.split(" ");

    if (opcode === "BNE" || opcode === "BEQ") {
      parsedInstructions.push({
        opcode: opcode as Instructions,
        rd: rt,
        rs: rd,
        rt: rs,
        labelAddress,
      });
    } else {
      parsedInstructions.push({ opcode: opcode as Instructions, rd, rs, rt, labelAddress });
    }
    labelAddress = "";
  });

  //replace labelAddress with actual address
  parsedInstructions.forEach((instruction, index) => {
    if ((instruction.opcode === "BNE" || instruction.opcode === "BEQ") && instruction.rd) {
      const labelInstructionIndex = parsedInstructions.findIndex(
        (instr) => instr.labelAddress === instruction.rd,
      );
      if (labelInstructionIndex !== -1) {
        instruction.rd = labelInstructionIndex.toString();
      }
    }
  });
  return parsedInstructions;
};

export const initializeLoadBuffer = (size: number): LoadBuffer[] => {
  return Array.from({ length: size }, (_, i) => ({
    busy: false,
    tag: `L${i + 1}`,
    op: "",
    address: 0,
  }));
};

export const initializeStoreBuffer = (size: number): StoreBuffer[] => {
  return Array.from({ length: size }, (_, i) => ({
    busy: false,
    tag: `S${i + 1}`,
    op: "",
    v: 0,
    q: "",
    address: 0,
  }));
};

export const initializeAddStations = (size: number): ReservationStation[] => {
  return Array.from({ length: size }, (_, i) => ({
    busy: false,
    tag: `A${i + 1}`,
    op: "",
    vj: 0,
    vk: 0,
    qj: "0",
    qk: "0",
    A: 0,
  }));
};

export const initializeMulStations = (size: number): ReservationStation[] => {
  return Array.from({ length: size }, (_, i) => ({
    busy: false,
    tag: `M${i + 1}`,
    op: "",
    vj: 0,
    vk: 0,
    qj: "0",
    qk: "0",
    A: 0,
  }));
};

export const initializeRegisterFile = (size: number, type: string): registerFileEntry[] => {
  return Array.from({ length: size }, (_, i) => ({
    registerName: `${type}${i}`,
    Q: "0",
    value: 0,
  }));
};

/*********** Issue ***********/
export function isRegisterAvailable(register: string, registerFile: registerFileEntry[]): boolean {
  const entry = registerFile.find((reg) => reg.registerName === register);
  return entry?.Q === "0";
}

export function getRegisterValue(register: string, registerFile: registerFileEntry[]): number {
  const entry = registerFile.find((reg) => reg.registerName === register);
  return entry?.value || 0;
}

export function getRegisterTag(register: string, registerFile: registerFileEntry[]): string {
  const entry = registerFile.find((reg) => reg.registerName === register);
  return entry?.Q || "";
}

export function updateRegisterTag(
  register: string,
  tag: string,
  registerFile: registerFileEntry[],
): void {
  const entry = registerFile.find((reg) => reg.registerName === register);
  if (entry) {
    entry.Q = tag;
  }
}

export function mapOpToLatencyKey(op: Instructions): keyof latencies {
  return op.replace(".", "_") as keyof latencies;
}

export function broadcastResult(value: number, tag: string, stations: ReservationStation[]): void {
  for (const station of stations) {
    if (station.qj === tag) {
      station.vj = value;
      station.qj = "";
    }
    if (station.qk === tag) {
      station.vk = value;
      station.qk = "";
    }
  }
}

export function updateRegisterFiles(
  value: number,
  tag: string,
  registerFile: registerFileEntry[],
): void {
  for (const reg of registerFile) {
    if (reg.Q === tag) {
      reg.value = value;
      reg.Q = "";
    }
  }
}
