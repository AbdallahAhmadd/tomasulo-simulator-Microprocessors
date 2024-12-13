import { Instructions } from "./enums";
import { mapOpToLatencyKey } from "./helpers";
import { SystemState } from "./types";

export function AluOperation(value1: number, value2: number, operation: string): number {
  switch (operation) {
    case Instructions.ADD_D:
    case Instructions.ADD_S:
    case Instructions.DADDI:
      return value1 + value2;
    case Instructions.SUB_D:
    case Instructions.SUB_S:
    case Instructions.DSUBI:
      return value1 - value2;
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
  newState.fpAddReservationStations.forEach((station, index) => {
    if (station.busy && station.qj === "0" && station.qk === "0") {
      if (newState.instructionTable[station.instructionTableIndex!].issue == newState.clockCycle)
        return;
      if (station.timeRemaining === undefined) {
        const latency = newState.latencies[mapOpToLatencyKey(station.op as Instructions)];
        station.timeRemaining = latency;
        newState.instructionTable[station.instructionTableIndex!].start_execution =
          newState.clockCycle;
        newState.instructionTable[station.instructionTableIndex!].end_execution =
          newState.clockCycle + latency - 1;
        newState.notes.push(
          `Instruction ${station.op} at A${index + 1} started execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (station.timeRemaining == 1) {
        const value1 = station.vj;
        const value2 = station.vk;
        station.result = AluOperation(value1, value2, station.op);
        newState.notes.push(
          `Instruction ${station.op} at A${index + 1} completed execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (station.timeRemaining > 0) station.timeRemaining!--;
    }
  });

  newState.fpMulReservationStations.forEach((station, index) => {
    if (station.busy && station.qj === "0" && station.qk === "0") {
      if (newState.instructionTable[station.instructionTableIndex!].issue == newState.clockCycle)
        return;
      if (station.timeRemaining === undefined) {
        const latency = newState.latencies[mapOpToLatencyKey(station.op as Instructions)];
        station.timeRemaining = latency;
        newState.instructionTable[station.instructionTableIndex!].start_execution =
          newState.clockCycle;
        newState.instructionTable[station.instructionTableIndex!].end_execution =
          newState.clockCycle + latency - 1;
        newState.notes.push(
          `Instruction ${station.op} at M${index + 1} started execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (station.timeRemaining == 1) {
        const value1 = station.vj;
        const value2 = station.vk;
        station.result = AluOperation(value1, value2, station.op);
        newState.notes.push(
          `Instruction ${station.op} at M${index + 1} completed execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (station.timeRemaining > 0) station.timeRemaining!--;
    }
  });

  newState.intAddReservationStations.forEach((station, index) => {
    // Check if station is busy and operands are ready
    if (station.busy && station.qj === "0" && station.qk === "0") {
      // Skip if the instruction was just issued in the current cycle
      if (newState.instructionTable[station.instructionTableIndex!].issue === newState.clockCycle) {
        return;
      }

      // Initialize timeRemaining and set execution start and end times
      if (station.timeRemaining === undefined) {
        const latency = newState.latencies[mapOpToLatencyKey(station.op as Instructions)];
        station.timeRemaining = latency;
        const instruction = newState.instructionTable[station.instructionTableIndex!];
        instruction.start_execution = newState.clockCycle;
        instruction.end_execution = newState.clockCycle + latency - 1;
        newState.notes.push(
          `Instruction ${station.op} at I${index + 1} started execution at cycle ${newState.clockCycle}.`,
        );
      }

      if (station.timeRemaining === 1) {
        const value1 = station.vj;
        const value2 = station.vk;
        if (station.op === Instructions.BEQ || station.op === Instructions.BNE) {
          station.result = AluOperation(value1, value2, Instructions.SUB_D);
          const branchTaken =
            (station.op === Instructions.BEQ && station.result === 0) ||
            (station.op === Instructions.BNE && station.result !== 0);

          if (branchTaken) {
            newState.pc = station.A;
            newState.notes.push(
              `Branch instruction ${station.op} at I${index + 1} taken. PC updated to ${station.A}.`,
            );
          } else {
            newState.notes.push(`Branch instruction ${station.op} at I${index + 1} not taken.`);
          }
        } else {
          station.result = AluOperation(value1, value2, station.op);
          newState.notes.push(
            `Instruction ${station.op} at I${index + 1} completed execution at cycle ${newState.clockCycle}.`,
          );
        }
      }

      if (station.timeRemaining > 0) {
        station.timeRemaining!--;
      }
    }
  });
  for (let i = 0; i < newState.loadBuffer.length; i++) {
    const buffer = newState.loadBuffer[i];
    if (buffer.busy == true && buffer.q === "0") {
      if (newState.instructionTable[buffer.instructionTableIndex!].issue == newState.clockCycle)
        return;
      if (buffer.timeRemaining === undefined) {
        const latency = newState.latencies[mapOpToLatencyKey(buffer.op as Instructions)];
        buffer.timeRemaining = latency;
        newState.instructionTable[buffer.instructionTableIndex!].start_execution =
          newState.clockCycle;
        newState.notes.push(
          `Instruction ${buffer.op} at L${i + 1} started execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (buffer.timeRemaining === 1) {
        switch (buffer.op) {
          case Instructions.LW:
            try {
              buffer.result = newState.cache.read(buffer.address, 4, newState.memory, false);
              newState.instructionTable[buffer.instructionTableIndex!].end_execution =
                newState.clockCycle;
              buffer.timeRemaining = 0;
            } catch (error) {
              newState.notes.push(
                `Cache miss for instruction ${buffer.op} at L${i + 1} during cycle ${newState.clockCycle}. Cache miss latency is extra 2 cycles.`,
              );
              buffer.timeRemaining = 2; // Assuming 2 cycles for cache miss
            }
            break;
          case Instructions.LD:
            try {
              buffer.result = newState.cache.read(buffer.address, 8, newState.memory, false);
              newState.instructionTable[buffer.instructionTableIndex!].end_execution =
                newState.clockCycle;
              buffer.timeRemaining = 0;
            } catch (error) {
              newState.notes.push(
                `Cache miss for instruction ${buffer.op} at L${i + 1} during cycle ${newState.clockCycle}. Cache miss latency is extra 2 cycles.`,
              );
              buffer.timeRemaining = 2; // Assuming 2 cycles for cache miss
            }
            break;
          case Instructions.L_S:
            try {
              buffer.result = newState.cache.read(buffer.address, 4, newState.memory, true);
              newState.instructionTable[buffer.instructionTableIndex!].end_execution =
                newState.clockCycle;
              buffer.timeRemaining = 0;
            } catch (error) {
              newState.notes.push(
                `Cache miss for instruction ${buffer.op} at L${i + 1} during cycle ${newState.clockCycle}. Cache miss latency is extra 2 cycles.`,
              );
              buffer.timeRemaining = 2; // Assuming 2 cycles for cache miss
            }
            break;
          case Instructions.L_D:
            try {
              buffer.result = newState.cache.read(buffer.address, 8, newState.memory, true);
              newState.instructionTable[buffer.instructionTableIndex!].end_execution =
                newState.clockCycle;
              buffer.timeRemaining = 0;
              newState.notes.push(
                `Instruction ${buffer.op} at L${i + 1} completed execution at cycle ${newState.clockCycle}.`,
              );
            } catch (error) {
              newState.notes.push(
                `Cache miss for instruction ${buffer.op} at L${i + 1} during cycle ${newState.clockCycle}.  Cache miss latency is extra 2 cycles.`,
              );
              buffer.timeRemaining = 2; // Assuming 2 cycles for cache miss
            }
            break;
          default:
            throw new Error(`Unsupported operation: ${buffer.op}`);
        }
      } else if (buffer.timeRemaining > 0) buffer.timeRemaining!--;
    }
  }

  newState.storeBuffer.forEach((buffer, index) => {
    if (buffer.busy && buffer.qj === "0" && buffer.qk === "0") {
      if (newState.instructionTable[buffer.instructionTableIndex!].issue == newState.clockCycle)
        return;
      if (buffer.timeRemaining === undefined) {
        const latency = newState.latencies[mapOpToLatencyKey(buffer.op as Instructions)];
        buffer.timeRemaining = latency;
        newState.instructionTable[buffer.instructionTableIndex!].start_execution =
          newState.clockCycle;
        newState.instructionTable[buffer.instructionTableIndex!].end_execution =
          newState.clockCycle + latency - 1;
        newState.notes.push(
          `Instruction ${buffer.op} at S${index + 1} started execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (buffer.timeRemaining === 1) {
        switch (buffer.op) {
          case Instructions.SW:
            newState.cache.write(buffer.address, buffer.v, 4, false);
            break;
          case Instructions.SD:
            newState.cache.write(buffer.address, buffer.v, 8, false);
            break;
          case Instructions.S_S:
            newState.cache.write(buffer.address, buffer.v, 4, true);
            break;
          case Instructions.S_D:
            newState.cache.write(buffer.address, buffer.v, 8, true);
            break;
          default:
            throw new Error(`Unsupported operation: ${buffer.op}`);
        }
        newState.notes.push(
          `Instruction ${buffer.op} at S${index + 1} completed execution at cycle ${newState.clockCycle}.`,
        );
      }
      if (buffer.timeRemaining > 0) buffer.timeRemaining!--;
    }
  });
}
