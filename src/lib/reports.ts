import dayjs from 'dayjs';
import { listInvoices, type Invoice } from './invoices';

export interface SalesReport {
  totalSales: number;
  totalTax: number;
  paid: number;
  due: number;
  monthlySales: Array<{ month: string; total: number }>;
}

export const getSalesReport = async (ownerId: string): Promise<SalesReport> => {
  const invoices = await listInvoices(ownerId);

  const monthlyMap = new Map<string, number>();
  invoices.forEach((invoice: Invoice) => {
    const month = dayjs(invoice.invoiceDate).format('MMM YYYY');
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + invoice.taxSummary.total);
  });

  const monthlySales = Array.from(monthlyMap.entries()).map(([month, total]) => ({ month, total }));

  const totalSales = invoices.reduce((sum, entry) => sum + entry.taxSummary.total, 0);
  const totalTax = invoices.reduce((sum, entry) => sum + entry.taxSummary.totalTax, 0);
  const paid = invoices.reduce((sum, entry) => sum + entry.paidAmount, 0);
  const due = invoices.reduce((sum, entry) => sum + entry.dueAmount, 0);

  return { totalSales, totalTax, paid, due, monthlySales };
};
