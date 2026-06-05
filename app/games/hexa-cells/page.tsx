'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Tajawal } from "next/font/google";
import { 
  ChevronRight, Search, Trophy, Shuffle,
  Volume2, VolumeX, Info, RotateCcw, Image as ImageIcon, X, Maximize, Play, Hexagon, HelpCircle, RefreshCw, FileText, CheckCircle2, Clock, Radio, QrCode, Users, Ban, MonitorPlay, Sun, Moon, Copy, ArrowRight, Home, Gamepad2, MessageCircle, Settings2, Layers, Type, UserCircle2, Plus, Trash2, Sparkles, Skull
} from "lucide-react";

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800', '900'] });

type Cell = { id: number; row: number; col: number; letter: string; owner: 0 | 1 | 2 | 3; };
type Player = { id: string; name: string; team: 1 | 2; };

const COLOR_PALETTE = [
  { name: 'أزرق (هلال)', hex: '#3b82f6' }, { name: 'أصفر (نصر)', hex: '#eab308' },
  { name: 'أخضر', hex: '#22c55e' }, { name: 'برتقالي', hex: '#f97316' },
  { name: 'أحمر', hex: '#ef4444' }, { name: 'بنفسجي', hex: '#a855f7' },
  { name: 'وردي', hex: '#ec4899' }, { name: 'سماوي', hex: '#06b6d4' },
  { name: 'ذهبي ملكي', hex: '#f59e0b' }, { name: 'فضي صارخ', hex: '#d1d5db' },
  { name: 'أسود فاحم', hex: '#000000' }, { name: 'كحلي غامق', hex: '#1e3a8a' },
  { name: 'عنابي (مارون)', hex: '#800000' }, { name: 'ليموني مشع', hex: '#a3e635' },
  { name: 'بني شوكولا', hex: '#78350f' }, { name: 'نيلي (إنديجو)', hex: '#4f46e5' },
  { name: 'فوشي', hex: '#d946ef' },
];

const ARABIC_LETTERS = ["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","هـ","و","ي"];

// ----------------------------------------------------
// محرك خلفية الألعاب (Solid 3D Vibe)
// ----------------------------------------------------
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

const createSoundSynth = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  const ctx = new AudioContext();

  const playMasterSound = (type: 'reveal' | 'correct' | 'win' | 'pass' | 'tick' | 'buzzer' | 'ding') => {
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode); gainNode.connect(ctx.destination);

    if (type === 'reveal') { osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1); osc.start(now); osc.stop(now + 0.1); } 
    else if (type === 'correct') { osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.setValueAtTime(600, now + 0.1); osc.frequency.setValueAtTime(900, now + 0.2); gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(now); osc.stop(now + 0.4); } 
    else if (type === 'win') { osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(500, now + 0.2); osc.frequency.setValueAtTime(600, now + 0.4); osc.frequency.setValueAtTime(800, now + 0.6); gainNode.gain.setValueAtTime(0.4, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1); osc.start(now); osc.stop(now + 1); } 
    else if (type === 'pass') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.3); gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3); } 
    else if (type === 'tick') { osc.type = 'square'; osc.frequency.setValueAtTime(800, now); gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05); osc.start(now); osc.stop(now + 0.05); } 
    else if (type === 'buzzer') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.setValueAtTime(80, now + 0.5); gainNode.gain.setValueAtTime(0.4, now); gainNode.gain.linearRampToValueAtTime(0.01, now + 0.8); osc.start(now); osc.stop(now + 0.8); } 
    else if (type === 'ding') { osc.type = 'sine'; osc.frequency.setValueAtTime(1000, now); osc.frequency.setValueAtTime(1500, now + 0.1); gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5); osc.start(now); osc.stop(now + 0.5); }
  };
  return { playMasterSound };
};

