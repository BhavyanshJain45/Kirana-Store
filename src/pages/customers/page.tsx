import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { useCustomerStore } from '../../store/customerStore';
import { useInvoiceStore } from '../../store/invoiceStore';

interface CustomerForm {
  name: string;
  phone: string;
  gstin: string;
  address: string;
  openingBalance: number;
}

export default function CustomersPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const { customers, load, add, remove } = useCustomerStore();
  const invoices = useInvoiceStore((state) => state.invoices);
  const { register, handleSubmit, reset } = useForm<CustomerForm>({
    defaultValues: { openingBalance: 0 },
  });

  useEffect(() => {
    if (user?.uid) {
      void load(user.uid);
    }
  }, [load, user?.uid]);

  const onSubmit = async (data: CustomerForm): Promise<void> => {
    if (!user?.uid) return;
    await add(user.uid, data);
    reset({ openingBalance: 0, name: '', phone: '', gstin: '', address: '' });
  };

  const dueByCustomer = (customerId: string): number =>
    invoices.filter((entry) => entry.customerId === customerId).reduce((sum, entry) => sum + entry.dueAmount, 0);

  return (
    <div className="space-y-4">
      <form className="card grid gap-2 md:grid-cols-5" onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Customer Name" {...register('name', { required: true })} />
        <input placeholder="Phone" {...register('phone', { required: true })} />
        <input placeholder="GSTIN" {...register('gstin')} />
        <input placeholder="Address" {...register('address')} />
        <input
          placeholder="Opening Balance"
          step="0.01"
          type="number"
          {...register('openingBalance', { valueAsNumber: true })}
        />
        <button className="bg-brand-600 text-white hover:bg-brand-500 md:col-span-5" type="submit">
          Add Customer
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Name</th>
              <th>Phone</th>
              <th>GSTIN</th>
              <th>Ledger Due</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr className="border-b" key={customer.id}>
                <td className="py-2">{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.gstin}</td>
                <td>₹{(customer.openingBalance + dueByCustomer(customer.id)).toFixed(2)}</td>
                <td>
                  <button
                    className="bg-red-100 text-red-700"
                    onClick={() => user?.uid && void remove(user.uid, customer.id)}
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
