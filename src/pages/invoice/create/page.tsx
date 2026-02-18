import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../../store/authStore';
import { useCustomerStore } from '../../../../store/customerStore';
import { useInvoiceStore } from '../../../../store/invoiceStore';
import { useItemStore } from '../../../../store/itemStore';
import { useStoreProfileStore } from '../../../../store/storeProfileStore';
import { calculateInvoiceTotals } from '../../../../utils/gstCalculations';
import { generateInvoiceNumber, getFinancialYear } from '../../../../utils/financialYear';
import type { InvoiceLine } from '../../../../lib/invoices';

interface InvoiceForm {
  customerId: string;
  itemId: string;
  quantity: number;
}

export default function CreateInvoicePage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const customerStore = useCustomerStore();
  const itemStore = useItemStore();
  const invoiceStore = useInvoiceStore();
  const profileStore = useStoreProfileStore();
  const [lines, setLines] = useState<InvoiceLine[]>([]);

  const { register, handleSubmit, reset, watch } = useForm<InvoiceForm>({ defaultValues: { quantity: 1 } });

  useEffect(() => {
    if (!user?.uid) return;
    void customerStore.load(user.uid);
    void itemStore.load(user.uid);
    void invoiceStore.load(user.uid);
    void profileStore.load(user.uid);
  }, [customerStore, itemStore, invoiceStore, profileStore, user?.uid]);

  const selectedCustomer = useMemo(
    () => customerStore.customers.find((entry) => entry.id === watch('customerId')),
    [customerStore.customers, watch],
  );

  const onAddLine = (data: InvoiceForm): void => {
    const item = itemStore.items.find((entry) => entry.id === data.itemId);
    if (!item) return;
    setLines((current) => [
      ...current,
      {
        itemId: item.id,
        name: item.name,
        quantity: data.quantity,
        rate: item.rate,
        gstRate: item.gstRate,
      },
    ]);
    reset({ customerId: data.customerId, itemId: '', quantity: 1 });
  };

  const onCreateInvoice = async (): Promise<void> => {
    if (!user?.uid || !selectedCustomer || lines.length === 0) return;
    const financialYear = getFinancialYear();
    const currentYearInvoices = invoiceStore.invoices.filter((inv) => inv.financialYear === financialYear);
    const invoiceNo = generateInvoiceNumber(financialYear, currentYearInvoices.length);
    const storeState = profileStore.profile.stateCode || '27';
    const customerState = selectedCustomer.gstin.slice(0, 2) || storeState;
    const taxSummary = calculateInvoiceTotals(lines, storeState, customerState);

    await invoiceStore.add(user.uid, {
      invoiceNo,
      invoiceDate: new Date().toISOString(),
      financialYear,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerState,
      storeState,
      lines,
      taxSummary,
      paidAmount: 0,
      dueAmount: taxSummary.total,
      status: 'UNPAID',
    });

    setLines([]);
  };

  return (
    <div className="space-y-4">
      <form className="card grid gap-2 md:grid-cols-4" onSubmit={handleSubmit(onAddLine)}>
        <select {...register('customerId', { required: true })}>
          <option value="">Select customer</option>
          {customerStore.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <select {...register('itemId', { required: true })}>
          <option value="">Select item</option>
          {itemStore.items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <input min={1} type="number" {...register('quantity', { required: true, valueAsNumber: true })} />

        <button className="bg-brand-600 text-white hover:bg-brand-500" type="submit">
          Add Line
        </button>
      </form>

      <div className="card overflow-x-auto" id="invoice-preview">
        <h3 className="mb-2 text-lg font-semibold">Invoice Preview</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>GST</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr className="border-b" key={`${line.itemId}-${index}`}>
                <td className="py-2">{line.name}</td>
                <td>{line.quantity}</td>
                <td>₹{line.rate.toFixed(2)}</td>
                <td>{line.gstRate}%</td>
                <td>₹{(line.quantity * line.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="bg-green-600 text-white hover:bg-green-500" onClick={() => void onCreateInvoice()} type="button">
        Create Invoice
      </button>
    </div>
  );
}
