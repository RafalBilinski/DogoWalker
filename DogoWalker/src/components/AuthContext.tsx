import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config"; // Ensure you have your Firebase auth initialized
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from "firebase/auth";
import { collection, getDoc, doc, setDoc, updateDoc, getFirestore } from "firebase/firestore";

import { appCurrentUser } from "../types/dataTypes";

 type AuthContextType = {
  currentUser: appCurrentUser | null;
  handleLogin: (
    email: string, 
    password: string) 
    => Promise<void>;

  handleRegister: (
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string,
    accountType: string,
    nickname?: string) 
    => Promise<void>;

  signOutUser: () 
    => Promise<void>;

  getCurrentLocalization?: () 
    => Promise<{
      latitude: number;
      longitude: number;
    }>;

  error?: string | null;
  setError: (error: string | null) => void;
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
});

export function useAuth() {
  return useContext(AuthContext);
}

export function loginWithGoogle() {
  return auth.signInWithPopup(new auth.GoogleAuthProvider());
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<appCurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createUserDocument = async (userData: appCurrentUser, addedData: any) => {
    const userRef = doc(db, "users", userData.firebaseUser.uid);
    try {
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date(),
        lastPosition: null,
        friends: [],
        status: "active",
        ...addedData,
      });

      return userRef;
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create appUser object
      const appUserData: appCurrentUser = {
        firebaseUser: firebaseUser,
        internalId: Date.now(), // You might want to generate this differently
        accountType: "Personal", // Default value, adjust as needed
      };

      setCurrentUser(appUserData);
      console.log("User logged in successfully");
    } catch (err: any) {
      console.error("Login error:", err.code);
      switch (err.code) {
        case "auth/invalid-credential":
          setError("Incorrect password or e-mail. Please try again.");
          break;
        default:
          setError("An unexpected error occurred. Please try again. Error code: " + err.code);
          break;
      }
      throw error;
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    surname: string,
    phone?: string ,
    accountType?: string , // Default to Personal if not provided
    nickname?: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseCurrentUser = userCredential.user;

      await updateProfile(firebaseCurrentUser, {
        displayName: nickname || `${name} ${surname}`,
        photoURL: "", // You can set a default photo URL or leave it empty
      });

      // Create appUser object
      const appUserData: appCurrentUser = {
        firebaseUser: firebaseCurrentUser,
        internalId: Date.now(), // You might want to generate this differently
        accountType: "Personal", // Default value, adjust as needed
      };

      // Create Firestore document
      await createUserDocument(appUserData, {
        email,
        name,
        surname,
        nickname,
        phone,
        accountType: "Personal",
      });

      setCurrentUser(appUserData);
      console.log("User created and profile updated successfully");
    } catch (err: any) {
      console.error("Registration error: ", err.code);
      switch (err.code) {
        case "auth/email-already-in-use":
          throw new Error("Email already in use. Please try another one.");
        case "auth/invalid-email":
          throw new Error("Invalid email format. Please check your email.");
        case "auth/weak-password":
          throw new Error("Password is too weak. Please choose a stronger password.");
        default:
          throw new Error("An unexpected error occurred: " + err.message);
      }
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
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
    handleLogin,
    handleRegister,
    signOutUser,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
