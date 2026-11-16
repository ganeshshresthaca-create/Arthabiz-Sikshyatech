import React from 'react';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Compass,
  Scale,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onBack?: () => void;
  onGoToTestArena?: (dayNumber?: number) => void;
  onGoToNextLesson?: () => void;
}

export const CompleteRulesLesson: React.FC<Props> = ({
  onBack,
  onGoToTestArena,
  onGoToNextLesson,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/70 overflow-hidden py-8 sm:py-10 font-sans">
      {/* Subtle Geometric Background Watermark matching Main Dashboard */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Top Bar with Circular Go To Previous Button & Centered Main Title (matching Main Dashboard) */}
        <div className="relative">
          {onBack && (
            <div className="sm:absolute sm:left-0 sm:top-1 mb-3 sm:mb-0">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to Library Shelves"
                title="Back to Library Shelves"
                className="p-2 sm:p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-full border border-slate-300 shadow-2xs transition flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Centered Main Title Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Complete Rules for Dr &amp; Cr: <span className="text-blue-700">The Golden Rules</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
              Master The Golden Rules of Accounting across Personal, Real, and Nominal accounts with standard debit &amp; credit principles and practical double-entry illustrations.
            </p>
          </div>
        </div>

        {/* Main Content Container with Clear Defined Border */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-8">
          {/* Part A: The Golden Rules of Accounting (Traditional Approach) */}
          <div className="space-y-5">
            <div className="flex items-center bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-sm font-extrabold text-slate-900 tracking-wide">
                  Part A: The Golden Rules of Accounting (Traditional English Approach)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Personal Account */}
              <div className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-blue-100 pb-3">
                    <span className="text-sm font-extrabold text-blue-900">
                      1. Personal Account
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                      Persons &amp; Entities
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Accounts of natural persons, registered firms, companies, banks, and representative obligations.
                  </p>
                  <div className="mt-3 text-xs text-slate-500 space-y-1 border-l-2 border-blue-300 pl-2.5 bg-blue-50/40 py-2 rounded-r-lg">
                    <div>• <strong>Natural:</strong> Hari, Sita, Ram</div>
                    <div>• <strong>Artificial:</strong> Nabil Bank, Nepal Telecom</div>
                    <div>• <strong>Representative:</strong> Outstanding Salary, Prepaid Rent</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-300 flex items-center justify-between shadow-2xs">
                    <span>Debit:</span>
                    <span>The Receiver</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl font-bold border border-rose-300 flex items-center justify-between shadow-2xs">
                    <span>Credit:</span>
                    <span>The Giver</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong>Practical Example:</strong> Paid Rs. 20,000 to Everest Traders &rarr; <em>Everest Traders A/c Dr. (Receiver)</em>
                </div>
              </div>

              {/* 2. Real Account */}
              <div className="bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-indigo-100 pb-3">
                    <span className="text-sm font-extrabold text-indigo-900">
                      2. Real Account
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200">
                      Assets &amp; Properties
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Accounts representing economic properties, tangible capital assets, and valuable commercial rights owned.
                  </p>
                  <div className="mt-3 text-xs text-slate-500 space-y-1 border-l-2 border-indigo-300 pl-2.5 bg-indigo-50/40 py-2 rounded-r-lg">
                    <div>• <strong>Tangible:</strong> Cash, Machinery, Furniture, Land</div>
                    <div>• <strong>Intangible:</strong> Goodwill, Patents, Trademarks, Software</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-300 flex items-center justify-between shadow-2xs">
                    <span>Debit:</span>
                    <span>What Comes In</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl font-bold border border-rose-300 flex items-center justify-between shadow-2xs">
                    <span>Credit:</span>
                    <span>What Goes Out</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong>Practical Example:</strong> Bought machinery for cash &rarr; <em>Machinery A/c Dr. (Comes In), Cash A/c Cr. (Goes Out)</em>
                </div>
              </div>

              {/* 3. Nominal Account */}
              <div className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <span className="text-sm font-extrabold text-purple-900">
                      3. Nominal Account
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                      Expenses &amp; Incomes
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Periodic accounts utilized to record operating disbursements, financial costs, operational gains, and revenues.
                  </p>
                  <div className="mt-3 text-xs text-slate-500 space-y-1 border-l-2 border-purple-300 pl-2.5 bg-purple-50/40 py-2 rounded-r-lg">
                    <div>• <strong>Expenses:</strong> Salaries, Rent, Electricity, Bad Debts</div>
                    <div>• <strong>Incomes:</strong> Sales, Interest, Commission, Discount Received</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-bold border border-emerald-300 flex items-center justify-between shadow-2xs">
                    <span>Debit:</span>
                    <span>All Expenses &amp; Losses</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl font-bold border border-rose-300 flex items-center justify-between shadow-2xs">
                    <span>Credit:</span>
                    <span>All Incomes &amp; Gains</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong>Practical Example:</strong> Paid office rent Rs. 15,000 &rarr; <em>Rent Expense A/c Dr., Cash A/c Cr.</em>
                </div>
              </div>
            </div>
          </div>

          {/* Part B: The Modern Approach of Accounting (Accounting Equation / American Approach) */}
          <div className="pt-6 border-t-2 border-slate-200 space-y-5">
            <div className="flex items-center bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-4">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-indigo-700 shrink-0" />
                <div>
                  <span className="text-sm font-extrabold text-slate-900 tracking-wide block">
                    Part B: The Modern Approach of Accounting (Accounting Equation / American Approach)
                  </span>
                  <p className="text-xs text-indigo-900 mt-0.5">
                    Directly derived from the Balance Sheet Equation: <span className="font-mono font-bold">Assets = Liabilities + Equity</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Mnemonic Banner: Cleaned of deleted component */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-5 text-white shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Instant Rule for Debit (Dr.) vs. Credit (Cr.) Increases
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-300 font-bold flex items-center gap-1.5">
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>D • E • A = Debit</span>
                  </div>
                  <div className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/40 rounded-lg text-blue-300 font-bold flex items-center gap-1.5">
                    <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>L • E • R = Credit</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs border-t border-white/10">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="font-bold text-emerald-400 font-mono block mb-1">D • E • A (Debit to Increase):</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>D</strong>rawings, <strong>E</strong>xpenses, and <strong>A</strong>ssets always increase on the <strong>Debit</strong> side and decrease on the <strong>Credit</strong> side.
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <span className="font-bold text-blue-400 font-mono block mb-1">L • E • R (Credit to Increase):</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <strong>L</strong>iabilities, <strong>E</strong>quity (Capital), and <strong>R</strong>evenue always increase on the <strong>Credit</strong> side and decrease on the <strong>Debit</strong> side.
                  </p>
                </div>
              </div>
            </div>

            {/* Cross-Classification Matrix Table with Increase/Decrease Icons */}
            <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-bold text-xs">
                      <th className="py-3 px-4 min-w-[180px]">Traditional Category</th>
                      <th className="py-3 px-4 w-44">Modern Classification</th>
                      <th className="py-3 px-4 min-w-[240px]">When to Debit (Dr.)</th>
                      <th className="py-3 px-4 min-w-[240px]">When to Credit (Cr.)</th>
                      <th className="py-3 px-4 min-w-[260px]">Practical Illustration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {/* Row 1: Assets */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-indigo-700">Real Account</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold text-xs border border-emerald-300">
                          Assets
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 bg-emerald-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>When Asset Increases (Comes in)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-800 bg-rose-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowDown className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>When Asset Decreases (Goes out)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Furniture bought: <strong>Furniture Dr.</strong> / <strong>Cash Cr.</strong>
                      </td>
                    </tr>

                    {/* Row 2: Liabilities */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-blue-700">Personal (Creditors/Lenders)</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg font-bold text-xs border border-rose-300">
                          Liabilities
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-800 bg-rose-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowDown className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>When Liability Decreases (Paid off)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 bg-emerald-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>When Liability Increases (Borrowed)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Creditor paid: <strong>Creditor Dr.</strong> / <strong>Bank Cr.</strong>
                      </td>
                    </tr>

                    {/* Row 3: Capital / Equity */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-blue-700">Personal (Proprietor)</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg font-bold text-xs border border-purple-300">
                          Capital / Equity
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-800 bg-rose-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowDown className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>When Capital Decreases (Drawings)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 bg-emerald-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>When Capital Increases (Introduced)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Introduced cash: <strong>Cash Dr.</strong> / <strong>Capital Cr.</strong>
                      </td>
                    </tr>

                    {/* Row 4: Expenses & Losses */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-700">Nominal (Expenses/Losses)</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-bold text-xs border border-amber-300">
                          Expenses &amp; Losses
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 bg-emerald-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>When Expense Incurred / Increases</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-800 bg-rose-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowDown className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>When Expense Reduced / Reimbursed</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Salaries paid: <strong>Salaries Dr.</strong> / <strong>Bank Cr.</strong>
                      </td>
                    </tr>

                    {/* Row 5: Revenues & Gains */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-emerald-700">Nominal (Incomes/Gains)</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg font-bold text-xs border border-blue-300">
                          Revenues &amp; Gains
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-rose-800 bg-rose-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowDown className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>When Revenue Reduced / Allowed</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-800 bg-emerald-50/30">
                        <div className="flex items-center gap-1.5">
                          <ArrowUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>When Revenue Earned / Increases</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        Commission received: <strong>Cash Dr.</strong> / <strong>Commission Cr.</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
