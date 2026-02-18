import { create } from 'zustand';
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  type Customer,
  updateCustomer,
} from '../lib/customers';

interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  load: (ownerId: string) => Promise<void>;
  add: (ownerId: string, payload: Omit<Customer, 'id'>) => Promise<void>;
  update: (ownerId: string, customerId: string, payload: Partial<Omit<Customer, 'id'>>) => Promise<void>;
  remove: (ownerId: string, customerId: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  loading: false,
  load: async (ownerId) => {
    set({ loading: true });
    const customers = await listCustomers(ownerId);
    set({ customers, loading: false });
  },
  add: async (ownerId, payload) => {
    await createCustomer(ownerId, payload);
    const customers = await listCustomers(ownerId);
    set({ customers });
  },
  update: async (ownerId, customerId, payload) => {
    await updateCustomer(customerId, payload);
    const customers = await listCustomers(ownerId);
    set({ customers });
  },
  remove: async (ownerId, customerId) => {
    await deleteCustomer(customerId);
    const customers = await listCustomers(ownerId);
    set({ customers });
  },
}));
