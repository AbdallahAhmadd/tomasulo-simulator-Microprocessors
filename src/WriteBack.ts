import { LoadBuffer, ReservationStation, SystemState } from "./types";

export function writeBack(newState: SystemState) {
  //check if there is any instruction that is ready to be written and push it in an array
  let candidates: any[] = [];
  newState.fpAddReservationStations.forEach((station, index) => {
    if (station.busy && station.timeRemaining === 0 && station.result) {
      candidates.push(station);
    }
  });

  newState.fpMulReservationStations.forEach((station, index) => {
    if (station.busy && station.timeRemaining === 0 && station.result) {
      candidates.push(station);
    }
  });

  newState.intAddReservationStations.forEach((station, index) => {
    if (station.busy && station.timeRemaining === 0 && station.result) {
      candidates.push(station);
    }
  });

  newState.loadBuffer.forEach((station, index) => {
    if (station.busy && station.timeRemaining === 0 && station.result) {
      candidates.push(station);
    }
  });

  //if there is no instruction to be written return
  if (candidates.length === 0) return;

  const toBeWrttenStation = getReservationStationWithHighestDependencies(candidates, newState);

  if (toBeWrttenStation.result !== undefined) {
    newState.CDB = { tag: toBeWrttenStation.tag, value: toBeWrttenStation.result };
  }

  //update register file

  if (newState.CDB.tag.startsWith("F")) {
    newState.fpRegisterFile.forEach((register, index) => {
      if (register.Q === newState.CDB.tag) {
        register.value = newState.CDB.value;
        register.Q = "0";
      }
    });
  }

  if (newState.CDB.tag.startsWith("R")) {
    newState.intRegisterFile.forEach((register, index) => {
      if (register.Q === newState.CDB.tag) {
        register.value = newState.CDB.value;
        register.Q = "0";
      }
    });
  }
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
