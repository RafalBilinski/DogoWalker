import { User } from "firebase/auth";

export interface appCurrentUser {
  firebaseUser: (User & {});    // Firebase User object
  internalId: number;
  accountType: string;          // Business or Personal
  age?: number;                 // User's age
  bio?: string;                 // Optional user bio
  nickname?: string;            // Optional nickname
  dogs?: [                      // Array of dogs owned by the user
    name: string,               // Dog name
    id: string,                 // Dog ID
    photoUrl?: string,          // Optional photo URL
    breed?: string,             // Dog breed
    personality?: string,       // Dog personality traits
    size?: number,              // Dog size (e.g., small, medium, large)
  ];
  lastPosition?:{
    latitude: number;           // Last known latitude
    longitude: number;          // Last known longitude
  };
  friends?: [
    {
    uid: string;                // Friend's user ID
    nick: string;               // Friend's nickname
    photoUrl?: string;          // Optional photo URL
    status?: string;            // Friend's status (e.g., active, inactive)
  },
  ]
}

