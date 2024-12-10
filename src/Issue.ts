
import { SystemState , Instructions } from "./types";
import { getOperandTag , getOperandValue , updateRegisterTag , mapOpcodeToLatencyKey } from "./helpers";


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
      intRegisterFile,
      pc,
      clockCycle,
      latencies,
    } = systemState;
  
    if (pc >= instructionQueue.length) {
      console.log("No more instructions to issue");
      return systemState; 
    }
  
    const currentInstruction = instructionQueue[pc];
    const { opcode, rd, rs, rt } = currentInstruction;
    let issued = false;
  
    switch (opcode) {


    //=================================================================================================================//
	//												ADD/SUB                                                            //
	//=================================================================================================================//

      case Instructions.ADD_D:
      case Instructions.SUB_D: {
        const availableSlot = fpAddReservationStations.find((rs) => !rs.busy);
        if (availableSlot) {
          availableSlot.busy = true;
          availableSlot.op = opcode;
          availableSlot.vj = getOperandValue(rs, fpRegisterFile);
          availableSlot.vk = getOperandValue(rt, fpRegisterFile);
          availableSlot.qj = getOperandTag(rs, fpRegisterFile);
          availableSlot.qk = getOperandTag(rt, fpRegisterFile);
          availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
          availableSlot.tag = `A${fpAddReservationStations.indexOf(availableSlot) + 1}`;
  
          updateRegisterTag(rd, availableSlot.tag, fpRegisterFile);
  
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
          availableSlot.busy = true;
          availableSlot.op = opcode;
          availableSlot.vj = getOperandValue(rs, fpRegisterFile);
          availableSlot.vk = getOperandValue(rt, fpRegisterFile);
          availableSlot.qj = getOperandTag(rs, fpRegisterFile);
          availableSlot.qk = getOperandTag(rt, fpRegisterFile);
          availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
          availableSlot.tag = `M${fpMulReservationStations.indexOf(availableSlot) + 1}`;
  
          updateRegisterTag(rd, availableSlot.tag, fpRegisterFile);
  
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
          availableSlot.v = getOperandValue(rt, fpRegisterFile);
          availableSlot.q = getOperandTag(rt, fpRegisterFile);
          availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
          availableSlot.tag = `S${storeBuffer.indexOf(availableSlot) + 1}`;
  
          issued = true;
        }
        break;
      }
  
      default:
        console.error(`Unsupported opcode: ${opcode}`);
    }

    //=================================================================================================================//
	//												   UPDATING                                                           //
	//=================================================================================================================//
  
    if (issued) {
      const updatedInstructionTable = [...systemState.instructionTable];
      updatedInstructionTable.push({
        instruction: currentInstruction,
        issue: clockCycle,
        execution_complete: "Didn't execute yet",
        writeResult: -1,
      });
  
      return {
        ...systemState,
        instructionTable: updatedInstructionTable,
        pc: pc + 1,
        clockCycle: clockCycle + 1, 
      };
    } 
    else {
      console.log("No available slot for instruction issue.");
      return { ...systemState, clockCycle: clockCycle + 1 }; 
    }
  }
  