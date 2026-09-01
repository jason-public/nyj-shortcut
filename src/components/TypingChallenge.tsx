import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ShortcutItem, CategoryId, HighlighterColor } from '../types';
import { CATEGORIES } from '../data/shortcutsData';
import { Keycap } from './Keycap';
import { 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Trophy, 
  Timer, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  SkipForward, 
  Lightbulb, 
  Award,
  ChevronRight,
  Highlighter,
  Bookmark
} from 'lucide-react';

interface TypingChallengeProps {
  items: ShortcutItem[];
  userHighlights: Record<string, HighlighterColor>;
  onToggleHighlight: (id: string, color?: HighlighterColor) => void;
  onSelectDetail: (item: ShortcutItem) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
}

type ChallengeGameMode = 'time-attack' | 'sprint' | 'free';

interface QuestionRecord {
  item: ShortcutItem;
  userPassed: boolean;
  timeSpentMs: number;
  attempts: number;
  skipped: boolean;
}

// Audio Synthesizer for sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSuccess(combo: number = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = combo > 5 
        ? [523.25, 659.25, 783.99, 1046.5] // High C major
        : [440, 554.37, 659.25]; // A major

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    } catch {
      // Ignore audio errors
    }
  }

  public playError() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore audio errors
    }
  }

  public playTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore audio errors
    }
  }
}

const sounds = new SoundEngine();

