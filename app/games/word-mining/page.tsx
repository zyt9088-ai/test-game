/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Tajawal } from "next/font/google";
import { 
  Settings, ChevronRight, EyeOff, CheckCircle2, 
  Search, Type, ShieldQuestion, Lightbulb, 
  Swords, Check, Trophy, FastForward, Shuffle,
  Volume2, VolumeX, Send, Clock, Star, Dices, ChevronDown, UploadCloud,
  Database, Edit3, HelpCircle, X, BookOpen, Play, QrCode, Smartphone, Copy,
  Home, Info, Sun, Moon, ArrowRight
} from "lucide-react";

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800', '900'] });

type WordItem = {
  text: string;
  revealed: number; 
  guessed: boolean; 
  pointsEarned: number;
  attempts: number; 
};

type TeamData = {
  name: string;
  category: string;
  words: WordItem[];
  score: number;
};

// ألوان الكلمات بستايل Solid المأخوذة من الهوية
const WORD_COLORS = [
  { bg: 'bg-emerald-400', border: 'border-emerald-600', text: 'text-slate-900', shadow: 'shadow-[2px_2px_0px_#047857]' },
  { bg: 'bg-rose-400', border: 'border-rose-600', text: 'text-slate-900', shadow: 'shadow-[2px_2px_0px_#be123c]' },
  { bg: 'bg-blue-400', border: 'border-blue-600', text: 'text-slate-900', shadow: 'shadow-[2px_2px_0px_#1d4ed8]' },
  { bg: 'bg-amber-400', border: 'border-amber-600', text: 'text-slate-900', shadow: 'shadow-[2px_2px_0px_#b45309]' },
];

// --- محرك خلفية الألعاب (Solid 3D Vibe) ---
const SolidGamingBackground = () => {
  const [icons, setIcons] = useState<any[]>([]);

  useEffect(() => {
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

const createSoundSynth = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  const ctx = new AudioContext();

  const playMasterSound = (type: 'reveal' | 'correct' | 'win' | 'pass' | 'flip' | 'tick' | 'buzzer') => {
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'reveal') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'correct') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.setValueAtTime(600, now + 0.1); osc.frequency.setValueAtTime(900, now + 0.2);
      gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'pass') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'flip') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.5);
      gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now); osc.stop(now + 0.5);
    } else if (type === 'tick') {
      osc.type = 'square'; osc.frequency.setValueAtTime(800, now);
      gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'buzzer') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.setValueAtTime(80, now + 0.5);
      gainNode.gain.setValueAtTime(0.4, now); gainNode.gain.linearRampToValueAtTime(0.01, now + 0.8);
      osc.start(now); osc.stop(now + 0.8);
    } else if (type === 'win') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(500, now + 0.2); osc.frequency.setValueAtTime(600, now + 0.4); osc.frequency.setValueAtTime(800, now + 0.6);
      gainNode.gain.setValueAtTime(0.4, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1);
      osc.start(now); osc.stop(now + 1);
    }
  };
  return { playMasterSound };
};

