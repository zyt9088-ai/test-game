'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Cairo } from "next/font/google";
import { Bell, CheckCircle2, XCircle, Clock, AlertTriangle, LogOut, Users, Zap, Sun, Moon } from 'lucide-react';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700', '900'] });

type BuzzerState = 'waiting' | 'active' | 'won' | 'lost' | 'locked';
type Cell = { id: number; row: number; col: number; letter: string; owner: 0 | 1 | 2 | 3; };
type Player = { id: string; name: string; team: 1 | 2; };

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

    const generatedIcons = Array.from({ length: 8 }).map((_, i) => ({
      id: `icon-${i}`, shape: gameShapes[i % gameShapes.length], 
      colorClass: iconColors[i % iconColors.length],
      left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, size: Math.random() * 30 + 30, 
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

export default function BuzzerPage() {
  const router = useRouter();
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState('#3b82f6');
  const [teammates, setTeammates] = useState<Player[]>([]);
  
  const [buzzerState, setBuzzerState] = useState<BuzzerState>('waiting');
  const [winnerName, setWinnerName] = useState<string>('');
  const [activeLetter, setActiveLetter] = useState<string>('');

  const [board, setBoard] = useState<Cell[]>([]);
  const [gridSize, setGridSize] = useState(4);
  const [t1Color, setT1Color] = useState('#3b82f6');
  const [t2Color, setT2Color] = useState('#eab308');

  const [isDarkMode, setIsDarkMode] = useState(true);

  const updateTeammates = useCallback((sessionTeam: number, sessionId: string) => {
    const players: Player[] = JSON.parse(localStorage.getItem('hx_active_players') || '[]');
    setTeammates(players.filter(p => Number(p.team) === Number(sessionTeam) && p.id !== sessionId));
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('player_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const sessionStr = sessionStorage.getItem('hx_player_session');
    if (!sessionStr) { router.push('/games/hexa-cells/join'); return; }

    try {
      const session = JSON.parse(sessionStr);
      setPlayerData(session);

      const tName = localStorage.getItem(`hx_team${session.team}_name`);
      const tColor = localStorage.getItem(`hx_team${session.team}_color`);
      if (tName) setTeamName(tName);
      if (tColor) setTeamColor(tColor);

      setT1Color(localStorage.getItem('hx_team1_color') || '#3b82f6');
      setT2Color(localStorage.getItem('hx_team2_color') || '#eab308');

      const savedBoard = localStorage.getItem('hx_live_board');
      const savedGridSize = localStorage.getItem('hx_grid_size');
      if (savedBoard) setBoard(JSON.parse(savedBoard));
      if (savedGridSize) setGridSize(parseInt(savedGridSize));

      updateTeammates(session.team, session.id);
      checkCurrentState(session.team);
    } catch (e) {
      router.push('/games/hexa-cells/join');
    }

    const handleStorageChange = (e: StorageEvent) => {
      const session = JSON.parse(sessionStorage.getItem('hx_player_session') || '{}');
      if (!session.team) return;

      if (e.key === 'hx_buzzer_status' || e.key === 'hx_buzzer_winner') {
        checkCurrentState(session.team);
      }
      if (e.key === 'hx_active_letter') { setActiveLetter(e.newValue || ''); }
      if (e.key === 'hx_live_board' && e.newValue) { setBoard(JSON.parse(e.newValue)); }
      if (e.key === 'hx_active_players') { updateTeammates(session.team, session.id); }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, updateTeammates]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('player_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('player_theme', 'light');
      }
      return next;
    });
  };

  const checkCurrentState = useCallback((myTeam: number) => {
    const status = localStorage.getItem('hx_buzzer_status');
    const winnerStr = localStorage.getItem('hx_buzzer_winner');
    const letter = localStorage.getItem('hx_active_letter');
    
    if (letter) setActiveLetter(letter); else setActiveLetter('');

    if (status === 'closed' && winnerStr) {
      try {
        const winner = JSON.parse(winnerStr);
        setWinnerName(winner.name);
        if (Number(winner.team) === Number(myTeam)) {
          setBuzzerState('won');
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else {
          setBuzzerState('lost');
          if (navigator.vibrate) navigator.vibrate(200);
        }
      } catch (e) {}
    } 
    else if (status === 'open_all') {
      setBuzzerState('active');
      setWinnerName('');
    } 
    else if (status === `open_team_${myTeam}`) {
      setBuzzerState('active');
      setWinnerName('');
      if (navigator.vibrate) navigator.vibrate(50); 
    } 
    else if (status && status.startsWith('open_team_') && status !== `open_team_${myTeam}`) {
      setBuzzerState('locked');
    } 
    else if (status === 'locked') {
      setBuzzerState('locked');
    } else {
      setBuzzerState('waiting');
    }
  }, []);

  const handlePress = () => {
    if (buzzerState !== 'active' || !playerData) return;
    const winnerData = { team: playerData.team, name: playerData.name, timestamp: Date.now() };
    localStorage.setItem('hx_buzzer_winner', JSON.stringify(winnerData));
    localStorage.setItem('hx_buzzer_status', 'closed'); 
    setBuzzerState('won');
    setWinnerName(playerData.name);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  };

  const handleLogout = () => {
    if (playerData) {
      const existing = JSON.parse(localStorage.getItem('hx_active_players') || '[]');
      const updated = existing.filter((p: Player) => p.id !== playerData.id);
      localStorage.setItem('hx_active_players', JSON.stringify(updated));
    }
    sessionStorage.removeItem('hx_player_session');
    router.push('/games/hexa-cells/join');
  };

  const renderMiniBoard = () => {
    if (board.length === 0) return null;
    const R = 28; 
    const W = Math.sqrt(3) * R; const H = 2 * R; const Y_OFFSET = H * 0.75; const PADDING = 30; 
    const gridWidth = (gridSize * W) + (W / 2) + (PADDING * 2); const gridHeight = ((gridSize - 1) * Y_OFFSET) + H + (PADDING * 2);
    const getHexPoints = (cx: number, cy: number) => `${cx},${cy - R} ${cx + W/2},${cy - R/2} ${cx + W/2},${cy + R/2} ${cx},${cy + R} ${cx - W/2},${cy + R/2} ${cx - W/2},${cy - R/2}`;
    
    return (
      <svg viewBox={`0 0 ${gridWidth} ${gridHeight}`} className="w-full h-full max-h-[85vh] overflow-visible transition-all duration-500 drop-shadow-md">
        <polygon points={`0,0 ${gridWidth},0 ${gridWidth/2},${gridHeight/2}`} fill={t2Color} opacity="0.8" />
        <polygon points={`0,${gridHeight} ${gridWidth},${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={t2Color} opacity="0.8" />
        <polygon points={`0,0 0,${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={t1Color} opacity="0.8" />
        <polygon points={`${gridWidth},0 ${gridWidth},${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={t1Color} opacity="0.8" />
        
        {board.map(cell => {
          const isOddRow = cell.row % 2 !== 0; const cxFromLeft = PADDING + (W / 2) + (cell.col * (Math.sqrt(3) * R)) + (isOddRow ? W / 2 : 0); const cx = gridWidth - cxFromLeft; const cy = PADDING + R + (cell.row * (2 * R * 0.75));
          const isClaimed = cell.owner === 1 || cell.owner === 2; const isPending = cell.owner === 3; 
          const cellColor = cell.owner === 1 ? t1Color : cell.owner === 2 ? t2Color : '#ffffff';
          
          let fillColor = isDarkMode ? '#1e293b' : '#ffffff'; 
          if (isClaimed) fillColor = cellColor; 
          else if (isPending) fillColor = isDarkMode ? '#475569' : '#cbd5e1'; 
          
          const isTarget = activeLetter === cell.letter;

          return (
            <g key={cell.id} style={{ transformOrigin: `${cx}px ${cy}px`, transform: isTarget ? 'scale(1.15)' : 'scale(1)' }}>
              <polygon points={getHexPoints(cx, cy)} fill={fillColor} stroke={isTarget ? '#facc15' : (isDarkMode ? '#000000' : '#0f172a')} strokeWidth={isTarget ? 4 : 2} className={isTarget ? 'animate-pulse' : ''} />
              {isClaimed && <polygon points={getHexPoints(cx, cy)} fill={isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"} stroke="none" />}
              {!isClaimed && <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" dy=".08em" fill={isPending ? (isDarkMode ? "#cbd5e1" : "#475569") : (isDarkMode ? "#ffffff" : "#0f172a")} fontSize="26" fontWeight="900" style={{ fontFamily: 'inherit' }}>{cell.letter}</text>}
            </g>
          );
        })}
      </svg>
    );
  };

  if (!playerData) return null;

  const getBuzzerUI = () => {
    switch (buzzerState) {
      case 'active': return { bgClass: 'bg-emerald-500 hover:bg-emerald-400 active:border-b-4 active:translate-y-3', icon: <Bell size={56} className="text-slate-900 mb-2 animate-wiggle" strokeWidth={2.5}/>, text: 'اضغط!', subtext: 'أسرع قبل الخصم', borderColor: 'border-emerald-700', textColor: 'text-slate-900', subColor: 'text-emerald-900', shadow: 'shadow-[0_15px_0_#047857]' };
      case 'won': 
        const isMe = winnerName === playerData.name;
        return { bgClass: 'bg-indigo-500', icon: <CheckCircle2 size={56} className="text-white mb-2" strokeWidth={2.5}/>, text: isMe ? 'أنت الأسرع!' : 'فريقك الأسرع', subtext: isMe ? 'جاوب بصوت عالي' : `${winnerName} يجاوب!`, borderColor: 'border-indigo-700', textColor: 'text-white', subColor: 'text-indigo-200', shadow: 'shadow-[0_8px_0_#4338ca] translate-y-2' };
      case 'lost': return { bgClass: 'bg-rose-500', icon: <XCircle size={56} className="text-white mb-2" strokeWidth={2.5}/>, text: 'راحت عليكم', subtext: `الخصم أسرع`, borderColor: 'border-rose-700', textColor: 'text-white', subColor: 'text-rose-200', shadow: 'shadow-[0_8px_0_#be123c] translate-y-2' };
      case 'locked': return { bgClass: 'bg-slate-400 dark:bg-slate-700', icon: <AlertTriangle size={56} className="text-white mb-2" strokeWidth={2.5}/>, text: 'مقفول', subtext: 'الفرصة للخصم', borderColor: 'border-slate-600 dark:border-slate-900', textColor: 'text-white', subColor: 'text-slate-200', shadow: 'shadow-[0_8px_0_#475569] dark:shadow-[0_8px_0_#0f172a] translate-y-2' };
      default: return { bgClass: 'bg-slate-200 dark:bg-slate-800', icon: <Zap size={56} className="text-slate-400 dark:text-slate-600 mb-2 animate-pulse" strokeWidth={2.5}/>, text: 'انتظار', subtext: 'راقب اللوحة', borderColor: 'border-slate-400 dark:border-black', textColor: 'text-slate-500 dark:text-slate-400', subColor: 'text-slate-400 dark:text-slate-500', shadow: 'shadow-[0_12px_0_#94a3b8] dark:shadow-[0_12px_0_#000] translate-y-1' };
    }
  };

  const ui = getBuzzerUI();

  return (
    <main className={`h-[100dvh] w-screen flex flex-col ${cairo.className} transition-colors duration-300 select-none touch-none overflow-hidden relative bg-slate-50 dark:bg-[#0f172a]`} dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
        .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
      `}} />

      <SolidGamingBackground />

      {/* الهيدر العلوي (Solid 3D Style) */}
      <header className="relative z-20 w-[95%] max-w-4xl mx-auto mt-4 px-4 py-3 flex items-center justify-between border-4 border-slate-900 dark:border-black rounded-3xl bg-white dark:bg-slate-800 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border-4 border-slate-900 dark:border-black text-slate-900 font-black text-xl shadow-inner bg-slate-100" style={{ backgroundColor: teamColor, borderColor: 'var(--color-slate-900)', color: '#fff' }}>{playerData.name.charAt(0)}</div>
          <div>
            <h2 className="text-slate-900 dark:text-white font-black text-lg leading-tight tracking-wide">{playerData.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full border border-slate-900" style={{ backgroundColor: teamColor }}></div>
              <p className="text-slate-600 dark:text-slate-400 font-bold text-[11px] uppercase tracking-wider">{teamName}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={toggleTheme} className="text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 p-2.5 rounded-xl transition-all border-2 border-slate-300 dark:border-slate-700 border-b-4 active:border-b-2 active:translate-y-0.5">
             {isDarkMode ? <Sun size={20} strokeWidth={2.5}/> : <Moon size={20} strokeWidth={2.5}/>}
           </button>
           <button onClick={handleLogout} className="text-rose-500 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-800/50 p-2.5 rounded-xl transition-all border-2 border-rose-200 dark:border-rose-800 border-b-4 active:border-b-2 active:translate-y-0.5">
             <LogOut size={20} strokeWidth={2.5}/>
           </button>
        </div>
      </header>

      {/* التوزيع الأفقي */}
      <div className="relative z-10 flex-1 flex flex-row items-stretch justify-between w-full h-full overflow-hidden p-4 gap-4 max-w-6xl mx-auto">
        
        {/* القسم الأيمن: البزر العملاق (Arcade Style) */}
        <div className="w-[35%] sm:w-[30%] max-w-[280px] h-full flex flex-col items-center justify-center">
          <button
            onClick={handlePress}
            disabled={buzzerState !== 'active'}
            className={`w-full aspect-square rounded-full border-4 flex flex-col items-center justify-center transition-all duration-150 outline-none relative overflow-hidden ${ui.bgClass} ${ui.borderColor} ${ui.shadow} ${buzzerState === 'active' ? 'border-b-[16px]' : 'border-b-[8px]'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="relative z-10 flex flex-col items-center">
              {ui.icon}
              <span className={`font-black text-3xl sm:text-4xl md:text-5xl tracking-wide ${ui.textColor}`}>{ui.text}</span>
              <span className={`font-bold text-xs sm:text-sm mt-2 px-4 py-1.5 rounded-xl bg-black/10 ${ui.subColor}`}>{ui.subtext}</span>
            </div>
          </button>
        </div>

        {/* القسم الأوسط: اللوحة (Solid Style) */}
        <div className="flex-1 h-full flex items-center justify-center relative bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-slate-900 dark:border-black shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] p-4 transition-colors duration-500">
          {renderMiniBoard()}
        </div>

        {/* القسم الأيسر: قائمة اللاعبين (Solid Style) */}
        <div className="w-[25%] sm:w-[20%] max-w-[220px] h-full flex flex-col items-start justify-start">
          <div className="w-full bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-[2.5rem] p-4 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] h-full overflow-hidden flex flex-col transition-colors duration-500">
            <h3 className="text-slate-800 dark:text-white text-sm font-black mb-4 flex items-center gap-2 border-b-4 border-slate-100 dark:border-slate-700 pb-3">
              <Users size={18} className="text-indigo-500"/> فريقك
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scroll pr-1 flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs border-2 border-slate-900 dark:border-black shadow-inner" style={{ backgroundColor: teamColor }}>{playerData.name.charAt(0)}</div>
                <span className="text-slate-900 dark:text-white font-black text-sm truncate">أنت</span>
              </div>
              
              {teammates.length > 0 ? teammates.map(t => (
                <div key={t.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 font-black text-xs bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700">{t.name.charAt(0)}</div>
                  <span className="text-slate-600 dark:text-slate-400 font-bold text-sm truncate">{t.name}</span>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-32 opacity-50 text-center text-slate-500 dark:text-slate-400">
                  <Users size={32} className="mb-3"/>
                  <span className="text-xs font-bold">بانتظار انضمام<br/>أعضاء للفريق</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}