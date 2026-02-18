import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Item {
  id: string;
  name: string;
  hsn: string;
  unit: string;
  rate: number;
  gstRate: number;
  stock: number;
}

const itemsCollection = collection(db, 'items');

export const listItems = async (ownerId: string): Promise<Item[]> => {
  const snapshot = await getDocs(query(itemsCollection, where('ownerId', '==', ownerId)));
  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as Omit<Item, 'id'>),
  }));
};

export const createItem = async (ownerId: string, item: Omit<Item, 'id'>): Promise<void> => {
  await addDoc(itemsCollection, {
    ...item,
    ownerId,
    createdAt: serverTimestamp(),
  });
};

export const updateItem = async (itemId: string, item: Partial<Omit<Item, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, 'items', itemId), item);
};

export const deleteItem = async (itemId: string): Promise<void> => {
  await deleteDoc(doc(db, 'items', itemId));
};
