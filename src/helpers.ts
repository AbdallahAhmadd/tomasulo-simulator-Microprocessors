import {LoadBuffer, ReservationStation, StoreBuffer , registerFileEntry , Instructions , latencies} from "./types";

export const initializeLoadBuffer = (size: number): LoadBuffer[] => {
    return Array.from({ length: size }, (_, i) => ({
        busy: false,
        tag: `L${i + 1}`,
        address: 0,
        timeRemaining: 0,
    }));
};

export const initializeStoreBuffer = (size: number): StoreBuffer[] => {
    return Array.from({ length: size }, (_, i) => ({
        busy: false,
        tag: `S${i + 1}`,
        v: 0,
        q: "",
        address: 0,
        timeRemaining: 0,
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
        A: "",
        timeRemaining: 0,
    }));
};

export const initializeMulStations = (size: number): ReservationStation[] => {
    return Array.from({ length: size }, (_, i) => ({
        busy: false,
        tag: `<${i + 1}`,
        op: "",
        vj: 0,
        vk: 0,
        qj: "0",
        qk: "0",
        A: "",
        timeRemaining: 0,
    }));
};

export function getOperandValue(register: string, registerFile: registerFileEntry[]): number {
    const entry = registerFile.find((reg) => reg.registerName === register);
    return entry?.Q ? 0 : entry?.value || 0; 
  }
  
 export function getOperandTag(register: string, registerFile: registerFileEntry[]): string {
    const entry = registerFile.find((reg) => reg.registerName === register);
    return entry?.Q || ""; 
  }
  
 export function updateRegisterTag(register: string, tag: string, registerFile: registerFileEntry[]): void {
    const entry = registerFile.find((reg) => reg.registerName === register);
    if (entry) {
      entry.Q = tag; 
    }
  }
  
  export function mapOpcodeToLatencyKey(opcode: Instructions): keyof latencies {
    switch (opcode) {
        case Instructions.DADDI:
            return "DADDI";
        case Instructions.DSUBI:
            return "DSUBI";
        case Instructions.ADD_D:
            return "ADD_D";
        case Instructions.ADD_S:
            return "ADD_S";
        case Instructions.SUB_D:
            return "SUB_D";
        case Instructions.SUB_S:
            return "SUB_S";
        case Instructions.MUL_D:
            return "MUL_D";
        case Instructions.MUL_S:
            return "MUL_S";
        case Instructions.DIV_D:
            return "DIV_D";
        case Instructions.DIV_S:
            return "DIV_S";
        case Instructions.LW:
            return "LW";
        case Instructions.LD:
            return "LD";
        case Instructions.L_S:
            return "L_S";
        case Instructions.L_D:
            return "L_D";
        default:
            throw new Error(`Unsupported opcode: ${opcode}`);
    }
}


export const InstructionParser = (StringInstructions: string[]) => {
    let parsedInstructions: instruction[] = [];
    let isLoop = false;
    StringInstructions.forEach((instruction) => {
       
        if (instruction.includes(":")) {
            const split = instruction.split(":"); // ["LOOP", "L.D F0, R1"]
            split.shift(); //[ "L.D F0, R1"]
            instruction = split.join("").trim(); // "L.D F0, R1"
            isLoop = true;
        }

        const [opcode, rs, rt, rd] = instruction.split(" ");

        if (!opcode || !rs || !rt) {
            console.error("Invalid instruction format:", instruction);
            return;
        }

        parsedInstructions.push({ opcode, rs, rt, rd, isLoop});
        isLoop = false;
    });

    return parsedInstructions;

}

