import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config"
import { useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0)

  const docRef =doc(db, "users", "TxG1Ttj1jOCm2coM6Lxl");
  
  const getData= async () => {
    const docSnap = getDoc(docRef).then((doc) => {
    if (doc.exists()) {
      console.log("Document data:", doc.data());
    } else {
      console.log("No such document!");
    }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    console.log(docSnap);  
    }
  
  useEffect(() => {
    getData();
  }
  , []);          

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
