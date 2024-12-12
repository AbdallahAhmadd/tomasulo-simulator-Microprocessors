import {registerFileEntry, ReservationStation, SystemState} from "./types";
import {Instructions} from "./enums";
import {
  getRegisterTag,
  getRegisterValue,
  updateRegisterTag,
  mapOpcodeToLatencyKey,
  isRegisterAvailable
} from "./helpers";

//helper fn to check branch law issued aw kda
function checkBranch(systemState: SystemState): boolean {
  const {
    intAddReservationStations,
  } = systemState;
  
  for (const rs of intAddReservationStations) {
    if (rs.busy && (rs.op === Instructions.BEQ || rs.op === Instructions.BNE)) {
      return true;
    }
  }
  return false;
}

//=================================================================================================================//
//												ISSUING                                                            //
//=================================================================================================================//

export function issueInstruction(systemState: SystemState): SystemState {
    const {
      instructionQueue,
      fpAddReservationStations,
      fpMulReservationStations,
      intAddReservationStations,
      loadBuffer,
      storeBuffer,
      fpRegisterFile,
      intRegisterFile,
      pc,
      clockCycle,
      latencies,
    } = systemState;
    
    if (checkBranch(systemState)) { 
      console.log("Branch instruction is being issued or executed. Stopping issue of new instructions."); 
      return systemState; 
    }
    if (pc >= instructionQueue.length) {
      console.log("Issued All instructions");
      return systemState; 
    }
  
    const currentInstruction = instructionQueue[pc];
    const { opcode, rd, rs, rt } = currentInstruction;
    let issued = false;
  
  //hanzawed notes 
  function populateReservationEntry(
    availableSlot: ReservationStation,
    registerFile: registerFileEntry[],
    rsType: "ADD" | "MUL"| "INT",
    isBranch: boolean = false,
    isImmediate: boolean = false
  ) {
    availableSlot.busy = true;
    availableSlot.op = opcode;
  
    if (isBranch) {
      if(isRegisterAvailable(rs, intRegisterFile)){
        availableSlot.vj = getRegisterValue(rs, intRegisterFile);
      }
      if(isRegisterAvailable(rt, intRegisterFile)){
        availableSlot.vk = getRegisterValue(rt, intRegisterFile);
      }
      availableSlot.qj = isRegisterAvailable(rs, registerFile) ? "0" : getRegisterTag(rs, registerFile);
      availableSlot.qk = isRegisterAvailable(rt, registerFile) ? "0" : getRegisterTag(rt, registerFile);
      availableSlot.A = parseInt(rd); // e3tbart en rd feha el target address
    } else if (isImmediate) {
      if(isRegisterAvailable(rs, intRegisterFile)){
        availableSlot.vj = getRegisterValue(rs, intRegisterFile);
      }
      availableSlot.vk = parseInt(rt); // da el imm value el kona olna aleeh
      if(isRegisterAvailable(rs, intRegisterFile)){
        availableSlot.qj = getRegisterTag(rs, intRegisterFile);
      }
      availableSlot.qk = "0";
    } else {
      if(isRegisterAvailable(rs, registerFile)){
        availableSlot.vj = getRegisterValue(rs, registerFile);
      }
      if(isRegisterAvailable(rt, registerFile)){
        availableSlot.vk = getRegisterValue(rt, registerFile);
      }
      availableSlot.qj = isRegisterAvailable(rs, registerFile) ? "0" : getRegisterTag(rs, registerFile); //might el condition delete later
      availableSlot.qk = isRegisterAvailable(rt, registerFile) ? "0" : getRegisterTag(rt, registerFile);
    }
  
    availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
    availableSlot.tag =
      rsType === "ADD"
        ? `A${fpAddReservationStations.indexOf(availableSlot) + 1}` 
        : rsType === "MUL"
        ? `M${fpMulReservationStations.indexOf(availableSlot) + 1}` 
        :`I${intAddReservationStations.indexOf(availableSlot) + 1}`; 
  
    if (!isBranch) {
        updateRegisterTag(rd, availableSlot.tag, registerFile); 
       
    }
}
  

  switch (opcode) {

     //=================================================================================================================//
  //												INTEGER/IMMEDIATE INSTRUCTIONS                                       //
  //=================================================================================================================//
  case Instructions.DADDI:
  case Instructions.DSUBI: {
      const availableSlot = intAddReservationStations.find((rs) => !rs.busy);
      if (availableSlot) {
        populateReservationEntry(availableSlot, intRegisterFile, "INT", false, true); 
        issued = true;
      }
      break;
    }
  //=================================================================================================================//
  //												BRANCH INSTRUCTIONS                                                  //
  //=================================================================================================================//
  case Instructions.BNE:
  case Instructions.BEQ: {
    const availableSlot = intAddReservationStations.find((rs) => !rs.busy);
    if (availableSlot) {
      populateReservationEntry(availableSlot, intRegisterFile, "INT", true); 
      issued = true;
    }
    break;
  }

    //=================================================================================================================//
	//												ADD/SUB                                                            //
	//=================================================================================================================//
    case Instructions.ADD_D:
    case Instructions.SUB_D:
    case Instructions.ADD_S:
    case Instructions.SUB_S: {
      const availableSlot = fpAddReservationStations.find((rs) => !rs.busy);
      if (availableSlot) {
        populateReservationEntry(availableSlot, fpRegisterFile, "ADD"); 
        issued = true;
      }
      break;
    }
  
    //=================================================================================================================//
	//												MUL/DIV                                                            //
	//=================================================================================================================//

    case Instructions.MUL_D:
    case Instructions.DIV_D:
    case Instructions.MUL_S:
    case Instructions.DIV_S: {
      const availableSlot = fpMulReservationStations.find((rs) => !rs.busy);
      if (availableSlot) {
        populateReservationEntry(availableSlot, fpRegisterFile, "MUL"); 
        issued = true;
      }
      break;
    }
    //=================================================================================================================//
	//												LOAD                                                               //
	//=================================================================================================================//

  case Instructions.LD:
  case Instructions.LW:
  case Instructions.L_S:
  case Instructions.L_D: {
      const availableSlot = loadBuffer.find((lb) => !lb.busy);
      if (availableSlot) {
        availableSlot.busy = true;
        availableSlot.address = parseInt(rs); //beetgeb el offset bas
        availableSlot.timeRemaining = latencies[mapOpcodeToLatencyKey(opcode)];
        availableSlot.tag = `L${loadBuffer.indexOf(availableSlot) + 1}`;
        updateRegisterTag(rd, availableSlot.tag, fpRegisterFile); 
        issued = true;
      }
      break;
    }
  
    //=================================================================================================================//
	//												STORE                                                              //
	//=================================================================================================================//
      case Instructions.SD:
      case Instructions.SW:
      case Instructions.S_S:
      case Instructions.S_D: {
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
  