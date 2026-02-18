import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportNodeToPdf = async (elementId: string, fileName: string): Promise<void> => {
  const node = document.getElementById(elementId);
  if (!node) return;

  const canvas = await html2canvas(node, { scale: 2 });
  const imageData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const width = 190;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imageData, 'PNG', 10, 10, width, height);
  pdf.save(fileName);
};
