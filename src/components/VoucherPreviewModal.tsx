import React, { useEffect } from 'react';
import { Question } from '../types/accounting';
import { formatRs } from '../data/modulesData';
import { X, Printer, Download, FileText, ShieldCheck, Building2 } from 'lucide-react';
import { downloadVoucherPDF } from '../utils/documentExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  dayNumber: number;
  studentName?: string;
}

export const VoucherPreviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  question,
  dayNumber,
  studentName,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('voucher-modal-active');
    } else {
      document.body.classList.remove('voucher-modal-active');
    }
    return () => {
      document.body.classList.remove('voucher-modal-active');
    };
  }, [isOpen]);

  if (!isOpen || !question) return null;

  const voucherNo = `JV-2083/84-D${dayNumber}-${question.transactionCode.replace(/^TrxJV-/, '')}`;
  const isBank = question.dayBookCategory === 'Bank Book' || question.journalEntry.crLedger.includes('Bank');
  const isCash = question.dayBookCategory === 'Cash Book' || question.journalEntry.crLedger.includes('Cash');
  
  let voucherType = 'JOURNAL VOUCHER';
  if (isBank) voucherType = 'BANK PAYMENT VOUCHER';
  else if (isCash) voucherType = 'CASH PAYMENT VOUCHER';

  // Parse compound credits if any (e.g. "Bank A/c (Rs. 85,000) & TDS Payable A/c (Rs. 15,000)")
  const rawCr = question.journalEntry.crLedger;
  const creditLines: { title: string; amtStr: string }[] = [];

  if (rawCr.includes('&')) {
    const parts = rawCr.split('&').map((p) => p.trim());
    parts.forEach((p) => {
      const match = p.match(/(.*?)\s*\(Rs\.\s*([\d,]+)\)/);
      if (match) {
        creditLines.push({ title: `To ${match[1].trim()}`, amtStr: `Rs. ${match[2]}` });
      } else {
        creditLines.push({ title: `To ${p}`, amtStr: `Rs. ${formatRs(question.journalEntry.creditAmount)}` });
      }
    });
  } else {
    creditLines.push({ title: `To ${rawCr}`, amtStr: `Rs. ${formatRs(question.journalEntry.creditAmount)}` });
  }

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    downloadVoucherPDF(question, dayNumber, studentName);
  };

  const cleanNarrationText = question.journalEntry.narration.startsWith('Being')
    ? question.journalEntry.narration
    : `Being ${question.journalEntry.narration}`;

  return (
    <div className="voucher-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="voucher-modal-window relative w-full max-w-3xl bg-white border border-slate-300 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[94vh] flex flex-col">
        {/* Top Action Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Accounting Voucher Preview
              </h2>
              <p className="text-xs text-slate-500">
                Ref: {question.transactionCode} • Day {dayNumber} ({question.journalEntry.date})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
            title="Close Voucher"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Content Area */}
        <div className="overflow-y-auto flex-1 py-4 pr-1 space-y-4 text-xs font-sans print:p-0">
          <div className="voucher-sheet border-2 border-slate-800 rounded-xl p-6 sm:p-7 bg-white shadow-xs print:border-2 print:shadow-none space-y-5">
            {/* Header: Company / Institutional Info */}
            <div className="text-center border-b-2 border-slate-800 pb-4">
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5 text-blue-700" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Arthabiz | Sikshyatech Hub
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Integrated Accounting & Financial Management System
              </p>
              <div className="inline-block mt-3 px-4 py-1 bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-md">
                {voucherType}
              </div>
            </div>

            {/* Voucher Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block uppercase font-sans text-[10px]">Voucher No:</span>
                <span className="font-bold text-blue-700">{voucherNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-sans text-[10px]">Date:</span>
                <span className="font-bold text-slate-900">{question.journalEntry.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-sans text-[10px]">Voucher Category:</span>
                <span className="font-bold text-slate-800">{question.dayBookCategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-sans text-[10px]">Fiscal Year:</span>
                <span className="font-bold text-slate-800">2083/84</span>
              </div>
            </div>

            {/* Transaction Scenario Statement */}
            <div className="bg-blue-50/70 border-l-4 border-blue-600 p-3 rounded-r-lg">
              <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">
                Transaction Statement:
              </div>
              <p className="text-xs text-slate-800 mt-0.5 font-medium leading-relaxed">
                {question.transactionText}
              </p>
            </div>

            {/* Official Accounting Ledger Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-12 text-center border-r border-slate-700">S.N.</th>
                    <th className="py-2.5 px-4 border-r border-slate-700">Account Head & Particulars</th>
                    <th className="py-2.5 px-3 w-16 text-center border-r border-slate-700">L.F.</th>
                    <th className="py-2.5 px-3 w-32 text-right border-r border-slate-700">Debit (NPR)</th>
                    <th className="py-2.5 px-3 w-32 text-right">Credit (NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {/* Debit Line */}
                  <tr className="bg-white">
                    <td className="py-3 px-3 text-center align-top text-slate-500">1</td>
                    <td className="py-3 px-4 font-bold text-slate-900 align-top">
                      {question.journalEntry.drLedger}
                    </td>
                    <td className="py-3 px-3 text-center align-top text-slate-400">101</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 align-top">
                      {formatRs(question.journalEntry.debitAmount)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 align-top">—</td>
                  </tr>

                  {/* Credit Line(s) */}
                  {creditLines.map((line, idx) => (
                    <tr key={idx} className="bg-slate-50/40">
                      <td className="py-3 px-3 text-center align-top text-slate-500">{idx + 2}</td>
                      <td className="py-3 px-4 align-top">
                        <div className="pl-6 font-semibold text-slate-800">{line.title}</div>
                      </td>
                      <td className="py-3 px-3 text-center align-top text-slate-400">20{idx + 1}</td>
                      <td className="py-3 px-3 text-right text-slate-300 align-top">—</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 align-top">
                        {line.amtStr.replace(/^Rs\.\s*/, '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Row */}
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-800 text-xs">
                    <td colSpan={3} className="py-2.5 px-4 text-right font-semibold font-sans text-slate-700">
                      Voucher Balance Total:
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-700 border-r border-slate-300">
                      Rs. {formatRs(question.journalEntry.debitAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-700">
                      Rs. {formatRs(question.journalEntry.creditAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Narration */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Brief Narration: </span>
              <span className="italic text-slate-800 font-serif">
                ({cleanNarrationText})
              </span>
            </div>

            {/* Multi-Tier Authority Signatures Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-900">{studentName || 'Accounts Officer'}</div>
                <div className="text-[10px] text-slate-500 uppercase">Prepared By</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-900">Internal Auditor</div>
                <div className="text-[10px] text-slate-500 uppercase">Checked By</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-900">Finance Manager</div>
                <div className="text-[10px] text-slate-500 uppercase">Verified By</div>
              </div>
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-900">Chief Executive / CFO</div>
                <div className="text-[10px] text-slate-500 uppercase">Approved By</div>
              </div>
            </div>

            {/* Seal / Verification stamp */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Digitally Verified & Balanced Voucher</span>
              </div>
              <div>Generated via Arthabiz Accounting Portal</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSavePDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              title="Download official voucher as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              title="Print voucher or open browser print"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

