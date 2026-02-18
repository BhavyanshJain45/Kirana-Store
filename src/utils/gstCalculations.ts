import type { InvoiceLine, TaxSummary } from '../lib/invoices';

export const calculateInvoiceTotals = (
  lines: InvoiceLine[],
  storeState: string,
  customerState: string,
): TaxSummary => {
  const taxableAmount = lines.reduce((sum, line) => sum + line.quantity * line.rate, 0);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  lines.forEach((line) => {
    const lineTotal = line.quantity * line.rate;
    const gstAmount = lineTotal * (line.gstRate / 100);

    if (storeState === customerState) {
      cgst += gstAmount / 2;
      sgst += gstAmount / 2;
    } else {
      igst += gstAmount;
    }
  });

  const totalTax = cgst + sgst + igst;
  return {
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalTax,
    total: taxableAmount + totalTax,
  };
};
