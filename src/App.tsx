import TextFileParser from "./components/InstructionParser.tsx";
import React, {useState} from "react";
import FileUploader from "./components/InstructionParser.tsx";

function App() {
  const [instructionQueue, setInstructionQueue] = useState<string[]>([]);

  console.log(instructionQueue);

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

    </>
  )
}

export default App
