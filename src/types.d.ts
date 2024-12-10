export interface instruction {
    opcode: string;
    rd: string;
    rs: string;
    rt: string;
}

export interface reservationStation {
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

export interface fpRegisterFile {
    registerName: string;
    Q: string;
    value: number;
}

export