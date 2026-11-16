import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface Props {
  onBack?: () => void;
  onGoToCompleteRules: () => void;
  onGoToTestArena: () => void;
}

interface BalanceTransaction {
  id: string;
  name: string;
  description: string;
  amount: string;
  debitAccount: string;
  debitCategory: string;
  debitRole: string;
  debitEffect: 'increase' | 'decrease';
  debitEffectLabel: string;
  creditAccount: string;
  creditCategory: string;
  creditRole: string;
  creditEffect: 'increase' | 'decrease';
  creditEffectLabel: string;
  explanation: string;
}

const FOUNDATIONAL_TRANSACTIONS: BalanceTransaction[] = [
  {
    id: 'tx-1',
    name: 'Capital Introduction',
    description: 'Owner invests NPR 500,000 cash to start the business',
    amount: 'NPR 500,000',
    debitAccount: 'Cash in Hand / Bank A/c',
    debitCategory: 'Asset (Resource Received)',
    debitRole: 'Cash comes IN to business custody',
    debitEffect: 'increase',
    debitEffectLabel: 'Asset Inflow (↑)',
    creditAccount: 'Owner Capital Equity A/c',
    creditCategory: 'Equity (Source of Fund)',
    creditRole: 'Owner is the source providing the funds',
    creditEffect: 'increase',
    creditEffectLabel: 'Equity Inflow (↑)',
    explanation: 'The business gains liquid funds (Asset Dr.) while recognizing its obligation to the owner (Equity Cr.). Both sides equal NPR 500,000.',
  },
  {
    id: 'tx-2',
    name: 'Equipment Purchase for Cash',
    description: 'Purchased computerized accounting workstation for NPR 65,000 cash',
    amount: 'NPR 65,000',
    debitAccount: 'Office Equipment A/c',
    debitCategory: 'Asset (New Resource Acquired)',
    debitRole: 'New tangible productivity asset enters',
    debitEffect: 'increase',
    debitEffectLabel: 'Asset Increase (↑)',
    creditAccount: 'Cash / Bank A/c',
    creditCategory: 'Asset (Resource Outflow)',
    creditRole: 'Cash departs to pay the vendor',
    creditEffect: 'decrease',
    creditEffectLabel: 'Asset Decrease (↓)',
    explanation: 'One asset increases while another decreases by the exact same amount. Total net assets remain unchanged.',
  },
  {
    id: 'tx-3',
    name: 'Merchandise on Credit',
    description: 'Purchased goods inventory worth NPR 120,000 on 30-day credit',
    amount: 'NPR 120,000',
    debitAccount: 'Merchandise Inventory A/c',
    debitCategory: 'Asset (Goods Received)',
    debitRole: 'Trading stock enters business warehouse',
    debitEffect: 'increase',
    debitEffectLabel: 'Asset Increase (↑)',
    creditAccount: 'Accounts Payable (Creditors) A/c',
    creditCategory: 'Liability (Present Obligation)',
    creditRole: 'Supplier financed the purchase',
    creditEffect: 'increase',
    creditEffectLabel: 'Liability Increase (↑)',
    explanation: 'Both assets and liabilities increase simultaneously by NPR 120,000. Balance is maintained.',
  },
  {
    id: 'tx-4',
    name: 'Consulting Fee Earned',
    description: 'Delivered tax audit consultation and received NPR 45,000 direct bank transfer',
    amount: 'NPR 45,000',
    debitAccount: 'Bank Current A/c',
    debitCategory: 'Asset (Inflow of Value)',
    debitRole: 'Bank balance increases',
    debitEffect: 'increase',
    debitEffectLabel: 'Asset Increase (↑)',
    creditAccount: 'Professional Service Revenue A/c',
    creditCategory: 'Income (Equity Growth)',
    creditRole: 'Earnings earned from client service',
    creditEffect: 'increase',
    creditEffectLabel: 'Revenue Increase (↑)',
    explanation: 'Bank asset increases and equity increases through revenue. Left pan = Right pan.',
  },
  {
    id: 'tx-5',
    name: 'Office Rent Payment',
    description: 'Paid commercial office rent of NPR 25,000 by bank cheque',
    amount: 'NPR 25,000',
    debitAccount: 'Rent Expense A/c',
    debitCategory: 'Expense (Cost of Operations)',
    debitRole: 'Consumed occupancy service',
    debitEffect: 'increase',
    debitEffectLabel: 'Expense Increase (↑)',
    creditAccount: 'Bank Current A/c',
    creditCategory: 'Asset (Bank Outflow)',
    creditRole: 'Funds depart bank account',
    creditEffect: 'decrease',
    creditEffectLabel: 'Asset Decrease (↓)',
    explanation: 'Expense reduces net equity while bank asset decreases by NPR 25,000. The scale remains in true equilibrium.',
  },
];

