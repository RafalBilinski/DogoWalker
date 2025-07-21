import { db } from "../firebase-config";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export const createUserProfile = async (userId, data) => {
  await addDoc(collection(db, "users"), {
    ...data,
    userId,
    createdAt: new Date().toISOString(),
  });
};

export const subscribeToUsers = callback => {
  return onSnapshot(collection(db, "users"), snapshot => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  });
};
