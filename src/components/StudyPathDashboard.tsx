import React from 'react';
import { StudentProfile, AppSection } from '../types/accounting';
import { BookOpen, Brain, Clock, ArrowRight, KeyRound, ShieldCheck, Lock } from 'lucide-react';

interface Props {
  studentProfile: StudentProfile | null;
  onSelectPath: (path: AppSection) => void;
}

export const StudyPathDashboard: React.FC<Props> = ({
  studentProfile,
  onSelectPath,
}) => {
  const isTrainer = studentProfile?.role === 'trainer';
  const firstName = studentProfile?.name
    ? studentProfile.name.split(' ')[0]
    : 'Candidate';

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/70 overflow-hidden py-8 sm:py-10">
      {/* Subtle Geometric Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Title Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-blue-700">{firstName}</span>! Choose your study path.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
            Select a learning mode below to access reference materials, test your memory reflex, attempt the 15-day examination modules, or enter the executive Trainer's Room.
          </p>
        </div>

        {/* 4-Card Grid Matching UI Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {/* Card 1: Study Library */}
          <div
            onClick={() => onSelectPath('study_library')}
            className="group cursor-pointer bg-[#FFFDF7] border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Amber Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#F6BD60]" />

            <div className="pt-2 text-center flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Study Library
              </h2>

              {/* Colorful Custom Illustration Badge */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  {/* SVG Books + Globe Icon Representation */}
                  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Globe */}
                    <circle cx="44" cy="24" r="14" fill="#60A5FA" fillOpacity="0.3" stroke="#2563EB" strokeWidth="2.5" />
                    <ellipse cx="44" cy="24" rx="6" ry="14" stroke="#2563EB" strokeWidth="2" />
                    <line x1="30" y1="24" x2="58" y2="24" stroke="#2563EB" strokeWidth="2" />
                    {/* Stand */}
                    <path d="M44 38V48M36 48H52" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Books Stack */}
                    <rect x="10" y="44" width="30" height="7" rx="1.5" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
                    <rect x="12" y="37" width="28" height="7" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                    <rect x="14" y="30" width="26" height="7" rx="1.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                    {/* Book spine lines */}
                    <line x1="16" y1="32" x2="16" y2="35" stroke="white" strokeWidth="1.5" />
                    <line x1="15" y1="39" x2="15" y2="42" stroke="white" strokeWidth="1.5" />
                    <line x1="13" y1="46" x2="13" y2="49" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[240px]">
                Access course materials, tutor guides, and shared resources.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                className="w-full sm:w-auto min-w-[130px] px-5 py-2.5 rounded-xl border border-slate-300 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-white bg-white text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                Enter Library
              </button>
            </div>
          </div>

          {/* Card 2: Memory Lab */}
          <div
            onClick={() => onSelectPath('memory_lab')}
            className="group cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Sky Blue Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#38BDF8]" />

            <div className="pt-2 text-center flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Memory Lab
              </h2>

              {/* Colorful Custom Illustration Badge */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-sky-50 border border-sky-200/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  {/* SVG Brain with gears and flashcards */}
                  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Gears in background */}
                    <circle cx="48" cy="18" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" strokeDasharray="3 2" />
                    <circle cx="48" cy="18" r="2.5" fill="white" />
                    <circle cx="16" cy="20" r="5" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="2 2" />
                    {/* Brain Shape */}
                    <path
                      d="M32 20C29 16 22 16 19 20C15 22 14 28 17 32C15 36 17 41 22 43C24 45 28 44 32 41C36 44 40 45 42 43C47 41 49 36 47 32C50 28 49 22 45 20C42 16 35 16 32 20Z"
                      fill="#F472B6"
                      fillOpacity="0.85"
                      stroke="#DB2777"
                      strokeWidth="2.5"
                    />
                    {/* Brain folds */}
                    <path d="M26 26C28 29 27 34 29 36" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M38 26C36 29 37 34 35 36" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="32" y1="23" x2="32" y2="40" stroke="#9D174D" strokeWidth="1.5" />
                    {/* Flashcard icon below brain */}
                    <rect x="23" y="38" width="18" height="15" rx="2" fill="white" stroke="#2563EB" strokeWidth="2" />
                    <line x1="27" y1="43" x2="37" y2="43" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="27" y1="47" x2="34" y2="47" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[240px]">
                Revise key concepts using flashcards and spaced repetition.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                className="w-full sm:w-auto min-w-[130px] px-5 py-2.5 rounded-xl border border-slate-300 group-hover:border-sky-400 group-hover:bg-sky-500 group-hover:text-white bg-white text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                Start Review
              </button>
            </div>
          </div>

          {/* Card 3: Test Arena */}
          <div
            onClick={() => onSelectPath('test_arena')}
            className="group cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Purple Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#5B21B6]" />

            <div className="pt-2 text-center flex flex-col items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Test Arena
              </h2>

              {/* Colorful Custom Illustration Badge */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  {/* SVG Clipboard + Stopwatch + Pencil */}
                  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Stopwatch on left */}
                    <circle cx="21" cy="28" r="9" fill="#F1F5F9" stroke="#334155" strokeWidth="2" />
                    <line x1="21" y1="28" x2="25" y2="25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    <rect x="20" y="16" width="2" height="3" fill="#334155" />
                    {/* Clipboard */}
                    <rect x="28" y="18" width="24" height="34" rx="3" fill="white" stroke="#6D28D9" strokeWidth="2.5" />
                    <rect x="34" y="15" width="12" height="5" rx="1.5" fill="#A78BFA" stroke="#6D28D9" strokeWidth="1.5" />
                    {/* Checkmarks / MCQ lines */}
                    <circle cx="34" cy="27" r="2" fill="#10B981" />
                    <line x1="39" y1="27" x2="47" y2="27" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="34" cy="34" r="2" fill="#10B981" />
                    <line x1="39" y1="34" x2="47" y2="34" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="34" cy="41" r="2" fill="#CBD5E1" />
                    <line x1="39" y1="41" x2="47" y2="41" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    {/* Pencil */}
                    <path
                      d="M48 42L54 36L57 39L51 45L48 46L48 42Z"
                      fill="#F59E0B"
                      stroke="#B45309"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[240px]">
                Practice with timed exam-style MCQs and mock tests.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                className="w-full sm:w-auto min-w-[130px] px-5 py-2.5 rounded-xl border border-slate-300 group-hover:border-purple-600 group-hover:bg-purple-700 group-hover:text-white bg-white text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                Take a Quiz
              </button>
            </div>
          </div>

          {/* Card 4: Trainer's Room */}
          <div
            onClick={() => onSelectPath('trainers_room')}
            className="group cursor-pointer bg-white border border-emerald-200/80 hover:border-emerald-500 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Emerald Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-teal-500" />

            <div className="pt-2 text-center flex flex-col items-center">
              <div className="flex items-center gap-1.5 justify-center">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors">
                  Trainer's Room
                </h2>
              </div>

              {/* Colorful Custom Illustration Badge */}
              <div className="my-6 relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  {/* SVG Executive Desk + Lamp + Whiteboard + Key */}
                  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background Certificate on Wall */}
                    <rect x="14" y="10" width="16" height="12" rx="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                    <line x1="18" y1="14" x2="26" y2="14" stroke="#D97706" strokeWidth="1.5" />
                    <circle cx="22" cy="18" r="1.5" fill="#EF4444" />
                    {/* Banker's Lamp */}
                    <path d="M46 14C49 14 51 16 51 18H41C41 16 43 14 46 14Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
                    <path d="M46 18V26M42 26H50" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Executive Desk */}
                    <rect x="8" y="32" width="48" height="6" rx="1.5" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
                    <rect x="12" y="38" width="6" height="16" fill="#9A3412" stroke="#451A03" strokeWidth="1.5" />
                    <rect x="46" y="38" width="6" height="16" fill="#9A3412" stroke="#451A03" strokeWidth="1.5" />
                    {/* Laptop on desk with graph */}
                    <rect x="23" y="22" width="18" height="10" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
                    <line x1="26" y1="28" x2="30" y2="25" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="30" y1="25" x2="34" y2="29" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="34" y1="29" x2="38" y2="24" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Key badge in foreground */}
                    <circle cx="32" cy="46" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                    <path d="M35 46H38M37 44V48" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[240px]">
                Access faculty workstation, whiteboard studio, master keys, and curriculum controls.
              </p>
            </div>

            {/* Bottom Button */}
            <div className="pt-6 flex justify-center">
              <button
                type="button"
                className={`w-full sm:w-auto min-w-[130px] px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5 ${
                  isTrainer
                    ? 'border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                    : 'border-slate-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white bg-white text-slate-800'
                }`}
              >
                {isTrainer ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-100" />
                    <span>Enter Suite</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                    <span>Enter Room</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
