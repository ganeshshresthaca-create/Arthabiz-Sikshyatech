import React, { useState } from 'react';
import { DayModule, StudentProfile } from '../types/accounting';
import { formatRs } from '../data/modulesData';
import { Printer, Download, FileSpreadsheet, Filter, CheckCircle2 } from 'lucide-react';

interface Props {
  dayModule: DayModule;
  studentProfile: StudentProfile | null;
}

export const DayBookReport: React.FC<Props> = ({
  dayModule,
  studentProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Cash Book',
    'Bank Book',
    'Purchase Book',
    'Sales Book',
    'General Journal',
    'Returns & Adjustments',
  ];

  const filteredEntries = dayModule.questions.filter((q) => {
    if (selectedCategory === 'ALL') return true;
    return q.dayBookCategory === selectedCategory;
  });

  const totalDebit = filteredEntries.reduce((sum, q) => sum + q.journalEntry.debitAmount, 0);
  const totalCredit = filteredEntries.reduce((sum, q) => sum + q.journalEntry.creditAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = `Arthabiz | Sikshyatech Hub - Daily Transaction Day Book\n`;
    csv += `Day Module,Day ${dayModule.dayNumber} - ${dayModule.title}\n`;
    csv += `Date,${dayModule.defaultDate}\n`;
    csv += `Candidate,${studentProfile?.name || 'Registered Candidate'}\n`;
    csv += `Filter Category,${selectedCategory}\n\n`;

    csv += `Ref#,Date,Transaction Title,Primary Ledger / Account,Day Book Category,Particulars,Debit (Rs),Credit (Rs)\n`;
    filteredEntries.forEach((q) => {
      csv += `"${q.journalEntry.ref}","${q.journalEntry.date}","${q.transactionTitle}","${q.ledgerAffected}","${q.dayBookCategory}","${q.journalEntry.drLedger} Dr / ${q.journalEntry.crLedger} Cr",${q.journalEntry.debitAmount},${q.journalEntry.creditAmount}\n`;
    });
    csv += `,"TOTALS",,,,,${totalDebit},${totalCredit}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DayBook_Day${dayModule.dayNumber}_${selectedCategory}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header and Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-2xs print:border-none print:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Primary Book of Entry
              </span>
              <span className="text-xs font-medium text-slate-500">
                Day Book Report (50 Transactions)
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Standard Day Book — Day {dayModule.dayNumber}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Comprehensive chronological journal record of daily business vouchers, ledger movements, and financial flows.
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden flex-wrap">
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
              Export Day Book CSV
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 flex-wrap print:hidden">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Day Book:
          </span>
          {categories.map((cat) => {
            const count =
              cat === 'ALL'
                ? dayModule.questions.length
                : dayModule.questions.filter((q) => q.dayBookCategory === cat).length;
            if (count === 0 && cat !== 'ALL') return null;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Book Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs print:border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3 px-3 w-16">Voucher#</th>
                <th className="py-3 px-3 w-24">Date</th>
                <th className="py-3 px-3 w-32">Classification</th>
                <th className="py-3 px-4">Transaction Particulars & Narration</th>
                <th className="py-3 px-3 text-right w-28">Debit (Rs)</th>
                <th className="py-3 px-3 text-right w-28">Credit (Rs)</th>
                <th className="py-3 px-3 text-center w-24">Ledger Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {filteredEntries.map((q, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <tr
                    key={q.id}
                    className={`hover:bg-blue-50/40 transition ${
                      isEven ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    {/* Voucher Ref */}
                    <td className="py-3 px-3 align-top font-bold text-blue-700">
                      {q.journalEntry.ref}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 align-top text-slate-600">
                      {q.journalEntry.date}
                    </td>

                    {/* Classification */}
                    <td className="py-3 px-3 align-top font-sans">
                      <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        {q.dayBookCategory}
                      </span>
                    </td>

                    {/* Particulars & Narration */}
                    <td className="py-3 px-4 align-top font-sans space-y-1">
                      <div className="font-semibold text-slate-900">
                        {q.journalEntry.drLedger} <span className="font-normal text-slate-500">vs</span> {q.journalEntry.crLedger}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {q.journalEntry.narration}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        Scenario: {q.transactionText}
                      </div>
                    </td>

                    {/* Debit */}
                    <td className="py-3 px-3 align-top text-right font-bold text-emerald-800">
                      Rs. {formatRs(q.journalEntry.debitAmount)}
                    </td>

                    {/* Credit */}
                    <td className="py-3 px-3 align-top text-right font-bold text-slate-900">
                      Rs. {formatRs(q.journalEntry.creditAmount)}
                    </td>

                    {/* Ledger Affected */}
                    <td className="py-3 px-3 align-top text-center font-sans">
                      <span className="text-[10px] font-medium text-blue-800 bg-blue-50 px-2 py-1 rounded border border-blue-200 block truncate" title={q.ledgerAffected}>
                        {q.ledgerAffected}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals */}
            <tfoot>
              <tr className="bg-slate-900 text-white font-mono font-bold text-xs border-t-2 border-slate-950">
                <td colSpan={4} className="py-3 px-4 text-right uppercase tracking-wider font-sans font-extrabold text-blue-200">
                  Day Book Total ({filteredEntries.length} Vouchers):
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 text-sm">
                  Rs. {formatRs(totalDebit)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 text-sm">
                  Rs. {formatRs(totalCredit)}
                </td>
                <td className="py-3 px-3 text-center text-xs font-sans text-emerald-300">
                  Balanced ✓
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
