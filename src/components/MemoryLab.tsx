import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BrainCircuit,
  Zap,
  RotateCw,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Flame,
  Layers,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Timer,
  Search,
  BookOpen,
  Filter,
  Shuffle,
  Check,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ListFilter,
  BarChart3
} from 'lucide-react';
import {
  RAPID_FIRE_100_QUESTIONS,
  RapidCategory,
  RapidQuestion
} from '../data/rapidFire100Data';

interface Props {
  onGoToTestArena: (dayNumber?: number) => void;
  onGoToStudyLibrary?: () => void;
}

interface Flashcard {
  id: number;
  category: string;
  front: string;
  backDrCr: string;
  explanation: string;
  tip: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    category: 'Golden Rules',
    front: 'Commenced business with Rs. 500,000 cash introduced by proprietor.',
    backDrCr: 'Dr. Cash A/c | Cr. Capital A/c',
    explanation: 'Cash comes into the business (Real A/c - Dr). Capital represents the proprietor obligation/giver (Personal/Equity - Cr).',
    tip: 'Day 1: Capital & Setup',
  },
  {
    id: 2,
    category: 'Digital Banking',
    front: 'Deposited counter cash of Rs. 350,000 into Nepal SBI Current Bank A/c.',
    backDrCr: 'Dr. Bank A/c | Cr. Cash A/c',
    explanation: 'Bank receives funds (Personal A/c - Dr). Cash leaves the counter (Real A/c - Cr). This is a Contra entry.',
    tip: 'Day 5: Digital Banking',
  },
  {
    id: 3,
    category: 'Purchases & Trade Discount',
    front: 'Purchased goods of list price Rs. 100,000 at 10% trade discount on credit.',
    backDrCr: 'Dr. Purchases A/c (Rs. 90,000) | Cr. Creditor A/c (Rs. 90,000)',
    explanation: 'Trade discount is deducted directly from list price and NEVER recorded in a separate ledger. Purchases debited at net.',
    tip: 'Day 2: Purchases Book',
  },
  {
    id: 4,
    category: 'Fixed Assets',
    front: 'Paid Rs. 15,000 installation wages in cash for setting up a newly acquired factory machine.',
    backDrCr: 'Dr. Machinery A/c | Cr. Cash A/c',
    explanation: 'Installation and freight costs incurred before an asset is put to use must be CAPITALIZED into asset cost, not expensed as Wages.',
    tip: 'Day 4: Fixed Assets',
  },
  {
    id: 5,
    category: 'VAT Accounting',
    front: 'Purchased taxable merchandise worth Rs. 100,000 + 13% VAT by cheque.',
    backDrCr: 'Dr. Purchases (100k) & Dr. VAT Receivable (13k) | Cr. Bank (113k)',
    explanation: 'Input VAT paid on purchases is an asset (receivable set-off against output VAT liability).',
    tip: 'Day 7: VAT Accounting',
  },
  {
    id: 6,
    category: 'TDS (Sec 88(1))',
    front: 'Paid natural resource extraction royalty of Rs. 200,000 by cheque.',
    backDrCr: 'Dr. Royalty Expense (200k) | Cr. Bank (170k) & Cr. TDS Payable (30k)',
    explanation: 'Section 88(1) requires 15% TDS withholding on natural resources, interest, and general royalties.',
    tip: 'Day 8: TDS Accounting',
  },
  {
    id: 7,
    category: 'TDS (Sec 88(1)(4))',
    front: 'Paid software IT support fee of Rs. 200,000 to a VAT-registered local IT company.',
    backDrCr: 'Dr. IT Support (200k) | Cr. Bank (197k) & Cr. TDS Payable (3k)',
    explanation: 'Under Sec 88(1)(4), services rendered by VAT-registered resident persons attract concessional 1.5% TDS only.',
    tip: 'Day 8: TDS IRD Provisions',
  },
  {
    id: 8,
    category: 'Subsidiary Day Books',
    front: 'Which primary book records the purchase of computer equipment on 30-day credit?',
    backDrCr: 'General Journal (Journal Voucher)',
    explanation: 'Purchase Book only records credit purchase of TRADING INVENTORY. Fixed assets bought on credit go to General Journal.',
    tip: 'Day 10: Day Books',
  },
  {
    id: 9,
    category: 'Payroll & SSF',
    front: 'Gross salary of Rs. 50,000 with 11% employee SSF deduction and 20% employer SSF contribution.',
    backDrCr: 'Employer SSF is an additional staff welfare expense credited to SSF Payable liability.',
    explanation: 'Total SSF deposited into Social Security Fund is 31% (11% employee + 20% employer).',
    tip: 'Day 9: Payroll Accounting',
  },
  {
    id: 10,
    category: 'Depreciation Adjustments',
    front: 'Charged 10% annual depreciation of Rs. 50,000 on furniture and fixtures.',
    backDrCr: 'Dr. Depreciation Expense A/c | Cr. Furniture A/c (or Accumulated Dep.)',
    explanation: 'Depreciation is a non-cash operational expense (Nominal A/c - Dr) reducing book value of asset (Cr).',
    tip: 'Day 13: Adjustments',
  },
];

