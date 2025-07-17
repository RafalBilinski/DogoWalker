import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config"; // Ensure you have your Firebase auth initialized
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc, setDoc, GeoPoint } from "firebase/firestore";

import { photoUpdates, profileUpdates } from "./AuthFeatures/profileUpdates";
import { appCurrentUser } from "../types/dataTypes";
import { showToast } from "../utils/toast";

type AuthContextType = {
  currentUser: appCurrentUser | null;
  handleLogin: (email: string, password: string) => Promise<void>;

  handleRegister: (
    email: string,
    password: string,
    name: string,
    lastName: string,
    phone: string,
    accountType: string,
    nickname?: string
  ) => Promise<void>;

  signOutUser: () => Promise<void>;

  getCurrentLocalization?: () => Promise<{
    latitude: number;
    longitude: number;
  }>;

  error?: string | null;
  setError: (error: string | null) => void;

  handlePhotoUpdates: (updates: { profilePhoto?: File | undefined }) => Promise<void>;

  handleProfileUpdate: (updates: {
    newDisplayName?: string;
    lastPosition?: GeoPoint;
    newAge?: number;
    newBio?: string;
    newEmail?: string;
    photoURL?: string | null | undefined;
    photo?: File | undefined;
  }) => Promise<void>;
};

type dog = {
  id: string;
  name: string;
  atitude?: number;
  age?: number;
  breed?: string;
  createdAt?: Date;
  gender?: number;
  ownerId?: string;
  photoURL?: string;
  photo?: File | undefined;
  bio?: string;
  size?: number;
};
// Create the context with an initial value matching the type
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  handleLogin: async () => {},
  handleRegister: async () => {},
  signOutUser: async () => {},
  error: null,
  setError: () => {},
  getCurrentLocalization: async () => {
    return { latitude: 0, longitude: 0 };
  },
  handleProfileUpdate: async () => {},
  handlePhotoUpdates: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<appCurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch additional user data from Firestore
      const userProfileDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userProfileDoc.exists()) {
        setError("User data not found in Firestore");
        throw new Error("User data not found in Firestore");
      }

      const userData = userProfileDoc.data();

      // Create complete appUser object with Firestore data
      const appUserData: appCurrentUser = {
        firebaseUser: firebaseUser,
        internalId: userData.internalId,
        accountType: userData.accountType,
        bio: userData.bio || "",
        lastPosition: userData.lastPosition || null,
        dogs: userData.dogs || [],
        friends: userData.friends || [],
        nickname: userData.nickname || `${userData.name} ${userData.lastName}`,
      };

      setCurrentUser(appUserData);
      console.log("User logged in successfully");
      localStorage.setItem("userData", JSON.stringify(appUserData));
      showToast("Welcome back, " + appUserData.firebaseUser.displayName, "success");
    } catch (err: any) {
      console.error("Auth login error:", err.code);
      let errorMessage;
      switch (err.code) {
        case "auth/invalid-credential":
          errorMessage = new Error("Incorrect password or e-mail. Please try again.");
          break;
        case "auth/too-many-requests":
          errorMessage = new Error("Too many login attempts. Please try again later.");
          break;
        default:
          errorMessage = new Error(
            "An unexpected error occurred. Please try again. Error code: " + err.code
          );
          break;
      }
      showToast(errorMessage.message, "error");
      throw errorMessage;
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    lastName: string,
    phone: string,
    accountType: string,
    nickname?: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseCurrentUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseCurrentUser, {
        displayName: nickname || `${name} ${lastName}`,
      });

      // Create extended user data for Firestore
      const userData = {
        uid: firebaseCurrentUser.uid,
        email: firebaseCurrentUser.email,
        bio: "",
        age: null,
        lastName,
        phone,
        accountType,
        nickname: nickname || `${name} ${lastName}`,
        createdAt: new Date(),
        lastPosition: null,
        dogs: [],
        friends: [],
        status: "active",
        internalId: Date.now(),
      };

      // Profile store in Firestore
      await setDoc(doc(db, "users", firebaseCurrentUser.uid), userData);
      // Initialize dogs collection for the user
      if (accountType === "personal") {
        await setDoc(doc(db, "dogs", firebaseCurrentUser.uid), {});
      }

      // Create appUser object with all data
      const appUserData: appCurrentUser = {
        firebaseUser: firebaseCurrentUser,
        internalId: userData.internalId,
        accountType: userData.accountType,
        lastPosition: new GeoPoint(0, 0),
      };

      setCurrentUser(appUserData);
      console.log("User created and profile updated successfully" + appUserData);
      
      showToast("Your account have been created successfully! Yay! :)", "success");
    } catch (err: any) {
      console.error("Registration error: ", err.code);
      setError(`Registration error:   ${err.code}`);
      let errorMessage;
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = new Error("Email already in use. Please try another one.");
          break;
        case "auth/invalid-email":
          errorMessage = new Error("Invalid email format. Please check your email.");
          break;
        case "auth/weak-password":
          errorMessage = new Error("Password is too weak. Please choose a stronger password.");
          break;
        default:
          errorMessage = new Error("An unexpected error occurred: " + err.message);
          break;
      }
      showToast(`Cannot creat account: ${errorMessage}`, "error");
      throw Error(errorMessage);
    }
  };

  const handlePhotoUpdates = async (updates: { profilePhoto?: File | undefined }) => {
    try {
      await photoUpdates({ currentUser, setError, updates });
    } catch (err) {
      showToast(`Cannot creat account: ${err}`, "error");
      throw new Error(err);
    } finally {
      showToast("Profile photo updated successfully", "success");
    }
  };

  const handleProfileUpdate = async (updates: {
    newDisplayName?: string;
    lastPosition?: GeoPoint;
    newAge?: number;
    newBio?: string;
    newEmail?: string;
    photo?: File | undefined;
  }) => {
    try {
      if (!currentUser?.firebaseUser) {
        showToast("No user is currently logged in", "error");
        throw new Error("No user is currently logged in");
      }
      await profileUpdates({ currentUser, setCurrentUser, setError, updates });
    } catch (err: any) {
      setError(`Profile update error: ${err}`);
      console.error("Profile update error:", err);
      showToast(`Profile update error:: ${err.message}`, "error");
      throw new Error("Profile update error:: " + err.message);
    }
  };

  const signOutUser = async () => {
    try {
      // Clear Firebase auth
      await signOut(auth);

      // Clear user state
      setCurrentUser(null);

      // Clear any stored user data in localStorage if you're using it
      localStorage.clear();
      showToast("You have been signed out successfully", "success");
      console.log("User signed out successfully");
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err);
      showToast("Failed to sign out. Please try again.", "error");
      throw new Error("Failed to sign out. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const appUserData: appCurrentUser = {
          firebaseUser: user,
          internalId: Date.now(), // You might want to generate this differently
          accountType: "Personal", // Default value, adjust as needed
        };
        setCurrentUser(appUserData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    handlePhotoUpdates,
    handleLogin,
    handleRegister,
    signOutUser,
    error,
    setError,
    handleProfileUpdate,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
