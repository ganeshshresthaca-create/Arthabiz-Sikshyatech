/**
 * Local Storage Utilities for Student State, Passcodes, and Results
 * Project: Arthabiz | Sikshyatech Hub
 * Scoped per user to ensure complete privacy and isolation between candidates.
 */

import { StudentProfile, DayProgress } from '../types/accounting';

const PROFILE_KEY = 'arthabiz_student_profile';

export function getUserStorageKey(profileOrName: StudentProfile | string | null): string {
  if (!profileOrName) return 'guest';
  const name = typeof profileOrName === 'string' ? profileOrName : profileOrName.name;
  const clean = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return clean || 'guest';
}

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse student profile', e);
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save student profile', e);
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (e) {
    console.error('Failed to clear student profile', e);
  }
}

export function getStoredDayProgress(dayNum: number, userKey?: string): DayProgress {
  const defaultProgress: DayProgress = {
    unlocked: false,
    answers: {},
    markedForReview: [],
    submitted: false,
    timeSpentSeconds: 0,
    score: 0,
    totalQuestions: 50,
  };

  const key = userKey || getUserStorageKey(getStoredProfile());
  try {
    const raw = localStorage.getItem(`arthabiz_user_${key}_day_${dayNum}`);
    if (!raw) {
      return defaultProgress;
    }
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch (e) {
    console.error(`Failed to parse progress for day ${dayNum}`, e);
    return defaultProgress;
  }
}

export function saveStoredDayProgress(
  dayNum: number,
  progress: DayProgress,
  userKey?: string
): void {
  const key = userKey || getUserStorageKey(getStoredProfile());
  try {
    localStorage.setItem(`arthabiz_user_${key}_day_${dayNum}`, JSON.stringify(progress));
  } catch (e) {
    console.error(`Failed to save progress for day ${dayNum}`, e);
  }
}

export function getAllDaysProgress(userKey?: string): Record<number, DayProgress> {
  const key = userKey || getUserStorageKey(getStoredProfile());
  const result: Record<number, DayProgress> = {};
  for (let d = 1; d <= 15; d++) {
    result[d] = getStoredDayProgress(d, key);
  }
  return result;
}

export function resetDayProgress(dayNum: number, userKey?: string): DayProgress {
  const key = userKey || getUserStorageKey(getStoredProfile());
  const current = getStoredDayProgress(dayNum, key);
  const resetState: DayProgress = {
    unlocked: current.unlocked, // Keep unlocked state so student doesn't need to re-enter passcode
    unlockedAt: current.unlockedAt,
    answers: {},
    markedForReview: [],
    submitted: false,
    timeSpentSeconds: 0,
    score: 0,
    totalQuestions: 50,
  };
  saveStoredDayProgress(dayNum, resetState, key);
  return resetState;
}

export function getStoredTrainerRoomUnlocked(userKey?: string): boolean {
  const key = userKey || getUserStorageKey(getStoredProfile());
  try {
    const raw = localStorage.getItem(`arthabiz_user_${key}_trainer_room_unlocked`);
    return raw === 'true';
  } catch (e) {
    return false;
  }
}

export function saveStoredTrainerRoomUnlocked(unlocked: boolean, userKey?: string): void {
  const key = userKey || getUserStorageKey(getStoredProfile());
  try {
    localStorage.setItem(`arthabiz_user_${key}_trainer_room_unlocked`, unlocked ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save trainer room unlock state', e);
  }
}
