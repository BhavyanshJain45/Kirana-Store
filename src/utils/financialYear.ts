import dayjs from 'dayjs';

export const getFinancialYear = (date: string | Date = new Date()): string => {
  const d = dayjs(date);
  const year = d.year();
  const month = d.month() + 1;
  if (month >= 4) {
    return `${year}-${String((year + 1) % 100).padStart(2, '0')}`;
  }
  return `${year - 1}-${String(year % 100).padStart(2, '0')}`;
};

export const generateInvoiceNumber = (financialYear: string, count: number): string =>
  `INV/${financialYear}/${String(count + 1).padStart(4, '0')}`;
