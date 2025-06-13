import React, { use, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { EditableField } from "./UIElements/EditableField";
import AddAPhoto from "@mui/icons-material/AddAPhoto" // Ensure you have ionicons installed if you're using icons

const Profile: React.FC = () => {
  const { currentUser, handleLogin, handleProfileUpdate } = useAuth(); // Get auth context values
  const [bio, setBio] = useState(currentUser?.bio || ""); // Bio can be null initially
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [displayName, setDisplayName] = useState(currentUser?.firebaseUser.displayName || ""); // Display name for profile update
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false); // State to toggle display name editing
  const [phone, setPhone] = useState(""); // Phone number can be null initially
  const [error, setError] = useState("");
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("personal"); // Default account type
  const [userCountry, setUserCountry] = useState("pl"); // Default to Poland
  const navigate = useNavigate();

  const toggleProfileUpdate = () => {
    setProfileUpdate(!profileUpdate);
    setError(""); // Clear any existing errors when toggling
    setShowPassword(false); // Reset password visibility
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  // Clear error message after a short delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000); // Clear error after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.firebaseUser.displayName || "");
      setAccountType(currentUser.accountType || "personal");
      setBio(currentUser.bio || "");
      
    } else {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div
      className="flex h-fit mx-0.5 md:mx-auto w-full max-w-[1000px] 
    py-5 items-center justify-center bg-gradient-to-br from-primary to-secondary 
    text-white rounded-lg shadow-2xl outline-1 outline-white min-w:0 min-h:0"
    >
      <div
        id="profile-container"
        className={`flex flex-col duration-700 transition-all min-w-[300px] sm:min-w-[350px] w-full  
        ${!profileUpdate ? `opacity-100 h-auto ` : `opacity-0 h-0 overflow-hidden `} `}
      >
        <div         
          className="flex flex-col md:grid gap-2 mx-2 bg-gray-500 p-6 rounded shadow-md box-content"
        >
          <h2 className="text-2xl mb-4 col-span-2">
            Your Profile
          </h2>
          <div id="user-photo-container"  className=" flex justify-center aspect-square min-h-24 min-w-24 max-h-30 max-w-30 mx-auto sm:row-span-2 sm:w-full mb-4">
            {currentUser?.firebaseUser.photoURL ? (
              <img 
                src={currentUser.firebaseUser.photoURL}
                alt={`${currentUser.firebaseUser.displayName || "User"}'s profile`}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="aspect-square  w-full p-10 rounded-full bg-gray-300 flex items-center justify-center ">
                <AddAPhoto className="text-gray-500"  />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="mb-4 profile-form-input">
            <label htmlFor="user-internal-id" className="text-sm font-medium mb-1">
              Your unique ID
            </label>
            <p id="internal-id"> {currentUser?.internalId}</p>
          </div>
          <div className="mb-4 profile-form-input">
            <label htmlFor="user-email" className="text-sm font-medium mb-1">
              Your email
            </label>
            <p id="user-email"> {currentUser?.firebaseUser.email}</p>
          </div>
          <EditableField
            id="user-displayName"
            label="How you want to be called?"
            initialValue={currentUser?.firebaseUser.displayName || ''}
            onSave={(newValue) => handleProfileUpdate({ newDisplayName: newValue })}
          />
          <EditableField
            id="user-Bio"
            label="Tell us about yourself"
            initialValue={currentUser?.bio || ''}
            placeholder="Write something about yourself"
            onSave={(newValue) => handleProfileUpdate({ newBio: newValue })}
          />
          </div>
        </div>
        <div className="flex flex-col items-center my-2 mx-auto">
          <button
            className="w-38 mx-4 px-4 py-4
            text-black rounded-md bg-white shadow-xl
            hover:transition-all hover:duration-500 hover:ping-2 hover:scale-105"
            onClick={toggleProfileUpdate}
          >
            Delete Account 
          </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
