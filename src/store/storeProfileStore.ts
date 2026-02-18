import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface StoreProfile {
  storeName: string;
  gstin: string;
  ownerName: string;
  address: string;
  stateCode: string;
  phone: string;
}

interface StoreProfileStore {
  profile: StoreProfile;
  load: (ownerId: string) => Promise<void>;
  save: (ownerId: string, payload: StoreProfile) => Promise<void>;
}

const emptyProfile: StoreProfile = {
  storeName: '',
  gstin: '',
  ownerName: '',
  address: '',
  stateCode: '',
  phone: '',
};

export const useStoreProfileStore = create<StoreProfileStore>((set) => ({
  profile: emptyProfile,
  load: async (ownerId) => {
    const snapshot = await getDoc(doc(db, 'storeProfiles', ownerId));
    if (snapshot.exists()) {
      set({ profile: snapshot.data() as StoreProfile });
    }
  },
  save: async (ownerId, payload) => {
    await setDoc(doc(db, 'storeProfiles', ownerId), payload);
    set({ profile: payload });
  },
}));
