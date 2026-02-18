import { useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useAuthStore } from '../../store/authStore';
import { useInvoiceStore } from '../../store/invoiceStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const { invoices, load } = useInvoiceStore();

  useEffect(() => {
    if (user?.uid) {
      void load(user.uid);
    }
  }, [load, user?.uid]);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    invoices.forEach((invoice) => {
      const key = invoice.invoiceDate.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + invoice.taxSummary.total);
    });

    const labels = Array.from(map.keys());
    return {
      labels,
      datasets: [
        {
          label: 'Sales (₹)',
          data: Array.from(map.values()),
          backgroundColor: '#0284c7',
        },
      ],
    };
  }, [invoices]);

  const totalSales = invoices.reduce((sum, invoice) => sum + invoice.taxSummary.total, 0);
  const totalDue = invoices.reduce((sum, invoice) => sum + invoice.dueAmount, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Outstanding</p>
          <p className="text-2xl font-bold">₹{totalDue.toFixed(2)}</p>
        </div>
      </div>
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold">Monthly Sales</h3>
        <Bar data={data} />
      </div>
    </div>
  );
}
