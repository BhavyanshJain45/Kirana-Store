import { useEffect, useState } from 'react';
import { getSalesReport, type SalesReport } from '../../lib/reports';
import { useAuthStore } from '../../store/authStore';

export default function ReportsPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const [report, setReport] = useState<SalesReport | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    getSalesReport(user.uid).then(setReport).catch(() => setReport(null));
  }, [user?.uid]);

  if (!report) {
    return <div className="card">No report data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card">Sales: ₹{report.totalSales.toFixed(2)}</div>
        <div className="card">Tax: ₹{report.totalTax.toFixed(2)}</div>
        <div className="card">Paid: ₹{report.paid.toFixed(2)}</div>
        <div className="card">Due: ₹{report.due.toFixed(2)}</div>
      </div>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Month</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {report.monthlySales.map((entry) => (
              <tr className="border-b" key={entry.month}>
                <td className="py-2">{entry.month}</td>
                <td>₹{entry.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
