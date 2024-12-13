import {
  LoadBuffer,
  registerFileEntry,
  ReservationStation,
  StoreBuffer,
  SystemState,
} from "./types";
import { Instructions } from "./enums";
import {
  getRegisterTag,
  getRegisterValue,
  updateRegisterTag,
  isRegisterAvailable,
} from "./helpers";

//helper fn to check branch law issued aw kda
function checkBranch(systemState: SystemState): boolean {
  const { intAddReservationStations } = systemState;

  for (const rs of intAddReservationStations) {
    if (!rs.result && (rs.op === Instructions.BEQ || rs.op === Instructions.BNE)) {
      return true;
    }
  }
  return false;
}

//=================================================================================================================//
//												ISSUING                                                            //
//=================================================================================================================//

export function issueInstruction(systemState: SystemState): void {
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
    notes,
  } = systemState;

  if (checkBranch(systemState)) {
    console.log(
      "Branch instruction is being issued or executed. Stopping issue of new instructions.",
    );
    notes.push("Branch instruction is being issued or executed. Stopping issue of new instructions.");
    return;
  }
  if (pc >= instructionQueue.length) {
    console.log("Issued All instructions");
    notes.push("Issued All Instructions");
    return;
  }

  const currentInstruction = instructionQueue[pc];
  const { opcode, rd, rs, rt } = currentInstruction;
  let issued = false;

  function populateLoadBufferEntry(availableSlot: LoadBuffer, registerFile: registerFileEntry[]) {
    availableSlot.busy = true;
    availableSlot.op = opcode;
    if (isNaN(Number(rs))) {
      if (isRegisterAvailable(rs, intRegisterFile))
        availableSlot.address = getRegisterValue(rs, intRegisterFile);
      else {
        availableSlot.q = getRegisterTag(rs, intRegisterFile);
      }
    } else availableSlot.address = parseInt(rs);
    availableSlot.tag = `L${loadBuffer.indexOf(availableSlot) + 1}`;
    updateRegisterTag(rd, availableSlot.tag, registerFile);
    availableSlot.instructionTableIndex = systemState.instructionTable.length;
    issued = true;
  }

  function populateStoreBufferEntry(availableSlot: StoreBuffer, registerFile: registerFileEntry[]) {
    availableSlot.busy = true;
    availableSlot.op = opcode;
    if (isNaN(Number(rs))) {
      if (isRegisterAvailable(rs, intRegisterFile))
        availableSlot.address = getRegisterValue(rs, intRegisterFile);
      else {
        availableSlot.qk = getRegisterTag(rs, intRegisterFile);
      }
    } else availableSlot.address = parseInt(rs);
    if (isRegisterAvailable(rd, registerFile)) availableSlot.v = getRegisterValue(rd, registerFile);
    availableSlot.qj = getRegisterTag(rd, registerFile);
    availableSlot.tag = `S${storeBuffer.indexOf(availableSlot) + 1}`;
    availableSlot.instructionTableIndex = systemState.instructionTable.length;
    issued = true;
  }

  function populateReservationEntry(
    availableSlot: ReservationStation,
    registerFile: registerFileEntry[],
    rsType: "ADD" | "MUL" | "INT",
    isBranch: boolean = false,
    isImmediate: boolean = false,
  ) {
    availableSlot.busy = true;
    availableSlot.op = opcode;

    if (isBranch) {
      if (isRegisterAvailable(rs, intRegisterFile)) {
        availableSlot.vj = getRegisterValue(rs, intRegisterFile);
      }
      if (isRegisterAvailable(rt, intRegisterFile)) {
        availableSlot.vk = getRegisterValue(rt, intRegisterFile);
      }
      availableSlot.qj = getRegisterTag(rs, registerFile);
      availableSlot.qk = getRegisterTag(rt, registerFile);
      availableSlot.A = parseInt(rd); // e3tbart en rd feha el target address
    } else if (isImmediate) {
      if (isRegisterAvailable(rs, intRegisterFile)) {
        availableSlot.vj = getRegisterValue(rs, intRegisterFile);
      }
      availableSlot.vk = parseInt(rt); // da el imm value el kona olna aleeh
      availableSlot.qj = getRegisterTag(rs, intRegisterFile);
      availableSlot.qk = "0";
    } else {
      if (isRegisterAvailable(rs, registerFile)) {
        availableSlot.vj = getRegisterValue(rs, registerFile);
      }
      if (isRegisterAvailable(rt, registerFile)) {
        availableSlot.vk = getRegisterValue(rt, registerFile);
      }
      availableSlot.qj = getRegisterTag(rs, registerFile);
      availableSlot.qk = getRegisterTag(rt, registerFile);
    }
    availableSlot.tag =
      rsType === "ADD"
        ? `A${fpAddReservationStations.indexOf(availableSlot) + 1}`
        : rsType === "MUL"
          ? `M${fpMulReservationStations.indexOf(availableSlot) + 1}`
          : `I${intAddReservationStations.indexOf(availableSlot) + 1}`;

    if (!isBranch) {
      updateRegisterTag(rd, availableSlot.tag, registerFile);
    }
    availableSlot.instructionTableIndex = systemState.instructionTable.length;
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
      const availableSlot = loadBuffer.find((lb) => !lb.busy);
      if (availableSlot) {
        populateLoadBufferEntry(availableSlot, intRegisterFile);
      }
      break;
    case Instructions.L_S:
    case Instructions.L_D: {
      const availableSlot = loadBuffer.find((lb) => !lb.busy);
      if (availableSlot) {
        populateLoadBufferEntry(availableSlot, fpRegisterFile);
      }
      break;
    }

    //=================================================================================================================//
    //												STORE                                                              //
    //=================================================================================================================//
    case Instructions.SD:
    case Instructions.SW: {
      const availableSlot = storeBuffer.find((sb) => !sb.busy);
      if (availableSlot) {
        populateStoreBufferEntry(availableSlot, intRegisterFile);
      }
      break;
    }
    case Instructions.S_S:
    case Instructions.S_D: {
      const availableSlot = storeBuffer.find((sb) => !sb.busy);
      if (availableSlot) {
        populateStoreBufferEntry(availableSlot, fpRegisterFile);
      }
      break;
    }

    default:
      console.error(`Opcode not found: ${opcode}`);
  }

  //=================================================================================================================//
  //												   UPDATING                                                           //
  //=================================================================================================================//
  console.log(issued);
  if (issued) {
    notes.push(`${opcode} is issued`);
    const updatedInstructionTable = [...systemState.instructionTable];
    updatedInstructionTable.push({
      instruction: currentInstruction,
      issue: clockCycle,
    });

    systemState.instructionTable = updatedInstructionTable;
    systemState.pc++;
  } else {
    console.log("No available slot for instruction issue.");
  }
}
