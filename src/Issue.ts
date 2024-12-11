import {registerFileEntry, ReservationStation, SystemState} from "./types";
import {Instructions} from "./enums";
import {
  getRegisterTag,
  getRegisterValue,
  updateRegisterTag,
  mapOpcodeToLatencyKey,
  isRegisterAvailable
} from "./helpers";


//=================================================================================================================//
//												ISSUING                                                            //
//=================================================================================================================//

export function issueInstruction(systemState: SystemState): SystemState {
    const {
      instructionQueue,
      fpAddReservationStations,
      fpMulReservationStations,
      loadBuffer,
      storeBuffer,
      fpRegisterFile,
      pc,
      clockCycle,
      latencies,
    } = systemState;
  
    if (pc >= instructionQueue.length) {
      console.log("Issued All instructions");
      return systemState; 
    }
  
    const currentInstruction = instructionQueue[pc];
    const { opcode, rd, rs, rt } = currentInstruction;
    let issued = false;

  function populateReservationEntry(availableSlot: ReservationStation, registerFile:  registerFileEntry[] ) {
    availableSlot.busy = true;
    availableSlot.op = opcode;
    if (isRegisterAvailable(rs, fpRegisterFile))
      availableSlot.vj = getRegisterValue(rs, fpRegisterFile);
    if (isRegisterAvailable(rt, fpRegisterFile))
      availableSlot.vk = getRegisterValue(rt, fpRegisterFile);
    availableSlot.qj = getRegisterTag(rs, fpRegisterFile);
    availableSlot.qk = getRegisterTag(rt, fpRegisterFile);
    availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
    availableSlot.tag = `A${fpAddReservationStations.indexOf(availableSlot) + 1}`;

    updateRegisterTag(rd, availableSlot.tag, registerFile);
  }

  switch (opcode) {


    //=================================================================================================================//
	//												ADD/SUB                                                            //
	//=================================================================================================================//

      case Instructions.ADD_D:
      case Instructions.SUB_D: {
        const availableSlot = fpAddReservationStations.find((rs) => !rs.busy);
        if (availableSlot) {
          populateReservationEntry(availableSlot, fpRegisterFile);
          issued = true;
        }
        break;
      }
  
    //=================================================================================================================//
	//												MUL/DIV                                                            //
	//=================================================================================================================//

      case Instructions.MUL_D:
      case Instructions.DIV_D: {
        const availableSlot = fpMulReservationStations.find((rs) => !rs.busy);
        if (availableSlot) {
         populateReservationEntry(availableSlot, fpRegisterFile)
          issued = true;
        }
        break;
      }
  
    //=================================================================================================================//
	//												LOAD                                                               //
	//=================================================================================================================//

        case Instructions.LD: {
        const availableSlot = loadBuffer.find((lb) => !lb.busy);
        if (availableSlot) {
          availableSlot.busy = true;
          availableSlot.address = parseInt(rs); //di betgib el offset bas 
          availableSlot.timeRemaining = latencies[opcode];
          availableSlot.tag = `L${loadBuffer.indexOf(availableSlot) + 1}`;
  
          updateRegisterTag(rd, availableSlot.tag, fpRegisterFile);
  
          issued = true;
        }
        break;
      }
  
    //=================================================================================================================//
	//												STORE                                                              //
	//=================================================================================================================//
      case Instructions.SD: {
        const availableSlot = storeBuffer.find((sb) => !sb.busy);
        if (availableSlot) {
          availableSlot.busy = true;
          availableSlot.address = parseInt(rs);
          if (isRegisterAvailable(rt,fpRegisterFile))
            availableSlot.v = getRegisterValue(rt, fpRegisterFile);
          availableSlot.q = getRegisterTag(rt, fpRegisterFile);
          availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
          availableSlot.tag = `S${storeBuffer.indexOf(availableSlot) + 1}`;
          issued = true;
        }
        break;
      }
  
      default:
        console.error(`Opcode not found: ${opcode}`);
    }

    //=================================================================================================================//
	//												   UPDATING                                                           //
	//=================================================================================================================//
  
    if (issued) {
      const updatedInstructionTable = [...systemState.instructionTable];
      updatedInstructionTable.push({
        instruction: currentInstruction,
        issue: clockCycle,
        execution_complete: "" ,
        writeResult: -1,
      });
  
      return {
        ...systemState,
        instructionTable: updatedInstructionTable,
        pc: pc + 1,
      };
    } 
    else {
      console.log("No available slot for instruction issue.");
      return { ...systemState };
    }
  }
  