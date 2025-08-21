import React, { Suspense, useEffect, useState } from "react";
import { useAuth } from "../services/AuthFeatures/AuthContext";
import { useNavigate } from "react-router-dom";
import EditablePhoto from "../components/EditablePhoto";
import EditableField from "../components/EditableInput";
import EditableTextarea from "../components/EditableTextarea";
import showToast from "../utils/showToast";

const Profile: React.FC = () => {
  const { currentUser, handlePhotoUpdates, handleProfileUpdate } = useAuth(); // Get auth context values
  const [error, setError] = useState("");
  const [profileUpdate, setProfileUpdate] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const navigate = useNavigate();

  const toggleProfileUpdate = () => {
    setProfileUpdate(!profileUpdate);
    setError(""); // Clear any existing errors when toggling
  };

  useEffect(() => {
    if (!currentUser) {  //Redirect to login page;
      navigate("/login");
    }
  })

  useEffect(() => { 
    if (currentUser && isFirstRender) {
      showToast("Click editable fields to edit it", "info", { autoClose: 5000 });
      setIsFirstRender(false);
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
        <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr] gap-2 mx-2 bg-gray-500 p-6 rounded shadow-md box-content">
          <h2 className="text-2xl mb-4 col-span-2">Your Profile</h2>
          <div
            id="user-photo-container"
            className=" flex self-center place-content-center  min-h-24 min-w-24 max-w-50 sm:max-w-90 mx-auto sm:row-span-2 sm:w-full sm:h-full mb-4 sm:mb-0"
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
          <div id="user-info" className="flex-col sm:grid sm:grid-cols-2 gap-2 md:p-2 md:w-full">
            <div className="mb-2 profile-form-input w-full h-full">
              <label htmlFor="user-internal-id" className="text-sm font-medium mb-1">
                Your unique ID
              </label>
              <p id="internal-id"> {currentUser?.internalId}</p>
            </div>
            <div className="mb-2 profile-form-input w-full h-full">
              <label htmlFor="user-email" className="text-sm font-medium mb-1">
                Your email
              </label>
              <p id="user-email cursor-default"> {currentUser?.firebaseUser.email}</p>
            </div>

            <div id="editable-fields" className="col-span-2 grid grid-cols-1 sm:grid-cols-2  gap-2">
              <EditableField
                id="user-display-name"
                label="How you want to be called?"
                initialValue={currentUser?.firebaseUser.displayName || ""}
                onSave={newValue => handleProfileUpdate({ newDisplayName: newValue })}
              />

              <EditableField
                id="user-age"
                label="Age"
                initialValue={currentUser?.age}
                placeholder="What is your age?"
                onSave={newValue => handleProfileUpdate({ newAge: Number(newValue) })}
              />

              <EditableTextarea
                id="user-bio"
                label="Tell us about yourself"
                initialValue={currentUser?.bio}
                placeholder="Write something about yourself"
                onSave={newValue => handleProfileUpdate({ newBio: newValue })}
                addedClassName="sm:col-span-2"
                charLimit={200}
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
