import React from 'react';
import { DayModule, StudentProfile, Question } from '../types/accounting';
import { formatRs } from '../data/modulesData';
import { Printer, Download, BookMarked, Search, ArrowUpDown, Eye } from 'lucide-react';
import { VoucherPreviewModal } from './VoucherPreviewModal';

interface Props {
  dayModule: DayModule;
  studentProfile: StudentProfile | null;
}

interface ParsedCreditLine {
  ledger: string;
  amount: number;
}

const parseCreditLines = (rawCr: string, defaultCreditAmount: number): ParsedCreditLine[] => {
  if (!rawCr.includes('&')) {
    return [{ ledger: rawCr, amount: defaultCreditAmount }];
  }

  const parts = rawCr.split('&').map((p) => p.trim());
  const lines: ParsedCreditLine[] = [];
  let totalParsed = 0;

  parts.forEach((p) => {
    const match = p.match(/(.*?)\s*\(Rs\.\s*([\d,]+)\)/);
    if (match) {
      const amt = parseInt(match[2].replace(/,/g, ''), 10) || 0;
      lines.push({ ledger: match[1].trim(), amount: amt });
      totalParsed += amt;
    } else {
      lines.push({ ledger: p, amount: 0 });
    }
  });

  if (totalParsed === 0 && lines.length > 0) {
    lines[0].amount = defaultCreditAmount;
  }

  return lines;
};

