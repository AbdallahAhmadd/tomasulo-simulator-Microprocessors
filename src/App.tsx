import React, {useState} from "react";
import FileUploader from "./components/InstructionParser.tsx";
import "react-toastify/dist/ReactToastify.css";
import InstructionTable from "./components/InstructionsTable.tsx";
function App() {
  const [instructionQueue, setInstructionQueue] = useState<string[]>([]);
  const [fpAddReservationStationsNums, setfpAddReservationStationsNums] = useState<number>(0);
  const [fpMulReservationStationsNums, setfpMulReservationStationsNums] = useState<number>(0);
  const [intAddReservationStationsNums, setIntAddReservationStationsNums]= useState()
  const [intMulReservationStationsNums, setIntMulReservationStationsNums]= useState()
  const [loadBufferSize, setLoadBufferSize] = useState<number>(0);
  const [storeBufferSize, setStoreBufferSize] = useState<number>(0);
  const [fpRegisterFileSize, setfpRegisterFileSize] = useState<number>(0);
  const [intRegisterFileSize, setIntRegisterFileSize] = useState<number>(0);
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
        <div>
        <FileUploader onChange={handleFileUpload} />
        {/*<ToastContainer />*/}
        {/*<UserInput></UserInput>*/}
        <InstructionTable />
        {/*<CacheInput/>*/}
        </div>
    </>
  )
}

export default App
