import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useInvoiceStore } from '../../store/invoiceStore';
import { exportNodeToPdf } from '../../utils/pdfGenerator';
import { generateReminderText } from '../../utils/reminderGenerator';

export default function InvoicesPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const { invoices, load, updatePayment } = useInvoiceStore();

  useEffect(() => {
    if (user?.uid) {
      void load(user.uid);
    }
  }, [load, user?.uid]);

  return (
    <div className="card overflow-x-auto" id="invoice-list-container">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Invoice No</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr className="border-b" key={invoice.id}>
              <td className="py-2">{invoice.invoiceNo}</td>
              <td>{invoice.customerName}</td>
              <td>₹{invoice.taxSummary.total.toFixed(2)}</td>
              <td>
                <input
                  className="w-24"
                  defaultValue={invoice.paidAmount}
                  min={0}
                  onBlur={(event) => {
                    if (!user?.uid) return;
                    void updatePayment(user.uid, invoice.id, Number(event.target.value));
                  }}
                  type="number"
                />
              </td>
              <td>₹{invoice.dueAmount.toFixed(2)}</td>
              <td>{invoice.status}</td>
              <td className="space-x-2">
                <button
                  className="bg-blue-100 text-blue-700"
                  onClick={() => void exportNodeToPdf('invoice-list-container', `${invoice.invoiceNo}.pdf`)}
                  type="button"
                >
                  PDF
                </button>
                <button
                  className="bg-amber-100 text-amber-700"
                  onClick={() => {
                    const text = generateReminderText(invoice, 'N/A');
                    navigator.clipboard.writeText(text).catch(() => undefined);
                  }}
                  type="button"
                >
                  Reminder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
