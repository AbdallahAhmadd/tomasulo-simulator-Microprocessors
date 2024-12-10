import {LoadBuffer, ReservationStation, reservationStation, StoreBuffer} from "./types";

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