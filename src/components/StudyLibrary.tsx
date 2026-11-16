import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Sparkles,
  Percent,
  Calculator,
  Printer,
  Compass,
  GraduationCap,
  Scale,
  TrendingUp,
  TrendingDown,
  Layers,
  Landmark,
  Receipt,
  Coins,
  Briefcase,
  Lightbulb,
  ArrowLeft,
  X,
  Folder,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Check,
  Shuffle,
  ArrowUp,
  Download
} from 'lucide-react';
import { DAY_CONFIGS } from '../data/modulesData';
import { IrdRevenueCodesTable } from './IrdRevenueCodesTable';
import { TdsCalculator } from './TdsCalculator';
import { TdsComplianceGuide } from './TdsComplianceGuide';
import { ChartOfAccountsBook } from './ChartOfAccountsBook';
import { VatRegistersSection } from './VatRegistersSection';
import { DebitCreditEquilibriumLesson } from './DebitCreditEquilibriumLesson';
import { CompleteRulesLesson } from './CompleteRulesLesson';
import { AccountingCycleLesson } from './AccountingCycleLesson';

interface Props {
  onGoToTestArena: (dayNumber?: number) => void;
  onGoToMemoryLab?: () => void;
  onGoBack?: () => void;
}

export type BookId =
  // 1. Accounting Core
  | 'debit-credit-equilibrium'
  | 'complete-accounting'
  | 'accounting-101'
  | 'conceptual-framework'
  | 'chart-of-accounts'
  // 2. Taxation & Compliance
  | 'income-tax-act'
  | 'vat-procedures'
  | 'tds-compliance'
  | 'tax-calculator'
  | 'tax-forms'
  // 3. Statutory Funds
  | 'arf-regulations'
  | 'ssf-employer-guide'
  | 'epf-schemes'
  | 'cit-administration'
  // 4. Financial Reporting
  | 'journals-ledgers'
  | 'day-books-practice'
  | 'annual-reports'
  | 'financial-statements';

interface BookItem {
  id: BookId;
  shelf: 'accounting' | 'taxation' | 'statutory' | 'reporting';
  shelfTitle: string;
  title: string;
  subtitle: string;
  dayHint?: string;
  tags: string[];
}

