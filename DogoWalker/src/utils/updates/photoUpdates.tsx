import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { appCurrentUser } from "../../types/dataTypes";
import { storage } from "../../firebase-config";
import extractFileFormat from "../extractFileFormat";
import convertImage from "../convertImage";

// Main function: handlePhotoUpdates
async function photoUpdates({
  currentUser,
  setError,
  updates,
}: {
  currentUser: appCurrentUser | null;
  setError: (err: any) => void;
  updates: {
    profilePhoto?: File | undefined;
  };
}) {
  if (!currentUser) return;
  if (updates.profilePhoto) {
    const profileStoragePatchFormat = `/users/${currentUser.firebaseUser.uid}/profilePhoto`;
    const newProfilePhotoRef = ref(
      storage,
      `${profileStoragePatchFormat}/${updates.profilePhoto.name}`
    );
    if (currentUser.firebaseUser.photoURL) {
      const oldPhotoURL = currentUser.firebaseUser.photoURL;
      const oldPhotoFormat = extractFileFormat(oldPhotoURL);
      const oldPhotoFileName = `userProfile.${oldPhotoFormat}`;
      const oldPhotoRef = ref(storage, `${profileStoragePatchFormat}/${oldPhotoFileName}`);
      try {
        await deleteObject(oldPhotoRef);
      } catch (err) {
        setError(err);
        throw new Error("deletion error  " + err);
      }
    }
    try {
      const convertedBlob = await convertImage(updates.profilePhoto);
      const convertedProfilePhoto = new File([convertedBlob], "userProfile.jpeg", {
        type: "image/jpeg",
      });
      await uploadBytes(newProfilePhotoRef, convertedProfilePhoto);
      let newPhotoURL = await getDownloadURL(newProfilePhotoRef);
      await updateProfile(currentUser.firebaseUser, {
        photoURL: newPhotoURL,
      });
    } catch (err) {
      setError(err);
      throw new Error("Error sending file: " + err);
    }
  }
}

export default photoUpdates;
