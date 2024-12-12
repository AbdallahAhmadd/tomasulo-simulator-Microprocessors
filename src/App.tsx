import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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

interface ConfigurationPageProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLatancySave: (updatedLatencies: latencies) => void;
  onCacheSave: (size: number, block: number) => void;
  onFpReservationStation: (fpAdd: number, fpMul: number) => void;
  onIntReservationStation: (intAdd: number, intMul: number) => void;
  onBufferSaveConfiguration: (load: number, store: number) => void;
  onRegisterSaveConfiguration: (fpReg: number, intReg: number) => void;
  onStartExecution: () => void;
}

function ConfigurationPage({
  onFileUpload,
  onLatancySave,
  onCacheSave,
  onFpReservationStation,
  onIntReservationStation,
  onBufferSaveConfiguration,
  onRegisterSaveConfiguration,
  onStartExecution,
}: ConfigurationPageProps) {
  return (
    <div>
      <FileUploader onChange={onFileUpload} />
      <LatencyInput onSave={onLatancySave} />
      <CacheInput onSave={onCacheSave} />
      <FpReservationStationInput onSave={onFpReservationStation} />
      <IntReservationStationInput onSave={onIntReservationStation} />
      <BufferConfiguration onSave={onBufferSaveConfiguration} />
      <RegisterFileConfiguration onSave={onRegisterSaveConfiguration} />
      <div className="buttondiv">
        <button className="execution" onClick={onStartExecution}>
          Start Execution
        </button>
      </div>
    </div>
  );
}

function ExecutionPage({ systemState, instructionQueue, onForwardClick }: { systemState: SystemState | undefined, instructionQueue: string[], onForwardClick: () => void }) {
  return (
    <div>
      {systemState && (
        <ViewOutput
          systemState={systemState}
          instructionQueue={instructionQueue}
          clockCycle={systemState.clockCycle}
          onForwardClick={onForwardClick}
        />
      )}
    </div>
  );
}

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
  const [systemState, setSystemState] = useState<SystemState | undefined>(() => {
    // Load `systemState` from localStorage on app start
    const storedState = localStorage.getItem("systemState");
    return storedState ? JSON.parse(storedState) : null;
  });

  const navigate = useNavigate();

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

  const handleExecution = () => {
    if (!latencies) {
      toast.error("Please provide latency values.");
      return;
    }
    const SystemConfig: SystemConfig = {
      fpAddReservationStationsSize: fpAddReservationStationsNums,
      fpMulReservationStationsSize: fpMulReservationStationsNums,
      intAddReservationStationsSize: intAddReservationStationsNums,
      intMulReservationStationsSize: intMulReservationStationsNums,
      fpRegisterFileSize,
      intRegisterFileSize,
      loadBufferSize,
      storeBufferSize,
      cacheSize,
      blockSize,
      latencies,
    };
    const sysState = initializeSystem(instructionQueue, SystemConfig);
    setSystemState(sysState);
    localStorage.setItem("systemState", JSON.stringify(sysState)); // Persist to localStorage
    navigate("/execution");
  };

  const handleForwardClick = () => {
    setSystemState((prevState) => {
      if (!prevState) return prevState;
      const nextState = nextSystemState(prevState);
      localStorage.setItem("systemState", JSON.stringify(nextState)); // Persist updated state
      return nextState;
    });
  };

  useEffect(() => {
    console.log("System State:", systemState);
  }, [systemState]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ConfigurationPage
              onFileUpload={handleFileUpload}
              onLatancySave={handleLatancySave}
              onCacheSave={handleCacheSave}
              onFpReservationStation={handleFpReservationStation}
              onIntReservationStation={handleIntReservationStation}
              onBufferSaveConfiguration={handleBufferSaveConfiguration}
              onRegisterSaveConfiguration={handleRegisterSaveConfiguration}
              onStartExecution={handleExecution}
            />
          }
        />
        <Route
          path="/execution"
          element={
            <ExecutionPage
              systemState={systemState}
              instructionQueue={instructionQueue}
              onForwardClick={handleForwardClick}
            />
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;