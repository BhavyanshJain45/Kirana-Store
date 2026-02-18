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

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gstin: string;
  address: string;
  openingBalance: number;
  createdAt?: Date;
}

const customersCollection = collection(db, 'customers');

export const listCustomers = async (ownerId: string): Promise<Customer[]> => {
  const snapshot = await getDocs(query(customersCollection, where('ownerId', '==', ownerId)));
  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as Omit<Customer, 'id'>),
  }));
};

export const createCustomer = async (
  ownerId: string,
  customer: Omit<Customer, 'id'>,
): Promise<void> => {
  await addDoc(customersCollection, {
    ...customer,
    ownerId,
    createdAt: serverTimestamp(),
  });
};

export const updateCustomer = async (
  customerId: string,
  customer: Partial<Omit<Customer, 'id'>>,
): Promise<void> => {
  await updateDoc(doc(db, 'customers', customerId), customer);
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  await deleteDoc(doc(db, 'customers', customerId));
};
