import * as XLSX from 'xlsx';
import { SalesTaxInvoice } from '../data/salesInvoices150Data';

/**
 * Generates and downloads the official IRD Sales Register Excel (.xlsx) file
 * populated with all 150 Tax Invoices.
 */
export const downloadSalesRegisterExcel = (invoices: SalesTaxInvoice[]) => {
  // Build header metadata rows
  const headerData = [
    ['G. SHRESTHA & ASSOCIATES'],
    ['CHARTERED ACCOUNTANTS - BHARATPUR, CHITWAN, NEPAL'],
    ['SALES REGISTER (बिक्री खाता) - AS PER VALUE ADDED TAX ACT, 2052 (RULE 23, ANUSUCHI 9)'],
    ['VAT No.: 123456789 | Tel: +977-56-520000 | Tax Period: FY 2082/83 - FY 2083/84'],
    [],
    [
      'S.N. (क्र.सं.)',
      'Date / Miti (मिति)',
      'Invoice No. (बीजक नं.)',
      'Buyer / Customer Name (खरिदकर्ताको नाम)',
      'Buyer PAN (स्थायी लेखा नं)',
      'Customer Address (ठेगाना)',
      'Payment Terms (भुक्तानी विधि)',
      'Particulars / Nature of Professional Service (सेवा विवरण)',
      'Taxable Value (करयोग्य मूल्य रू.)',
      '13% Output VAT (१३% मू.अ.कर रू.)',
      'Exempt Sales (कर छुट बिक्री रू.)',
      'Grand Total Amount (कुल जम्मा रू.)',
      'TDS Deductible @ 1.5% (TDS कट्टी रू.)',
      'Net Bank Receivable (खुद प्राप्त हुने रू.)'
    ]
  ];

  // Map 150 invoices
  const rows = invoices.map((inv, index) => {
    const tds15 = +(inv.taxableAmount * 0.015).toFixed(2);
    const netReceivable = +(inv.grandTotal - tds15).toFixed(2);

    return [
      index + 1,
      inv.date,
      inv.invoiceNo,
      inv.customerName,
      inv.customerPan,
      inv.customerAddress,
      inv.termsOfPayment,
      inv.particulars,
      inv.taxableAmount,
      inv.vatAmount,
      inv.exemptAmount,
      inv.grandTotal,
      tds15,
      netReceivable
    ];
  });

  // Calculate totals
  const totalTaxable = invoices.reduce((s, i) => s + i.taxableAmount, 0);
  const totalVat = invoices.reduce((s, i) => s + i.vatAmount, 0);
  const totalExempt = invoices.reduce((s, i) => s + i.exemptAmount, 0);
  const grandTotal = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalTds = +(totalTaxable * 0.015).toFixed(2);
  const totalNet = +(grandTotal - totalTds).toFixed(2);

  const totalRow = [
    'TOTAL (जम्मा)',
    '',
    '',
    `Total Invoices: ${invoices.length}`,
    '',
    '',
    '',
    '',
    totalTaxable,
    totalVat,
    totalExempt,
    grandTotal,
    totalTds,
    totalNet
  ];

  const fullData = [...headerData, ...rows, totalRow];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(fullData);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // SN
    { wch: 14 }, // Date
    { wch: 14 }, // Invoice No
    { wch: 42 }, // Customer Name
    { wch: 16 }, // PAN
    { wch: 24 }, // Address
    { wch: 14 }, // Terms
    { wch: 65 }, // Particulars
    { wch: 18 }, // Taxable
    { wch: 18 }, // VAT
    { wch: 14 }, // Exempt
    { wch: 20 }, // Grand Total
    { wch: 18 }, // TDS 1.5%
    { wch: 20 }  // Net Receivable
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Register Anusuchi 9');

  // Trigger download
  XLSX.writeFile(wb, 'G_Shrestha_150_Sales_Register_Anusuchi_9.xlsx');
};
