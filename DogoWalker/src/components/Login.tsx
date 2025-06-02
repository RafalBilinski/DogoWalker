import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [register, setRegister] = useState<Boolean>(false);
  
  // Get auth context values
  const { currentUser, handleLogin, handleRegister } = useAuth();
  const navigate = useNavigate();

  const toggleRegister = () => {
    setRegister(!register);
    setError(""); // Clear any existing errors when toggling
  };

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    }
  };

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleRegister(email, password, name, surname, nickname);
    } catch (err: any) {
      console.error("Register error:", err);
      setError(err.message || "Registration failed");
    }
  };

  // Redirect if user is logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/home2"); // Redirect to home 
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col mx-0.5 md:mx-auto w-full md:w-fit py-5 items-center justify-center h-[calc(100vh-6rem)] bg-gradient-to-br from-primary to-secondary  text-white rounded-lg shadow-2xl outline-1 outline-white">
      {!register ? (
        <>
        <form
          onSubmit={loginHandler}
          className=" bg-gray-500 p-6 rounded shadow-md"
        >
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
        <div className="flex  items-center">
          <span className=" my-4 text-shadow-2xs text-shadow-black text-xl">Don't have account yet? </span>
          <button className=" w-38  hover:transition hover:duration-500 hover:pulse mx-4 px-4 py-4 text-black rounded-md bg-white shadow-xl" onClick={toggleRegister}>
          Register Now!
          </button>
        </div>
        </>
      ) : (
        <form
          onSubmit={registerHandler}
          className=" bg-gray-600 p-6 rounded shadow-md"
        >
          <h2 className="text-2xl mb-4">Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="string"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="string"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <input
            type="string"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 mb-4 w-full"
          />
          <input
            type="number"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Register
          </button>
        </form>
      )}

    </div>
  );
};
export default Login;
