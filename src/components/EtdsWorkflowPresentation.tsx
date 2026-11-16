import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowDown,
  Layout,
  Image as ImageIcon
} from 'lucide-react';
import { NepalEmblem } from './NepalEmblem';

interface Props {
  onOpenPortal?: () => void;
}

export const EtdsWorkflowPresentation: React.FC<Props> = () => {
  const [viewMode, setViewMode] = useState<'image' | 'interactive'>('image');

  return (
    <div className="w-full bg-gradient-to-b from-[#EFF6FB] via-[#F8FBFE] to-[#F1F8FA] border-2 border-[#1E3A8A]/30 rounded-3xl p-4 sm:p-7 lg:p-8 shadow-md relative overflow-hidden font-sans">
      {/* Top Right Decorative Organic Teal Wave Shape */}
      <div className="absolute -top-10 -right-10 w-72 h-44 pointer-events-none opacity-85">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M50 0C90 40 120 20 160 50C190 70 210 110 200 120H0V0H50Z"
            fill="url(#tealWaveGrad)"
            opacity="0.25"
          />
          <path
            d="M90 0C130 25 150 15 180 35C200 50 210 80 200 120H200V0H90Z"
            fill="url(#tealWaveGrad2)"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="tealWaveGrad" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0D9488" />
              <stop offset="1" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="tealWaveGrad2" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#047857" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ======================================================================= */}
      {/* PRESENTATION HEADER: NEPAL COAT OF ARMS & OFFICIAL TITLE */}
      {/* ======================================================================= */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-[#BCD4EC]">
        <div className="flex items-center gap-3.5 sm:gap-5">
          {/* Official Nepal National Emblem (नेपालको निशान छाप) */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 filter drop-shadow-sm flex items-center justify-center">
            <NepalEmblem className="w-full h-full" />
          </div>

          {/* Main Title */}
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#19456B] tracking-tight leading-tight">
              Step-by-Step E-TDS Filing & Deposit Process
            </h1>
          </div>
        </div>

        {/* View Switcher: Fitted Infographic Image vs. Interactive Breakdown */}
        <div className="flex items-center bg-white/90 p-1 rounded-xl border border-[#BCD4EC] shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'image'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Fitted Infographic</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Interactive Cards</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* VIEW 1: FITTED INFOGRAPHIC PRESENTATION IMAGE */}
      {/* ======================================================================= */}
      {viewMode === 'image' && (
        <div className="relative z-10 pt-5 space-y-3 animate-fadeIn">
          <div className="w-full overflow-hidden rounded-2xl border-2 border-[#1E3A8A]/20 bg-white shadow-sm p-2 sm:p-4 flex items-center justify-center">
            <img
              src="/src/assets/images/etds_process_infographic_1790913159485.jpg"
              alt="Step-by-Step E-TDS Filing & Deposit Process (Inland Revenue Department)"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl block mx-auto shadow-2xs"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* VIEW 2: 5-COLUMN INTERACTIVE WORKFLOW BREAKDOWN */}
      {/* ======================================================================= */}
      {viewMode === 'interactive' && (
        <div className="relative z-10 pt-6 sm:pt-7 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-3.5 items-stretch relative">

            {/* ------------------------------------------------------------------- */}
            {/* STEP 1: TDS Deduction at Source (कर कट्टी) */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border-2 border-[#1E3A8A] flex flex-col justify-between p-3.5 sm:p-4 shadow-sm relative hover:shadow-md transition-all">
              <div className="space-y-3.5">
                <div className="bg-[#E2EDF8] text-[#0F2942] font-black text-xs sm:text-[13px] text-center py-2 px-2 rounded-xl border border-[#BCD4EC] leading-tight">
                  1. TDS Deduction at Source (कर कट्टी)
                </div>

                <div className="h-32 sm:h-36 bg-[#F8FAFD] rounded-xl border border-slate-200/80 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-32">
                    <rect x="70" y="8" width="45" height="58" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
                    <line x1="77" y1="18" x2="105" y2="18" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                    <line x1="77" y1="26" x2="102" y2="26" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="77" y1="33" x2="105" y2="33" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="77" y1="40" x2="98" y2="40" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="92" y="20" width="48" height="60" rx="3" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
                    <line x1="100" y1="30" x2="130" y2="30" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="100" y1="38" x2="128" y2="38" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="100" y1="45" x2="132" y2="45" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="122" cy="62" r="7" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 1" fill="#FEE2E2" />
                    <text x="122" y="64" fontSize="5" fill="#DC2626" fontWeight="bold" textAnchor="middle">PAID</text>

                    <g transform="translate(10, 20)">
                      <g transform="rotate(-6 55 40)">
                        <rect x="30" y="24" width="48" height="24" rx="2" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
                        <circle cx="54" cy="36" r="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
                        <text x="54" y="38" fontSize="7" fill="#15803D" fontWeight="bold" textAnchor="middle">रू.</text>
                      </g>
                      <g transform="rotate(3 55 40)">
                        <rect x="32" y="22" width="48" height="24" rx="2" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" />
                        <circle cx="56" cy="34" r="6.5" fill="#DCFCE7" stroke="#15803D" strokeWidth="1" />
                        <text x="56" y="37" fontSize="8" fill="#14532D" fontWeight="bold" textAnchor="middle">Rs</text>
                      </g>
                      <path
                        d="M10 48C18 48 24 44 32 40L48 42C52 42 56 46 54 50C50 54 44 55 36 56L22 62H10V48Z"
                        fill="#FDBA74"
                        stroke="#C2410C"
                        strokeWidth="1.5"
                      />
                      <rect x="0" y="44" width="12" height="18" rx="1" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="1.5" />
                    </g>

                    <circle cx="85" cy="22" r="7" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                    <text x="85" y="24.5" fontSize="6" fill="#854D0E" fontWeight="black" textAnchor="middle">Rs</text>

                    <circle cx="70" cy="38" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2" />
                    <text x="70" y="40.5" fontSize="6" fill="#854D0E" fontWeight="black" textAnchor="middle">%</text>

                    <g transform="translate(108, 62) scale(0.9)">
                      <rect x="0" y="0" width="30" height="42" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                      <rect x="4" y="5" width="22" height="9" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <text x="23" y="12" fontSize="6" fill="#0F172A" fontFamily="monospace" fontWeight="bold" textAnchor="end">1.5%</text>
                      <circle cx="8" cy="19" r="2.2" fill="#64748B" />
                      <circle cx="15" cy="19" r="2.2" fill="#64748B" />
                      <circle cx="22" cy="19" r="2.2" fill="#64748B" />
                      <circle cx="8" cy="26" r="2.2" fill="#64748B" />
                      <circle cx="15" cy="26" r="2.2" fill="#64748B" />
                      <circle cx="22" cy="26" r="2.2" fill="#64748B" />
                      <circle cx="8" cy="33" r="2.2" fill="#F59E0B" />
                      <circle cx="15" cy="33" r="2.2" fill="#3B82F6" />
                      <circle cx="22" cy="33" r="2.2" fill="#10B981" />
                    </g>
                  </svg>
                </div>

                <p className="text-xs sm:text-[12px] text-slate-700 leading-relaxed text-center font-medium">
                  When passing vendor invoices or paying salary salary/rent, deduct applicable TDS{' '}
                  <strong className="text-slate-950 font-bold">(1.5%, 10%, 15%)</strong> as per the Income Tax Act.
                </p>

                <div className="bg-[#EBF4FA] border border-[#8FBEE1] text-[#0E3B64] font-bold text-center py-1.5 px-2.5 rounded-full text-[11px] shadow-2xs">
                  Credit the TDS Payable account.
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 shadow-2xs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <circle cx="8" cy="11" r="1" fill="currentColor" />
                    <circle cx="12" cy="11" r="1" fill="currentColor" />
                    <circle cx="16" cy="11" r="1" fill="currentColor" />
                    <circle cx="8" cy="15" r="1" fill="currentColor" />
                    <circle cx="12" cy="15" r="1" fill="currentColor" />
                    <circle cx="16" cy="15" r="1" fill="currentColor" />
                    <circle cx="8" cy="18" r="1" fill="currentColor" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                    <circle cx="16" cy="18" r="1" fill="currentColor" />
                  </svg>
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center font-black text-amber-700 text-sm shadow-2xs">
                  %
                </div>
              </div>

              <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#1E3A8A] text-white items-center justify-center shadow-md">
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="md:hidden flex justify-center py-2 text-[#1E3A8A]">
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* STEP 2: Voucher Creation on IRD Portal */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border-2 border-[#1E3A8A] flex flex-col justify-between p-3.5 sm:p-4 shadow-sm relative hover:shadow-md transition-all">
              <div className="space-y-3.5">
                <div className="bg-[#E2EDF8] text-[#0F2942] font-black text-xs sm:text-[13px] text-center py-2 px-2 rounded-xl border border-[#BCD4EC] leading-tight">
                  2. Voucher Creation on IRD Portal
                </div>

                <div className="flex justify-center">
                  <span className="bg-white border border-[#94BEE0] text-[#0F3860] px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-bold shadow-2xs tracking-tight">
                    taxpayerportal.ird.gov.np
                  </span>
                </div>

                <div className="h-32 sm:h-36 bg-[#F8FAFD] rounded-xl border border-slate-200/80 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-32">
                    <rect x="52" y="10" width="88" height="60" rx="3" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
                    <rect x="55" y="13" width="82" height="54" rx="2" fill="#FFFFFF" />
                    <rect x="55" y="13" width="82" height="9" fill="#1E40AF" />
                    <circle cx="61" cy="17.5" r="2.5" fill="#EF4444" />
                    <text x="68" y="19" fontSize="4.5" fill="#FFFFFF" fontWeight="bold">E-TDS Portal</text>
                    <rect x="60" y="27" width="34" height="4" rx="1" fill="#E2E8F0" />
                    <rect x="60" y="34" width="46" height="4" rx="1" fill="#E2E8F0" />
                    <rect x="60" y="41" width="30" height="4" rx="1" fill="#E2E8F0" />
                    <rect x="60" y="48" width="50" height="4" rx="1" fill="#E2E8F0" />
                    <rect x="60" y="55" width="22" height="6" rx="1.5" fill="#2563EB" />
                    <text x="71" y="59.5" fontSize="3.5" fill="#FFFFFF" fontWeight="bold" textAnchor="middle">Submit</text>
                    <rect x="114" y="26" width="20" height="32" rx="1.5" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.8" />
                    <line x1="117" y1="32" x2="131" y2="32" stroke="#22C55E" strokeWidth="1" />
                    <line x1="117" y1="37" x2="129" y2="37" stroke="#22C55E" strokeWidth="1" />
                    <line x1="117" y1="42" x2="131" y2="42" stroke="#22C55E" strokeWidth="1" />
                    <path d="M91 70H101V78H91V70Z" fill="#334155" />
                    <path d="M84 78H108V81H84V78Z" fill="#1E293B" rx="1.5" />

                    <g transform="translate(18, 38)">
                      <circle cx="28" cy="12" r="10" fill="#FDBA74" stroke="#C2410C" strokeWidth="1" />
                      <path d="M19 10C19 4 23 2 28 2C33 2 37 4 37 10C35 8 33 6 28 6C23 6 21 8 19 10Z" fill="#1E293B" />
                      <path
                        d="M10 32C10 24 16 20 28 20C40 20 46 24 46 32L44 48H12L10 32Z"
                        fill="#2563EB"
                        stroke="#1D4ED8"
                        strokeWidth="1.2"
                      />
                      <path d="M12 32L26 44L34 42L44 32" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="28" cy="44" r="2.5" fill="#FDBA74" />
                      <circle cx="34" cy="42" r="2.5" fill="#FDBA74" />
                      <rect x="22" y="44" width="22" height="4" rx="1" fill="#475569" />
                    </g>
                  </svg>
                </div>

                <div className="space-y-2 text-center text-xs sm:text-[12px] text-slate-700 leading-relaxed font-medium">
                  <p>
                    Log in to <strong className="text-blue-800 font-bold">taxpayerportal.ird.gov.np</strong>.
                  </p>
                  <p className="pt-0.5">
                    Under E-TDS, select <strong className="text-slate-900 font-bold">E-TDS, Transaction Voucher</strong> and input details.
                  </p>
                </div>
              </div>

              <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#1E3A8A] text-white items-center justify-center shadow-md">
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="md:hidden flex justify-center py-2 text-[#1E3A8A]">
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* STEP 3: Bank Deposit (२५ गतेभित्र दाखिला) */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border-2 border-[#1E3A8A] flex flex-col justify-between p-3.5 sm:p-4 shadow-sm relative hover:shadow-md transition-all">
              <div className="space-y-3.5">
                <div className="bg-[#E2EDF8] text-[#0F2942] font-black text-xs sm:text-[13px] text-center py-2 px-2 rounded-xl border border-[#BCD4EC] leading-tight">
                  3. Bank Deposit (२५ गतेभित्र दाखिला)
                </div>

                <div className="h-32 sm:h-36 bg-[#F8FAFD] rounded-xl border border-slate-200/80 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-32">
                    <g transform="translate(10, 8)">
                      <path d="M35 6L8 20H62L35 6Z" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
                      <rect x="18" y="13" width="34" height="5" rx="0.5" fill="#E2E8F0" />
                      <text x="35" y="16.8" fontSize="3.8" fill="#1E293B" fontWeight="bold" textAnchor="middle">Commercial Bank</text>
                      <rect x="10" y="20" width="50" height="4" fill="#64748B" />
                      <rect x="14" y="24" width="6" height="24" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <rect x="26" y="24" width="6" height="24" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <rect x="38" y="24" width="6" height="24" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <rect x="50" y="24" width="6" height="24" rx="1" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <rect x="8" y="48" width="54" height="4" fill="#64748B" />
                      <rect x="6" y="52" width="58" height="4" fill="#334155" />
                    </g>

                    <g transform="translate(80, 6)">
                      <path d="M48 20C40 20 34 22 28 26L16 24C12 24 10 27 12 30C14 34 20 34 26 33L36 30H48V20Z" fill="#FDBA74" stroke="#C2410C" strokeWidth="1.2" />
                      <rect x="12" y="32" width="34" height="18" rx="2" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
                      <circle cx="29" cy="41" r="5" fill="#BBF7D0" stroke="#15803D" strokeWidth="0.8" />
                      <text x="29" y="43" fontSize="6" fill="#14532D" fontWeight="bold" textAnchor="middle">$</text>
                    </g>

                    <g transform="translate(18, 54)">
                      <rect x="0" y="0" width="124" height="48" rx="3" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" />
                      <rect x="0" y="0" width="124" height="11" rx="2" fill="#E0F2FE" />
                      <text x="8" y="8" fontSize="5.5" fill="#0369A1" fontWeight="bold">Voucher No.</text>
                      <text x="76" y="6" fontSize="4.5" fill="#0369A1" fontWeight="bold">Voucher Details / Head</text>
                      <text x="76" y="10" fontSize="4" fill="#0284C7" fontWeight="medium">(e.g. 11111, 11115)</text>
                      <line x1="8" y1="18" x2="116" y2="18" stroke="#BAE6FD" strokeWidth="1" />
                      <line x1="8" y1="26" x2="116" y2="26" stroke="#E2E8F0" strokeWidth="1" />
                      <line x1="8" y1="34" x2="116" y2="34" stroke="#E2E8F0" strokeWidth="1" />
                      <line x1="8" y1="42" x2="116" y2="42" stroke="#BAE6FD" strokeWidth="1" />
                      <line x1="38" y1="11" x2="38" y2="48" stroke="#BAE6FD" strokeWidth="1" />
                      <line x1="82" y1="11" x2="82" y2="48" stroke="#BAE6FD" strokeWidth="1" />
                      <text x="12" y="30" fontSize="4.5" fill="#64748B">Revenue Code</text>
                      <text x="44" y="30" fontSize="4.5" fill="#0F172A" fontWeight="bold">11131 / 11112</text>
                      <text x="88" y="30" fontSize="4.5" fill="#15803D" fontWeight="bold">Verified Slip</text>
                    </g>
                  </svg>
                </div>

                <p className="text-xs sm:text-[12px] text-slate-700 leading-relaxed text-center font-medium">
                  Deposit the withheld amount using the generated <strong className="text-slate-900 font-bold">Voucher No. & Revenue Code</strong> before the{' '}
                  <strong className="text-rose-700 font-bold">25th</strong>.
                </p>

                <div className="flex justify-center pt-1">
                  <div className="w-16 h-16 rounded-xl border-2 border-slate-800 bg-white shadow-xs overflow-hidden flex flex-col items-center">
                    <div className="w-full bg-[#E11D48] h-4 flex items-center justify-around px-2 relative">
                      <div className="w-1.5 h-2.5 bg-slate-900 rounded-full -top-1 relative" />
                      <div className="w-1.5 h-2.5 bg-slate-900 rounded-full -top-1 relative" />
                    </div>
                    <div className="flex-1 flex items-center justify-center font-black text-2xl text-slate-900 tracking-tight font-sans">
                      25
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#1E3A8A] text-white items-center justify-center shadow-md">
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="md:hidden flex justify-center py-2 text-[#1E3A8A]">
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* STEP 4: E-TDS Return Submission */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border-2 border-[#1E3A8A] flex flex-col justify-between p-3.5 sm:p-4 shadow-sm relative hover:shadow-md transition-all">
              <div className="space-y-3.5">
                <div className="bg-[#E2EDF8] text-[#0F2942] font-black text-xs sm:text-[13px] text-center py-2 px-2 rounded-xl border border-[#BCD4EC] leading-tight">
                  4. E-TDS Return Submission
                </div>

                <div className="h-32 sm:h-36 bg-[#F8FAFD] rounded-xl border border-slate-200/80 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-32">
                    <rect x="28" y="16" width="104" height="66" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                    <rect x="32" y="20" width="96" height="58" rx="2" fill="#FFFFFF" />
                    <rect x="32" y="20" width="96" height="9" fill="#1E3A8A" />
                    <circle cx="38" cy="24.5" r="2.5" fill="#EF4444" />
                    <text x="44" y="26" fontSize="4.5" fill="#FFFFFF" fontWeight="bold">IRD E-TDS Final Return</text>
                    <rect x="38" y="33" width="40" height="3" rx="1" fill="#E2E8F0" />
                    <rect x="38" y="38" width="56" height="3" rx="1" fill="#E2E8F0" />
                    <rect x="38" y="43" width="48" height="3" rx="1" fill="#E2E8F0" />
                    <g transform="translate(62, 52)">
                      <rect x="0" y="0" width="36" height="14" rx="4" fill="#15803D" stroke="#166534" strokeWidth="1" />
                      <text x="18" y="9.5" fontSize="6.5" fill="#FFFFFF" fontWeight="black" textAnchor="middle" letterSpacing="0.5">
                        SUBMIT
                      </text>
                    </g>
                    <g transform="translate(112, 10)">
                      <circle cx="12" cy="12" r="11" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
                      <path d="M7 12L10.5 15.5L17 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <path d="M16 82L24 88H136L144 82H16Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                    <rect x="66" y="83" width="28" height="3" rx="1" fill="#94A3B8" />
                  </svg>
                </div>

                <p className="text-xs sm:text-[12px] text-slate-700 leading-relaxed text-center font-medium">
                  Once the bank reconciles the payment, finalize the <strong className="text-slate-900 font-bold">E-TDS Return</strong> in the portal to lodge the transaction.
                </p>

                <div className="pt-2 flex flex-col items-center space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <span className="text-sm">↑</span>
                    <span className="text-sm">↓</span>
                  </div>
                  <div className="border-2 border-[#1E3A8A] bg-[#EAF3FA] text-[#0F2942] font-black px-4 py-1.5 rounded-full text-xs tracking-wide shadow-2xs">
                    Deductee PAN Ledger
                  </div>
                </div>
              </div>

              <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#10B981] text-white items-center justify-center shadow-md">
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="md:hidden flex justify-center py-2 text-[#10B981]">
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* STEP 5: Withholding Certificate (प्रमाण-पत्र) */}
            {/* ------------------------------------------------------------------- */}
            <div className="bg-white rounded-2xl border-2 border-[#1E3A8A] flex flex-col justify-between p-3.5 sm:p-4 shadow-sm relative hover:shadow-md transition-all">
              <div className="space-y-3.5">
                <div className="bg-[#DDF2E6] text-[#0F4A2C] font-black text-xs sm:text-[13px] text-center py-2 px-2 rounded-xl border border-[#A6DFC0] leading-tight">
                  5. Withholding Certificate (प्रमाण-पत्र)
                </div>

                <div className="h-32 sm:h-36 bg-[#F8FAFD] rounded-xl border border-slate-200/80 p-2 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-32">
                    <g transform="translate(18, 8)">
                      <rect x="0" y="0" width="56" height="74" rx="2" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.2" />
                      <rect x="2.5" y="2.5" width="51" height="69" rx="1.5" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="0.8" />
                      <circle cx="28" cy="11" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.8" />
                      <text x="28" y="19" fontSize="4.2" fill="#1E3A8A" fontWeight="black" textAnchor="middle">IRD</text>
                      <text x="28" y="24" fontSize="3.8" fill="#0F172A" fontWeight="bold" textAnchor="middle">Withholding</text>
                      <text x="28" y="28" fontSize="3.8" fill="#0F172A" fontWeight="bold" textAnchor="middle">Certificate</text>
                      <line x1="8" y1="34" x2="48" y2="34" stroke="#CBD5E1" strokeWidth="1" />
                      <line x1="8" y1="39" x2="45" y2="39" stroke="#E2E8F0" strokeWidth="0.8" />
                      <line x1="8" y1="44" x2="48" y2="44" stroke="#E2E8F0" strokeWidth="0.8" />
                      <line x1="8" y1="49" x2="40" y2="49" stroke="#E2E8F0" strokeWidth="0.8" />
                      <line x1="8" y1="54" x2="48" y2="54" stroke="#E2E8F0" strokeWidth="0.8" />
                      <line x1="8" y1="62" x2="28" y2="62" stroke="#64748B" strokeWidth="0.8" />
                      <g transform="translate(38, 56)">
                        <path d="M4 8L1 16L6 14L10 16L7 8Z" fill="#DC2626" />
                        <circle cx="5" cy="5" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                        <circle cx="5" cy="5" r="3.2" fill="#FBBF24" />
                      </g>
                    </g>

                    <g transform="translate(86, 12)">
                      <path d="M18 10C18 3 24 0 30 0C38 0 44 4 44 12C41 10 37 8 30 8C24 8 21 9 18 10Z" fill="#1E293B" />
                      <circle cx="31" cy="18" r="11" fill="#FDBA74" stroke="#C2410C" strokeWidth="1" />
                      <path d="M25 16C27 15 28 15 29 16" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M33 16C35 15 36 15 37 16" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M27 22C29 25 33 25 35 22" stroke="#9A3412" strokeWidth="1.5" strokeLinecap="round" />
                      <path
                        d="M12 36C12 28 18 26 31 26C44 26 50 28 50 36L48 76H14L12 36Z"
                        fill="#1E3A8A"
                        stroke="#172554"
                        strokeWidth="1.5"
                      />
                      <path d="M26 26L31 36L36 26H26Z" fill="#FFFFFF" />
                      <path d="M29 30L31 46L33 30Z" fill="#0284C7" />
                      <path d="M14 36L0 44L-10 40" stroke="#1E3A8A" strokeWidth="4.5" strokeLinecap="round" />
                      <circle cx="-12" cy="39" r="3" fill="#FDBA74" />
                      <path d="M48 38L56 50" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>

                <p className="text-xs sm:text-[12px] text-slate-700 leading-relaxed text-center font-medium">
                  Download the statutory <strong className="text-emerald-800 font-bold">Withholding Certificate</strong> from the IRD portal and issue it as proof of advance tax remittance.
                </p>

                <div className="p-2 border-2 border-amber-400 bg-amber-50/70 rounded-xl space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-amber-300 pb-1">
                    <div className="flex items-center gap-1.5">
                      <NepalEmblem className="w-4 h-4" />
                      <span className="font-bold text-[10px] text-slate-900">
                        Withholding Certificate
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 font-bold">अनुसूची-१०</span>
                  </div>
                  <div className="space-y-0.5 text-[9px] text-slate-600 font-mono">
                    <div>Certificate: <strong className="text-slate-800">IRD-WH-2083-9182</strong></div>
                    <div>Status: <span className="text-emerald-700 font-bold">✓ Digitally Signed & Reconciled</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