type TrainingMode = 'rapid_fire' | 'bank_catalog' | 'flashcards';

export const MemoryLab: React.FC<Props> = ({ onGoToTestArena, onGoToStudyLibrary }) => {
  // Mode selection state: null = showing the 3 animated boxes Hub; or a specific mode.
  const [selectedMode, setSelectedMode] = useState<TrainingMode | null>(null);

  // =========================================================================
  // RAPID FIRE 100 STATE
  // =========================================================================
  const [selectedCategory, setSelectedCategory] = useState<RapidCategory | 'All'>('All');
  const [sessionLimit, setSessionLimit] = useState<number>(100);
  const [isShuffled, setIsShuffled] = useState(false);
  const [rapidIdx, setRapidIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Bank Catalog State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<RapidCategory | 'All'>('All');

  // Flashcard State
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);

  // Filtered active rapid-fire questions
  const activeQuestions = useMemo(() => {
    let list = RAPID_FIRE_100_QUESTIONS;
    if (selectedCategory !== 'All') {
      list = list.filter((q) => q.category === selectedCategory);
    }
    if (isShuffled) {
      list = [...list].sort(() => 0.5 - Math.random());
    }
    return list.slice(0, sessionLimit);
  }, [selectedCategory, sessionLimit, isShuffled, shuffleSeed]);

  const currentQ: RapidQuestion | undefined = activeQuestions[rapidIdx] || activeQuestions[0];

  // Dynamically randomize answer positions per question & session so students cannot crack option patterns
  const randomizedOptions = useMemo(() => {
    if (!currentQ) return [];
    const opts = [...currentQ.options];
    // Seeded Fisher-Yates shuffle using question id, current index, and session seed
    let seed = currentQ.id * 37 + rapidIdx * 19 + shuffleSeed * 53;
    for (let i = opts.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      const j = Math.floor(rnd * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return opts;
  }, [currentQ?.id, rapidIdx, shuffleSeed]);

  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null || !currentQ) return;

    setSelectedAnswer(option);
    setAnsweredCount((c) => c + 1);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 10);
      setCorrectCount((cc) => cc + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (rapidIdx + 1 < activeQuestions.length) {
      setRapidIdx((i) => i + 1);
    } else {
      setDrillFinished(true);
    }
  };

  const handleRestartRapidDrill = () => {
    setRapidIdx(0);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setDrillFinished(false);
    setShuffleSeed((s) => s + 1);
  };

  const handleCategoryChange = (cat: RapidCategory | 'All') => {
    setSelectedCategory(cat);
    setRapidIdx(0);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
    setCorrectCount(0);
    setSelectedAnswer(null);
    setDrillFinished(false);
  };

  // Flashcards handlers
  const currentCard = FLASHCARDS[cardIdx];
  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIdx((prev) => (prev + 1) % FLASHCARDS.length);
  };
  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIdx((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };
  const handleMarkKnown = (id: number) => {
    if (!knownCards.includes(id)) {
      setKnownCards([...knownCards, id]);
    }
    handleNextCard();
  };

  // Bank Catalog Filtered List
  const catalogQuestions = useMemo(() => {
    return RAPID_FIRE_100_QUESTIONS.filter((q) => {
      const matchCat = catalogCategory === 'All' || q.category === catalogCategory;
      if (!matchCat) return false;
      if (!catalogSearch.trim()) return true;
      const s = catalogSearch.toLowerCase();
      return (
        q.question.toLowerCase().includes(s) ||
        q.topic.toLowerCase().includes(s) ||
        q.correctAnswer.toLowerCase().includes(s) ||
        q.explanation.toLowerCase().includes(s) ||
        q.examRule.toLowerCase().includes(s)
      );
    });
  }, [catalogCategory, catalogSearch]);

  const allCategories: RapidCategory[] = [
    'TDS & Tax Rates',
    'Balance Type (Dr/Cr)',
    'Major Element (COA)',
    'Subgroup & Statement',
    'Contra & Adjustments',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Clean Top Header Banner (No external jump clutter) */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-white text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-yellow-200" />
            <span>Interactive Cognitive Training</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Memory Lab — Accounting Recall & 100 Rapid-Fire
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            Train your split-second reflexes on <strong>100 essential accounting questions</strong>: TDS withholding rates, Debit vs Credit balance types, Chart of Accounts 5 elements, and financial statement classification (SoFP/BS vs SoPL).
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3 ANIMATED OPTION BOXES (SELECTION HUB) */}
      {/* ===================================================================== */}
      {selectedMode === null ? (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Select Your Training Arena
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose an animated practice mode below to sharpen your reflexes and master statutory accounting rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BOX 1: 100 RAPID-FIRE BLITZ */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode('rapid_fire')}
              className="group cursor-pointer bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 hover:border-amber-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-2xs">
                    <Flame className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300">
                    100 Questions Blitz
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition">
                    100 Rapid-Fire Blitz
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Test your split-second reflexes on mixed TDS rates, Dr vs Cr balance types, COA element classification, and statement placement with live streaks and scoring.
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    ⚡ Reflex Timed
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    🔥 Streak Combos
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    📊 Instant Feedback
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-800">
                <span>Start Rapid-Fire Blitz</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* BOX 2: 100 QUESTION BANK & ANSWERS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode('bank_catalog')}
              className="group cursor-pointer bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 hover:border-blue-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-300">
                    Master Catalogue
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition">
                    100 Question Bank & Answers
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Browse and search all 100 questions with official IRD statutory citations, full explanations, correct answers, and high-yield exam tips at your own pace.
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    🔍 Live Search
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    📖 Complete Answers
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    💡 Exam Rules & Traps
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                <span>Browse Question Bank</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* BOX 3: JOURNAL FLASHCARDS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode('flashcards')}
              className="group cursor-pointer bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 hover:border-emerald-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                    <Layers className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                    Double-Entry Mastery
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition">
                    Journal Voucher Flashcards
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Interactive flipcards for practical corporate scenarios, golden rules, SSF/TDS voucher entries, trade discount mechanics, and year-end depreciation adjustments.
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    🔄 Flip Animation
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    ✓ Mastery Tracking
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    🧾 Practical Vouchers
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Open Flashcards Lab</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* INSIDE ACTIVE TRAINING OPTION */
        /* =================================================================== */
        <div className="space-y-6">
          {/* Unified Navigation Strip */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedMode(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-300 transition cursor-pointer"
                title="Return to Options Hub"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Options Hub</span>
              </button>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Active Mode
                </span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  {selectedMode === 'rapid_fire' && (
                    <>
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>100 Rapid-Fire Blitz</span>
                    </>
                  )}
                  {selectedMode === 'bank_catalog' && (
                    <>
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>100 Question Bank & Answers</span>
                    </>
                  )}
                  {selectedMode === 'flashcards' && (
                    <>
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Journal Voucher Flashcards</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Quick Switch Pills between the 3 modes */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedMode('rapid_fire')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedMode === 'rapid_fire'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ Rapid-Fire
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('bank_catalog')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedMode === 'bank_catalog'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📖 Question Bank
              </button>
              <button
                type="button"
                onClick={() => setSelectedMode('flashcards')}
                className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedMode === 'flashcards'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🗂️ Flashcards
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SECTION 1: 100 RAPID-FIRE BLITZ */}
          {/* ================================================================= */}
          {selectedMode === 'rapid_fire' && (
            <div className="space-y-6">
              {/* Category Filters & Settings */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Category Focus:
                    </span>
                  </div>

                  {/* Shuffling & Session Limits */}
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsShuffled(!isShuffled);
                        setShuffleSeed((s) => s + 1);
                        setRapidIdx(0);
                        setSelectedAnswer(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        isShuffled
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Shuffle</span>
                    </button>

                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      {[10, 25, 50, 100].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setSessionLimit(num);
                            setRapidIdx(0);
                            setSelectedAnswer(null);
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                            sessionLimit === num
                              ? 'bg-white text-slate-900 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {num === 100 ? 'All 100' : `${num} Qs`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('All')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === 'All'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Mixed (100 Qs)
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Screen */}
              {!drillFinished && currentQ ? (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Progress & Live Stats Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        Question {rapidIdx + 1} of {activeQuestions.length}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 hidden sm:inline-block">
                        {currentQ.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{streak} Streak</span>
                      </div>

                      <div className="text-xs sm:text-sm font-black font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                        {score} pts
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${((rapidIdx + 1) / activeQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Prompt */}
                  <div className="py-2 space-y-3">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-500 bg-slate-100 uppercase tracking-wider">
                      Topic: {currentQ.topic}
                    </div>

                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                      {currentQ.question}
                    </h3>
                  </div>

                  {/* Answer Choices Buttons */}
                  <div
                    className={`grid gap-3 ${
                      randomizedOptions.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2 max-w-xl mx-auto'
                        : 'grid-cols-1 sm:grid-cols-2'
                    }`}
                  >
                    {randomizedOptions.map((opt, i) => {
                      const isSelected = selectedAnswer === opt;
                      const isCorrect = opt === currentQ.correctAnswer;
                      const hasAnswered = selectedAnswer !== null;

                      let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-black shadow-md';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-600 text-white border-rose-600 font-black shadow-md';
                        } else {
                          btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={hasAnswered}
                          onClick={() => handleSelectAnswer(opt)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between text-sm sm:text-base font-bold cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-black/10 flex items-center justify-center font-mono text-xs font-bold">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {hasAnswered && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                          )}
                          {hasAnswered && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-white shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback & Explanation Card */}
                  {selectedAnswer !== null && (
                    <div
                      className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm space-y-2.5 transition-all ${
                        selectedAnswer === currentQ.correctAnswer
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50/80 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-black text-sm">
                          {selectedAnswer === currentQ.correctAnswer ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span>Correct! +10 points</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-rose-600" />
                              <span>Incorrect. Correct answer is: {currentQ.correctAnswer}</span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleNextQuestion}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{rapidIdx + 1 < activeQuestions.length ? 'Next Question →' : 'Complete Drill 🏆'}</span>
                        </button>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                        {currentQ.explanation}
                      </p>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                        <span className="text-amber-600 font-black">💡 Exam Rule:</span>
                        <span>{currentQ.examRule}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Drill Completion Card */
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-sm">
                  <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Trophy className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Rapid-Fire Drill Completed!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Great cognitive workout! You tested your split-second recall against professional accounting standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Total Score</div>
                      <div className="text-2xl font-black font-mono text-blue-700 mt-1">{score} pts</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Accuracy</div>
                      <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                        {Math.round((correctCount / (answeredCount || 1)) * 100)}%
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Max Streak</div>
                      <div className="text-2xl font-black font-mono text-amber-600 mt-1">{maxStreak} 🔥</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-bold uppercase">Questions Solved</div>
                      <div className="text-2xl font-black font-mono text-slate-800 mt-1">
                        {correctCount} / {answeredCount}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleRestartRapidDrill}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Practice Again</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMode('bank_catalog')}
                      className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Review Question Bank</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 2: 100 QUESTION BANK & ANSWERS */}
          {/* ================================================================= */}
          {selectedMode === 'bank_catalog' && (
            <div className="space-y-6">
              {/* Header & Search */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      100 Rapid-Fire Question Bank & Detailed Answers
                    </h3>
                    <p className="text-xs text-slate-500">
                      Browse, search, and review all 100 questions with official IRD rules and exam tips at your own pace.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Search 100 questions, rules..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setCatalogCategory('All')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                      catalogCategory === 'All'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All 100 Questions ({catalogQuestions.length})
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCatalogCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                        catalogCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catalogQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{q.id} • {q.topic}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {q.category}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {q.options.map((opt, i) => (
                          <span
                            key={i}
                            className={`px-2 py-1 rounded text-[11px] font-medium border ${
                              opt === q.correctAnswer
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}
                          >
                            {opt} {opt === q.correctAnswer ? '✓' : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Explanation Box */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                      <p className="text-slate-600 leading-relaxed">
                        <strong className="text-emerald-800">Answer: {q.correctAnswer}.</strong> {q.explanation}
                      </p>
                      <div className="text-[10px] font-semibold text-blue-800 bg-blue-50/60 p-1.5 rounded border border-blue-200">
                        💡 Exam Tip: {q.examRule}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION 3: JOURNAL VOUCHER FLASHCARDS */}
          {/* ================================================================= */}
          {selectedMode === 'flashcards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Card {cardIdx + 1} of {FLASHCARDS.length} • {currentCard.category}</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {Math.round((knownCards.length / FLASHCARDS.length) * 100)}% Recall Mastered
                </span>
              </div>

              {/* Flashcard Box */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[260px] sm:min-h-[280px] bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all select-none group relative"
              >
                {/* Top Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    {currentCard.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-emerald-600 transition">
                    <RotateCw className="w-3.5 h-3.5" />
                    Click to flip card
                  </span>
                </div>

                {/* Middle Content */}
                <div className="py-6 text-center">
                  {!isFlipped ? (
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Scenario / Concept</div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        "{currentCard.front}"
                      </h3>
                      <div className="text-xs text-emerald-600 mt-4 font-medium">
                        What is the correct Double-Entry Journal Entry?
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs text-emerald-600 uppercase tracking-widest font-bold">Official Journal Solution</div>
                      <div className="text-lg sm:text-xl font-black font-mono text-blue-700 bg-blue-50 py-3 px-4 rounded-xl border border-blue-200 inline-block">
                        {currentCard.backDrCr}
                      </div>
                      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
                        {currentCard.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Tip */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Aligned with: {currentCard.tip}</span>
                  {knownCards.includes(currentCard.id) && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>

              {/* Flashcard Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  ← Previous Card
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkKnown(currentCard.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Know This! (Mark Mastered)</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextCard}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Next Card →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
