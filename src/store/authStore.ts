import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { loginWithEmail, logout, subscribeAuth } from '../lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  init: () => void;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

let authListenerAttached = false;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: () => {
    if (authListenerAttached) return;
    authListenerAttached = true;
    subscribeAuth((user) => set({ user, loading: false }));
  },
  login: async (email, password) => {
    set({ loading: true });
    await loginWithEmail(email, password);
    set({ loading: false });
  },
  signOut: async () => {
    await logout();
  },
}));
