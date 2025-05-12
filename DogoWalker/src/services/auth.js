import { auth } from "../firebase-config";  
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";  

export const loginWithEmail = async (email, password) => {  
  return await signInWithEmailAndPassword(auth, email, password);  
};  

export const loginWithGoogle = async () => {  
  const provider = new GoogleAuthProvider();  
  return await signInWithPopup(auth, provider);  
};  
