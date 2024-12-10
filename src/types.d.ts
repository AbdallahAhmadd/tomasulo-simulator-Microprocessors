export interface instruction {
    opcode: string;
    rs: string;
    rt: string;
    rd: string;
    isLoop?:Boolean;
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
    timeRemaining: number;
}

export interface LoadBuffer {
    tag: string;
    busy: boolean;
    address: number;
    timeRemaining: number;
}

export interface StoreBuffer {
    tag: string;
    busy: boolean;
    address: number;
    v: number;
    q: string;
    timeRemaining: number;
}

export interface registerFileEntry {
    registerName: string;
    Q: string;
    value: number;
}

export interface instructionEntry{
    instruction: instruction;
    issue: number;
    execution_complete: string;
    writeResult: number;
}

export enum Instructions {
    DADDI = "DADDI",
    DSUBI = "DSUBI",
    ADD_D = "ADD.D",
    ADD_S = "ADD.S",
    SUB_D = "SUB.D",
    SUB_S = "SUB.S",
    MUL_D = "MUL.D",
    MUL_S = "MUL.S",
    DIV_D = "DIV.D",
    DIV_S = "DIV.S",
    LW = "LW",
    LD = "LD",
    L_S = "L.S",
    L_D = "L.D",
    SW = "SW",
    SD = "SD",
    S_S = "S.S",
    S_D = "S.D",
    BNE = "BNE",
    BEQ = "BEQ",
}

export interface latencies {
    DADDI : number,
    DSUBI : number,
    ADD_D : number,
    ADD_S : number,
    SUB_D : number,
    SUB_S : number,
    MUL_D : number,
    MUL_S : number,
    DIV_D : number,
    DIV_S : number,
    LW : number,
    LD : number,
    L_S : number,
    L_D : number,
}

export interface SystemState {
    /* tomasulo architecture */
    instructionQueue: instruction[];
    fpAddReservationStations: ReservationStation[];
    fpMulReservationStations: ReservationStation[];
    intAddReservationStations: ReservationStation[];
    intMulReservationStations: ReservationStation[];
    loadBuffer: LoadBuffer[];
    storeBuffer: StoreBuffer[];
    fpRegisterFile: registerFileEntry[];
    intRegisterFile: registerFileEntry[];
    memory: number[];
    cache: Cache;
    /* simulation state */
    instructionTable: instructionEntry[];
    clockCycle: number;
    pc: number;
    latencies: latencies;

}


export interface SystemConfig {
    fpAddReservationStationsSize: number;
    fpMulReservationStationsSize: number;
    intAddReservationStationsSize: number;
    intMulReservationStationsSize: number;
    loadBufferSize: number;
    storeBufferSize: number;
    cacheSize: number;
    blockSize: number;
    latencies: latencies;
}