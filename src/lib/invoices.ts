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

export interface InvoiceLine {
  itemId: string;
  name: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

export interface TaxSummary {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  financialYear: string;
  customerId: string;
  customerName: string;
  customerState: string;
  storeState: string;
  lines: InvoiceLine[];
  taxSummary: TaxSummary;
  paidAmount: number;
  dueAmount: number;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

const invoicesCollection = collection(db, 'invoices');

export const listInvoices = async (ownerId: string): Promise<Invoice[]> => {
  const snapshot = await getDocs(query(invoicesCollection, where('ownerId', '==', ownerId)));
  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as Omit<Invoice, 'id'>),
  }));
};

export const createInvoice = async (
  ownerId: string,
  invoice: Omit<Invoice, 'id'>,
): Promise<void> => {
  await addDoc(invoicesCollection, {
    ...invoice,
    ownerId,
    createdAt: serverTimestamp(),
  });
};

export const updateInvoice = async (
  invoiceId: string,
  invoice: Partial<Omit<Invoice, 'id'>>,
): Promise<void> => {
  await updateDoc(doc(db, 'invoices', invoiceId), invoice);
};

export const deleteInvoice = async (invoiceId: string): Promise<void> => {
  await deleteDoc(doc(db, 'invoices', invoiceId));
};
