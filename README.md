# Tomasulo Simulator Development Report

## 1. Introduction
- **Overview**: This report provides an overview of the Tomasulo simulator project.
- **Objective**: To simulate the Tomasulo algorithm for dynamic scheduling of instructions to enhance instruction-level parallelism.
- **Key Features**:
  - Instruction issue, execution, and write-back stages.
  - Reservation stations for managing instruction dependencies.
  - Load and store buffers for memory operations.
  - Separate floating-point and integer register files.
- **Technologies Used**:
  - React for user interface development.
  - TypeScript for logic and type safety.
  - Material-UI for consistent and responsive styling.

---

## 2. Approach

### 2.1 Analyzing Tomasulo Components
1. **Main Reservation Stations**:
   - **FP Reservation Stations for Add and Subtract**:
     - Handles floating-point addition and subtraction operations.
   - **FP Reservation Stations for Multiply and Divide**:
     - Handles floating-point multiplication and division operations.
   - **INT Reservation Station for Add and Subtract**:
     - Handles integer addition and subtraction operations.
   - **INT Reservation Station for Multiply and Divide**:
     - Handles integer multiplication and division operations.
2. **Memory**:
   - Consists of 1024 bytes for data storage and retrieval.
3. **Configurable Cache**:
   - Provides options for:
     - Cache size (in bytes).
     - Block size (in bytes).
4. **Register Files**:
   - **Floating-point Register File**: Dedicated for FP operations.
   - **Integer Register File**: Dedicated for integer operations.
5. **Load Buffer**:
   - Facilitates memory load operations.
6. **Store Buffer**:
   - Manages memory store operations.

---

### 2.2 Design and Architecture
- **Frontend**:
  - Developed using React for an interactive and dynamic user interface.
  - Ensures real-time updates during the simulation process.
- **Core Simulation Logic**:
  - Written in TypeScript to leverage strong typing and improve maintainability.
  - Key functionalities:
    - `initializeSystem`: Prepares the system based on user configuration.
    - `nextSystemState`: Advances the simulation by one clock cycle, handling instruction issue, execution, and write-back stages.

---

# Code Structure

## Key Components

### ExecutionPage.tsx
- **Purpose**: Displays the simulation’s current state, including reservation stations, buffers, and the clock cycle.
- **Features**:
  - Contains a forward button to proceed to the next clock cycle.

---

### ViewOutput.tsx
- **Purpose**: A reusable component for visualizing the system state.
- **Features**:
  - Displays various components like the instruction queue, reservation stations, buffers, and clock cycle.

---

### Helpers

#### helpers.ts
- **Purpose**: Contains utility functions for operations related to registers and reservation stations.

---

### Utility Functions

#### **`parseInstructions`**
- **Description**: Parses instructions from string input (e.g., file uploads) into a structured format.
- **Functionality**:
  - Splits strings by spaces to assign `rd`, `rs`, `rt`, and `opcode`.
  - Handles labels (instructions with `:`) by adding the label to the `labelAddress` field.
  - For branch instructions (`BEQ`, `BNE`), swaps `rd` and `rt` for correct interpretation (`rd` represents the target label address).

---

### Initialization Functions

#### **`initializeLoadBuffer`**
- **Description**: Creates an array of `LoadBuffer` objects.
- **Input**: 
  - `size`: Number of load buffers to initialize.
- **Output**: Array of initialized `LoadBuffer` objects.

#### **`initializeStoreBuffer`**
- **Description**: Creates an array of `StoreBuffer` objects.
- **Input**: 
  - `size`: Number of store buffers to initialize.
- **Output**: Array of initialized `StoreBuffer` objects.

#### **`initializeReservationStations`**
- **Description**: Creates an array of `ReservationStation` objects.
- **Input**: 
  - `size`: Number of reservation stations to initialize.
  - `tag`: Tag to categorize the station (`M`, `I`, `A`).
- **Output**: Array of initialized `ReservationStation` objects.

#### **`initializeRegisterFile`**
- **Description**: Creates a register file.
- **Input**: 
  - `size`: Number of registers.
  - `tag`: Prefix for register names (`R` for integer, `F` for floating-point).
- **Output**: Array of `registerFileEntry` objects.

---

### Register Operations

#### **`isRegisterAvailable`**
- **Description**: Checks if a specific register is available (not waiting for a result).
- **Output**: Returns `true` if the register is available, `false` otherwise.

#### **`getRegisterValue`**
- **Description**: Retrieves the current value stored in a given register.

#### **`getRegisterTag`**
- **Description**: Fetches the tag (`Q`) associated with a specific register.

#### **`updateRegisterTag`**
- **Description**: Updates the tag (`Q`) for a given register.

---

### Broadcasting Functions

#### **`broadcastResult`**
- **Description**: Updates reservation stations with the broadcasted value.
- **Functionality**:
  - Replaces tags (`Qj`, `Qk`) in reservation stations matching the input tag with the input value.

#### **`updateRegisterFiles`**
- **Description**: Updates the register file with the broadcasted result.
- **Functionality**:
  - Replaces tags (`Q`) in registers matching the input tag with the input value.

---

# Approach

The Tomasulo simulator is designed with a centralized `SystemState` type, which represents the entire architecture's state at any given clock cycle. The `SystemState` object includes the following components:

