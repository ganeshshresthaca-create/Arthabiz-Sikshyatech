import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Scale,
  FileSpreadsheet,
  FileText,
  PenTool,
  PieChart,
  CheckCircle2,
  Coins,
  ShieldCheck,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { ACCOUNTING_CYCLE_8_STEPS, AccountingCycleStep } from '../data/accountingCycleData';
import { AccountingCycle3DWheel } from './AccountingCycle3DWheel';

interface Props {
  onBack?: () => void;
  onGoToNextLesson?: () => void;
  onGoToTestArena?: (dayNumber?: number) => void;
}

export const AccountingCycleLesson: React.FC<Props> = ({
  onBack,
  onGoToNextLesson,
  onGoToTestArena,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'3d-wheel' | 'worked-example' | 'rules'>('3d-wheel');
  const [vatFilter, setVatFilter] = useState<'all' | 'case-a' | 'case-b' | 'case-c'>('all');

  const currentStep: AccountingCycleStep =
    ACCOUNTING_CYCLE_8_STEPS.find((s) => s.step === activeStep) || ACCOUNTING_CYCLE_8_STEPS[0];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/70 overflow-hidden py-8 sm:py-10 font-sans">
      {/* Subtle Geometric Background Watermark matching Main Dashboard */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Top Navigation Bar with Back Button & Centered Main Title */}
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

          {/* Centered Main Title Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Accounting Cycle: <span className="text-blue-700">Dynamic 3D Flow &amp; Cases</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
              Follow economic events through the complete 8-stage sequence—from authentic source document verification to year-end closing entries and post-closing trial balances.
            </p>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('3d-wheel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === '3d-wheel'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <RotateCw className="w-4 h-4 text-amber-400" />
            <span>3D Interactive Wheel &amp; Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('worked-example')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'worked-example'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Full Company Worked Case (Steps 1–8)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>ICAN / Statutory Audit Rules</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: 3D INTERACTIVE WHEEL & STEP INSPECTOR                       */}
        {/* =================================================================== */}
        {activeTab === '3d-wheel' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Dynamic 3D Wheel Container */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-md space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  The 8-Step Accounting Cycle: Spatial 3D Flow
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any node or press Play to watch economic transactions cycle clockwise from Step 1 to Step 8.
                </p>
              </div>

              {/* 3D Wheel Component */}
              <AccountingCycle3DWheel
                activeStep={activeStep}
                onSelectStep={(num) => setActiveStep(num)}
              />
            </div>

            {/* Quick 8-Step Selector Bar */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Jump Directly to Step:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {ACCOUNTING_CYCLE_8_STEPS.map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border-2 flex flex-col justify-between ${
                      activeStep === s.step
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm scale-102'
                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-black">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-white text-[9px]"
                        style={{ backgroundColor: s.theme.hex }}
                      >
                        {s.step}
                      </span>
                      <span className={activeStep === s.step ? 'text-slate-300' : 'text-slate-400'}>
                        Stage {s.step}
                      </span>
                    </div>
                    <div className="text-[11px] font-extrabold mt-1.5 truncate">
                      {s.step === 1 && 'Identify & Analyze'}
                      {s.step === 2 && 'Journal Entry'}
                      {s.step === 3 && 'General Ledger'}
                      {s.step === 4 && 'Unadjusted TB'}
                      {s.step === 5 && 'Worksheet'}
                      {s.step === 6 && 'Adjusting Entries'}
                      {s.step === 7 && 'Financial Statements'}
                      {s.step === 8 && 'Close Books'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deep-Dive Step Inspector with Real-World Worked Case */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              {/* Step Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-black text-white"
                      style={{ backgroundColor: currentStep.theme.hex }}
                    >
                      Step {currentStep.step} of 8
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Accounting Cycle Deep Dive
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentStep.title}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500">
                    {currentStep.nepaliTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep <= 1 ? 8 : activeStep - 1)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    &larr; Prev Step
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep >= 8 ? 1 : activeStep + 1)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Next Step &rarr;
                  </button>
                </div>
              </div>

              {/* Step Description & Purpose */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Purpose &amp; Action in Accounting Practice</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentStep.fullDescription}
                </p>
              </div>

              {/* Concrete Worked Example Card (The Company Case) */}
              <div className="border-2 border-blue-200 bg-blue-50/30 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-blue-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <h4 className="text-sm sm:text-base font-black text-blue-950">
                      Real-World Case Study: Himalayan Tech Logistics Pvt. Ltd.
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Step {currentStep.step} Output
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-blue-900 block">Transaction Scenario:</span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {currentStep.workedExample.scenario}
                  </p>
                </div>

                {/* Input Documents */}
                <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Verified Source Documents &amp; Evidence:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                    {currentStep.workedExample.inputDocuments.map((doc, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Output Preview (Journal, T-Account, Table, etc.) */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                      {currentStep.workedExample.technicalOutput.title}:
                    </span>

                    {/* Interactive Filter for Step 2 to toggle Real-World Tax Classifications */}
                    {currentStep.step === 2 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          VAT Status:
                        </span>
                        <button
                          type="button"
                          onClick={() => setVatFilter('all')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            vatFilter === 'all'
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          All 3 Cases
                        </button>
                        <button
                          type="button"
                          onClick={() => setVatFilter('case-a')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            vatFilter === 'case-a'
                              ? 'bg-blue-700 text-white shadow-2xs'
                              : 'bg-white hover:bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          Case A: VAT Entity (Asset)
                        </button>
                        <button
                          type="button"
                          onClick={() => setVatFilter('case-b')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            vatFilter === 'case-b'
                              ? 'bg-emerald-700 text-white shadow-2xs'
                              : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          Case B: Non-VAT (Asset Cost)
                        </button>
                        <button
                          type="button"
                          onClick={() => setVatFilter('case-c')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            vatFilter === 'case-c'
                              ? 'bg-amber-700 text-white shadow-2xs'
                              : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          Case C: Non-VAT (Expense)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 1. Journal Voucher Format */}
                  {currentStep.workedExample.technicalOutput.type === 'journal' && (() => {
                    let rows = currentStep.workedExample.technicalOutput.data;
                    if (currentStep.step === 2 && vatFilter !== 'all') {
                      let activeGroup = '';
                      rows = rows.filter((row: any) => {
                        if (row.isHeader) {
                          if (row.title.includes('CASE A')) activeGroup = 'case-a';
                          else if (row.title.includes('CASE B')) activeGroup = 'case-b';
                          else if (row.title.includes('CASE C')) activeGroup = 'case-c';
                        }
                        return activeGroup === vatFilter;
                      });
                    }

                    return (
                      <div className="bg-white border-2 border-slate-300 rounded-xl overflow-hidden shadow-2xs font-mono text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-[11px] text-slate-700">
                              <th className="py-2 px-3 w-28">Date</th>
                              <th className="py-2 px-3">Particulars &amp; Narration</th>
                              <th className="py-2 px-3 w-16 text-center">L.F.</th>
                              <th className="py-2 px-3 w-28 text-right">Debit (NPR)</th>
                              <th className="py-2 px-3 w-28 text-right">Credit (NPR)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rows.map((row: any, rIdx: number) => {
                              if (row.isHeader) {
                                return (
                                  <tr key={rIdx} className="bg-slate-800 text-white font-sans text-[11px] font-bold">
                                    <td colSpan={5} className="py-2 px-3 text-amber-300">
                                      {row.title}
                                    </td>
                                  </tr>
                                );
                              }
                              return (
                                <tr key={rIdx} className={row.debit && row.credit ? 'bg-slate-50/80 font-bold' : ''}>
                                  <td className="py-1.5 px-3 text-slate-500 align-top">{row.date}</td>
                                  <td className="py-1.5 px-3 text-slate-900 align-top">{row.particulars}</td>
                                  <td className="py-1.5 px-3 text-slate-400 text-center align-top">{row.lf}</td>
                                  <td className="py-1.5 px-3 text-right font-bold text-emerald-800 align-top">
                                    {row.debit}
                                  </td>
                                  <td className="py-1.5 px-3 text-right font-bold text-rose-800 align-top">
                                    {row.credit}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  {/* 2. T-Account Format */}
                  {currentStep.workedExample.technicalOutput.type === 't-account' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentStep.workedExample.technicalOutput.data.map((tAcc: any, tIdx: number) => (
                        <div key={tIdx} className="bg-white border-2 border-teal-300 rounded-xl p-3.5 space-y-2 shadow-2xs">
                          <div className="font-extrabold text-xs text-teal-950 border-b border-teal-200 pb-1 text-center bg-teal-50/60 rounded">
                            {tAcc.account}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="border-r border-slate-200 pr-2 space-y-1">
                              <span className="font-bold text-emerald-800 block text-[10px] uppercase">Dr. Side</span>
                              <p className="text-slate-700 leading-tight">{tAcc.debitSide}</p>
                            </div>
                            <div className="pl-1 space-y-1">
                              <span className="font-bold text-rose-800 block text-[10px] uppercase">Cr. Side</span>
                              <p className="text-slate-700 leading-tight">{tAcc.creditSide}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 text-center font-bold text-xs text-teal-900 bg-teal-50/40 rounded py-1">
                            {tAcc.netBalance}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 3. Worksheet Format */}
                  {currentStep.workedExample.technicalOutput.type === 'worksheet' && (
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-3.5 space-y-2">
                      {currentStep.workedExample.technicalOutput.data.map((ws: any, wIdx: number) => (
                        <div key={wIdx} className="p-2 bg-slate-50 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-slate-200/80">
                          <span className="font-bold text-slate-900 font-mono sm:w-56 shrink-0">{ws.col}:</span>
                          <span className="text-slate-700 font-medium">{ws.impact}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. Table Format */}
                  {currentStep.workedExample.technicalOutput.type === 'table' && (
                    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                      <div className="divide-y divide-slate-100">
                        {currentStep.workedExample.technicalOutput.data.map((item: any, iIdx: number) => (
                          <div key={iIdx} className="p-2.5 flex items-center justify-between text-xs gap-3">
                            <span className="font-bold text-slate-800">{item.field}:</span>
                            <span className="font-mono text-slate-600 font-medium text-right">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Statement Format */}
                  {currentStep.workedExample.technicalOutput.type === 'statement' && (
                    <div className="space-y-2">
                      {currentStep.workedExample.technicalOutput.data.map((stmt: any, sIdx: number) => (
                        <div key={sIdx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs shadow-2xs">
                          <span className="font-black text-slate-900 uppercase text-[11px] block">{stmt.statement}</span>
                          <p className="text-slate-700 font-mono text-[11px] leading-relaxed">{stmt.line}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <div className="p-3 bg-blue-100/60 border border-blue-300/80 rounded-xl text-xs text-blue-950 leading-relaxed font-medium">
                  <strong>Pedagogical Insight: </strong>
                  {currentStep.workedExample.explanation}
                </div>
              </div>

              {/* Statutory Rules */}
              <div className="pt-2">
                {/* Statutory Law Rule */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Statutory Law &amp; Auditing Standard</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {currentStep.statutoryRule}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: FULL COMPANY WORKED CASE (STEPS 1 TO 8 SEQUENTIAL)          */}
        {/* =================================================================== */}
        {activeTab === 'worked-example' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-8 animate-fadeIn">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                End-to-End Enterprise Master Case
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                Himalayan Tech Logistics Pvt. Ltd.: Complete Fiscal Cycle (Steps 1–8)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Follow one concrete corporate acquisition through all 8 sequential stages to master the flow of financial data from initial purchase order to closing trial balance.
              </p>
            </div>

            <div className="space-y-6">
              {ACCOUNTING_CYCLE_8_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-slate-50/40 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: step.theme.hex }}
                      >
                        {step.step}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                          {step.title}
                        </h3>
                        <span className="text-xs text-slate-500 font-semibold">{step.nepaliTitle}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep(step.step);
                        setActiveTab('3d-wheel');
                      }}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 rounded-lg border border-slate-300 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <span>Inspect in 3D Wheel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {step.workedExample.scenario}
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono">
                    <strong>Technical Stage Action: </strong>
                    {step.actionSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: ICAN / STATUTORY AUDIT RULES                                */}
        {/* =================================================================== */}
        {activeTab === 'rules' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-fadeIn">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                Examination &amp; Compliance Reference
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                Statutory Guidelines &amp; Audit Traps across the 8 Stages
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Key regulatory standards (Nepal Companies Act 2063, Income Tax Act 2058, NAS / NFRS framework) governing every stage of the cycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCOUNTING_CYCLE_8_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0"
                      style={{ backgroundColor: step.theme.hex }}
                    >
                      {step.step}
                    </span>
                    <h3 className="font-extrabold text-xs text-slate-900 truncate">{step.title}</h3>
                  </div>

                  <div className="p-2.5 bg-white border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
                    <strong className="block text-[10px] uppercase font-bold text-emerald-700 mb-0.5">Statutory Standard:</strong>
                    {step.statutoryRule}
                  </div>

                  <div className="p-2.5 bg-white border border-amber-200 rounded-xl text-xs text-amber-950 leading-relaxed">
                    <strong className="block text-[10px] uppercase font-bold text-amber-700 mb-0.5">Exam Trap Note:</strong>
                    {step.examTrapNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
