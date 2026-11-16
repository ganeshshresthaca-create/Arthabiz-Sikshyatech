import React, { useState, useEffect } from 'react';
import {
  DayModule,
  DayProgress,
  Question,
  StudentProfile
} from '../types/accounting';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  RotateCcw,
  CheckSquare,
  AlertTriangle,
  FileText,
  Clock,
  BookOpen,
  LayoutGrid,
  Download,
  Lock,
  KeyRound
} from 'lucide-react';
import { formatRs } from '../data/modulesData';

interface Props {
  dayModule: DayModule;
  progress: DayProgress;
  onUpdateProgress: (newProgress: DayProgress) => void;
  onSubmitSession: () => void;
  onResetSession: () => void;
  onOpenQuestionOnly: () => void;
  studentProfile: StudentProfile | null;
  onBackToCatalog?: () => void;
  onRequestUnlock?: (dayModule: DayModule) => void;
}

export const MCQPracticeArena: React.FC<Props> = ({
  dayModule,
  progress,
  onUpdateProgress,
  onSubmitSession,
  onResetSession,
  onOpenQuestionOnly,
  studentProfile,
  onBackToCatalog,
  onRequestUnlock,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0); // 0 to 49
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Guard: If module is locked, completely prevent rendering questions
  if (!progress.unlocked) {
    return (
      <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-white border border-amber-300 rounded-2xl shadow-xl text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8 text-amber-700" />
        </div>
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Passcode Required
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Day {dayModule.dayNumber} Practice Arena is Locked
          </h2>
          <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Access to these 50 practical accounting questions is restricted to authorized candidates. You must obtain the 5-digit daily security passcode from your trainer to unlock this module.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          {onBackToCatalog && (
            <button
              type="button"
              onClick={onBackToCatalog}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              ← Back to All 15 Days
            </button>
          )}
          {onRequestUnlock && (
            <button
              type="button"
              onClick={() => onRequestUnlock(dayModule)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Enter Passcode to Unlock</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion: Question = dayModule.questions[currentIdx] || dayModule.questions[0];
  const totalQuestions = dayModule.questions.length; // 50

  const answeredCount = Object.keys(progress.answers).length;
  const markedCount = progress.markedForReview.length;
  const unansweredCount = totalQuestions - answeredCount;

  // Selected option for current question (undefined if not yet answered)
  const selectedOption = progress.answers[currentQuestion.id];
  const isMarked = progress.markedForReview.includes(currentQuestion.id);

  // Time tracker
  useEffect(() => {
    if (progress.submitted) return;
    const timer = setInterval(() => {
      onUpdateProgress({
        ...progress,
        timeSpentSeconds: (progress.timeSpentSeconds || 0) + 1,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [progress, onUpdateProgress]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Option selection - allow clicking only once, do not allow changing answer
  const handleSelectOption = (optionIdx: number) => {
    if (progress.submitted) return; // Prevent changing after submission
    if (progress.answers[currentQuestion.id] !== undefined) return; // Strictly allow only one click per question
    const newAnswers = {
      ...progress.answers,
      [currentQuestion.id]: optionIdx,
    };
    onUpdateProgress({
      ...progress,
      answers: newAnswers,
    });
  };

  // Toggle Mark for Review
  const handleToggleMark = () => {
    const isCurrentlyMarked = progress.markedForReview.includes(currentQuestion.id);
    let newMarked: number[];
    if (isCurrentlyMarked) {
      newMarked = progress.markedForReview.filter((id) => id !== currentQuestion.id);
    } else {
      newMarked = [...progress.markedForReview, currentQuestion.id];
    }
    onUpdateProgress({
      ...progress,
      markedForReview: newMarked,
    });
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Session Progress Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Day {dayModule.dayNumber} Practice
              </span>
              <span className="text-xs text-slate-500">
                Practice Date: {dayModule.defaultDate}
              </span>
              {progress.submitted && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Submitted & Scored ({progress.score}/{totalQuestions})
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {dayModule.title}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              {dayModule.theme}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {onBackToCatalog && (
              <button
                type="button"
                onClick={onBackToCatalog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                <span>All 15 Days</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-medium text-slate-700 border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Time: {formatTimer(progress.timeSpentSeconds || 0)}</span>
            </div>

            <button
              onClick={onOpenQuestionOnly}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
              title="Download question paper for offline practice"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Question Paper</span>
            </button>

            {!progress.submitted ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Session
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake Practice
              </button>
            )}
          </div>
        </div>

        {/* Real-time Status Counters Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            <div className="font-semibold text-xs">Answered</div>
            <div className="text-base font-extrabold">{answeredCount} <span className="text-xs font-normal text-emerald-600">/ 50</span></div>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <div className="font-semibold text-xs">Marked for Review</div>
            <div className="text-base font-extrabold">{markedCount} <span className="text-xs font-normal text-amber-600">/ 50</span></div>
          </div>
          <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
            <div className="font-semibold text-xs">Unanswered (Neutral)</div>
            <div className="text-base font-extrabold">{unansweredCount} <span className="text-xs font-normal text-slate-500">/ 50</span></div>
          </div>
          <div className="hidden sm:block p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
            <div className="font-semibold text-xs">Current Focus</div>
            <div className="text-base font-extrabold">Q {currentIdx + 1} <span className="text-xs font-normal text-blue-600">({currentQuestion.transactionCode})</span></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Question Arena (Left) & Side Dashboard 1-50 Navigator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transaction Statement & MCQ Selection (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs">
            {/* Question Sub-Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded">
                  {currentQuestion.transactionTitle}
                </span>
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Ref: {currentQuestion.transactionCode}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {currentQuestion.dayBookCategory}
                </span>
              </div>

              {/* Action Buttons: Mark for Review */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMark}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    isMarked
                      ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                      : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isMarked ? 'fill-amber-600 text-amber-600' : 'text-slate-400'
                    }`}
                  />
                  {isMarked ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>
            </div>

            {/* Transaction Text */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Transaction Statement
              </p>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {currentQuestion.transactionText}
              </h2>
            </div>

            {/* MCQ 4 Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Standard Journal Entry (Only one choice allowed):
                </p>
                {selectedOption !== undefined && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>🔒 Answer Locked</span>
                    <span className="text-amber-500 font-normal hidden sm:inline">• Selection cannot be changed</span>
                  </span>
                )}
              </div>

              {currentQuestion.options.map((optText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQuestion.correctOptionIndex;
                const hasAnswered = selectedOption !== undefined;

                // Color logic:
                // If not selected: neutral hover
                // If answered:
                //   If this is the selected one: green if correct, red if incorrect
                //   If this is correct (and student selected wrong): highlight green subtly to teach
                let containerClass = 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 text-slate-800';
                let indicatorBadge = null;

                if (hasAnswered) {
                  if (isSelected && isCorrect) {
                    containerClass = 'border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/20';
                    indicatorBadge = (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct Entry
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    containerClass = 'border-red-400 bg-red-50 text-red-950 ring-2 ring-red-400/20';
                    indicatorBadge = (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-white px-2 py-0.5 rounded border border-red-300">
                        <XCircle className="w-3.5 h-3.5 text-red-600" /> Incorrect Choice
                      </span>
                    );
                  } else if (!isSelected && isCorrect) {
                    containerClass = 'border-emerald-300 bg-emerald-50/50 text-emerald-900';
                    indicatorBadge = (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                        Correct Answer
                      </span>
                    );
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={progress.submitted || hasAnswered}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${containerClass} ${
                      hasAnswered ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-red-600 text-white border-red-600'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <div className="font-mono text-xs sm:text-sm font-medium tracking-tight break-words">
                        {optText.replace(/^Option [A-D]:\s*/, '')}
                      </div>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {indicatorBadge}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation / Golden Rule Breakdown once answered */}
            {selectedOption !== undefined && (
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Double-Entry Analysis & Golden Rule</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {currentQuestion.explanation}
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-blue-900 font-semibold">
                    <span>Particulars:</span>
                    <span>Ref: {currentQuestion.journalEntry.ref}</span>
                  </div>
                  <div className="text-slate-900 font-semibold pl-2">
                    {currentQuestion.journalEntry.drLedger} <span className="float-right text-emerald-700">... Dr. Rs. {formatRs(currentQuestion.journalEntry.debitAmount)}</span>
                  </div>
                  <div className="text-slate-800 pl-6">
                    To {currentQuestion.journalEntry.crLedger} <span className="float-right text-emerald-700">Rs. {formatRs(currentQuestion.journalEntry.creditAmount)}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] italic pl-6 pt-1">
                    ({currentQuestion.journalEntry.narration})
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-semibold text-slate-500">
                Transaction {currentIdx + 1} of {totalQuestions}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIdx === totalQuestions - 1}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Side Dashboard with 1-50 Number Boxes (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Question Dashboard (1 - 50)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instant status of all 50 transactions
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {Math.round((answeredCount / totalQuestions) * 100)}% Done
              </span>
            </div>

            {/* 3 Color Indicators Legend requested by user */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 mb-4 text-[11px] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0" />
                <span className="text-slate-700 font-medium">Marked for Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300 shrink-0" />
                <span className="text-slate-700 font-medium">Unanswered - Neutral ({unansweredCount})</span>
              </div>
            </div>

            {/* 1-50 Grid Boxes */}
            <div className="grid grid-cols-5 gap-1.5 max-h-80 overflow-y-auto p-1 pr-1.5 border border-slate-100 rounded-lg">
              {dayModule.questions.map((q, idx) => {
                const isAns = progress.answers[q.id] !== undefined;
                const isMkd = progress.markedForReview.includes(q.id);
                const isActive = idx === currentIdx;

                // Color assignment per instructions:
                // Neutral for unanswered
                // Answered color
                // Marked for review color
                let bgStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'; // Neutral

                if (isMkd) {
                  bgStyle = 'bg-amber-500 text-white font-bold hover:bg-amber-600 border-amber-600'; // Marked
                } else if (isAns) {
                  bgStyle = 'bg-emerald-600 text-white font-bold hover:bg-emerald-700 border-emerald-700'; // Answered
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-md border text-xs font-mono font-medium flex items-center justify-center transition relative ${bgStyle} ${
                      isActive ? 'ring-2 ring-blue-600 ring-offset-1 z-10' : ''
                    }`}
                    title={`Transaction - ${q.id} (${q.transactionCode})`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Submit or Result Button */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              {!progress.submitted ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(true)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Daily Practice (50 Qs)
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <p className="text-xs font-bold text-emerald-800">
                      Practice Completed
                    </p>
                    <p className="text-sm font-extrabold text-emerald-950 font-mono">
                      Score: {progress.score} / 50 ({Math.round(((progress.score || 0) / 50) * 100)}%)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onSubmitSession}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    View Result Analytics & Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Before Submission */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Practice Session?
                </h3>
                <p className="text-xs text-slate-500">
                  Day {dayModule.dayNumber} • 50 Transactions
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-5 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span>Candidate Name:</span>
                <span className="font-semibold text-slate-900">{studentProfile?.name || 'Registered Student'}</span>
              </div>
              {studentProfile?.assignedId && (
                <div className="flex justify-between">
                  <span>Assigned ID:</span>
                  <span className="font-mono font-semibold text-slate-900">{studentProfile.assignedId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Total Answered:</span>
                <span className="font-bold text-emerald-700">{answeredCount} of 50</span>
              </div>
              <div className="flex justify-between">
                <span>Marked for Review:</span>
                <span className="font-bold text-amber-600">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-bold text-slate-700">{unansweredCount}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mb-4 font-medium">
                Note: You have {unansweredCount} unanswered question(s). Unanswered questions will receive 0 marks.
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Continue Reviewing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  onSubmitSession();
                }}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Retake Day {dayModule.dayNumber}?
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              This will clear your current answers and let you re-attempt the 50 transactions. Your unlocked status will remain active.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmReset(false);
                  onResetSession();
                }}
                className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Retake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
