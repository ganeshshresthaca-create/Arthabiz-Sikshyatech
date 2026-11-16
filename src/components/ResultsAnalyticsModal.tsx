import React, { useState } from 'react';
import {
  DayModule,
  DayProgress,
  StudentProfile,
  ViewTab
} from '../types/accounting';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  BookMarked,
  RotateCcw,
  BarChart3,
  Calendar,
  User,
  ShieldCheck,
  Download,
  CheckCircle2
} from 'lucide-react';
import { downloadScorecardReportPDF } from '../utils/documentExport';

interface Props {
  dayModule: DayModule;
  progress: DayProgress;
  studentProfile: StudentProfile | null;
  onSelectTab: (tab: ViewTab) => void;
  onRetake: () => void;
}

export const ResultsAnalyticsModal: React.FC<Props> = ({
  dayModule,
  progress,
  studentProfile,
  onSelectTab,
  onRetake,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const currentDateTimeStr = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const total = dayModule.questions.length; // 50
  let correctCount = 0;
  let incorrectCount = 0;

  // Breakdown by category
  const categoryStats: Record<string, { total: number; correct: number }> = {};

  dayModule.questions.forEach((q) => {
    const userChoice = progress.answers[q.id];
    const isCorrect = userChoice === q.correctOptionIndex;

    if (!categoryStats[q.dayBookCategory]) {
      categoryStats[q.dayBookCategory] = { total: 0, correct: 0 };
    }
    categoryStats[q.dayBookCategory].total += 1;

    if (userChoice !== undefined) {
      if (isCorrect) {
        correctCount += 1;
        categoryStats[q.dayBookCategory].correct += 1;
      } else {
        incorrectCount += 1;
      }
    }
  });

  const answeredCount = Object.keys(progress.answers).length;
  const unansweredCount = total - answeredCount;
  const percentage = Math.round((correctCount / total) * 100);

  // Performance Evaluation Grade
  let grade = 'F';
  let gradeLabel = 'Needs Substantial Revision';
  let gradeColor = 'text-red-600 bg-red-50 border-red-200';

  if (percentage >= 90) {
    grade = 'A+';
    gradeLabel = 'Outstanding Professional Mastery';
    gradeColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  } else if (percentage >= 80) {
    grade = 'A';
    gradeLabel = 'Excellent Financial Accounting Proficiency';
    gradeColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (percentage >= 70) {
    grade = 'B+';
    gradeLabel = 'Good Practical Knowledge';
    gradeColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (percentage >= 60) {
    grade = 'B';
    gradeLabel = 'Competent - Review Adjustments';
    gradeColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (percentage >= 50) {
    grade = 'C';
    gradeLabel = 'Pass - Strengthen Core Golden Rules';
    gradeColor = 'text-amber-800 bg-amber-50 border-amber-200';
  }

  const handleDownloadScorecard = () => {
    downloadScorecardReportPDF(dayModule, progress, studentProfile?.name || 'Student');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Official Scorecard Document Card (Ready for Physical Print & PDF) */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Certificate / Institutional Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative border-b-4 border-blue-600">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl mb-3 shadow-md">
            AS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Arthabiz | Sikshyatech Hub
          </h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mt-1">
            Practical Accounting Assessment — Daily Performance Scorecard
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-xs text-slate-300">
            <span>Official Examination Audit Record</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Verified Submission</span>
          </div>
        </div>

        {/* Candidate & Assessment Metadata */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                Candidate Name
              </span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                {studentProfile?.name || 'Candidate'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                Enrolled Role
              </span>
              <span className="font-bold text-blue-700 text-sm block mt-0.5 uppercase">
                {studentProfile?.role || 'Student'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                Curriculum Day & Module
              </span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                Day {dayModule.dayNumber} (50 Questions)
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">
                Practice Standard Date
              </span>
              <span className="font-semibold text-slate-900 text-sm block mt-0.5">
                {dayModule.defaultDate}
              </span>
            </div>
          </div>
        </div>

        {/* Main Metric Cards */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Marks */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Total Score
              </span>
              <div className="text-3xl sm:text-4xl font-black text-blue-900 font-mono mt-1">
                {correctCount}
                <span className="text-lg text-slate-400 font-medium">/{total}</span>
              </div>
              <p className="text-[11px] text-blue-600 mt-1 font-medium">
                1 mark per transaction
              </p>
            </div>

            {/* Percentage */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Accuracy Percentage
              </span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-900 font-mono mt-1">
                {percentage}%
              </div>
              <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                {answeredCount} of {total} attempted
              </p>
            </div>

            {/* Performance Grade */}
            <div className={`p-5 rounded-2xl border text-center ${gradeColor}`}>
              <span className="text-xs font-bold uppercase tracking-wider">
                Assessment Grade
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono mt-1">
                {grade}
              </div>
              <p className="text-[11px] mt-1 font-semibold leading-tight">
                {gradeLabel}
              </p>
            </div>

            {/* Time Invested */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Time Spent
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-1">
                {Math.floor((progress.timeSpentSeconds || 0) / 60)}m
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {(progress.timeSpentSeconds || 0) % 60} seconds recorded
              </p>
            </div>
          </div>

          {/* Breakdown by Book / Day Book Category */}
          <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Category Accuracy Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryStats).map(([cat, stats]) => {
                const catPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={cat} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-slate-800">{cat}</span>
                      <span className="font-mono text-blue-700">
                        {stats.correct}/{stats.total} ({catPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          catPct >= 80 ? 'bg-emerald-600' : catPct >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signatures & Institutional Seal for Physical Records */}
          <div className="pt-8 pb-4 border-t-2 border-dashed border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="h-10 border-b border-slate-400 mb-2" />
              <p className="font-semibold text-slate-800">Candidate Signature</p>
              <p className="text-[10px] text-slate-600 font-medium">{studentProfile?.name || 'Candidate'}</p>
              <p className="text-[9px] text-slate-400 mt-1 font-mono">Date & Time: {currentDateTimeStr}</p>
            </div>
            <div className="hidden sm:block">
              <div className="h-10 flex items-center justify-center mb-2">
                <span className="text-[11px] font-mono font-bold text-blue-700 border border-blue-300 rounded px-2 py-0.5">
                  OFFICIAL INSTITUTIONAL RECORD
                </span>
              </div>
              <p className="font-semibold text-slate-800">Arthabiz | Sikshyatech Hub</p>
              <p className="text-[10px] text-slate-400">Verified System Ledger</p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400 mb-2" />
              <p className="font-semibold text-slate-800">Course Trainer / Evaluator</p>
              <p className="text-[10px] text-slate-400">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="mx-6 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Official Scorecard PDF downloaded!</strong> Check your browser downloads folder for the PDF report.
            </span>
          </div>
        )}

        {/* Action Buttons Toolbar (Hidden on Print) */}
        <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadScorecard}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              title="Download official PDF scorecard report"
            >
              <Download className="w-4 h-4" />
              Download Result Analytics (PDF)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('journal')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg transition"
            >
              <BookMarked className="w-4 h-4" />
              View 50 Journal Entries Solution
            </button>

            <button
              onClick={() => onSelectTab('daybook')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              View Day Book
            </button>

            <button
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
