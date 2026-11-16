import React, { useState } from 'react';
import {
  User,
  Lock,
  KeyRound,
  AlertCircle,
  ChevronDown,
  Cloud,
  Smartphone,
  Loader2,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { StudentProfile, UserRole } from '../types/accounting';
import {
  DEFAULT_STUDENT_PASSWORD,
  DEFAULT_TRAINER_PASSWORD,
  ensureCloudUserProfile,
  formatAuthErrorMessage,
  sendInstitutePasswordReset,
  signInWithGooglePopup,
  signInWithInstituteCredentials,
} from '../services/cloudProgress';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  onLogin: (profile: StudentProfile) => void;
}

// Passcodes exported for compatibility with existing TrainerPasscodeGateModal
export const DEFAULT_STUDENT_PASSCODE = DEFAULT_STUDENT_PASSWORD;
export const DEFAULT_TRAINER_PASSCODE = DEFAULT_TRAINER_PASSWORD;

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [viewMode, setViewMode] = useState<'login' | 'reset'>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const [error, setError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter the institute default password or your personal password.');
      return;
    }

    setError('');
    setIsEmailLoading(true);
    try {
      const { profile } = await signInWithInstituteCredentials({
        email: cleanEmail,
        password,
        fullName: username.trim() || undefined,
        role,
      });
      onLogin(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : formatAuthErrorMessage(err));
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleCloudSignIn = async () => {
    const cleanPass = password.trim();
    if (!cleanPass) {
      setError('Please enter your Student or Trainer institute passcode first.');
      return;
    }
    if (role === 'student' && cleanPass !== DEFAULT_STUDENT_PASSWORD) {
      setError('Invalid student passcode.');
      return;
    }
    if (role === 'trainer' && cleanPass !== DEFAULT_TRAINER_PASSWORD) {
      setError('Invalid trainer passcode.');
      return;
    }

    setError('');
    setIsGoogleLoading(true);
    try {
      const firebaseUser = await signInWithGooglePopup();
      const cloudProfile = await ensureCloudUserProfile(
        firebaseUser,
        username.trim() || undefined,
        role
      );
      onLogin(cloudProfile);
    } catch (err) {
      setError(formatAuthErrorMessage(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleOfflineLocalLogin = () => {
    const cleanPass = password.trim();
    if (!username.trim()) {
      setError('Please enter your name for offline device-only practice.');
      return;
    }
    if (!cleanPass) {
      setError('Please enter the institution passcode.');
      return;
    }
    if (role === 'student' && cleanPass !== DEFAULT_STUDENT_PASSWORD) {
      setError('Invalid student passcode.');
      return;
    }
    if (role === 'trainer' && cleanPass !== DEFAULT_TRAINER_PASSWORD) {
      setError('Invalid trainer passcode.');
      return;
    }

    setError('');
    onLogin({
      name: username.trim(),
      role,
      authMode: 'local',
      institution: 'Arthabiz | Sikshyatech Hub',
      registeredAt: new Date().toISOString(),
    });
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');
    setIsResetLoading(true);
    try {
      await sendInstitutePasswordReset(resetEmail);
      setResetSuccess(
        `Password reset link sent to ${resetEmail.trim().toLowerCase()}. Check your inbox (and spam folder), set your new password, then return here to sign in.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : formatAuthErrorMessage(err));
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Banner */}
        <div className="bg-slate-900 text-white p-6 text-center relative border-b-4 border-blue-600">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl mb-3 shadow-md">
            AS
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Arthabiz <span className="text-blue-400 font-light">|</span> Sikshyatech Hub
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-200 mt-1">
            Institute Practice &amp; Training Portal
          </p>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2 flex-wrap">
            <span>15 Days • 50 Transactions/Day</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
              <Cloud className="w-3 h-3" /> Cloud Sync
            </span>
          </div>
        </div>

        {viewMode === 'reset' ? (
          <form onSubmit={handleSendResetEmail} className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Reset Your Password
              </h2>
              <button
                type="button"
                onClick={() => {
                  setViewMode('login');
                  setError('');
                  setResetSuccess('');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered email address below. We will send you a secure link to set a new personal password.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isResetLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span>{isResetLoading ? 'Sending Reset Link...' : 'Send Password Reset Email'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailPasswordLogin} className="p-6 sm:p-7 space-y-3.5">
            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value as UserRole);
                    setError('');
                  }}
                  className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none cursor-pointer transition"
                >
                  <option value="student">Student</option>
                  <option value="trainer">Trainer</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name{' '}
                <span className="text-slate-400 font-normal normal-case">
                  (First-time / Offline)
                </span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Aarav Shrestha"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setError('');
                    setResetSuccess('');
                    setViewMode('reset');
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Forgot / Reset Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Default password or your personal password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                First time? Sign in with your institute default password, then update it anytime from the top bar.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Primary Login Button */}
            <div className="pt-1 space-y-2">
              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isEmailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>
                  {isEmailLoading ? 'Signing In...' : 'Sign In with Email & Password'}
                </span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Or Other Options
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleGoogleCloudSignIn}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                      />
                    </svg>
                  )}
                  <span>Google Sign-In</span>
                </button>

                <button
                  type="button"
                  onClick={handleOfflineLocalLogin}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Offline Practice</span>
                </button>
              </div>
            </div>

            {/* Android App Install Section */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold flex items-center gap-1.5 text-slate-700">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  Android &amp; Mobile App
                </span>
                <span>Install on home screen</span>
              </div>
              <PWAInstallButton variant="banner" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
