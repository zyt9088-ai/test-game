/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Tajawal } from "next/font/google";
import { 
  Settings2, Clock, Layers, Type, 
  UserCircle2, Users, Plus, Trash2, Play, 
  Trophy, Skull, Sparkles, CheckCircle2, HeartCrack, AlertCircle, Lightbulb, Timer, HelpCircle, X, BookOpen, MapPin, Volume2, VolumeX, Image as ImageIcon, Copy, ArrowRight, Sun, Moon, Home, Info, Gamepad2, MessageCircle, Smartphone, RefreshCw
} from "lucide-react";

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800', '900'] });

const ARABIC_ALPHABET = [
  'ا', 'أ', 'إ', 'آ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 
  'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ة', 'ى', 'ء', 'ئ', 'ؤ'
];

const normalizeChar = (c: string) => ['أ', 'إ', 'آ', 'ا'].includes(c) ? 'ا' : c;

// ألوان الكلمات بستايل Solid
const WORD_COLORS = [
  { bg: 'bg-emerald-400', border: 'border-emerald-600', text: 'text-slate-900', shadow: 'shadow-[4px_4px_0px_#047857]' },
  { bg: 'bg-rose-400', border: 'border-rose-600', text: 'text-slate-900', shadow: 'shadow-[4px_4px_0px_#be123c]' },
  { bg: 'bg-blue-400', border: 'border-blue-600', text: 'text-slate-900', shadow: 'shadow-[4px_4px_0px_#1d4ed8]' },
  { bg: 'bg-amber-400', border: 'border-amber-600', text: 'text-slate-900', shadow: 'shadow-[4px_4px_0px_#b45309]' },
];

const SolidGamingBackground = () => {
  const [isDark, setIsDark] = useState(true);
  const [icons, setIcons] = useState<any[]>([]);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const gameShapes = [
      <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg>,
      <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>,
      <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4" /><path d="M6 20V4h6v4" /><circle cx="12" cy="11" r="2" /><line x1="12" y1="13" x2="12" y2="17" /><line x1="10" y1="15" x2="14" y2="15" /><line x1="12" y1="17" x2="10" y2="20" /><line x1="12" y1="17" x2="14" y2="20" /></svg>
    ];

    const iconColors = ['text-emerald-500', 'text-rose-500', 'text-purple-500', 'text-amber-500'];

    const generatedIcons = Array.from({ length: 12 }).map((_, i) => ({
      id: `icon-${i}`, shape: gameShapes[i % gameShapes.length], 
      colorClass: iconColors[i % iconColors.length],
      left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, size: Math.random() * 40 + 40, 
      delay: `${Math.random() * 5}s`, duration: `${Math.random() * 15 + 20}s`, rotate: Math.random() * 360,
    }));
    setIcons(generatedIcons);

    return () => { observer.disconnect(); };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]">
        {icons.map((icon) => (
          <div key={icon.id} className={`absolute animate-float-game-extra ${icon.colorClass}`} style={{ left: icon.left, top: icon.top, width: `${icon.size}px`, height: `${icon.size}px`, animationDelay: icon.delay, animationDuration: icon.duration, transform: `rotate(${icon.rotate}deg)` }}>{icon.shape}</div>
        ))}
      </div>
    </div>
  );
};

const playSound = (type: 'correct' | 'wrong' | 'win' | 'lose') => {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  const now = ctx.currentTime;
  if (type === 'correct') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'wrong') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now); osc.stop(now + 0.2);
  } else if (type === 'win') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(500, now + 0.1); osc.frequency.setValueAtTime(600, now + 0.2); osc.frequency.setValueAtTime(800, now + 0.3);
    gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.linearRampToValueAtTime(0.01, now + 0.6);
    osc.start(now); osc.stop(now + 0.6);
  } else if (type === 'lose') {
    osc.type = 'square'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);
    gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    osc.start(now); osc.stop(now + 0.8);
  }
};

