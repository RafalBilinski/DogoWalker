import { User } from "firebase/auth";

export interface appUser {
  firebaseUser: User; // Firebase User object
  internalId: number;
  accountType: string; // Business or Personal
  dogs?: [
    name: string, // Dog name
    id: string, // Dog ID
    photoUrl?: string, // Optional photo URL
    breed?: string, // Dog breed
    personality?: string, // Dog personality traits
    size?: number, // Dog size (e.g., small, medium, large)
  ]; // Array of dog IDs or names
}

export type AuthContextType = {
  currentUser: appUser | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleRegister: (email: string, password: string, name: string, surname: string, nickname?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  error?: string | null;
  setError: (error: string | null) => void;
};