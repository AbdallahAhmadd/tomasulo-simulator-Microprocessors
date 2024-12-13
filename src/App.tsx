import React, { useEffect, useState } from "react";
import FileUploader from "./components/InstructionParser.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LatencyInput from "../src/components/UserInput/LatencyInput.tsx";
import { latencies, SystemConfig, SystemState } from "./types";
import CacheInput from "./components/UserInput/cacheInput.tsx";
import FpReservationStationInput from "./components/UserInput/FpReservationStations.tsx";
import IntReservationStationInput from "./components/UserInput/IntReservationStations.tsx";
import BufferConfiguration from "./components/UserInput/BufferConfiguration.tsx";
import RegisterFileConfiguration from "./components/UserInput/RegisterFileConfiguration.tsx";
import { initializeSystem, nextSystemState } from "./simulator.ts";
import { ViewOutput } from "./components/viewOutput/viewOutput.tsx";

function App() {
  const [instructionQueue, setInstructionQueue] = useState<string[]>([]);
  const [fpAddReservationStationsNums, setfpAddReservationStationsNums] = useState<number>(0);
  const [fpMulReservationStationsNums, setfpMulReservationStationsNums] = useState<number>(0);
  const [intAddReservationStationsNums, setIntAddReservationStationsNums] = useState<number>(0);
  const [intMulReservationStationsNums, setIntMulReservationStationsNums] = useState<number>(0);
  const [loadBufferSize, setLoadBufferSize] = useState<number>(0);
  const [storeBufferSize, setStoreBufferSize] = useState<number>(0);
  const [fpRegisterFileSize, setfpRegisterFileSize] = useState<number>(0);
  const [intRegisterFileSize, setIntRegisterFileSize] = useState<number>(0);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [blockSize, setBlockSize] = useState<number>(0);
  const [latencies, setLatencies] = useState<latencies>();
  const [systemState, setSystemState] = useState<SystemState>();

  const handleLatancySave = (updatedLatencies: latencies) => {
    console.log("Received latencies:", updatedLatencies);
    setLatencies(updatedLatencies);
  };
  const handleCacheSave = (size: number, block: number) => {
    setCacheSize(size);
    setBlockSize(block);
    console.log(`Cache Size: ${size}, Block Size: ${block}`);
  };
  const handleFpReservationStation = (fpAdd: number, fpMul: number) => {
    setfpAddReservationStationsNums(fpAdd);
    setfpMulReservationStationsNums(fpMul);
    console.log(`Reservation Station: ${fpAdd}, FpMul: ${fpMul}`);
  };
  const handleIntReservationStation = (intAdd: number, intMul: number) => {
    setIntAddReservationStationsNums(intAdd);
    setIntMulReservationStationsNums(intMul);
    console.log(`Reservation Station: ${intAdd}, IntMul: ${intMul}`);
  };
  const handleBufferSaveConfiguration = (load: number, store: number) => {
    setLoadBufferSize(load);
    setStoreBufferSize(store);
    console.log(`Load Buffer Size: ${load}, Store Buffer Size: ${store}`);
  };

  const handleRegisterSaveConfiguration = (fpReg: number, intReg: number) => {
    setIntRegisterFileSize(intReg);
    setfpRegisterFileSize(fpReg);
    console.log(`Load Register File Size: ${intReg}, Store Register File Size: ${fpReg}`);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContents = e.target?.result as string;

      // Process the file contents
      const lines = fileContents.split(/\r?\n/); // Split into lines
      const cleanedInstructions = lines
        .map((line) => line.replace(/,/g, "")) // Remove commas
        .filter((line) => line.length > 0); // Filter out empty lines

      setInstructionQueue(cleanedInstructions);
    };

    reader.readAsText(file);
  };

  const [showExecutionPage, setShowExecutionPage] = useState(false);

  const handleExecution = () => {
    if (!latencies) {
      toast.error("Please provide latency values.");
      return;
    }
    const SystemConfig: SystemConfig = {
      fpAddReservationStationsSize: fpAddReservationStationsNums,
      fpMulReservationStationsSize: fpMulReservationStationsNums,
      intAddReservationStationsSize: intAddReservationStationsNums,
      fpRegisterFileSize,
      intRegisterFileSize,
      loadBufferSize,
      storeBufferSize,
      cacheSize,
      blockSize,
      latencies,
    };
    // const SystemConfig: SystemConfig = {
    //   fpAddReservationStationsSize: 2,
    //   fpMulReservationStationsSize: 2,
    //   intAddReservationStationsSize: 2,
    //   fpRegisterFileSize: 12,
    //   intRegisterFileSize: 12,
    //   loadBufferSize: 7,
    //   storeBufferSize: 2,
    //   cacheSize: 128,
    //   blockSize: 32,
    //   latencies: {
    //     ADD_D: 3,
    //     ADD_S: 2,
    //     BNE: 2,
    //     BEQ: 2,
    //     DADDI: 2,
    //     DSUBI: 2,
    //     DIV_D: 2,
    //     DIV_S: 2,
    //     LD: 2,
    //     LW: 2,
    //     L_S: 2,
    //     L_D: 2,
    //     MUL_D: 2,
    //     MUL_S: 2,
    //     SD: 2,
    //     S_S: 2,
    //     S_D: 2,
    //     SUB_D: 2,
    //     SUB_S: 2,
    //     SW: 2,
    //   },
    // };
    const sysState = initializeSystem(instructionQueue, SystemConfig);
    console.log("System state", sysState);
    //for testing purposes only (populating memory and registers)
    sysState.memory.write(24, 6.5, 8, true);
    sysState.memory.write(16, 5.5, 8, true);
    sysState.memory.write(8, 4.5, 8, true);
    sysState.memory.write(0, 3.5, 8, true);
    for (let i = 0; i < 11; i++) {
      sysState.fpRegisterFile[i].value = i * 1.5;
    }
    for (let i = 3; i < 11; i++) {
      sysState.intRegisterFile[i].value = i;
    }
    setSystemState(sysState);
    console.log("SystemConfig:", SystemConfig);
    console.log("System State: ", sysState);
    setShowExecutionPage(true);
  };
  function handleForwardClick() {
    setSystemState((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        clockCycle: prevState.clockCycle + 1, // Increment clockCycle
      };
    });

    if (systemState) {
      setSystemState(nextSystemState(systemState));
    }
  }

  return (
    <>
      {!showExecutionPage ? (
        <div>
          <FileUploader onChange={handleFileUpload} />
          <LatencyInput onSave={handleLatancySave} />
          <CacheInput onSave={handleCacheSave} />
          <FpReservationStationInput onSave={handleFpReservationStation} />
          <IntReservationStationInput onSave={handleIntReservationStation} />
          <BufferConfiguration onSave={handleBufferSaveConfiguration} />
          <RegisterFileConfiguration onSave={handleRegisterSaveConfiguration} />
          <div className="buttondiv">
            <button className="execution" onClick={handleExecution}>
              Start Execution
            </button>
          </div>
        </div>
      ) : (
        <>
          {systemState && (
            <ViewOutput
              systemState={systemState}
              instructionQueue={instructionQueue}
              clockCycle={systemState.clockCycle}
              onForwardClick={handleForwardClick}
            />
          )}
        </>
      )}

      <ToastContainer />
    </>
  );
}

export default App;
