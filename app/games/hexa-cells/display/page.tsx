'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cairo } from "next/font/google";
import { Trophy, Zap, MonitorPlay, Sun, Moon } from 'lucide-react';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700', '900'] });

type Cell = { id: number; row: number; col: number; letter: string; owner: 0 | 1 | 2 | 3; };

// ----------------------------------------------------
// محرك خلفية الألعاب (Solid 3D Vibe) بديل للجزيئات
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

    const generatedIcons = Array.from({ length: 15 }).map((_, i) => ({
      id: `icon-${i}`, shape: gameShapes[i % gameShapes.length], 
      colorClass: iconColors[i % iconColors.length],
      left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, size: Math.random() * 60 + 60, 
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

const renderGridLines = (board: Cell[], W: number, H: number, R: number, PADDING: number, gridWidth: number, isDarkMode: boolean) => {
  const lines: React.ReactNode[] = []; 
  const visitedEdges = new Set<string>();

  const edgeId = (x1: number, y1: number, x2: number, y2: number) => {
    const p1 = `${Math.round(x1)},${Math.round(y1)}`;
    const p2 = `${Math.round(x2)},${Math.round(y2)}`;
    return p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`;
  };

  const strokeColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)"; 

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
        lines.push(<line key={id} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={strokeColor} strokeWidth="8" strokeLinecap="round" className="transition-colors duration-500" />);
      }
    }
  });
  return lines;
};

export default function AudienceDisplayPage() {
  const [gameState, setGameState] = useState<'config' | 'battle' | 'gameOver' | 'final'>('config');
  const [gridSize, setGridSize] = useState(4); 
  const [rounds, setRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');
  const [team1Color, setTeam1Color] = useState('#3b82f6'); 
  const [team2Color, setTeam2Color] = useState('#eab308'); 
  const [team1Image, setTeam1Image] = useState<string | null>(null);
  const [team2Image, setTeam2Image] = useState<string | null>(null);
  
  const [board, setBoard] = useState<Cell[]>([]);
  const [winner, setWinner] = useState<number | null>(null);

  const [flashData, setFlashData] = useState<{name: string, team: number} | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('display_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    const syncData = () => {
      const dataStr = localStorage.getItem('hx_display_sync');
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          setGameState(data.gameState || 'config');
          setGridSize(data.gridSize || 4);
          setRounds(data.rounds || 3);
          setCurrentRound(data.currentRound || 1);
          setTeam1Score(data.team1Score || 0);
          setTeam2Score(data.team2Score || 0);
          setTeam1Name(data.team1Name || 'الفريق الأول');
          setTeam2Name(data.team2Name || 'الفريق الثاني');
          setTeam1Color(data.team1Color || '#3b82f6');
          setTeam2Color(data.team2Color || '#eab308');
          setTeam1Image(data.team1Image || null);
          setTeam2Image(data.team2Image || null);
          setBoard(data.board || []);
          setWinner(data.winner || null);

          if (data.buzzerFlash) {
            setFlashData({ name: data.buzzerWinnerName, team: data.buzzerWinnerTeam });
            const resetData = { ...data, buzzerFlash: false };
            localStorage.setItem('hx_display_sync', JSON.stringify(resetData));
            setTimeout(() => { setFlashData(null); }, 5000);
          }
        } catch(e) {}
      }
    };

    syncData();
    window.addEventListener('storage', syncData);
    const interval = setInterval(syncData, 500);
    return () => { window.removeEventListener('storage', syncData); clearInterval(interval); };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('display_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('display_theme', 'light');
      }
      return next;
    });
  };

  const R = 80; 
  const W = Math.sqrt(3) * R; 
  const H = 2 * R; 
  const Y_OFFSET = H * 0.75; 
  const PADDING = 100; 
  const gridWidth = (gridSize * W) + (W / 2) + (PADDING * 2); 
  const gridHeight = ((gridSize - 1) * Y_OFFSET) + H + (PADDING * 2);
  const getHexPoints = (cx: number, cy: number) => `${cx},${cy - R} ${cx + W/2},${cy - R/2} ${cx + W/2},${cy + R/2} ${cx},${cy + R} ${cx - W/2},${cy + R/2} ${cx - W/2},${cy - R/2}`;

  if (gameState === 'config') {
    return (
      <main className={`w-screen h-[100dvh] flex flex-col items-center justify-center transition-colors duration-700 ${cairo.className} bg-slate-50 dark:bg-[#0f172a]`} dir="rtl">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
          .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
        `}} />

        <SolidGamingBackground />
        
        <button onClick={toggleTheme} className="fixed bottom-6 left-6 z-[60] p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 active:translate-y-1 transition-all shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4">
          {isDarkMode ? <Sun size={32} /> : <Moon size={32} />}
        </button>
        
        <div className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-800 p-16 md:p-24 rounded-[3rem] border-4 border-slate-900 dark:border-black shadow-[16px_16px_0px_#0f172a] dark:shadow-[16px_16px_0px_#000] animate-in zoom-in-95 duration-500 text-center mx-4">
          <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 border-4 border-slate-900 dark:border-black rounded-3xl flex items-center justify-center mb-8 shadow-inner">
             <MonitorPlay size={80} className="text-indigo-500 dark:text-indigo-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">شاشة العرض جاهزة</h1>
          <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-900 px-8 py-4 rounded-2xl border-4 border-slate-300 dark:border-slate-700 border-b-8">
            بانتظار بدء التحدي من شاشة الحكم... ⏳
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`w-screen h-[100dvh] flex flex-col transition-colors duration-700 ${cairo.className} overflow-hidden select-none bg-slate-50 dark:bg-[#0f172a]`} dir="rtl">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
        .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
      `}} />

      <SolidGamingBackground />
      
      {/* زر الثيم 3D */}
      <button onClick={toggleTheme} className="fixed bottom-6 left-6 z-[60] p-3 md:p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 active:translate-y-1 transition-all shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4">
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* ===================== تأثير الفلاش (صاعقة البزر بستايل أركيد فخم) ===================== */}
      {flashData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative z-10 flex flex-col items-center bg-white dark:bg-slate-800 border-[8px] border-slate-900 dark:border-black px-16 py-16 md:px-32 md:py-24 rounded-[4rem] animate-in zoom-in-50 duration-500 shadow-[20px_20px_0px_#000]" style={{ boxShadow: `20px 20px 0px ${flashData.team === 1 ? team1Color : team2Color}` }}>
             <div className="w-40 h-40 rounded-full flex items-center justify-center border-8 border-slate-900 dark:border-black mb-8 bg-amber-400 shadow-[inset_0_-10px_0_rgba(0,0,0,0.2)] animate-bounce">
                <Zap size={100} className="text-slate-900 fill-slate-900" />
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-slate-200 mb-6 tracking-widest uppercase bg-slate-100 dark:bg-slate-900 px-8 py-3 rounded-2xl border-4 border-slate-300 dark:border-slate-700">أسرع ضغطة!</h2>
             <h1 className="text-7xl md:text-9xl font-black leading-normal text-center drop-shadow-[4px_4px_0px_#0f172a] dark:drop-shadow-[6px_6px_0px_#000] pb-2" style={{ color: flashData.team === 1 ? team1Color : team2Color }}>
               {flashData.name}
             </h1>
          </div>
        </div>
      )}

      {/* ===================== تخطيط الشاشة (Battle) ===================== */}
      {gameState === 'battle' && (
        <div className="relative z-10 flex-1 flex flex-row items-center justify-between w-full h-full pt-8 pb-10 px-8 lg:px-12 gap-8">
          
          {/* يمين الشاشة: الفريق الأول */}
          <div className="flex flex-col items-center justify-center w-[25%] gap-6 z-20">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[3rem] border-8 border-slate-900 dark:border-black shadow-[12px_12px_0px_#0f172a] dark:shadow-[12px_12px_0px_#000] flex flex-col items-center w-full">
               {team1Image ? (
                 <img src={team1Image} className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[8px] object-contain p-2 bg-slate-100 dark:bg-slate-900 shadow-inner mb-6" style={{ borderColor: team1Color }} />
               ) : (
                 <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[8px] flex items-center justify-center text-7xl font-black text-slate-800 dark:text-white shadow-inner bg-slate-100 dark:bg-slate-900 mb-6" style={{ borderColor: team1Color }}>{team1Name.charAt(0)}</div>
               )}
               <span className="text-3xl lg:text-5xl font-black text-center leading-normal pb-2 break-words w-full dark:text-white drop-shadow-sm" style={{ color: isDarkMode ? '#fff' : team1Color }}>{team1Name}</span>
               <span className="mt-4 text-lg md:text-xl font-black uppercase tracking-widest px-8 py-3 rounded-2xl border-4" style={{ color: team1Color, borderColor: team1Color, backgroundColor: `${team1Color}15` }}>الفريق الأول</span>
            </div>
          </div>

          {/* وسط الشاشة: اللوحة العملاقة مع النتيجة */}
          <div className="flex-1 flex flex-col justify-center items-center h-full relative z-10 w-[50%]">
            
            {/* الهيدر العلوي (الجولة + النتيجة بستايل 3D) */}
            <div className="w-full flex justify-between items-center mb-8 px-4 z-20">
              <div className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-black tracking-widest uppercase bg-white dark:bg-slate-800 px-8 py-4 rounded-2xl border-4 border-slate-900 dark:border-black shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000]">
                الجولة {currentRound} / {rounds}
              </div>

              <div className="flex items-center gap-6 bg-white dark:bg-slate-800 px-10 py-4 rounded-3xl border-4 border-slate-900 dark:border-black shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000]">
                <span className="text-5xl md:text-7xl font-black tabular-nums drop-shadow-sm" style={{ color: team1Color }}>{team1Score}</span>
                <span className="text-3xl md:text-4xl text-slate-400 dark:text-slate-600 font-black bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border-4 border-slate-200 dark:border-slate-700">-</span>
                <span className="text-5xl md:text-7xl font-black tabular-nums drop-shadow-sm" style={{ color: team2Color }}>{team2Score}</span>
              </div>
            </div>

            {/* اللوحة السداسية Solid Style */}
            <svg viewBox={`0 0 ${gridWidth} ${gridHeight}`} className="w-auto h-full max-h-[75vh] drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700" style={{ fontFamily: 'inherit' }}>
              <defs><clipPath id="logo-clip" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath></defs>
              
              <polygon points={`0,0 ${gridWidth},0 ${gridWidth/2},${gridHeight/2}`} fill={team2Color} opacity="0.9" className="transition-opacity duration-500" />
              <polygon points={`0,${gridHeight} ${gridWidth},${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={team2Color} opacity="0.9" className="transition-opacity duration-500" />
              <polygon points={`0,0 0,${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={team1Color} opacity="0.9" className="transition-opacity duration-500" />
              <polygon points={`${gridWidth},0 ${gridWidth},${gridHeight} ${gridWidth/2},${gridHeight/2}`} fill={team1Color} opacity="0.9" className="transition-opacity duration-500" />
              
              {/* رسم الخلايا */}
              {board.map(cell => {
                const isOddRow = cell.row % 2 !== 0; 
                const cxFromLeft = PADDING + (W / 2) + (cell.col * (Math.sqrt(3) * R)) + (isOddRow ? W / 2 : 0); 
                const cx = gridWidth - cxFromLeft; 
                const cy = PADDING + R + (cell.row * (2 * R * 0.75));
                
                const isClaimed = cell.owner === 1 || cell.owner === 2; 
                const isPending = cell.owner === 3; 
                
                const teamColor = cell.owner === 1 ? team1Color : cell.owner === 2 ? team2Color : '#ffffff'; 
                const teamImg = cell.owner === 1 ? team1Image : cell.owner === 2 ? team2Image : null;
                
                let fillColor = isDarkMode ? '#1e293b' : '#f8fafc'; 
                if (isClaimed) fillColor = teamColor; 
                else if (isPending) fillColor = isDarkMode ? '#475569' : '#94a3b8'; 
                
                const logoSize = R * 1.4; 
                const logoX = cx - logoSize / 2; 
                const logoY = cy - logoSize / 2;

                return (
                  <g key={cell.id} style={{ transformOrigin: `${cx}px ${cy}px`, transform: isClaimed || isPending ? 'scale(1.05)' : 'scale(1)' }} className="transition-all duration-500">
                    {/* الخلية الصلبة بحواف عريضة */}
                    <polygon points={getHexPoints(cx, cy)} fill={fillColor} stroke={isDarkMode ? '#000000' : '#0f172a'} strokeWidth="6" className="transition-colors duration-500" />
                    
                    {!isClaimed && (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" dy=".08em" fill={isPending ? "#ffffff" : (isDarkMode ? "#94a3b8" : "#475569")} fontSize="70" fontWeight="900" style={{ fontFamily: 'inherit' }} className="transition-colors duration-500">{cell.letter}</text>
                    )}
                    
                    {isClaimed && teamImg && (<image href={teamImg} x={logoX} y={logoY} width={logoSize} height={logoSize} preserveAspectRatio="xMidYMid meet" clipPath="url(#logo-clip)" />)}
                  </g>
                );
              })}
              <g>{renderGridLines(board, W, H, R, PADDING, gridWidth, isDarkMode)}</g>
            </svg>
          </div>

          {/* يسار الشاشة: الفريق الثاني */}
          <div className="flex flex-col items-center justify-center w-[25%] gap-6 z-20">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[3rem] border-8 border-slate-900 dark:border-black shadow-[12px_12px_0px_#0f172a] dark:shadow-[12px_12px_0px_#000] flex flex-col items-center w-full">
               {team2Image ? (
                 <img src={team2Image} className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[8px] object-contain p-2 bg-slate-100 dark:bg-slate-900 shadow-inner mb-6" style={{ borderColor: team2Color }} />
               ) : (
                 <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[8px] flex items-center justify-center text-7xl font-black text-slate-800 dark:text-white shadow-inner bg-slate-100 dark:bg-slate-900 mb-6" style={{ borderColor: team2Color }}>{team2Name.charAt(0)}</div>
               )}
               <span className="text-3xl lg:text-5xl font-black text-center leading-normal pb-2 break-words w-full dark:text-white drop-shadow-sm" style={{ color: isDarkMode ? '#fff' : team2Color }}>{team2Name}</span>
               <span className="mt-4 text-lg md:text-xl font-black uppercase tracking-widest px-8 py-3 rounded-2xl border-4" style={{ color: team2Color, borderColor: team2Color, backgroundColor: `${team2Color}15` }}>الفريق الثاني</span>
            </div>
          </div>

        </div>
      )}

      {/* ===================== شاشة النهاية والجولات بستايل الأركيد ===================== */}
      {(gameState === 'gameOver' || gameState === 'final') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-700">
          <div className="flex flex-col items-center bg-white dark:bg-slate-800 border-[8px] border-slate-900 dark:border-black px-16 py-16 md:px-24 md:py-20 rounded-[4rem] shadow-[20px_20px_0px_#000] animate-in zoom-in-95 duration-700" style={{ borderColor: winner === 1 ? team1Color : winner === 2 ? team2Color : '#facc15' }}>
            <div className="w-48 h-48 rounded-full border-8 border-slate-900 dark:border-black flex items-center justify-center bg-slate-100 dark:bg-slate-900 mb-8 shadow-inner animate-bounce">
               <Trophy size={100} className="drop-shadow-md" style={{ color: winner === 1 ? team1Color : winner === 2 ? team2Color : '#facc15' }} />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
              {gameState === 'final' ? 'بطل اللقاء!' : 'اكتمل الاتصال!'}
            </h2>
            <p className="text-2xl md:text-3xl font-bold mb-10 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-8 py-3 rounded-2xl border-4 border-slate-200 dark:border-slate-700">
              {gameState === 'final' ? 'المنتصر في التحدي هو:' : 'بطل الجولة هو:'}
            </p>
            <span className="font-black text-6xl md:text-8xl flex items-center justify-center gap-6 drop-shadow-[4px_4px_0px_#0f172a] dark:drop-shadow-[4px_4px_0px_#000] leading-normal pb-2" style={{ color: winner === 1 ? team1Color : winner === 2 ? team2Color : '#facc15' }}>
              {winner === 1 && team1Image && <img src={team1Image} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-slate-900 dark:border-black bg-white object-contain p-2 shadow-inner" />}
              {winner === 2 && team2Image && <img src={team2Image} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[6px] border-slate-900 dark:border-black bg-white object-contain p-2 shadow-inner" />}
              {winner === 1 ? team1Name : winner === 2 ? team2Name : 'تعادل!'}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}