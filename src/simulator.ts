import {SystemConfig, SystemState} from './types';
import {initializeAddStations, initializeLoadBuffer, initializeMulStations, initializeStoreBuffer} from "./helpers.ts";

export function initializeSystem(instructionQueue: string, config: SystemConfig): SystemState {
    const {  fpAddReservationStationsSize,
        fpMulReservationStationsSize,
        intAddReservationStationsSize,
        intMulReservationStationsSize,
        loadBufferSize,
        storeBufferSize,
        cacheSize,
        blockSize,
        latencies} = config;
    return {
        instructionQueue: ,// parse instruction Queue,
        fpAddReservationStations: initializeAddStations(fpAddReservationStationsSize),
        fpMulReservationStations: initializeMulStations(fpMulReservationStationsSize),
        intAddReservationStations:  initializeAddStations(intAddReservationStationsSize),
        intMulReservationStations: initializeMulStations(intMulReservationStationsSize),
        loadBuffer: initializeLoadBuffer(loadBufferSize),
        storeBuffer: initializeStoreBuffer(storeBufferSize),
        registerFile: [], // populate register file with predefined values,
        latencies: latencies,
        memory: [], //populate memory
        clock: 0,
        instructionResults: [],
    };
}
