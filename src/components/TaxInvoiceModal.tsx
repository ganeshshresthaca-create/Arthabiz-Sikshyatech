import React, { useEffect, useState } from 'react';
import {
  Printer,
  Download,
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  List,
  FileText,
  Search
} from 'lucide-react';
import { SalesTaxInvoice, SALES_INVOICES_150 } from '../data/salesInvoices150Data';

interface Props {
  invoice: SalesTaxInvoice;
  onClose: () => void;
  onSelectInvoice?: (invoice: SalesTaxInvoice) => void;
  onNext?: () => void;
  onPrev?: () => void;
  totalInvoices?: number;
  isUnlocked?: boolean;
  onRequestUnlock?: () => void;
}

// Convert numbers to Nepali/English formal currency words
const numberToWordsRupees = (amount: number): string => {
  const [rupeesStr, paisaStr] = amount.toFixed(2).split('.');
  const rupees = parseInt(rupeesStr, 10);
  const paisa = parseInt(paisaStr, 10);

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWordsLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + numToWordsLessThanThousand(n % 100) : '');
  };

  const convertNepaliSystem = (n: number): string => {
    if (n === 0) return 'Zero';
    let res = '';
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const rem = n;

    if (crore > 0) res += numToWordsLessThanThousand(crore) + ' Crore ';
    if (lakh > 0) res += numToWordsLessThanThousand(lakh) + ' Lakh ';
    if (thousand > 0) res += numToWordsLessThanThousand(thousand) + ' Thousand ';
    if (rem > 0) res += numToWordsLessThanThousand(rem);

    return res.trim();
  };

  let words = convertNepaliSystem(rupees) + ' Rupees';
  if (paisa > 0) {
    words += ' and ' + numToWordsLessThanThousand(paisa) + ' Paisa';
  }
  return words + ' Only.';
};

