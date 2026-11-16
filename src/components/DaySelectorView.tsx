import React from 'react';
import { DayModule, DayProgress, StudentProfile } from '../types/accounting';
import { Lock, Unlock, ArrowRight, Download, KeyRound } from 'lucide-react';

interface Props {
  modules: DayModule[];
  allProgress: Record<number, DayProgress>;
  currentDay: number;
  onSelectDay: (dayNum: number) => void;
  onRequestUnlock: (dayModule: DayModule) => void;
  onOpenTrainerKeys: () => void;
  studentProfile: StudentProfile | null;
  onDownloadQuestionPaper?: (dayModule: DayModule) => void;
  onOpenTrainersRoom?: () => void;
}

export const DaySelectorView: React.FC<Props> = ({
  modules,
  allProgress,
  currentDay,
  onSelectDay,
  onRequestUnlock,
  onOpenTrainerKeys,
  studentProfile,
  onDownloadQuestionPaper,
  onOpenTrainersRoom,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 5-Column Grid exactly matching the mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {modules.map((m) => {
          const prog = allProgress[m.dayNumber] || { unlocked: false, submitted: false };
          const isUnlocked = !!prog.unlocked;

          return (
            <div
              key={m.dayNumber}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                {/* Top Row: Day Badge & Padlock Icon */}
                <div className="flex items-center justify-between">
                  {isUnlocked ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#dcfce7] text-[#16a34a]">
                      Day {m.dayNumber}
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#f1f5f9] text-[#64748b]">
                      Day {m.dayNumber}
                    </span>
                  )}

                  <div className="flex items-center">
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-[#16a34a]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#94a3b8]" />
                    )}
                  </div>
                </div>

                {/* Card Title */}
                <h3 className="font-bold text-[#1e293b] text-[15px] sm:text-base leading-snug tracking-tight mt-3">
                  {m.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-[#94a3b8] mt-1.5 font-normal">
                  50 Practical MCQ Transactions
                </p>
              </div>

              {/* Bottom Row: Passcode Status & Action Button */}
              <div className="mt-6 pt-2 flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[11px] text-[#94a3b8] font-medium leading-none">
                    Passcode:
                  </div>
                  <div className="text-xs font-medium text-[#64748b] mt-1 leading-none">
                    {isUnlocked ? 'Unlocked' : 'Required'}
                  </div>
                </div>

                {isUnlocked ? (
                  <div className="flex items-center gap-1.5">
                    {onDownloadQuestionPaper && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadQuestionPaper(m);
                        }}
                        className="p-2 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-lg transition"
                        title={`Download Day ${m.dayNumber} Question Paper for manual practice`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectDay(m.dayNumber)}
                      className="bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white font-medium text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
                    >
                      <span>Start Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRequestUnlock(m)}
                    className="bg-[#242e42] hover:bg-[#1a2232] active:bg-[#111827] text-white font-medium text-xs py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <span>Unlock Day</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
