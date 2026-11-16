import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Landmark,
  Receipt,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Info,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Scale,
  Layers,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import {
  AccountElement,
  MASTER_CHART_OF_ACCOUNTS,
  ELEMENT_BLOCK_CONFIGS,
  AccountHead,
} from '../data/chartOfAccountsData';
import {
  CORE_ELEMENT_DEFINITIONS,
  CoreElementDefinition,
} from '../data/elementDefinitionsData';
import { downloadElementStudyGuidePDF } from '../utils/documentExport';

interface Props {
  onBack?: () => void;
  onGoToTestArena?: (dayNumber?: number) => void;
  onGoToMemoryLab?: () => void;
  onGoToNextLesson?: () => void;
}

export const ChartOfAccountsBook: React.FC<Props> = ({
  onBack,
  onGoToTestArena,
  onGoToMemoryLab,
  onGoToNextLesson,
}) => {
  // When null, shows the 5 element boxes overview.
  // When an element is clicked, opens that specific element's individual multi-column table window.
  const [openedElement, setOpenedElement] = useState<AccountElement | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const elementOrder: AccountElement[] = ['Assets', 'Liabilities', 'Equity', 'Income', 'Expenses'];

  // Group accounts by Element
  const accountsByElement = useMemo(() => {
    const map: Record<AccountElement, AccountHead[]> = {
      Assets: [],
      Liabilities: [],
      Equity: [],
      Income: [],
      Expenses: [],
    };

    MASTER_CHART_OF_ACCOUNTS.forEach((acc) => {
      map[acc.element].push(acc);
    });

    return map;
  }, []);

  // Active element configuration when an element is opened
  const activeConfig = openedElement ? ELEMENT_BLOCK_CONFIGS[openedElement] : null;
  const activeDefinition: CoreElementDefinition | null = openedElement
    ? CORE_ELEMENT_DEFINITIONS[openedElement]
    : null;
  const activeAccountsList = openedElement ? accountsByElement[openedElement] || [] : [];

  // Styling helper for element themes with crisp, clear borders
  const getElementTheme = (elem: AccountElement) => {
    switch (elem) {
      case 'Assets':
        return {
          border: 'border-2 border-emerald-500 hover:border-emerald-600',
          stripe: 'bg-emerald-500',
          bgLight: 'bg-emerald-50/40',
          iconBox: 'bg-emerald-50 border-2 border-emerald-200 text-emerald-600',
          badgeText: 'text-emerald-900 bg-emerald-100 border border-emerald-300',
          button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
          accentColor: 'text-emerald-700',
        };
      case 'Liabilities':
        return {
          border: 'border-2 border-rose-500 hover:border-rose-600',
          stripe: 'bg-rose-500',
          bgLight: 'bg-rose-50/40',
          iconBox: 'bg-rose-50 border-2 border-rose-200 text-rose-600',
          badgeText: 'text-rose-900 bg-rose-100 border border-rose-300',
          button: 'bg-rose-700 hover:bg-rose-800 text-white',
          accentColor: 'text-rose-700',
        };
      case 'Equity':
        return {
          border: 'border-2 border-purple-500 hover:border-purple-600',
          stripe: 'bg-purple-500',
          bgLight: 'bg-purple-50/40',
          iconBox: 'bg-purple-50 border-2 border-purple-200 text-purple-600',
          badgeText: 'text-purple-900 bg-purple-100 border border-purple-300',
          button: 'bg-purple-700 hover:bg-purple-800 text-white',
          accentColor: 'text-purple-700',
        };
      case 'Income':
        return {
          border: 'border-2 border-blue-500 hover:border-blue-600',
          stripe: 'bg-blue-500',
          bgLight: 'bg-blue-50/40',
          iconBox: 'bg-blue-50 border-2 border-blue-200 text-blue-600',
          badgeText: 'text-blue-900 bg-blue-100 border border-blue-300',
          button: 'bg-blue-700 hover:bg-blue-800 text-white',
          accentColor: 'text-blue-700',
        };
      case 'Expenses':
        return {
          border: 'border-2 border-amber-500 hover:border-amber-600',
          stripe: 'bg-amber-500',
          bgLight: 'bg-amber-50/40',
          iconBox: 'bg-amber-50 border-2 border-amber-200 text-amber-600',
          badgeText: 'text-amber-900 bg-amber-100 border border-amber-300',
          button: 'bg-amber-700 hover:bg-amber-800 text-white',
          accentColor: 'text-amber-700',
        };
    }
  };

  const handleOpenElement = (elem: AccountElement) => {
    setOpenedElement(elem);
    setIsGuideOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/70 overflow-hidden py-8 sm:py-10 font-sans">
      {/* Subtle Geometric Background Watermark matching Main Dashboard */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* =================================================================== */}
        {/* VIEW 1: THE 5 CORE FINANCIAL ELEMENTS OVERVIEW (DEFAULT)            */}
        {/* =================================================================== */}
        {!openedElement ? (
          <>
            {/* Top Bar with Back Button & Centered Welcome Banner */}
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

              {/* Centered Main Title Heading - Identical Design to Main Dashboard */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  The 5 Core Financial Elements &amp; <span className="text-blue-700">Chart of Accounts</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
                  Every financial transaction in the world belongs to one of these 5 universal pillars. Click any element container below to open and master its associated ledgers.
                </p>
              </div>
            </div>

            {/* 5 Distinct Clean Containers with Clear Box Boundaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 items-stretch">
              {elementOrder.map((elem) => {
                const cfg = ELEMENT_BLOCK_CONFIGS[elem];
                const theme = getElementTheme(elem);

                return (
                  <div
                    key={elem}
                    onClick={() => handleOpenElement(elem)}
                    className={`group cursor-pointer bg-white ${theme.border} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center relative overflow-hidden`}
                  >
                    {/* Top Colored Accent Stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-2.5 ${theme.stripe}`} />

                    <div className="pt-2 text-center flex flex-col items-center">
                      {/* Element Name */}
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        {elem}
                      </h2>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5">
                        {cfg.nepaliTitle}
                      </span>

                      {/* Custom SVG Illustration in Defined Box */}
                      <div className="my-5 relative flex items-center justify-center">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ${theme.iconBox}`}>
                          {elem === 'Assets' && (
                            <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 28L32 14L52 28H12Z" fill="#10B981" fillOpacity="0.85" stroke="#047857" strokeWidth="2.5" strokeLinejoin="round" />
                              <rect x="18" y="28" width="6" height="18" fill="#D1FAE5" stroke="#047857" strokeWidth="2" />
                              <rect x="29" y="28" width="6" height="18" fill="#D1FAE5" stroke="#047857" strokeWidth="2" />
                              <rect x="40" y="28" width="6" height="18" fill="#D1FAE5" stroke="#047857" strokeWidth="2" />
                              <rect x="10" y="46" width="44" height="6" rx="1.5" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
                            </svg>
                          )}
                          {elem === 'Liabilities' && (
                            <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="16" y="12" width="32" height="42" rx="3" fill="#FFE4E6" stroke="#BE123C" strokeWidth="2.5" />
                              <line x1="22" y1="20" x2="42" y2="20" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
                              <line x1="22" y1="26" x2="38" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                              <line x1="22" y1="32" x2="42" y2="32" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                              <circle cx="38" cy="42" r="6" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
                              <path d="M36 42L38 44L41 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {elem === 'Equity' && (
                            <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M32 12L46 18V32C46 42 38 49 32 52C26 49 18 42 18 32V18L32 12Z"
                                fill="#EDE9FE"
                                stroke="#6D28D9"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                              />
                              <path d="M26 34L28 26L32 30L36 26L38 34H26Z" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="1.5" strokeLinejoin="round" />
                              <line x1="25" y1="37" x2="39" y2="37" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                          {elem === 'Income' && (
                            <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 46L26 34L36 40L50 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M42 20H50V28" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="20" cy="24" r="7" fill="#BFDBFE" stroke="#1E40AF" strokeWidth="2" />
                              <text x="17" y="27" fontSize="9" fontWeight="bold" fill="#1E3A8A">NPR</text>
                            </svg>
                          )}
                          {elem === 'Expenses' && (
                            <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="18" y="14" width="28" height="38" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="2.5" />
                              <line x1="24" y1="22" x2="40" y2="22" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                              <line x1="24" y1="28" x2="36" y2="28" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                              <line x1="24" y1="34" x2="38" y2="34" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                              <path d="M22 46L26 43L30 46L34 43L38 46L42 43" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* View Element Click Target */}
                    <div className="mt-3.5 w-full py-2 px-3 rounded-xl border border-slate-200 group-hover:border-slate-300 bg-slate-50 group-hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs">
                      <span>Explore {elem} &amp; Ledgers</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* =================================================================== */
          /* VIEW 2: INDIVIDUAL WINDOW OF THE SELECTED ELEMENT (MAIN DASHBOARD UI) */
          /* =================================================================== */
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Top Navigation & Core Element Main Header */}
            <div className="relative">
              <div className="sm:absolute sm:left-0 sm:top-1 mb-3 sm:mb-0">
                <button
                  type="button"
                  onClick={() => setOpenedElement(null)}
                  aria-label="Back to 5 Core Financial Elements"
                  title="Back to 5 Core Financial Elements"
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-full border border-slate-300 shadow-2xs transition flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Centered Main Title Heading (Clean, without top badges or long equation subtext) */}
              <div className="text-center space-y-1 pt-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {openedElement}{' '}
                  <span className="text-slate-400 font-semibold text-xl sm:text-3xl">
                    ({activeConfig?.nepaliTitle})
                  </span>{' '}
                  <span className="text-blue-700 block sm:inline">Concept &amp; Ledgers</span>
                </h1>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 1. CORE ELEMENT MEANING & PEDAGOGICAL DISCUSSION GUIDE (EXPANDABLE) */}
            {/* =================================================================== */}
            {activeDefinition && (
              <div className={`bg-white ${getElementTheme(openedElement).border} rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden`}>
                {/* Top Accent Stripe */}
                <div className={`absolute top-0 left-0 right-0 h-2.5 ${getElementTheme(openedElement).stripe}`} />

                {/* Header Row: Meaning Heading + Toggle Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        What Exactly Does &ldquo;{activeDefinition.englishTitle}&rdquo; Mean?
                      </h2>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 font-semibold">
                      {activeDefinition.nepaliTitle} को आधिकारिक अवधारणा, मान्यताका आधार तथा लेजरहरूको व्याख्या
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start md:self-auto">
                    {/* Golden Rule Badge */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                        Normal Balance Rule
                      </div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {activeDefinition.increasesDecreasesRule}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsGuideOpen(!isGuideOpen)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
                      title={isGuideOpen ? 'Collapse Definition Guide' : 'Expand Definition Guide'}
                    >
                      <span>{isGuideOpen ? 'Hide Meaning Guide' : 'View Full Meaning Guide'}</span>
                      {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isGuideOpen && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Definitions Grid: Formal NAS/IFRS Definition + Plain Business Meaning */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Box 1: Official NAS / IFRS Definition */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
                        <div className="flex items-center gap-2 text-slate-900">
                          <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
                          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                            NAS / IFRS Conceptual Framework Statutory Definition
                          </h3>
                        </div>
                        <blockquote className="italic text-xs sm:text-sm text-slate-800 font-serif leading-relaxed border-l-4 border-blue-600 pl-3.5 py-1 bg-blue-50/50 rounded-r-lg">
                          {activeDefinition.nasIfrsDefinition}
                        </blockquote>
                      </div>

                      {/* Box 2: Plain Practical Meaning (English & Nepali) */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
                        <div className="flex items-center gap-2 text-slate-900">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                            Practical Everyday Meaning (व्यावहारिक परिभाषा)
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
                          {activeDefinition.plainMeaning}
                        </p>
                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans shadow-2xs">
                          <span className="font-extrabold text-slate-900 block text-[11px] mb-0.5 text-blue-900">
                            नेपालीमा व्यावहारिक अर्थ:
                          </span>
                          {activeDefinition.plainMeaningNepali}
                        </div>
                      </div>
                    </div>

                    {/* Recognition Criteria: The 3 Essential Tests */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          The 3 Essential Recognition Criteria to Qualify as {activeDefinition.englishTitle} (मान्यताका तीन अनिवार्य आधारहरू)
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {activeDefinition.recognitionCriteria.map((crit) => (
                          <div
                            key={crit.number}
                            className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1.5 shadow-2xs hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                                {crit.number}
                              </span>
                              <span className="font-bold text-xs text-slate-900">
                                {crit.title}
                              </span>
                            </div>
                            <span className="text-[10.5px] text-slate-500 font-semibold block">
                              ({crit.titleNepali})
                            </span>
                            <p className="text-[11.5px] text-slate-600 leading-relaxed">
                              {crit.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section: Trainer & Student Discussion Guide for Sub-Elements & Ledgers */}
                    <div className="border-t border-slate-200 pt-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-700 shrink-0" />
                            <h3 className="text-sm font-black text-slate-900 tracking-tight">
                              Trainer &amp; Student Discussion: Why Sub-Elements &amp; Ledgers Fall Under {activeDefinition.englishTitle}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {activeDefinition.discussionGuideIntro}
                          </p>
                        </div>

                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                          {activeDefinition.subElementsDiscussion.length} Sub-Categories
                        </span>
                      </div>

                      {/* Sub-elements Cards Grid (Without filter button) */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                        {activeDefinition.subElementsDiscussion.map((sub, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border bg-slate-50/70 hover:bg-slate-50 border-slate-200 space-y-2 transition-colors"
                          >
                            <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-700" />
                              <span>{sub.subGroup}</span>
                            </h4>

                            <p className="text-[11.5px] text-slate-700 leading-relaxed font-medium">
                              <span className="font-bold text-slate-900">Why it belongs: </span>
                              {sub.whyBelongs}
                            </p>

                            <div className="pt-1.5 border-t border-slate-200/80">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                                Typical Ledgers for Discussion:
                              </span>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 font-mono">
                                {sub.typicalLedgers.map((l, lIdx) => (
                                  <li key={lIdx} className="flex items-start gap-1">
                                    <span className="text-slate-400">•</span>
                                    <span>{l}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Capital vs Revenue Distinction / Exam Trap Note if exists */}
                      {activeDefinition.capitalVsRevenueDistinction && (
                        <div className="p-3.5 bg-amber-50/80 border border-amber-300/80 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <strong className="font-bold">Pedagogical Rule for Trainers &amp; Students: </strong>
                            {activeDefinition.capitalVsRevenueDistinction}
                          </div>
                        </div>
                      )}

                      {/* Classroom Viva / Discussion Questions */}
                      <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2.5">
                        <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
                          <HelpCircle className="w-4 h-4 text-purple-700 shrink-0" />
                          <span>Classroom Viva &amp; Discussion Checkpoints (छलफलका मुख्य प्रश्नहरू):</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5">
                          {activeDefinition.trainerDiscussionQuestions.map((q, qIdx) => (
                            <div
                              key={qIdx}
                              className="p-3 rounded-xl bg-white border border-purple-200/80 text-xs text-purple-950 leading-relaxed font-medium shadow-2xs"
                            >
                              <span className="font-bold text-purple-800 font-mono mr-1">Q{qIdx + 1}:</span>
                              {q}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* 2. MASTER LEDGER ACCOUNTS TABLE                                    */}
            {/* =================================================================== */}
            <div className={`bg-white ${getElementTheme(openedElement).border} rounded-3xl p-6 sm:p-8 shadow-md space-y-5`}>
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Master Ledger Accounts for {activeDefinition?.englishTitle || openedElement}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete statutory listing of all <strong>{activeAccountsList.length}</strong> master account heads under {openedElement}
                </p>
              </div>

              {/* Multi-Column Table (No Code Ranges, No Code Numbers, Clean Presentation) */}
              <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-bold text-xs">
                        <th className="py-3 px-4 w-44 whitespace-nowrap">Sub-Group {openedElement}</th>
                        <th className="py-3 px-4 min-w-[220px]">Account Head (English &amp; Nepali)</th>
                        <th className="py-3 px-4 w-36 text-center whitespace-nowrap">Balance Type</th>
                        <th className="py-3 px-4 min-w-[280px]">Description &amp; Key Examination Rule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeAccountsList.map((acc) => (
                        <tr key={acc.name} className="hover:bg-slate-50/80 transition-colors">
                          {/* 1. Sub-Group Column (First Order) */}
                          <td className="py-3 px-4 align-top whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs border border-slate-200">
                              {acc.subCategory}
                            </span>
                          </td>

                          {/* 2. Account Head Column */}
                          <td className="py-3 px-4 align-top space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {acc.name}
                              </span>
                              {acc.isContra && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded">
                                  Contra {acc.contraTarget ? `(${acc.contraTarget})` : ''}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 font-semibold text-xs">
                              {acc.nameNepali}
                            </div>
                          </td>

                          {/* 3. Balance Type Column (Full Text in Single Row without Wrap) */}
                          <td className="py-3 px-4 align-top text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center justify-center font-mono font-bold px-3 py-1 rounded-md text-xs whitespace-nowrap shadow-2xs ${
                                acc.normalBalance === 'Debit'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-50 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {acc.normalBalance === 'Debit' ? 'Dr' : 'Cr'}
                            </span>
                          </td>

                          {/* 4. Description & Key Rule Column */}
                          <td className="py-3 px-4 align-top text-xs text-slate-700 space-y-1.5 leading-relaxed">
                            <p className="text-slate-600 font-medium">
                              {acc.description}
                            </p>
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
                              <span className="font-bold text-slate-900 block mb-0.5">Key Exam Rule:</span>
                              {acc.mcqKeyNote}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Simple Single Download Icon at the End of the Page */}
            <div className="flex flex-col items-center justify-center pt-2 pb-4">
              <button
                type="button"
                onClick={() => downloadElementStudyGuidePDF(openedElement)}
                className="group p-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 border-2 border-slate-300 hover:border-blue-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110 flex items-center justify-center"
                title={`Download ${openedElement} Study Guide PDF`}
                aria-label={`Download ${openedElement} Study Guide PDF`}
              >
                <Download className="w-5 h-5 text-slate-700 group-hover:text-blue-700 transition-colors" />
              </button>
              <span className="text-[11px] font-semibold text-slate-400 mt-2 tracking-wide">
                Download PDF
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
