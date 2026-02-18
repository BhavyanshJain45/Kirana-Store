import {
  signInWithEmailAndPassword,
  signOut,
  type User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeAuth = (callback: (user: User | null) => void): (() => void) =>
  onAuthStateChanged(auth, callback);
