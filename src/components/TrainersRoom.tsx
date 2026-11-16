import React, { useState, useEffect } from 'react';
import {
  StudentProfile,
  DayProgress,
  AppSection
} from '../types/accounting';
import { ALL_DAY_MODULES, DAY_CONFIGS } from '../data/modulesData';
import { DEFAULT_TRAINER_PASSCODE } from './LoginPage';
import {
  KeyRound,
  Check,
  Copy,
  Unlock,
  Lock,
  Coffee,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Lamp,
  Clock,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Download,
  Plus,
  Pin,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Layers,
  ArrowLeft,
  CheckCircle2,
  FolderOpen,
  Sparkles,
  Award,
  Music,
  Radio,
  ExternalLink,
  X
} from 'lucide-react';
import { downloadQuestionPaper } from '../utils/documentExport';
import { downloadSalesRegisterExcel } from '../utils/vatExcelGenerator';
import { SALES_INVOICES_150 } from '../data/salesInvoices150Data';
import { RAPID_FIRE_100_QUESTIONS } from '../data/rapidFire100Data';
import { IRD_REVENUE_CODES } from '../data/irdRevenueCodes';
import { MASTER_CHART_OF_ACCOUNTS } from '../data/chartOfAccountsData';
import { loadCloudScratchpad, saveCloudScratchpad } from '../services/cloudProgress';

/* ========================================================================= */
/* Self-Contained Web Audio Procedural Sound Engine for Trainer's Room       */
/* ========================================================================= */
let audioCtx: AudioContext | null = null;
let ambientGain: GainNode | null = null;
let ambientSource: AudioNode | null = null;
let ambientTimer: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext not supported or blocked', e);
    return null;
  }
}

function playChimeBell(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 1.8);
  } catch (e) {
    console.warn('Failed to play chime bell', e);
  }
}

function playCoffeePourSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const duration = 2.0;
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(900, now + 1.0);
    filter.frequency.linearRampToValueAtTime(300, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 1.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  } catch (e) {
    console.warn('Failed to play coffee pour sound', e);
  }
}

function playMarkerTap(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    // Ignore
  }
}

function stopAmbientSound(): void {
  if (ambientTimer) {
    window.clearInterval(ambientTimer);
    ambientTimer = null;
  }
  if (ambientSource) {
    try {
      (ambientSource as AudioScheduledSourceNode).stop?.();
      ambientSource.disconnect();
    } catch (e) {
      // Ignore
    }
    ambientSource = null;
  }
  if (ambientGain) {
    try {
      ambientGain.disconnect();
    } catch (e) {
      // Ignore
    }
    ambientGain = null;
  }
}

function startAmbientSound(mode: 'rain' | 'clock' | 'hum', volume = 0.08): void {
  stopAmbientSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (mode === 'clock') {
      ambientTimer = window.setInterval(() => {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);
        gain.gain.setValueAtTime(volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
      }, 1000);
      return;
    }

    if (mode === 'rain' || mode === 'hum') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        data[i] = (b0 + b1 + b2) * 0.4;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      if (mode === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      ambientSource = source;
      ambientGain = gain;
    }
  } catch (e) {
    console.warn('Failed to start ambient audio', e);
  }
}

interface Props {
  studentProfile: StudentProfile | null;
  onSelectSection: (section: AppSection) => void;
  onGoToDayInPractice: (dayNum: number) => void;
  allProgress: Record<number, DayProgress>;
  onUnlockDay: (dayNum: number) => void;
  onUnlockAllDays: () => void;
}

type RoomStation = 'workstation' | 'whiteboard' | 'notices' | 'bookshelf' | 'downloads' | 'consultation';
type LightMode = 'warm' | 'daylight' | 'evening';
type AmbientSoundType = 'off' | 'gajhal' | 'rain' | 'clock' | 'hum';

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  author: string;
  category: 'Exam' | 'Compliance' | 'Workshop' | 'Curriculum';
  content: string;
  pinned: boolean;
}

const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'n1',
    title: 'Mandatory VAT Register Submission Guidelines',
    date: '2083-06-15',
    author: 'Chief Faculty — Direct Taxation',
    category: 'Compliance',
    content: 'All candidates completing Day 8 must generate both Anusuchi 8 (Sales Register) and Anusuchi 9 (Purchase Register). Ensure taxable and tax-exempt purchases are categorized separately.',
    pinned: true,
  },
  {
    id: 'n2',
    title: 'Mid-Curriculum MCQ Rapid-Fire Assessment',
    date: '2083-06-18',
    author: 'Examination Controller',
    category: 'Exam',
    content: 'Students attempting Day 1 to Day 8 should achieve at least 85% accuracy in double-entry classifications before advancing to Year-End Adjustments (Day 9 to Day 15).',
    pinned: true,
  },
  {
    id: 'n3',
    title: 'Nepal IRD e-TDS Deposit Deadline Notice',
    date: '2083-06-20',
    author: 'Faculty of Corporate Auditing',
    category: 'Compliance',
    content: 'Reminder as per Income Tax Act 2058: Withholding tax under Section 87 (Employment), Section 88 (Rent/Service) and Section 89 (Contract) must be deposited within 25 days following the end of each Nepali month.',
    pinned: false,
  },
];