## **SystemState Structure**
- **`instructionQueue`**: The queue of instructions to be executed.
- **`fpAddReservationStations`**: Floating-point reservation stations for addition and subtraction.
- **`fpMulReservationStations`**: Floating-point reservation stations for multiplication and division.
- **`intAddReservationStations`**: Integer reservation stations for addition and subtraction.
- **`loadBuffer`**: Array of load buffers.
- **`storeBuffer`**: Array of store buffers.
- **`fpRegisterFile`**: Floating-point register file.
- **`intRegisterFile`**: Integer register file.
- **`CDB`**: Centralized data bus for broadcasting results.
- **`memory`**: Represents the system memory.
- **`cache`**: Configurable cache structure.
- **`instructionTable`**: Table tracking issued, executed, and written-back instructions.
- **`clockCycle`**: Current clock cycle of the simulation.
- **`pc`**: Program counter, pointing to the next instruction to be issued.
- **`latencies`**: Instruction latency values.
- **`notes`**: Array for recording notable events during simulation.

---

## **Clock Cycle Updates**

Each clock cycle updates the `SystemState` dynamically through a central function:

### **`nextSystemState`**
- **Purpose**: Updates the system state for the current clock cycle.
- **Input**: Takes the current `SystemState` as input.
- **Process**:
  1. **Issue Instructions Function**:
    
  2. **Execute Instructions Function**:
    
  3. **Write Back Results Function**:
     

- **Output**: Returns the updated `SystemState` after completing the three phases (`issueInstruction`, `execute`, `writeBack`).


---

## **Issue Function**

1. **Fetch Instruction**:
   - The instruction is fetched from the `instructionQueue` using the `pc` value.

2. **Component Identification**:
   - The opcode of the instruction is analyzed to determine which reservation station or buffer is required:
     - **Floating-Point Reservation Stations**: For floating-point operations like `ADD.D`, `SUB.D`, `MUL.D`, and `DIV.D`.
     - **Integer Reservation Stations**: For integer operations like `DADDI`, `DSUBI`, and branch instructions (`BEQ`, `BNE`).
     - **Load Buffer**: For load instructions like `LW`, `LD`.
     - **Store Buffer**: For store instructions like `SW`, `SD`.

3. **Availability Check**:
   - The function checks if there is an available slot in the corresponding reservation station or buffer:
     - If an available slot exists:
       - The fields of the station or buffer are updated based on the instruction entry.
     - If no slot is available:
       - The instruction is not issued in the current cycle.

4. **Instruction Table Update**:
   - When an instruction is successfully issued:
     - The `instructionTable` is updated with the instruction details.
     - The `pc` is incremented to point to the next instruction in the queue.

5. **No Issue Scenario**:
   - If no available slots are found for the instruction:
     - The function exits without making any changes, and the instruction remains in the queue.

---

## **Execute Function**

### **Regarding the Reservation Stations**

The execution logic for reservation stations involves checking each station to determine if it is ready for execution based on its dependencies and state:

1. **Initial Check**:
   - Each reservation station is checked to see if it is `busy` and both `Qj` and `Qk` are `0`. This indicates that the reservation station has no dependencies and is ready for execution.

2. **Current Cycle Check**:
   - If the instruction is issued in the current cycle, no operation is performed, and the function returns.

3. **Latency Initialization**:
   - If `timeRemaining` is `undefined`, it is initialized with the latency corresponding to the operation (`opcode`).
   - The instruction table is updated:
     - **Execute Start Time**: Set to the current clock cycle.
     - **Execute End Time**: Calculated as `current clock cycle + latency - 1`.

4. **Execution Process**:
   - If `timeRemaining === 1`:
     - The instruction is executed, performing the ALU operation, and the result is stored in the `result` field of the reservation station.
   - If `timeRemaining > 1`:
     - `timeRemaining` is decremented by 1.

### **Additional Checks for Integer Reservation Stations**
- For integer reservation stations, if the `opcode` is `BEQ` or `BNE`:
  - The branch condition is calculated, and the result is checked against zero.
  - Depending on the result, the `pc` (program counter) is updated accordingly.

---

### **Regarding Loads and Stores**

1. **Initial Check**:
   - Each buffer (load or store) is checked to see if it is `busy` and `Q` is `0`. This indicates that the buffer has no dependencies and is ready for execution.

2. **Latency Initialization**:
   - If `timeRemaining` is `undefined`, it is initialized with the latency of the instruction.

3. **Execution Process**:
   - If `timeRemaining === 1`:
     - For **load instructions**:
       - The value is fetched from the cache. 
       - **Cache Miss**: If the value is not in the cache, `timeRemaining` is increased to 2.
       - **Cache Hit**: If the value is in the cache, it is read, stored in the buffer's `result` field, and `timeRemaining` is set to 0.
     - For **store instructions**:
       - The value is written to the cache.

---
## **Write Back Function**

1. **Identify Completed Instructions**:
   - Loop through all reservation stations and check for the following conditions:
     - The `result` field is not empty, indicating the instruction has completed execution.
     - The reservation station is marked as `busy`.
     - `timeRemaining` is `0`, meaning the instruction has finished execution.
     - The current clock cycle is greater than the cycle when execution finished.
   - Instructions meeting these criteria are added to an array of "finished instructions."

2. **Handling Multiple Completed Instructions**:
   - If more than one instruction is ready to be written back, the following fallback mechanism is applied:

   - **Dependency Count**:
     - Loop through all reservation stations and buffers.
     - Check if `Qj` or `Qk` matches the tag of a finished instruction (e.g., `M1`, `A1`).
     - Increment the dependency count for each instruction based on these matches.

   - **Select Instruction to Write Back**:
     - The instruction with the **maximum number of dependencies** is prioritized for write-back.
     - **Tiebreaker**: If multiple instructions have the same number of dependencies, the instruction with the **earliest issue time** is selected.

3. **Broadcast Results**:
   - The selected instruction is pushed to the CDB.
   
   - Its result is broadcasted to:
     - Reservation stations (`Qj`, `Qk` fields).
     - Buffers (`Q` fields).
     - Register files (`Q` field).
    - The instruction it self is removed form the station by setting busy to `false` and deleting the timeRemaining












---
