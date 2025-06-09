import { User } from "firebase/auth";

export interface appUser {
  firebaseUser: User; // Firebase User object
  internalId: number;
  accountType: string; // Business or Personal
  dogs?: [  // Array of dogs owned by the user
    name: string, // Dog name
    id: string, // Dog ID
    photoUrl?: string, // Optional photo URL
    breed?: string, // Dog breed
    personality?: string, // Dog personality traits
    size?: number, // Dog size (e.g., small, medium, large)
  ]
  lastPosition?:{
    latitude: number; // Last known latitude
    longitude: number; // Last known longitude
  }; 
}

export type AuthContextType = {
  currentUser: appUser | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (email: string, password: string, name: string, surname: string, nickname?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  getCurrentLocalization?: () => Promise<{
    latitude: number;
    longitude: number;
  }>;
  error?: string | null;
  setError: (error: string | null) => void;
};