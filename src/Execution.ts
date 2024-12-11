import { Instructions } from "./enums";
import { SystemState } from "./types";

export function AluOperation(value1: number, value2: number, operation: string): number {
  switch (operation) {
    case Instructions.ADD_D:
    case Instructions.ADD_S:
    case Instructions.DADDI:
      return value1 + value2;
      break;
    case Instructions.SUB_D:
    case Instructions.SUB_S:
    case Instructions.DSUBI:
      return value1 - value2;
      break;
    case Instructions.MUL_D:
    case Instructions.MUL_S:
      return value1 * value2;
    case Instructions.DIV_D:
    case Instructions.DIV_S:
      return value1 / value2;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
}

export function execute(newState: SystemState) {
  //loop over fpAddReservationStations
  //if busy and timeRemaining is 0, then execute
  //if not busy, then continue
  //if busy and timeRemaining is not 0, then decrement timeRemaining
  //if execution is complete ie time remaining is 0, then update registerFile and reservationStation

  newState.fpAddReservationStations.forEach((station, index) => {
    if (station.busy && !station.qj && !station.qk) {
      if (station.timeRemaining === 0) {
        const value1 = station.vj;
        const value2 = station.vk;
        station.result = AluOperation(value1, value2, station.op);
      } else {
        station.timeRemaining--;
      }
    }
  });

  newState.fpMulReservationStations.forEach((station, index) => {
    if (station.busy && !station.qj && !station.qk) {
      if (station.timeRemaining === 0) {
        console.log(`Executing instruction at fp Multiply station ${index}`);
        const value1 = station.vj;
        const value2 = station.vk;
        const result = AluOperation(value1, value2, station.op);
      } else {
        station.timeRemaining -= 1;
      }
    }
  });

  newState.intAddReservationStations.forEach((station, index) => {
    if (station.busy && !station.qj && !station.qk) {
      if (station.timeRemaining === 0) {
        console.log(`Executing instruction at int Add station ${index}`);
        const value1 = station.vj;
        const value2 = station.vk;
        const result = AluOperation(value1, value2, station.op);
      } else {
        station.timeRemaining -= 1;
      }
    }
  });

  newState.intMulReservationStations.forEach((station, index) => {
    if (station.busy && !station.qj && !station.qk) {
      if (station.timeRemaining === 0) {
        console.log(`Executing instruction at int Mul station ${index}`);
        const value1 = station.vj;
        const value2 = station.vk;
        const result = AluOperation(value1, value2, station.op);
      } else {
        station.timeRemaining -= 1;
      }
    }
  });
}
