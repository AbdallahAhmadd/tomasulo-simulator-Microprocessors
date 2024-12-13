import { LoadBuffer, ReservationStation, StoreBuffer, SystemState } from "./types";

function removeInstructionFromStation(station: LoadBuffer | ReservationStation | StoreBuffer) {
  station.busy = false;
  delete station.timeRemaining;
  delete station.instructionTableIndex;
}
export function writeBack(newState: SystemState) {
  //check if there is any instruction that is ready to be written and push it in an array
  let candidates: any[] = [];

  for (let i = 0; i < newState.fpAddReservationStations.length; i++) {
    const station = newState.fpAddReservationStations[i];
    if (station.busy === true && station.result !== undefined) {
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
    if (station.busy === true && station.result !== undefined) {
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
    if (station.busy === true && station.result !== undefined) {
      if (
        newState.instructionTable[station.instructionTableIndex!].end_execution ===
        newState.clockCycle
      ) {
        continue;
      }
      candidates.push(station);
    }
  }

  //if there is no instruction to be written return
  if (candidates.length === 0) return;

  const toBeWrttenStation = getReservationStationWithHighestDependencies(candidates, newState);

  if (toBeWrttenStation.result !== undefined) {
    newState.CDB = { tag: toBeWrttenStation.tag, value: toBeWrttenStation.result };
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

  newState.intRegisterFile.forEach((register, index) => {
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
