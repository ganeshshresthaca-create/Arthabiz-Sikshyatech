import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { DayProgress, StudentProfile, UserRole } from '../types/accounting';

const ADMIN_EMAIL = 'ganeshshrestha.ca@gmail.com';
export const DEFAULT_STUDENT_PASSWORD = '@rthabiZ';
export const DEFAULT_TRAINER_PASSWORD = 'Sikshy@T';

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
}

function sanitizeAnswers(answers: Record<number, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!answers) return out;
  let count = 0;
  for (const [k, v] of Object.entries(answers)) {
    if (count >= 50) break;
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 3) {
      out[String(k)] = v;
      count++;
    }
  }
  return out;
}

function sanitizeMarkedForReview(list: number[] | undefined): number[] {
  if (!Array.isArray(list)) return [];
  const clean: number[] = [];
  for (const item of list) {
    if (clean.length >= 50) break;
    if (typeof item === 'number' && Number.isInteger(item) && item >= 1 && item <= 100) {
      clean.push(item);
    }
  }
  return clean;
}

function defaultDayProgress(): DayProgress {
  return {
    unlocked: false,
    answers: {},
    markedForReview: [],
    submitted: false,
    timeSpentSeconds: 0,
    score: 0,
    totalQuestions: 50,
  };
}

export function formatAuthErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  const msg = err instanceof Error ? err.message : String(err);

  if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
    return 'Email/Password sign-in is not yet enabled in Firebase Authentication Console. Please ask your institute admin to enable the Email/Password sign-in provider in Firebase Console, or use Sign In with Google.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/weak-password') {
    return 'Password must be at least 6 characters long.';
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Incorrect email or password. Use the institute default password for your first login, or click "Reset Password".';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please wait a few minutes or reset your password.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in window was closed before completing.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Pop-up was blocked by your browser. Please allow pop-ups or use Email + Password sign-in.';
  }
  if (code === 'auth/requires-recent-login') {
    return 'For security, please log out and sign back in before changing your password.';
  }
  return msg || 'Authentication failed. Please try again.';
}

export async function signInWithGooglePopup(): Promise<User> {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function signInWithInstituteCredentials(params: {
  email: string;
  password: string;
  fullName?: string;
  role: UserRole;
}): Promise<{ profile: StudentProfile; isFirstTimeSetup: boolean }> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPassword = params.password;
  const isStudentDefault = params.role === 'student' && cleanPassword === DEFAULT_STUDENT_PASSWORD;
  const isTrainerDefault = params.role === 'trainer' && cleanPassword === DEFAULT_TRAINER_PASSWORD;
  const isDefaultPassword = isStudentDefault || isTrainerDefault;

  let user: User;
  let isFirstTimeSetup = false;

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    user = cred.user;
  } catch (err) {
    const code = (err as { code?: string })?.code || '';
    const isNotFoundOrInvalid =
      code === 'auth/user-not-found' ||
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password';

    if (isNotFoundOrInvalid && isDefaultPassword) {
      // Auto-provision first-time institute user with the default password
      try {
        const created = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        user = created.user;
        isFirstTimeSetup = true;
        const derivedName = (
          params.fullName?.trim() ||
          cleanEmail.split('@')[0] ||
          'Candidate'
        ).slice(0, 100);
        await updateProfile(user, { displayName: derivedName });
      } catch (createErr) {
        const createCode = (createErr as { code?: string })?.code || '';
        if (createCode === 'auth/email-already-in-use') {
          throw new Error(
            'This email is already registered with an updated personal password. Enter your current password or click "Reset Password".'
          );
        }
        throw new Error(formatAuthErrorMessage(createErr));
      }
    } else {
      throw new Error(formatAuthErrorMessage(err));
    }
  }

  const profile = await ensureCloudUserProfile(
    user,
    params.fullName?.trim() || undefined,
    params.role,
    isDefaultPassword
  );

  return { profile, isFirstTimeSetup };
}

export async function sendInstitutePasswordReset(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Please enter your registered email address.');
  }
  try {
    await sendPasswordResetEmail(auth, cleanEmail);
  } catch (err) {
    throw new Error(formatAuthErrorMessage(err));
  }
}

export async function changeCurrentUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('No email-based account is currently signed in.');
  }
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  try {
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, newPassword);
  } catch (err) {
    throw new Error(formatAuthErrorMessage(err));
  }
}

