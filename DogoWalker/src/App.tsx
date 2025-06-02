import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from "firebase/auth";
import HomePage from './components/HomePage';
import HomePage2 from './components/HomePage2';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';





function App() {          
  return (
    <AuthProvider>
      <BrowserRouter> 
        <Routes>
          <Route path="/" element={<Navbar />} >
            <Route index element={<HomePage />} />
            <Route path="/home2" element={<HomePage2 />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