export const TaxInvoiceModal: React.FC<Props> = ({
  invoice,
  onClose,
  onSelectInvoice,
  onNext,
  onPrev,
  totalInvoices = 150,
  isUnlocked = false,
  onRequestUnlock
}) => {
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // ESC and Arrow Keys event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && viewMode === 'single') {
        onNext?.();
      } else if (e.key === 'ArrowLeft' && viewMode === 'single') {
        onPrev?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, viewMode]);

  const handlePrint = () => {
    if (!isUnlocked && onRequestUnlock) {
      onRequestUnlock();
      return;
    }
    window.print();
  };

  const renderSingleInvoiceSheet = (inv: SalesTaxInvoice, keyIndex?: number) => {
    const vatBoxes = (inv.sellerVatNo || '123456789').split('');
    const panBoxes = (inv.customerPan.replace(/\D/g, '') || '123123123').split('');
    while (panBoxes.length < 9) panBoxes.push('-');
    const inWords = numberToWordsRupees(inv.grandTotal);

    return (
      <div
        key={keyIndex || inv.id}
        className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-300 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:page-break-after-always mb-8 print:mb-0"
        style={{ minHeight: '800px' }}
      >
        {/* Header */}
        <div className="text-center space-y-0.5 border-b border-slate-300 pb-3">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-serif uppercase">
            {inv.sellerName}
          </h1>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
            {inv.sellerTitle}
          </div>
          <div className="text-[11px] text-slate-600">
            {inv.sellerAddress}
          </div>
          <div className="pt-2">
            <span className="text-sm font-black underline uppercase tracking-widest px-3 py-0.5">
              TAX INVOICE
            </span>
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="pt-3 text-xs space-y-1.5 border-b border-slate-300 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-mono">
              <span className="font-bold">VAT No.:</span>
              <div className="flex border border-slate-800">
                {vatBoxes.map((digit, i) => (
                  <span
                    key={i}
                    className="w-4 h-5 flex items-center justify-center font-bold border-r border-slate-800 last:border-r-0 text-[11px]"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>

            <div className="font-mono">
              <span className="font-bold">Date:</span>{' '}
              <span className="font-bold">{inv.date}</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div>
                <span className="font-bold">Customer's Name:</span>{' '}
                <span className="font-bold">{inv.customerName}</span>
              </div>
              <div className="text-[11px] text-slate-700">
                <span className="font-bold">Address/Ph No.:</span>{' '}
                <span>{inv.customerAddress}</span>
              </div>
            </div>

            <div className="font-mono text-right shrink-0">
              <span className="font-bold">Invoice No:</span>{' '}
              <span className="font-extrabold text-slate-900 border-b border-dotted border-slate-800 pb-0.5">
                {inv.invoiceNo}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 font-mono">
            <div className="flex items-center gap-1">
              <span className="font-bold text-[11px]">Customer's PAN Number:</span>
              <div className="flex border border-slate-800">
                {panBoxes.map((digit, i) => (
                  <span
                    key={i}
                    className="w-4 h-5 flex items-center justify-center font-bold border-r border-slate-800 last:border-r-0 text-[11px]"
                  >
                    {digit}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold">Terms of Payment:</span>
              <span className="inline-flex items-center gap-1">
                [{inv.termsOfPayment === 'Cash' ? ' ✓ ' : ' '}] Cash
              </span>
              <span className="inline-flex items-center gap-1">
                [{inv.termsOfPayment === 'Cheque' ? ' ✓ ' : ' '}] Cheque
              </span>
              <span className="inline-flex items-center gap-1">
                [{inv.termsOfPayment === 'CIPS' ? ' ✓ ' : ' '}] CIPS
              </span>
              <span className="inline-flex items-center gap-1">
                [{inv.termsOfPayment === 'Credit' ? ' ✓ ' : ' '}] Credit
              </span>
            </div>
          </div>
        </div>

        {/* Table Items */}
        <div className="pt-2">
          <table className="w-full border-collapse border border-slate-900 text-xs">
            <thead>
              <tr className="border-b border-slate-900 text-center font-bold">
                <th className="border-r border-slate-900 p-1.5 w-12">S.N.</th>
                <th className="border-r border-slate-900 p-1.5 w-20">HS Code</th>
                <th className="border-r border-slate-900 p-1.5 text-left pl-3">Particulars</th>
                <th className="p-1.5 w-32">
                  Amount
                  <div className="flex justify-between border-t border-slate-900 pt-0.5 text-[10px] px-2 font-mono">
                    <span>Rs.</span>
                    <span>Ps.</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-mono divide-y divide-slate-300">
              <tr className="align-top" style={{ minHeight: '40px' }}>
                <td className="border-r border-slate-900 p-2 text-center">1</td>
                <td className="border-r border-slate-900 p-2 text-center text-slate-400">- - -</td>
                <td className="border-r border-slate-900 p-2 font-sans font-medium">
                  {inv.item1}
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-between px-2 font-bold">
                    <span>{inv.amt1.toLocaleString()}</span>
                    <span>00</span>
                  </div>
                </td>
              </tr>
              <tr className="align-top" style={{ minHeight: '40px' }}>
                <td className="border-r border-slate-900 p-2 text-center">2</td>
                <td className="border-r border-slate-900 p-2 text-center text-slate-400">- - -</td>
                <td className="border-r border-slate-900 p-2 font-sans font-medium">
                  {inv.item2}
                </td>
                <td className="p-2 text-right">
                  <div className="flex justify-between px-2 font-bold">
                    <span>{inv.amt2.toLocaleString()}</span>
                    <span>00</span>
                  </div>
                </td>
              </tr>

              <tr style={{ height: '140px' }}>
                <td className="border-r border-slate-900"></td>
                <td className="border-r border-slate-900"></td>
                <td className="border-r border-slate-900"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Totals Box */}
        <div className="border border-t-0 border-slate-900 text-xs">
          <div className="grid grid-cols-12 divide-x divide-slate-900">
            <div className="col-span-7 p-2.5 space-y-1">
              <span className="font-bold text-[10px] uppercase text-slate-500 block">In Words:</span>
              <p className="font-serif italic text-xs leading-relaxed font-bold">
                {inWords}
              </p>
            </div>

            <div className="col-span-5 font-mono text-xs divide-y divide-slate-900">
              <div className="flex justify-between p-1.5 font-bold">
                <span>Taxable Amount</span>
                <div className="flex gap-4">
                  <span>{inv.taxableAmount.toLocaleString()}</span>
                  <span>00</span>
                </div>
              </div>

              <div className="flex justify-between p-1.5 font-bold">
                <span>VAT 13%</span>
                <div className="flex gap-4">
                  <span>{Math.floor(inv.vatAmount).toLocaleString()}</span>
                  <span>{(inv.vatAmount % 1).toFixed(2).substring(2)}</span>
                </div>
              </div>

              <div className="flex justify-between p-1.5 font-black text-sm bg-slate-50">
                <span>Grand Total</span>
                <div className="flex gap-4">
                  <span>{Math.floor(inv.grandTotal).toLocaleString()}</span>
                  <span>{(inv.grandTotal % 1).toFixed(2).substring(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 pb-4 flex items-end justify-between text-xs font-mono">
          <div className="text-center">
            <div className="border-t border-dotted border-slate-800 w-36 pt-1 text-slate-700">
              Received By
            </div>
          </div>

          <div className="font-bold text-[11px]">E. & O. E.</div>

          <div className="text-center">
            <div className="font-serif italic font-bold mb-1 text-slate-900">
              {inv.signatory}
            </div>
            <div className="border-t border-dotted border-slate-800 w-44 pt-1 text-slate-700">
              Authorised Signatory
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">
              Printed: {inv.date} @ 11:30 AM
            </div>
          </div>
        </div>

        {/* Bank Details & QR Container */}
        <div className="mt-4 p-3 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-mono">
          <div className="space-y-0.5">
            <div className="font-bold uppercase text-[10px] text-slate-600">Bank Details:</div>
            <div><span className="font-bold">Bank Name:</span> {inv.bankName}</div>
            <div><span className="font-bold">A/C Name:</span> {inv.accountName}</div>
            <div><span className="font-bold">A/C Number:</span> {inv.accountNumber}</div>
            <div><span className="font-bold">Branch:</span> {inv.branch}</div>
            <div className="font-bold text-[10px] text-slate-800 pt-1">
              Deduct TDS @ 1.5% on Taxable Amount.
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 border-2 border-slate-900 flex items-center justify-center p-1 bg-white mx-auto">
              <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                <div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
                <div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
              </div>
            </div>
            <span className="text-[8px] font-bold text-slate-600 block mt-0.5">
              SCAN TO PAY VIA QR
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-6"
    >
      {/* Floating ESC Close Button Fixed in Top-Right Corner */}
      <button
        type="button"
        onClick={onClose}
        title="Exit Preview (Esc Key)"
        className="no-print fixed top-4 right-4 z-60 px-3.5 py-2 bg-slate-900 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-2xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <X className="w-4 h-4" />
        <span>Exit [Esc]</span>
      </button>

      {/* Top Controls Bar (Sticky, Never scrolls away) */}
      <div className="w-full max-w-4xl space-y-4 pt-1">
        <div className="no-print sticky top-3 z-50 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between shadow-2xl border border-slate-700 gap-3 text-xs">
          {/* Invoice Picker Dropdown (Any of the 150 invoices!) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-amber-400 whitespace-nowrap">
              Jump to Invoice:
            </span>
            <select
              value={invoice.invoiceNum}
              onChange={(e) => {
                const targetNum = Number(e.target.value);
                const target = SALES_INVOICES_150.find((i) => i.invoiceNum === targetNum);
                if (target && onSelectInvoice) {
                  onSelectInvoice(target);
                }
              }}
              className="bg-slate-800 text-white font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 max-w-[240px] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {SALES_INVOICES_150.map((inv) => (
                <option key={inv.id} value={inv.invoiceNum}>
                  #{inv.invoiceNo} — {inv.customerName} ({inv.date})
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 ml-1">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  viewMode === 'single'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Single Invoice
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All 150 Book
              </button>
            </div>
          </div>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center gap-2">
            {viewMode === 'single' && (
              <>
                {onPrev && (
                  <button
                    type="button"
                    onClick={onPrev}
                    disabled={invoice.invoiceNum <= 1}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Previous Invoice (Left Arrow)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                )}
                <span className="font-mono text-slate-400 font-bold px-1">
                  {invoice.invoiceNum} / {totalInvoices}
                </span>
                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={invoice.invoiceNum >= totalInvoices}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Next Invoice (Right Arrow)"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer ml-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{viewMode === 'single' ? 'Print / PDF' : 'Print All 150'}</span>
              {!isUnlocked && <Lock className="w-3 h-3 text-emerald-200" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ml-1"
              title="Close Preview (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </div>

        {/* Invoice Display View */}
        {viewMode === 'single' ? (
          renderSingleInvoiceSheet(invoice)
        ) : (
          <div className="space-y-6">
            <div className="no-print p-3 bg-blue-900/40 text-blue-200 border border-blue-700/50 rounded-xl text-center text-xs">
              Displaying all 150 consecutive tax invoices in continuous book format. Scroll down to inspect any invoice.
            </div>
            {SALES_INVOICES_150.map((inv, idx) => renderSingleInvoiceSheet(inv, idx))}
          </div>
        )}
      </div>
    </div>
  );
};
