import dayjs from 'dayjs';
import type { Invoice } from '../lib/invoices';

export const generateReminderText = (invoice: Invoice, customerPhone: string): string => {
  const date = dayjs(invoice.invoiceDate).format('DD MMM YYYY');
  return `Dear ${invoice.customerName}, this is a reminder for Invoice ${invoice.invoiceNo} dated ${date}. Outstanding amount: ₹${invoice.dueAmount.toFixed(2)}. Please make payment at the earliest. Contact: ${customerPhone}.`;
};
