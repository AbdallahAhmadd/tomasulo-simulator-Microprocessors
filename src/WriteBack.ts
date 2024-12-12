import { ReservationStation, SystemState } from "./types";

//=================================================================================================================//
//												WRITE BACK                                                         //
//=================================================================================================================//
export function writeBack(newState: SystemState) {

    //check if there is any instruction that is ready to be written and push it in an array

    let toBeWrtten: ReservationStation[] = [];
    newState.fpAddReservationStations.forEach((station, index) => {
        if (station.busy && !station.qj && !station.qk && station.timeRemaining === 0 && station.result) {
            toBeWrtten.push(station);

        }
    })

    newState.fpMulReservationStations.forEach((station, index) => {
        if (station.busy && !station.qj && !station.qk && station.timeRemaining === 0 && station.result) {
            toBeWrtten.push(station);
        }
    })

    newState.intAddReservationStations.forEach((station, index) => {
        if (station.busy && !station.qj && !station.qk && station.timeRemaining === 0 && station.result) {
            toBeWrtten.push(station);
        }
    })

    newState.intMulReservationStations.forEach((station, index) => {
        if (station.busy && !station.qj && !station.qk && station.timeRemaining === 0 && station.result) {
            toBeWrtten.push(station);
        }
    })

    //if there is no instruction to be written return
    if (toBeWrtten.length === 0)
        return;

    //array of counts equal in lenght of to be written filled with zeros
    let counts = Array(toBeWrtten.length).fill(0);
    //check if there are any instructions that are dependent on the instruction that is ready to be written
    if (toBeWrtten.length > 1) {


        toBeWrtten.forEach((instruction, index) => {
            newState.fpAddReservationStations.forEach((station) => {
                if (station.qj === instruction.tag || station.qk === instruction.tag) {
                    counts[index]++;
                }
                if (station.qk === instruction.tag || station.qj === instruction.tag) {
                    counts[index]++;
                }
            });

            newState.fpMulReservationStations.forEach((station) => {
                if (station.qj === instruction.tag || station.qk === instruction.tag) {
                    counts[index]++;
                }
                if (station.qk === instruction.tag || station.qj === instruction.tag) {
                    counts[index]++;
                }
            });

            newState.intAddReservationStations.forEach((station) => {
                if (station.qj === instruction.tag || station.qk === instruction.tag) {
                    counts[index]++;
                }
                if (station.qk === instruction.tag || station.qj === instruction.tag) {
                    counts[index]++;
                }
            });

            newState.intMulReservationStations.forEach((station) => {
                if (station.qj === instruction.tag || station.qk === instruction.tag) {
                    counts[index]++;
                }
                if (station.qk === instruction.tag || station.qj === instruction.tag) {
                    counts[index]++;
                }
            });

        });
    }

    //check if counts are all the same
    let allEqual = counts.every((count) => count === counts[0]);
    //if they all have the same dependancies choose by first come first serve
    if (allEqual) {
        toBeWrtten = toBeWrtten.sort((a, b) => (a.instructionTableIndex ?? 0) - (b.instructionTableIndex ?? 0));
    }


    const toBeWrttenStation = toBeWrtten[0];

    if (toBeWrttenStation.result !== undefined) {
        newState.CDB = { tag: toBeWrttenStation.tag, value: toBeWrttenStation.result };
    }

    //update register file

    if (newState.CDB.tag.startsWith("F")) {
        newState.fpRegisterFile.forEach((register, index) => {
            if (register.Q === newState.CDB.tag) {
                register.value = newState.CDB.value;
                register.Q = "";
            }
        })
    }

    if (newState.CDB.tag.startsWith("R")) {
        newState.intRegisterFile.forEach((register, index) => {
            if (register.Q === newState.CDB.tag) {
                register.value = newState.CDB.value;
                register.Q = "";
            }
        })
    }
}
