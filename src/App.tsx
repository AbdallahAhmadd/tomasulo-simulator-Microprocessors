import { useState } from 'react'
import UserInput from './components/UserInput/UserInput'
import CacheInput from './components/UserInput/cacheInput'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
function App() {


  return (
    <>
    <ToastContainer />
    <UserInput></UserInput>
    <CacheInput/>
    </>
  )
}

export default App
