import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase-config"; // Ensure you have your Firebase auth initialized
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { appCurrentUser } from "../types/dataTypes";

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

  handleProfileUpdate: (updates: {
    newDisplayName?: string;
    lastPosition?: {
      latitude: number;
      longitude: number;
    };
    newAge?: number;
    newBio?: string;
    newEmail?: string;
  }) => Promise<void>;
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
});

export function useAuth() {
  return useContext(AuthContext);
}


export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
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
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("User data not found in Firestore");
      }

      const userData = userDoc.data();

      // Create complete appUser object with Firestore data
      const appUserData: appCurrentUser = {
        firebaseUser: firebaseUser,
        internalId: userData.internalId,
        accountType: userData.accountType,
        lastPosition: userData.lastPosition || null,
        dogs: userData.dogs || [],
        friends: userData.friends || [],
        nickname: userData.nickname || `${userData.name} ${userData.lastName}`,
      };

      setCurrentUser(appUserData);
      console.log("User logged in successfully");
      localStorage.setItem("userData", JSON.stringify(appUserData));
    } catch (err: any) {
      console.error("Auth login error:", err.code);
      switch (err.code) {
        case "auth/invalid-credential":
          throw new Error("Incorrect password or e-mail. Please try again.");
        case "auth/too-many-requests":
          throw new Error("Too many login attempts. Please try again later.");
        default:
          throw new Error(
            "An unexpected error occurred. Please try again. Error code: " + err.code
          );
      }
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
        name,
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

      // Store in Firestore
      await setDoc(doc(db, "users", firebaseCurrentUser.uid), userData);

      // Create appUser object with all data
      const appUserData: appCurrentUser = {
        firebaseUser: firebaseCurrentUser,
        internalId: userData.internalId,
        accountType: userData.accountType,
        lastPosition: {
          latitude: 0,
          longitude: 0,
        },
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

  const handleProfileUpdate = async (updates: {
    newDisplayName?: string;
    lastPosition?: {
      latitude: number;
      longitude: number;
    };
    newAge?: number;
    newBio?: string;
    newEmail?: string;
  }) => {
    try {
      if (!currentUser?.firebaseUser) {
        throw new Error("No user is currently logged in");
      }

      const userRef = doc(db, "users", currentUser.firebaseUser.uid);
      const updates_to_apply: any = {};

      // Handle display name update
      if (updates.newDisplayName) {
        await updateProfile(currentUser.firebaseUser, {
          displayName: updates.newDisplayName,
        });
        updates_to_apply.nickname = updates.newDisplayName;
      }

      // Handle position update
      if (updates.lastPosition) {
        updates_to_apply.lastPosition = updates.lastPosition;
      }
      // Handle age update
      if (updates.newAge !== undefined) {
        updates_to_apply.age = updates.newAge;
      }
      // Handle bio update
      if (updates.newBio) {
        updates_to_apply.bio = updates.newBio;
      }

      console.log('updates_to_apply before Firestore:', updates_to_apply);
      // Update Firestore if we have any updates
      if (Object.keys(updates_to_apply).length > 0) {
        await updateDoc(userRef, updates_to_apply).catch(err => {
          console.error("Firestore update error:", err);
          throw new Error("Failed to update profile in Firestore: " + err.message);
        });

        // Update local state
        setCurrentUser(prev => {
          if (!prev) {
            console.log("No previous user state found to update");
            return null;
          }
          const updated = {
            ...prev,
            ...updates_to_apply
          };
          console.log('Updated user state:', updated);
          return updated;
        });
      }
      console.log("Profile updated successfully");

    } catch (err: any) {
      console.error("Profile update error:", err);
      throw new Error("Failed to update profile: " + err.message);
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

      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
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
    handleLogin,
    handleRegister,
    signOutUser,
    error,
    setError,
    handleProfileUpdate,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