export const TypingChallenge: React.FC<TypingChallengeProps> = ({
  items,
  userHighlights,
  onToggleHighlight,
  onSelectDetail,
  isBookmarked,
  onToggleBookmark
}) => {
  // Game Setup States
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  const [gameMode, setGameMode] = useState<ChallengeGameMode>('time-attack');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [filterType, setFilterType] = useState<'all' | 'essential' | 'bookmarked'>('all');
  const [isMuted, setIsMuted] = useState(false);

  // Active Game Play States
  const [questions, setQuestions] = useState<ShortcutItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackText, setFeedbackText] = useState('');
  const [floatScore, setFloatScore] = useState<{ id: number; text: string; points: number } | null>(null);

  // Stats Records
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  // Real-time Pressed Keys State
  const [pressedModifiers, setPressedModifiers] = useState({
    ctrl: false,
    alt: false,
    shift: false,
    win: false
  });
  const [pressedMainKey, setPressedMainKey] = useState<string | null>(null);

  // Current Question
  const currentItem = questions[currentIndex] || null;

  // Filter available items based on selected filters
  const candidatePool = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (filterType === 'essential') return item.isEssential;
      if (filterType === 'bookmarked') return isBookmarked(item.id);
      return true;
    });
  }, [items, selectedCategory, filterType, isBookmarked]);

  // Sync mute state with sound engine
  useEffect(() => {
    sounds.setMuted(isMuted);
  }, [isMuted]);

  // Parse target keys into normalized requirements
  const targetKeyRequirements = useMemo(() => {
    if (!currentItem) return null;

    let needCtrl = false;
    let needAlt = false;
    let needShift = false;
    let needWin = false;
    const mainKeys: string[] = [];

    currentItem.keys.forEach((k) => {
      const upper = k.trim().toUpperCase();
      if (upper === 'CTRL' || upper === 'CONTROL') {
        needCtrl = true;
      } else if (upper === 'ALT') {
        needAlt = true;
      } else if (upper === 'SHIFT') {
        needShift = true;
      } else if (upper === 'WIN' || upper === 'WINDOWS' || upper === 'CMD' || upper === 'META') {
        needWin = true;
      } else if (upper === '+' || upper === '/' || upper === '또는' || upper === '→') {
        // separator
      } else {
        mainKeys.push(upper);
      }
    });

    return {
      needCtrl,
      needAlt,
      needShift,
      needWin,
      mainKeys,
      originalKeys: currentItem.keys
    };
  }, [currentItem]);

  // Normalize incoming browser keyboard event key
  const normalizeKey = useCallback((e: KeyboardEvent): string | null => {
    const key = e.key;
    const code = e.code;

    // Ignore pure modifier presses as main key
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
      return null;
    }

    // Function keys F1 - F12
    if (/^F[1-9]|F1[0-2]$/i.test(key)) {
      return key.toUpperCase();
    }

    // Arrow keys
    if (key === 'ArrowLeft') return '←';
    if (key === 'ArrowRight') return '→';
    if (key === 'ArrowUp') return '↑';
    if (key === 'ArrowDown') return '↓';

    // Special keys
    if (key === ' ' || code === 'Space') return 'SPACEBAR';
    if (key === 'Enter') return 'ENTER';
    if (key === 'Tab') return 'TAB';
    if (key === 'Escape') return 'ESC';
    if (key === 'Backspace') return 'BACKSPACE';
    if (key === 'Delete') return 'DELETE';
    if (key === 'PageUp') return 'PGUP';
    if (key === 'PageDown') return 'PGDN';
    if (key === 'Home') return 'HOME';
    if (key === 'End') return 'END';
    if (key === '+' || key === '=') return '+';
    if (key === '-' || key === '_') return '-';
    if (key === '[' || key === '{') return '[';
    if (key === ']' || key === '}') return ']';
    if (key === ';' || key === ':') return ';';
    if (key === "'" || key === '"') return "'";
    if (key === ',' || key === '<') return ',';
    if (key === '.' || key === '>') return '.';
    if (key === '/' || key === '?') return '/';

    // Single character letters & numbers
    if (key.length === 1) {
      return key.toUpperCase();
    }

    return key.toUpperCase();
  }, []);

  // Check if current user input matches the target shortcut
  const evaluateInput = useCallback((
    ctrl: boolean,
    alt: boolean,
    shift: boolean,
    win: boolean,
    mainKey: string | null
  ): boolean => {
    if (!targetKeyRequirements || !mainKey) return false;

    // Modifiers matching
    const ctrlMatch = targetKeyRequirements.needCtrl === ctrl;
    const altMatch = targetKeyRequirements.needAlt === alt;
    const winMatch = targetKeyRequirements.needWin === win;

    // For Shift: if target needs Shift, user must press Shift.
    // If target doesn't need Shift, user shouldn't press Shift (unless typing a key that naturally needs shift)
    const shiftMatch = targetKeyRequirements.needShift === shift;

    if (!ctrlMatch || !altMatch || !winMatch || !shiftMatch) {
      return false;
    }

    // Main key matching:
    // targetKeyRequirements.mainKeys may contain e.g. ['C'], or ['← / → / ↑ / ↓'], or ['ENTER']
    const mainMatches = targetKeyRequirements.mainKeys.some((tKey) => {
      const t = tKey.toUpperCase();
      const m = mainKey.toUpperCase();

      if (t === m) return true;

      // Check arrows
      if (t.includes('←') || t.includes('→') || t.includes('↑') || t.includes('↓')) {
        if (m === '←' || m === '→' || m === '↑' || m === '↓' || m.includes('ARROW')) {
          return true;
        }
      }

      // Check Space
      if ((t.includes('SPACE') || t.includes('SPACEBAR')) && (m === 'SPACEBAR' || m === 'SPACE')) {
        return true;
      }

      // Check Esc
      if ((t.includes('ESC') || t.includes('ESCAPE')) && (m === 'ESC' || m === 'ESCAPE')) {
        return true;
      }

      // Check Del
      if ((t.includes('DEL') || t.includes('DELETE')) && (m === 'DEL' || m === 'DELETE')) {
        return true;
      }

      return false;
    });

    return mainMatches;
  }, [targetKeyRequirements]);

  // Handle Correct Answer
  const handleCorrect = useCallback(() => {
    if (feedbackState === 'correct') return; // Prevent double trigger
    
    sounds.playSuccess(streak + 1);
    setFeedbackState('correct');
    setFeedbackText('✨ 정답입니다! EXCELLENT!');

    const timeSpent = Math.max(200, Date.now() - questionStartTimeRef.current);
    const speedBonus = Math.max(0, Math.floor((4000 - timeSpent) / 30));
    const comboMultiplier = Math.min(3, 1 + streak * 0.2);
    const basePoints = 100;
    const addedPoints = Math.floor((basePoints + speedBonus) * comboMultiplier);

    setScore((prev) => prev + addedPoints);
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > maxStreak) {
      setMaxStreak(newStreak);
    }

    // Float score animation
    setFloatScore({
      id: Date.now(),
      text: newStreak > 1 ? `+${addedPoints} (${newStreak} Combo 🔥)` : `+${addedPoints}`,
      points: addedPoints
    });

    // Time bonus in Time Attack mode
    if (gameMode === 'time-attack') {
      setTimeLeft((prev) => Math.min(90, prev + 2));
    }

    // Record question result
    if (currentItem) {
      setRecords((prev) => [
        ...prev,
        {
          item: currentItem,
          userPassed: true,
          timeSpentMs: timeSpent,
          attempts: 1,
          skipped: false
        }
      ]);
    }

    // Advance to next question after small transition delay
    setTimeout(() => {
      setFeedbackState('idle');
      setFeedbackText('');
      setFloatScore(null);
      setShowHint(false);
      setPressedMainKey(null);

      if (gameMode === 'sprint' && currentIndex + 1 >= Math.min(10, questions.length)) {
        // Sprint mode finished
        endGame();
      } else if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        questionStartTimeRef.current = Date.now();
      } else {
        // Loop back with re-shuffle if unlimited / time-attack
        if (gameMode === 'time-attack') {
          const reshuffled = [...candidatePool].sort(() => Math.random() - 0.5);
          setQuestions(reshuffled);
          setCurrentIndex(0);
          questionStartTimeRef.current = Date.now();
        } else {
          endGame();
        }
      }
    }, 450);
  }, [feedbackState, streak, maxStreak, gameMode, currentItem, currentIndex, questions.length, candidatePool]);

  // Handle Incorrect Attempt
  const handleWrong = useCallback(() => {
    sounds.playError();
    setFeedbackState('wrong');
    setFeedbackText('❌ 단축키 조합이 다릅니다. 다시 시도해보세요!');
    setStreak(0); // Reset combo

    setTimeout(() => {
      setFeedbackState('idle');
      setFeedbackText('');
    }, 1000);
  }, []);

  // Handle Skip / Pass
  const handleSkip = useCallback(() => {
    if (!currentItem) return;

    setStreak(0);
    setRecords((prev) => [
      ...prev,
      {
        item: currentItem,
        userPassed: false,
        timeSpentMs: Date.now() - questionStartTimeRef.current,
        attempts: 1,
        skipped: true
      }
    ]);

    setFeedbackState('idle');
    setFeedbackText('');
    setShowHint(false);
    setPressedMainKey(null);

    if (gameMode === 'sprint' && currentIndex + 1 >= Math.min(10, questions.length)) {
      endGame();
    } else if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      questionStartTimeRef.current = Date.now();
    } else {
      endGame();
    }
  }, [currentItem, gameMode, currentIndex, questions.length]);

  // End Game
  const endGame = useCallback(() => {
    setGameState('gameover');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start / Restart Challenge
  const startGame = () => {
    if (candidatePool.length === 0) return;

    // Shuffle pool
    const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setRecords([]);
    setShowHint(false);
    setFeedbackState('idle');
    setFeedbackText('');
    setFloatScore(null);
    setPressedModifiers({ ctrl: false, alt: false, shift: false, win: false });
    setPressedMainKey(null);

    if (gameMode === 'time-attack') {
      setTimeLeft(60);
    } else if (gameMode === 'sprint') {
      setTimeLeft(10 * Math.min(10, shuffled.length));
    } else {
      setTimeLeft(999);
    }

    setGameState('playing');
    questionStartTimeRef.current = Date.now();
  };

  // Timer Tick
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (gameMode === 'free') return; // No countdown in free practice

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        if (prev <= 5) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, gameMode, endGame]);

  // Global Keyboard Listener for Typing Challenge
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default shortcuts while in active game (e.g. Ctrl+S, Ctrl+P, Ctrl+W, etc.)
      const isControlKey = e.ctrlKey || e.altKey || e.metaKey || (e.key.startsWith('F') && e.key.length <= 3);
      if (isControlKey || e.key === 'Tab' || e.key === ' ') {
        // Prevent default browser actions
        e.preventDefault();
      }

      // Spacebar alone -> Skip question
      if (e.key === ' ' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        handleSkip();
        return;
      }

      // 'H' or 'h' alone (without modifiers) -> Toggle Hint
      if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        setShowHint(true);
        return;
      }

      // Escape -> Pause game
      if (e.key === 'Escape') {
        setGameState('paused');
        return;
      }

      // Update active modifiers
      const ctrl = e.ctrlKey;
      const alt = e.altKey;
      const shift = e.shiftKey;
      const win = e.metaKey;

      setPressedModifiers({ ctrl, alt, shift, win });

      const mainKey = normalizeKey(e);
      if (mainKey) {
        setPressedMainKey(mainKey);

        // Evaluate immediately
        const isMatch = evaluateInput(ctrl, alt, shift, win, mainKey);
        if (isMatch) {
          handleCorrect();
        } else {
          // If a main key was pressed with or without modifiers and didn't match:
          handleWrong();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedModifiers({
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        win: e.metaKey
      });
      setPressedMainKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, normalizeKey, evaluateInput, handleCorrect, handleWrong, handleSkip]);

  // Virtual Keypad Click Handler
  const handleVirtualKeyClick = (keyName: string) => {
    if (gameState !== 'playing') return;

    if (keyName === 'Ctrl') {
      setPressedModifiers((prev) => ({ ...prev, ctrl: !prev.ctrl }));
      return;
    }
    if (keyName === 'Alt') {
      setPressedModifiers((prev) => ({ ...prev, alt: !prev.alt }));
      return;
    }
    if (keyName === 'Shift') {
      setPressedModifiers((prev) => ({ ...prev, shift: !prev.shift }));
      return;
    }
    if (keyName === 'Win') {
      setPressedModifiers((prev) => ({ ...prev, win: !prev.win }));
      return;
    }

    // Trigger main key press
    setPressedMainKey(keyName);
    const isMatch = evaluateInput(
      pressedModifiers.ctrl,
      pressedModifiers.alt,
      pressedModifiers.shift,
      pressedModifiers.win,
      keyName
    );

    if (isMatch) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  // Calculate Final Stats
  const finalStats = useMemo(() => {
    const totalAnswered = records.length;
    const correctCount = records.filter((r) => r.userPassed).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const avgTimeMs = totalAnswered > 0
      ? Math.round(records.reduce((acc, r) => acc + r.timeSpentMs, 0) / totalAnswered)
      : 0;

    let rank = '루키 (C)';
    let rankColor = 'text-slate-600 bg-slate-100 border-slate-300';
    if (score >= 2000 || (correctCount >= 10 && accuracy >= 90)) {
      rank = 'SSS 신의 손 (God Tier)';
      rankColor = 'text-amber-600 bg-amber-50 border-amber-300 ring-2 ring-amber-300';
    } else if (score >= 1400 || (correctCount >= 8 && accuracy >= 80)) {
      rank = 'SS 마스터 (Master)';
      rankColor = 'text-purple-600 bg-purple-50 border-purple-300';
    } else if (score >= 900 || (correctCount >= 6 && accuracy >= 70)) {
      rank = 'S 프로 (Pro)';
      rankColor = 'text-blue-600 bg-blue-50 border-blue-300';
    } else if (score >= 500) {
      rank = 'A 숙련자 (Advanced)';
      rankColor = 'text-emerald-600 bg-emerald-50 border-emerald-300';
    } else if (score >= 200) {
      rank = 'B 중수 (Intermediate)';
      rankColor = 'text-sky-600 bg-sky-50 border-sky-300';
    }

    return {
      totalAnswered,
      correctCount,
      accuracy,
      avgTimeMs,
      rank,
      rankColor
    };
  }, [records, score]);

  // Common Virtual Keys for quick touch/click
  const virtualKeys = [
    'Ctrl', 'Alt', 'Shift', 'Win',
    'C', 'V', 'Z', 'Y', 'A', 'S', 'F', 'D', 'E', 'T', 'W', 'P', 'X', 'N',
    'F2', 'F4', 'F5', 'F7', 'F12',
    'Enter', 'Spacebar', 'Tab', 'Esc', 'Delete',
    '←', '→', '↑', '↓'
  ];

  // -------------------------------------------------------------
  // RENDER: 1. READY / LOBBY SCREEN
  // -------------------------------------------------------------
  if (gameState === 'ready') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Banner Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap className="w-48 h-48 text-blue-400" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-xs">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Keyboard Speed Challenge
              </span>
              <span className="text-xs text-slate-300">물리 키보드 실전 타이핑 모드</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              단축키 타이핑 챌린지 ⚡
            </h2>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              화면에 제시되는 실무 기능을 보고 올바른 단축키를 <strong className="text-amber-300">내 키보드로 직접 빠르게</strong> 입력하세요!
              시간 내에 연속으로 맞히면 콤보 보너스와 함께 실전 손가락 감각이 완벽히 훈련됩니다.
            </p>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              1. 챌린지 모드 선택
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setGameMode('time-attack')}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  gameMode === 'time-attack'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-100 dark:ring-blue-900 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">⚡</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    인기 추천
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">60초 타임어택</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  60초 동안 최대한 많이 정답 맞히기! 정답 시 +2초 보너스 & 콤보 점수
                </p>
              </button>

              <button
                type="button"
                onClick={() => setGameMode('sprint')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  gameMode === 'sprint'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-100 dark:ring-blue-900 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="text-xl mb-1.5">🎯</div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">10문제 스피드런</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  엄선된 10문제를 빠르게 풀고 정확도와 속도 랭킹 측정
                </p>
              </button>

              <button
                type="button"
                onClick={() => setGameMode('free')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  gameMode === 'free'
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 ring-2 ring-blue-100 dark:ring-blue-900 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="text-xl mb-1.5">🧘</div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">무제한 트레이닝</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  시간 제한 없이 편안하게 손가락 단축키 감각을 익히는 연습 모드
                </p>
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              2. 단축키 카테고리 범위
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const count = items.filter((it) => cat.id === 'all' || it.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.shortName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub filter & Options */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-600 dark:text-slate-400">범위 필터:</span>
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                전체 항목
              </button>
              <button
                type="button"
                onClick={() => setFilterType('essential')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  filterType === 'essential'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                핵심 추천만
              </button>
              <button
                type="button"
                onClick={() => setFilterType('bookmarked')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  filterType === 'bookmarked'
                    ? 'bg-yellow-100 dark:bg-yellow-950 text-amber-800 dark:text-yellow-200 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-3 h-3 text-amber-500" />
                즐겨찾기 항목만
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
              <span>효과음 {isMuted ? '음소거 됨' : '켜짐'}</span>
            </button>
          </div>

          {/* Start CTA Button */}
          <div className="pt-2">
            <button
              id="btn-start-typing-challenge"
              type="button"
              onClick={startGame}
              disabled={candidatePool.length === 0}
              className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-98 ${
                candidatePool.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>
                {candidatePool.length > 0
                  ? `단축키 타이핑 챌린지 시작 (${candidatePool.length}개 대상)`
                  : '선택한 조건에 해당하는 단축키가 없습니다'}
              </span>
            </button>
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              💡 팁: 챌린지가 시작되면 키보드 단축키를 누를 때 브라우저 기본 기능(창 닫기 등)이 자동 차단되어 안전합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: 2. GAME OVER / RESULT SCREEN
  // -------------------------------------------------------------
  if (gameState === 'gameover') {
    const wrongRecords = records.filter((r) => !r.userPassed || r.skipped);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/70 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400 shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-extrabold uppercase mb-2 shadow-2xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span className={finalStats.rankColor.split(' ')[0]}>{finalStats.rank}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
            챌린지 결과 리포트
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            손가락으로 빠르게 기억하는 실전 타이핑 훈련을 완료했습니다!
          </p>

          {/* Stats 4-Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-4 rounded-2xl mb-6">
            <div className="p-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">최종 점수</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {score.toLocaleString()}점
              </div>
            </div>
            <div className="p-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">정답 개수</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {finalStats.correctCount} / {finalStats.totalAnswered}
              </div>
            </div>
            <div className="p-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">정답률</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {finalStats.accuracy}%
              </div>
            </div>
            <div className="p-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">최대 연속 콤보</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {maxStreak}회 🔥
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 도전하기</span>
            </button>
            <button
              type="button"
              onClick={() => setGameState('ready')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm transition-all border border-slate-200 dark:border-slate-700"
            >
              설정 & 모드 변경
            </button>
          </div>
        </div>

        {/* Mistakes Review Note */}
        {wrongRecords.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                복습이 필요한 오답/스킵 단축키 ({wrongRecords.length}개)
              </h3>
              <span className="text-[11px] text-slate-400">카드를 클릭해 형광펜/즐겨찾기 등록</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {wrongRecords.map(({ item }, idx) => {
                const highlighted = !!userHighlights[item.id];
                const bookmarked = isBookmarked(item.id);

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={() => onSelectDetail(item)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Keycap keys={item.keys} size="sm" />
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          bookmarked
                            ? 'bg-yellow-50 dark:bg-yellow-950 text-amber-600 border-yellow-300'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                        title="즐겨찾기 추가"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleHighlight(item.id, 'yellow')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          highlighted
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 border-amber-300'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                        title="형광펜 강조"
                      >
                        <Highlighter className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: 3. ACTIVE PLAYING / PAUSED SCREEN
  // -------------------------------------------------------------
  if (!currentItem) {
    return null;
  }

  const timeProgressPercent = gameMode === 'time-attack'
    ? Math.min(100, Math.max(0, (timeLeft / 60) * 100))
    : gameMode === 'sprint'
    ? Math.min(100, Math.max(0, (timeLeft / (10 * Math.min(10, questions.length))) * 100))
    : 100;

  return (
    <div className="max-w-3xl mx-auto space-y-4 select-none animate-in fade-in duration-150">
      {/* Top Status Bar (Score, Timer, Streak, Controls) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        {/* Left: Streak & Combo */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
            streak >= 3
              ? 'bg-amber-500 text-white shadow-xs animate-pulse ring-2 ring-amber-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <Flame className={`w-4 h-4 ${streak >= 3 ? 'text-yellow-200' : 'text-amber-500'}`} />
            <span>{streak} COMBO</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold ml-1">
            <span>문제:</span>
            <strong className="text-slate-800 dark:text-slate-200">{currentIndex + 1}</strong>
            <span>/ {gameMode === 'sprint' ? Math.min(10, questions.length) : questions.length}</span>
          </div>
        </div>

        {/* Center: Score with Floating popups */}
        <div className="relative text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Current Score</div>
          <div className="text-lg sm:text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
            {score.toLocaleString()}
          </div>

          {floatScore && (
            <div
              key={floatScore.id}
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black text-amber-500 dark:text-amber-400 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {floatScore.text}
            </div>
          )}
        </div>

        {/* Right: Timer & Sound/Pause Controls */}
        <div className="flex items-center gap-2">
          {gameMode !== 'free' && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-black border transition-all ${
              timeLeft <= 10
                ? 'bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border-red-300 animate-bounce'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={gameState === 'playing' ? '일시정지 (Esc)' : '재개'}
          >
            {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="효과음 켜기/끄기"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Timer Progress Bar */}
      {gameMode !== 'free' && (
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-blue-600'
            }`}
            style={{ width: `${timeProgressPercent}%` }}
          />
        </div>
      )}

      {/* Main Challenge Card */}
      <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 transition-all duration-200 shadow-lg text-center relative overflow-hidden ${
        feedbackState === 'correct'
          ? 'border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20 ring-4 ring-emerald-400/20'
          : feedbackState === 'wrong'
          ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20 ring-4 ring-red-400/20 animate-shake'
          : 'border-slate-200 dark:border-slate-800'
      }`}>
        {/* Category & Tag header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {currentItem.category.toUpperCase()}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentItem.subCategory}
            </span>
            {currentItem.isEssential && (
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.5 rounded">
                ★ 핵심
              </span>
            )}
          </div>

          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
            키보드로 단축키를 누르세요!
          </span>
        </div>

        {/* Function Title & Prompt */}
        <div className="my-6 space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Q. 다음 기능의 단축키를 입력하세요
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            {currentItem.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {currentItem.description}
          </p>
        </div>

        {/* Real-time Keypress Indicator Display Box */}
        <div className="my-6 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner flex flex-col items-center justify-center min-h-[90px]">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
            현재 누른 키 (Real-time Input)
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {pressedModifiers.ctrl && (
              <kbd className="shortcut-key kbd-key-accent text-sm px-3 py-1 font-bold">Ctrl</kbd>
            )}
            {pressedModifiers.alt && (
              <kbd className="shortcut-key kbd-key-accent text-sm px-3 py-1 font-bold">Alt</kbd>
            )}
            {pressedModifiers.shift && (
              <kbd className="shortcut-key kbd-key-accent text-sm px-3 py-1 font-bold">Shift</kbd>
            )}
            {pressedModifiers.win && (
              <kbd className="shortcut-key kbd-key-accent text-sm px-3 py-1 font-bold">Win</kbd>
            )}

            {pressedMainKey && (
              <kbd className="shortcut-key kbd-key-accent text-sm px-3 py-1 font-bold animate-bounce">
                {pressedMainKey}
              </kbd>
            )}

            {!pressedModifiers.ctrl && !pressedModifiers.alt && !pressedModifiers.shift && !pressedModifiers.win && !pressedMainKey && (
              <span className="text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-1.5 animate-pulse">
                <span>⌨️ 키보드의 단축키를 눌러보세요 (예: Ctrl + ...)</span>
              </span>
            )}
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackText && (
          <div className={`text-xs sm:text-sm font-bold mb-3 flex items-center justify-center gap-1.5 animate-in fade-in duration-150 ${
            feedbackState === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
          }`}>
            {feedbackState === 'correct' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span>{feedbackText}</span>
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              💡 <strong>힌트:</strong> 시작 키는 <Keycap keys={[currentItem.keys[0]]} size="sm" /> 입니다!
            </span>
          </div>
        )}

        {/* Quick Action Helpers (Hint / Skip / Detail) */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => setShowHint(true)}
            disabled={showHint}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 font-semibold border border-amber-200 dark:border-amber-800 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>힌트 보기 (H)</span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>스킵 / 다음 (Space)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectDetail(currentItem)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>상세 해설</span>
          </button>
        </div>
      </div>

      {/* On-Screen Virtual Helper Keypad (For Mobile/Touch & Visual Aid) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
          <span>화면 온스크린 키패드 (터치 및 마우스 클릭으로도 입력 가능)</span>
          <span className="text-slate-400">조합 클릭 지원</span>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {virtualKeys.map((k) => {
            const isModifier = ['Ctrl', 'Alt', 'Shift', 'Win'].includes(k);
            let isActive = false;
            if (k === 'Ctrl') isActive = pressedModifiers.ctrl;
            if (k === 'Alt') isActive = pressedModifiers.alt;
            if (k === 'Shift') isActive = pressedModifiers.shift;
            if (k === 'Win') isActive = pressedModifiers.win;
            if (!isModifier && pressedMainKey === k) isActive = true;

            return (
              <button
                key={k}
                type="button"
                onClick={() => handleVirtualKeyClick(k)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-mono font-bold transition-all border shadow-2xs ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 dark:ring-blue-800 transform scale-105'
                    : isModifier
                    ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border-slate-300 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pause Modal Overlay */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">일시정지 중</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              잠시 쉬어가는 시간입니다. 준비가 되면 게임을 재개하세요.
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setGameState('playing')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4" />
                <span>계속 진행하기 (Esc)</span>
              </button>
              <button
                type="button"
                onClick={() => setGameState('ready')}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
              >
                챌린지 종료하고 나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
