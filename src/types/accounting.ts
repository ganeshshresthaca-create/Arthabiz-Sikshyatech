/**
 * Accounting Practice Portal Types
 * Project: Arthabiz | Sikshyatech Hub
 */

export type UserRole = 'student' | 'trainer';

export interface StudentProfile {
  uid?: string;
  name: string;
  email?: string;
  role: UserRole;
  authMode?: 'google' | 'email' | 'local';
  usedDefaultPassword?: boolean;
  assignedId?: string;
  institution?: string;
  registeredAt: string;
}

export interface JournalEntry {
  date: string;
  ref: string; // e.g. "TrxJV-01"
  drLedger: string;
  crLedger: string;
  narration: string;
  debitAmount: number;
  creditAmount: number;
}

export interface Question {
  id: number; // 1 to 50
  transactionCode: string; // "TrxJV-01"
  transactionTitle: string; // "Transaction - 1"
  date: string; // standard practice date
  transactionText: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
  journalEntry: JournalEntry;
  dayBookCategory: 'Cash Book' | 'Bank Book' | 'Purchase Book' | 'Sales Book' | 'General Journal' | 'Returns & Adjustments';
  ledgerAffected: string;
}

export interface DayModule {
  dayNumber: number; // 1 to 15
  title: string;
  theme: string;
  passcode: string; // 5-digit code provided by trainer
  defaultDate: string;
  description: string;
  questions: Question[];
}

export interface DayProgress {
  unlocked: boolean;
  unlockedAt?: string;
  answers: Record<number, number>; // questionId -> selectedOptionIndex (0-3)
  markedForReview: number[]; // array of questionIds
  submitted: boolean;
  submittedAt?: string;
  timeSpentSeconds: number;
  score?: number;
  totalQuestions?: number;
}

export type ViewTab = 'practice' | 'results' | 'journal' | 'daybook' | 'question_only';

export type AppSection = 'path_selector' | 'study_library' | 'memory_lab' | 'test_arena' | 'trainers_room';
