import {SystemState} from "./types";


export function AluOperation(value1: number, value2: number, operation: string): number {
    switch (operation) {
        case "ADD":
            return value1 + value2;
        case "SUB":
            return value1 - value2;
        case "MUL":
            return value1 * value2;
        case "DIV":
            return value1 / value2;
        default:
            throw new Error(`Unsupported operation: ${operation}`);
    }
}


export function execute(newState :SystemState ){
    console.log("Executing");


    //loop over fpAddReservationStations
    //if busy and timeRemaining is 0, then execute
    //if not busy, then continue
    //if busy and timeRemaining is not 0, then decrement timeRemaining
    //if execution is complete ie time remaining is 0, then update registerFile and reservationStation 

    newState.fpAddReservationStations.forEach((station, index) => {
        if (station.busy && !station.qj && !station.qk) {
            if (station.timeRemaining === 0) {
                console.log(`Executing instruction at fp Add station ${index}`);
                const value1 = station.vj;
                const value2 = station.vk;
                const result = AluOperation(value1, value2, station.op);
                //Quesiton: How can i know the destination Register from the reservation station????
                if(station.){
                    newState.fpRegisterFile.forEach((register, index) => {
                        if (register.registerName === station.destinationRegister) {
                            register.value = result;
                            register.Q = "";
                        }
                    });
                }

            } else {
                station.timeRemaining -= 1;
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