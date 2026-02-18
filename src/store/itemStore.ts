import { create } from 'zustand';
import { createItem, deleteItem, listItems, type Item, updateItem } from '../lib/items';

interface ItemStore {
  items: Item[];
  loading: boolean;
  load: (ownerId: string) => Promise<void>;
  add: (ownerId: string, payload: Omit<Item, 'id'>) => Promise<void>;
  update: (ownerId: string, itemId: string, payload: Partial<Omit<Item, 'id'>>) => Promise<void>;
  remove: (ownerId: string, itemId: string) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set) => ({
  items: [],
  loading: false,
  load: async (ownerId) => {
    set({ loading: true });
    const items = await listItems(ownerId);
    set({ items, loading: false });
  },
  add: async (ownerId, payload) => {
    await createItem(ownerId, payload);
    const items = await listItems(ownerId);
    set({ items });
  },
  update: async (ownerId, itemId, payload) => {
    await updateItem(itemId, payload);
    const items = await listItems(ownerId);
    set({ items });
  },
  remove: async (ownerId, itemId) => {
    await deleteItem(itemId);
    const items = await listItems(ownerId);
    set({ items });
  },
}));
