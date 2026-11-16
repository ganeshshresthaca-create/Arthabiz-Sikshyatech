import React, { useState } from 'react';
import { DayModule, StudentProfile } from '../types/accounting';
import { X, Download, FileText, CheckCircle2, ListChecks, PenLine } from 'lucide-react';
import { downloadQuestionPaper } from '../utils/documentExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dayModule: DayModule;
  studentProfile: StudentProfile | null;
}

export const QuestionOnlyDownloadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  dayModule,
  studentProfile,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'with-mcq' | 'questions-only'>('with-mcq');

  if (!isOpen) return null;

  const handleDownloadQuestionsOnly = () => {
    downloadQuestionPaper(dayModule, studentProfile?.name || 'Student', 'questions-only');
    setDownloadedFormat('Questions Only (Descriptive Worksheet) PDF');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4500);
  };

  const handleDownloadWithMCQs = () => {
    downloadQuestionPaper(dayModule, studentProfile?.name || 'Student', 'with-mcq');
    setDownloadedFormat('Questions with MCQs PDF');
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[92vh] flex flex-col">
        {/* Top Modal Controls */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Examination & Practice Paper • Day {dayModule.dayNumber}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Download complete 50-transaction practice papers formatted as professional, print-ready PDF examination worksheets.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar with Dual Download Buttons */}
        <div className="py-3 flex items-center justify-between gap-3 border-b border-slate-100 shrink-0 flex-wrap">
          {/* Format Preview Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setPreviewMode('with-mcq')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                previewMode === 'with-mcq'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>With MCQ Options</span>
            </button>
            <button
              onClick={() => setPreviewMode('questions-only')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                previewMode === 'questions-only'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Questions Only</span>
            </button>
          </div>

          {/* Download Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadQuestionsOnly}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold rounded-lg shadow-xs transition"
              title="Download questions only without options for descriptive journal drafting"
            >
              <PenLine className="w-3.5 h-3.5 text-slate-300" />
              <span>Download Questions Only (PDF)</span>
            </button>

            <button
              onClick={handleDownloadWithMCQs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
              title="Download question paper with all 4 multiple choice options"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download with MCQs (PDF)</span>
            </button>
          </div>
        </div>

        {/* Download Success Notice */}
        {downloadSuccess && (
          <div className="my-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>{downloadedFormat} downloaded!</strong> Check your browser downloads folder. You can print it or practice offline anytime.
            </span>
          </div>
        )}

        {/* Scrollable Printable Worksheet View */}
        <div className="overflow-y-auto flex-1 pr-2 py-4 space-y-5 text-xs printable-question-paper">
          {/* Institutional Exam Header */}
          <div className="border-2 border-slate-800 rounded-xl p-5 text-center bg-slate-50">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Arthabiz | Sikshyatech Hub
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mt-0.5">
              Practical Accounting Daily Assessment Paper
            </p>
            <p className="text-xs text-slate-700 font-bold mt-1">
              Day {dayModule.dayNumber}: {dayModule.title} • {previewMode === 'questions-only' ? 'Descriptive Problem Worksheet (Questions Only)' : 'Multiple Choice Examination Paper'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-300 text-left text-xs font-mono">
              <div className="border-b border-slate-400 pb-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Candidate Name:</span>
                <span className="font-bold text-slate-900">{studentProfile?.name || '____________________'}</span>
              </div>
              <div className="border-b border-slate-400 pb-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Practice Date:</span>
                <span className="font-bold text-slate-900">{dayModule.defaultDate}</span>
              </div>
              <div className="border-b border-slate-400 pb-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Max Marks:</span>
                <span className="font-bold text-slate-900">50 (1 mark each)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 mt-2.5 text-left italic bg-amber-50/70 p-2 rounded border border-amber-200/80">
              {previewMode === 'questions-only'
                ? 'Instructions for Questions Only: Read each business transaction carefully and draft the complete double-entry journal entry with debit account head, credit account head, amounts, and brief narration in the blank workspace.'
                : 'Instructions for MCQ Paper: Read each business transaction and identify the correct double-entry journal entry with corresponding ledger amounts. Mark your choice [A, B, C, or D] on your physical practice sheet.'}
            </div>
          </div>

          {/* 50 Questions List */}
          <div className="space-y-4">
            {dayModule.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 break-inside-avoid shadow-2xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-900 text-xs">
                    Q{idx + 1}. {q.transactionTitle} ({q.transactionCode})
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans font-semibold">
                    [1 Mark]
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-slate-800 text-xs font-sans leading-relaxed border border-slate-100">
                  {q.transactionText}
                </div>

                {previewMode === 'questions-only' ? (
                  // Descriptive Workspace for Questions Only
                  <div className="p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 space-y-2 font-mono text-[11px]">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Draft Double-Entry Journal Solution:
                    </div>
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Dr.  ______________________________________________________</span>
                      <span>(Rs. _________________)</span>
                    </div>
                    <div className="text-slate-400 flex items-center justify-between pl-6">
                      <span>To __________________________________________________</span>
                      <span>(Rs. _________________)</span>
                    </div>
                    <div className="text-slate-400 italic text-[10px] pl-6 pt-1">
                      (Being ______________________________________________________________________)
                    </div>
                  </div>
                ) : (
                  // MCQ 4 Options with Checkboxes
                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className="p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center gap-2.5 hover:bg-slate-50"
                      >
                        <span className="w-4 h-4 rounded border-2 border-slate-400 inline-block shrink-0" />
                        <span>{opt}</span>
                      </div>
                    ))}
                    <div className="pt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100">
                      <span>Candidate Choice: [      ]</span>
                      <span>Rough Work: __________________________</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Choose <strong>"Download Questions Only"</strong> for descriptive notebook drafting, or <strong>"Download with MCQs"</strong> for offline test practice.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
