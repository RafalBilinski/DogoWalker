import { updateProfile } from "firebase/auth";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { SupportedPhotoFileFormat } from "../../types/fileTypes";
import { appCurrentUser } from "../../types/dataTypes";
import { db, storage } from "../../firebase-config";
import React, { useState} from "react";

import { useAuth } from "../AuthContext";


// Helper: extractFileFormat
function extractFileFormat(photoURL: string) {
  if (!photoURL) return null;
  let format;
  const decodedURL = decodeURIComponent(photoURL);
  const formatRegex = /\.([a-zA-Z0-9]+)(?:\?|#|$)/i;
  const match = decodedURL.match(formatRegex);
  if (match) {
    format = match[1].toLowerCase();
    return SupportedPhotoFileFormat.includes(format) ? format : (format = "");
  }
  return null;
}

// Helper: convertImage
function convertImage(
  imageFile: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.95
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      if (ctx) ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Błąd konwersji obrazu"));
          }
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Błąd ładowania obrazu"));
    img.src = URL.createObjectURL(imageFile);
  });
}

// Main function: handlePhotoUpdates
export async function handlePhotoUpdates({
  currentUser,
  setError,
  updates,
}: {
  currentUser: appCurrentUser | null;
  setError: (err: any) => void;
  updates: { profilePhoto?: File | undefined };
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

// Main function: handleProfileUpdate
export async function handleProfileUpdate({
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
    lastPosition?: { latitude: number; longitude: number };
    newAge?: number;
    newBio?: string;
    newEmail?: string;
    photo?: File | undefined;
  };
}) {
  const userRef = doc(db, "users", currentUser.firebaseUser.uid);
  try {
    if (!currentUser?.firebaseUser) {
      throw new Error("No user is currently logged in");
    }
    
    const updates_to_apply: any = {};
    if (updates.newDisplayName) {
      console.log("display name update:", updates.newDisplayName)
      await updateProfile(currentUser.firebaseUser, {
        displayName: updates.newDisplayName,
      });
    }
    if (updates.lastPosition) {
      updates_to_apply.lastPosition = updates.lastPosition;
    }
    if (updates.newAge !== undefined) {
      updates_to_apply.age = updates.newAge;
    }
    if (typeof updates.newBio === "string") {
      console.log("Bio update:", updates.newBio)
      updates_to_apply.bio = updates.newBio;
    }
    if (Object.keys(updates_to_apply).length > 0) {
      await setDoc(userRef, updates_to_apply).catch(err => {
        throw new Error("Failed to update profile in Firestore: " + err.message);
      });
      setCurrentUser(prev => {
        if (!prev) return null;
        return { ...prev, ...updates_to_apply };
      });
    }
  } catch (err: any) {
    setError(`Profile update error: ${err}`);
    throw new Error("Failed to update profile: " + err.message);
  } finally {
    const updatedUserData = await getDoc(userRef);
    if (updatedUserData.exists()) {
      const updatedData = updatedUserData.data();
      console.log("updated data: ", updatedData);
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bio: updatedData.bio, // update bio from Firestore
          // Optionally update other fields if needed
        };
      });
    }
  }
}
