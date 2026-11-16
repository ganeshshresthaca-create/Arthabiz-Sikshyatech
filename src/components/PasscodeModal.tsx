import React, { useState } from 'react';
import { KeyRound, Lock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { DayModule } from '../types/accounting';

interface Props {
  isOpen: boolean;
  dayModule: DayModule;
  onUnlock: (dayNum: number) => void;
  onClose: () => void;
  isTrainer?: boolean;
}

export const PasscodeModal: React.FC<Props> = ({
  isOpen,
  dayModule,
  onUnlock,
  onClose,
  isTrainer = false,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showTrainerHelp, setShowTrainerHelp] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === dayModule.passcode) {
      setError('');
      onUnlock(dayModule.dayNumber);
      onClose();
    } else {
      setError('Invalid 5-digit passcode. Please consult your trainer or enter the correct module key.');
    }
  };

  const handleQuickFill = () => {
    setPasscode(dayModule.passcode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-3 border border-amber-200">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Passcode Protected Module
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Unlock Day {dayModule.dayNumber}
          </h2>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {dayModule.title}
          </p>
          <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-left">
            <span className="font-semibold text-slate-700">Trainer Verification:</span> Each day's 50-question practice is restricted to enrolled candidates. Enter the 5-digit key issued by your instructor. Once entered, this day will remain unlocked for future revisions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Enter 5-Digit Module Key
            </label>
            <div className="relative flex justify-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                value={passcode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPasscode(val);
                  if (error) setError('');
                }}
                placeholder="• • • • •"
                className="w-48 text-center text-2xl font-mono tracking-widest py-2.5 px-4 bg-slate-50 border-2 border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white transition"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 mt-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passcode.length !== 5}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow transition flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Unlock Day {dayModule.dayNumber}
            </button>
          </div>
        </form>

        {/* Trainer / Demonstration Key helper - Only visible if logged in as Trainer */}
        {isTrainer ? (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowTrainerHelp(!showTrainerHelp)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                Trainer Key Reference & Quick-Fill
              </span>
              <span className="text-[11px] underline">
                {showTrainerHelp ? 'Hide' : 'Show Key'}
              </span>
            </button>

            {showTrainerHelp && (
              <div className="mt-2.5 p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium">
                    Official Key for Day {dayModule.dayNumber}:
                  </span>
                  <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 text-sm">
                    {dayModule.passcode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trainers can issue this code to students. Click below to auto-fill for testing:
                </p>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="w-full py-1.5 text-xs font-medium text-blue-700 bg-white hover:bg-blue-100/60 border border-blue-200 rounded transition"
                >
                  Auto-fill Code ({dayModule.passcode})
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need today's passcode? Please request the 5-digit daily key from your course trainer during the scheduled session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