const generateAlphanumericCode = (length: number) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let result = 'H'; 
  for (let i = 0; i < length - 1; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const renderGridLines = (board: Cell[], W: number, H: number, R: number, PADDING: number, gridWidth: number, isDark: boolean) => {
  const lines: React.ReactNode[] = []; 
  const visitedEdges = new Set<string>();

  const edgeId = (x1: number, y1: number, x2: number, y2: number) => {
    const p1 = `${Math.round(x1)},${Math.round(y1)}`;
    const p2 = `${Math.round(x2)},${Math.round(y2)}`;
    return p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`;
  };

  const strokeColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)"; 

  board.forEach(cell => {
    const isOddRow = cell.row % 2 !== 0;
    const cxFromLeft = PADDING + (W / 2) + (cell.col * (Math.sqrt(3) * R)) + (isOddRow ? W / 2 : 0);
    const cx = gridWidth - cxFromLeft; 
    const cy = PADDING + R + (cell.row * (2 * R * 0.75));

    const points = [[cx, cy - R], [cx + W/2, cy - R/2], [cx + W/2, cy + R/2], [cx, cy + R], [cx - W/2, cy + R/2], [cx - W/2, cy - R/2]];

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i]; const p2 = points[(i + 1) % points.length];
      const id = edgeId(p1[0], p1[1], p2[0], p2[1]);
      if (!visitedEdges.has(id)) {
        visitedEdges.add(id);
        lines.push(<line key={id} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={strokeColor} strokeWidth="6" strokeLinecap="round" className="transition-colors duration-500" />);
      }
    }
  });
  return lines;
};

export default function HexaCellsGame() {
  const [gameState, setGameState] = useState<'config' | 'battle' | 'gameOver' | 'final'>('config');
  const [gridSize, setGridSize] = useState<3 | 4 | 5>(4); 
  const [rounds, setRounds] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');
  const [team1Color, setTeam1Color] = useState(COLOR_PALETTE[0].hex); 
  const [team2Color, setTeam2Color] = useState(COLOR_PALETTE[1].hex); 
  const [team1Image, setTeam1Image] = useState<string | null>(null);
  const [team2Image, setTeam2Image] = useState<string | null>(null);
  
  const [boardScale, setBoardScale] = useState(60); 
  const [board, setBoard] = useState<Cell[]>([]);
  const [isFirstTurn, setIsFirstTurn] = useState(true); 
  const [turn, setTurn] = useState<1 | 2>(1); 
  const [winner, setWinner] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [activeQuestionData, setActiveQuestionData] = useState<{q: string, a: string} | null>(null);
  
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinUrl, setJoinUrl] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false); 
  
  const [currentPhase, setCurrentPhase] = useState<'first' | 'steal' | 'open'>('first');
  const [stealTeam, setStealTeam] = useState<1 | 2 | null>(null);
  const [modalStep, setModalStep] = useState<'initial' | 'waiting_press' | 'timer3' | 'timeout3' | 'waiting_steal' | 'timeout_steal_no_press' | 'answer'>('initial');
  
  const [dbData, setDbData] = useState<{letter: string, qas: {q: string, a: string}[]}[]>([]);
  const [hcTimer, setHcTimer] = useState<number>(3);
  const [isHcTimerRunning, setIsHcTimerRunning] = useState(false);
  const [answeringTeam, setAnsweringTeam] = useState<1 | 2 | null>(null);
  const [buzzerWinnerName, setBuzzerWinnerName] = useState<string>('');

  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    const displayData = {
      gameState, gridSize, rounds, currentRound,
      team1Score, team2Score, team1Name, team2Name,
      team1Color, team2Color, team1Image, team2Image,
      board, winner, buzzerFlash: false, timestamp: Date.now()
    };
    localStorage.setItem('hx_display_sync', JSON.stringify(displayData));
  }, [gameState, gridSize, rounds, currentRound, team1Score, team2Score, team1Name, team2Name, team1Color, team2Color, team1Image, team2Image, board, winner]);

  useEffect(() => { 
    synthRef.current = createSoundSynth(); 
    const dbStr = localStorage.getItem('admin_hexa_cells_db');
    if (dbStr) { try { const parsed = JSON.parse(dbStr); if (Array.isArray(parsed)) { setDbData(parsed); } } catch(e) {} }
    
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => { setIsDarkMode(document.documentElement.classList.contains('dark')); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem('hx_live_board', JSON.stringify(board));
    localStorage.setItem('hx_grid_size', gridSize.toString());
    if (team1Image) localStorage.setItem('hx_team1_image', team1Image); else localStorage.removeItem('hx_team1_image');
    if (team2Image) localStorage.setItem('hx_team2_image', team2Image); else localStorage.removeItem('hx_team2_image');
  }, [board, gridSize, team1Image, team2Image]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hx_buzzer_winner' && e.newValue) {
        try {
          const winnerData = JSON.parse(e.newValue);
          setModalStep((prevStep) => {
            if (prevStep === 'waiting_press' || prevStep === 'waiting_steal') {
              if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('ding');
              setAnsweringTeam(winnerData.team);
              setBuzzerWinnerName(winnerData.name);
              setHcTimer(3);
              setIsHcTimerRunning(true);

              const currentDisplayData = JSON.parse(localStorage.getItem('hx_display_sync') || '{}');
              localStorage.setItem('hx_display_sync', JSON.stringify({
                ...currentDisplayData, buzzerWinnerName: winnerData.name, buzzerWinnerTeam: winnerData.team, buzzerFlash: true, timestamp: Date.now()
              }));
              return 'timer3';
            }
            return prevStep;
          });
        } catch (error) {}
      }
      if (e.key === 'hx_active_players') { setActivePlayers(JSON.parse(e.newValue || '[]')); }
    };
    
    setActivePlayers(JSON.parse(localStorage.getItem('hx_active_players') || '[]'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [soundEnabled]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHcTimerRunning && hcTimer > 0) {
      timer = setInterval(() => {
        setHcTimer((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled && synthRef.current) synthRef.current.playMasterSound('tick');
          return prev - 1;
        });
      }, 1000);
    } else if (hcTimer === 0 && isHcTimerRunning) {
      if (soundEnabled && synthRef.current) synthRef.current.playMasterSound('buzzer');
      setIsHcTimerRunning(false);
      if (modalStep === 'timer3') setModalStep('timeout3');
      if (modalStep === 'waiting_steal') {
        localStorage.setItem('hx_buzzer_status', 'waiting');
        setModalStep('timeout_steal_no_press');
      }
    }
    return () => clearInterval(timer);
  }, [isHcTimerRunning, hcTimer, soundEnabled, modalStep]);
  
  const playSound = (type: any) => { if (soundEnabled && synthRef.current) synthRef.current.playMasterSound(type); };

  const handleTeamImageUpload = (e: React.ChangeEvent<HTMLInputElement>, team: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (team === 1) setTeam1Image(url); else setTeam2Image(url);
    e.target.value = ''; 
  };

  const startMatch = () => {
    const newRoomCode = generateAlphanumericCode(5);
    setRoomCode(newRoomCode);
    const url = `${window.location.origin}/games/hexa-cells/join?code=${newRoomCode}`;
    setJoinUrl(url);

    localStorage.setItem('hx_room_code', newRoomCode);
    localStorage.setItem('hx_team1_name', team1Name);
    localStorage.setItem('hx_team1_color', team1Color);
    localStorage.setItem('hx_team2_name', team2Name);
    localStorage.setItem('hx_team2_color', team2Color);
    localStorage.setItem('hx_buzzer_status', 'waiting');
    localStorage.setItem('hx_active_players', '[]');
    setActivePlayers([]);

    setTeam1Score(0); setTeam2Score(0); setCurrentRound(1); setupBoard();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const startNextRound = () => { setCurrentRound(prev => prev + 1); setupBoard(); };

  const setupBoard = () => {
    let availableLetters = [...ARABIC_LETTERS];
    const newBoard: Cell[] = [];
    const totalCells = gridSize * gridSize;
    let pool = [...availableLetters];
    while(pool.length < totalCells) { pool = [...pool, ...ARABIC_LETTERS.sort(() => 0.5 - Math.random())]; }
    pool.sort(() => 0.5 - Math.random());
    const selectedLetters = pool.slice(0, totalCells);

    let id = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) { newBoard.push({ id, row: r, col: c, letter: selectedLetters[id], owner: 0 }); id++; }
    }
    setBoard(newBoard); setGameState('battle'); setWinner(null); setIsFirstTurn(true); setBoardScale(50); 
    setSelectedCell(null);
  };

  const checkWin = (currentBoard: Cell[], team: 1 | 2) => {
    const size = gridSize;
    const visited = new Set<number>();
    const queue: Cell[] = [];
    const startCells = currentBoard.filter(c => c.owner === team && (team === 1 ? c.col === 0 : c.row === 0));
    queue.push(...startCells); startCells.forEach(c => visited.add(c.id));

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (team === 1 && curr.col === size - 1) return true;
      if (team === 2 && curr.row === size - 1) return true;

      const neighbors = getNeighbors(curr, currentBoard);
      for (const neighbor of neighbors) {
        if (neighbor.owner === team && !visited.has(neighbor.id)) { visited.add(neighbor.id); queue.push(neighbor); }
      }
    }
    return false;
  };

  const getNeighbors = (cell: Cell, currentBoard: Cell[]) => {
    const { row, col } = cell; const isOddRow = row % 2 !== 0;
    const directions = isOddRow ? [[0, -1], [0, 1], [-1, 0], [-1, 1], [1, 0], [1, 1]] : [[0, -1], [0, 1], [-1, -1], [-1, 0], [1, -1], [1, 0]];
    return directions.map(([dr, dc]) => currentBoard.find(c => c.row === row + dr && c.col === col + dc)).filter(Boolean) as Cell[];
  };

  const pickRandomQuestion = (letter: string) => {
    const letterData = dbData.find(d => d.letter === letter);
    if (letterData && letterData.qas && letterData.qas.length > 0) {
      const randomQa = letterData.qas[Math.floor(Math.random() * letterData.qas.length)];
      setActiveQuestionData(randomQa);
    } else {
      setActiveQuestionData(null);
    }
  };

  const resetBuzzerState = () => {
    localStorage.setItem('hx_buzzer_status', 'waiting');
    localStorage.removeItem('hx_buzzer_winner');
    localStorage.removeItem('hx_active_letter');
  };

  const selectCellForAction = (cell: Cell) => {
    resetBuzzerState();
    setSelectedCell(cell);
    setModalStep('initial');
    setCurrentPhase('first');
    setStealTeam(null);
    setIsHcTimerRunning(false);
    setActiveQuestionData(null);
    setAnsweringTeam(null);
  };

  const activateAndShowQuestion = () => {
    if (selectedCell) {
      pickRandomQuestion(selectedCell.letter);
      localStorage.setItem('hx_active_letter', selectedCell.letter);
      localStorage.setItem('hx_buzzer_status', 'open_all');
      localStorage.removeItem('hx_buzzer_winner');
      setCurrentPhase('first');
      setModalStep('waiting_press');
    }
  };

  const handleRefreshQuestion = () => {
    if (selectedCell) {
      pickRandomQuestion(selectedCell.letter);
      localStorage.setItem('hx_buzzer_status', 'waiting');
      localStorage.removeItem('hx_buzzer_winner');
      setTimeout(() => {
        localStorage.setItem('hx_active_letter', selectedCell.letter);
        localStorage.setItem('hx_buzzer_status', 'open_all');
      }, 100);
      setCurrentPhase('first');
      setAnsweringTeam(null);
      setBuzzerWinnerName('');
      setStealTeam(null);
      setIsHcTimerRunning(false);
      setHcTimer(3); 
      setModalStep('waiting_press');
    }
  };

  const triggerSteal = (stealingTeam: number) => {
    setCurrentPhase('steal');
    setStealTeam(stealingTeam as 1 | 2);
    setAnsweringTeam(null); 
    setBuzzerWinnerName('');
    localStorage.removeItem('hx_buzzer_winner');
    localStorage.setItem('hx_buzzer_status', `open_team_${stealingTeam}`); 
    setHcTimer(10);
    setIsHcTimerRunning(true);
    setModalStep('waiting_steal'); 
  };

  const handleCellClick = (cell: Cell) => {
    if (winner) return;

    if (cell.owner === 0) { 
      const hasPending = board.some(c => c.owner === 3);
      if (hasPending) { alert("توجد خلية محددة حالياً، الرجاء إكمالها أو التراجع عنها أولاً!"); return; }
      playSound('reveal'); 
      const newBoard = board.map((c): Cell => c.id === cell.id ? { ...c, owner: 3 } : c); 
      setBoard(newBoard);
      selectCellForAction({ ...cell, owner: 3 }); 
    } 
    else { 
      selectCellForAction(cell); 
    }
  };

  const assignCell = (team: 0 | 1 | 2) => {
    if (!selectedCell) return;
    if (team !== 0) { playSound('correct'); setIsFirstTurn(false); setTurn(team); } 
    else { playSound('pass'); }
    
    resetBuzzerState();
    const newBoard = board.map((c): Cell => c.id === selectedCell.id ? { ...c, owner: team } : c);
    setBoard(newBoard); 
    setSelectedCell(null); 
    setActiveQuestionData(null);
    setAnsweringTeam(null);
    setIsHcTimerRunning(false);
    setModalStep('initial');

    if (team !== 0 && checkWin(newBoard, team)) {
      setTimeout(() => playSound('win'), 500);
      setWinner(team);
      if (team === 1) setTeam1Score(prev => prev + 1); else setTeam2Score(prev => prev + 1);
      setGameState('gameOver');
    }
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
      setIsDarkMode(true);
    }
  };

  const R = 48; const W = Math.sqrt(3) * R; const H = 2 * R; const Y_OFFSET = H * 0.75; const PADDING = 40; 
  const gridWidth = (gridSize * W) + (W / 2) + (PADDING * 2); const gridHeight = ((gridSize - 1) * Y_OFFSET) + H + (PADDING * 2);
  const getHexPoints = (cx: number, cy: number) => `${cx},${cy - R} ${cx + W/2},${cy - R/2} ${cx + W/2},${cy + R/2} ${cx},${cy + R} ${cx - W/2},${cy + R/2} ${cx - W/2},${cy - R/2}`;
  
  const winsNeeded = Math.floor(rounds / 2) + 1;
  const matchEnded = team1Score >= winsNeeded || team2Score >= winsNeeded || currentRound >= rounds;

  const cardClass = "bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] p-5 transition-colors";

  return (
    <main className={`min-h-[100dvh] relative flex flex-col pt-24 pb-8 px-2 md:px-4 ${tajawal.className} overflow-y-auto bg-slate-50 dark:bg-[#0f172a]`} dir="rtl">
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
              {isDarkMode ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} className="animate-wiggle" />}
            </button>
          </div>
        </div>
      </div>

      {/* شريط أدوات اللعبة (زر الرجوع يمين، الصوت والدليل يسار) */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto flex justify-between items-center mb-4 px-2 md:px-0">
        <Link href="/" className="py-2 px-4 bg-rose-500 hover:bg-rose-400 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-black rounded-xl border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 font-black text-sm">
          <ArrowRight size={18} strokeWidth={3} /> <span className="hidden sm:inline">الرجوع للمنصة</span>
        </Link>
        
        <div className="flex gap-2">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border-2 border-slate-900 dark:border-black border-b-4 active:border-b-2 active:translate-y-0.5 transition-all shadow-sm flex items-center justify-center gap-1.5 font-black text-xs md:text-sm">
            {soundEnabled ? <><Volume2 size={16} /> <span className="hidden sm:inline">الصوت شغال</span></> : <><VolumeX size={16} /> <span className="hidden sm:inline">مكتوم</span></>}
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex-1 flex flex-col h-full pb-12">
        
        {/* ===================== شاشة الإعدادات المدمجة والمصغرة (3D Solid Style) ===================== */}
        {gameState === 'config' && (
          <div className={`${cardClass} w-full max-w-4xl mx-auto my-auto animate-in zoom-in-95`}>
            
            <div className="flex justify-between items-center mb-6 border-b-4 border-slate-100 dark:border-slate-700 pb-4">
               <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-violet-900/50 text-indigo-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center border-2 border-indigo-300 dark:border-violet-700 border-b-4">
                     <Hexagon size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                     <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">إعدادات الخلايا</h1>
                     <p className="text-sm font-bold text-slate-500 dark:text-slate-400">تجهيز التحدي السداسي</p>
                  </div>
               </div>
            </div>

            {/* تقسيم الشاشة ليمين (قواعد اللعب) ويسار (الفرق) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              
              {/* القسم الأيمن: حجم اللوحة وعدد الجولات */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border-4 border-slate-200 dark:border-slate-700 flex-1 flex flex-col justify-center">
                  
                  <div className="mb-6">
                    <label className="text-indigo-600 dark:text-fuchsia-400 font-black text-base block mb-3 flex items-center gap-2"><Layers size={18}/> حجم اللوحة السداسية</label>
                    <div className="flex flex-col gap-2">
                      {[3, 4, 5].map((size) => (
                        <button key={size} onClick={() => setGridSize(size as any)} className={`w-full py-3 rounded-xl text-lg font-black border-2 transition-all duration-200 ${gridSize === size ? 'bg-indigo-500 border-indigo-700 text-white border-b-4 translate-y-0.5' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 border-b-4 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{size} × {size}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-indigo-600 dark:text-fuchsia-400 font-black text-base block mb-3 flex items-center gap-2"><Trophy size={18}/> عدد الجولات</label>
                    <div className="flex gap-2">
                      {[1, 3, 5].map((num) => (
                        <button key={num} onClick={() => setRounds(num)} className={`flex-1 py-3 rounded-xl text-lg font-black border-2 transition-all duration-200 ${rounds === num ? 'bg-indigo-500 border-indigo-700 text-white border-b-4 translate-y-0.5' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 border-b-4 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{num}</button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <button onClick={startMatch} className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-2xl text-xl font-black flex justify-center items-center gap-2 transition-all active:translate-y-1.5 border-2 border-slate-900 border-b-[6px] text-white shadow-[4px_4px_0px_#0f172a]">
                      بدء التحدي <Play size={20} className="fill-current" />
                    </button>
                  </div>

                </div>
              </div>

              {/* القسم الأيسر: إعدادات الفرق */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* الفريق الأول */}
                <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-4 transition-colors relative flex flex-col justify-center" style={{ borderColor: team1Color }}>
                  <label className="block font-black mb-2 text-base flex justify-between items-center" style={{ color: team1Color }}>الفريق الأول <span>(يمين ↔ يسار)</span></label>
                  <input type="text" value={team1Name} onChange={(e) => setTeam1Name(e.target.value)} className="w-full bg-white dark:bg-slate-800 border-4 rounded-xl p-3 text-base text-slate-800 dark:text-white font-black outline-none mb-3" style={{ borderColor: team1Color }} />
                  
                  <div className="mb-3 bg-white dark:bg-slate-800 p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {COLOR_PALETTE.map(color => (
                        <button key={`t1-${color.hex}`} onClick={() => setTeam1Color(color.hex)} className={`relative transition-all duration-200 focus:outline-none ${team1Color === color.hex ? 'scale-125 drop-shadow-md z-10' : 'opacity-60 hover:opacity-100 hover:scale-110'}`} title={color.name}>
                          <svg viewBox="0 0 24 24" className={`w-7 h-7 ${team1Color === color.hex ? 'text-slate-900 dark:text-white' : 'text-transparent'}`}>
                            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill={color.hex} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-sm font-black cursor-pointer flex-1 border-2 border-b-4 border-slate-300 dark:border-slate-600 active:border-b-2 active:translate-y-0.5">
                      <ImageIcon size={18} /> رفع الشعار
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleTeamImageUpload(e, 1)} />
                    </label>
                    {team1Image && (
                      <div className="relative w-10 h-10 rounded-xl border-2 border-slate-200 bg-white" style={{ borderColor: team1Color }}>
                        <img src={team1Image} alt="شعار" className="w-full h-full object-contain p-1" />
                        <button onClick={() => setTeam1Image(null)} className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-0.5"><X size={12} className="text-white" /></button>
                      </div>
                    )}
                  </div>
                </div>

                {/* الفريق الثاني */}
                <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-4 transition-colors relative flex flex-col justify-center" style={{ borderColor: team2Color }}>
                  <label className="block font-black mb-2 text-base flex justify-between items-center" style={{ color: team2Color }}>الفريق الثاني <span>(أعلى ↕ أسفل)</span></label>
                  <input type="text" value={team2Name} onChange={(e) => setTeam2Name(e.target.value)} className="w-full bg-white dark:bg-slate-800 border-4 rounded-xl p-3 text-base text-slate-800 dark:text-white font-black outline-none mb-3" style={{ borderColor: team2Color }} />
                  
                  <div className="mb-3 bg-white dark:bg-slate-800 p-2 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {COLOR_PALETTE.map(color => (
                        <button key={`t2-${color.hex}`} onClick={() => setTeam2Color(color.hex)} className={`relative transition-all duration-200 focus:outline-none ${team2Color === color.hex ? 'scale-125 drop-shadow-md z-10' : 'opacity-60 hover:opacity-100 hover:scale-110'}`} title={color.name}>
                          <svg viewBox="0 0 24 24" className={`w-7 h-7 ${team2Color === color.hex ? 'text-slate-900 dark:text-white' : 'text-transparent'}`}>
                            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill={color.hex} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-white px-4 py-2 rounded-xl text-sm font-black cursor-pointer flex-1 border-2 border-b-4 border-slate-300 dark:border-slate-600 active:border-b-2 active:translate-y-0.5">
                      <ImageIcon size={18} /> رفع الشعار
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleTeamImageUpload(e, 2)} />
                    </label>
                    {team2Image && (
                      <div className="relative w-10 h-10 rounded-xl border-2 border-slate-200 bg-white" style={{ borderColor: team2Color }}>
                        <img src={team2Image} alt="شعار" className="w-full h-full object-contain p-1" />
                        <button onClick={() => setTeam2Image(null)} className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-0.5"><X size={12} className="text-white" /></button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ===================== شاشة الحكم/اللوحة (Battle) ===================== */}
        {gameState === 'battle' && (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
            
            {/* الهيدر العلوي بستايل 3D */}
            <header className="bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl p-3 flex justify-between items-center shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] mb-5">
              
              <div className="flex items-center gap-3 w-1/3">
                <div className="text-xl font-black px-3 truncate drop-shadow-sm" style={{ color: team1Color }}>{team1Name}</div>
                <div className="bg-slate-100 dark:bg-slate-900 px-5 py-2 rounded-xl text-2xl font-black tabular-nums border-2 border-slate-300 dark:border-slate-700 border-b-4 shadow-inner" style={{ color: team1Color }}>{team1Score}</div>
                <div className="text-sm font-black text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center gap-1.5"><Users size={16}/> {activePlayers.filter(p => Number(p.team) === 1).length}</div>
              </div>

              <div className="flex items-center justify-center gap-3 w-1/3">
                 <button onClick={() => window.open('/games/hexa-cells/display', '_blank')} className="px-5 py-3 bg-emerald-500 border-b-4 border-emerald-700 hover:bg-emerald-400 text-white rounded-xl shadow-sm flex items-center gap-2 font-black text-sm transition-all active:border-b-0 active:translate-y-1">
                   <MonitorPlay size={18} /> شاشة الجمهور
                 </button>
              </div>

              <div className="flex items-center gap-3 w-1/3 justify-end" dir="ltr">
                <div className="text-xl font-black px-3 truncate drop-shadow-sm" style={{ color: team2Color }}>{team2Name}</div>
                <div className="bg-slate-100 dark:bg-slate-900 px-5 py-2 rounded-xl text-2xl font-black tabular-nums border-2 border-slate-300 dark:border-slate-700 border-b-4 shadow-inner" style={{ color: team2Color }}>{team2Score}</div>
                <div className="text-sm font-black text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center gap-1.5"><Users size={16}/> {activePlayers.filter(p => Number(p.team) === 2).length}</div>
              </div>
            </header>

            <div className="flex-1 flex gap-5 min-h-0">
               
               {/* القسم الأيمن: اللوحة السداسية */}
               <div className={`${cardClass} w-1/3 lg:w-[40%] flex flex-col !p-4`}>
                  <div className="flex justify-between items-center mb-4 border-b-2 border-slate-100 dark:border-slate-700 pb-3">
                    <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2"><Hexagon className="text-indigo-500"/> لوحة التحكم</h3>
                    <div className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 px-4 py-1.5 rounded-xl text-sm font-black border-2 border-amber-300 dark:border-amber-700 border-b-4">
                        دور: {turn === 1 ? team1Name : team2Name}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mb-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Maximize size={16} className="text-slate-400"/>
                      <input type="range" min="30" max="80" value={boardScale} onChange={(e) => setBoardScale(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none outline-none cursor-pointer" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-xs font-black">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border-2 dark:border-slate-600 shadow-sm" style={{ borderColor: team1Color+'80' }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team1Color }}></span>
                        <span className="text-slate-700 dark:text-slate-300">{team1Name} <span style={{ color: team1Color }}>(يمين ↔ يسار)</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border-2 dark:border-slate-600 shadow-sm" style={{ borderColor: team2Color+'80' }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team2Color }}></span>
                        <span className="text-slate-700 dark:text-slate-300">{team2Name} <span style={{ color: team2Color }}>(أعلى ↕ أسفل)</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center overflow-auto custom-scroll p-2">
                    <div className="relative transition-all duration-300 ease-out" style={{ width: '100%', maxWidth: `${boardScale * 10}px` }}>
                      <svg viewBox={`0 0 ${gridWidth} ${gridHeight}`} className="w-full h-auto drop-shadow-md" style={{ fontFamily: 'inherit' }}>
                        <defs><clipPath id="logo-clip" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath></defs>
                        
                        <polygon points={`0,0 ${gridWidth},0 ${gridWidth/2},${gridHeight/2}`} fill={team2Color} opacity="0.9" className="transition-opacity duration-500" />
                        <polygon points={`0,${gridHeight} ${gridWidth},${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={team2Color} opacity="0.9" className="transition-opacity duration-500" />
                        <polygon points={`0,0 0,${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={team1Color} opacity="0.9" className="transition-opacity duration-500" />
                        <polygon points={`${gridWidth},0 ${gridWidth},${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={team1Color} opacity="0.9" className="transition-opacity duration-500" />

                        {board.map(cell => {
                          const isOddRow = cell.row % 2 !== 0; const cxFromLeft = PADDING + (W / 2) + (cell.col * (Math.sqrt(3) * R)) + (isOddRow ? W / 2 : 0); const cx = gridWidth - cxFromLeft; const cy = PADDING + R + (cell.row * (2 * R * 0.75));
                          const isClaimed = cell.owner === 1 || cell.owner === 2; const isPending = cell.owner === 3; 
                          const teamColor = cell.owner === 1 ? team1Color : cell.owner === 2 ? team2Color : '#ffffff'; const teamImg = cell.owner === 1 ? team1Image : cell.owner === 2 ? team2Image : null;
                          let fillColor = isDarkMode ? '#1e293b' : '#f8fafc'; 
                          if (isClaimed) fillColor = teamColor; else if (isPending) fillColor = isDarkMode ? '#475569' : '#94a3b8'; 
                          const logoSize = R * 1.3; const logoX = cx - logoSize / 2; const logoY = cy - logoSize / 2;
                          return (
                            <g key={cell.id} onClick={() => handleCellClick(cell)} className="cursor-pointer transition-all hover:opacity-80" style={{ transformOrigin: `${cx}px ${cy}px`, transform: isClaimed || isPending ? 'scale(1.05)' : 'scale(1)' }}>
                              <polygon points={getHexPoints(cx, cy)} fill={fillColor} stroke={isDarkMode ? '#000000' : '#0f172a'} strokeWidth="4" />
                              {!isClaimed && (<text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" dy=".08em" fill={isPending ? "#ffffff" : (isDarkMode ? "#94a3b8" : "#475569")} fontSize="32" fontWeight="900" style={{ fontFamily: 'inherit' }}>{cell.letter}</text>)}
                              {isClaimed && teamImg && (<image href={teamImg} x={logoX} y={logoY} width={logoSize} height={logoSize} preserveAspectRatio="xMidYMid meet" clipPath="url(#logo-clip)" />)}
                            </g>
                          );
                        })}
                        <g>{renderGridLines(board, W, H, R, PADDING, gridWidth, isDarkMode)}</g>
                      </svg>
                    </div>
                  </div>
               </div>

               {/* القسم الأيسر: الأسئلة والعمليات */}
               <div className={`${cardClass} flex-1 lg:w-[60%] flex flex-col !p-6 overflow-y-auto`}>
                  
                  {!selectedCell ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-400">
                       
                       <div className="bg-white p-4 rounded-3xl shadow-[6px_6px_0px_#cbd5e1] dark:shadow-[6px_6px_0px_#000] mb-8 border-4 border-slate-900 dark:border-black">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinUrl)}`} alt="QR Code" className="w-48 h-48 md:w-56 md:h-56" />
                       </div>
                       
                       <div className="flex gap-4 mb-8">
                         <div className="text-center bg-slate-100 dark:bg-slate-900 px-8 py-3 rounded-2xl border-4 border-slate-300 dark:border-slate-700 shadow-inner flex items-center justify-center gap-3">
                            <p className="text-sm font-black uppercase tracking-widest text-slate-500">كود الغرفة:</p>
                            <p className="text-3xl font-black tracking-[0.3em] text-slate-900 dark:text-white font-mono">{roomCode}</p>
                         </div>
                         <button onClick={copyToClipboard} className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all border-4 border-b-8 shadow-sm active:border-b-4 active:translate-y-1 ${linkCopied ? 'bg-emerald-400 border-emerald-600 text-slate-900' : 'bg-white border-slate-900 text-slate-900 dark:bg-slate-800 dark:border-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                           {linkCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                           {linkCopied ? 'تم النسخ!' : 'نسخ الرابط'}
                         </button>
                       </div>
                       
                       <div className="flex items-center gap-3 text-slate-400 opacity-80">
                         <Hexagon size={32} className="animate-pulse" />
                         <h2 className="text-2xl font-black">اختر حرفاً من اللوحة للبدء</h2>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full animate-in fade-in">
                       <div className="flex items-center justify-between border-b-4 border-slate-100 dark:border-slate-800 pb-4 mb-6">
                         <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-sm bg-indigo-500 border-b-4 border-indigo-700">
                             {selectedCell.letter}
                           </div>
                           <div>
                             <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">إدارة الخلية</h3>
                             <p className="text-xs font-bold text-slate-500">تحكم بالسؤال والنتيجة من هنا</p>
                           </div>
                         </div>
                         <div className="flex gap-3">
                           {selectedCell.owner !== 0 && (
                             <button onClick={() => assignCell(0)} className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-800/50 text-rose-600 dark:text-rose-400 border-2 border-rose-300 dark:border-rose-700 border-b-4 rounded-xl text-xs font-black transition-colors flex items-center gap-2 active:border-b-2 active:translate-y-0.5">
                               <RotateCcw size={16} /> {selectedCell.owner === 3 ? 'إلغاء التحديد' : 'إخلاء الخلية'}
                             </button>
                           )}
                           <button onClick={() => { setSelectedCell(null); setActiveQuestionData(null); setIsHcTimerRunning(false); resetBuzzerState(); }} className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors border-2 border-slate-300 dark:border-slate-700 border-b-4 active:border-b-2 active:translate-y-0.5">
                             <X size={20} />
                           </button>
                         </div>
                       </div>

                       <div className="flex-1 flex flex-col">
                         
                         {modalStep === 'initial' && (
                           <div className="flex-1 flex items-center justify-center">
                             <button onClick={activateAndShowQuestion} className="w-3/4 max-w-md bg-emerald-500 hover:bg-emerald-400 text-white font-black text-2xl py-6 rounded-2xl transition-all shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4 active:translate-y-1 flex flex-col items-center gap-3">
                               <Radio className="animate-pulse" size={40} strokeWidth={2.5}/> تفعيل الجوالات واختيار سؤال
                             </button>
                           </div>
                         )}

                         {modalStep === 'waiting_press' && (
                           <div className="flex flex-col flex-1 animate-in zoom-in-95">
                             {activeQuestionData ? (
                               <>
                                 <div className="flex justify-end mb-3">
                                   <button onClick={handleRefreshQuestion} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border-2 border-slate-300 dark:border-slate-700 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all">
                                     <RefreshCw size={14} /> تغيير السؤال
                                   </button>
                                 </div>
                                 
                                 <div className="bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-black rounded-3xl p-6 mb-5 text-center min-h-[120px] flex items-center justify-center shadow-inner">
                                   <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 leading-relaxed">{activeQuestionData.q}</h3>
                                 </div>

                                 <div className="bg-emerald-100 dark:bg-emerald-900/40 border-4 border-emerald-300 dark:border-emerald-800 rounded-3xl p-5 mb-6 text-center">
                                   <p className="text-emerald-700 dark:text-emerald-500 font-black text-xs mb-2">الجواب (سري للحكم):</p>
                                   <p className="text-emerald-800 dark:text-emerald-400 font-black text-2xl">{activeQuestionData.a}</p>
                                 </div>
                                 
                                 <div className="mt-auto flex flex-col items-center gap-4">
                                   <div className="flex items-center justify-center gap-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 py-4 rounded-2xl border-4 border-indigo-300 dark:border-indigo-800 w-full shadow-inner">
                                     <Radio className="animate-ping" size={24} strokeWidth={2.5}/>
                                     <span className="text-lg font-black">
                                       {currentPhase === 'first' ? "بانتظار ضغطة أسرع لاعب..." : "وقت مفتوح... بانتظار البزر!"}
                                     </span>
                                   </div>
                                   <button onClick={() => { resetBuzzerState(); setModalStep('answer'); }} className="w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-black text-sm py-4 rounded-2xl border-4 border-slate-900 dark:border-black hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors border-b-8 active:border-b-4 active:translate-y-1">
                                     تخطي السؤال وإلغاء الخلية
                                   </button>
                                 </div>
                               </>
                             ) : (
                               <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
                                 <FileText size={60} className="mb-4" />
                                 <p className="font-black mb-6 text-xl">لا يوجد أسئلة لحرف ({selectedCell.letter})</p>
                                 <button onClick={() => { resetBuzzerState(); setModalStep('answer'); }} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-black text-lg border-b-4 active:border-b-0 active:translate-y-1">تخطي</button>
                               </div>
                             )}
                           </div>
                         )}

                         {modalStep === 'timer3' && activeQuestionData && answeringTeam && (
                           <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4">
                              <div className="bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-black rounded-2xl p-4 mb-3 text-center shadow-inner">
                                <h3 className="text-xl font-black text-amber-600 dark:text-amber-400">{activeQuestionData.q}</h3>
                              </div>
                              <div className="bg-emerald-100 dark:bg-emerald-900/40 border-4 border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 mb-5 text-center">
                                <p className="text-emerald-700 dark:text-emerald-500 font-black text-xs mb-1">الجواب:</p>
                                <p className="text-emerald-800 dark:text-emerald-400 font-black text-xl">{activeQuestionData.a}</p>
                              </div>
                              
                              <div className="bg-white dark:bg-slate-800 border-4 rounded-3xl p-6 text-center shadow-[4px_4px_0px_#0f172a] mb-6" style={{ borderColor: answeringTeam === 1 ? team1Color : team2Color }}>
                                 <p className="text-sm font-black text-slate-500 mb-2">أسرع ضغطة من ({answeringTeam === 1 ? team1Name : team2Name})</p>
                                 <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{buzzerWinnerName}</h2>
                                 <div className="text-6xl font-mono font-black text-blue-500 animate-pulse drop-shadow-md">00:0{hcTimer}</div>
                              </div>
                              
                              <div className="mt-auto flex gap-4">
                                <button onClick={() => assignCell(answeringTeam)} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg py-5 rounded-2xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] active:scale-95 transition-all flex items-center justify-center gap-2 border-4 border-slate-900 border-b-8 active:border-b-4">
                                  <CheckCircle2 size={24} strokeWidth={3}/> إجابة صحيحة
                                </button>
                                <button onClick={() => { setIsHcTimerRunning(false); setModalStep('timeout3'); }} className="flex-1 bg-rose-500 hover:bg-rose-400 text-slate-900 font-black text-lg py-5 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border-4 border-slate-900 border-b-8 active:border-b-4 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                                   إيقاف / خاطئة ❌
                                </button>
                              </div>
                           </div>
                         )}

                         {modalStep === 'timeout3' && activeQuestionData && answeringTeam && (
                           <div className="flex flex-col flex-1 animate-in zoom-in-95">
                              <div className="bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-black rounded-2xl p-4 mb-3 text-center shadow-inner">
                                <h3 className="text-xl font-black text-amber-600 dark:text-amber-400">{activeQuestionData.q}</h3>
                              </div>
                              <div className="bg-emerald-100 dark:bg-emerald-900/40 border-4 border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 mb-6 text-center">
                                <p className="text-emerald-700 dark:text-emerald-500 font-black text-xs mb-1">الجواب:</p>
                                <p className="text-emerald-800 dark:text-emerald-400 font-black text-xl">{activeQuestionData.a}</p>
                              </div>
                              
                              <h4 className="text-2xl font-black text-rose-500 text-center mb-6 animate-pulse drop-shadow-sm">انتهى الوقت! ما هو قرارك؟</h4>

                              <div className="mt-auto flex flex-col gap-4">
                                <button onClick={() => assignCell(answeringTeam)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg py-4 rounded-2xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] active:scale-95 transition-all flex items-center justify-center gap-2 border-4 border-slate-900 border-b-8 active:border-b-4">
                                  <CheckCircle2 size={20} strokeWidth={3}/> إجابة صحيحة (فوز بالخلية)
                                </button>
                                
                                {currentPhase === 'first' && (
                                  <button onClick={() => triggerSteal(answeringTeam === 1 ? 2 : 1)} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-lg py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border-4 border-slate-900 border-b-8 active:border-b-4 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                                    <Clock size={20} strokeWidth={3}/> إجابة خاطئة (سرقة للخصم)
                                  </button>
                                )}

                                {currentPhase === 'steal' && (
                                  <button onClick={() => { setCurrentPhase('open'); localStorage.removeItem('hx_buzzer_winner'); localStorage.setItem('hx_buzzer_status', 'open_all'); setModalStep('waiting_press'); }} className="w-full bg-blue-500 hover:bg-blue-400 text-slate-900 font-black text-lg py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border-4 border-slate-900 border-b-8 active:border-b-4 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                                    <RefreshCw size={20} strokeWidth={3}/> خاطئة (وقت مفتوح للجميع)
                                  </button>
                                )}

                                {currentPhase === 'open' && (
                                  <div className="flex gap-4">
                                    <button onClick={() => { localStorage.removeItem('hx_buzzer_winner'); localStorage.setItem('hx_buzzer_status', 'open_all'); setModalStep('waiting_press'); }} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-black py-4 rounded-2xl active:scale-95 transition-all border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4 text-sm">
                                      خاطئة (استمرار)
                                    </button>
                                    <button onClick={() => { resetBuzzerState(); setModalStep('answer'); }} className="flex-1 bg-rose-500 hover:bg-rose-400 text-slate-900 font-black py-4 rounded-2xl active:scale-95 transition-all border-4 border-slate-900 border-b-8 active:border-b-4 shadow-[4px_4px_0px_#0f172a] text-sm">
                                      إلغاء الخلية
                                    </button>
                                  </div>
                                )}
                              </div>
                           </div>
                         )}

                         {/* 5. انتظار السرقة */}
                         {modalStep === 'waiting_steal' && activeQuestionData && stealTeam && (
                           <div className="flex flex-col flex-1 items-center justify-center animate-in zoom-in-95">
                              <h4 className="text-2xl font-black text-slate-700 dark:text-slate-300 mb-4 text-center">
                                فرصة السرقة! انتظار بزر فريق:<br/>
                                <span className="font-black text-4xl block mt-2 drop-shadow-md" style={{ color: stealTeam === 1 ? team1Color : team2Color }}>{stealTeam === 1 ? team1Name : team2Name}</span>
                              </h4>
                              <div className="text-7xl font-mono font-black text-amber-500 animate-pulse mb-8 drop-shadow-md">
                                 00:{hcTimer < 10 ? `0${hcTimer}` : hcTimer}
                              </div>
                              <button onClick={() => { setIsHcTimerRunning(false); setCurrentPhase('open'); localStorage.removeItem('hx_buzzer_winner'); localStorage.setItem('hx_buzzer_status', 'open_all'); setModalStep('waiting_press'); }} className="w-full max-w-sm bg-rose-500 hover:bg-rose-400 text-slate-900 font-black py-4 rounded-2xl active:scale-95 transition-all border-4 border-slate-900 border-b-8 active:border-b-4 shadow-[4px_4px_0px_#0f172a] text-sm">
                                 إلغاء الانتظار وتحويل لوقت مفتوح ❌
                              </button>
                           </div>
                         )}

                         {/* 6. انتهى وقت السرقة بدون ضغط */}
                         {modalStep === 'timeout_steal_no_press' && activeQuestionData && (
                           <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4">
                              <div className="bg-slate-50 dark:bg-slate-900 border-4 border-slate-900 dark:border-black rounded-2xl p-4 mb-3 text-center shadow-inner">
                                <h3 className="text-xl font-black text-amber-600 dark:text-amber-400">{activeQuestionData.q}</h3>
                              </div>
                              <div className="bg-emerald-100 dark:bg-emerald-900/40 border-4 border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 mb-6 text-center">
                                <p className="text-emerald-700 dark:text-emerald-500 font-black text-xs mb-1">الجواب:</p>
                                <p className="text-emerald-800 dark:text-emerald-400 font-black text-xl">{activeQuestionData.a}</p>
                              </div>
                              <h4 className="text-2xl font-black text-rose-500 text-center mb-6">انتهت فرصة السرقة ولم يضغط الخصم!</h4>
                              
                              <div className="mt-auto flex flex-col gap-4">
                                <button onClick={() => { setCurrentPhase('open'); localStorage.removeItem('hx_buzzer_winner'); localStorage.setItem('hx_buzzer_status', 'open_all'); setModalStep('waiting_press'); }} className="w-full bg-blue-500 hover:bg-blue-400 text-slate-900 font-black text-lg py-4 rounded-2xl shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] active:scale-95 transition-all border-4 border-slate-900 border-b-8 active:border-b-4">
                                  تفعيل الوقت المفتوح للجميع 🔄
                                </button>
                                <div className="flex gap-4">
                                  <button onClick={handleRefreshQuestion} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-black py-4 rounded-2xl active:scale-95 transition-all border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4 text-sm">
                                    تغيير السؤال
                                  </button>
                                  <button onClick={() => { resetBuzzerState(); setModalStep('answer'); }} className="flex-1 bg-rose-500 hover:bg-rose-400 text-slate-900 font-black py-4 rounded-2xl active:scale-95 transition-all border-4 border-slate-900 border-b-8 active:border-b-4 shadow-[4px_4px_0px_#0f172a] text-sm">
                                    إلغاء الخلية
                                  </button>
                                </div>
                              </div>
                           </div>
                         )}

                         {/* 8. كشف الإجابة النهائية */}
                         {modalStep === 'answer' && activeQuestionData && (
                           <div className="flex flex-col items-center justify-center flex-1 animate-in zoom-in-95">
                             <h3 className="text-2xl font-black text-amber-600/80 dark:text-amber-500 mb-6 text-center">{activeQuestionData.q}</h3>
                             <p className="text-slate-500 font-bold mb-2 text-sm">الإجابة الصحيحة:</p>
                             <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 font-black text-4xl py-6 px-10 rounded-3xl border-4 border-emerald-300 dark:border-emerald-700 shadow-inner text-center">
                               {activeQuestionData.a}
                             </div>
                           </div>
                         )}

                       </div>
                    </div>
                  )}

               </div>

            </div>
          </div>
        )}

        {/* ===================== شاشة النتيجة النهائية ===================== */}
        {(gameState === 'gameOver' || gameState === 'final') && (
          <div className={`${cardClass} w-full max-w-2xl mx-auto my-auto !border-[6px] text-center animate-in zoom-in-95 !p-10`} style={{ borderColor: winner === 1 ? team1Color : winner === 2 ? team2Color : '#facc15' }}>
            <Trophy size={100} className="mx-auto drop-shadow-md mb-6 animate-bounce" style={{ color: winner === 1 ? team1Color : winner === 2 ? team2Color : '#facc15' }} />
            <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">
              {gameState === 'final' ? 'بطل اللقاء!' : 'اكتمل الاتصال!'}
            </h2>
            <p className="text-xl font-bold mb-8 text-slate-600 dark:text-slate-300">
              {gameState === 'final' ? 'المنتصر في هذا التحدي هو:' : 'بطل هذه الجولة هو:'}
            </p>
            <div className="font-black text-5xl md:text-6xl flex mt-4 drop-shadow-md items-center justify-center gap-4" style={{ color: winner === 1 ? team1Color : winner === 2 ? team2Color : '#facc15' }}>
              {winner === 1 && team1Image && <img src={team1Image} className="w-16 h-16 rounded-2xl border-4 border-slate-900 bg-white object-contain p-1" />}
              {winner === 2 && team2Image && <img src={team2Image} className="w-16 h-16 rounded-2xl border-4 border-slate-900 bg-white object-contain p-1" />}
              {winner === 1 ? team1Name : winner === 2 ? team2Name : 'تعادل!'}
            </div>
            
            <div className="mt-12">
              {gameState === 'gameOver' && !matchEnded ? (
                <button onClick={startNextRound} className="h-16 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-2xl font-black rounded-2xl active:translate-y-1.5 transition-all flex items-center justify-center gap-3 border-4 border-slate-900 dark:border-black border-b-8 shadow-[4px_4px_0px_#cbd5e1] dark:shadow-[4px_4px_0px_#000]">
                  الجولة التالية <ChevronRight size={28} />
                </button>
              ) : gameState === 'gameOver' && matchEnded ? (
                <button onClick={() => setGameState('final')} className="h-16 w-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-2xl font-black rounded-2xl active:translate-y-1.5 transition-all flex items-center justify-center gap-3 border-4 border-slate-900 border-b-8 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
                  النتيجة النهائية <Trophy size={28} className="text-slate-900" />
                </button>
              ) : (
                <button onClick={() => setGameState('config')} className="h-16 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-2xl font-black rounded-2xl active:translate-y-1.5 transition-all flex items-center justify-center gap-3 border-4 border-slate-900 dark:border-black border-b-8 shadow-[4px_4px_0px_#cbd5e1] dark:shadow-[4px_4px_0px_#000]">
                  <Shuffle size={28} /> تحدي جديد
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}