export default function HangmanGame() {
  const [gameState, setGameState] = useState<'setup' | 'lobby' | 'guest_waiting' | 'prep' | 'playing' | 'ended' | 'final'>('setup');
  const [roomCode, setRoomCode] = useState('');
  
  const [rounds, setRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [timerSetting, setTimerSetting] = useState("60");
  const [maxMistakes, setMaxMistakes] = useState(5);
  const [wordMode, setWordMode] = useState<'manual' | 'random'>('manual');
  
  const [teams, setTeams] = useState([
    { id: 1, name: 'الفريق الأول', score: 0, players: [] as string[] }, 
    { id: 2, name: 'الفريق الثاني', score: 0, players: [] as string[] }
  ]);
  
  const [playerInputs, setPlayerInputs] = useState<Record<number, string>>({});
  const [dbWords, setDbWords] = useState<string[]>([]);
  const [winnerImgUrl, setWinnerImgUrl] = useState<string | null>(null);
  const [loserImgUrl, setLoserImgUrl] = useState<string | null>(null);

  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [realWord, setRealWord] = useState("");
  const [maskedInput, setMaskedInput] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hintUsed, setHintUsed] = useState(false);

  const [isStealTurn, setIsStealTurn] = useState(false);
  const [stealGuess, setStealGuess] = useState("");
  const [stealAttempted, setStealAttempted] = useState(false);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [instructionsText, setInstructionsText] = useState("جاري تحميل التعليمات...");

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // حالات خاصة بشاشة الضيف
  const [guestName, setGuestName] = useState("");
  const [guestTeamId, setGuestTeamId] = useState(1);
  const [isGuestJoined, setIsGuestJoined] = useState(false);

  const parsedTimeLimit = timerSetting === 'open' ? 0 : parseInt(timerSetting);
  const isWin = realWord.trim() !== "" && realWord.split('').filter(c => c !== ' ').every(c => guessedLetters.map(normalizeChar).includes(normalizeChar(c)));
  const isLoss = mistakes >= maxMistakes && !isStealTurn;
  const drawLevel = isWin ? maxMistakes : mistakes;
  const wordsCount = realWord.trim() ? realWord.trim().split(/\s+/).length : 0;
  const lettersCount = realWord.replace(/\s+/g, '').length;

  useEffect(() => {
    const savedHM = localStorage.getItem('admin_hangman_db');
    if (savedHM) { try { setDbWords(JSON.parse(savedHM)); } catch(e) {} }

    const savedInst = localStorage.getItem('admin_hm_instructions');
    if (savedInst) setInstructionsText(savedInst);
    else setInstructionsText(`مرحباً بك في الرجل المشنوق!\n\n1. طريقة اللعب:\n- كل فريق له جولة ليحزر الكلمة المخفية حرفاً حرفاً.\n- كل حرف خاطئ يرسم جزء من المشنقة.\n\n2. المساعدات (للفريق الأساسي فقط):\n- التلميح (-2 نقطة من الأخطاء المسموحة): يكشف حرف عشوائي.\n- زيادة الوقت (+15ث): تخصم خطأ واحد من الرصيد.\n\n3. نظام السرقة (لفريقين فقط):\n- إذا خسر الفريق الأساسي ولم يكتشف الكلمة، تنتقل الفرصة للفريق الخصم.\n- الفريق الخصم يملك 15 ثانية وتخمين واحد فقط لـ (الكلمة كاملة) عبر الكيبورد لسرقة النقاط.`);

    setIsDark(document.documentElement.classList.contains('dark'));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      if (codeParam) {
        setRoomCode(codeParam.toUpperCase());
        setGameState('guest_waiting');
      }
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
      setIsDark(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'winner' | 'loser') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'winner') setWinnerImgUrl(url); else setLoserImgUrl(url);
  };

  const addTeam = () => { if (teams.length < 4) setTeams([...teams, { id: Date.now(), name: `فريق ${teams.length + 1}`, score: 0, players: [] }]); };
  const removeTeam = (id: number) => { if (teams.length > 2) setTeams(teams.filter(t => t.id !== id)); };
  const updateTeamName = (id: number, name: string) => setTeams(teams.map(t => t.id === id ? { ...t, name } : t));

  const handleAddMockPlayer = (teamId: number, playerName: string) => {
    if (!playerName.trim()) return;
    setTeams(teams.map(t => t.id === teamId ? { ...t, players: [...t.players, playerName.trim()] } : t));
  };

  const handleCreateRoom = () => {
    const code = 'M' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    setGameState('lobby');
  };

  const canStartChallenge = teams.length >= 2 && teams.every(t => t.players.length >= 1);

  const handleStartChallenge = () => { 
    if (!canStartChallenge) return;
    setCurrentRound(1); setActiveTeamIdx(0); setTeams(teams.map(t => ({ ...t, score: 0 }))); prepareRound(0); 
  };

  const getRandomWord = () => {
      if (dbWords.length === 0) return "";
      return dbWords[Math.floor(Math.random() * dbWords.length)];
  };

  const prepareRound = (teamIdx: number) => {
    setActiveTeamIdx(teamIdx); setRealWord(""); setMaskedInput(""); setGuessedLetters([]); setMistakes(0); setHintUsed(false); 
    setIsStealTurn(false); setStealGuess(""); setStealAttempted(false);
    
    if (wordMode === 'random') {
      const randomWord = getRandomWord();
      if (!randomWord) { alert("الرجاء إضافة كلمات للرجل المشنوق من لوحة التحكم، أو اختيار النظام اليدوي."); setGameState('setup'); return; }
      setRealWord(randomWord);
    }
    setGameState('prep'); 
  };

  const handleChangeRandomWord = () => {
      const newWord = getRandomWord();
      if(newWord) {
          setRealWord(newWord);
          setGuessedLetters([]);
          setMistakes(0);
          setTimeLeft(parsedTimeLimit);
          setHintUsed(false);
      }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const isTimerActive = gameState === 'playing' && !isWin && !isLoss;
    const hasTimeLimit = parsedTimeLimit > 0 || isStealTurn; 

    if (isTimerActive && hasTimeLimit && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive && hasTimeLimit) {
      if (soundEnabled) playSound('lose');
      if (isStealTurn) setStealAttempted(true); 
      setGameState('ended');
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState, parsedTimeLimit, isWin, isLoss, isStealTurn, soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isWin || isLoss) return;
      if (document.activeElement?.tagName === 'INPUT') return;
      const key = e.key;
      if (ARABIC_ALPHABET.includes(key)) {
        const btn = document.getElementById(`btn-${key}`);
        if (btn && !btn.hasAttribute('disabled')) btn.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isWin, isLoss]);

  const handleSecretInput = (val: string) => {
    let newReal = "";
    for (let i = 0; i < val.length; i++) {
      if (val[i] === '*') newReal += realWord[i] !== undefined ? realWord[i] : '*';
      else newReal += val[i];
    }
    setRealWord(newReal); setMaskedInput('*'.repeat(val.length));
  };

  const startRound = () => {
    if (!realWord.trim()) return;
    setGuessedLetters([]); setMistakes(0); setTimeLeft(parsedTimeLimit); setGameState('playing');
  };

  const handleGuess = (char: string) => {
    if (guessedLetters.includes(char) || gameState !== 'playing' || isWin || isLoss || isStealTurn) return;
    const normChar = normalizeChar(char);
    const normWord = realWord.split('').map(normalizeChar).join('');
    
    const charsToAdd = ['ا', 'أ', 'إ', 'آ'].includes(char) ? ['ا', 'أ', 'إ', 'آ'] : [char];
    setGuessedLetters(prev => Array.from(new Set([...prev, ...charsToAdd])));

    if (!normWord.includes(normChar)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= maxMistakes) { if (soundEnabled) playSound('lose'); setGameState('ended'); } else { if (soundEnabled) playSound('wrong'); }
    } else {
      const checkWin = realWord.split('').filter(c => c !== ' ').every(c => [...guessedLetters, ...charsToAdd].map(normalizeChar).includes(normalizeChar(c)));
      if (checkWin) { if (soundEnabled) playSound('win'); setGameState('ended'); } else { if (soundEnabled) playSound('correct'); }
    }
  };

  const handleHint = () => {
    if (hintUsed || mistakes + 2 >= maxMistakes) return;
    const unGuessed = realWord.split('').filter(c => c !== ' ' && !guessedLetters.map(normalizeChar).includes(normalizeChar(c)));
    if (unGuessed.length === 0) return;
    const uniqueUnguessed = Array.from(new Set(unGuessed.map(normalizeChar)));
    const randomNormChar = uniqueUnguessed[Math.floor(Math.random() * uniqueUnguessed.length)];
    
    const charsToAdd = ['ا', 'أ', 'إ', 'آ'].includes(randomNormChar) ? ['ا', 'أ', 'إ', 'آ'] : [randomNormChar];
    setGuessedLetters(prev => Array.from(new Set([...prev, ...charsToAdd])));

    setMistakes(prev => prev + 2);
    setHintUsed(true); 
    const checkWin = realWord.split('').filter(c => c !== ' ').every(c => [...guessedLetters, ...charsToAdd].map(normalizeChar).includes(normalizeChar(c)));
    if (checkWin) { if (soundEnabled) playSound('win'); setGameState('ended'); } else { if (soundEnabled) playSound('correct'); }
  };

  const handleAddTime = () => {
    if (mistakes + 1 >= maxMistakes) return;
    setTimeLeft(prev => prev + 15);
    setMistakes(prev => prev + 1);
  };

  const handleStealConfirm = () => {
    if (!stealGuess.trim()) return;
    setStealAttempted(true);
    const normGuess = stealGuess.replace(/\s+/g, '').split('').map(normalizeChar).join('');
    const normReal = realWord.replace(/\s+/g, '').split('').map(normalizeChar).join('');
    if (normGuess === normReal) {
      setGuessedLetters(realWord.split('')); 
      if (soundEnabled) playSound('win');
    } else { if (soundEnabled) playSound('lose'); }
    setGameState('ended');
  };

  const nextRound = () => {
    if (isWin) {
      const winningTeamIdx = isStealTurn ? (activeTeamIdx + 1) % teams.length : activeTeamIdx;
      setTeams(teams.map((t, i) => i === winningTeamIdx ? { ...t, score: t.score + 10 } : t));
    }
    if (activeTeamIdx === teams.length - 1) {
      if (currentRound >= rounds) { setGameState('final'); } else { setCurrentRound(prev => prev + 1); prepareRound(0); }
    } else { prepareRound(activeTeamIdx + 1); }
  };

  const getScoreColor = (score: number) => {
    const maxScore = Math.max(...teams.map(t => t.score)); const minScore = Math.min(...teams.map(t => t.score));
    if (maxScore === minScore) return "text-slate-800 dark:text-white"; 
    if (score === maxScore) return "text-emerald-600 dark:text-emerald-400"; 
    if (score === minScore) return "text-rose-600 dark:text-rose-400"; 
    return "text-slate-800 dark:text-white";
  };

  let headingText = '';
  if (isWin) headingText = isStealTurn ? 'سرقة ناجحة! 🥷🎉' : 'إجابة صحيحة! 🎉';
  else {
    if (isStealTurn) {
      if (stealAttempted) headingText = timeLeft === 0 ? 'انتهى الوقت! ⏰' : 'تخمين خاطئ! ❌';
      else headingText = 'فرصة ذهبية! ⏳';
    } else {
      headingText = (timeLeft === 0 && parsedTimeLimit > 0) ? 'انتهى الوقت! ⏰' : 'المشنقة اكتملت! 💀';
    }
  }

  const compactCardClass = "bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-2xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] p-4 transition-colors";
  const gameCardClass = "bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] p-6 transition-colors";

  return (
    <main className={`min-h-[100dvh] relative flex flex-col pt-24 pb-8 px-2 md:px-4 ${tajawal.className} bg-slate-50 dark:bg-[#0f172a]`} dir="rtl">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customSwing { 0% { transform: rotate(8deg); } 50% { transform: rotate(-8deg); } 100% { transform: rotate(8deg); } }
        @keyframes softJump { 0% { transform: translateY(0); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0); } }
        .animate-swing { animation: customSwing 4s ease-in-out infinite; }
        .animate-soft-jump { animation: softJump 1.5s ease-in-out infinite; }
      `}} />

      <SolidGamingBackground />

      {/* ===================== الهيدر المثبت ===================== */}
      <div className="fixed top-4 left-0 right-0 z-[60] w-full max-w-7xl mx-auto px-4">
        <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl border-b-4 border-slate-200 dark:border-slate-950 p-2 md:p-3 shadow-xl flex justify-between items-center transition-colors duration-300">
          
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95 shrink-0 pl-2">
            <img src="https://ludn.sa/full_logo.svg?dpl=dpl_9jc3BNjB3uY2VzRn5kQd3MZSNLaW" alt="لدن التقنية" className="h-10 md:h-12 object-contain dark:brightness-0 dark:invert" />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 md:gap-3">
            <Link href="/" className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] md:text-sm text-slate-700 dark:text-slate-300 transition-all active:translate-y-0.5 active:border-b-0">
              <Home size={16} className="text-slate-500 dark:text-slate-400" /> <span>الرئيسية</span>
            </Link>
            <Link href="/#about-section" className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] md:text-sm text-slate-700 dark:text-slate-300 transition-all active:translate-y-0.5 active:border-b-0">
              <Info size={16} className="text-purple-500" /> <span>عن المنصة</span>
            </Link>
          </nav>

          <div className="flex gap-2 pr-2">
            <button onClick={toggleTheme} className="w-10 h-10 md:w-11 md:h-11 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 text-slate-600 dark:text-amber-400 rounded-xl flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:translate-y-0.5 active:border-b-0">
              {isDark ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} className="animate-wiggle" />}
            </button>
          </div>
        </div>
      </div>

      {/* شريط أدوات اللعبة */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex justify-between items-center mb-3 px-2 md:px-0">
        
        {/* زر الرجوع في اليمين */}
        <Link href="/" className="py-2 px-4 bg-rose-500 hover:bg-rose-400 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-black rounded-xl border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 font-black text-sm">
          <ArrowRight size={18} strokeWidth={3} /> <span className="hidden sm:inline">رجوع</span> 
        </Link>
        
        {/* أزرار الصوت والدليل في اليسار */}
        <div className="flex gap-2">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-900 dark:border-black border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-1.5 font-black text-xs md:text-sm">
            {soundEnabled ? <><Volume2 size={16} /> <span className="hidden sm:inline">الصوت شغال</span></> : <><VolumeX size={16} /> <span className="hidden sm:inline">مكتوم</span></>}
          </button>
          <button onClick={() => setIsGuideOpen(true)} className="py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 border-2 border-slate-900 dark:border-black rounded-xl border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-1.5 font-black text-xs md:text-sm">
            <HelpCircle size={16} /> <span className="hidden sm:inline">دليل اللعبة</span>
          </button>
        </div>
      </div>

      {/* نافذة التعليمات */}
      {isGuideOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 transition-colors duration-500" style={{ zIndex: 110 }}>
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)}></div>
          <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl p-6 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in zoom-in-95">
            <button onClick={() => setIsGuideOpen(false)} className="absolute top-4 left-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors border-2 border-transparent hover:border-slate-900 dark:hover:border-black"><X size={20}/></button>
            <h2 className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2"><BookOpen size={24}/> دليل اللعبة</h2>
            <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-2 max-h-[50vh] overflow-y-auto text-sm text-slate-800 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-wrap">
              {instructionsText}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full flex-1 flex flex-col items-center justify-start overflow-visible pb-12">

        {/* ===================== شاشة اللاعب الضيف (Guest Waiting) ===================== */}
        {gameState === 'guest_waiting' && (
          <div className="relative w-full max-w-md mx-auto animate-in zoom-in-95 duration-500 flex flex-col my-auto pt-2 pb-10">
            <div className={`${gameCardClass} flex flex-col items-center justify-center py-8`}>
              {!isGuestJoined ? (
                <>
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border-4 border-purple-300 dark:border-purple-700">
                    <Users size={40} className="text-purple-500 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">الانضمام للغرفة</h2>
                  <div className="bg-slate-100 dark:bg-slate-900 px-4 py-1.5 rounded-xl border-4 border-slate-300 dark:border-slate-700 border-b-4 mb-6">
                    <span className="text-xl font-black tracking-[0.2em] text-purple-600 dark:text-purple-400 font-mono">{roomCode}</span>
                  </div>

                  {/* إدخال اسم اللاعب */}
                  <div className="w-full text-right mb-4">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">اسم اللاعب:</label>
                    <input 
                      type="text" 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-2xl px-4 py-3 text-lg font-black outline-none focus:border-purple-500 transition-colors shadow-inner"
                      placeholder="اكتب اسمك هنا..."
                    />
                  </div>

                  {/* اختيار الفريق */}
                  <div className="w-full text-right mb-8">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">اختر الفريق:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {teams.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => setGuestTeamId(t.id)}
                          className={`py-3 rounded-xl border-4 border-slate-900 dark:border-black font-black text-sm transition-all ${guestTeamId === t.id ? 'bg-purple-500 text-white border-b-4 translate-y-1 shadow-[inset_0_4px_0_rgba(255,255,255,0.2)]' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border-b-[6px] hover:bg-slate-100 dark:hover:bg-slate-600 shadow-[2px_2px_0px_#0f172a]'}`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* زر الانضمام */}
                  <button 
                    onClick={() => {
                      if(guestName.trim()) setIsGuestJoined(true);
                    }}
                    disabled={!guestName.trim()}
                    className="w-full py-4 bg-emerald-500 border-b-[6px] border-emerald-700 hover:bg-emerald-400 disabled:opacity-50 disabled:translate-y-1.5 disabled:border-b-0 text-white rounded-2xl font-black text-xl transition-all active:scale-95 active:border-b-0 active:translate-y-1.5 border-4 border-x-slate-900 border-t-slate-900 dark:border-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]"
                  >
                    انضمام الآن 🚀
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 size={48} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">تم الانضمام بنجاح!</h2>
                  <div className="bg-slate-100 dark:bg-slate-900 px-6 py-2 rounded-xl border-4 border-slate-300 dark:border-slate-700 border-b-8 mb-6 mt-4 inline-block">
                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400">فريق: {teams.find(t => t.id === guestTeamId)?.name}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm text-center">
                    يا هلا بك يا <span className="font-black text-slate-900 dark:text-white">{guestName}</span>! طالع الشاشة الرئيسية للعبة (شاشة الحكم) وخلك مستعد للتحدي! ⏳
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================== شاشة إعدادات الغرفة ===================== */}
        {gameState === 'setup' && (
          <div className="relative w-full max-w-3xl mx-auto animate-in zoom-in-95 duration-300 flex flex-col my-auto pt-2 pb-10">
            
            <div className="text-center mb-4">
              <div className="inline-flex p-2 bg-purple-100 dark:bg-purple-900/50 rounded-2xl border-4 border-slate-900 dark:border-black mb-2 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                <Settings2 className="text-purple-700 dark:text-purple-400" size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">إعدادات غرفة الرجل المشنوق</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              
              <div className={compactCardClass}>
                <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2 border-b-2 border-slate-100 dark:border-slate-700 pb-2">
                  <Layers className="text-purple-500" size={16} /> قواعد اللعب
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">عدد الجولات:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[1, 3, 5, 7, 10].map(num => (
                        <button key={num} onClick={() => setRounds(num)} className={`flex-1 min-w-[30px] py-1.5 rounded-xl text-xs font-black transition-all border-2 border-slate-900 dark:border-black ${rounds === num ? 'bg-purple-500 text-white border-b-4 shadow-inner translate-y-0.5' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">مؤقت الجولة:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["60", "120", "180", "open"].map(t => (
                        <button key={t} onClick={() => setTimerSetting(t)} className={`flex-1 min-w-[40px] py-1.5 rounded-xl text-xs font-black transition-all border-2 border-slate-900 dark:border-black ${timerSetting === t ? 'bg-purple-500 text-white border-b-4 shadow-inner translate-y-0.5' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                          {t === 'open' ? '∞' : `${t}ث`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">الأخطاء المسموحة:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[5, 10, 12].map(num => (
                        <button key={num} onClick={() => setMaxMistakes(num)} className={`flex-1 min-w-[40px] py-1.5 rounded-xl text-xs font-black transition-all border-2 border-slate-900 dark:border-black ${maxMistakes === num ? 'bg-rose-500 text-white border-b-4 shadow-inner translate-y-0.5' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div className={compactCardClass}>
                  <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2 border-b-2 border-slate-100 dark:border-slate-700 pb-2">
                    <Type className="text-purple-500" size={16} /> نظام الكلمات
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setWordMode('manual')} className={`p-2 rounded-xl border-2 font-black flex flex-col items-center justify-center gap-1 transition-all duration-200 text-[11px] border-slate-900 dark:border-black ${wordMode === 'manual' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border-b-4 shadow-inner translate-y-0.5' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                      <UserCircle2 size={20} /> <span>يدوي (الحكم)</span>
                    </button>
                    <button onClick={() => setWordMode('random')} className={`p-2 rounded-xl border-2 font-black flex flex-col items-center justify-center gap-1 transition-all duration-200 text-[11px] border-slate-900 dark:border-black ${wordMode === 'random' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 border-b-4 shadow-inner translate-y-0.5' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
                      <Sparkles size={20} /> <span>عشوائي (النظام)</span>
                    </button>
                  </div>
                </div>

                <div className={`${compactCardClass} flex-1`}>
                  <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white mb-2 flex items-center gap-2 border-b-2 border-slate-100 dark:border-slate-700 pb-2">
                    <ImageIcon className="text-purple-500" size={16} /> الصور (اختياري)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className={`w-full h-12 bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${winnerImgUrl ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-600 dark:text-emerald-400 border-solid' : 'text-slate-500 hover:border-slate-400'}`}>
                        {winnerImgUrl ? <CheckCircle2 size={16} /> : <Trophy size={16} />} 
                        <span className="text-[10px] font-bold">{winnerImgUrl ? 'تم الرفع' : 'صورة الفائز'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'winner')} />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <label className={`w-full h-12 bg-slate-50 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-500 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 ${loserImgUrl ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-600 dark:text-emerald-400 border-solid' : 'text-slate-500 hover:border-slate-400'}`}>
                        {loserImgUrl ? <CheckCircle2 size={16} /> : <Skull size={16} />} 
                        <span className="text-[10px] font-bold">{loserImgUrl ? 'تم الرفع' : 'صورة الخاسر'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'loser')} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* إعدادات الفرق */}
            <div className={compactCardClass}>
              <div className="flex items-center justify-between mb-3 border-b-2 border-slate-100 dark:border-slate-700 pb-2">
                <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="text-purple-500" size={16} /> عدد وأسماء الفرق
                </h3>
                <button onClick={addTeam} disabled={teams.length >= 4} className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl font-black text-[11px] flex items-center gap-1 hover:bg-emerald-200 disabled:opacity-50 transition-colors border-b-4 active:border-b-2 active:translate-y-0.5">
                  <Plus size={14} /> إضافة فريق
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {teams.map((team, idx) => (
                  <div key={team.id} className="relative group bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-1.5 flex items-center gap-2 animate-in zoom-in">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-sm border-2 border-purple-200 dark:border-purple-800 border-b-4">
                      {idx + 1}
                    </div>
                    <input type="text" value={team.name} onChange={(e) => updateTeamName(team.id, e.target.value)} className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white font-black text-[11px] placeholder:text-slate-400" />
                    {teams.length > 2 && (
                      <button onClick={() => removeTeam(team.id)} className="p-1.5 text-rose-500 bg-rose-50 dark:bg-rose-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 dark:hover:bg-rose-900/50 border-2 border-rose-200 dark:border-rose-800 border-b-4 active:border-b-2 active:translate-y-0.5">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 mx-auto w-full max-w-sm">
              <button onClick={handleCreateRoom} className="w-full py-3 bg-purple-500 border-b-[6px] border-purple-700 hover:bg-purple-400 text-white rounded-2xl font-black text-xl transition-all active:scale-95 active:border-b-0 active:translate-y-1.5 border-2 border-x-slate-900 border-t-slate-900 dark:border-black flex items-center justify-center gap-2">
                تكوين الغرفة <Play size={18} className="fill-current" />
              </button>
            </div>

          </div>
        )}

        {/* ===================== شاشة اللوبي / الانتظار (Lobby) ===================== */}
        {gameState === 'lobby' && (
          <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 animate-in slide-in-from-bottom-8 duration-500 my-auto pb-12">
            
            <div className={`${gameCardClass} md:w-1/3 flex flex-col items-center text-center justify-center`}>
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">كود الغرفة</h2>
              <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl py-2 px-6 mb-5 flex items-center gap-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" onClick={() => navigator.clipboard.writeText(roomCode)}>
                <span className="text-3xl font-black tracking-[0.2em] text-purple-600 dark:text-purple-400 font-mono">{roomCode}</span>
                <Copy size={20} className="text-slate-400" />
              </div>
              <div className="bg-white border-4 border-slate-900 dark:border-slate-700 p-2 rounded-2xl mb-4 shadow-[4px_4px_0px_#cbd5e1] dark:shadow-[4px_4px_0px_#0f172a] w-40 h-40 flex items-center justify-center overflow-hidden">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ludn.sa/join?code=${roomCode}`} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                امسح الباركود بجوالك<br/>واختر فريقك لتظهر في الشاشة
              </p>
            </div>

            <div className={`${gameCardClass} md:w-2/3 flex flex-col`}>
              <div className="flex items-center justify-between mb-4 border-b-2 border-slate-100 dark:border-slate-700 pb-4">
                <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="text-purple-500" size={20} /> اللاعبين المنضمين
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-auto">
                {teams.map((team, idx) => (
                  <div key={team.id} className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 border-b-2 border-slate-200 dark:border-slate-700 pb-2">
                      <span className="w-6 h-6 bg-purple-500 text-white font-black text-xs flex items-center justify-center rounded-md">{idx + 1}</span>
                      <h4 className="font-black text-slate-800 dark:text-white text-sm">{team.name}</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2 flex-1 mb-3">
                      {team.players.length === 0 ? (
                        <p className="text-xs text-slate-400 font-bold text-center py-2 animate-pulse">بانتظار انضمام لاعبين...</p>
                      ) : (
                        team.players.map((playerName, pIdx) => (
                          <div key={pIdx} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-black text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div> {playerName}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={playerInputs[team.id] || ''}
                        onChange={(e) => setPlayerInputs({ ...playerInputs, [team.id]: e.target.value })}
                        placeholder="أضف لاعب (تجربة)" 
                        className="flex-1 min-w-0 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none focus:border-emerald-400 transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && playerInputs[team.id]?.trim()) {
                            handleAddMockPlayer(team.id, playerInputs[team.id]);
                            setPlayerInputs({ ...playerInputs, [team.id]: '' });
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          handleAddMockPlayer(team.id, playerInputs[team.id]);
                          setPlayerInputs({ ...playerInputs, [team.id]: '' });
                        }}
                        disabled={!playerInputs[team.id]?.trim()}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:border-slate-400 text-white px-2.5 py-1.5 rounded-lg font-black text-[10px] border-b-2 border-emerald-700 active:border-b-0 active:translate-y-0.5 transition-all flex items-center gap-1 shrink-0"
                      >
                        <Plus size={12} /> إضافة
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button onClick={handleStartChallenge} disabled={!canStartChallenge} className="w-full py-4 bg-emerald-500 border-b-8 border-emerald-700 hover:bg-emerald-400 disabled:bg-slate-300 disabled:border-slate-400 disabled:border-b-2 disabled:translate-y-1.5 disabled:text-slate-500 text-white rounded-2xl font-black text-2xl transition-all active:scale-95 active:border-b-0 active:translate-y-2 border-2 border-x-slate-900 border-t-slate-900 dark:border-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                  {canStartChallenge ? <><Play size={20} className="fill-current" /> ابدأ التحدي الآن</> : "بانتظار اكتمال الفرق..."}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ===================== شاشة إدخال الكلمة (Prep) ===================== */}
        {gameState === 'prep' && (
          <div className={`${gameCardClass} w-full max-w-xl mx-auto my-auto text-center animate-in zoom-in-95`}>
            <div className="flex justify-between items-center mb-8 border-b-2 border-slate-100 dark:border-slate-700 pb-5">
              <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-xl font-black text-sm border-b-4">
                الجولة {currentRound} / {rounds}
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-xl text-xs font-bold border-b-4 flex items-center gap-1.5">
                 <Users size={14}/> {teams[activeTeamIdx].players.length} لاعبين جاهزين
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-800 dark:text-white">دور فريق: <span className="text-purple-600 dark:text-purple-400 underline decoration-4 underline-offset-8">{teams[activeTeamIdx].name}</span></h2>
            
            {wordMode === 'manual' ? (
              <div className="mb-8">
                <p className="text-slate-500 dark:text-slate-400 mb-3 font-bold text-sm">أدخل الكلمة السرية (تظهر كنجوم)</p>
                <input 
                  type="text" 
                  value={maskedInput}
                  onChange={(e) => handleSecretInput(e.target.value)}
                  className="w-full h-16 bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-2xl text-center text-slate-900 dark:text-white text-3xl tracking-[0.3em] font-black focus:border-purple-500 dark:focus:border-purple-400 outline-none transition-colors shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:text-lg placeholder:tracking-normal"
                  placeholder="اكتب الكلمة هنا..."
                  dir="rtl"
                />
              </div>
            ) : (
              <div className="my-12">
                <Sparkles className="mx-auto text-purple-500 dark:text-purple-400 mb-4 animate-pulse" size={64} strokeWidth={1.5} />
                <p className="text-slate-800 dark:text-slate-300 font-black text-2xl mb-4">تم سحب الكلمة عشوائياً ✅</p>
              </div>
            )}

            <button onClick={startRound} disabled={!realWord.trim()} className="w-full py-4 bg-emerald-500 border-b-8 border-emerald-700 hover:bg-emerald-400 disabled:opacity-50 disabled:translate-y-0 disabled:border-b-8 text-white text-2xl font-black rounded-2xl transition-all active:scale-95 active:border-b-0 active:translate-y-2 border-2 border-x-slate-900 border-t-slate-900 dark:border-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
              ابدأ الجولة <Play size={24} className="fill-current" />
            </button>
          </div>
        )}

        {/* ===================== شاشة اللعب (Playing/Ended) ===================== */}
        {(gameState === 'playing' || gameState === 'ended') && (
          <div className="relative w-full max-w-[1200px] animate-in fade-in duration-300 my-auto pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              
              {/* 1. القسم الأيمن (المشنقة + الأخطاء) */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className={`${gameCardClass} flex flex-col items-center justify-center text-center`}>
                  <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b-2 border-slate-100 dark:border-slate-700 pb-2 w-full">ساحة الإعدام</h3>
                  <div className="h-44 md:h-[240px] w-full flex justify-center relative">
                    <svg viewBox="0 0 200 250" className="h-full stroke-slate-900 dark:stroke-slate-100 fill-none stroke-[6px] stroke-round stroke-cap-round transition-all duration-300">
                      <defs><clipPath id="headClip"><circle cx="130" cy="70" r="30" /></clipPath></defs>
                      <path d="M 20 230 L 180 230 M 50 230 L 50 20 L 130 20" className="stroke-slate-900 dark:stroke-slate-500" strokeWidth="8" />
                      <path d="M 130 20 L 130 40" className="stroke-slate-900 dark:stroke-slate-500" strokeWidth="6" />
                      <g className={`origin-[130px_40px] transition-all duration-300 ${(!isWin && gameState === 'ended' && (!isStealTurn || stealAttempted)) ? 'animate-swing' : isWin ? 'animate-soft-jump' : ''}`}>
                        {drawLevel >= (maxMistakes * (1/12)) && (
                          ((!isWin && gameState === 'ended') && loserImgUrl) ? <image href={loserImgUrl} x="100" y="40" width="60" height="60" clipPath="url(#headClip)" preserveAspectRatio="xMidYMid slice" />
                          : (isWin && winnerImgUrl) ? <image href={winnerImgUrl} x="100" y="40" width="60" height="60" clipPath="url(#headClip)" preserveAspectRatio="xMidYMid slice" />
                          : <circle cx="130" cy="70" r="30" className="fill-white dark:fill-slate-800 stroke-purple-500 dark:stroke-purple-400 stroke-[6px]" />
                        )}
                        {drawLevel >= (maxMistakes * (2/12)) && !((!isWin && gameState === 'ended') && loserImgUrl) && !(isWin && winnerImgUrl) && <g className="fill-purple-500 dark:fill-purple-400 stroke-none"><circle cx="120" cy="65" r="4" /><circle cx="140" cy="65" r="4" /></g>}
                        {drawLevel >= (maxMistakes * (3/12)) && !((!isWin && gameState === 'ended') && loserImgUrl) && !(isWin && winnerImgUrl) && <path d="M 130 75 L 130 80" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (4/12)) && !((!isWin && gameState === 'ended') && loserImgUrl) && !(isWin && winnerImgUrl) && <path d="M 120 90 Q 130 95 140 90" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (5/12)) && <path d="M 130 100 L 130 120" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (6/12)) && <path d="M 130 120 L 130 170" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (7/12)) && <path d="M 130 120 L 160 150" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (8/12)) && <path d="M 130 120 L 100 150" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (9/12)) && <path d="M 130 170 L 160 210" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (10/12)) && <path d="M 130 170 L 100 210" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= (maxMistakes * (11/12)) && <path d="M 160 210 L 175 210" className="stroke-purple-500 dark:stroke-purple-400" />}
                        {drawLevel >= maxMistakes && <path d="M 100 210 L 85 210" className="stroke-purple-500 dark:stroke-purple-400" />}
                      </g>
                    </svg>
                  </div>
                </div>

                <div className={`${gameCardClass} !bg-rose-100 dark:!bg-rose-950/30 !border-rose-900 text-center relative overflow-hidden`}>
                  <div className="absolute -right-6 -top-6 text-rose-900/10 dark:text-rose-500/10"><HeartCrack size={120} strokeWidth={3} /></div>
                  <div className="relative z-10">
                    <p className="text-sm font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                      <AlertCircle size={18} strokeWidth={3} /> الأخطاء المتبقية
                    </p>
                    <p className="text-6xl font-black text-rose-900 dark:text-rose-300 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                      {Math.max(0, maxMistakes - mistakes)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. القسم الأوسط (الكلمة والكيبورد) */}
              <div className={`lg:col-span-6 flex flex-col gap-4 p-0`}>
                
                <div className={`${gameCardClass} py-4 flex flex-row items-center justify-between gap-3`}>
                  <div className="flex gap-2 font-black text-slate-800 dark:text-slate-200 text-xs md:text-sm">
                    <span className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 border-b-4">كلمات: <span className="text-purple-600 dark:text-purple-400 text-lg">{wordsCount}</span></span>
                    <span className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 border-b-4">حروف: <span className="text-purple-600 dark:text-purple-400 text-lg">{lettersCount}</span></span>
                  </div>
                  
                  {gameState === 'playing' && !isStealTurn && (
                    <div className="flex gap-2">
                      {wordMode === 'random' && (
                        <button onClick={handleChangeRandomWord} className="bg-purple-400 text-slate-900 border-2 border-slate-900 hover:bg-purple-300 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#0f172a]" title="سحب كلمة عشوائية جديدة وتصفير المحاولات">
                          <RefreshCw size={16} strokeWidth={2.5} /> تغيير الكلمة
                        </button>
                      )}
                      <button onClick={handleHint} disabled={hintUsed || mistakes + 2 >= maxMistakes} className="bg-amber-400 text-slate-900 border-2 border-slate-900 hover:bg-amber-300 disabled:opacity-40 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#0f172a]">
                        <Lightbulb size={16} strokeWidth={2.5} /> تلميح (-2)
                      </button>
                      <button onClick={handleAddTime} disabled={mistakes + 1 >= maxMistakes} className="bg-blue-400 text-slate-900 border-2 border-slate-900 hover:bg-blue-300 disabled:opacity-40 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#0f172a]">
                        <Timer size={16} strokeWidth={2.5} /> +15ث (-1)
                      </button>
                    </div>
                  )}
                </div>

                <div className={`${gameCardClass} flex-1 flex flex-col items-center justify-center min-h-[350px]`}>
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 mb-auto w-full" dir="rtl">
                    {realWord.split(/\s+/).map((wordPart, wIdx) => {
                      const colorClass = WORD_COLORS[wIdx % WORD_COLORS.length];
                      return (
                        <div key={wIdx} className={`flex gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 shadow-inner`}>
                          {wordPart.split('').map((char, cIdx) => {
                            const isGuessed = guessedLetters.map(normalizeChar).includes(normalizeChar(char)) || isWin || stealAttempted;
                            return (
                              <div key={cIdx} className={`w-10 h-14 md:w-14 md:h-16 flex items-center justify-center font-black text-3xl md:text-4xl rounded-xl border-b-8 border-2 border-slate-900 dark:border-slate-800 transition-all duration-200
                                ${isGuessed ? `${colorClass.bg} ${colorClass.border} ${colorClass.text} ${colorClass.shadow}` : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 border-b-[6px] text-transparent shadow-none'}`}
                              >
                                <span className={isGuessed ? 'animate-in zoom-in' : ''}>{char}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full mt-10">
                    {gameState === 'playing' && !isStealTurn ? (
                      <div className="grid grid-cols-8 md:grid-cols-9 gap-2 md:gap-3" dir="rtl">
                        {ARABIC_ALPHABET.map((char) => {
                          const isGuessed = guessedLetters.includes(char);
                          const isCorrect = isGuessed && realWord.split('').map(normalizeChar).join('').includes(normalizeChar(char));
                          
                          let btnClass = "h-12 md:h-14 rounded-xl font-black text-lg md:text-xl flex items-center justify-center transition-all border-2 border-slate-900 dark:border-black ";
                          if (isGuessed) {
                            if (isCorrect) btnClass += "bg-emerald-400 border-emerald-700 border-b-2 text-slate-900 translate-y-1 opacity-100 shadow-[inset_0_4px_0_rgba(255,255,255,0.3)]";
                            else btnClass += "bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 border-b-2 text-slate-400 dark:text-slate-600 translate-y-1 opacity-50 cursor-not-allowed";
                          } else {
                            btnClass += "bg-white dark:bg-slate-700 border-b-[6px] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 active:border-b-2 active:translate-y-1 shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000]";
                          }
                          return (
                            <button key={char} id={`btn-${char}`} onClick={() => handleGuess(char)} disabled={isGuessed} className={btnClass}>{char}</button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-full animate-in slide-in-from-bottom-4 flex flex-col items-center bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-800 rounded-3xl p-6 shadow-inner">
                        <div className="text-center mb-6 w-full">
                          <h3 className={`text-4xl md:text-5xl font-black mb-3 ${isWin ? 'text-emerald-500 drop-shadow-[2px_2px_0px_#0f172a]' : 'text-rose-500 drop-shadow-[2px_2px_0px_#0f172a]'}`}>
                            {headingText}
                          </h3>
                          
                          {(!isWin && stealAttempted) && <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mt-4">الكلمة كانت: <span className="text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-xl border-2 border-slate-900 dark:border-slate-700">{realWord}</span></p>}
                          {(!isWin && !isStealTurn && teams.length === 2) && <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mt-4">الكلمة مخفية! انتقلت الفرصة للسرقة 🔄</p>}
                          {(!isWin && !isStealTurn && teams.length > 2) && <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mt-4">الكلمة مخفية! (لا يوجد سرقة لوجود أكثر من فريقين) 🔄</p>}
                          {(!isWin && isStealTurn && !stealAttempted) && <p className="text-lg md:text-xl font-black text-amber-600 mt-4 bg-amber-100 px-4 py-2 rounded-xl border-2 border-slate-900">فرصة <span className="text-slate-900 text-2xl">{teams[(activeTeamIdx + 1) % teams.length].name}</span> للسرقة! ⏳</p>}
                        </div>

                        {(!isWin && isStealTurn && !stealAttempted) ? (
                          <div className="flex flex-col gap-4 items-center w-full max-w-md">
                            <input 
                              type="text" 
                              value={stealGuess}
                              onChange={(e) => setStealGuess(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleStealConfirm()}
                              className="w-full h-16 bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-slate-700 rounded-2xl text-center text-3xl font-black text-amber-600 dark:text-amber-400 focus:border-amber-500 outline-none placeholder:text-slate-300 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] tracking-widest"
                              placeholder="اكتب الكلمة كاملة..."
                              dir="rtl"
                              autoFocus
                            />
                            <button onClick={handleStealConfirm} disabled={!stealGuess.trim()} className="w-full h-16 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 text-2xl font-black rounded-2xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] border-2 border-slate-900 border-b-8 active:border-b-2 active:translate-y-1.5 transition-all">
                              تأكيد التخمين
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => {
                              if (!isWin && !isStealTurn && teams.length === 2) {
                                  setIsStealTurn(true);
                                  setTimeLeft(15);
                                  setGameState('playing');
                              } else {
                                  nextRound();
                              }
                          }} className="w-full max-w-sm h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-2xl font-black rounded-2xl shadow-[4px_4px_0px_#cbd5e1] dark:shadow-[4px_4px_0px_#0f172a] border-2 border-slate-900 dark:border-white border-b-8 active:border-b-2 active:translate-y-1.5 transition-all pointer-events-auto">
                            {!isWin && !isStealTurn && teams.length === 2 ? `فرصة إنقاذ لـ ${teams[(activeTeamIdx + 1) % teams.length].name}` : (activeTeamIdx === teams.length - 1 && currentRound >= rounds ? 'عرض النتيجة النهائية' : 'متابعة التحدي')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. القسم الأيسر (النتائج والمؤقت) */}
              <div className={`lg:col-span-3 flex flex-col gap-4 p-0`}>
                
                <div className={`${gameCardClass} flex flex-col items-center justify-center gap-3 py-5`}>
                  <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 px-4 py-1.5 rounded-xl text-sm font-black border-2 border-slate-900 dark:border-slate-700 border-b-4">الجولة {currentRound}/{rounds}</span>
                  <span className="font-black text-base text-slate-800 dark:text-slate-200">دور: <span className="text-purple-600 dark:text-purple-400 underline decoration-2 underline-offset-4">{isStealTurn ? teams[(activeTeamIdx + 1) % teams.length].name : teams[activeTeamIdx].name}</span></span>
                </div>

                <div className={`${gameCardClass} !bg-slate-100 dark:!bg-slate-900 text-center relative overflow-hidden py-8`}>
                  {parsedTimeLimit > 0 && (
                    <div className="absolute top-0 left-0 h-3 bg-purple-500 border-b-4 border-slate-900 transition-all duration-1000" style={{ width: `${(timeLeft / (isStealTurn ? 15 : parsedTimeLimit)) * 100}%` }}></div>
                  )}
                  <Clock className={`mx-auto mb-3 ${(timeLeft <= (isStealTurn ? 5 : 15) && (parsedTimeLimit > 0 || isStealTurn)) ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-slate-100'}`} size={40} strokeWidth={2.5} />
                  <p className={`text-6xl font-black font-mono tracking-tight ${(timeLeft <= (isStealTurn ? 5 : 15) && (parsedTimeLimit > 0 || isStealTurn)) ? 'text-rose-500 drop-shadow-[4px_4px_0px_#0f172a]' : 'text-slate-900 dark:text-white drop-shadow-[4px_4px_0px_#cbd5e1] dark:drop-shadow-[4px_4px_0px_#000]'}`}>
                    {parsedTimeLimit === 0 && !isStealTurn ? '∞' : timeLeft}
                  </p>
                </div>

                <div className={`${gameCardClass} space-y-4`}>
                  <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center border-b-2 border-slate-100 dark:border-slate-700 pb-3">النقاط الحالية</p>
                  {teams.map((t) => (
                    <div key={t.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border-4 border-slate-900 dark:border-slate-700 shadow-[4px_4px_0px_#cbd5e1] dark:shadow-[4px_4px_0px_#0f172a]">
                      <span className="font-black text-base text-slate-800 dark:text-white truncate max-w-[100px]">{t.name}</span>
                      <span className={`text-3xl font-black ${getScoreColor(t.score)} drop-shadow-[2px_2px_0px_#0f172a] dark:drop-shadow-none`}>{t.score}</span>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ===================== شاشة النتيجة النهائية ===================== */}
        {gameState === 'final' && (
          <div className="relative w-full max-w-lg mx-auto bg-amber-300 dark:bg-amber-500 border-4 border-slate-900 dark:border-black rounded-[3rem] p-10 md:p-12 text-center shadow-[12px_12px_0px_#0f172a] dark:shadow-[12px_12px_0px_#000] animate-in zoom-in my-auto pb-12">
            <Trophy className="mx-auto text-slate-900 mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]" size={100} strokeWidth={1.5} />
            <h2 className="text-5xl font-black mb-10 text-slate-900 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]">نهاية التحدي</h2>
            
            <div className="space-y-5 mb-12">
              {teams.sort((a, b) => b.score - a.score).map((t, idx) => (
                <div key={t.id} className={`flex items-center justify-between p-5 rounded-2xl border-4 border-slate-900 ${idx === 0 ? 'bg-white shadow-[6px_6px_0px_#0f172a] scale-105' : 'bg-amber-100 dark:bg-amber-300 shadow-[4px_4px_0px_#0f172a]'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl font-black ${idx === 0 ? 'text-amber-500 drop-shadow-[2px_2px_0px_#0f172a]' : 'text-slate-400'}`}>#{idx + 1}</span>
                    <span className="text-2xl font-black text-slate-900">{t.name}</span>
                  </div>
                  <span className={`text-4xl font-black ${idx === 0 ? 'text-amber-500 drop-shadow-[2px_2px_0px_#0f172a]' : 'text-slate-900'}`}>{t.score}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setGameState('setup')} className="w-full h-16 bg-slate-900 dark:bg-black text-white hover:bg-slate-800 text-2xl font-black rounded-2xl shadow-[6px_6px_0px_rgba(255,255,255,0.3)] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] border-2 border-slate-900 border-b-8 active:border-b-2 active:translate-y-1.5 transition-all">
              تحدي جديد 🚀
            </button>
          </div>
        )}

      </div>
    </main>
  );
}