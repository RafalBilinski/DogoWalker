import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState(""); // Phone number can be null initially
  const [error, setError] = useState("");
  const [register, setRegister] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("personal"); // Default account type
  const [userCountry, setUserCountry] = useState("pl"); // Default to Poland
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
      const stringErr = String(err);
      console.error("Login error:", stringErr);
      setError(stringErr || "Invalid email or password.");
      console.log("Error details passed to state:", error);
    }
  };

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleRegister(email, password, name, lastName, phone, accountType, nickname);
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

  // Clear error message after a short delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000); // Clear error after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Get user's country code using the Geolocation API  TODO: move to backend
  /*useEffect(() => {
    fetch("https://ipapi.com/json/")
      .then(response => response.json())
      .then(data => {
        setUserCountry(data.country_code.toLowerCase());
        console.log("User country code:", data.country_code);
      })
      .catch(error => {
        console.error("Error fetching location:", error);
      });
  }, []);*/

  return (
    <div
      className="flex flex-col h-fit mx-0.5 md:mx-auto w-full max-w-[600px] 
    py-5 items-center justify-center bg-gradient-to-br from-primary to-secondary 
    text-white rounded-lg shadow-2xl outline-1 outline-white min-w:0 min-h:0"
    >
      <div
        id="login-register-container"
        className={`mx-2 duration-700 transition-all sm:min-w-[350px] overflow-hidden
        ${register ? `opacity-100 h-auto ` : `opacity-0 h-0  `} `}
      >
        <form
          onSubmit={registerHandler}
          className="bg-gray-500 p-6 rounded shadow-md max-w-[400px] "
        >
          <h2 className="text-2xl mb-4">Register</h2>

          <div className="mb-4">
            <label htmlFor="register-email" className=" text-sm font-medium mb-1">
              Email*
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-form-input"
              required
              autoComplete="email"
              autoFocus={!!register}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-password" className="login-form-input-label">
              Password*
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
                autoComplete="new-password"
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
              Name*
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
            <label htmlFor="register-last-name" className=" text-sm font-medium mb-1">
              Last name*
            </label>
            <input
              id="register-last-name"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={e => setlastName(e.target.value)}
              className="login-form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-account-type" className="text-sm font-medium mb-1">
              Account Type*
            </label>
            <div className="login-form-input">
              <div className="flex items-center space-x-4">
                <div>
                  <input
                    id="personal"
                    type="radio"
                    name="accountType"
                    value="personal"
                    checked={accountType === "personal"}
                    onChange={e => setAccountType(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="professional">Personal</label>
                </div>
                <div>
                  <input
                    id="business"
                    type="radio"
                    name="accountType"
                    value="business"
                    checked={accountType === "business"}
                    onChange={e => setAccountType(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="business">Business</label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 login-form-input">
            <label htmlFor="register-phone" className=" text-sm font-medium mb-1">
              Phone Number*
            </label>
            <PhoneInput
              country={userCountry} // default country - change to your preference
              value={phone}
              onChange={value => setPhone(value)}
              specialLabel=""
              enableSearch={true}
              inputStyle={{ background: "transparent", width: "100%",  }}
              dropdownStyle={{ background: "#6a7282" }}
              buttonStyle={{ background: "transparent" }}
              containerClass="w-full"
              autocompleteSearch={true}
              searchPlaceholder="Search for a country"
              inputProps={{
                id: "register-phone",
                required: true,
                autoComplete: "tel",
                name: "phone",
                "aria-label": "Phone number",
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-secondary text-font-primary rounded hover:bg-secondary-dark transition-all duration-300 shadow-md">
              Register
            </button>
            {error && (
              <p className=" text-red-500 p-2 bg-white rounded-xs mx-2 max-w-[200px] animate-pulse">
                {error}
              </p>
            )}
          </div>
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
        className={`mx-2 duration-700 transition-all min-w-[300px] sm:min-w-[350px] 
        ${!register ? `opacity-100 h-auto ` : `opacity-0 h-0 overflow-hidden `} `}
      >
        <form
          onSubmit={loginHandler}
          className="mx-2 bg-gray-500 p-6 rounded shadow-md max-w-[400px] "
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
              autoComplete="username"
              autoFocus={!register}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="text-sm font-medium mb-1">
              Password
            </label>
            <div className="login-form-input-password">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 h-full"
                required
                autoComplete="current-password"
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
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-secondary text-font-primary rounded hover:bg-secondary-dark transition-all duration-300 shadow-md">
              Login
            </button>
            {error && (
              <p className=" text-red-500 p-2 bg-white rounded-xs mx-2 max-w-[200px] animate-pulse">
                {error}
              </p>
            )}
          </div>
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
