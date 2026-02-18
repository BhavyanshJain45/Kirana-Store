import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { useItemStore } from '../../store/itemStore';

interface ItemForm {
  name: string;
  hsn: string;
  unit: string;
  rate: number;
  gstRate: number;
  stock: number;
}

export default function ItemsPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const { items, load, add, remove } = useItemStore();
  const { register, handleSubmit, reset } = useForm<ItemForm>({
    defaultValues: { unit: 'pcs', rate: 0, gstRate: 0, stock: 0 },
  });

  useEffect(() => {
    if (user?.uid) {
      void load(user.uid);
    }
  }, [load, user?.uid]);

  const onSubmit = async (data: ItemForm): Promise<void> => {
    if (!user?.uid) return;
    await add(user.uid, data);
    reset({ name: '', hsn: '', unit: 'pcs', rate: 0, gstRate: 0, stock: 0 });
  };

  return (
    <div className="space-y-4">
      <form className="card grid gap-2 md:grid-cols-6" onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Item Name" {...register('name', { required: true })} />
        <input placeholder="HSN" {...register('hsn')} />
        <input placeholder="Unit" {...register('unit', { required: true })} />
        <input step="0.01" type="number" placeholder="Rate" {...register('rate', { valueAsNumber: true })} />
        <input step="0.01" type="number" placeholder="GST %" {...register('gstRate', { valueAsNumber: true })} />
        <input type="number" placeholder="Stock" {...register('stock', { valueAsNumber: true })} />
        <button className="bg-brand-600 text-white hover:bg-brand-500 md:col-span-6" type="submit">
          Add Item
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Name</th>
              <th>HSN</th>
              <th>Rate</th>
              <th>GST</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr className="border-b" key={item.id}>
                <td className="py-2">{item.name}</td>
                <td>{item.hsn}</td>
                <td>₹{item.rate.toFixed(2)}</td>
                <td>{item.gstRate}%</td>
                <td>{item.stock}</td>
                <td>
                  <button
                    className="bg-red-100 text-red-700"
                    onClick={() => user?.uid && void remove(user.uid, item.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
