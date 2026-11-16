import React from 'react';
import { KeyRound, Check, Copy, X, Unlock, ShieldAlert } from 'lucide-react';
import { DAY_CONFIGS } from '../data/modulesData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAll?: () => void;
  onUnlockSpecific?: (dayNum: number) => void;
  unlockedDays: Record<number, boolean>;
}

export const TrainerKeyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUnlockAll,
  onUnlockSpecific,
  unlockedDays,
}) => {
  const [copiedDay, setCopiedDay] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, day: number) => {
    navigator.clipboard.writeText(code);
    setCopiedDay(day);
    setTimeout(() => setCopiedDay(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <KeyRound className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Trainer Master Key Directory
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official 5-digit daily security codes for Arthabiz | Sikshyatech Hub 15-day accounting curriculum.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Trainers give these codes each day to authorize student access and keep offline revision unlocked.
            </span>
          </div>
          {onUnlockAll && (
            <button
              onClick={() => {
                onUnlockAll();
                onClose();
              }}
              className="shrink-0 ml-3 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md shadow-xs transition flex items-center gap-1.5 text-xs"
            >
              <Unlock className="w-3.5 h-3.5" />
              Unlock All 15 Days
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DAY_CONFIGS.map((cfg) => {
              const isUnlocked = unlockedDays[cfg.dayNum];
              return (
                <div
                  key={cfg.dayNum}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition ${
                    isUnlocked
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        Day {cfg.dayNum}
                      </span>
                      {isUnlocked && (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5" title={cfg.title}>
                      {cfg.title.split(':')[1] || cfg.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-sm bg-white px-2 py-1 rounded border border-slate-300 text-blue-700 shadow-xs">
                      {cfg.passcode}
                    </span>
                    <button
                      onClick={() => handleCopy(cfg.passcode, cfg.dayNum)}
                      title="Copy Passcode"
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-600 transition"
                    >
                      {copiedDay === cfg.dayNum ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {!isUnlocked && onUnlockSpecific && (
                      <button
                        onClick={() => onUnlockSpecific(cfg.dayNum)}
                        title="Unlock Day"
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium rounded text-[11px] transition"
                      >
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 mt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
