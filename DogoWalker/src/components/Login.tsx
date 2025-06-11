import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [register, setRegister] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("personal"); // Default account type

  // Get auth context values
  const { currentUser, handleLogin, handleRegister } = useAuth();
  const navigate = useNavigate();

  const toggleRegister = () => {
    setRegister(!register);
    setError(""); // Clear any existing errors when toggling
    setShowPassword(false); // Reset password visibility
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
      await handleRegister(email, password, name, surname, phone, accountType, nickname);
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
    <div className="flex flex-col h-fit mx-0.5 md:mx-auto w-full max-w-[600px] 
    py-5 items-center justify-center bg-gradient-to-br from-primary to-secondary 
    text-white rounded-lg shadow-2xl outline-1 outline-white min-w:0 min-h:0">
      <div
        id="login-register-container"
        className={`mx-2 duration-500 transition-all sm:min-w-[350px] 
        ${register ? `opacity-100 h-auto ` : `opacity-0 h-0 overflow-hidden `} `}
      >
        <form
          onSubmit={registerHandler}
          className="bg-gray-500 p-6 rounded shadow-md max-w-[400px] w-full"
        >
          <h2 className="text-2xl mb-4">Register</h2>

          <div className="mb-4">
            <label htmlFor="register-email" className=" text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-password" className="login-form-input-label">
              Password
            </label>
            <div className="login-form-input-password">
              <input
                title="Password, must be at least 8 characters long"
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-full p-2"
                required
                
              />
              <span
                className="flex items-center mx-0.5 cursor-pointer"
                onClick={toggleShowPassword}
              >
                <i className="material-icons inline-block">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </i>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="register-name" className="text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-surname" className=" text-sm font-medium mb-1">
              Surname
            </label>
            <input
              id="register-surname"
              type="text"
              placeholder="Enter your surname"
              value={surname}
              onChange={e => setSurname(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-nickname" className="text-sm font-medium mb-1">
              Nickname (Optional)
            </label>
            <input
              id="register-nickname"
              type="text"
              placeholder="Enter your nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="login-form-input"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-phone" className=" text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              id="register-phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Register
          </button>
        </form>
        <div className="flex flex-col items-center my-2 mx-auto">
          <span className=" my-4 text-shadow-2xs text-shadow-black text-xl">
            Already have account?{" "}
          </span>
          <button
            className="w-38 mx-4 px-4 py-4
            text-black rounded-md bg-white shadow-xl
            hover:transition-all hover:duration-500 hover:ping-2 hover:scale-105"
            onClick={toggleRegister}
          >
            Log in!
          </button>
        </div>
      </div>

      <div
        id="login-container"
        className={`mx-2 duration-500 transition-all min-w-[300px] sm:min-w-[350px] 
        ${!register ? `opacity-100 h-auto ` : `opacity-0 h-0 overflow-hidden `} `}
      >
        <form
          onSubmit={loginHandler}
          className="mx-2 bg-gray-500 p-6 rounded shadow-md max-w-[400px] w-full"
        >
          <h2 className="text-2xl mb-4">Login</h2>

          <div className="mb-4">
            <label htmlFor="login-email" className="text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="text-sm font-medium mb-1">
              Password
            </label>
            <div className="flex login-form-input">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full"
                required
              />
              <span
                className="flex items-center mx-0.5 cursor-pointer"
                onClick={toggleShowPassword}
              >
                <i className="material-icons inline-block">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </i>
              </span>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
        <div className="flex flex-col items-center my-2 mx-auto">
          <span className=" my-4 text-shadow-2xs text-shadow-black text-xl">
            Don't have account yet?{" "}
          </span>
          <button
            className="w-38 mx-4 px-4 py-4
            text-black rounded-md bg-white shadow-xl
            hover:transition-all hover:duration-500 hover:ping-2 hover:scale-105"
            onClick={toggleRegister}
          >
            Register Now!
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
