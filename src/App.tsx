/**
 * Arthabiz | Sikshyatech Hub
 * 15-Day Practical Accounting Daily Practice Portal (50 Transactions/Day)
 * Android-Installable PWA with Online Firebase Cloud Sync
 */

import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  StudentProfile,
  DayProgress,
  DayModule,
  ViewTab,
  AppSection,
} from './types/accounting';
import { ALL_DAY_MODULES } from './data/modulesData';
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  getStoredDayProgress,
  saveStoredDayProgress,
  getAllDaysProgress,
  resetDayProgress,
  getUserStorageKey,
} from './utils/storage';
import { auth } from './lib/firebase';
import {
  ensureCloudUserProfile,
  loadCloudAllDaysProgress,
  saveCloudDayProgress,
  signOutFromCloud,
  subscribeCloudDaysProgress,
} from './services/cloudProgress';

import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { PasscodeModal } from './components/PasscodeModal';
import { TrainerKeyModal } from './components/TrainerKeyModal';
import { MCQPracticeArena } from './components/MCQPracticeArena';
import { ResultsAnalyticsModal } from './components/ResultsAnalyticsModal';
import { JournalEntriesReport } from './components/JournalEntriesReport';
import { DayBookReport } from './components/DayBookReport';
import { QuestionOnlyDownloadModal } from './components/QuestionOnlyDownloadModal';
import { DaySelectorView } from './components/DaySelectorView';
import { StudyLibrary } from './components/StudyLibrary';
import { MemoryLab } from './components/MemoryLab';
import { StudyPathDashboard } from './components/StudyPathDashboard';
import { TrainersRoom } from './components/TrainersRoom';
import { TrainerPasscodeGateModal } from './components/TrainerPasscodeGateModal';
import { AccountPasswordModal } from './components/AccountPasswordModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { downloadQuestionPaper } from './utils/documentExport';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentSection, setCurrentSection] = useState<AppSection>('path_selector');
  const [isTrainerPasscodeModalOpen, setIsTrainerPasscodeModalOpen] = useState(false);

  const [currentDayNum, setCurrentDayNum] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<ViewTab>('practice');

  const [allProgress, setAllProgress] = useState<Record<number, DayProgress>>({});
  const [currentProgress, setCurrentProgress] = useState<DayProgress>(
    getStoredDayProgress(1)
  );

  const [passcodeModalModule, setPasscodeModalModule] = useState<DayModule | null>(null);
  const [isTrainerKeyModalOpen, setIsTrainerKeyModalOpen] = useState(false);
  const [isQuestionOnlyOpen, setIsQuestionOnlyOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [showCatalogView, setShowCatalogView] = useState(true);

  const timerSyncDebounceRef = useRef<number | null>(null);
  const lastCloudSnapshotRef = useRef<Record<number, string>>({});

  // Boot: restore local profile and subscribe to Firebase Auth state
  useEffect(() => {
    const storedProf = getStoredProfile();
    if (storedProf && storedProf.authMode !== 'google') {
      setProfile(storedProf);
      const userKey = getUserStorageKey(storedProf);
      const loadedAll = getAllDaysProgress(userKey);
      setAllProgress(loadedAll);
      setCurrentProgress(loadedAll[1] || getStoredDayProgress(1, userKey));
      setIsLoaded(true);
    }

    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (firebaseUser) {
        try {
          const prevStored = getStoredProfile();
          const preferredRole =
            prevStored?.uid === firebaseUser.uid ? prevStored.role : undefined;
          const usedDefault =
            prevStored?.uid === firebaseUser.uid ? prevStored.usedDefaultPassword : undefined;
          const cloudProfile = await ensureCloudUserProfile(
            firebaseUser,
            undefined,
            preferredRole,
            usedDefault
          );
          setProfile(cloudProfile);
          saveStoredProfile(cloudProfile);

          const userKey = getUserStorageKey(cloudProfile);
          const initialCloud = await loadCloudAllDaysProgress(firebaseUser.uid);

          // Merge any local-only unlocks/answers if cloud record is empty
          for (let d = 1; d <= 15; d++) {
            saveStoredDayProgress(d, initialCloud[d], userKey);
          }

          setAllProgress(initialCloud);
          setCurrentProgress(initialCloud[currentDayNum] || initialCloud[1]);

          unsubscribeFirestore = subscribeCloudDaysProgress(
            firebaseUser.uid,
            (cloudMap) => {
              setAllProgress(cloudMap);
              for (let d = 1; d <= 15; d++) {
                saveStoredDayProgress(d, cloudMap[d], userKey);
              }
              setCurrentProgress((prev) => cloudMap[currentDayNum] || prev);
            }
          );
        } catch (err) {
          console.error('Failed to sync Firebase profile:', err);
          if (storedProf) {
            setProfile(storedProf);
            const userKey = getUserStorageKey(storedProf);
            const loadedAll = getAllDaysProgress(userKey);
            setAllProgress(loadedAll);
            setCurrentProgress(loadedAll[1] || getStoredDayProgress(1, userKey));
          }
        } finally {
          setIsLoaded(true);
        }
      } else {
        if (!storedProf || storedProf.authMode !== 'local') {
          clearStoredProfile();
          setProfile(null);
          setAllProgress({});
          setCurrentProgress(getStoredDayProgress(1, 'guest'));
        }
        setIsLoaded(true);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
      if (timerSyncDebounceRef.current) {
        window.clearTimeout(timerSyncDebounceRef.current);
      }
    };
  }, []);

  // Sync current day progress whenever currentDayNum or profile changes
  useEffect(() => {
    if (!profile) return;
    const userKey = getUserStorageKey(profile);
    const prog = allProgress[currentDayNum] || getStoredDayProgress(currentDayNum, userKey);
    setCurrentProgress(prog);
  }, [currentDayNum, profile, allProgress]);

  const activeModule: DayModule =
    ALL_DAY_MODULES.find((m) => m.dayNumber === currentDayNum) || ALL_DAY_MODULES[0];

  const handleLogin = async (userProfile: StudentProfile) => {
    setProfile(userProfile);
    saveStoredProfile(userProfile);
    const userKey = getUserStorageKey(userProfile);

    if (userProfile.uid && userProfile.authMode !== 'local') {
      try {
        const cloudProgress = await loadCloudAllDaysProgress(userProfile.uid);
        for (let d = 1; d <= 15; d++) {
          saveStoredDayProgress(d, cloudProgress[d], userKey);
        }
        setAllProgress(cloudProgress);
        setCurrentProgress(cloudProgress[1]);
      } catch (err) {
        console.error('Failed loading cloud progress on login:', err);
        const fallback = getAllDaysProgress(userKey);
        setAllProgress(fallback);
        setCurrentProgress(fallback[1] || getStoredDayProgress(1, userKey));
      }
    } else {
      const userProgress = getAllDaysProgress(userKey);
      setAllProgress(userProgress);
      setCurrentProgress(userProgress[1] || getStoredDayProgress(1, userKey));
    }

    setCurrentDayNum(1);
    setCurrentSection('path_selector');
    setShowCatalogView(true);
    setActiveTab('practice');
  };

  const handleLogout = async () => {
    if (profile?.authMode !== 'local') {
      try {
        await signOutFromCloud();
      } catch (err) {
        console.error('Error signing out from Cloud Auth:', err);
      }
    }
    clearStoredProfile();
    setProfile(null);
    setAllProgress({});
    setCurrentProgress(getStoredDayProgress(1, 'guest'));
    setCurrentDayNum(1);
    setCurrentSection('path_selector');
    setShowCatalogView(true);
    setActiveTab('practice');
  };

  const handleSelectSection = (section: AppSection) => {
    if (section === 'trainers_room') {
      if (profile?.role === 'trainer') {
        setCurrentSection('trainers_room');
      } else {
        setIsTrainerPasscodeModalOpen(true);
      }
      return;
    }
    setCurrentSection(section);
  };

  const handleTrainerPasscodeSuccess = () => {
    setIsTrainerPasscodeModalOpen(false);
    setCurrentSection('trainers_room');
  };

  const handleSelectDay = (dayNum: number) => {
    const targetModule = ALL_DAY_MODULES.find((m) => m.dayNumber === dayNum);
    if (!targetModule) return;

    const userKey = getUserStorageKey(profile);
    const prog = allProgress[dayNum] || getStoredDayProgress(dayNum, userKey);

    if (!prog.unlocked) {
      setPasscodeModalModule(targetModule);
      return;
    }

    setCurrentDayNum(dayNum);
    setCurrentProgress(prog);
    setShowCatalogView(false);
    setActiveTab('practice');
  };

  const syncDayToCloud = (dayNum: number, nextProg: DayProgress, immediate: boolean) => {
    if (!profile?.uid || profile.authMode === 'local') return;

    const coreSignature = JSON.stringify({
      unlocked: nextProg.unlocked,
      answers: nextProg.answers,
      markedForReview: nextProg.markedForReview,
      submitted: nextProg.submitted,
      score: nextProg.score,
    });

    const prevSig = lastCloudSnapshotRef.current[dayNum];
    const hasCoreChange = prevSig !== coreSignature;

    if (immediate || hasCoreChange) {
      lastCloudSnapshotRef.current[dayNum] = coreSignature;
      if (timerSyncDebounceRef.current) {
        window.clearTimeout(timerSyncDebounceRef.current);
        timerSyncDebounceRef.current = null;
      }
      saveCloudDayProgress(profile.uid, dayNum, nextProg).catch((err) =>
        console.error(`Cloud sync failed for Day ${dayNum}:`, err)
      );
      return;
    }

    // Debounce pure timer ticks to every 15 seconds to respect Firestore write quotas
    if (!timerSyncDebounceRef.current) {
      timerSyncDebounceRef.current = window.setTimeout(() => {
        timerSyncDebounceRef.current = null;
        if (profile?.uid) {
          saveCloudDayProgress(profile.uid, dayNum, nextProg).catch((err) =>
            console.error(`Debounced cloud timer sync failed for Day ${dayNum}:`, err)
          );
        }
      }, 15000);
    }
  };

  const handleUnlockDay = (dayNum: number) => {
    const userKey = getUserStorageKey(profile);
    const current = allProgress[dayNum] || getStoredDayProgress(dayNum, userKey);
    const updated: DayProgress = {
      ...current,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    };

    saveStoredDayProgress(dayNum, updated, userKey);
    setAllProgress((prev) => ({ ...prev, [dayNum]: updated }));
    setCurrentDayNum(dayNum);
    setCurrentProgress(updated);
    syncDayToCloud(dayNum, updated, true);
  };

  const handleUnlockAllDays = () => {
    const userKey = getUserStorageKey(profile);
    const updatedRecord: Record<number, DayProgress> = {};
    for (let d = 1; d <= 15; d++) {
      const current = allProgress[d] || getStoredDayProgress(d, userKey);
      const updated: DayProgress = {
        ...current,
        unlocked: true,
        unlockedAt: current.unlockedAt || new Date().toISOString(),
      };
      saveStoredDayProgress(d, updated, userKey);
      updatedRecord[d] = updated;
      if (!current.unlocked) {
        syncDayToCloud(d, updated, true);
      }
    }
    setAllProgress(updatedRecord);
    setCurrentProgress(updatedRecord[currentDayNum]);
  };

  const handleUpdateProgress = (newProg: DayProgress) => {
    const userKey = getUserStorageKey(profile);
    setCurrentProgress(newProg);
    saveStoredDayProgress(currentDayNum, newProg, userKey);
    setAllProgress((prev) => ({ ...prev, [currentDayNum]: newProg }));
    syncDayToCloud(currentDayNum, newProg, false);
  };

  const handleSubmitSession = () => {
    let score = 0;
    activeModule.questions.forEach((q) => {
      const chosen = currentProgress.answers[q.id];
      if (chosen === q.correctOptionIndex) {
        score += 1;
      }
    });

    const submittedState: DayProgress = {
      ...currentProgress,
      submitted: true,
      submittedAt: new Date().toISOString(),
      score,
      totalQuestions: activeModule.questions.length,
    };

    const userKey = getUserStorageKey(profile);
    setCurrentProgress(submittedState);
    saveStoredDayProgress(currentDayNum, submittedState, userKey);
    setAllProgress((prev) => ({ ...prev, [currentDayNum]: submittedState }));
    syncDayToCloud(currentDayNum, submittedState, true);
    setActiveTab('results');
  };

  const handleResetSession = () => {
    const userKey = getUserStorageKey(profile);
    const resetState = resetDayProgress(currentDayNum, userKey);
    setCurrentProgress(resetState);
    setAllProgress((prev) => ({ ...prev, [currentDayNum]: resetState }));
    syncDayToCloud(currentDayNum, resetState, true);
    setActiveTab('practice');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-lg shadow-lg animate-pulse">
          AS
        </div>
        <div className="font-bold text-sm">Loading Arthabiz App...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <OfflineIndicator />
      </>
    );
  }

  const handleToggleCatalogView = (showCatalog: boolean) => {
    if (!showCatalog) {
      const userKey = getUserStorageKey(profile);
      const prog = allProgress[currentDayNum] || getStoredDayProgress(currentDayNum, userKey);
      if (!prog.unlocked) {
        const targetModule = ALL_DAY_MODULES.find((m) => m.dayNumber === currentDayNum);
        if (targetModule) {
          setPasscodeModalModule(targetModule);
          return;
        }
      }
    }
    setShowCatalogView(showCatalog);
  };

  const unlockedMap: Record<number, boolean> = {};
  for (let d = 1; d <= 15; d++) {
    unlockedMap[d] = !!allProgress[d]?.unlocked;
  }

  const isTrainer = profile.role === 'trainer';

  return (
    <div
      id="main-app-container"
      className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col pb-16 md:pb-0"
    >
      <Navbar
        currentDay={currentDayNum}
        onSelectDay={handleSelectDay}
        unlockedDays={unlockedMap}
        studentProfile={profile}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onRequestUnlock={(dayNum) => {
          const mod = ALL_DAY_MODULES.find((m) => m.dayNumber === dayNum);
          if (mod) setPasscodeModalModule(mod);
        }}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab !== 'practice' && !currentProgress.submitted) {
            return;
          }
          setShowCatalogView(false);
          setActiveTab(tab);
        }}
        isDaySubmitted={!!currentProgress.submitted}
        onLogout={handleLogout}
        showCatalogView={showCatalogView}
        onToggleCatalogView={handleToggleCatalogView}
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
      />

      {profile.usedDefaultPassword && profile.authMode === 'email' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-center gap-3 flex-wrap print:hidden">
          <span>
            You are signed in with the institute default password. Set your own personal password to secure your account.
          </span>
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition cursor-pointer"
          >
            Set Personal Password
          </button>
        </div>
      )}

      <main className="flex-1">
        {currentSection === 'path_selector' ? (
          <StudyPathDashboard
            studentProfile={profile}
            onSelectPath={handleSelectSection}
          />
        ) : currentSection === 'study_library' ? (
          <StudyLibrary
            onGoToTestArena={(dayNum) => {
              setCurrentSection('test_arena');
              if (dayNum) handleSelectDay(dayNum);
            }}
            onGoToMemoryLab={() => setCurrentSection('memory_lab')}
            onGoBack={() => handleSelectSection('path_selector')}
          />
        ) : currentSection === 'memory_lab' ? (
          <MemoryLab
            onGoToTestArena={(dayNum) => {
              setCurrentSection('test_arena');
              if (dayNum) handleSelectDay(dayNum);
            }}
            onGoToStudyLibrary={() => setCurrentSection('study_library')}
          />
        ) : currentSection === 'trainers_room' ? (
          <TrainersRoom
            studentProfile={profile}
            onSelectSection={handleSelectSection}
            onGoToDayInPractice={(dayNum) => {
              handleSelectDay(dayNum);
              setCurrentSection('test_arena');
              setShowCatalogView(false);
            }}
            allProgress={allProgress}
            onUnlockDay={handleUnlockDay}
            onUnlockAllDays={handleUnlockAllDays}
          />
        ) : showCatalogView ? (
          <DaySelectorView
            modules={ALL_DAY_MODULES}
            allProgress={allProgress}
            currentDay={currentDayNum}
            onSelectDay={handleSelectDay}
            onRequestUnlock={(m) => setPasscodeModalModule(m)}
            onOpenTrainerKeys={() => setIsTrainerKeyModalOpen(true)}
            studentProfile={profile}
            onDownloadQuestionPaper={(m) =>
              downloadQuestionPaper(m, profile?.name || 'Student')
            }
            onOpenTrainersRoom={() => handleSelectSection('trainers_room')}
          />
        ) : (
          <>
            {activeTab === 'practice' && (
              <MCQPracticeArena
                dayModule={activeModule}
                progress={currentProgress}
                onUpdateProgress={handleUpdateProgress}
                onSubmitSession={handleSubmitSession}
                onResetSession={handleResetSession}
                onOpenQuestionOnly={() => setIsQuestionOnlyOpen(true)}
                studentProfile={profile}
                onBackToCatalog={() => setShowCatalogView(true)}
                onRequestUnlock={(m) => setPasscodeModalModule(m)}
              />
            )}

            {activeTab === 'results' && currentProgress.submitted && (
              <ResultsAnalyticsModal
                dayModule={activeModule}
                progress={currentProgress}
                studentProfile={profile}
                onSelectTab={setActiveTab}
                onRetake={handleResetSession}
              />
            )}

            {activeTab === 'journal' && currentProgress.submitted && (
              <JournalEntriesReport
                dayModule={activeModule}
                studentProfile={profile}
              />
            )}

            {activeTab === 'daybook' && currentProgress.submitted && (
              <DayBookReport
                dayModule={activeModule}
                studentProfile={profile}
              />
            )}

            {activeTab !== 'practice' && !currentProgress.submitted && (
              <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-amber-200 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  !
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Assessment Not Yet Submitted
                </h2>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
                  You must complete and submit the Day {currentDayNum} practice assessment before viewing Result Analytics, Journal Entries Solution, or Day Book.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition"
                >
                  Return to Practice Arena
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {passcodeModalModule && (
        <PasscodeModal
          isOpen={!!passcodeModalModule}
          dayModule={passcodeModalModule}
          onUnlock={handleUnlockDay}
          onClose={() => setPasscodeModalModule(null)}
          isTrainer={isTrainer}
        />
      )}

      {isTrainer && (
        <TrainerKeyModal
          isOpen={isTrainerKeyModalOpen}
          onClose={() => setIsTrainerKeyModalOpen(false)}
          onUnlockAll={handleUnlockAllDays}
          onUnlockSpecific={handleUnlockDay}
          unlockedDays={unlockedMap}
        />
      )}

      <QuestionOnlyDownloadModal
        isOpen={isQuestionOnlyOpen}
        onClose={() => setIsQuestionOnlyOpen(false)}
        dayModule={activeModule}
        studentProfile={profile}
      />

      <TrainerPasscodeGateModal
        isOpen={isTrainerPasscodeModalOpen}
        onClose={() => setIsTrainerPasscodeModalOpen(false)}
        onSuccess={handleTrainerPasscodeSuccess}
        candidateName={profile?.name}
      />

      <AccountPasswordModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        profile={profile}
        onPasswordChanged={() => {
          const updated = { ...profile, usedDefaultPassword: false };
          setProfile(updated);
          saveStoredProfile(updated);
        }}
      />

      <OfflineIndicator />
    </div>
  );
}