export const DebitCreditEquilibriumLesson: React.FC<Props> = ({
  onBack,
}) => {
  const [selectedTxId, setSelectedTxId] = useState<string>('tx-1');

  const activeTx =
    FOUNDATIONAL_TRANSACTIONS.find((t) => t.id === selectedTxId) ||
    FOUNDATIONAL_TRANSACTIONS[0];

  return (
    <div className="space-y-5 text-slate-800 font-sans">
      {/* ===================================================================== */}
      {/* 1. SLOGAN BANNER & CORE PHILOSOPHY */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-r from-[#2A1E14] via-[#3B281B] to-[#21160D] border-2 border-[#8C6239] rounded-2xl p-5 sm:p-7 text-amber-100 shadow-xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none select-none text-white">
          <Scale className="w-56 h-56" />
        </div>

        <div className="relative z-10 space-y-3.5 w-full">
          <div className="space-y-1.5">
            {/* Single Row: Go to previous circled button directly before the text without wrapping */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-nowrap">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="p-2 sm:p-2.5 bg-slate-900/90 hover:bg-slate-900 text-white hover:text-amber-300 rounded-full shadow-lg border border-slate-700 hover:border-amber-400 transition-all flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
                  title="Go to previous / Back"
                  aria-label="Go to previous"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}
              <h1 className="text-sm min-[380px]:text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#FCEBD0] tracking-tight font-serif whitespace-nowrap leading-tight">
                &ldquo;Happiness is when Debit (Dr) = Credit (Cr)&rdquo;
              </h1>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-amber-100/90 leading-relaxed font-medium">
              Every financial event in the world is a two-sided mirror: for every value received, a corresponding value is transferred. When both sides balance, financial truth and professional peace of mind are achieved.
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-mono">
            <span className="px-3 py-1 bg-black/50 rounded-lg border border-amber-500/40 text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Dual-Aspect Rule: &Delta;Debit &equiv; &Delta;Credit
            </span>
            <span className="px-3 py-1 bg-black/50 rounded-lg border border-amber-500/40 text-amber-300 font-bold">
              Father of Accounting: Luca Pacioli (1494)
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. THE DUAL PAN COLUMNS: DEBIT (DR) & CREDIT (CR) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* LEFT PAN: DEBIT (DR) */}
        <div className="bg-white border-2 border-emerald-600/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight">
                DEBIT (DR.)
              </h3>
              <p className="text-xs text-slate-600 font-mono font-medium">Latin: &ldquo;Debere&rdquo; (What is due / received)</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 whitespace-nowrap shrink-0">
              Resources &amp; Costs
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1.5">
              <span className="font-extrabold text-emerald-950 uppercase tracking-wider text-xs sm:text-sm block">
                What Sits on This Scale:
              </span>
              <ul className="space-y-1.5 text-slate-800 pl-4 list-disc text-xs sm:text-sm font-medium">
                <li><strong>Assets (&uarr;):</strong> Cash, Bank, Inventory, Equipment, Receivables (Receiving value)</li>
                <li><strong>Expenses (&uarr;):</strong> Rent, Salaries, Electricity, Purchases, Depreciation</li>
                <li><strong>Losses &amp; Drawings (&uarr;):</strong> Owner withdrawals from the business</li>
              </ul>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <span className="font-bold text-slate-950">Golden Memory Key:</span> If the business <em>acquires, receives, or spends</em> value, you put the weight on the <strong>DEBIT</strong> side.
            </div>
          </div>
        </div>

        {/* RIGHT PAN: CREDIT (CR) */}
        <div className="bg-white border-2 border-blue-600/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight">
                CREDIT (CR.)
              </h3>
              <p className="text-xs text-slate-600 font-mono font-medium">Latin: &ldquo;Credere&rdquo; (What is entrusted / provided)</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200 whitespace-nowrap shrink-0">
              Sources &amp; Income
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5">
              <span className="font-extrabold text-blue-950 uppercase tracking-wider text-xs sm:text-sm block">
                What Sits on This Scale:
              </span>
              <ul className="space-y-1.5 text-slate-800 pl-4 list-disc text-xs sm:text-sm font-medium">
                <li><strong>Liabilities (&uarr;):</strong> Bank Loans, Accounts Payable, Taxes Payable (Obligations owed)</li>
                <li><strong>Equity &amp; Capital (&uarr;):</strong> Owner capital, Retained earnings, Shareholder funds</li>
                <li><strong>Revenues &amp; Incomes (&uarr;):</strong> Sales revenue, Service fees, Interest earned</li>
              </ul>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              <span className="font-bold text-slate-950">Golden Memory Key:</span> If someone <em>funded, financed, or earned</em> value into the business, you put the weight on the <strong>CREDIT</strong> side.
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. THE EXPANDED ACCOUNTING EQUATION (DEALER / DEADCLIC) */}
      {/* ===================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            The Universal Accounting Equation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every balance sheet is a mathematical proof of the equilibrium scale.
          </p>
        </div>

        {/* Equation Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          {/* Assets */}
          <div className="p-3.5 bg-emerald-50/60 border-2 border-emerald-300 rounded-xl space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Debit Balances (Left)</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">ASSETS</div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">What the business owns &amp; uses to generate cash</p>
          </div>

          {/* Equal Sign */}
          <div className="flex items-center justify-center -my-2 md:my-0">
            <span className="text-3xl sm:text-4xl font-black text-slate-400 font-mono">=</span>
          </div>

          {/* Liabilities + Equity */}
          <div className="p-3.5 bg-blue-50/60 border-2 border-blue-300 rounded-xl space-y-1">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Credit Balances (Right)</span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 font-mono">LIABILITIES + EQUITY</div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Claims of external lenders + internal owner claims</p>
          </div>
        </div>

        {/* Expanded DEADCLIC Mnemonic */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
              <div className="font-extrabold text-emerald-800 font-mono text-sm sm:text-base">
                D - E - A - D (Debit Increases)
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                <strong>D</strong>ebit increases <strong>E</strong>xpenses, <strong>A</strong>ssets, and <strong>D</strong>rawings. Normal balance is always Debit.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
              <div className="font-extrabold text-blue-800 font-mono text-sm sm:text-base">
                C - L - I - C (Credit Increases)
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                <strong>C</strong>redit increases <strong>L</strong>iabilities, <strong>I</strong>ncome, and <strong>C</strong>apital. Normal balance is always Credit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. INTERACTIVE BALANCE SIMULATOR: SEE EQUILIBRIUM IN ACTION */}
      {/* ===================================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2.5">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Real Transaction Equilibrium Inspector
          </h2>
        </div>

        {/* Transaction Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {FOUNDATIONAL_TRANSACTIONS.map((tx, idx) => {
            const isSelected = tx.id === selectedTxId;
            return (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedTxId(tx.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400/80'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                }`}
              >
                <div className="text-xs font-mono font-bold text-amber-400">
                  Case #{idx + 1}
                </div>
                <div className="font-bold text-xs sm:text-sm leading-snug truncate">
                  {tx.name}
                </div>
                <div className={`text-xs font-mono mt-1 flex items-center justify-between ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  <span>{tx.amount}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold">
                    <span className="text-emerald-500 font-extrabold flex items-center">
                      <ArrowUp className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className={tx.creditEffect === 'increase' ? 'text-blue-400 font-extrabold flex items-center' : 'text-rose-400 font-extrabold flex items-center'}>
                      {tx.creditEffect === 'increase' ? (
                        <ArrowUp className="w-2.5 h-2.5 stroke-[3]" />
                      ) : (
                        <ArrowDown className="w-2.5 h-2.5 stroke-[3]" />
                      )}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Transaction Scale Analysis Card */}
        <div className="bg-gradient-to-r from-amber-50/40 via-white to-amber-50/40 border border-amber-200/80 rounded-xl p-4 sm:p-5 space-y-3.5">
          <div className="border-b border-amber-200/60 pb-2.5">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              {activeTx.description}
            </h3>
          </div>

          {/* Equal Sides Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Debit Side */}
            <div className="bg-white border-2 border-emerald-500/50 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DEBIT (DR) SIDE
                </span>

                {/* Increase / Decrease Effect: Arrow Icon BEFORE amount value */}
                <div className="flex items-center gap-1.5 font-mono">
                  {/* Before the amount value: circled arrow icon */}
                  {activeTx.debitEffect === 'increase' ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs shrink-0" title="Increase / Inflow (+)">
                      <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs shrink-0" title="Decrease / Outflow (-)">
                      <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}

                  {/* Amount Value */}
                  <span className="font-mono font-black text-emerald-800 text-sm sm:text-base">
                    {activeTx.amount}
                  </span>
                </div>
              </div>

              <div>
                <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {activeTx.debitAccount}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">{activeTx.debitCategory}</div>
                <p className="text-xs sm:text-sm text-emerald-850 mt-1 font-semibold bg-emerald-50/70 p-1.5 rounded">
                  &rarr; {activeTx.debitRole}
                </p>
              </div>
            </div>

            {/* Credit Side */}
            <div className="bg-white border-2 border-blue-500/50 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  CREDIT (CR) SIDE
                </span>

                {/* Increase / Decrease Effect: Arrow Icon BEFORE amount value */}
                <div className="flex items-center gap-1.5 font-mono">
                  {/* Before the amount value: circled arrow icon */}
                  {activeTx.creditEffect === 'increase' ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 border border-blue-300 shadow-2xs shrink-0" title="Increase / Source (+)">
                      <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs shrink-0" title="Decrease / Outflow (-)">
                      <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}

                  {/* Amount Value */}
                  <span className="font-mono font-black text-blue-800 text-sm sm:text-base">
                    {activeTx.amount}
                  </span>
                </div>
              </div>

              <div>
                <div className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {activeTx.creditAccount}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">{activeTx.creditCategory}</div>
                <p className="text-xs sm:text-sm text-blue-850 mt-1 font-semibold bg-blue-50/70 p-1.5 rounded">
                  &rarr; {activeTx.creditRole}
                </p>
              </div>
            </div>
          </div>

          {/* Final Verification Equilibrium Callout */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs sm:text-sm text-emerald-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Equilibrium Verified:</strong> {activeTx.explanation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
