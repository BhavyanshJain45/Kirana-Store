import { create } from 'zustand';
import { createInvoice, listInvoices, updateInvoice, type Invoice } from '../lib/invoices';

interface InvoiceStore {
  invoices: Invoice[];
  loading: boolean;
  load: (ownerId: string) => Promise<void>;
  add: (ownerId: string, payload: Omit<Invoice, 'id'>) => Promise<void>;
  updatePayment: (ownerId: string, invoiceId: string, paidAmount: number) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  loading: false,
  load: async (ownerId) => {
    set({ loading: true });
    const invoices = await listInvoices(ownerId);
    set({ invoices, loading: false });
  },
  add: async (ownerId, payload) => {
    await createInvoice(ownerId, payload);
    const invoices = await listInvoices(ownerId);
    set({ invoices });
  },
  updatePayment: async (ownerId, invoiceId, paidAmount) => {
    const invoice = get().invoices.find((entry) => entry.id === invoiceId);
    if (!invoice) return;
    const dueAmount = Math.max(invoice.taxSummary.total - paidAmount, 0);
    const status = dueAmount === 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';
    await updateInvoice(invoiceId, { paidAmount, dueAmount, status });
    const invoices = await listInvoices(ownerId);
    set({ invoices });
  },
}));
