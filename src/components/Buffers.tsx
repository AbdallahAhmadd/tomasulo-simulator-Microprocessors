import React, { useState } from "react";
import {LoadBuffer, StoreBuffer} from "../types";
import { initializeLoadBuffer } from "../helpers";
import { initializeStoreBuffer } from "../helpers";


  
const LoadAndStoreSimulator: React.FunctionComponent = () => {


  const [loadBuffer, setLoadBuffer] = useState<LoadBuffer[]>([]);
  const [storeBuffer, setStoreBuffer] = useState<StoreBuffer[]>([]);



  const createLoadBuffer = () => {
    setLoadBuffer(initializeLoadBuffer(loadSize));
  };

  const createStoreBuffer = () => {
    setStoreBuffer(initializeStoreBuffer(storeSize));
  };

  return (
    <div>

      <div>
        <label htmlFor="Load-Buffer-size">Load Buffer Station Size: </label>
        <input
          id="Load-Buffer-size"
          type="number"
          value={loadSize}
          onChange={(e) => setLoadSize(parseInt(e.target.value, 10) || 0)}
          min="0"
        />
        <button onClick={createLoadBuffer}>Create Load Buffer</button>
      </div>

      <div>
        <label htmlFor="Store-Buffer-size">Store Buffer Size: </label>
        <input
          id="Store-Buffer-size"
          type="number"
          value={storeSize}
          onChange={(e) => setStoreSize(parseInt(e.target.value, 10) || 0)}
          min="0"
        />
        <button onClick={createStoreBuffer}>Create Store Buffer</button>
      </div>

      {loadBuffer.length > 0 && (
        <div>
          <h2>Load Buffer</h2>
          <ul>
            {loadBuffer.map((station, index) => (
              <li key={index}>
                {station.tag}: {station.busy ? "Busy" : "Free"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {storeBuffer.length > 0 && (
        <div>
          <h2>Store Buffer</h2>
          <ul>
            {storeBuffer.map((station, index) => (
              <li key={index}>
                {station.tag}: {station.busy ? "Busy" : "Free"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoadAndStoreSimulator;
