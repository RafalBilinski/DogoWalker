import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc, GeoPoint } from "firebase/firestore";
import { appCurrentUser } from "../../types/dataTypes";
import { db } from "../../firebase-config";


// Main function: handlePhotoUpdates


/**
 * Updates the profile of the user in Firebase.
 *
 * @param {appCurrentUser} currentUser - The current user object.
 * @param {(cb: (prev: appCurrentUser | null) => appCurrentUser | null) => void} setCurrentUser - A callback function to update the current user state.
 * @param {(err: any) => void} setError - A callback function to handle errors.
 * @param {{
 * newDisplayName?: string;
 * lastPosition?: GeoPoint;
 *  newAge?: number;
 *  newBio?: string;
 *  newEmail?: string;
 *  photo?: File | undefined;
 * }} updates - An object containing the updated profile fields.
 * @return {Promise<void>} A promise that resolves when the profile update is complete.
 */
async function profileUpdates({
  currentUser,
  setCurrentUser,
  setError,
  updates,
}: {
  currentUser: appCurrentUser;
  setError: (err: any) => void;
  setCurrentUser: (cb: (prev: appCurrentUser | null) => appCurrentUser | null) => void;
  updates: {
    newDisplayName?: string;
    lastPosition?: GeoPoint;
    newAge?: number;
    newBio?: string;
    newEmail?: string;    
  };
}) {
  const userRef = doc(db, "users", currentUser.firebaseUser.uid);
  try {
    if (!currentUser?.firebaseUser) {
      throw new Error("No user is currently logged in");
    }

    const updates_to_apply: any = {};
    if (updates.newDisplayName) {
      console.log("display name update:", updates.newDisplayName);
      try {
        await updateProfile(currentUser.firebaseUser, {
          displayName: updates.newDisplayName,
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    if (updates.lastPosition) {
      updates_to_apply.lastPosition = updates.lastPosition;
    }
    if (updates.newAge !== undefined) {
      updates_to_apply.age = updates.newAge;
    }
    if (typeof updates.newBio === "string") {
      console.log("Bio to update:", updates.newBio);
      updates_to_apply.bio = updates.newBio;
    }
    if (Object.keys(updates_to_apply).length > 0) {
      try {
        await updateDoc(userRef, updates_to_apply);
        setCurrentUser(prev => {
          if (!prev) return null;
          return { ...prev, ...updates_to_apply };
        });
      } catch (err) {
        throw new Error("Failed to update profile in Firestore: " + err.message);
      }
    }
  } catch (err: any) {
    setError(`Profile update error: ${err}`);
    throw new Error("Failed to update profile: " + err.message);
  } finally {
    const updatedUserData = await getDoc(userRef);
    if (updatedUserData.exists()) {
      const updatedData = updatedUserData.data();
      console.log("Updated data from Firestore: ", updatedData);
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bio: updatedData.bio, // update bio from Firestore
          age: updatedData.age,
          lastPosition: updatedData.lastPosition,
          // Optionally update other fields if needed
        };
      });
    }
  }
}
export default profileUpdates;