export const TrainersRoom: React.FC<Props> = ({
  studentProfile,
  onSelectSection,
  onGoToDayInPractice,
  allProgress,
  onUnlockDay,
  onUnlockAllDays,
}) => {
  const isTrainer = studentProfile?.role === 'trainer';
  const candidateName = studentProfile?.name || 'Faculty Member';

  // Room State
  const [activeStation, setActiveStation] = useState<RoomStation>('workstation');
  const [lightMode, setLightMode] = useState<LightMode>('warm');
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('off');
  const [isGajhalPlayerOpen, setIsGajhalPlayerOpen] = useState(false);

  // Selected curriculum day inside trainer console
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const selectedConfig = DAY_CONFIGS.find((d) => d.dayNum === selectedDayNum) || DAY_CONFIGS[0];

  // Copied passcode state
  const [copiedDay, setCopiedDay] = useState<number | string | null>(null);

  // Scratchpad / Trainer diary
  const [scratchpadText, setScratchpadText] = useState(() => {
    return localStorage.getItem('arthabiz_trainer_scratchpad') ||
      '• Day 8 VAT reconciliation session scheduled for 2:00 PM.\n• Check students double-entry on Advance Salary vs Prepaid Rent.\n• Review Section 88 TDS withholding threshold with batch A.';
  });

  // Whiteboard State
  const [whiteboardPreset, setWhiteboardPreset] = useState<'golden_rules' | 'vat_rules' | 'tds_matrix' | 'trial_balance' | 'custom'>('golden_rules');
  const [customWhiteboardNotes, setCustomWhiteboardNotes] = useState(
    'LECTURE NOTES — SIKSHYATECH HUB\n=====================================\nTopic: Double-Entry Balancing & Capital vs Revenue Expenditures\n\n1. Always debit the specific asset account, never "Purchase A/C" when acquiring capital machinery.\n2. Installation and freight before putting asset into use are CAPITALIZED.\n3. VAT paid on purchase of motor cars is NOT creditable for trading entities (VAT Act Schedule).\n\nAction: Have all students verify Journal Entries Solution for Day 8.'
  );
  const [markerColor, setMarkerColor] = useState<'black' | 'blue' | 'red' | 'green'>('blue');

  // Notices
  const [notices, setNotices] = useState<NoticeItem[]>(DEFAULT_NOTICES);
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Exam' | 'Compliance' | 'Workshop' | 'Curriculum'>('Curriculum');

  // Statutory Book Drawer
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  // Student queries state
  const [consultationQuestions, setConsultationQuestions] = useState([
    {
      id: 'q1',
      student: 'Rohan Sharma',
      topic: 'Advance Salary vs Salary Expense',
      query: 'Why is Advance Salary debited to an Asset Account instead of Salary Expense at the time of payment?',
      trainerAnswer: 'Because the benefit of employee services has not yet been consumed. Under accrual accounting matching principles, it remains a current asset (prepaid benefit) until the payroll month is earned and adjusted.',
      date: '2083-06-14',
    },
    {
      id: 'q2',
      student: 'Sunita Thapa',
      topic: 'VAT on Purchase Returns',
      query: 'When goods purchased on credit with 13% VAT are returned, how does the Debit Note affect the VAT ledger?',
      trainerAnswer: 'When goods are returned, Input VAT claimed earlier must be reversed. We debit the Supplier (Total) and credit Purchase Returns (Taxable Base) and credit VAT Input / VAT Receivable (13%).',
      date: '2083-06-15',
    },
    {
      id: 'q3',
      student: 'Bibek Adhikari',
      topic: 'TDS on Office Rent Payment',
      query: 'Is office rent paid to an individual house owner subject to 10% TDS or municipal house rent tax?',
      trainerAnswer: 'Under Section 88 of Income Tax Act 2058, rent paid to natural persons is subject to 10% withholding tax by corporate tenants, unless the local municipal government specifically collects house rent tax as per local authority guidelines.',
      date: '2083-06-16',
    },
  ]);
  const [newStudentName, setNewStudentName] = useState(candidateName);
  const [newQueryTopic, setNewQueryTopic] = useState('');
  const [newQueryText, setNewQueryText] = useState('');
  const [querySubmitted, setQuerySubmitted] = useState(false);

  // Load cloud scratchpad when signed in to a cloud account
  useEffect(() => {
    if (!studentProfile?.uid || studentProfile.authMode === 'local') return;
    let active = true;
    loadCloudScratchpad(studentProfile.uid)
      .then((cloudText) => {
        if (active && cloudText !== null) {
          setScratchpadText(cloudText);
        }
      })
      .catch((err) => console.error('Failed to load cloud scratchpad:', err));
    return () => {
      active = false;
    };
  }, [studentProfile?.uid, studentProfile?.authMode]);

  // Save scratchpad locally and debounced to Firestore
  useEffect(() => {
    localStorage.setItem('arthabiz_trainer_scratchpad', scratchpadText);
    if (!studentProfile?.uid || studentProfile.authMode === 'local') return;
    const uid = studentProfile.uid;
    const timer = window.setTimeout(() => {
      saveCloudScratchpad(uid, scratchpadText).catch((err) =>
        console.error('Failed to sync cloud scratchpad:', err)
      );
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [scratchpadText, studentProfile?.uid, studentProfile?.authMode]);

  // Audio ambient effect
  useEffect(() => {
    if (ambientSound === 'off' || ambientSound === 'gajhal') {
      stopAmbientSound();
    } else {
      stopAmbientSound();
      startAmbientSound(ambientSound);
    }
    return () => {
      stopAmbientSound();
    };
  }, [ambientSound]);

  const handleCopyPasscode = (code: string, day: number | string) => {
    navigator.clipboard.writeText(code);
    setCopiedDay(day);
    playMarkerTap();
    setTimeout(() => setCopiedDay(null), 1500);
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    const newNotice: NoticeItem = {
      id: `notice_${Date.now()}`,
      title: newNoticeTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      author: isTrainer ? `${candidateName} (Faculty)` : `${candidateName} (Candidate Inquiry)`,
      category: newNoticeCategory,
      content: newNoticeContent.trim(),
      pinned: false,
    };

    setNotices([newNotice, ...notices]);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setIsAddingNotice(false);
    playMarkerTap();
  };

  const handleAddStudentQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQueryTopic.trim() || !newQueryText.trim()) return;

    const newQ = {
      id: `q_${Date.now()}`,
      student: newStudentName || 'Candidate',
      topic: newQueryTopic.trim(),
      query: newQueryText.trim(),
      trainerAnswer: 'Pending instructor review in today’s office hour consultation.',
      date: new Date().toISOString().split('T')[0],
    };

    setConsultationQuestions([newQ, ...consultationQuestions]);
    setNewQueryTopic('');
    setNewQueryText('');
    setQuerySubmitted(true);
    playMarkerTap();
    setTimeout(() => setQuerySubmitted(false), 3000);
  };

  // Lighting overlay style based on mode
  const lightBgStyle =
    lightMode === 'warm'
      ? 'bg-amber-950/20'
      : lightMode === 'evening'
      ? 'bg-slate-950/45'
      : 'bg-transparent';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Breadcrumb & Room Plaque */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectSection('path_selector')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Study Paths</span>
            </button>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 font-bold tracking-wide uppercase text-[10px]">
                Faculty Executive Suite
              </span>
            </div>
          </div>

          {/* Room Atmosphere & Controls Bar */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Lighting Mode Selector */}
            <div className="inline-flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
              <button
                type="button"
                onClick={() => setLightMode('warm')}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                  lightMode === 'warm'
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Warm Banker's Lamp Ambiance"
              >
                <Lamp className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">Warm Lamp</span>
              </button>
              <button
                type="button"
                onClick={() => setLightMode('daylight')}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                  lightMode === 'daylight'
                    ? 'bg-sky-500/20 text-sky-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Bright Daylight Studio"
              >
                <Sun className="w-3 h-3 text-sky-400" />
                <span className="hidden md:inline">Daylight</span>
              </button>
              <button
                type="button"
                onClick={() => setLightMode('evening')}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                  lightMode === 'evening'
                    ? 'bg-purple-500/20 text-purple-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Evening Seminar Mode"
              >
                <Moon className="w-3 h-3 text-purple-400" />
                <span className="hidden md:inline">Evening</span>
              </button>
            </div>

            {/* Ambient Audio Toggle with Gajhals Radio */}
            <div className="inline-flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  if (ambientSound === 'off') {
                    setAmbientSound('gajhal');
                    setIsGajhalPlayerOpen(true);
                  } else if (ambientSound === 'gajhal') {
                    setAmbientSound('rain');
                    setIsGajhalPlayerOpen(false);
                  } else if (ambientSound === 'rain') {
                    setAmbientSound('clock');
                    setIsGajhalPlayerOpen(false);
                  } else if (ambientSound === 'clock') {
                    setAmbientSound('hum');
                    setIsGajhalPlayerOpen(false);
                  } else {
                    setAmbientSound('off');
                    setIsGajhalPlayerOpen(false);
                  }
                }}
                className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  ambientSound !== 'off'
                    ? ambientSound === 'gajhal'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Audio: Nepali Gajhals (गजल), Rain, Clock, Hum or Off"
              >
                {ambientSound === 'gajhal' ? (
                  <Music className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                ) : ambientSound !== 'off' ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>
                  {ambientSound === 'off'
                    ? 'Audio: Off'
                    : ambientSound === 'gajhal'
                    ? 'Gajhals (गजल)'
                    : ambientSound === 'rain'
                    ? 'Rain Ambience'
                    : ambientSound === 'clock'
                    ? 'Clock Ticks'
                    : 'Library Hum'}
                </span>
              </button>
            </div>

            {/* Role Badge (Trainer only) */}
            {isTrainer && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-300">Trainer Privileged Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Visual: Fully Furnished Executive Room */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 min-h-[340px] md:min-h-[440px] lg:min-h-[480px] flex flex-col justify-end">
          {/* Photorealistic Rendered Room Background with Trainer in Executive Chair */}
          <img
            src="/src/assets/images/trainer_executive_chair_1790758523732.jpg"
            alt="Senior Trainer in Executive Chair"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105"
            referrerPolicy="no-referrer"
          />

          {/* Lighting Mode Overlay */}
          <div className={`absolute inset-0 transition-colors duration-500 pointer-events-none ${lightBgStyle}`} />

          {/* Gradient Scrim for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Interactive Room Hotspots Overlay (Real visual furniture items!) */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-end gap-2 z-10 pointer-events-auto">
            {/* Hotspot Quick Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActiveStation('workstation');
                  playMarkerTap();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 ${
                  activeStation === 'workstation'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>🖥️ Executive Desk</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStation('whiteboard');
                  playMarkerTap();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 ${
                  activeStation === 'whiteboard'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>📋 Lecture Whiteboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStation('notices');
                  playMarkerTap();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 ${
                  activeStation === 'notices'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>📌 Notice Board</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveStation('bookshelf');
                  playMarkerTap();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition flex items-center gap-1.5 ${
                  activeStation === 'bookshelf'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span>📚 Tax Bookshelf</span>
              </button>
            </div>
          </div>

          {/* Lower Banner Info & Gajhal Audio Lounge */}
          <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-end justify-end gap-5">
            {/* Executive Desk Accessories Widget: Gajhal Audio Lounge */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Executive Gajhal Audio Radio Player Widget */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3 text-xs">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-400 relative shrink-0">
                  <Music className={`w-5 h-5 text-purple-400 ${ambientSound === 'gajhal' || isGajhalPlayerOpen ? 'animate-pulse' : ''}`} />
                  {(ambientSound === 'gajhal' || isGajhalPlayerOpen) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Audio Lounge
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Gajhals (नेपाली गजल)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAmbientSound('gajhal');
                      setIsGajhalPlayerOpen(!isGajhalPlayerOpen);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isGajhalPlayerOpen
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                        : 'bg-purple-950/60 hover:bg-purple-900 text-purple-200 border border-purple-700/40'
                    }`}
                    title="Toggle Gajhals Radio Player"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{isGajhalPlayerOpen ? 'Hide' : 'Play Gajhals'}</span>
                  </button>
                  <a
                    href="https://www.youtube.com/watch?v=vz2OlQ5XY6E&list=RDvz2OlQ5XY6E&start_radio=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                    title="Open Ghazals Playlist on YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Furniture Stations Segmented Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <div className="flex items-center overflow-x-auto gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveStation('workstation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStation === 'workstation'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>🖥️ Workstation & Keys</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStation('whiteboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStation === 'whiteboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📋 Smart Whiteboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStation('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStation === 'notices'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📌 Faculty Notice Board</span>
            {notices.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-purple-400 text-purple-950 font-black text-[10px] flex items-center justify-center">
                {notices.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveStation('bookshelf')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStation === 'bookshelf'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📚 Statutory Legal Shelf</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStation('downloads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStation === 'downloads'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>📁 Trainer Document Vault</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStation('consultation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeStation === 'consultation'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>💬 Consultation Desk</span>
          </button>
        </div>
      </div>

      {/* Main Furniture Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full flex-1">
        {/* ======================================================== */}
        {/* STATION 1: EXECUTIVE WORKSTATION & MASTER KEY DIRECTORY */}
        {/* ======================================================== */}
        {activeStation === 'workstation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Row: Dual Monitor Terminal & Quick Classroom Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Master Monitor with Curriculum Selector */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-950 text-blue-400 rounded-xl border border-blue-800/60">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        Curriculum Command Terminal
                      </h3>
                      <p className="text-xs text-slate-400">
                        Select any of the 15 comprehensive accounting modules to inspect configuration and status.
                      </p>
                    </div>
                  </div>

                  {/* Master Unlock All Days Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onUnlockAllDays();
                      playChimeBell();
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlock All 15 Days</span>
                  </button>
                </div>

                {/* Day selector pills */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Practical Training Day (1 to 15)
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-1.5">
                    {DAY_CONFIGS.map((cfg) => {
                      const isUnlocked = !!allProgress[cfg.dayNum]?.unlocked;
                      const isSelected = selectedDayNum === cfg.dayNum;
                      return (
                        <button
                          key={cfg.dayNum}
                          type="button"
                          onClick={() => {
                            setSelectedDayNum(cfg.dayNum);
                            playMarkerTap();
                          }}
                          className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105'
                              : isUnlocked
                              ? 'bg-slate-900 border-emerald-900/60 text-emerald-300 hover:bg-slate-800'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold">D{cfg.dayNum}</span>
                          {isUnlocked ? (
                            <Unlock className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />
                          ) : (
                            <Lock className="w-2.5 h-2.5 text-slate-600 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Day Detailed Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-900/60 text-blue-300 border border-blue-700/60">
                          Day {selectedConfig.dayNum} of 15
                        </span>
                        <span className="text-xs text-slate-400">
                          Base: {selectedConfig.baseCategory}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-1">
                        {selectedConfig.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Passcode Chip with 1-click copy */}
                      <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Code:</span>
                        <span className="font-mono font-black text-sm text-amber-400 tracking-wider">
                          {selectedConfig.passcode}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPasscode(selectedConfig.passcode, selectedConfig.dayNum)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition ml-1"
                          title="Copy Passcode"
                        >
                          {copiedDay === selectedConfig.dayNum ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Unlock button */}
                      {!allProgress[selectedConfig.dayNum]?.unlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            onUnlockDay(selectedConfig.dayNum);
                            playChimeBell();
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Unlock</span>
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Unlocked</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-semibold">Transactions</span>
                      <span className="text-sm font-bold text-white">50 MCQs / Day</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-semibold">Solution Mode</span>
                      <span className="text-sm font-bold text-blue-300">Journal & Day Book</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-semibold">Nepal FY Focus</span>
                      <span className="text-sm font-bold text-white">2083/84 (2026/27)</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block font-semibold">User Progress</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {allProgress[selectedConfig.dayNum]?.submitted
                          ? `Completed (${allProgress[selectedConfig.dayNum]?.score || 0}/50)`
                          : 'Not yet submitted'}
                      </span>
                    </div>
                  </div>

                  {/* Action Link to launch directly into Practice Arena */}
                  <div className="pt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Test transactions include realistic vendor invoices, VAT bills, bank slips, and TDS withholdings.
                    </p>
                    <button
                      type="button"
                      onClick={() => onGoToDayInPractice(selectedConfig.dayNum)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0"
                    >
                      <span>Open in Practice Arena</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Col: Trainer's Physical Desk Scratchpad & Daily Notes */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-950 text-amber-400 rounded-lg border border-amber-800/60">
                        <Pin className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        Faculty Desk Scratchpad
                      </h3>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      Auto-Saved
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Keep quick teaching notes, student reminders, or batch observation points here.
                  </p>
                  <textarea
                    value={scratchpadText}
                    onChange={(e) => setScratchpadText(e.target.value)}
                    rows={10}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition resize-none"
                    placeholder="Type personal instructor notes..."
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setScratchpadText('');
                      playMarkerTap();
                    }}
                    className="text-slate-500 hover:text-red-400 transition"
                  >
                    Clear Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(scratchpadText);
                      playMarkerTap();
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition"
                  >
                    Copy Scratchpad
                  </button>
                </div>
              </div>
            </div>

            {/* Master Security Passcodes Card (Trainer's Room Master Passcode) */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-950 border border-emerald-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/60">
                        Restricted Faculty Security Key
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      Trainer's Room Master Access Passcode
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Required for students/candidates to enter the Trainer's Room. Students must obtain this passcode from faculty.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-xl border border-emerald-700/60">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400 font-semibold">Passcode:</span>
                    <span className="font-mono font-black text-sm text-amber-300 tracking-wider">
                      {DEFAULT_TRAINER_PASSCODE}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPasscode(DEFAULT_TRAINER_PASSCODE, 'master')}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition ml-1 cursor-pointer"
                      title="Copy Trainer Room Passcode"
                    >
                      {copiedDay === 'master' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Master Passcode Directory Grid */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>15-Day Master Passcode Directory</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Official 5-digit verification keys for each accounting module. Click copy or unlock to manage offline student authorization.
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  Total Curriculum: 750 Practical Transactions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {DAY_CONFIGS.map((cfg) => {
                  const isUnlocked = !!allProgress[cfg.dayNum]?.unlocked;
                  return (
                    <div
                      key={cfg.dayNum}
                      className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-slate-900/90 border-emerald-800/60'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-white">
                          Day {cfg.dayNum}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-950 px-1.5 py-0.2 rounded">
                            Locked
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 truncate mb-2" title={cfg.title}>
                        {cfg.title.split(':')[1] || cfg.title}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="font-mono font-bold text-xs text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {cfg.passcode}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyPasscode(cfg.passcode, cfg.dayNum)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                            title="Copy Code"
                          >
                            {copiedDay === cfg.dayNum ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {!isUnlocked && (
                            <button
                              type="button"
                              onClick={() => {
                                onUnlockDay(cfg.dayNum);
                                playChimeBell();
                              }}
                              className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded text-[10px] font-semibold transition"
                            >
                              Unlock
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION 2: THE INTERACTIVE LECTURE SMART WHITEBOARD */}
        {/* ======================================================== */}
        {activeStation === 'whiteboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Whiteboard Controls & Tool Tray */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lecture Topic:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setWhiteboardPreset('golden_rules');
                      playMarkerTap();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      whiteboardPreset === 'golden_rules'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Golden Rules
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWhiteboardPreset('vat_rules');
                      playMarkerTap();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      whiteboardPreset === 'vat_rules'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Nepal VAT (13%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWhiteboardPreset('tds_matrix');
                      playMarkerTap();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      whiteboardPreset === 'tds_matrix'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    TDS Rates Matrix
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWhiteboardPreset('trial_balance');
                      playMarkerTap();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      whiteboardPreset === 'trial_balance'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Trial Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWhiteboardPreset('custom');
                      playMarkerTap();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      whiteboardPreset === 'custom'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Custom Dry-Erase Pad
                  </button>
                </div>
              </div>

              {/* Marker Inks & Actions */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Marker Ink:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMarkerColor('black')}
                    className={`w-6 h-6 rounded-full bg-slate-900 border-2 ${
                      markerColor === 'black' ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-600'
                    }`}
                    title="Black Marker"
                  />
                  <button
                    type="button"
                    onClick={() => setMarkerColor('blue')}
                    className={`w-6 h-6 rounded-full bg-blue-600 border-2 ${
                      markerColor === 'blue' ? 'border-white ring-2 ring-blue-400/40' : 'border-blue-900'
                    }`}
                    title="Blue Marker"
                  />
                  <button
                    type="button"
                    onClick={() => setMarkerColor('red')}
                    className={`w-6 h-6 rounded-full bg-red-600 border-2 ${
                      markerColor === 'red' ? 'border-white ring-2 ring-red-400/40' : 'border-red-900'
                    }`}
                    title="Red Marker"
                  />
                  <button
                    type="button"
                    onClick={() => setMarkerColor('green')}
                    className={`w-6 h-6 rounded-full bg-emerald-600 border-2 ${
                      markerColor === 'green' ? 'border-white ring-2 ring-emerald-400/40' : 'border-emerald-900'
                    }`}
                    title="Green Marker"
                  />
                </div>
              </div>
            </div>

            {/* Dry Erase Board Frame (Realistic Aluminum Border & Clean Surface) */}
            <div className="bg-gradient-to-b from-slate-200 to-slate-300 p-3 sm:p-5 rounded-3xl shadow-2xl border-4 border-slate-400 relative">
              {/* Aluminum top rail reflection */}
              <div className="absolute top-2 left-10 right-10 h-1 bg-white/70 rounded-full" />

              {/* Whiteboard Surface */}
              <div className="bg-[#FAFDFD] rounded-2xl p-6 sm:p-8 min-h-[440px] text-slate-900 shadow-inner relative border border-slate-300">
                {/* Header Stamp */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200/90 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-700 tracking-tight text-sm">
                      ARTHABIZ SMART BOARD
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="font-semibold text-slate-600">
                      Faculty Executive Studio • Sikshyatech Hub
                    </span>
                  </div>
                  <div className="font-mono text-slate-500 font-semibold">
                    Marker: <span className="capitalize font-bold text-slate-800">{markerColor}</span>
                  </div>
                </div>

                {/* Preset 1: Golden Rules */}
                {whiteboardPreset === 'golden_rules' && (
                  <div className="py-6 space-y-6">
                    <div className="text-center space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        The Three Golden Rules of Double-Entry Accounting
                      </h2>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        Foundational classification applied to all 750 practical curriculum transactions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Personal Accounts */}
                      <div className="p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-200 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
                          1. Personal Accounts
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          Individuals, Firms, Debtors & Creditors
                        </h4>
                        <div className="space-y-2 text-xs font-medium text-slate-700 pt-2 border-t border-blue-200">
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-200 font-mono">
                            <span className="font-bold text-blue-700">DEBIT</span>
                            <span>The Receiver</span>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-200 font-mono">
                            <span className="font-bold text-blue-700">CREDIT</span>
                            <span>The Giver</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          Example: Paid to Ram Traders A/C (Debit Ram, Credit Bank).
                        </p>
                      </div>

                      {/* Real Accounts */}
                      <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          2. Real Accounts
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          Tangible & Intangible Business Assets
                        </h4>
                        <div className="space-y-2 text-xs font-medium text-slate-700 pt-2 border-t border-emerald-200">
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-200 font-mono">
                            <span className="font-bold text-emerald-700">DEBIT</span>
                            <span>What Comes In</span>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-200 font-mono">
                            <span className="font-bold text-emerald-700">CREDIT</span>
                            <span>What Goes Out</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          Example: Bought Computer for office (Debit Computer, Credit Cash).
                        </p>
                      </div>

                      {/* Nominal Accounts */}
                      <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          3. Nominal Accounts
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          Expenses, Losses, Incomes & Gains
                        </h4>
                        <div className="space-y-2 text-xs font-medium text-slate-700 pt-2 border-t border-amber-200">
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-200 font-mono">
                            <span className="font-bold text-amber-700">DEBIT</span>
                            <span>All Expenses & Losses</span>
                          </div>
                          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-200 font-mono">
                            <span className="font-bold text-amber-700">CREDIT</span>
                            <span>All Incomes & Gains</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          Example: Electricity expense paid (Debit Electricity Exp, Credit Bank).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preset 2: Nepal VAT Rules */}
                {whiteboardPreset === 'vat_rules' && (
                  <div className="py-6 space-y-6">
                    <div className="text-center space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Nepal Value Added Tax (VAT 13%) — Standard Mechanics
                      </h2>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        Under Value Added Tax Act, 2052 & VAT Rules 2053 (Inland Revenue Department).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          VAT Calculation & Return Formula
                        </h4>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
                          <div className="text-blue-700 font-bold">Output VAT (on Sales) = Taxable Sales × 13%</div>
                          <div className="text-emerald-700 font-bold">Input VAT (on Purchases) = Taxable Purchases × 13%</div>
                          <div className="pt-2 border-t border-slate-200 font-black text-slate-900">
                            Net VAT Payable = Output VAT - Input VAT Credit
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          • If Output VAT &gt; Input VAT: Pay difference to IRD Revenue Code 14213 within 25 days.<br />
                          • If Input VAT &gt; Output VAT: Carry forward as refundable input credit.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Mandatory Registration Thresholds
                        </h4>
                        <div className="space-y-2 text-slate-700">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                            <span className="font-semibold">Goods / Trading Entities:</span>
                            <span className="font-mono font-bold text-slate-900">NPR 50,00,000 (50 Lakhs)</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                            <span className="font-semibold">Services & Consultancies:</span>
                            <span className="font-mono font-bold text-slate-900">NPR 20,00,000 (20 Lakhs)</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                            <span className="font-semibold">Mixed Goods + Services:</span>
                            <span className="font-mono font-bold text-slate-900">NPR 20,00,000 (20 Lakhs)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preset 3: TDS Rates Matrix */}
                {whiteboardPreset === 'tds_matrix' && (
                  <div className="py-6 space-y-4">
                    <div className="text-center space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Nepal TDS Rates Matrix — Income Tax Act 2058
                      </h2>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        Official Withholding Tax parameters enforced in practical day book transactions.
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-3">Section</th>
                            <th className="p-3">Nature of Payment</th>
                            <th className="p-3">TDS Rate</th>
                            <th className="p-3">IRD Revenue Code</th>
                            <th className="p-3">Accounting Double-Entry</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">Sec 87</td>
                            <td className="p-3 font-semibold">Remuneration / Salary</td>
                            <td className="p-3 font-mono font-bold">1% to 39% (Slab)</td>
                            <td className="p-3 font-mono">11111</td>
                            <td className="p-3 font-mono text-[11px]">Cr. TDS Payable (Salary)</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">Sec 88</td>
                            <td className="p-3 font-semibold">House / Office Rent (Individual)</td>
                            <td className="p-3 font-mono font-bold text-emerald-700">10%</td>
                            <td className="p-3 font-mono">11124</td>
                            <td className="p-3 font-mono text-[11px]">Cr. TDS Payable (Rent 10%)</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">Sec 88</td>
                            <td className="p-3 font-semibold">Consultancy / Professional Fees (PAN)</td>
                            <td className="p-3 font-mono font-bold text-amber-700">15%</td>
                            <td className="p-3 font-mono">11122</td>
                            <td className="p-3 font-mono text-[11px]">Cr. TDS Payable (Service 15%)</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">Sec 88Ka</td>
                            <td className="p-3 font-semibold">Service with VAT Bill</td>
                            <td className="p-3 font-mono font-bold text-blue-700">1.5%</td>
                            <td className="p-3 font-mono">11122</td>
                            <td className="p-3 font-mono text-[11px]">Cr. TDS Payable (1.5% VAT Bill)</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">Sec 89</td>
                            <td className="p-3 font-semibold">Contracts & Supply &gt; NPR 50,000</td>
                            <td className="p-3 font-mono font-bold">1.5%</td>
                            <td className="p-3 font-mono">11123</td>
                            <td className="p-3 font-mono text-[11px]">Cr. TDS Payable (Contract 1.5%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Preset 4: Trial Balance */}
                {whiteboardPreset === 'trial_balance' && (
                  <div className="py-6 space-y-5">
                    <div className="text-center space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Accounting Equation & Trial Balance Equilibrium
                      </h2>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto">
                        Verifying the fundamental balance of all Day 1 to Day 15 ledgers.
                      </p>
                    </div>

                    <div className="bg-slate-900 text-white p-6 rounded-2xl font-mono text-center space-y-2 shadow-md">
                      <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                        The Master Equation
                      </div>
                      <div className="text-lg sm:text-2xl font-black text-emerald-400">
                        ASSETS + EXPENSES = LIABILITIES + EQUITY + REVENUE
                      </div>
                      <p className="text-xs text-slate-400 pt-1 font-sans">
                        Debit Normal Balances (Left Side) = Credit Normal Balances (Right Side)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <span className="font-extrabold text-blue-800 block mb-1">Errors NOT Disclosed by Trial Balance:</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                          <li>Errors of Complete Omission (transaction not recorded at all)</li>
                          <li>Errors of Principle (capital expenditure recorded as revenue)</li>
                          <li>Compensating Errors (two independent equal opposite mistakes)</li>
                          <li>Errors of Original Entry (wrong figure written on invoice)</li>
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="font-extrabold text-amber-800 block mb-1">Errors That Cause Disagreement:</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                          <li>Posting to one side of the ledger only</li>
                          <li>Posting unequal debit and credit amounts</li>
                          <li>Error in totaling the Trial Balance columns</li>
                          <li>Carrying forward wrong ledger balance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preset 5: Custom Dry-Erase Pad */}
                {whiteboardPreset === 'custom' && (
                  <div className="py-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        Instructor Live Lecture Notes Canvas (Editable):
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(customWhiteboardNotes);
                          playMarkerTap();
                        }}
                        className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        Copy Board Notes
                      </button>
                    </div>
                    <textarea
                      value={customWhiteboardNotes}
                      onChange={(e) => setCustomWhiteboardNotes(e.target.value)}
                      rows={14}
                      className="w-full p-4 bg-white border-2 border-slate-300 rounded-xl font-mono text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-600 transition shadow-inner leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* Marker Tray with Realistic Markers */}
              <div className="mt-3 flex items-center justify-between px-6 py-2 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-xl border-t border-white/50 text-slate-800 text-xs shadow-md">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Marker Caddy:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-3 rounded-full bg-slate-900 border border-slate-700 shadow-xs" title="Dry Erase Black" />
                    <div className="w-12 h-3 rounded-full bg-blue-700 border border-blue-900 shadow-xs" title="Dry Erase Blue" />
                    <div className="w-12 h-3 rounded-full bg-red-700 border border-red-900 shadow-xs" title="Dry Erase Red" />
                    <div className="w-12 h-3 rounded-full bg-emerald-700 border border-emerald-900 shadow-xs" title="Dry Erase Green" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold">
                  <div className="w-8 h-4 bg-amber-900 rounded border border-amber-950 shadow-inner" title="Wooden Eraser" />
                  <span>Magnetic Felt Eraser Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION 3: FACULTY NOTICE BOARD & EXAMINATION MEMOS */}
        {/* ======================================================== */}
        {activeStation === 'notices' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Bar with Add Notice Trigger */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-3 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Pin className="w-4 h-4 text-purple-400" />
                  <span>Faculty Official Notice Board</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Official circulars, assessment guidelines, and statutory deadline notices pinned by faculty.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNotice(!isAddingNotice)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Pin New Notice</span>
              </button>
            </div>

            {/* Add Notice Modal Form */}
            {isAddingNotice && (
              <form onSubmit={handleAddNotice} className="bg-slate-950 border border-purple-800/80 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-purple-300">
                    Draft & Pin New Announcement
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingNotice(false)}
                    className="text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Notice Title
                    </label>
                    <input
                      type="text"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      placeholder="e.g. Day 10 Depreciation Schedule Practical"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Curriculum">Curriculum</option>
                      <option value="Exam">Exam</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Notice Content
                  </label>
                  <textarea
                    value={newNoticeContent}
                    onChange={(e) => setNewNoticeContent(e.target.value)}
                    rows={4}
                    placeholder="Enter the official details for students and faculty..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    Post to Corkboard
                  </button>
                </div>
              </form>
            )}

            {/* Corkboard Layout with Pinned Notices */}
            <div className="bg-[#B98D58] p-5 sm:p-7 rounded-3xl border-8 border-[#7C4A1E] shadow-2xl relative">
              {/* Wooden frame trim highlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="bg-[#FFFDF4] rounded-xl p-5 shadow-lg border border-amber-300/80 text-slate-900 relative transform hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
                  >
                    {/* Push Pin */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-200" />
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-2">
                        <span className="uppercase tracking-wider font-extrabold text-amber-800">
                          {n.category}
                        </span>
                        <span className="font-mono">{n.date}</span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug mb-2">
                        {n.title}
                      </h4>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {n.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold italic text-slate-600 truncate">
                        {n.author}
                      </span>
                      {n.pinned && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION 4: STATUTORY LEGAL SHELF & TAX GAZETTE */}
        {/* ======================================================== */}
        {activeStation === 'bookshelf' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Faculty Statutory Bookshelf & Legal Archives</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select any legal volume to inspect statutory sections, withholding schedules, and tax regulations.
                </p>
              </div>

              <span className="text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800 font-semibold">
                Updated FY 2083/84
              </span>
            </div>

            {/* Bookshelf Visual: Rows of Hardbound Legal Tomes */}
            <div className="bg-[#2D1B0E] p-6 sm:p-8 rounded-3xl border-8 border-[#4A2E19] shadow-2xl space-y-6">
              {/* Shelf 1 */}
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 items-end">
                  {/* Book 1 */}
                  <div
                    onClick={() => {
                      setSelectedBook('income_tax');
                      playMarkerTap();
                    }}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-t-lg border-t-2 border-x-2 border-amber-500/40 p-3 shadow-xl group-hover:-translate-y-2 transition duration-200 flex flex-col justify-between text-center relative overflow-hidden">
                      <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                        Act 2058
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-amber-200 font-serif leading-tight">
                        Nepal Income Tax Act
                      </div>
                      <div className="text-[9px] text-amber-400/80 font-mono">
                        With 2083 Updates
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-amber-400/60 rounded" />
                    </div>
                  </div>

                  {/* Book 2 */}
                  <div
                    onClick={() => {
                      setSelectedBook('vat_act');
                      playMarkerTap();
                    }}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 rounded-t-lg border-t-2 border-x-2 border-amber-500/40 p-3 shadow-xl group-hover:-translate-y-2 transition duration-200 flex flex-col justify-between text-center relative overflow-hidden">
                      <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                        Act 2052
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-blue-200 font-serif leading-tight">
                        Value Added Tax Act
                      </div>
                      <div className="text-[9px] text-blue-300/80 font-mono">
                        13% Standard Rate
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-amber-400/60 rounded" />
                    </div>
                  </div>

                  {/* Book 3 */}
                  <div
                    onClick={() => {
                      setSelectedBook('nfrs');
                      playMarkerTap();
                    }}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-t-lg border-t-2 border-x-2 border-amber-500/40 p-3 shadow-xl group-hover:-translate-y-2 transition duration-200 flex flex-col justify-between text-center relative overflow-hidden">
                      <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                        Standards
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-200 font-serif leading-tight">
                        NFRS & NAS Manual
                      </div>
                      <div className="text-[9px] text-emerald-300/80 font-mono">
                        SME Framework
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-amber-400/60 rounded" />
                    </div>
                  </div>

                  {/* Book 4 */}
                  <div
                    onClick={() => {
                      setSelectedBook('ird_codes');
                      playMarkerTap();
                    }}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 rounded-t-lg border-t-2 border-x-2 border-amber-500/40 p-3 shadow-xl group-hover:-translate-y-2 transition duration-200 flex flex-col justify-between text-center relative overflow-hidden">
                      <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                        Treasury
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-purple-200 font-serif leading-tight">
                        IRD Revenue Codes
                      </div>
                      <div className="text-[9px] text-purple-300/80 font-mono">
                        Deposit Heads
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-amber-400/60 rounded" />
                    </div>
                  </div>

                  {/* Book 5 */}
                  <div
                    onClick={() => {
                      setSelectedBook('companies_act');
                      playMarkerTap();
                    }}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 rounded-t-lg border-t-2 border-x-2 border-amber-500/40 p-3 shadow-xl group-hover:-translate-y-2 transition duration-200 flex flex-col justify-between text-center relative overflow-hidden">
                      <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                        Act 2063
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-amber-200 font-serif leading-tight">
                        Nepal Companies Act
                      </div>
                      <div className="text-[9px] text-amber-400/80 font-mono">
                        Statutory Audit
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 h-1 bg-amber-400/60 rounded" />
                    </div>
                  </div>
                </div>

                {/* Polished Solid Wood Shelf Plank */}
                <div className="h-4 bg-gradient-to-r from-[#5C381E] via-[#85532C] to-[#5C381E] rounded-md shadow-lg border-t border-[#A86F3E]" />
              </div>

              {/* Book Details Inspector Drawer */}
              {selectedBook && (
                <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-200 space-y-4 animate-in fade-in">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Statutory Reference Volume
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {selectedBook === 'income_tax' && 'Nepal Income Tax Act, 2058 (with 2081/82 Finance Act)'}
                        {selectedBook === 'vat_act' && 'Nepal Value Added Tax Act, 2052 & VAT Rules 2053'}
                        {selectedBook === 'nfrs' && 'Nepal Financial Reporting Standards (NFRS for SMEs)'}
                        {selectedBook === 'ird_codes' && 'Inland Revenue Department (IRD) Revenue Head Directory'}
                        {selectedBook === 'companies_act' && 'Nepal Companies Act, 2063 (Books of Account & Audit Provisions)'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded-lg"
                    >
                      Close Volume
                    </button>
                  </div>

                  {selectedBook === 'income_tax' && (
                    <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                      <p>
                        <strong className="text-white">Section 87 (Employment Income):</strong> Employers must withhold TDS on salaries according to progressive individual income tax slabs (1% Social Security up to assessable income, then 10%, 20%, 30%, 36%, and 39%).
                      </p>
                      <p>
                        <strong className="text-white">Section 88 (Investment & Service Returns):</strong> Rent payments by corporate tenants require 10% TDS. Service payments to non-VAT registered entities require 15% TDS. Service payments against VAT invoices require 1.5% TDS under Section 88Ka.
                      </p>
                      <p>
                        <strong className="text-white">Section 89 (Contract & Supply):</strong> Payments exceeding NPR 50,000 for supply of goods or execution of work contracts require 1.5% withholding tax.
                      </p>
                    </div>
                  )}

                  {selectedBook === 'vat_act' && (
                    <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                      <p>
                        <strong className="text-white">Section 10 (Tax Invoice):</strong> Tax registered entities must issue sequential tax invoices showing Buyer's PAN, Taxable Base, and 13% VAT amount.
                      </p>
                      <p>
                        <strong className="text-white">Schedule 1 (Exempt Goods):</strong> Unprocessed agricultural produce, basic medicines, health services, and education services are exempt from VAT.
                      </p>
                      <p>
                        <strong className="text-white">Input VAT Restriction:</strong> Only 40% of VAT paid on administrative passenger vehicles can be claimed as input credit by ordinary non-transport entities.
                      </p>
                    </div>
                  )}

                  {selectedBook === 'nfrs' && (
                    <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                      <p>
                        <strong className="text-white">Accrual Basis Accounting:</strong> Financial transactions must be recognized when goods or services are delivered, irrespective of when cash is collected or disbursed.
                      </p>
                      <p>
                        <strong className="text-white">Historical Cost & Depreciation:</strong> Fixed assets are recorded at purchase cost plus freight, duties, and installation before testing. Depreciation follows pool-based declining balance or straight-line method.
                      </p>
                    </div>
                  )}

                  {selectedBook === 'ird_codes' && (
                    <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                      <p>
                        <strong className="text-white">Code 14213:</strong> Value Added Tax (VAT) — Domestic Production & Trade.
                      </p>
                      <p>
                        <strong className="text-white">Code 11111:</strong> Individual Remuneration / Salary TDS.
                      </p>
                      <p>
                        <strong className="text-white">Code 11124:</strong> House & Office Rent Withholding Tax (10%).
                      </p>
                      <p>
                        <strong className="text-white">Code 11122:</strong> Consultancy & Service Fee Withholding Tax (15% / 1.5%).
                      </p>
                    </div>
                  )}

                  {selectedBook === 'companies_act' && (
                    <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                      <p>
                        <strong className="text-white">Section 108 (Books of Account):</strong> Every company must maintain double-entry books of account that reflect a true and fair view of its state of affairs at its registered office.
                      </p>
                      <p>
                        <strong className="text-white">Section 111 (Appointment of Auditor):</strong> Every company must appoint a licensed auditor at its Annual General Meeting (AGM) to audit its balance sheet and profit & loss account.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION 5: TRAINER DOCUMENT VAULT & DOWNLOAD DISPENSER */}
        {/* ======================================================== */}
        {activeStation === 'downloads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-sky-400" />
                  <span>Trainer's Official Document Vault</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Direct export and download tools for official syllabus, answer keys, VAT spreadsheets, and invoice datasets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Item 1: Complete 15-Day Question Papers */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Day 1 to 15 Question Papers (PDF)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete 50 daily practical transactions formatted for offline exam paper printing with instructions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const mod = ALL_DAY_MODULES.find((m) => m.dayNumber === selectedDayNum) || ALL_DAY_MODULES[0];
                    downloadQuestionPaper(mod, candidateName);
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Day {selectedDayNum} Paper</span>
                </button>
              </div>

              {/* Item 2: VAT Registers Excel Template */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Nepal VAT Sales Register (Excel / XLSX)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Official Anusuchi 9 Sales Register spreadsheet populated with 150 practical tax invoices and formulas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    downloadSalesRegisterExcel(SALES_INVOICES_150);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export 150 Sales Register</span>
                </button>
              </div>

              {/* Item 3: Chart of Accounts Catalog */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Master Chart of Accounts (COA)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    5-tier account hierarchy covering Assets, Liabilities, Equity, Revenue, and Expenses ({MASTER_CHART_OF_ACCOUNTS.length} ledgers).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(MASTER_CHART_OF_ACCOUNTS, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Arthabiz_Chart_Of_Accounts_Master.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download COA JSON Catalog</span>
                </button>
              </div>

              {/* Item 4: 150 Sales Invoices Dataset */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    150 Practical Sales Invoices
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Complete invoice dataset with customer PAN, item breakdown, taxable value, and 13% VAT verification.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(SALES_INVOICES_150, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Arthabiz_150_Sales_Invoices_Dataset.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export 150 Invoices Dataset</span>
                </button>
              </div>

              {/* Item 5: Rapid Fire 100 Deck */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-800">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Rapid-Fire 100 Flashcards
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    100 quick-fire conceptual drills testing journal entry speed, tax thresholds, and accounting rules.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(RAPID_FIRE_100_QUESTIONS, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Arthabiz_Rapid_Fire_100_Deck.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Rapid-Fire 100 Deck</span>
                </button>
              </div>

              {/* Item 6: IRD Revenue Codes Master Sheet */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    IRD Revenue Codes Cheat Sheet
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Official Nepal Government revenue head accounts for Income Tax, VAT, Excise, and Customs duties.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(IRD_REVENUE_CODES, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Nepal_IRD_Revenue_Codes_Directory.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export IRD Revenue Codes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STATION 6: STUDENT CONSULTATION DESK & INQUIRY LOG */}
        {/* ======================================================== */}
        {activeStation === 'consultation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0 shadow-md">
                  <img
                    src="/src/assets/images/trainer_executive_chair_1790758523732.jpg"
                    alt="Senior Faculty Trainer in Executive Chair"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-400" />
                    <span>Student Consultation & Office Hours Desk</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct one-on-one accounting mentorship and case resolution with senior faculty.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-rose-300 bg-rose-950 px-3 py-1 rounded-xl border border-rose-800">
                Office Hours: Sunday to Thursday (10:00 - 17:00)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Consultation Log */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Case Discussions & Faculty Solutions
                </h4>

                <div className="space-y-3">
                  {consultationQuestions.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-blue-400">{item.student}</span>
                          <span className="text-slate-600">•</span>
                          <span className="font-semibold text-slate-300">{item.topic}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{item.date}</span>
                      </div>

                      <div className="text-xs text-slate-200 leading-relaxed">
                        <span className="text-amber-400 font-bold mr-1">Question:</span>
                        {item.query}
                      </div>

                      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <span className="text-emerald-400 font-bold mr-1 block sm:inline">
                          Trainer Explanation:
                        </span>
                        {item.trainerAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Submit New Query Form */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Submit Question to Trainer</span>
                  </h4>

                  <form onSubmit={handleAddStudentQuery} className="space-y-3 mt-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Candidate Name
                      </label>
                      <input
                        type="text"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Accounting Topic
                      </label>
                      <input
                        type="text"
                        value={newQueryTopic}
                        onChange={(e) => setNewQueryTopic(e.target.value)}
                        placeholder="e.g. Journal entry for bad debts recovery"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Specific Doubt / Transaction Reference
                      </label>
                      <textarea
                        value={newQueryText}
                        onChange={(e) => setNewQueryText(e.target.value)}
                        rows={4}
                        placeholder="Explain the transaction details or double-entry dilemma..."
                        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-rose-500 resize-none"
                        required
                      />
                    </div>

                    {querySubmitted && (
                      <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold animate-in fade-in flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Question submitted to Trainer Consultation Log!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Post Question</span>
                    </button>
                  </form>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  Questions posted here are reviewed during daily accounting tutorials at Sikshyatech Hub.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gajhals YouTube Audio Player Floating/Docked Window */}
      {isGajhalPlayerOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-slate-900/95 border-2 border-purple-500/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-white transition-all">
          <div className="p-3 bg-gradient-to-r from-purple-900/90 to-slate-900 flex items-center justify-between border-b border-purple-500/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <Music className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  Nepali Gajhals (नेपाली गजल रेडियो)
                </h4>
                <p className="text-[10px] text-purple-300/80 font-mono">
                  Official Faculty & Study Audio Lounge
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.youtube.com/watch?v=vz2OlQ5XY6E&list=RDvz2OlQ5XY6E&start_radio=1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-white/10 rounded-md text-slate-300 hover:text-white transition"
                title="Open Playlist in YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsGajhalPlayerOpen(false);
                  if (ambientSound === 'gajhal') setAmbientSound('off');
                }}
                className="p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition cursor-pointer"
                title="Close Gajhals Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2 bg-black/60">
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                src="https://www.youtube.com/embed/vz2OlQ5XY6E?list=RDvz2OlQ5XY6E&autoplay=1"
                title="Nepali Gajhal Audio Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          </div>
          <div className="px-3 py-2 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Streaming Ghazals Playlist
            </span>
            <button
              type="button"
              onClick={() => {
                setIsGajhalPlayerOpen(false);
                setAmbientSound('off');
              }}
              className="text-[10px] text-slate-400 hover:text-red-400 transition cursor-pointer underline"
            >
              Stop & Mute
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
