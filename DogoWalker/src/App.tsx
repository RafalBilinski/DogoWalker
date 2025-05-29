import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import HomePage2 from './components/HomePage2';
import Navbar from './components/Navbar.js';



function App() {          
  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route path="/" element={<Navbar />} >
            <Route index element={<HomePage />} />
            <Route path="/home2" element={<HomePage2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
