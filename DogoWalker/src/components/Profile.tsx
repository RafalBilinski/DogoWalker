import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import EditablePhoto from "./UIElements/EditablePhoto";
import EditableField from "./UIElements/EditableField";
import { showToast } from "../utils/toast";

const Profile: React.FC = () => {
  const { currentUser, handlePhotoUpdates, handleProfileUpdate } = useAuth(); // Get auth context values
  const [error, setError] = useState("");
  const [profileUpdate, setProfileUpdate] = useState(false);
  const navigate = useNavigate();

  const toggleProfileUpdate = () => {
    setProfileUpdate(!profileUpdate);
    setError(""); // Clear any existing errors when toggling
  };
  // Basic check if userData exists

  useEffect(() => {
    if (currentUser) {
      showToast("Click editable fields to edit it", "info");
    } else {
      navigate("/");
    }
  }, [currentUser?.firebaseUser.displayName, currentUser?.age, currentUser?.bio]);

  console.log("Profile component rendered");
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
        <div className="flex flex-col md:grid gap-2 mx-2 bg-gray-500 p-6 rounded shadow-md box-content">
          <h2 className="text-2xl mb-4 col-span-2">Your Profile</h2>
          <div
            id="user-photo-container"
            className=" flex justify-center aspect-square min-h-24 min-w-24 max-w-50 mx-auto sm:row-span-2 sm:w-full mb-4 self-center"
          >
            <Suspense
              fallback={
                <div className="animate-spin rounded-full w-full aspect-square border-t-4 border-l-2 border-b-1 border-emerald-300"></div>
              }
            >
              <EditablePhoto
                id="user-photo"
                onSave={newPhotoFile => handlePhotoUpdates({ profilePhoto: newPhotoFile })}
                photoURLSource={currentUser?.firebaseUser.photoURL}
              />
            </Suspense>
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
              <p id="user-email cursor-default"> {currentUser?.firebaseUser.email}</p>
            </div>

            <div id="editable-fields" className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p className="text-md font-medium mb-1 col-span-2 border-t-white border-t-1 p-2">
                Editable stuff
              </p>
              <EditableField
                id="user-display-name"
                label="How you want to be called?"
                initialValue={currentUser?.firebaseUser.displayName || ""}
                onSave={newValue => handleProfileUpdate({ newDisplayName: newValue })}
              />
              <EditableField
                id="user-bio"
                label="Tell us about yourself"
                initialValue={currentUser?.bio}
                placeholder="Write something about yourself"
                onSave={newValue => handleProfileUpdate({ newBio: newValue })}
              />
              <EditableField
                id="user-age"
                label="Age"
                initialValue={currentUser?.age}
                placeholder="What is your age?"
                onSave={newValue => handleProfileUpdate({ newAge: Number(newValue) })}
              />
            </div>
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
