import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase-config'; // Ensure you have your Firebase auth initialized
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword
} from "firebase/auth";
import { collection, getDoc, doc, updateDoc} from "firebase/firestore";

import { appUser, AuthContextType } from '../types/dataTypes';


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
  }
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
  const [currentUser, setCurrentUser] = useState<appUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 



  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create appUser object
      const appUserData: appUser = {
        firebaseUser: firebaseUser,
        internalId: Date.now(), // You might want to generate this differently
        accountType: 'Personal', // Default value, adjust as needed
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
          setError(
            "An unexpected error occurred. Please try again. Error code: " +
              err.code
          );
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
    nickname?: string,
    phone: string = ''
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, {
        displayName: nickname || `${name} ${surname}`,
        photoURL: '', // You can set a default photo URL or leave it empty

      });

      // Create appUser object
      const appUserData: appUser = {
        firebaseUser: firebaseUser,
        internalId: Date.now(), // You might want to generate this differently
        accountType: 'Personal', // Default value, adjust as needed
      };
      
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
        const appUserData: appUser = {
          firebaseUser: user,
          internalId: Date.now(), // You might want to generate this differently
          accountType: 'Personal', // Default value, adjust as needed
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
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}