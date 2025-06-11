import { User } from "firebase/auth";

export interface appCurrentUser {
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

