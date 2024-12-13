import { Instructions } from "./enums";
import { LoadBuffer, ReservationStation, StoreBuffer, SystemState } from "./types";

function removeInstructionFromStation(station: LoadBuffer | ReservationStation | StoreBuffer) {
  station.busy = false;
  delete station.timeRemaining;
  delete station.instructionTableIndex;
  if ("result" in station) {
    delete station.result;
  }
  if ("latencyAdded" in station) {
    delete station.latencyAdded;
  }
}
export function writeBack(newState: SystemState) {
  //check if there is any instruction that is ready to be written and push it in an array
  let candidates: any[] = [];

  for (let i = 0; i < newState.fpAddReservationStations.length; i++) {
    const station = newState.fpAddReservationStations[i];
    if (station.busy === true && station.timeRemaining == 0 && station.result !== undefined) {
      if (
        newState.instructionTable[station.instructionTableIndex!].end_execution ===
        newState.clockCycle
      ) {
        continue;
      }
      candidates.push(station);
    }
  }

  for (let i = 0; i < newState.fpMulReservationStations.length; i++) {
    const station = newState.fpMulReservationStations[i];
    if (station.busy === true && station.timeRemaining == 0 && station.result !== undefined) {
      if (
        newState.instructionTable[station.instructionTableIndex!].end_execution ===
        newState.clockCycle
      ) {
        continue;
      }
      candidates.push(station);
    }
  }

  for (let i = 0; i < newState.intAddReservationStations.length; i++) {
    const station = newState.intAddReservationStations[i];
    if (station.busy === true && station.timeRemaining == 0 && station.result !== undefined) {
      if (
        newState.instructionTable[station.instructionTableIndex!].end_execution ===
        newState.clockCycle
      ) {
        continue;
      }
      if (station.op === Instructions.BEQ || station.op === Instructions.BNE) {
        newState.instructionTable[station.instructionTableIndex!].writeResult = newState.clockCycle;
        removeInstructionFromStation(station);
        continue;
      }
      candidates.push(station);
    }
  }

  for (let i = 0; i < newState.loadBuffer.length; i++) {
    const buffer = newState.loadBuffer[i];
    if (buffer.busy == true && buffer.timeRemaining == 0 && buffer.result !== undefined) {
      if (
        newState.instructionTable[buffer.instructionTableIndex!].end_execution ===
        newState.clockCycle
      ) {
        continue;
      }
      candidates.push(buffer);
    }
  }

  for (let i = 0; i < newState.storeBuffer.length; i++) {
    const buffer = newState.storeBuffer[i];
    if (buffer.busy == true && buffer.timeRemaining == 0) {
      if (
        newState.instructionTable[buffer.instructionTableIndex!].end_execution ===
        newState.clockCycle
      ) {
        continue;
      }
      newState.instructionTable[buffer.instructionTableIndex!].writeResult = newState.clockCycle;
      newState.notes.push(
        `Instruction ${buffer.op} at Store Buffer ${i + 1} wrote its result at cycle ${newState.clockCycle}.`,
      );
      removeInstructionFromStation(buffer);
    }
  }
  console.log("Candidates: ", candidates);
  //if there is no instruction to be written return
  if (candidates.length === 0) return;

  const toBeWrttenStation = getReservationStationWithHighestDependencies(candidates, newState);

  console.log("Chosen station: ", toBeWrttenStation);
  if (toBeWrttenStation.result !== undefined) {
    newState.CDB = { tag: toBeWrttenStation.tag, value: toBeWrttenStation.result };
    newState.notes.push(
      `Instruction ${toBeWrttenStation.op} from ${toBeWrttenStation.tag} wrote its result to CDB at cycle ${newState.clockCycle}.`,
    );
    newState.instructionTable[toBeWrttenStation.instructionTableIndex!].writeResult =
      newState.clockCycle;
    removeInstructionFromStation(toBeWrttenStation);
  }

  newState.fpRegisterFile.forEach((register, index) => {
    if (register.Q === newState.CDB.tag) {
      register.value = newState.CDB.value;
      register.Q = "0";
    }
  });
  newState.fpAddReservationStations.forEach((station) => {
    if (station.qj === newState.CDB.tag) {
      station.qj = "0";
      station.vj = newState.CDB.value;
    }
    if (station.qk === newState.CDB.tag) {
      station.qk = "0";
      station.vk = newState.CDB.value;
    }
  });
  newState.fpMulReservationStations.forEach((station) => {
    if (station.qj === newState.CDB.tag) {
      station.qj = "0";
      station.vj = newState.CDB.value;
    }
    if (station.qk === newState.CDB.tag) {
      station.qk = "0";
      station.vk = newState.CDB.value;
    }
  });

  newState.storeBuffer.forEach((station) => {
    if (station.qj === newState.CDB.tag) {
      station.qj = "0";
      station.v = newState.CDB.value;
    }
    if (station.qk === newState.CDB.tag) {
      station.qk = "0";
      station.address = newState.CDB.value;
    }
  });

  newState.loadBuffer.forEach((station) => {
    if (station.q === newState.CDB.tag) {
      station.q = "0";
      station.address = newState.CDB.value;
    }
  });
  newState.intRegisterFile.forEach((register) => {
    if (register.Q === newState.CDB.tag) {
      register.value = newState.CDB.value;
      register.Q = "0";
    }
  });
  newState.intAddReservationStations.forEach((station) => {
    if (station.qj === newState.CDB.tag) {
      station.qj = "0";
      station.vj = newState.CDB.value;
    }
    if (station.qk === newState.CDB.tag) {
      station.qk = "0";
      station.vk = newState.CDB.value;
    }
  });
}

export function getReservationStationWithHighestDependencies(
  candidates: any[],
  newState: SystemState,
): ReservationStation | LoadBuffer {
  // Array to store dependency counts for each candidate
  const counts = Array(candidates.length).fill(0);

  // Check dependencies for each candidate
  candidates.forEach((instruction, index) => {
    newState.fpAddReservationStations.forEach((station) => {
      if (station.qj === instruction.tag || station.qk === instruction.tag) counts[index]++;
    });

    newState.fpMulReservationStations.forEach((station) => {
      if (station.qj === instruction.tag || station.qk === instruction.tag) counts[index]++;
    });

    newState.intAddReservationStations.forEach((station) => {
      if (station.qj === instruction.tag || station.qk === instruction.tag) counts[index]++;
    });

    newState.storeBuffer.forEach((station) => {
      if (station.qj === instruction.tag || station.qk === instruction.tag) counts[index]++;
    });
    newState.loadBuffer.forEach((station) => {
      if (station.q === instruction.tag) counts[index]++;
    });
  });

  // Find the maximum dependency count
  const max = Math.max(...counts);

  // Filter candidates with the highest dependencies
  const topCandidates = candidates
    .map((candidate, index) => ({ candidate, count: counts[index], index }))
    .filter(({ count }) => count === max);

  // If there's only one top candidate, return it
  if (topCandidates.length === 1) {
    return topCandidates[0].candidate;
  }

  // Resolve ties by choosing the candidate with the earliest issue cycle
  let earliestCandidate = topCandidates[0];
  topCandidates.forEach(({ candidate, index }) => {
    const issueCycle = newState.instructionTable[candidate.instructionTableIndex].issue;
    const earliestIssueCycle =
      newState.instructionTable[earliestCandidate.candidate.instructionTableIndex].issue;
    if (issueCycle! < earliestIssueCycle!) {
      earliestCandidate = { candidate, index, count: max };
    }
  });

  return earliestCandidate.candidate;
}