export const StudyLibrary: React.FC<Props> = ({ onGoToTestArena, onGoToMemoryLab, onGoBack }) => {
  const [selectedBookId, setSelectedBookId] = useState<BookId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePrint = () => {
    window.print();
  };

  // Catalogue metadata
  const BOOKS_CATALOGUE: Record<BookId, BookItem> = {
    'debit-credit-equilibrium': {
      id: 'debit-credit-equilibrium',
      shelf: 'accounting',
      shelfTitle: 'ACCOUNTING CORE',
      title: 'Happiness is when Debit (Dr) = Credit (Cr)',
      subtitle: 'First Session of the Day: The Core Equilibrium of Accounting, Dual-Aspect Axiom & The Scale of Double-Entry',
      dayHint: 'Session 1 • Equilibrium',
      tags: ['Debit', 'Credit', 'Dr = Cr', 'Accounting Equation', 'Equilibrium', 'First Session', 'Happiness', 'Scale', 'Luca Pacioli'],
    },
    'complete-accounting': {
      id: 'complete-accounting',
      shelf: 'accounting',
      shelfTitle: '1. ACCOUNTING CORE',
      title: 'The Complete Rules for Dr & Cr: The Golden Rules',
      subtitle: 'Master The Golden Rules of Accounting across Personal, Real, and Nominal accounts with standard debit & credit principles and practical double-entry illustrations.',
      dayHint: 'Days 1-3 & Core Exam',
      tags: ['Golden Rules', 'Personal', 'Real', 'Nominal', 'Debit Credit'],
    },
    'accounting-101': {
      id: 'accounting-101',
      shelf: 'accounting',
      shelfTitle: '1. ACCOUNTING CORE',
      title: 'The Accounting Cycle',
      subtitle: 'The complete 5-stage sequential workflow from transaction occurrence to trial balance equilibrium and financial statements.',
      dayHint: 'Day 1 & Setup',
      tags: ['Accounting Cycle', 'Double-Entry', 'Source Documents', 'Ledger Posting', 'Trial Balance'],
    },
    'conceptual-framework': {
      id: 'conceptual-framework',
      shelf: 'accounting',
      shelfTitle: '1. ACCOUNTING CORE',
      title: 'Accounting Principles, Assumptions & Conventions',
      subtitle: 'Fundamental theoretical principles that ensure consistency, reliability, and comparability in accounting records.',
      dayHint: 'Theory Foundations',
      tags: ['Business Entity', 'Going Concern', 'Accrual Basis', 'Matching', 'Prudence'],
    },
    'chart-of-accounts': {
      id: 'chart-of-accounts',
      shelf: 'accounting',
      shelfTitle: '1. ACCOUNTING CORE',
      title: 'Core Financial Elements & Chart of Accounts',
      subtitle: 'The 5 Fundamental Financial Elements (Assets, Liabilities, Equity, Revenue, Expense) & Master Taxonomy structure before applying Dr/Cr rules.',
      dayHint: '1st Order • Foundations',
      tags: ['COA', 'Chart of Accounts', '5 Elements', 'Assets', 'Liabilities', 'Equity', 'Income', 'Expenses', 'Normal Balance', '1000s', '2000s', '3000s', '4000s', '5000s'],
    },
    'income-tax-act': {
      id: 'income-tax-act',
      shelf: 'taxation',
      shelfTitle: '2. TAXATION & COMPLIANCE',
      title: 'Income Tax Act',
      subtitle: 'Nepal Income Tax Act 2058 Framework, Tax Slabs & Allowable Deductions',
      dayHint: 'Tax & Compliance',
      tags: ['Income Tax 2058', 'Assessable Income', 'Corporate Tax', 'Deductions'],
    },
    'vat-procedures': {
      id: 'vat-procedures',
      shelf: 'taxation',
      shelfTitle: '2. TAXATION & COMPLIANCE',
      title: 'Value Added Tax (13%)',
      subtitle: 'Value Added Tax (13% VAT), Purchase Register (खरीद खाता) & Sales Register (बिक्री खाता)',
      dayHint: 'Day 7 Practice',
      tags: ['Value Added Tax (13%)', 'Purchase Register', 'Sales Register', 'Tax Invoice', 'Input Tax Credit', 'Output VAT', 'Anusuchi 8 & 9'],
    },
    'tds-compliance': {
      id: 'tds-compliance',
      shelf: 'taxation',
      shelfTitle: '2. TAXATION & COMPLIANCE',
      title: 'TDS Compliance Guide',
      subtitle: 'Rates and Revenue Code — Official IRD Nepal Withholding & Deposit Codes (FY 2083/84)',
      dayHint: 'Day 8 Practice & IRD Portal',
      tags: ['Sec 88(1)', 'Sec 88(1)(4) 1.5%', 'House Rent 10%', 'Freight 2.5%', 'Deposit Code', 'Revenue Code 11112', '11131'],
    },
    'tax-calculator': {
      id: 'tax-calculator',
      shelf: 'taxation',
      shelfTitle: '2. TAXATION & COMPLIANCE',
      title: 'Tax Calculator',
      subtitle: 'Official IRD Nepal TDS & Tax Computation Tool with Double-Entry Voucher Generation',
      dayHint: 'Practical TDS Tool',
      tags: ['TDS Calculator', 'Sec 88', 'Sec 88A', 'Sec 89', '13% VAT', 'Voucher Preview', 'Journal Entry', 'Tax Rates'],
    },
    'tax-forms': {
      id: 'tax-forms',
      shelf: 'taxation',
      shelfTitle: '2. TAXATION & COMPLIANCE',
      title: 'Tax Forms',
      subtitle: 'Official IRD Nepal Tax Forms, ETDS Procedures & Withholding Certificates',
      dayHint: 'Tax Practical',
      tags: ['Anusuchi 10', 'ETDS', 'Withholding Certificate', 'D-01/02/03'],
    },
    'arf-regulations': {
      id: 'arf-regulations',
      shelf: 'statutory',
      shelfTitle: '3. STATUTORY FUNDS',
      title: 'ARF Regulations',
      subtitle: 'Approved Retirement Funds Guidelines, Sec 63 Tax Deductions & 5% Final Tax',
      dayHint: 'Retirement Tax',
      tags: ['Approved Retirement Fund', 'Sec 63', 'Exemption Limit', '5% Final Tax'],
    },
    'ssf-employer-guide': {
      id: 'ssf-employer-guide',
      shelf: 'statutory',
      shelfTitle: '3. STATUTORY FUNDS',
      title: 'SSF Employer Guide',
      subtitle: 'Social Security Fund (31% = 11% + 20%), Labor Act 2074 & Payroll Entries',
      dayHint: 'Day 9 Practice',
      tags: ['SSF 31%', '11% Employee', '20% Employer', 'Labor Act 2074', 'Payroll Voucher'],
    },
    'epf-schemes': {
      id: 'epf-schemes',
      shelf: 'statutory',
      shelfTitle: '3. STATUTORY FUNDS',
      title: 'EPF Schemes',
      subtitle: 'Employees Provident Fund (10% + 10% = 20%), Loan Schemes & Accounting Entries',
      dayHint: 'Provident Fund',
      tags: ['EPF', 'Karmachari Sanchaya Kosh', '10%+10%', 'Retirement Saving'],
    },
    'cit-administration': {
      id: 'cit-administration',
      shelf: 'statutory',
      shelfTitle: '3. STATUTORY FUNDS',
      title: 'CIT Administration',
      subtitle: 'Citizen Investment Trust Schemes, Voluntary Retirement & Gratuity Portals',
      dayHint: 'Investment Trust',
      tags: ['CIT', 'Nagarik Lagani Kosh', 'Gratuity Scheme', 'Payroll Deduction'],
    },
    'journals-ledgers': {
      id: 'journals-ledgers',
      shelf: 'reporting',
      shelfTitle: '4. FINANCIAL REPORTING',
      title: 'Journals & Ledgers',
      subtitle: 'General Journal Entries, Compound Vouchers, Ledger Posting & Balancing (c/d, b/d)',
      dayHint: 'Day 10 Practice',
      tags: ['Journal Entries', 'Ledger Accounts', 'Balancing c/d b/d', 'Sub-Ledgers'],
    },
    'day-books-practice': {
      id: 'day-books-practice',
      shelf: 'reporting',
      shelfTitle: '4. FINANCIAL REPORTING',
      title: 'Day Books Practice',
      subtitle: '7 Subsidiary Primary Books of Entry & Day Book Workflows',
      dayHint: 'Days 10-12 Practice',
      tags: ['Cash Book', 'Purchase Book', 'Sales Book', 'Returns Books', 'Journal Proper', 'Day Books'],
    },
    'annual-reports': {
      id: 'annual-reports',
      shelf: 'reporting',
      shelfTitle: '4. FINANCIAL REPORTING',
      title: 'Annual Reports',
      subtitle: 'Corporate Financial Statements, Cash Flow, Statement of Changes in Equity & Notes',
      dayHint: 'Corporate Reporting',
      tags: ['Annual Report', 'Auditor Report', 'Cash Flow Statement', 'Notes to Accounts'],
    },
    'financial-statements': {
      id: 'financial-statements',
      shelf: 'reporting',
      shelfTitle: '4. FINANCIAL REPORTING',
      title: 'Financial Statements (NFRS / NAS)',
      subtitle: 'Complete NFRS/NAS Framework: Financial Position, P&L with OCI, Cash Flows, SOCE, Notes & Sample Model',
      dayHint: 'Days 13-15 Practice',
      tags: ['Financial Statements', 'NFRS', 'NAS 1', 'Balance Sheet', 'Profit or Loss', 'Cash Flows', 'SOCE', 'Notes', 'Adjusting Entries'],
    },
  };

  const allBookIds = Object.keys(BOOKS_CATALOGUE) as BookId[];

  // Filter matching for search
  const isBookHighlighted = (id: BookId) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    const book = BOOKS_CATALOGUE[id];
    return (
      book.title.toLowerCase().includes(q) ||
      book.subtitle.toLowerCase().includes(q) ||
      book.tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const activeBook = selectedBookId ? BOOKS_CATALOGUE[selectedBookId] : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-900 pb-16 font-sans">
      {/* ======================================================================= */}
      {/* MAIN VIEW: THE 4 SHELVES CATALOGUE */}
      {/* ======================================================================= */}
      {!selectedBookId ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {/* Top Bar with Go Back & Centered Welcome Banner matching Main Dashboard */}
          <div className="relative">
            {onGoBack && (
              <div className="sm:absolute sm:left-0 sm:top-1 mb-3 sm:mb-0">
                <button
                  type="button"
                  onClick={onGoBack}
                  aria-label="Back to Previous Dashboard"
                  title="Back to Previous Dashboard"
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-full border border-slate-300 shadow-2xs transition flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* Centered Main Title Heading - Identical Design to Main Dashboard */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome to the <span className="text-blue-700">Library</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
                When in doubt, go to the library. Explore curriculum core textbooks, Nepal tax acts, statutory compliance guides, and financial reporting standards.
              </p>
            </div>
          </div>

          {/* =================================================================== */}
          {/* THE 4 SHELVES CATALOGUE (CLEAN, NO HEAVY BOX BORDER) */}
          {/* =================================================================== */}
          <div className="w-full space-y-9 sm:space-y-11 relative">
            {/* ------------------------------------------------------------------- */}
            {/* SHELF 1: ACCOUNTING CORE */}
            {/* ------------------------------------------------------------------- */}
            <div className="space-y-1">
              <div className="flex justify-center items-center">
                <div className="inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFD5C6] via-[#EFE6D8] to-[#DFD5C6] border-y border-[#C4B4A2] rounded-xs shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 mr-2.5 inline-block shadow-2xs" />
                  <h2 className="text-xs sm:text-[13px] font-black text-[#4A3828] tracking-widest uppercase font-serif text-center">
                    ACCOUNTING CORE
                  </h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 ml-2.5 inline-block shadow-2xs" />
                </div>
              </div>

              {/* Shelf Space with Clearance Above Books */}
              <div className="relative pt-6 sm:pt-7">
                {/* Books Standing on Shelf 1 */}
                <div className="flex items-end justify-center gap-2 sm:gap-2.5 px-2 sm:px-3 pb-0 relative z-10 overflow-x-auto sm:overflow-visible scrollbar-none">
                  {/* Book 1: First Order Foundation Book — "Core Financial Elements & Chart of Accounts" */}
                  <div
                    onClick={() => setSelectedBookId('chart-of-accounts')}
                    className={`group cursor-pointer w-26 sm:w-28 h-46 sm:h-50 bg-gradient-to-b from-[#0D2818] via-[#163824] to-[#0A1F13] border-2 border-[#E5C77A]/90 rounded-xs shadow-xl p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('chart-of-accounts')
                        ? 'ring-2 ring-emerald-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="1st Order: Core Financial Elements & Chart of Accounts - Foundation Book - Click to Open"
                  >
                    {/* Debossed Gold Border */}
                    <div className="border border-[#E5C77A]/80 inset-1.5 absolute rounded-xs pointer-events-none" />

                    <div className="pt-1.5 text-center relative z-10 space-y-1">
                      {/* Icon */}
                      <div className="w-5 h-5 mx-auto rounded-full bg-[#E5C77A]/20 border border-[#E5C77A]/40 flex items-center justify-center text-[#E5C77A] group-hover:scale-110 transition shadow-2xs">
                        <Layers className="w-3 h-3" />
                      </div>
                      <p className="text-[#E5C77A] text-[8px] sm:text-[9px] font-bold leading-tight tracking-wide uppercase font-serif">
                        Core Financial
                        <br />
                        Elements &
                        <br />
                        <span className="font-black text-[8.5px] sm:text-[9.5px] text-amber-200">
                          Chart of
                          <br />
                          Accounts
                        </span>
                      </p>
                    </div>

                    {/* Visible White Page Edge on Right */}
                    <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[7px] sm:text-[7.5px] text-[#E5C77A] font-bold tracking-widest uppercase font-mono bg-[#061A0E]/90 px-1 py-0.5 rounded border border-[#E5C77A]/40">
                        1st Order • COA
                      </span>
                    </div>
                  </div>

                  {/* Book 2: Dr/Cr Equilibrium Rule — "Happiness is when Debit (Dr) = Credit (Cr)" */}
                  <div
                    onClick={() => setSelectedBookId('debit-credit-equilibrium')}
                    className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-gradient-to-b from-[#8C532B] via-[#733F19] to-[#542B0D] border border-[#A66935] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('debit-credit-equilibrium')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="Rules of Dr & Cr: Happiness is when Debit (Dr) = Credit (Cr) - Click to Open"
                  >
                    {/* Debossed Gold Border Line */}
                    <div className="border border-[#E5C77A]/70 inset-2 absolute rounded-xs pointer-events-none" />

                    <div className="pt-1.5 text-center relative z-10 space-y-1">
                      {/* Scale of Equilibrium Icon */}
                      <div className="w-5 h-5 mx-auto rounded-full bg-[#E5C77A]/20 border border-[#E5C77A]/40 flex items-center justify-center text-[#E5C77A] group-hover:scale-110 transition shadow-2xs">
                        <Scale className="w-3 h-3" />
                      </div>
                      <p className="text-[#E5C77A] text-[8px] sm:text-[9px] font-semibold leading-tight tracking-wide uppercase font-serif">
                        Happiness is
                        <br />
                        when
                        <br />
                        <span className="font-black text-[8.5px] sm:text-[9.5px] text-amber-200">
                          Debit (Dr) =
                          <br />
                          Credit (Cr)
                        </span>
                      </p>
                    </div>

                    {/* Visible White Page Edge on Right */}
                    <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[7.5px] sm:text-[8px] text-[#E5C77A] font-bold tracking-widest uppercase font-mono bg-[#3E1D06]/80 px-1 py-0.2 rounded border border-[#E5C77A]/30">
                        Session I
                      </span>
                    </div>
                  </div>

                  {/* Book 3: Large deep navy hardback "The Complete Rules for Dr & Cr: The Golden Rules" */}
                  <div
                    onClick={() => setSelectedBookId('complete-accounting')}
                    className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-[#1A2B49] border border-[#2D436B] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('complete-accounting')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="The Complete Rules for Dr & Cr: The Golden Rules - Click to Open"
                  >
                    {/* Debossed Thin Gold Border Line */}
                    <div className="border border-[#C69E54]/70 inset-2 absolute rounded-xs pointer-events-none" />

                    <div className="pt-2 text-center relative z-10">
                      <p className="text-[#E5C77A] text-[8.5px] sm:text-[9.5px] font-semibold leading-tight tracking-wide uppercase font-serif">
                        Complete Rules
                        <br />
                        for Dr &amp; Cr:
                        <br />
                        The Golden
                        <br />
                        Rules
                      </p>
                    </div>

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[9px] text-[#C69E54]/80 tracking-widest uppercase font-mono">
                        Vol. I
                      </span>
                    </div>
                  </div>

                  {/* Book 4: Deep navy hardback "The Accounting Cycle" */}
                  <div
                    onClick={() => setSelectedBookId('accounting-101')}
                    className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-[#1E2F4F] border border-[#2D436B] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('accounting-101')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="The Accounting Cycle - Click to Open"
                  >
                    {/* Debossed Gold Border */}
                    <div className="border border-[#C69E54]/70 inset-2 absolute rounded-xs pointer-events-none" />

                    <div className="pt-2 text-center relative z-10">
                      <p className="text-[#E5C77A] text-[8.5px] sm:text-[9.5px] font-semibold leading-tight tracking-wide uppercase font-serif">
                        The
                        <br />
                        Accounting
                        <br />
                        Cycle
                      </p>
                    </div>

                    {/* Visible White Page Edge on Right */}
                    <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[9px] text-[#C69E54]/80 tracking-widest uppercase font-mono">
                        5 Stages
                      </span>
                    </div>
                  </div>

                  {/* Book 5: Deep navy hardback "Accounting Principles, Assumptions & Conventions" */}
                  <div
                    onClick={() => setSelectedBookId('conceptual-framework')}
                    className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-[#1A2844] border border-[#2D436B] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('conceptual-framework')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="Accounting Principles, Assumptions & Conventions - Click to Open"
                  >
                    {/* Debossed Gold Border */}
                    <div className="border border-[#C69E54]/70 inset-2 absolute rounded-xs pointer-events-none" />

                    <div className="pt-2 text-center relative z-10">
                      <p className="text-[#E5C77A] text-[8.5px] sm:text-[9.5px] font-semibold leading-tight tracking-wide uppercase font-serif">
                        Accounting
                        <br />
                        Principles &
                        <br />
                        Conventions
                      </p>
                    </div>

                    {/* Visible White Page Edge on Right */}
                    <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[9px] text-[#C69E54]/80 tracking-widest uppercase font-mono">
                        GAAP/NFRS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wooden Shelf Ledge & Under-Shadow */}
                <div className="relative">
                  <div className="h-1 bg-gradient-to-r from-[#D8B684] via-[#E2C79D] to-[#CF9F6A] rounded-t-xs" />
                  <div className="h-4 sm:h-5 bg-gradient-to-b from-[#8C5E35] via-[#6B4220] to-[#4A2D13] border-t border-[#DDBA88]/60 shadow-[0_14px_24px_-4px_rgba(0,0,0,0.5)] w-full">
                    <div className="h-0.5 bg-white/20 w-full" />
                  </div>
                  <div className="h-4 w-full bg-gradient-to-b from-black/25 to-transparent blur-xs pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* SHELF 2: TAXATION & COMPLIANCE */}
            {/* ------------------------------------------------------------------- */}
            <div className="space-y-1">
              <div className="flex justify-center items-center">
                <div className="inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFD5C6] via-[#EFE6D8] to-[#DFD5C6] border-y border-[#C4B4A2] rounded-xs shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 mr-2.5 inline-block shadow-2xs" />
                  <h2 className="text-xs sm:text-[13px] font-black text-[#4A3828] tracking-widest uppercase font-serif text-center">
                    TAXATION & COMPLIANCE
                  </h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 ml-2.5 inline-block shadow-2xs" />
                </div>
              </div>

              {/* Shelf Space with Clearance Above Books */}
              <div className="relative pt-6 sm:pt-7">
                {/* Books & Folders Standing on Shelf 2 */}
                <div className="flex items-end justify-center gap-2 sm:gap-2.5 px-2 sm:px-3 pb-0 relative z-10 overflow-x-auto sm:overflow-visible scrollbar-none">
                  {/* Book 1: Dark navy book "Income Tax Act" with double gold horizontal bands */}
                  <div
                    onClick={() => setSelectedBookId('income-tax-act')}
                    className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-[#202E47] border border-[#2D436B] rounded-xs shadow-lg p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('income-tax-act')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="Income Tax Act - Click to Open"
                  >
                    {/* Top Double Gold Stripes */}
                    <div className="space-y-0.5 pt-1">
                      <div className="h-0.5 bg-[#D4AF37]" />
                      <div className="h-0.5 bg-[#D4AF37]" />
                    </div>

                    {/* Center Title */}
                    <div className="text-center py-2">
                      <p className="text-[#E5C77A] text-[11px] sm:text-xs font-semibold leading-tight tracking-wide uppercase font-serif">
                        Income
                        <br />
                        Tax Act
                      </p>
                    </div>

                    {/* Bottom Double Gold Stripes */}
                    <div className="space-y-0.5 pb-1">
                      <div className="h-0.5 bg-[#D4AF37]" />
                      <div className="h-0.5 bg-[#D4AF37]" />
                    </div>
                  </div>

                  {/* Book 2: Slim tan spine "Value Added Tax (13%)" standing upright */}
                  <div
                    onClick={() => setSelectedBookId('vat-procedures')}
                    className={`group cursor-pointer w-7 sm:w-8 h-40 sm:h-44 bg-gradient-to-r from-[#D9AA62] to-[#B8863A] border border-[#A87A32] rounded-xs shadow-md flex items-center justify-center p-1 relative hover:-translate-y-2 hover:shadow-xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('vat-procedures')
                        ? 'ring-2 ring-amber-500 ring-offset-2 -translate-y-2'
                        : ''
                    }`}
                    title="Value Added Tax (13%) - Click to Open"
                  >
                    {/* Top & Bottom Black Bands */}
                    <div className="w-full h-1 bg-slate-900/60 absolute top-2 left-0" />
                    <div className="w-full h-1 bg-slate-900/60 absolute bottom-2 left-0" />

                    <div className="[writing-mode:vertical-rl] text-slate-900 font-bold text-[9px] tracking-wider uppercase rotate-180">
                      Value Added Tax (13%)
                    </div>
                  </div>

                  {/* Book 4: Premier Navy & Gold Hardback "TDS Compliance Guide" */}
                  <div
                    onClick={() => setSelectedBookId('tds-compliance')}
                    className={`group cursor-pointer w-28 sm:w-32 h-44 sm:h-48 bg-gradient-to-b from-[#162744] via-[#101F38] to-[#0A1628] border-2 border-[#D4AF37]/80 rounded-xs shadow-xl p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-3 hover:shadow-2xl hover:border-amber-300 transition-all duration-200 shrink-0 ${
                      isBookHighlighted('tds-compliance')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-3'
                        : ''
                    }`}
                    title="TDS Compliance Guide - Click to Open Complete Book"
                  >
                    {/* Debossed Gold Double Frame */}
                    <div className="border border-[#C69E54]/70 inset-1.5 absolute rounded-xs pointer-events-none" />
                    <div className="border border-[#C69E54]/30 inset-2 absolute rounded-xs pointer-events-none" />

                    {/* Book Spine / Bookmark Accent */}
                    <div className="absolute top-0 right-3 w-2.5 h-4 bg-rose-600 rounded-b-xs shadow-xs" />

                    <div className="pt-2 text-center relative z-10">
                      <div className="w-4 h-4 mx-auto mb-1 rounded-full bg-[#E5C77A]/20 border border-[#E5C77A]/50 flex items-center justify-center text-[#E5C77A]">
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </div>
                      <p className="text-[#E5C77A] text-[9.5px] sm:text-[10.5px] font-black leading-tight tracking-wide uppercase font-serif">
                        TDS
                        <br />
                        Compliance
                        <br />
                        Guide
                      </p>
                      <p className="text-[#E5C77A]/90 text-[7px] sm:text-[7.5px] font-semibold leading-tight mt-0.5 font-sans">
                        (कर कट्टी दर पुस्तिका)
                      </p>
                      <p className="text-[#C69E54] text-[7px] sm:text-[7.5px] font-medium leading-tight mt-0.5 tracking-normal font-sans">
                        Rates & Revenue Code
                      </p>
                    </div>

                    {/* Visible White Page Edge on Right */}
                    <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[8.5px] sm:text-[9px] text-[#C69E54] font-bold tracking-widest uppercase font-mono">
                        FY 2083/84
                      </span>
                    </div>
                  </div>

                  {/* Book 5: Crimson Leather Hardback "Tax Calculator" with Calculator Icon */}
                  <div
                    onClick={() => setSelectedBookId('tax-calculator')}
                    className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-gradient-to-br from-[#781B26] via-[#59121B] to-[#3B0A10] border border-[#962634] rounded-xs shadow-lg p-2 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('tax-calculator')
                        ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                        : ''
                    }`}
                    title="Tax Calculator — Interactive Nepal TDS Computation"
                  >
                    <div className="border border-[#E5C77A]/60 inset-2 absolute rounded-xs pointer-events-none" />

                    <div className="pt-2 text-center relative z-10 space-y-1">
                      {/* Calculator Icon shown clearly on the book as requested */}
                      <div className="w-6 h-6 mx-auto rounded-full bg-[#E5C77A]/20 flex items-center justify-center border border-[#E5C77A]/40 text-[#E5C77A] shadow-xs group-hover:scale-110 transition">
                        <Calculator className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-[#E5C77A] text-[11px] sm:text-xs font-bold leading-tight tracking-wide uppercase font-serif">
                        Tax
                        <br />
                        Calculator
                      </p>
                      <p className="text-[#E5C77A]/80 text-[7.5px] sm:text-[8px] font-sans font-medium">
                        TDS Tool
                      </p>
                    </div>

                    {/* Visible White Page Edge on Right */}
                    <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                    <div className="text-center pb-1 relative z-10">
                      <span className="text-[8.5px] text-[#E5C77A]/75 tracking-wider uppercase font-mono">
                        Simulator
                      </span>
                    </div>
                  </div>

                  {/* Item 6: Manila Paper File Folder "Tax Forms" */}
                  <div
                    onClick={() => setSelectedBookId('tax-forms')}
                    className={`group cursor-pointer w-[94px] h-34 sm:h-38 bg-[#E6C68A] border-2 border-[#B89452] rounded-md shadow-md p-2 flex flex-col justify-between relative hover:-translate-y-2 hover:shadow-xl transition-all duration-200 shrink-0 ${
                      isBookHighlighted('tax-forms')
                        ? 'ring-2 ring-amber-500 ring-offset-2 -translate-y-2'
                        : ''
                    }`}
                    style={{ width: '94px' }}
                    title="Tax Forms Folder - Click to Open"
                  >
                    {/* Top Manila Tab */}
                    <div className="w-10 sm:w-12 h-3.5 bg-[#E6C68A] -top-3.5 left-0 rounded-t-sm border-t-2 border-l-2 border-r-2 border-[#B89452] absolute" />

                    <div className="pt-3 text-center">
                      <Folder className="w-4 h-4 mx-auto text-[#8C6B2F] mb-1" />
                      <p className="text-slate-900 font-bold text-xs leading-tight">
                        Tax
                        <br />
                        Forms
                      </p>
                    </div>

                    <div className="text-center pb-1">
                      <span className="text-[8px] text-[#8C6B2F] font-mono uppercase tracking-wider font-semibold">
                        IRD Portals
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wooden Shelf Ledge & Under-Shadow */}
                <div className="relative">
                  <div className="h-1 bg-gradient-to-r from-[#D8B684] via-[#E2C79D] to-[#CF9F6A] rounded-t-xs" />
                  <div className="h-4 sm:h-5 bg-gradient-to-b from-[#8C5E35] via-[#6B4220] to-[#4A2D13] border-t border-[#DDBA88]/60 shadow-[0_14px_24px_-4px_rgba(0,0,0,0.5)] w-full">
                    <div className="h-0.5 bg-white/20 w-full" />
                  </div>
                  <div className="h-4 w-full bg-gradient-to-b from-black/25 to-transparent blur-xs pointer-events-none" />
                </div>
              </div>
            </div>

          {/* ------------------------------------------------------------------- */}
          {/* SHELF 3: STATUTORY FUNDS & LABOUR */}
          {/* ------------------------------------------------------------------- */}
          <div className="space-y-1">
            <div className="flex justify-center items-center">
              <div className="inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFD5C6] via-[#EFE6D8] to-[#DFD5C6] border-y border-[#C4B4A2] rounded-xs shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 mr-2.5 inline-block shadow-2xs" />
                <h2 className="text-xs sm:text-[13px] font-black text-[#4A3828] tracking-widest uppercase font-serif text-center">
                  STATUTORY FUNDS & LABOUR
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 ml-2.5 inline-block shadow-2xs" />
              </div>
            </div>

            {/* Shelf Space with Clearance Above Books */}
            <div className="relative pt-6 sm:pt-7">
              {/* Books Standing on Shelf 3 inspired by reference image */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-3 pb-0 relative z-10 overflow-x-auto sm:overflow-visible scrollbar-none">
                {/* Book 1: Crimson Red "ARF Regulations" */}
                <div
                  onClick={() => setSelectedBookId('arf-regulations')}
                  className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-gradient-to-b from-[#8F1D28] via-[#751620] to-[#5C0F17] border border-[#B02837] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('arf-regulations')
                      ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="ARF Regulations - Approved Retirement Funds - Click to Open"
                >
                  <div className="border border-[#E5C77A]/70 inset-2 absolute rounded-xs pointer-events-none" />
                  <div className="pt-2 text-center relative z-10">
                    <p className="text-[#E5C77A] text-[9.5px] sm:text-[10.5px] font-bold leading-tight tracking-wide uppercase font-serif">
                      ARF
                      <br />
                      Regulations
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-1">
                      Retirement Funds
                    </p>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="text-center pb-1 relative z-10">
                    <span className="text-[8.5px] text-[#C69E54] tracking-widest uppercase font-mono">
                      Sec 63 / 5%
                    </span>
                  </div>
                </div>

                {/* Book 2: Forest Green "SSF Employer Guide" with Official Link */}
                <div
                  onClick={() => setSelectedBookId('ssf-employer-guide')}
                  className={`group cursor-pointer w-26 sm:w-30 h-44 sm:h-48 bg-gradient-to-b from-[#1C442A] via-[#14351F] to-[#0D2415] border border-[#2E6840] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('ssf-employer-guide')
                      ? 'ring-2 ring-emerald-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="SSF Employer Guide - Click to Open (Official: ssf.gov.np)"
                >
                  {/* Top Ribs */}
                  <div className="space-y-0.5 pt-0.5">
                    <div className="h-0.5 bg-[#D4AF37]" />
                    <div className="h-0.5 bg-[#D4AF37]" />
                  </div>

                  <div className="text-center py-1 relative z-10">
                    <p className="text-[#E5C77A] text-[9px] sm:text-[10px] font-bold leading-tight tracking-wide uppercase font-serif">
                      SSF
                      <br />
                      Employer Guide
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-0.5">
                      Social Security
                    </p>
                    <span className="inline-block mt-1 px-1 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded text-[7px] text-[#E5C77A] font-mono">
                      31% = 11% + 20%
                    </span>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="flex items-center justify-between pt-1 border-t border-[#D4AF37]/40 relative z-10">
                    <span className="text-[7.5px] text-[#C69E54] font-mono">SSF.GOV</span>
                    <a
                      href="https://ssf.gov.np/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-0.5 rounded bg-black/40 hover:bg-emerald-600 text-amber-200 hover:text-white transition"
                      title="Visit official site: https://ssf.gov.np/"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Book 3: Espresso Brown "EPF Schemes" with Official Link */}
                <div
                  onClick={() => setSelectedBookId('epf-schemes')}
                  className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-gradient-to-b from-[#432A1D] via-[#331E13] to-[#25150C] border border-[#5C3B29] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('epf-schemes')
                      ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="EPF Schemes - Employees Provident Fund - Click to Open (Official: epf.org.np)"
                >
                  <div className="border border-[#C69E54]/60 inset-2 absolute rounded-xs pointer-events-none" />

                  <div className="pt-2 text-center relative z-10">
                    <p className="text-[#E5C77A] text-[9.5px] sm:text-[10.5px] font-bold leading-tight tracking-wide uppercase font-serif">
                      EPF
                      <br />
                      Schemes
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-1">
                      Provident Fund
                    </p>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="flex items-center justify-between pb-0.5 relative z-10">
                    <span className="text-[7.5px] text-[#C69E54] font-mono">10% + 10%</span>
                    <a
                      href="https://epf.org.np/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-0.5 rounded bg-black/40 hover:bg-amber-600 text-amber-200 hover:text-white transition"
                      title="Visit official site: https://epf.org.np/"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Book 4: Royal Sapphire Navy "CIT Administration" with Official Link */}
                <div
                  onClick={() => setSelectedBookId('cit-administration')}
                  className={`group cursor-pointer w-26 sm:w-30 h-44 sm:h-48 bg-gradient-to-b from-[#1C315E] via-[#142345] to-[#0C1730] border border-[#2F4F91] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('cit-administration')
                      ? 'ring-2 ring-blue-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="CIT Administration - Citizen Investment Trust - Click to Open (Official: nlk.org.np)"
                >
                  <div className="space-y-0.5 pt-0.5">
                    <div className="h-0.5 bg-[#D4AF37]" />
                    <div className="h-0.5 bg-[#D4AF37]" />
                  </div>

                  <div className="text-center py-1 relative z-10">
                    <p className="text-[#E5C77A] text-[9px] sm:text-[10px] font-bold leading-tight tracking-wide uppercase font-serif">
                      CIT
                      <br />
                      Administration
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-0.5">
                      Citizen Inv. Trust
                    </p>
                    <span className="inline-block mt-1 px-1 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded text-[7px] text-[#E5C77A] font-mono">
                      Nagarik Lagani
                    </span>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="flex items-center justify-between pb-0.5 relative z-10">
                    <span className="text-[7.5px] text-[#C69E54] font-mono">NLK.ORG</span>
                    <a
                      href="https://www.nlk.org.np/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-0.5 rounded bg-black/40 hover:bg-blue-600 text-amber-200 hover:text-white transition"
                      title="Visit official site: https://www.nlk.org.np/"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Wooden Shelf Ledge & Under-Shadow */}
              <div className="relative">
                <div className="h-1 bg-gradient-to-r from-[#D8B684] via-[#E2C79D] to-[#CF9F6A] rounded-t-xs" />
                <div className="h-4 sm:h-5 bg-gradient-to-b from-[#8C5E35] via-[#6B4220] to-[#4A2D13] border-t border-[#DDBA88]/60 shadow-[0_14px_24px_-4px_rgba(0,0,0,0.5)] w-full">
                  <div className="h-0.5 bg-white/20 w-full" />
                </div>
                <div className="h-4 w-full bg-gradient-to-b from-black/25 to-transparent blur-xs pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* SHELF 4: FINANCIAL REPORTING */}
          {/* ------------------------------------------------------------------- */}
          <div className="space-y-1">
            <div className="flex justify-center items-center">
              <div className="inline-flex items-center justify-center px-4 py-0.5 bg-gradient-to-r from-[#DFD5C6] via-[#EFE6D8] to-[#DFD5C6] border-y border-[#C4B4A2] rounded-xs shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 mr-2.5 inline-block shadow-2xs" />
                <h2 className="text-xs sm:text-[13px] font-black text-[#4A3828] tracking-widest uppercase font-serif text-center">
                  FINANCIAL REPORTING
                </h2>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A7662]/70 ml-2.5 inline-block shadow-2xs" />
              </div>
            </div>

            {/* Shelf Space with Clearance Above Books */}
            <div className="relative pt-6 sm:pt-7">
              {/* Books Standing on Shelf 4 inspired by reference image */}
              <div className="flex items-end justify-center gap-2 sm:gap-3 px-2 sm:px-3 pb-0 relative z-10 overflow-x-auto sm:overflow-visible scrollbar-none">
                {/* Book 1: Tall Dark Charcoal "Journals & Ledgers" */}
                <div
                  onClick={() => setSelectedBookId('journals-ledgers')}
                  className={`group cursor-pointer w-26 sm:w-30 h-46 sm:h-50 bg-gradient-to-b from-[#2B2C30] via-[#1D1E22] to-[#121316] border border-[#44464D] rounded-xs shadow-xl p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('journals-ledgers')
                      ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="Journals & Ledgers - Double-Entry Ledger Posting - Click to Open"
                >
                  <div className="border border-[#C69E54]/70 inset-2 absolute rounded-xs pointer-events-none" />

                  <div className="pt-2 text-center relative z-10">
                    <p className="text-[#E5C77A] text-[9.5px] sm:text-[10.5px] font-bold leading-tight tracking-wide uppercase font-serif">
                      Journals
                      <br />
                      & Ledgers
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-1">
                      Postings & Balance
                    </p>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="text-center pb-1 relative z-10">
                    <span className="text-[8.5px] text-[#C69E54] tracking-widest uppercase font-mono">
                      c/d & b/d
                    </span>
                  </div>
                </div>

                {/* Book 2: Olive Green "Day Books Practice" */}
                <div
                  onClick={() => setSelectedBookId('day-books-practice')}
                  className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-gradient-to-b from-[#586B3E] via-[#465630] to-[#344023] border border-[#6B804E] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('day-books-practice')
                      ? 'ring-2 ring-emerald-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="Day Books Practice - 7 Subsidiary Primary Books - Click to Open"
                >
                  <div className="border border-[#E5C77A]/70 inset-2 absolute rounded-xs pointer-events-none" />

                  <div className="pt-2 text-center relative z-10">
                    <p className="text-[#E5C77A] text-[9px] sm:text-[10px] font-bold leading-tight tracking-wide uppercase font-serif">
                      Day Books
                      <br />
                      Practice
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-1">
                      7 Primary Books
                    </p>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="text-center pb-1 relative z-10">
                    <span className="text-[8.5px] text-[#C69E54] tracking-widest uppercase font-mono">
                      Subsidiary
                    </span>
                  </div>
                </div>

                {/* Book 3: Burgundy "Annual Reports" */}
                <div
                  onClick={() => setSelectedBookId('annual-reports')}
                  className={`group cursor-pointer w-24 sm:w-28 h-44 sm:h-48 bg-gradient-to-b from-[#691823] via-[#54111A] to-[#3E0A12] border border-[#8C2331] rounded-xs shadow-lg p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('annual-reports')
                      ? 'ring-2 ring-rose-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="Annual Reports - Corporate Disclosures - Click to Open"
                >
                  <div className="border border-[#E5C77A]/70 inset-2 absolute rounded-xs pointer-events-none" />

                  <div className="pt-2 text-center relative z-10">
                    <p className="text-[#E5C77A] text-[9.5px] sm:text-[10.5px] font-bold leading-tight tracking-wide uppercase font-serif">
                      Annual
                      <br />
                      Reports
                    </p>
                    <p className="text-[#E5C77A]/80 text-[7px] sm:text-[7.5px] font-sans mt-1">
                      Corporate Statements
                    </p>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="text-center pb-1 relative z-10">
                    <span className="text-[8.5px] text-[#C69E54] tracking-widest uppercase font-mono">
                      Disclosures
                    </span>
                  </div>
                </div>

                {/* Book 4: Premier Navy & Gold "Financial Statements (NFRS/NAS)" */}
                <div
                  onClick={() => setSelectedBookId('financial-statements')}
                  className={`group cursor-pointer w-28 sm:w-32 h-44 sm:h-48 bg-gradient-to-b from-[#182846] via-[#101D34] to-[#0A1222] border-2 border-[#D4AF37]/80 rounded-xs shadow-xl p-2 sm:p-2.5 flex flex-col justify-between relative hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-200 shrink-0 ${
                    isBookHighlighted('financial-statements')
                      ? 'ring-2 ring-amber-400 ring-offset-2 -translate-y-2.5'
                      : ''
                  }`}
                  title="Financial Statements (NFRS / NAS Framework) - Click to Open"
                >
                  <div className="border border-[#C69E54]/70 inset-1.5 absolute rounded-xs pointer-events-none" />

                  <div className="pt-2 text-center relative z-10">
                    <p className="text-[#E5C77A] text-[9px] sm:text-[10px] font-black leading-tight tracking-wide uppercase font-serif">
                      Financial
                      <br />
                      Statements
                    </p>
                    <p className="text-[#E5C77A]/90 text-[7px] sm:text-[7.5px] font-semibold leading-tight mt-1 font-sans">
                      (NFRS / NAS)
                    </p>
                    <p className="text-[#C69E54] text-[6.5px] sm:text-[7px] font-medium leading-tight mt-0.5 tracking-normal font-sans">
                      Balance Sheet & P&L
                    </p>
                  </div>

                  <div className="w-1 sm:w-1.5 bg-[#FAF6EE] border-l border-slate-400/50 absolute right-0 top-1 bottom-1 rounded-r-xs pointer-events-none" />

                  <div className="text-center pb-1 relative z-10">
                    <span className="text-[8px] sm:text-[8.5px] text-[#C69E54] font-bold tracking-widest uppercase font-mono">
                      NAS 1 Models
                    </span>
                  </div>
                </div>
              </div>

              {/* Wooden Shelf Ledge & Under-Shadow */}
              <div className="relative">
                <div className="h-1 bg-gradient-to-r from-[#D8B684] via-[#E2C79D] to-[#CF9F6A] rounded-t-xs" />
                <div className="h-4 sm:h-5 bg-gradient-to-b from-[#8C5E35] via-[#6B4220] to-[#4A2D13] border-t border-[#DDBA88]/60 shadow-[0_14px_24px_-4px_rgba(0,0,0,0.5)] w-full">
                  <div className="h-0.5 bg-white/20 w-full" />
                </div>
                <div className="h-4 w-full bg-gradient-to-b from-black/25 to-transparent blur-xs pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </main>
      ) : (
        /* ======================================================================= */
        /* DETAILED CHAPTER WINDOW / READER (OPENS WHEN USER SELECTS A BOOK) */
        /* ======================================================================= */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* Navigation Bar inside the Reader Window (hidden for First Session, Chart of Accounts, Complete Rules, The Accounting Cycle, and TDS Compliance Guide which have built-in dashboard navigation) */}
          {selectedBookId !== 'debit-credit-equilibrium' && selectedBookId !== 'chart-of-accounts' && selectedBookId !== 'complete-accounting' && selectedBookId !== 'accounting-101' && selectedBookId !== 'tds-compliance' && (
            <div className="bg-white border border-[#E0D8CB] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedBookId(null)}
                aria-label="Back to Shelves Catalogue"
                title="Back to Shelves Catalogue"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 transition shadow-2xs flex items-center justify-center shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="border-l border-slate-200 pl-3.5">
                {selectedBookId === 'tax-calculator' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-700 border border-amber-500/30 flex items-center justify-center">
                        <Calculator className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        TDS Calculator
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      Based on the <strong>Inland Revenue Department (IRD) Nepal FY 2083/84 Withholding Rates</strong> (Income Tax Act 2058). Automatically handles 13% VAT decomposition, withholding computation, and generates compliant accounting journal vouchers.
                    </p>
                  </div>
                ) : selectedBookId === 'vat-procedures' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-700 border border-purple-500/30 flex items-center justify-center">
                        <Receipt className="w-3.5 h-3.5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        Value Added Tax (13%)
                      </h2>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      Official statutory accounting under the Nepal Value Added Tax Act, 2052: <strong>Purchase Register (खरीद खाता - Anusuchi 8)</strong> and <strong>Sales Register (बिक्री खाता - Anusuchi 9)</strong> with invoice resource attachments and sample double-entry journal vouchers.
                    </p>
                  </div>
                ) : selectedBookId === 'conceptual-framework' ? (
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      1. ACCOUNTING CORE
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                      Accounting Principles, Assumptions & Conventions
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      Fundamental theoretical principles that ensure consistency, reliability, and comparability in accounting records.
                    </p>
                  </div>
                ) : (
                  <>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {activeBook?.shelfTitle}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                      {activeBook?.title}
                    </h2>
                  </>
                )}
              </div>
            </div>


          </div>
          )}

          {/* =================================================================== */}
          {/* DETAILED CONTENT BY BOOK ID */}
          {/* =================================================================== */}

          {/* FIRST SESSION BOOK: HAPPINESS IS WHEN DEBIT (DR) = CREDIT (CR) */}
          {selectedBookId === 'debit-credit-equilibrium' && (
            <DebitCreditEquilibriumLesson
              onBack={() => setSelectedBookId(null)}
              onGoToCompleteRules={() => setSelectedBookId('complete-accounting')}
              onGoToTestArena={() => onGoToTestArena(1)}
            />
          )}

          {/* BOOK 2: THE COMPLETE RULES FOR DEBIT & CREDIT */}
          {selectedBookId === 'complete-accounting' && (
            <CompleteRulesLesson
              onBack={() => setSelectedBookId(null)}
              onGoToTestArena={onGoToTestArena}
              onGoToNextLesson={() => setSelectedBookId('chart-of-accounts')}
            />
          )}

          {/* BOOK 3: THE ACCOUNTING CYCLE */}
          {selectedBookId === 'accounting-101' && (
            <AccountingCycleLesson
              onBack={() => setSelectedBookId(null)}
              onGoToTestArena={onGoToTestArena}
              onGoToNextLesson={() => setSelectedBookId('conceptual-framework')}
            />
          )}

          {/* BOOK 3: CONCEPTUAL FRAMEWORK */}
          {selectedBookId === 'conceptual-framework' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">1. Business Entity Concept</div>
                  <p className="text-[11px] text-slate-600">The business and proprietor are strictly distinct legal entities. Owner drawings reduce capital.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">2. Going Concern Concept</div>
                  <p className="text-[11px] text-slate-600">Assumes the business will operate indefinitely into the foreseeable future without liquidation.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">3. Accrual Concept</div>
                  <p className="text-[11px] text-slate-600">Revenues and expenses are recorded when earned or incurred, not when physical cash settles.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">4. Matching Principle</div>
                  <p className="text-[11px] text-slate-600">Expenses incurred in a period must match against the revenues earned during that identical period.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">5. Prudence / Conservatism</div>
                  <p className="text-[11px] text-slate-600">Anticipate no unrealized profits, but provide for all known liabilities, losses, and bad debts.</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-900">6. Historical Cost Principle</div>
                  <p className="text-[11px] text-slate-600">Assets are initially recorded at their acquisition cost including freight and installation.</p>
                </div>
              </div>
            </div>
          )}

          {/* BOOK: CHART OF ACCOUNTS (COA - 5 ELEMENTS) */}
          {selectedBookId === 'chart-of-accounts' && (
            <ChartOfAccountsBook
              onBack={() => setSelectedBookId(null)}
              onGoToTestArena={onGoToTestArena}
              onGoToMemoryLab={onGoToMemoryLab}
              onGoToNextLesson={() => setSelectedBookId('debit-credit-equilibrium')}
            />
          )}

          {/* BOOK 4: INCOME TAX ACT */}
          {selectedBookId === 'income-tax-act' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Taxation & Compliance
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Nepal Income Tax Act, 2058 Framework
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Statutory provisions governing business profits, deductible expenditures, and corporate income tax slabs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-900 uppercase">3 Heads of Assessable Income</span>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div>1. <strong>Income from Business:</strong> Operational turnover, profit on sale of assets, trade gains.</div>
                    <div>2. <strong>Income from Employment:</strong> Basic salary, allowances, overtime, statutory perquisites.</div>
                    <div>3. <strong>Income from Investment:</strong> Dividends, interest, royalties, rent, capital gains.</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-900 uppercase">General Corporate Tax Rates</span>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div>• <strong>General Entities:</strong> 25% on taxable net profit.</div>
                    <div>• <strong>Banks & Financial Institutions (BFIs):</strong> 30% corporate rate.</div>
                    <div>• <strong>Special Manufacturing Entities:</strong> 20% concessional rate.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOK 5: VALUE ADDED TAX (13%) - PURCHASE & SALES REGISTERS */}
          {selectedBookId === 'vat-procedures' && (
            <VatRegistersSection />
          )}

          {/* BOOK 6: TDS COMPLIANCE GUIDE */}
          {selectedBookId === 'tds-compliance' && (
            <TdsComplianceGuide
              onBack={() => setSelectedBookId(null)}
              onOpenCalculator={() => setSelectedBookId('tax-calculator')}
              onGoToTestArena={onGoToTestArena}
            />
          )}

          {/* BOOK: TAX CALCULATOR */}
          {selectedBookId === 'tax-calculator' && (
            <TdsCalculator />
          )}

          {/* BOOK 7: TAX FORMS */}
          {selectedBookId === 'tax-forms' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Practical Forms
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Nepal Tax Forms & Statutory Filings Guide
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Official IRD forms and return formats for corporate and individual accounting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">Anusuchi 10 (VAT Return)</span>
                  <p className="text-[11px] text-slate-500">Monthly/Bi-monthly return summarizing input VAT, output VAT, and net payable/refundable due by 25th.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">E-TDS Portal Filing</span>
                  <p className="text-[11px] text-slate-500">Monthly deposit of withheld taxes with detailed voucher breakdown against deductee PAN.</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">Form 88 Withholding Certificate</span>
                  <p className="text-[11px] text-slate-500">Statutory certificate issued to suppliers proving TDS was withheld and remitted to government treasury.</p>
                </div>
              </div>
            </div>
          )}

          {/* BOOK 8: ARF REGULATIONS */}
          {selectedBookId === 'arf-regulations' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Retirement Scheme
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Approved Retirement Funds (ARF) Regulations
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Income Tax Act Section 63 provisions on retirement contributions and tax concessions.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900">Deduction Limits Under Section 63</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    An individual can claim deduction from assessable income for contributions to an approved retirement fund up to lower of:
                  </p>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] space-y-0.5">
                    <div>1. One-third (1/3) of Total Assessable Income</div>
                    <div>2. Rs. 300,000 (Rs. 500,000 in case of Social Security Fund - SSF)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOK 9: SSF EMPLOYER GUIDE */}
          {selectedBookId === 'ssf-employer-guide' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Day 9 Focus
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Social Security Fund (SSF 31%) & Labor Act 2074
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Statutory 11% employee contribution + 20% employer contribution structure and monthly payroll accounting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                  <div className="font-bold text-blue-900">11% Employee SSF</div>
                  <div className="text-[11px] text-slate-600 mt-1">Deducted directly from basic salary as employee contribution.</div>
                </div>
                <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-xl">
                  <div className="font-bold text-indigo-900">20% Employer SSF</div>
                  <div className="text-[11px] text-slate-600 mt-1">Overhead contribution funded by employer on top of gross salary.</div>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                  <div className="font-bold text-emerald-900">31% Total Deposited</div>
                  <div className="text-[11px] text-slate-600 mt-1">Deposited into employee SSF portal by 15th of the following month.</div>
                </div>
              </div>

              {/* Official Portal Access Banner */}
              <div className="p-4 bg-slate-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Social Security Fund (सामाजिक सुरक्षा कोष) Official Portal</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                    Official domain: https://ssf.gov.np/
                  </div>
                </div>
                <a
                  href="https://ssf.gov.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition shrink-0 cursor-pointer"
                >
                  <span>Visit official site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
                <div className="text-slate-800 font-bold">Salary Expense A/c (Gross) ................. Dr.</div>
                <div className="text-blue-700 font-bold">Employer SSF Contribution A/c (20%) ........ Dr.</div>
                <div className="pl-6 text-slate-700">To SSF Payable A/c (Total 31% = 11% + 20%)</div>
                <div className="pl-6 text-slate-700">To TDS Payable A/c (Section 87 Income Tax)</div>
                <div className="pl-6 text-emerald-700 font-bold">To Bank / Net Salary Payable A/c</div>
              </div>
            </div>
          )}

          {/* BOOK 10: EPF SCHEMES */}
          {selectedBookId === 'epf-schemes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Provident Fund
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Employees Provident Fund (EPF - Karmachari Sanchaya Kosh)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  10% employee deduction matched with 10% employer contribution (Total 20%).
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900">Contribution Mechanics</span>
                <p className="text-[11px] text-slate-600">
                  Under the EPF Act, 10% is deducted from employee basic pay and employer adds an equal matching 10%, remitting 20% to KSK.
                </p>
              </div>

              {/* Official Portal Access Banner */}
              <div className="p-4 bg-slate-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Employees Provident Fund (कर्मचारी सञ्चय कोष) Official Portal</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                    Official domain: https://epf.org.np/
                  </div>
                </div>
                <a
                  href="https://epf.org.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition shrink-0 cursor-pointer"
                >
                  <span>Visit official site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* BOOK 11: CIT ADMINISTRATION */}
          {selectedBookId === 'cit-administration' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Investment Trust
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Citizen Investment Trust (CIT - Nagarik Lagani Kosh)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Voluntary pension schemes, investor accounts, and employer gratuity fund management.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900">CIT Voluntary Retirement Scheme</span>
                <p className="text-[11px] text-slate-600">
                  Voluntary monthly deduction from salary credited to employee CIT account, eligible for Section 63 tax exemption.
                </p>
              </div>

              {/* Official Portal Access Banner */}
              <div className="p-4 bg-slate-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Citizen Investment Trust (नागरिक लगानी कोष) Official Portal</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                    Official domain: https://www.nlk.org.np/
                  </div>
                </div>
                <a
                  href="https://www.nlk.org.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition shrink-0 cursor-pointer"
                >
                  <span>Visit official site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* BOOK 12: JOURNALS & LEDGERS */}
          {selectedBookId === 'journals-ledgers' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Day 10 Focus
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Journals, Compound Entries & Ledger Posting
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Rules of posting from original entry to individual ledger accounts and calculating c/d and b/d balances.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900">Balancing of Ledger Accounts</span>
                  <p className="text-[11px] text-slate-600">
                    If debit total exceeds credit total, the difference is entered on credit side as <strong>By Balance c/d</strong> (carried down) and brought down next period on debit side as <strong>To Balance b/d</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BOOK 13: DAY BOOKS PRACTICE */}
          {selectedBookId === 'day-books-practice' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Days 10-12 Focus
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Primary Books of Entry & Subsidiary Day Books
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Routing transactions into specialized subsidiary books and primary double-entry journals.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Cash Book</span>
                    <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded">Cash In/Out</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">All direct cash inflows & disbursements.</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Bank Book</span>
                    <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1 py-0.5 rounded">Bank In/Out</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Cheques, RTGS, ConnectIPS, electronic settlement.</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Purchase Book</span>
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1 py-0.5 rounded">Credit Purchases</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Credit purchases of trading inventory from suppliers.</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Sales Book</span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">Credit Sales</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Credit sales of trading goods to trade debtors.</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Returns Books</span>
                    <span className="font-mono text-[10px] text-rose-700 bg-rose-50 px-1 py-0.5 rounded">Debit/Credit Notes</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Debit notes (PR) & Credit notes (SR).</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Journal Proper</span>
                    <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1 py-0.5 rounded">Non-Cash Entries</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Fixed assets on credit, opening/closing, accruals.</div>
                </div>
              </div>
            </div>
          )}

          {/* BOOK 14: ANNUAL REPORTS */}
          {selectedBookId === 'annual-reports' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Corporate Governance
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Corporate Annual Reports & Full Disclosure
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Structure of corporate disclosures under NFRS / NAS statutory guidelines.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-900">Key Components of an Annual Report</span>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div>1. Board of Directors' Report & Management Discussion</div>
                  <div>2. Independent Auditor's Report (Clean, Qualified, Adverse, Disclaimer)</div>
                  <div>3. Statement of Financial Position (Balance Sheet)</div>
                  <div>4. Statement of Profit or Loss and Other Comprehensive Income</div>
                  <div>5. Statement of Cash Flows (Operating, Investing, Financing activities)</div>
                  <div>6. Notes Comprising Significant Accounting Policies</div>
                </div>
              </div>
            </div>
          )}

          {/* BOOK 15: FINANCIAL STATEMENTS (NFRS / NAS) */}
          {selectedBookId === 'financial-statements' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-7">
              {/* Header Box */}
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Days 13-15 Focus • ICAN NFRS / NAS Regulatory Framework
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  NAS 1: Presentation of Financial Statements (NFRS Framework)
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                  As per <strong>NAS 1 (Presentation of Financial Statements)</strong> under the <strong>Nepal Financial Reporting Standards (NFRS)</strong> framework pronounced by the <strong>Institute of Chartered Accountants of Nepal (ICAN)</strong>, a complete set of financial statements consists of five primary components along with specific comparative statements.
                </p>
              </div>

              {/* Sample Financial Statements Download Container Box */}
              <div className="p-5 bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-slate-50 border border-purple-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span>Download Sample Financial Statements (NFRS / NAS Format)</span>
                      <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                        Excel / Google Drive
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      Access official sample corporate financial models, working spreadsheets, notes disclosures, and audit-ready multi-period templates according to NFRS / NAS taxonomy.
                    </p>
                  </div>
                </div>

                <a
                  href="https://drive.google.com/drive/folders/19d4BKDR1-5HiAY4ENIOnvjSDUjyj7O1z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer group"
                >
                  <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Sample</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* Major Components of Financial Statements (NFRS / NAS - NAS 1) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-700" />
                    <span>The Five Major Components as per NAS 1 / NFRS</span>
                  </h4>
                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                    ICAN Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Component 1: Statement of Financial Position (Balance Sheet) */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-purple-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-[11px]">1</span>
                        <span>Statement of Financial Position (Balance Sheet)</span>
                      </span>
                      <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-semibold">
                        Point in Time
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
                      <div>
                        <strong className="text-slate-900">• Purpose:</strong> Reports the company's assets, liabilities, and equity at a specific point in time.
                      </div>
                      <div>
                        <strong className="text-slate-900">• NFRS Format:</strong> Presented in a vertical layout cleanly distinguishing between <strong>Current</strong> and <strong>Non-Current</strong> categories for both assets and liabilities.
                      </div>
                    </div>
                  </div>

                  {/* Component 2: Statement of Profit or Loss and Other Comprehensive Income */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-purple-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-[11px]">2</span>
                        <span>Statement of Profit or Loss and Other Comprehensive Income</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                        Reporting Period
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
                      <div>
                        <strong className="text-slate-900">• Purpose:</strong> Measures the company’s financial performance over a reporting period.
                      </div>
                      <div>
                        <strong className="text-slate-900">• Structure:</strong> It can be presented as a single statement or split into two separate sections:
                        <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-200">
                          <div>
                            <strong>– Statement of Profit or Loss:</strong> Tracks regular operating revenues, finance costs, and expenses to arrive at Net Profit or Loss.
                          </div>
                          <div>
                            <strong>– Statement of Other Comprehensive Income (OCI):</strong> Includes items of income and expense (such as revaluation gains on property or unrealized gains on financial instruments) that are not recognized in regular profit or loss under NFRS.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Component 3: Statement of Changes in Equity */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-purple-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-[11px]">3</span>
                        <span>Statement of Changes in Equity</span>
                      </span>
                      <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold">
                        Equity Reconciliation
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
                      <div>
                        <strong className="text-slate-900">• Purpose:</strong> Reconciles the opening and closing balances of the company's equity accounts during the period.
                      </div>
                      <div>
                        <strong className="text-slate-900">• Key Disclosure:</strong> Tracks movements in share capital, premium reserves, retained earnings, and accumulated OCI accounts, highlighting transactions with owners like share issuances or dividends.
                      </div>
                    </div>
                  </div>

                  {/* Component 4: Statement of Cash Flows */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-purple-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-[11px]">4</span>
                        <span>Statement of Cash Flows</span>
                      </span>
                      <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">
                        NAS 7 Prescribed
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
                      <div>
                        <strong className="text-slate-900">• Purpose:</strong> Details the actual cash inflows and outflows of the business over the period.
                      </div>
                      <div>
                        <strong className="text-slate-900">• NFRS Structure:</strong> Segmented into three distinct operational headers as prescribed by <strong>NAS 7</strong>:
                        <div className="pl-3 mt-1.5 space-y-1 border-l-2 border-slate-200">
                          <div><strong>– Operating Activities:</strong> Core business revenue generation.</div>
                          <div><strong>– Investing Activities:</strong> Acquisition and disposal of long-term assets.</div>
                          <div><strong>– Financing Activities:</strong> Changes in size/composition of contributed equity and borrowings.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Component 5: Notes to the Financial Statements (Full Width) */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 hover:border-purple-300 transition md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono text-[11px]">5</span>
                        <span>Notes to the Financial Statements</span>
                      </span>
                      <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-semibold">
                        Accounting Policies & Disclosures
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
                      <div>
                        <strong className="text-slate-900">• Purpose:</strong> Provides the necessary background, narrative context, and mathematical breakdowns for items summarized in the major statements.
                      </div>
                      <div>
                        <strong className="text-slate-900">• Requirements:</strong> Must contain a clear summary of significant accounting policies (e.g., historical cost vs. fair value measurement bases) and other explanatory disclosures required to provide a fair presentation.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 💡 Additional Structural Requirements Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-xs">
                    💡
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Additional Structural Requirements
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/60 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                      <span>• Comparative Information</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      NFRS mandates presenting comparative data from the preceding period for all narrative and numerical info in the statements.
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/60 space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                      <span>• The "Third" Statement of Financial Position</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      If a company applies an accounting policy retrospectively, makes a retrospective restatement, or reclassifies financial statement lines, it must provide a third Statement of Financial Position as of the beginning of the earliest comparative period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Standard Year-End Adjusting Entries & Accounting Cycles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Standard Year-End Adjusting Entries (Accrual & Matching Principles)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Double-Entry Vouchers
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900">1. Outstanding Expenses (Accrued Expense)</span>
                      <p className="text-[11px] text-slate-500">Expense incurred during current period but not yet paid.</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] shrink-0 text-right">
                      <span className="text-blue-700 font-bold">Expense A/c ............... Dr.</span><br />
                      <span className="text-slate-700">To Outstanding Expense A/c (Liability)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900">2. Prepaid Expenses (Unexpired Expense)</span>
                      <p className="text-[11px] text-slate-500">Paid in advance; benefit relates to upcoming accounting period.</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] shrink-0 text-right">
                      <span className="text-blue-700 font-bold">Prepaid Expense A/c (Asset) ... Dr.</span><br />
                      <span className="text-slate-700">To Expense A/c (Reduction)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900">3. Depreciation on Fixed Assets (NAS 16)</span>
                      <p className="text-[11px] text-slate-500">Non-cash operational expense reflecting wear, tear, and obsolescence.</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] shrink-0 text-right">
                      <span className="text-blue-700 font-bold">Depreciation Expense A/c ........ Dr.</span><br />
                      <span className="text-slate-700">To Asset A/c (or Accumulated Dep.)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Go to Top Arrow Button across all Study Library modules & catalogue */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-xl border border-slate-700 hover:border-amber-400 transition-all flex items-center justify-center cursor-pointer group hover:scale-105"
        title="Go to top"
        aria-label="Go to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};
