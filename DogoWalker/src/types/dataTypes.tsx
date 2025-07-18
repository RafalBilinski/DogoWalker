import { User } from "firebase/auth";
import { GeoPoint } from "firebase/firestore";

/**
 * Type for the account.
 */
declare type accountType = "business" | "personal";

 /**
 * Interface for the current user object.
 * 
 * @property {@link User}   firebaseUser - Firebase User object
 * @property {number} internalId        - User's internal ID
 * @property {@link accountType} accountType  - Business or Personal
 * @property {number} age               - User's age
 * @property {string} bio               - Optional user biography
 * @property {string} nickname          - Optional nickname, Name and Lastname by default
 * @property {Array} dogs               - Array of dogs owned by the user
 * @property {@link GeoPoint} lastPosition    - Last known position of the user
 * @property {Array} friends            - Array of friends
 */
export declare interface appCurrentUser {
  firebaseUser: User & {}; // Firebase User object
  internalId: number;
  accountType: accountType & {}; // Business or Personal
  age?: number; // User's age
  bio?: string; // Optional user bio
  nickname?: string; // Optional nickname
  dogs?: [
    // Array of dogs owned by the user
    {
      name: string; // Dog name
      id: string; // Dog ID
      photoUrl?: string; // Optional photo URL
      breed?: string; // Dog breed
      personality?: string; // Dog personality traits
      size?: number;
    }, // Dog size (e.g., small, medium, large)
  ];
  lastPosition?: GeoPoint;
  friends?: [
    {
      uid: string; // Friend's user ID
      nick: string; // Friend's nickname
      photoUrl?: string; // Optional photo URL
      status?: string; // Friend's status (e.g., active, inactive)
    },
  ];
}