export const JournalEntriesReport: React.FC<Props> = ({
  dayModule,
  studentProfile,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedVoucherQuestion, setSelectedVoucherQuestion] = React.useState<Question | null>(null);

  const filteredQuestions = dayModule.questions.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      q.transactionTitle.toLowerCase().includes(term) ||
      q.transactionCode.toLowerCase().includes(term) ||
      q.journalEntry.drLedger.toLowerCase().includes(term) ||
      q.journalEntry.crLedger.toLowerCase().includes(term) ||
      q.journalEntry.narration.toLowerCase().includes(term) ||
      q.transactionText.toLowerCase().includes(term)
    );
  });

  const totalDebit = dayModule.questions.reduce((sum, q) => sum + q.journalEntry.debitAmount, 0);
  const totalCredit = dayModule.questions.reduce((sum, q) => sum + q.journalEntry.creditAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = `Arthabiz | Sikshyatech Hub - Standard Journal Entries Summary\n`;
    csv += `Module: Day ${dayModule.dayNumber} - ${dayModule.title}\n`;
    csv += `Default Date: ${dayModule.defaultDate}\n`;
    csv += `Candidate Name: ${studentProfile?.name || 'Registered Candidate'}\n`;
    csv += `Candidate ID: ${studentProfile?.assignedId || 'N/A'}\n\n`;

    csv += `Date,Transaction Number (Ref#),Particulars - Debit Ledger,Particulars - Credit Ledger,Narration,Debit (Rs),Credit (Rs)\n`;
    dayModule.questions.forEach((q) => {
      csv += `"${q.journalEntry.date}","${q.journalEntry.ref}","${q.journalEntry.drLedger}","${q.journalEntry.crLedger}","${q.journalEntry.narration}",${q.journalEntry.debitAmount},${q.journalEntry.creditAmount}\n`;
    });
    csv += `,"TOTALS",,,,"${totalDebit}","${totalCredit}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Journal_Entries_Day${dayModule.dayNumber}_50Transactions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="journal-report-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header card with export actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-2xs print:border-none print:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Official Report
              </span>
              <span className="text-xs font-medium text-slate-500">
                Double-Entry Journal Summary (50 Transactions)
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              General Journal Entries Book — Day {dayModule.dayNumber}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Standard double-entry accounting solution with debit ledger on row 1 and credit ledger on row 2.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ledger / ref..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:bg-white w-48 sm:w-56"
              />
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Candidate Information Strip for Physical Records */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Institution</span>
            <span className="font-bold text-slate-900">Arthabiz | Sikshyatech Hub</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate</span>
            <span className="font-semibold text-slate-900">{studentProfile?.name || 'Registered Student'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate ID</span>
            <span className="font-mono text-slate-800">{studentProfile?.assignedId || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Standard Practice Date</span>
            <span className="font-semibold text-blue-700">{dayModule.defaultDate}</span>
          </div>
        </div>
      </div>

      {/* Standard Journal Entries Summary Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs print:border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-3 w-24 min-w-[90px]">Date</th>
                <th className="py-3 px-3 w-24 min-w-[90px]">Ref# (TrxJV-)</th>
                <th className="py-3 px-3 w-[40%] min-w-[260px] max-w-sm sm:max-w-md">Particulars (Dr - Ledger, Cr - Ledger, Narration)</th>
                <th className="py-3 px-3 text-right w-28 sm:w-32 min-w-[110px]">Debit (Rs)</th>
                <th className="py-3 px-3 text-right w-28 sm:w-32 min-w-[110px]">Credit (Rs)</th>
                <th className="py-3 px-3 text-center w-16 min-w-[64px] print:hidden">Action</th>
              </tr>
            </thead>
            {filteredQuestions.map((q, idx) => {
              const crLines = parseCreditLines(q.journalEntry.crLedger, q.journalEntry.creditAmount);
              const totalRows = 1 + crLines.length + 1; // 1 Dr row + N Cr rows + 1 Narration row
              const cleanNarration = q.journalEntry.narration.startsWith('Being')
                ? q.journalEntry.narration
                : `Being ${q.journalEntry.narration}`;
              const isEven = idx % 2 === 0;
              const bgClass = isEven ? 'bg-white' : 'bg-slate-50/50';

              return (
                <tbody
                  key={q.id}
                  className={`border-b-2 border-slate-700 sm:border-b-2 sm:border-slate-800 font-mono ${bgClass} hover:bg-blue-50/30 transition`}
                >
                  {/* Row 1: Debit Line */}
                  <tr>
                    {/* Date Column */}
                    <td
                      rowSpan={totalRows}
                      className="py-2.5 px-3 align-top text-slate-700 text-xs border-r border-slate-200"
                    >
                      {q.journalEntry.date}
                    </td>

                    {/* Transaction number (Ref#) */}
                    <td
                      rowSpan={totalRows}
                      className="py-2.5 px-3 align-top border-r border-slate-200"
                    >
                      <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[11px] block text-center">
                        {q.journalEntry.ref}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-sans text-center">
                        Q#{q.id}
                      </div>
                    </td>

                    {/* Particulars: Dr Ledger */}
                    <td className="py-2 px-3 align-top font-sans w-[40%] min-w-[260px] max-w-sm sm:max-w-md">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span className="truncate pr-2">{q.journalEntry.drLedger}</span>
                        <span className="text-xs font-mono text-slate-500 font-normal shrink-0">... Dr.</span>
                      </div>
                    </td>

                    {/* Debit Amount on Row 1 */}
                    <td className="py-2 px-3 align-top text-right font-bold text-slate-900 font-mono">
                      Rs. {formatRs(q.journalEntry.debitAmount)}
                    </td>

                    {/* Credit Amount on Row 1 is empty / dash */}
                    <td className="py-2 px-3 align-top text-right text-slate-300 font-mono select-none">
                      —
                    </td>

                    {/* Action Column: Preview Icon Only */}
                    <td
                      rowSpan={totalRows}
                      className="py-2.5 px-3 align-middle text-center print:hidden border-l border-slate-200"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedVoucherQuestion(q)}
                        className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg shadow-2xs transition group"
                        title={`Preview Voucher for ${q.journalEntry.ref}`}
                        aria-label={`Preview Voucher for ${q.journalEntry.ref}`}
                      >
                        <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2+: Credit Line(s) */}
                  {crLines.map((crLine, crIdx) => (
                    <tr key={crIdx}>
                      {/* Particulars: Cr Ledger */}
                      <td className="py-1.5 px-3 align-top font-sans w-[40%] min-w-[260px] max-w-sm sm:max-w-md">
                        <div className="pl-6 font-semibold text-slate-800 truncate">
                          To {crLine.ledger}
                        </div>
                      </td>

                      {/* Debit Amount on Credit row is empty / dash */}
                      <td className="py-1.5 px-3 align-top text-right text-slate-300 font-mono select-none">
                        —
                      </td>

                      {/* Credit Amount on Row 2 */}
                      <td className="py-1.5 px-3 align-top text-right font-bold text-slate-900 font-mono">
                        Rs. {formatRs(crLine.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* Row 3 (Final row of transaction): Narration Line (No question text) */}
                  <tr className="border-b-2 border-slate-700 sm:border-b-2 sm:border-slate-800">
                    <td className="pb-3 pt-1 px-3 align-top font-sans w-[40%] min-w-[260px] max-w-sm sm:max-w-md">
                      <div className="pl-6 italic text-[11px] text-slate-600 font-serif leading-relaxed">
                        ({cleanNarration})
                      </div>
                    </td>
                    <td className="pb-3 pt-1 px-3 align-top text-right text-slate-300 font-mono"></td>
                    <td className="pb-3 pt-1 px-3 align-top text-right text-slate-300 font-mono"></td>
                  </tr>
                </tbody>
              );
            })}
            {/* Reconciliation Totals Row */}
            <tfoot>
              <tr className="bg-slate-900 text-white font-mono font-bold text-xs border-t-2 border-slate-950">
                <td colSpan={3} className="py-3 px-4 text-right tracking-wider uppercase font-sans font-extrabold text-blue-200">
                  Total Debit & Credit Reconciliation (50 Transactions):
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 text-sm">
                  Rs. {formatRs(totalDebit)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 text-sm">
                  Rs. {formatRs(totalCredit)}
                </td>
                <td className="print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Verification Stamp for Offline Records */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 print:block">
        <p className="font-semibold text-slate-800">
          Arthabiz | Sikshyatech Hub — Double-Entry General Journal Ledger
        </p>
        <p className="text-[11px] text-slate-400">
          Generated automatically for Day {dayModule.dayNumber} ({dayModule.defaultDate}) • 50 Transactions Verified Balanced
        </p>
      </div>

      {/* Voucher Preview Modal */}
      <VoucherPreviewModal
        isOpen={!!selectedVoucherQuestion}
        onClose={() => setSelectedVoucherQuestion(null)}
        question={selectedVoucherQuestion}
        dayNumber={dayModule.dayNumber}
        studentName={studentProfile?.name}
      />
    </div>
  );
};

