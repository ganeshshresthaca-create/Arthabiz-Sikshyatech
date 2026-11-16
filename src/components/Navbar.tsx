import React, { useState } from 'react';
import { StudentProfile, ViewTab, AppSection } from '../types/accounting';
import { DAY_CONFIGS } from '../data/modulesData';
import {
  BookOpen,
  Calendar,
  BookMarked,
  FileSpreadsheet,
  UserCheck,
  Lock,
  Unlock,
  ChevronDown,
  LogOut,
  LayoutGrid,
  Search,
  GraduationCap,
  BrainCircuit,
  Target,
  ArrowLeft,
  ShieldCheck,
  Cloud,
  HardDrive,
  Home,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  currentDay: number;
  onSelectDay: (day: number) => void;
  unlockedDays: Record<number, boolean>;
  studentProfile: StudentProfile | null;
  onOpenTrainerKeys?: () => void;
  onOpenAccountModal?: () => void;
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  isDaySubmitted: boolean;
  onLogout: () => void;
  showCatalogView: boolean;
  onToggleCatalogView: (show: boolean) => void;
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  onRequestUnlock?: (day: number) => void;
}

export const Navbar: React.FC<Props> = ({
  currentDay,
  onSelectDay,
  unlockedDays,
  studentProfile,
  onOpenAccountModal,
  activeTab,
  onSelectTab,
  isDaySubmitted,
  onLogout,
  showCatalogView,
  onToggleCatalogView,
  currentSection,
  onSelectSection,
  onRequestUnlock,
}) => {
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const currentCfg = DAY_CONFIGS.find((d) => d.dayNum === currentDay) || DAY_CONFIGS[0];
  const isCloudSynced = Boolean(studentProfile?.uid && studentProfile?.authMode !== 'local');

  const displayName = studentProfile?.name || 'Candidate';
  const nameParts = displayName.trim().split(' ');
  const formattedShortName =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
      : nameParts[0];

  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
      : displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
            {/* Left: Open Book Brand Logo & Back Button */}
            <div className="flex items-center gap-2 min-w-0">
              {currentSection !== 'path_selector' && (
                <button
                  type="button"
                  onClick={() => onSelectSection('path_selector')}
                  className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
                  title="Back to dashboard"
                  aria-label="Back to dashboard"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onSelectSection('path_selector')}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden min-w-0"
                title="Return to Study Path Chooser"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-600 transition shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M6 2v20" />
                  </svg>
                </div>
                <div className="truncate">
                  <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                    Arthabiz
                  </span>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-400 ml-1.5 border-l border-slate-200 pl-1.5">
                    Sikshyatech Hub
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop Section Switcher */}
            {currentSection !== 'path_selector' && (
              <nav className="hidden md:flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
                <button
                  type="button"
                  onClick={() => onSelectSection('path_selector')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition"
                >
                  Paths
                </button>
                <span className="text-slate-300 mx-1">•</span>
                <button
                  type="button"
                  onClick={() => onSelectSection('study_library')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    currentSection === 'study_library'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Study Library</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSection('memory_lab')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    currentSection === 'memory_lab'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Memory Lab</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSection('test_arena')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    currentSection === 'test_arena'
                      ? 'bg-purple-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Test Arena</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSection('trainers_room')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    currentSection === 'trainers_room'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trainer&apos;s Room</span>
                </button>
              </nav>
            )}

            {/* Right: Install App, Cloud Sync Status, Account/Password, Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <PWAInstallButton variant="navbar" />

              <button
                type="button"
                onClick={() => onSelectSection('study_library')}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition hidden lg:inline-flex"
                title="Search accounting resources & rules"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Sync Badge */}
              <div
                className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${
                  isCloudSynced
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={
                  isCloudSynced
                    ? 'Records synced online to your cloud account'
                    : 'Records saved on this device only'
                }
              >
                {isCloudSynced ? (
                  <>
                    <Cloud className="w-3 h-3 text-emerald-600" />
                    <span>Cloud Sync</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3 h-3 text-slate-500" />
                    <span>Local</span>
                  </>
                )}
              </div>

              {/* User Avatar + Name (click to open Password / Account Modal) */}
              <button
                type="button"
                onClick={onOpenAccountModal}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 border-l border-slate-200 hover:bg-slate-100 rounded-r-lg transition cursor-pointer relative"
                title="Account &amp; Password Settings"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-white shrink-0">
                  {initials}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:inline-block max-w-[110px] truncate">
                  {formattedShortName}
                </span>
                {studentProfile?.usedDefaultPassword && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white"
                    title="Using default password — click to change"
                  />
                )}
              </button>

              {/* Logout Icon Button */}
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Log out session"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navbar inside Test Arena */}
        {currentSection === 'test_arena' && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between py-2 gap-2.5">
              {/* Day Selector dropdown */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectSection('path_selector')}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition hidden md:flex items-center gap-1 text-xs font-semibold mr-1"
                  title="Return to Study Path Chooser"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Paths</span>
                </button>

                <div className="relative flex-1 md:flex-initial">
                  <button
                    onClick={() => setDayDropdownOpen(!dayDropdownOpen)}
                    className="w-full md:w-auto inline-flex items-center justify-between gap-2.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="shrink-0">Day {currentDay}/15:</span>
                      <span className="font-normal text-slate-600 max-w-[140px] sm:max-w-xs truncate">
                        {currentCfg.title.split(':')[1] || currentCfg.title}
                      </span>
                      {unlockedDays[currentDay] ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-1 shrink-0">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>

                  {dayDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setDayDropdownOpen(false)}
                      />
                      <div className="absolute left-0 mt-1 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-40 max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
                        <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          15 Days Practice Curriculum (50 Qs / Day)
                        </div>
                        <div className="pt-1 space-y-1">
                          {DAY_CONFIGS.map((day) => {
                            const isUnlocked = unlockedDays[day.dayNum];
                            const isCurrent = day.dayNum === currentDay;
                            return (
                              <button
                                key={day.dayNum}
                                onClick={() => {
                                  onSelectDay(day.dayNum);
                                  setDayDropdownOpen(false);
                                }}
                                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                                  isCurrent
                                    ? 'bg-blue-50 text-blue-900 font-semibold'
                                    : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold">Day {day.dayNum}</span>
                                    <span className="text-[11px] text-slate-500 truncate">
                                      {day.title.split(':')[1]}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    50 MCQ Transactions • {day.baseCategory}
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  {isUnlocked ? (
                                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Navigation Mode Tabs within Test Arena */}
              <div className="flex items-center overflow-x-auto gap-1.5 pb-0.5 md:pb-0">
                <button
                  onClick={() => onToggleCatalogView(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    showCatalogView
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  All 15 Days
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!unlockedDays[currentDay]) {
                      if (onRequestUnlock) {
                        onRequestUnlock(currentDay);
                      } else {
                        onSelectDay(currentDay);
                      }
                      return;
                    }
                    onToggleCatalogView(false);
                    onSelectTab('practice');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                    !showCatalogView && activeTab === 'practice'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : !unlockedDays[currentDay]
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {!unlockedDays[currentDay] ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Practice Arena</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Practice Arena</span>
                    </>
                  )}
                </button>

                {isDaySubmitted ? (
                  <button
                    onClick={() => {
                      onToggleCatalogView(false);
                      onSelectTab('results');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      !showCatalogView && activeTab === 'results'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Result Analytics</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-75 whitespace-nowrap shrink-0"
                    title={`Submit Day ${currentDay} practice assessment first to unlock Result Analytics`}
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Results</span>
                  </button>
                )}

                {isDaySubmitted ? (
                  <button
                    onClick={() => {
                      onToggleCatalogView(false);
                      onSelectTab('journal');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      !showCatalogView && activeTab === 'journal'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>Journal Solution</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-75 whitespace-nowrap shrink-0"
                    title={`Submit Day ${currentDay} practice assessment first to unlock Journal Entries Solution`}
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Journal</span>
                  </button>
                )}

                {isDaySubmitted ? (
                  <button
                    onClick={() => {
                      onToggleCatalogView(false);
                      onSelectTab('daybook');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      !showCatalogView && activeTab === 'daybook'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Day Book</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-75 whitespace-nowrap shrink-0"
                    title={`Submit Day ${currentDay} practice assessment first to unlock Day Book`}
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Day Book</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Android / Mobile Bottom App Navigation Bar */}
      <nav
        aria-label="Mobile app navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] print:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-5 h-16">
          <button
            type="button"
            onClick={() => onSelectSection('path_selector')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              currentSection === 'path_selector'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('study_library')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              currentSection === 'study_library'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Library</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('memory_lab')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              currentSection === 'memory_lab'
                ? 'text-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span>Memory</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('test_arena')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              currentSection === 'test_arena'
                ? 'text-purple-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Tests</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('trainers_room')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              currentSection === 'trainers_room'
                ? 'text-emerald-700'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Trainer</span>
          </button>
        </div>
      </nav>
    </>
  );
};
