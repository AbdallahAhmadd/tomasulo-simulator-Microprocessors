import { SystemState } from "./types";
import { broadcastResult , updateRegisterFiles } from "./helpers";

//=================================================================================================================//
//												WRITE BACK                                                         //
//=================================================================================================================//
export function writeBack(systemState: SystemState): SystemState {
    const {
        fpAddReservationStations,
        fpMulReservationStations,
        loadBuffer,
        fpRegisterFile,
        intRegisterFile,
        instructionTable,
        clockCycle,
    } = systemState;

    let busValue: number | null = null; 
    let busTag: string | null = null;  

//=================================================================================================================//
//												ADD/SUB                                                            //
//=================================================================================================================//

    for (const station of fpAddReservationStations) {
        if (station.busy && station.timeRemaining === 0) {
            //MISSINNNNNGGGG
           // busValue = //result mn el execute
            busTag = station.tag; 
            station.busy = false; 
            break;
        }
    }

//=================================================================================================================//
//												MUL/DIV                                                            //
//=================================================================================================================//

    if (!busValue && !busTag) {
        for (const station of fpMulReservationStations) {
            if (station.busy && station.timeRemaining === 0) {
                //MISSINNNNNGGGG
                // busValue = //result mn el execute
                busTag = station.tag; 
                station.busy = false; 
                break;
            }
        }
    }

//=================================================================================================================//
//												LOAD                                                               //
//=================================================================================================================//

if (!busValue && !busTag) {
        for (const buffer of loadBuffer) {
            if (buffer.busy && buffer.timeRemaining === 0) {
                busValue = buffer.address; 
                busTag = buffer.tag; 
                buffer.busy = false; 
                break;
            }
        }
    }

//=================================================================================================================//
//									 CHECKING IF THERE IS NOTHING TO WRITE                                         //
//=================================================================================================================//

    if (!busValue || !busTag) {
        return systemState;
    }

//=================================================================================================================//
//										 BROADCASTING AND UPDATING                                                 //
//=================================================================================================================//
    broadcastResult(busValue, busTag, fpAddReservationStations);
    broadcastResult(busValue, busTag, fpMulReservationStations);

    updateRegisterFiles(busValue, busTag, fpRegisterFile);
    updateRegisterFiles(busValue, busTag, intRegisterFile);

    for (const entry of instructionTable) {
        if (entry.instruction.rd && entry.instruction.rd === busTag && entry.writeResult === -1) {
            entry.execution_complete = `${entry.issue}...${clockCycle}`;
            entry.writeResult = clockCycle; 
        }
    }

    return { ...systemState, clockCycle: clockCycle + 1 }; 
}
