import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';
import { DEFAULT_TRAINER_PASSCODE } from './LoginPage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  candidateName?: string;
}

export const TrainerPasscodeGateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  candidateName,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (!clean) {
      setError('Please enter the Trainer Passcode.');
      return;
    }

    if (clean !== DEFAULT_TRAINER_PASSCODE) {
      setError('Invalid Trainer Passcode. Please request the authorized code from your instructor.');
      return;
    }

    setError('');
    setPasscode('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-600/40 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xs shadow-inner">
              <KeyRound className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Faculty Access Gate
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Trainer's Room
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 mt-2.5 leading-relaxed">
            Students require the authorized faculty security code to inspect the trainer workstation, lecture whiteboard, and curriculum tools.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Trainer Passcode <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter 8-character trainer passcode"
                className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Security Policy Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restricted Faculty Chamber</span>
            </span>
            <p>
              Students do not have direct access keys. If you need consultation or review, please request authorized access directly from your course trainer.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Enter Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