export async function signOutFromCloud(): Promise<void> {
  await signOut(auth);
}

const profileSyncQueue = new Map<string, Promise<StudentProfile>>();
const dayWriteQueue = new Map<string, Promise<void>>();

export async function ensureCloudUserProfile(
  user: User,
  displayNameOverride?: string,
  requestedRole?: UserRole,
  usedDefaultPassword?: boolean
): Promise<StudentProfile> {
  const uid = sanitizeId(user.uid);

  const previous = profileSyncQueue.get(uid) || Promise.resolve(null as unknown as StudentProfile);
  const currentTask = previous
    .catch(() => null)
    .then(() =>
      executeEnsureCloudUserProfile(
        user,
        uid,
        displayNameOverride,
        requestedRole,
        usedDefaultPassword
      )
    );

  profileSyncQueue.set(uid, currentTask);
  try {
    return await currentTask;
  } finally {
    if (profileSyncQueue.get(uid) === currentTask) {
      profileSyncQueue.delete(uid);
    }
  }
}

async function executeEnsureCloudUserProfile(
  user: User,
  uid: string,
  displayNameOverride?: string,
  requestedRole?: UserRole,
  usedDefaultPassword?: boolean
): Promise<StudentProfile> {
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);

  const cleanName =
    (displayNameOverride || user.displayName || user.email?.split('@')[0] || 'Candidate')
      .trim()
      .slice(0, 100) || 'Candidate';
  const institution = 'Arthabiz | Sikshyatech Hub';
  const isBootstrappedAdmin = user.email === ADMIN_EMAIL && user.emailVerified;
  const providerId = user.providerData?.[0]?.providerId;
  const authMode: 'google' | 'email' = providerId === 'password' ? 'email' : 'google';

  let txOperation: OperationType = OperationType.GET;
  let txResult: { resolvedRole: UserRole; resolvedName: string } = {
    resolvedRole: 'student',
    resolvedName: cleanName,
  };

  try {
    txResult = await runTransaction(db, async (tx) => {
      txOperation = OperationType.GET;
      const snap = await tx.get(userRef);

      if (snap.exists()) {
        const existingProfile = snap.data() as {
          name?: string;
          role?: UserRole;
          institution?: string;
        };
        let roleVal: UserRole = existingProfile.role === 'trainer' ? 'trainer' : 'student';
        let nameVal = existingProfile.name || cleanName;

        const shouldUpdateName = Boolean(
          displayNameOverride &&
            displayNameOverride.trim() &&
            displayNameOverride.trim() !== existingProfile.name
        );
        const shouldPromoteAdmin =
          isBootstrappedAdmin && requestedRole === 'trainer' && existingProfile.role !== 'trainer';

        if (shouldUpdateName || shouldPromoteAdmin) {
          txOperation = OperationType.UPDATE;
          if (shouldUpdateName) nameVal = cleanName;
          if (shouldPromoteAdmin) roleVal = 'trainer';
          const updatePayload: Record<string, unknown> = {
            name: nameVal,
            institution,
            updatedAt: serverTimestamp(),
          };
          if (shouldPromoteAdmin) {
            updatePayload.role = roleVal;
          }
          tx.update(userRef, updatePayload);
        }
        return { resolvedRole: roleVal, resolvedName: nameVal };
      } else {
        const initialRole: UserRole =
          isBootstrappedAdmin && requestedRole === 'trainer' ? 'trainer' : 'student';
        txOperation = OperationType.CREATE;
        tx.set(userRef, {
          uid,
          name: cleanName,
          role: initialRole,
          institution,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { resolvedRole: initialRole, resolvedName: cleanName };
      }
    });
  } catch (error) {
    handleFirestoreError(error, txOperation, userPath);
  }

  const { resolvedRole, resolvedName } = txResult;

  if (user.email) {
    const privatePath = `users/${uid}/private/info`;
    const privateRef = doc(db, 'users', uid, 'private', 'info');
    try {
      const privSnap = await getDoc(privateRef);
      const safeEmail = user.email.slice(0, 160);
      if (!privSnap.exists()) {
        await setDoc(privateRef, {
          uid,
          email: safeEmail,
          updatedAt: serverTimestamp(),
        });
      } else if (privSnap.data().email !== safeEmail) {
        await updateDoc(privateRef, {
          email: safeEmail,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, privatePath);
    }
  }

  const effectiveRole: UserRole =
    requestedRole === 'trainer' || resolvedRole === 'trainer' ? 'trainer' : 'student';

  return {
    uid,
    name: resolvedName,
    email: user.email || undefined,
    role: effectiveRole,
    authMode,
    usedDefaultPassword: Boolean(usedDefaultPassword),
    institution,
    registeredAt: new Date().toISOString(),
  };
}

export interface InstituteUserSummary {
  uid: string;
  name: string;
  role: UserRole;
  institution: string;
}

export async function listInstituteUsersForAdmin(): Promise<InstituteUserSummary[]> {
  const path = 'users';
  try {
    const snap = await getDocs(collection(db, 'users'));
    const list: InstituteUserSummary[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        uid: String(d.uid || docSnap.id),
        name: String(d.name || 'Candidate'),
        role: d.role === 'trainer' ? 'trainer' : 'student',
        institution: String(d.institution || 'Arthabiz | Sikshyatech Hub'),
      });
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateUserRoleAsAdmin(
  targetUid: string,
  nextRole: UserRole
): Promise<void> {
  const safeUid = sanitizeId(targetUid);
  const userPath = `users/${safeUid}`;
  try {
    await updateDoc(doc(db, 'users', safeUid), {
      role: nextRole,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

function mapDocToDayProgress(data: Record<string, unknown>): DayProgress {
  const rawAnswers = (data.answers as Record<string, number>) || {};
  const numericAnswers: Record<number, number> = {};
  for (const [k, v] of Object.entries(rawAnswers)) {
    const numKey = Number(k);
    if (!Number.isNaN(numKey) && typeof v === 'number') {
      numericAnswers[numKey] = v;
    }
  }

  return {
    unlocked: Boolean(data.unlocked),
    unlockedAt: typeof data.unlockedAt === 'string' ? data.unlockedAt : undefined,
    answers: numericAnswers,
    markedForReview: Array.isArray(data.markedForReview)
      ? (data.markedForReview as number[])
      : [],
    submitted: Boolean(data.submitted),
    submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : undefined,
    timeSpentSeconds: typeof data.timeSpentSeconds === 'number' ? data.timeSpentSeconds : 0,
    score: typeof data.score === 'number' ? data.score : 0,
    totalQuestions: typeof data.totalQuestions === 'number' ? data.totalQuestions : 50,
  };
}

export async function loadCloudAllDaysProgress(uid: string): Promise<Record<number, DayProgress>> {
  const safeUid = sanitizeId(uid);
  const collPath = `users/${safeUid}/dayProgress`;
  const result: Record<number, DayProgress> = {};
  for (let d = 1; d <= 15; d++) {
    result[d] = defaultDayProgress();
  }

  try {
    const q = query(
      collection(db, 'users', safeUid, 'dayProgress'),
      where('userId', '==', safeUid)
    );
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const dayNum = Number(data.dayNumber);
      if (dayNum >= 1 && dayNum <= 15) {
        result[dayNum] = mapDocToDayProgress(data);
      }
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collPath);
  }
}

export function subscribeCloudDaysProgress(
  uid: string,
  onData: (progressMap: Record<number, DayProgress>) => void
): Unsubscribe {
  const safeUid = sanitizeId(uid);
  const collPath = `users/${safeUid}/dayProgress`;
  const q = query(
    collection(db, 'users', safeUid, 'dayProgress'),
    where('userId', '==', safeUid)
  );

  return onSnapshot(
    q,
    (snap) => {
      const result: Record<number, DayProgress> = {};
      for (let d = 1; d <= 15; d++) {
        result[d] = defaultDayProgress();
      }
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const dayNum = Number(data.dayNumber);
        if (dayNum >= 1 && dayNum <= 15) {
          result[dayNum] = mapDocToDayProgress(data);
        }
      });
      onData(result);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, collPath);
    }
  );
}

export async function saveCloudDayProgress(
  uid: string,
  dayNumber: number,
  progress: DayProgress
): Promise<void> {
  if (dayNumber < 1 || dayNumber > 15) return;
  const safeUid = sanitizeId(uid);
  const queueKey = `${safeUid}_day_${dayNumber}`;

  const previous = dayWriteQueue.get(queueKey) || Promise.resolve();
  const nextTask = previous
    .catch(() => undefined)
    .then(() => executeSaveCloudDayProgress(safeUid, dayNumber, progress));

  dayWriteQueue.set(queueKey, nextTask);
  try {
    await nextTask;
  } finally {
    if (dayWriteQueue.get(queueKey) === nextTask) {
      dayWriteQueue.delete(queueKey);
    }
  }
}

async function executeSaveCloudDayProgress(
  safeUid: string,
  dayNumber: number,
  progress: DayProgress
): Promise<void> {
  const dayId = `day_${dayNumber}`;
  const docPath = `users/${safeUid}/dayProgress/${dayId}`;
  const docRef = doc(db, 'users', safeUid, 'dayProgress', dayId);

  const clampedTime = Math.max(0, Math.min(86400, Math.floor(progress.timeSpentSeconds || 0)));
  const clampedScore = Math.max(0, Math.min(50, Math.floor(progress.score || 0)));
  const clampedTotal = Math.max(1, Math.min(100, Math.floor(progress.totalQuestions || 50)));
  const cleanAnswers = sanitizeAnswers(progress.answers);
  const cleanReview = sanitizeMarkedForReview(progress.markedForReview);

  let existingSnap;
  try {
    existingSnap = await getDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }

  if (!existingSnap.exists()) {
    const payload: Record<string, unknown> = {
      userId: safeUid,
      dayNumber,
      unlocked: Boolean(progress.unlocked),
      answers: cleanAnswers,
      markedForReview: cleanReview,
      submitted: Boolean(progress.submitted),
      timeSpentSeconds: clampedTime,
      score: clampedScore,
      totalQuestions: clampedTotal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (progress.unlockedAt) {
      payload.unlockedAt = progress.unlockedAt.slice(0, 64);
    }
    if (progress.submittedAt) {
      payload.submittedAt = progress.submittedAt.slice(0, 64);
    }

    try {
      await setDoc(docRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
    return;
  }

  const prev = existingSnap.data();

  if (!prev.unlocked && progress.unlocked) {
    const unlockPayload: Record<string, unknown> = {
      unlocked: true,
      unlockedAt: (progress.unlockedAt || new Date().toISOString()).slice(0, 64),
      updatedAt: serverTimestamp(),
    };
    try {
      await updateDoc(docRef, unlockPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
    return;
  }

  if (prev.submitted && !progress.submitted) {
    try {
      await updateDoc(docRef, {
        answers: {},
        markedForReview: [],
        submitted: false,
        submittedAt: '',
        timeSpentSeconds: 0,
        score: 0,
        totalQuestions: clampedTotal,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
    return;
  }

  if (!prev.submitted && progress.submitted) {
    try {
      await updateDoc(docRef, {
        answers: cleanAnswers,
        markedForReview: cleanReview,
        timeSpentSeconds: clampedTime,
        submitted: true,
        submittedAt: (progress.submittedAt || new Date().toISOString()).slice(0, 64),
        score: clampedScore,
        totalQuestions: clampedTotal,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
    return;
  }

  if (!prev.submitted && !progress.submitted) {
    try {
      await updateDoc(docRef, {
        answers: cleanAnswers,
        markedForReview: cleanReview,
        timeSpentSeconds: clampedTime,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  }
}

export async function loadCloudScratchpad(uid: string): Promise<string | null> {
  const safeUid = sanitizeId(uid);
  const notePath = `users/${safeUid}/notes/scratchpad`;
  try {
    const snap = await getDoc(doc(db, 'users', safeUid, 'notes', 'scratchpad'));
    if (snap.exists()) {
      const data = snap.data();
      return typeof data.content === 'string' ? data.content : null;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, notePath);
  }
}

export async function saveCloudScratchpad(uid: string, content: string): Promise<void> {
  const safeUid = sanitizeId(uid);
  const notePath = `users/${safeUid}/notes/scratchpad`;
  const noteRef = doc(db, 'users', safeUid, 'notes', 'scratchpad');
  const safeContent = content.slice(0, 10000);

  let snap;
  try {
    snap = await getDoc(noteRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, notePath);
  }

  if (!snap.exists()) {
    try {
      await setDoc(noteRef, {
        userId: safeUid,
        content: safeContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, notePath);
    }
  } else {
    try {
      await updateDoc(noteRef, {
        content: safeContent,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, notePath);
    }
  }
}