const generateAlphanumericCode = (length: number) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let result = 'W'; // ⬅️ التوقيع الخاص بتنقيب الكلمات
  for (let i = 0; i < length - 1; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function WordMiningGame() {
  const [gameState, setGameState] = useState<'config' | 'waitingForTeams' | 'battle' | 'gameOver'>('config');
  const [wordsCount, setWordsCount] = useState<number>(5);
  const [turnDuration, setTurnDuration] = useState<number>(45); 

  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');
  
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinUrl, setJoinUrl] = useState<string>('');
  const [team1Ready, setTeam1Ready] = useState(false);
  const [team2Ready, setTeam2Ready] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false); 

  const [team1Data, setTeam1Data] = useState<TeamData | null>(null);
  const [team2Data, setTeam2Data] = useState<TeamData | null>(null);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [currentGuess, setCurrentGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(45);
  const [animatingRow, setAnimatingRow] = useState<string | null>(null); 
  
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [tourPhase, setTourPhase] = useState(-1);
  const [tourSteps, setTourSteps] = useState<{target: string, title: string, desc: string}[]>([]);
  const [instructionsText, setInstructionsText] = useState("جاري التحميل...");

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const synthRef = useRef<any>(null);
  const inputRef1 = useRef<HTMLInputElement>(null); 
  const inputRef2 = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    synthRef.current = createSoundSynth();
    const savedInst = localStorage.getItem('admin_wm_instructions');
    if (savedInst) setInstructionsText(savedInst);
    else setInstructionsText(`مرحباً بك في تنقيب الكلمات!\n\n1. التجهيز:\n- يقوم كل فريق بمسح الباركود والدخول لغرفة التجهيز لإدخال كلماته سرياً من جواله.\n\n2. المعركة:\n- يبدأ الفريق الأول بمحاولة تخمين كلمات الفريق الثاني ضمن الوقت المحدد.\n- يمكن طلب حرف إضافي كوسيلة مساعدة مقابل خصم بعض النقاط المحتملة من الكلمة.\n\n3. الفوز:\n- الفريق الذي ينهي استكشاف كل كلمات الخصم، أو يحصد نقاطاً أعلى بنهاية اللعبة، هو الفائز.`);
    
    // إعداد الوضع الليلي
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (gameState === 'waitingForTeams') {
      const checkReadyState = () => {
        const t1Data = localStorage.getItem('wm_team1_data');
        const t2Data = localStorage.getItem('wm_team2_data');
        
        if (t1Data && !team1Ready) {
          setTeam1Data(JSON.parse(t1Data));
          setTeam1Ready(true);
          if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('tick');
        }
        if (t2Data && !team2Ready) {
          setTeam2Data(JSON.parse(t2Data));
          setTeam2Ready(true);
          if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('tick');
        }
      };
      const interval = setInterval(checkReadyState, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, team1Ready, team2Ready, soundEnabled]);

  useEffect(() => {
    if (gameState !== 'battle') return;
    if (timeLeft <= 0) {
      if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('buzzer');
      passTurnWithFlip(false); 
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 6 && prev > 1 && soundEnabled && synthRef.current) synthRef.current.playMasterSound('tick');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState, turn, soundEnabled, team1Data, team2Data]);

  useEffect(() => {
    if (gameState === 'battle') {
      const timeoutId = setTimeout(() => {
        if (turn === 1) inputRef2.current?.focus();
        if (turn === 2) inputRef1.current?.focus();
      }, 800); 
      return () => clearTimeout(timeoutId);
    }
  }, [turn, gameState]);

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

  const handleWordsCountChange = (count: number) => {
    setWordsCount(count);
  };

  const startWaitingRoom = () => {
    const code = generateAlphanumericCode(5);
    setRoomCode(code);
    const url = `${window.location.origin}/games/word-mining/join?code=${code}`;
    setJoinUrl(url);

    localStorage.removeItem('wm_team1_data');
    localStorage.removeItem('wm_team2_data');
    localStorage.setItem('wm_room_code', code);
    localStorage.setItem('wm_words_count', wordsCount.toString());
    localStorage.setItem('wm_team1_name', team1Name);
    localStorage.setItem('wm_team2_name', team2Name);

    setTeam1Ready(false);
    setTeam2Ready(false);
    setGameState('waitingForTeams');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const startBattle = () => {
    if (team1Ready && team2Ready && team1Data && team2Data) {
      setGameState('battle'); 
      setTimeLeft(turnDuration);
    }
  };

  const getNonSpaceLength = (word: string) => word.replace(/\s/g, '').length;

  const handleRevealLetter = (targetTeam: 1 | 2, wordIndex: number) => {
    if (targetTeam === 1 && team1Data) {
      const newWords = [...team1Data.words];
      const maxLen = getNonSpaceLength(newWords[wordIndex].text);
      if (newWords[wordIndex].revealed < maxLen) {
        newWords[wordIndex].revealed += 1;
        setTeam1Data({ ...team1Data, words: newWords });
        if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('reveal'); 
        inputRef1.current?.focus();
      }
    } else if (targetTeam === 2 && team2Data) {
      const newWords = [...team2Data.words];
      const maxLen = getNonSpaceLength(newWords[wordIndex].text);
      if (newWords[wordIndex].revealed < maxLen) {
        newWords[wordIndex].revealed += 1;
        setTeam2Data({ ...team2Data, words: newWords });
        if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('reveal'); 
        inputRef2.current?.focus();
      }
    }
  };

  const submitGuess = (targetTeam: 1 | 2, wordIndex: number) => {
    const guess = currentGuess.trim();
    if (!guess) return;

    const targetData = targetTeam === 1 ? team1Data : team2Data;
    const correctWord = targetData?.words[wordIndex].text.trim();

    if (guess === correctWord) {
      handleCorrectGuess(targetTeam, wordIndex);
      setCurrentGuess('');
    } else {
      if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('pass'); 
      setCurrentGuess(''); passTurnWithFlip(false); 
    }
  };

  const passTurnWithFlip = (isSuccess = false, currentT1Words?: WordItem[], currentT2Words?: WordItem[]) => {
    let nextT1Words = currentT1Words || (team1Data ? [...team1Data.words] : []);
    let nextT2Words = currentT2Words || (team2Data ? [...team2Data.words] : []);

    if (!isSuccess) {
      if (turn === 1 && team2Data) {
        const activeIdx = nextT2Words.findIndex(w => !w.guessed);
        if (activeIdx !== -1) {
          nextT2Words[activeIdx] = { ...nextT2Words[activeIdx], attempts: nextT2Words[activeIdx].attempts + 1 };
          setTeam2Data(prev => prev ? { ...prev, words: nextT2Words } : null);
        }
      } else if (turn === 2 && team1Data) {
        const activeIdx = nextT1Words.findIndex(w => !w.guessed);
        if (activeIdx !== -1) {
          nextT1Words[activeIdx] = { ...nextT1Words[activeIdx], attempts: nextT1Words[activeIdx].attempts + 1 };
          setTeam1Data(prev => prev ? { ...prev, words: nextT1Words } : null);
        }
      }
    }

    const team1Done = nextT2Words.every(w => w.guessed); 
    const team2Done = nextT1Words.every(w => w.guessed); 

    if (team1Done && team2Done) { setGameState('gameOver'); return; }

    let nextTurn: 1 | 2 = turn === 1 ? 2 : 1;
    if (nextTurn === 1 && team1Done) { nextTurn = 2; } else if (nextTurn === 2 && team2Done) { nextTurn = 1; }

    if (nextTurn !== turn) { 
      if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('flip'); 
    } else { 
      if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('pass'); 
    }

    setCurrentGuess(''); setTimeLeft(turnDuration); setTurn(nextTurn);
  };

  const handleCorrectGuess = (targetTeam: 1 | 2, wordIndex: number) => {
    if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('correct');
    setAnimatingRow(`${targetTeam}-${wordIndex}`); 
    setTimeout(() => setAnimatingRow(null), 1000); 

    let newT1Words = team1Data!.words;
    let newT2Words = team2Data!.words;

    if (targetTeam === 1) { 
      newT1Words = [...team1Data!.words];
      newT1Words[wordIndex].guessed = true;
      const attemptsPenalty = (newT1Words[wordIndex].attempts - 1) * 15;
      const lettersPenalty = (newT1Words[wordIndex].revealed - 1) * 15;
      const points = Math.max(10, 100 - attemptsPenalty - lettersPenalty);
      newT1Words[wordIndex].pointsEarned = points;
      
      setTeam1Data({ ...team1Data!, words: newT1Words });
      setTeam2Data({ ...team2Data!, score: team2Data!.score + points }); 
    } else { 
      newT2Words = [...team2Data!.words];
      newT2Words[wordIndex].guessed = true;
      const attemptsPenalty = (newT2Words[wordIndex].attempts - 1) * 15;
      const lettersPenalty = (newT2Words[wordIndex].revealed - 1) * 15;
      const points = Math.max(10, 100 - attemptsPenalty - lettersPenalty);
      newT2Words[wordIndex].pointsEarned = points;

      setTeam2Data({ ...team2Data!, words: newT2Words });
      setTeam1Data({ ...team1Data!, score: team1Data!.score + points }); 
    }

    const team1Done = newT2Words.every(w => w.guessed);
    const team2Done = newT1Words.every(w => w.guessed);

    if (team1Done && team2Done) {
      setTimeout(() => { if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('win') }, 500);
      setGameState('gameOver');
    } else { passTurnWithFlip(true, newT1Words, newT2Words); }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60); const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderWordBoxes = (wordObj: WordItem, wIdx: number) => {
    const chars = wordObj.text.split('');
    let nonSpaceIndex = 0;
    const colorClass = WORD_COLORS[wIdx % WORD_COLORS.length];

    return (
      <div className="flex flex-row-reverse flex-wrap justify-center xl:justify-start gap-1.5" dir="ltr">
        {chars.map((char, i) => {
          if (char === ' ') return <div key={i} className="w-3 md:w-4 shrink-0" />; 
          const isRevealed = wordObj.guessed || nonSpaceIndex < wordObj.revealed;
          nonSpaceIndex++;
          return (
            <div key={i} className={`w-10 h-12 md:w-12 md:h-14 rounded-xl flex items-center justify-center font-black text-2xl md:text-3xl border-2 border-slate-900 dark:border-black transition-all duration-300
                ${wordObj.guessed 
                  ? `${colorClass.bg} ${colorClass.border} ${colorClass.text} border-b-[6px] shadow-[2px_2px_0px_#0f172a]` 
                  : isRevealed 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-b-[6px] shadow-[2px_2px_0px_#0f172a]' 
                    : 'bg-slate-200 dark:bg-slate-800 text-transparent border-slate-300 dark:border-slate-700 border-b-[6px] shadow-none'}`}
            >
              {isRevealed ? char : '?'}
            </div>
          );
        })}
      </div>
    );
  };

  const activeWordTeam1 = team1Data?.words.findIndex(w => !w.guessed);
  const activeWordTeam2 = team2Data?.words.findIndex(w => !w.guessed);

  const startTour = () => {
    setIsGuideOpen(false);
    if (gameState === 'config' || gameState === 'waitingForTeams') {
        setTourSteps([{ target: 'wm-tour-settings', title: 'تجهيز اللعبة', desc: 'حدد الإعدادات واجعل الفرق تمسح الباركود لتجهيز كلماتهم من هواتفهم.' }]);
    } else if (gameState === 'battle') {
        setTourSteps([
            { target: 'wm-tour-opponent', title: 'منطقة الخصم', desc: 'هنا تظهر كلمات الخصم كصناديق مغلقة وتكشف الحروف عند الإجابة الصحيحة أو طلب تلميح.' },
            { target: 'wm-tour-control', title: 'لوحة التحكم', desc: 'تابع وقتك، وتخطى الدور إذا احتجت، وراقب نتائج الفريقين.' }
        ]);
    }
    setTourPhase(0);
  };

  const getTourClass = (targetId: string) => {
    if (tourPhase >= 0 && tourSteps[tourPhase]?.target === targetId) {
      return 'ring-4 ring-purple-500 ring-offset-4 ring-offset-transparent scale-[1.02] shadow-2xl dark:shadow-[0_0_50px_rgba(168,85,247,0.8)] pointer-events-none !bg-white/90 dark:!bg-slate-900/95 !backdrop-blur-none transition-all';
    }
    return 'transition-all duration-300';
  };

  const getTourStyle = (targetId: string) => {
    if (tourPhase >= 0 && tourSteps[tourPhase]?.target === targetId) { return { zIndex: 100, position: 'relative' as const }; }
    return {};
  };

  const gameCardClass = "bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] p-6 transition-colors";

  return (
    <main className={`min-h-[100dvh] relative flex flex-col pt-28 md:pt-32 pb-8 p-4 md:p-6 ${tajawal.className} overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-[#0f172a]`} dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        .flip-container { perspective: 2000px; }
        .flip-inner { display: grid; transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1); }
        .flip-face { grid-area: 1 / 1; backface-visibility: hidden; will-change: transform; }
        .flip-back { transform: rotateY(180deg); }
        .is-flipped { transform: rotateY(180deg); }
        @keyframes successGlow {
          0% { box-shadow: inset 0 0 0px rgba(34, 197, 94, 0); border-color: rgba(34, 197, 94, 0.5); }
          50% { box-shadow: inset 0 0 30px rgba(34, 197, 94, 0.8); border-color: rgba(34, 197, 94, 1); transform: scale(1.02); }
          100% { box-shadow: inset 0 0 0px rgba(34, 197, 94, 0); border-color: inherit; transform: scale(1); }
        }
        .animate-success-glow { animation: successGlow 1s ease-out; }
        @keyframes panicPulse {
          0%, 100% { box-shadow: inset 0 0 50px rgba(220, 38, 38, 0); }
          50% { box-shadow: inset 0 0 150px rgba(220, 38, 38, 0.3); }
        }
        .animate-panic { animation: panicPulse 1s infinite; }
        @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
        .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
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

      {gameState === 'battle' && timeLeft <= 5 && <div className="fixed inset-0 z-50 pointer-events-none animate-panic transition-opacity duration-300"></div>}

      {/* شريط أدوات اللعبة الموحد */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex justify-between items-center mb-6 px-2 md:px-0">
        
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

      {/* النافذة الذكية للتعليمات */}
      {isGuideOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 transition-colors duration-500" style={{ zIndex: 110 }}>
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)}></div>
          <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl p-6 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in zoom-in-95">
            <button onClick={() => setIsGuideOpen(false)} className="absolute top-4 left-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors border-2 border-transparent hover:border-slate-900 dark:hover:border-black"><X size={20}/></button>
            <h2 className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2"><BookOpen size={24}/> دليل اللعبة</h2>
            <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-2 max-h-[50vh] overflow-y-auto text-sm text-slate-800 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-wrap">
              {instructionsText}
            </div>
            {gameState !== 'gameOver' && (
              <button onClick={startTour} className="w-full mt-4 bg-purple-500 border-b-[6px] border-purple-700 hover:bg-purple-400 active:border-b-0 active:translate-y-1.5 border-2 border-slate-900 text-white font-black text-xl py-3 rounded-xl transition-all shadow-md">
                بدء الجولة الميدانية 🚀
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full flex-1 flex flex-col items-center justify-center">

        {/* المربع النصي للجولة الميدانية */}
        {tourPhase >= 0 && (
            <>
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-all duration-500" style={{ zIndex: 90 }} onClick={() => setTourPhase(-1)}></div>
                {tourSteps[tourPhase] && (
                    <div className="fixed top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl p-6 w-11/12 max-w-sm text-center shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in slide-in-from-right-8 duration-300 transition-colors" style={{ zIndex: 110 }}>
                        <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-3 transition-colors">{tourSteps[tourPhase].title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 font-bold mb-6 leading-relaxed transition-colors">{tourSteps[tourPhase].desc}</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setTourPhase(prev => prev + 1 < tourSteps.length ? prev + 1 : -1)} className="flex-1 bg-purple-500 border-b-[4px] border-purple-700 active:border-b-0 active:translate-y-1 hover:bg-purple-400 border-2 border-slate-900 text-white py-2 rounded-xl font-black transition-all">
                                {tourPhase + 1 < tourSteps.length ? 'التالي' : 'إنهاء الجولة'}
                            </button>
                            {tourPhase + 1 < tourSteps.length && (
                              <button onClick={() => setTourPhase(-1)} className="bg-slate-100 dark:bg-slate-700 border-b-[4px] border-slate-300 dark:border-slate-900 active:border-b-0 active:translate-y-1 hover:bg-slate-200 dark:hover:bg-slate-600 border-2 border-slate-900 dark:border-black text-slate-800 dark:text-white px-6 py-2 rounded-xl font-bold transition-all">تخطي</button>
                            )}
                        </div>
                    </div>
                )}
            </>
        )}

        {/* ----------------- شاشة الإعدادات المدمجة ----------------- */}
        {gameState === 'config' && (
          <div id="wm-tour-settings" className={`${gameCardClass} w-full max-w-4xl mx-auto my-auto animate-in zoom-in-95 transition-colors duration-500 ${getTourClass('wm-tour-settings')}`} style={getTourStyle('wm-tour-settings')}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 border-b-2 border-slate-200 dark:border-slate-700 pb-4 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 border-2 border-slate-900 dark:border-black text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000]">
                     <Search size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                     <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">إعدادات التنقيب</h1>
                     <p className="text-xs font-bold text-slate-500 dark:text-slate-400">تجهيز المعركة والتنقيب</p>
                  </div>
               </div>
               <button onClick={startWaitingRoom} className="w-full sm:w-auto px-6 py-3 bg-purple-500 border-b-[6px] border-purple-700 active:border-b-0 active:translate-y-1.5 hover:bg-purple-400 border-2 border-slate-900 dark:border-black rounded-xl text-base font-black flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] text-white">
                  إنشاء غرفة التجهيز <Play size={18} className="fill-current" />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 relative z-10">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                <label className="text-purple-600 dark:text-purple-400 font-bold text-sm block mb-2 flex items-center gap-1.5"><Type size={16}/> عدد الكلمات المخفية</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 7, 10].map((num) => (
                    <button key={num} onClick={() => handleWordsCountChange(num)} className={`py-1.5 rounded-lg text-base font-black border-2 border-slate-900 dark:border-black transition-all duration-300 ${wordsCount === num ? 'bg-purple-500 border-purple-700 text-white border-b-4 translate-y-0.5' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{num}</button>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                <label className="text-blue-600 dark:text-blue-400 font-bold text-sm block mb-2 flex items-center gap-1.5"><Clock size={16}/> وقت الدور (بالثواني)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 45, 60].map((time) => (
                    <button key={time} onClick={() => setTurnDuration(time)} className={`py-1.5 rounded-lg text-base font-black border-2 border-slate-900 dark:border-black transition-all duration-300 ${turnDuration === time ? 'bg-blue-500 border-blue-700 text-white border-b-4 translate-y-0.5' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b-4 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{time}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 relative z-10">
              <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-inner transition-colors">
                <label className="block font-black mb-1.5 text-sm text-cyan-600 dark:text-cyan-400">الفريق الأول</label>
                <input type="text" value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} className="w-full bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-lg p-2.5 text-sm text-slate-800 dark:text-white font-bold outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors shadow-inner" />
              </div>

              <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-inner transition-colors">
                <label className="block font-black mb-1.5 text-sm text-rose-600 dark:text-rose-400">الفريق الثاني</label>
                <input type="text" value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} className="w-full bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-lg p-2.5 text-sm text-slate-800 dark:text-white font-bold outline-none focus:border-rose-500 dark:focus:border-rose-400 transition-colors shadow-inner" />
              </div>
            </div>
          </div>
        )}

        {/* ----------------- غرفة انتظار الجوالات (الباركود والرابط) ----------------- */}
        {gameState === 'waitingForTeams' && (
          <div className={`${gameCardClass} w-full max-w-5xl mx-auto my-auto animate-in zoom-in-95 transition-colors duration-500`}>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">غرفة التجهيز</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold">امسح الباركود لدخول الفرق، أو انسخ الرابط وشاركه</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-stretch">
              
              {/* القسم الأيمن (الباركود والكود ونسخ الرابط) */}
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border-4 border-slate-900 dark:border-black shadow-inner">
                <div className="bg-white p-2 rounded-2xl mb-4 border-4 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`} alt="QR Code" className="w-40 h-40 md:w-48 md:h-48" />
                </div>
                <div className="text-center bg-slate-200 dark:bg-slate-800 px-8 py-3 rounded-2xl border-4 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] mb-6 w-full max-w-[280px]">
                  <p className="text-xs font-bold mb-1 uppercase tracking-widest text-slate-500 dark:text-slate-400">كود الغرفة</p>
                  <p className="text-4xl font-black tracking-[0.3em] text-purple-600 dark:text-purple-400">{roomCode}</p>
                </div>
                <button onClick={copyToClipboard} className={`w-full max-w-[280px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all border-4 border-slate-900 dark:border-black border-b-[6px] active:border-b-4 active:translate-y-1 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] ${linkCopied ? 'bg-emerald-400 text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                  {linkCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  {linkCopied ? 'تم نسخ رابط الدعوة!' : 'نسخ رابط الدعوة'}
                </button>
              </div>

              {/* القسم الأيسر (الفرق وزر البدء) */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center">
                <div className={`p-5 rounded-2xl border-4 border-slate-900 dark:border-black flex items-center justify-between transition-colors shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] ${team1Ready ? 'bg-emerald-400 text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white'}`}>
                  <div>
                    <p className="font-black text-xl mb-1">{team1Name}</p>
                    <p className={`text-xs font-bold ${team1Ready ? 'text-slate-800' : 'text-slate-500 dark:text-slate-400'}`}>{team1Ready ? 'تم التجهيز والاعتماد' : 'بانتظار تجهيز الفريق...'}</p>
                  </div>
                  {team1Ready ? <CheckCircle2 size={36} /> : <Smartphone size={36} className="animate-pulse" />}
                </div>
                
                <div className={`p-5 rounded-2xl border-4 border-slate-900 dark:border-black flex items-center justify-between transition-colors shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] ${team2Ready ? 'bg-emerald-400 text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white'}`}>
                  <div>
                    <p className="font-black text-xl mb-1">{team2Name}</p>
                    <p className={`text-xs font-bold ${team2Ready ? 'text-slate-800' : 'text-slate-500 dark:text-slate-400'}`}>{team2Ready ? 'تم التجهيز والاعتماد' : 'بانتظار تجهيز الفريق...'}</p>
                  </div>
                  {team2Ready ? <CheckCircle2 size={36} /> : <Smartphone size={36} className="animate-pulse" />}
                </div>

                <button onClick={startBattle} disabled={!team1Ready || !team2Ready} className={`w-full mt-auto h-20 rounded-2xl text-2xl font-black flex items-center justify-center gap-3 transition-all border-4 border-slate-900 dark:border-black shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] ${team1Ready && team2Ready ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-b-[8px] active:border-b-[4px] active:translate-y-1' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed border-b-[6px] translate-y-1'}`}>
                  بدء المعركة <Swords size={32} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ----------------- شاشة المعركة الفعلية ----------------- */}
        {gameState === 'battle' && (
          <div className="w-full flex flex-col gap-4 max-w-5xl mx-auto h-full">
            
            {/* شريط القيادة العلوي (HUD) */}
            <div id="wm-tour-control" className={`${gameCardClass} p-3 md:p-5 flex items-center justify-between z-20`} style={getTourStyle('wm-tour-control')}>
              
              {/* نقاط الفريق الأول (يمين) */}
              <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-900 px-3 py-2 md:px-6 md:py-3 rounded-xl border-4 border-slate-900 dark:border-black w-[28%] md:w-1/4 shadow-inner">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-[10px] md:text-sm mb-1 truncate w-full text-center">{team1Name}</span>
                <span className="text-slate-900 dark:text-white font-black text-xl md:text-3xl flex items-center gap-1"><Star className="text-yellow-500 w-4 h-4 md:w-6 md:h-6"/> {team1Data?.score}</span>
              </div>

              {/* الوقت ودور التخمين (وسط) */}
              <div className="flex flex-col items-center justify-center flex-1 px-1">
                <div className="text-[10px] md:text-sm font-bold text-slate-500 dark:text-slate-400 mb-0.5">دور التخمين</div>
                <div className={`text-sm md:text-xl font-black mb-1.5 px-4 py-1 rounded-xl border-2 border-slate-900 dark:border-black shadow-sm ${turn === 1 ? 'bg-cyan-400 text-slate-900' : 'bg-rose-400 text-slate-900'}`}>
                  {turn === 1 ? team1Name : team2Name}
                </div>
                <div className={`flex items-center justify-center gap-1.5 px-4 py-1 rounded-xl border-4 border-slate-900 dark:border-black font-mono text-2xl md:text-4xl font-black tracking-widest shadow-inner ${timeLeft <= 5 ? 'bg-rose-500 text-slate-900 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white'}`}>
                  <Clock className={`w-5 h-5 md:w-7 md:h-7 ${timeLeft <= 5 ? 'animate-bounce' : ''}`} />
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* نقاط الفريق الثاني (يسار) */}
              <div className="flex flex-col items-center bg-slate-100 dark:bg-slate-900 px-3 py-2 md:px-6 md:py-3 rounded-xl border-4 border-slate-900 dark:border-black w-[28%] md:w-1/4 shadow-inner">
                <span className="text-rose-600 dark:text-rose-400 font-bold text-[10px] md:text-sm mb-1 truncate w-full text-center">{team2Name}</span>
                <span className="text-slate-900 dark:text-white font-black text-xl md:text-3xl flex items-center gap-1"><Star className="text-yellow-500 w-4 h-4 md:w-6 md:h-6"/> {team2Data?.score}</span>
              </div>
            </div>

            {/* مسرح اللعب (البطاقة اللي تقلب) */}
            <div id="wm-tour-opponent" className={`w-full relative z-10 flip-container flex-1 ${getTourClass('wm-tour-opponent')}`} style={getTourStyle('wm-tour-opponent')}>
              <div className={`flip-inner w-full h-full ${turn === 2 ? 'is-flipped' : ''}`}>
                
                {/* --- الوجه الأول (كلمات الفريق الثاني يخمنها الأول) --- */}
                <div className="flip-face w-full">
                  <div className="flex flex-col bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-[2rem] p-4 md:p-6 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] min-h-full transition-colors">
                    <div className="text-center mb-4 md:mb-6 border-b-4 border-slate-100 dark:border-slate-700 pb-3 md:pb-4">
                      <h3 className="text-lg md:text-2xl font-black text-rose-600 dark:text-rose-400 mb-2">كلمات {team2Name} المخفية</h3>
                      <div className="inline-flex items-center justify-center bg-rose-100 dark:bg-rose-900 border-2 border-slate-900 dark:border-black text-rose-700 dark:text-rose-300 font-black text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 rounded-xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                        التصنيف: {team2Data?.category}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-4">
                      {team2Data?.words.map((word, idx) => (
                        <div key={idx} className={`flex flex-col p-3 md:p-4 rounded-2xl border-4 transition-all duration-300 ${idx === activeWordTeam2 ? 'bg-slate-50 dark:bg-slate-900 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] scale-[1.01]' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'} ${animatingRow === `2-${idx}` ? 'animate-success-glow' : ''}`}>
                          
                          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
                            {/* مربعات LED */}
                            <div className="flex-1 w-full flex justify-center xl:justify-start">
                              {renderWordBoxes(word, idx)}
                            </div>

                            {/* التخمين والنتيجة */}
                            <div className="w-full xl:w-auto flex flex-col items-center xl:items-end justify-center">
                              {word.guessed ? (
                                <div className="text-emerald-900 font-black flex items-center justify-center gap-2 text-base md:text-lg bg-emerald-400 px-4 py-2 rounded-xl border-4 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] w-full xl:w-auto">
                                  <CheckCircle2 size={24} /> تم الاكتشاف
                                  <span className="text-slate-900 text-xs md:text-sm bg-white px-2 py-0.5 rounded-lg ml-2 border-2 border-slate-900 dark:border-black">+{word.pointsEarned}</span>
                                </div>
                              ) : (
                                idx === activeWordTeam2 && (
                                  <div className="flex flex-col w-full max-w-sm gap-2 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs">المحاولة {word.attempts}</span>
                                      {word.attempts > 1 && <span className="text-amber-500 dark:text-amber-400 font-bold text-[10px] md:text-xs animate-pulse">💡 استخدم تلميحاً للحل!</span>}
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
                                      <div className="relative flex-1 w-full">
                                        <Type className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500 dark:text-cyan-400 pointer-events-none" size={20} />
                                        <input ref={inputRef2} type="text" value={currentGuess} onChange={(e) => setCurrentGuess(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitGuess(2, idx)} placeholder="اكتب توقعك..." className="w-full h-full bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-xl py-2 md:py-3 pl-3 pr-12 md:pr-14 text-slate-900 dark:text-white font-black text-sm md:text-base outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all shadow-inner" autoComplete="off" />
                                      </div>
                                      <div className="flex gap-2">
                                        <button onClick={() => submitGuess(2, idx)} className="flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-5 md:px-6 py-2 md:py-3 rounded-xl font-black text-sm md:text-base transition-all border-2 border-slate-900 border-b-[6px] active:border-b-2 active:translate-y-1 flex items-center justify-center"><Send size={18}/></button>
                                        <button onClick={() => handleRevealLetter(2, idx)} disabled={word.revealed >= getNonSpaceLength(word.text)} className="bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 border-b-[6px] active:border-b-2 active:translate-y-1 px-3 py-2 md:py-3 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center" title="أعطني حرف (-15 نقطة)"><Lightbulb size={18}/></button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- الوجه الثاني (كلمات الفريق الأول يخمنها الثاني) --- */}
                <div className="flip-face flip-back w-full">
                  <div className="flex flex-col bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-[2rem] p-4 md:p-6 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] min-h-full transition-colors">
                    <div className="text-center mb-4 md:mb-6 border-b-4 border-slate-100 dark:border-slate-700 pb-3 md:pb-4">
                      <h3 className="text-lg md:text-2xl font-black text-cyan-600 dark:text-cyan-400 mb-2">كلمات {team1Name} المخفية</h3>
                      <div className="inline-flex items-center justify-center bg-cyan-100 dark:bg-cyan-900 border-2 border-slate-900 dark:border-black text-cyan-700 dark:text-cyan-300 font-black text-sm md:text-lg px-4 md:px-6 py-1.5 md:py-2 rounded-xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                        التصنيف: {team1Data?.category}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-4">
                      {team1Data?.words.map((word, idx) => (
                        <div key={idx} className={`flex flex-col p-3 md:p-4 rounded-2xl border-4 transition-all duration-300 ${idx === activeWordTeam1 ? 'bg-slate-50 dark:bg-slate-900 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] scale-[1.01]' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'} ${animatingRow === `1-${idx}` ? 'animate-success-glow' : ''}`}>
                          
                          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
                            {/* مربعات LED */}
                            <div className="flex-1 w-full flex justify-center xl:justify-start">
                              {renderWordBoxes(word, idx)}
                            </div>

                            {/* التخمين والنتيجة */}
                            <div className="w-full xl:w-auto flex flex-col items-center xl:items-end justify-center">
                              {word.guessed ? (
                                <div className="text-emerald-900 font-black flex items-center justify-center gap-2 text-base md:text-lg bg-emerald-400 px-4 py-2 rounded-xl border-4 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] w-full xl:w-auto">
                                  <CheckCircle2 size={24} /> تم الاكتشاف
                                  <span className="text-slate-900 text-xs md:text-sm bg-white px-2 py-0.5 rounded-lg ml-2 border-2 border-slate-900 dark:border-black">+{word.pointsEarned}</span>
                                </div>
                              ) : (
                                idx === activeWordTeam1 && (
                                  <div className="flex flex-col w-full max-w-sm gap-2 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex justify-between items-center px-1">
                                      <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs">المحاولة {word.attempts}</span>
                                      {word.attempts > 1 && <span className="text-amber-500 dark:text-amber-400 font-bold text-[10px] md:text-xs animate-pulse">💡 استخدم تلميحاً للحل!</span>}
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
                                      <div className="relative flex-1 w-full">
                                        <Type className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 dark:text-rose-400 pointer-events-none" size={20} />
                                        <input ref={inputRef1} type="text" value={currentGuess} onChange={(e) => setCurrentGuess(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitGuess(1, idx)} placeholder="اكتب توقعك..." className="w-full h-full bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-700 rounded-xl py-2 md:py-3 pl-3 pr-12 md:pr-14 text-slate-900 dark:text-white font-black text-sm md:text-base outline-none focus:border-rose-500 dark:focus:border-rose-400 transition-all shadow-inner" autoComplete="off" />
                                      </div>
                                      <div className="flex gap-2">
                                        <button onClick={() => submitGuess(1, idx)} className="flex-1 sm:flex-none bg-rose-500 hover:bg-rose-400 text-slate-900 px-5 md:px-6 py-2 md:py-3 rounded-xl font-black text-sm md:text-base transition-all border-2 border-slate-900 border-b-[6px] active:border-b-2 active:translate-y-1 flex items-center justify-center"><Send size={18}/></button>
                                        <button onClick={() => handleRevealLetter(1, idx)} disabled={word.revealed >= getNonSpaceLength(word.text)} className="bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 border-b-[6px] active:border-b-2 active:translate-y-1 px-3 py-2 md:py-3 rounded-xl transition-all disabled:opacity-30 flex items-center justify-center" title="أعطني حرف (-15 نقطة)"><Lightbulb size={18}/></button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* زر التخطي بالأسفل */}
            <div className="w-full flex justify-center mt-2 pb-6 z-10">
              <button onClick={() => passTurnWithFlip(false)} className="group flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-4 border-slate-900 dark:border-black rounded-full px-8 py-2 transition-all active:scale-95 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                <FastForward className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={20} />
                <span className="font-black text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white text-xs md:text-sm transition-colors">تخطي هذا الدور</span>
              </button>
            </div>

          </div>
        )}

        {/* ----------------- شاشة النهاية ----------------- */}
        {gameState === 'gameOver' && (
          <div className={`${gameCardClass} w-full max-w-2xl bg-amber-400 dark:bg-amber-500 !border-slate-900 dark:!border-black text-center animate-in zoom-in-95 !shadow-[12px_12px_0px_#0f172a] dark:!shadow-[12px_12px_0px_#000] p-10 my-auto`}>
            <Trophy size={120} className="mx-auto text-slate-900 mb-8 animate-bounce drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]" />
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]">نهاية التنقيب!</h2>
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center bg-white/50 dark:bg-black/20 p-4 rounded-2xl border-4 border-slate-900 dark:border-black">
                <p className="text-slate-900 dark:text-slate-100 font-bold text-xl">{team1Name}</p>
                <p className="text-slate-900 dark:text-white font-black text-4xl">{team1Data?.score} <span className="text-sm font-bold">نقطة</span></p>
              </div>
              <div className="w-1.5 h-16 bg-slate-900 dark:bg-black rounded-full"></div>
              <div className="text-center bg-white/50 dark:bg-black/20 p-4 rounded-2xl border-4 border-slate-900 dark:border-black">
                <p className="text-slate-900 dark:text-slate-100 font-bold text-xl">{team2Name}</p>
                <p className="text-slate-900 dark:text-white font-black text-4xl">{team2Data?.score} <span className="text-sm font-bold">نقطة</span></p>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-black mb-10 leading-tight text-slate-900 border-t-4 border-slate-900 dark:border-black pt-6">
              بطل التنقيب هو:<br />
              <span className="text-5xl md:text-7xl text-white flex mt-4 drop-shadow-[4px_4px_0px_#0f172a] items-center justify-center">
                {(team1Data?.score || 0) > (team2Data?.score || 0) ? team1Name : (team2Data?.score || 0) > (team1Data?.score || 0) ? team2Name : 'تعادل أسطوري!'}
              </span>
            </p>
            <button onClick={() => window.location.reload()} className="h-16 md:h-20 px-10 w-full bg-slate-900 dark:bg-black hover:bg-slate-800 text-white text-2xl font-black rounded-2xl active:border-b-2 active:translate-y-1 transition-all border-4 border-slate-900 dark:border-black border-b-[8px] flex items-center justify-center gap-3">
              <Shuffle size={28} /> تحدي جديد
            </button>
          </div>
        )}

      </div>
    </main>
  );
}