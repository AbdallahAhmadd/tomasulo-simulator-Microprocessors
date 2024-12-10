import TextFileParser from "./components/InstructionParser.tsx";
import React, {useState} from "react";
import FileUploader from "./components/InstructionParser.tsx";
import UserInput from './components/UserInput/UserInput'
import CacheInput from './components/UserInput/cacheInput'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstructionTable from "./components/InstructionsTable.tsx";
function App() {
  const [instructionQueue, setInstructionQueue] = useState<string[]>([]);
  const [loadSize, setLoadSize] = useState<number>(0);
  const [storeSize, setStoreSize] = useState<number>(0);
  const [addReservationStationsNums, setAddReservationStationsNums] = useState<number>(0);
  const [mulReservationStationsNums, setMulReservationStationsNums] = useState<number>(0);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [blockSize, setBlockSize] = useState<number>(0);
  const [latencies, setLatencies] = useState<number[]>([]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContents = e.target?.result as string;

      // Process the file contents
      const lines = fileContents.split(/\r?\n/); // Split into lines
      const cleanedInstructions = lines
          .map((line) => line.replace(/,/g, '')) // Remove commas
          .filter((line) => line.length > 0); // Filter out empty lines

      setInstructionQueue(cleanedInstructions);
    };

    reader.readAsText(file); // Read the file as text
  };
  return (
      <>
        <FileUploader onChange={handleFileUpload} />
        {/*<ToastContainer />*/}
        {/*<UserInput></UserInput>*/}
        <InstructionTable />
        {/*<CacheInput/>*/}
    </>
  )
}

export default App
