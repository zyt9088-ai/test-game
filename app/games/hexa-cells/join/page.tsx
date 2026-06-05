'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cairo } from "next/font/google";
import { LogIn, User, Hash, Users, AlertCircle, ChevronRight, Sun, Moon, Hexagon } from 'lucide-react';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700', '900'] });

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

    const generatedIcons = Array.from({ length: 10 }).map((_, i) => ({
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

export default function JoinGamePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<1 | 2 | null>(null);
  const [error, setError] = useState('');
  
  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');
  const [team1Color, setTeam1Color] = useState('#3b82f6');
  const [team2Color, setTeam2Color] = useState('#eab308');

  const [isDarkMode, setIsDarkMode] = useState(true);

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

    const t1Name = localStorage.getItem('hx_team1_name');
    const t2Name = localStorage.getItem('hx_team2_name');
    const t1Color = localStorage.getItem('hx_team1_color');
    const t2Color = localStorage.getItem('hx_team2_color');

    if (t1Name) setTeam1Name(t1Name);
    if (t2Name) setTeam2Name(t2Name);
    if (t1Color) setTeam1Color(t1Color);
    if (t2Color) setTeam2Color(t2Color);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      const teamParam = params.get('team');
      
      if (codeParam) setRoomCode(codeParam);
      if (teamParam === '1' || teamParam === '2') setSelectedTeam(Number(teamParam) as 1 | 2);
    }
  }, []);

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

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!roomCode || roomCode.length < 4) {
      setError('الرجاء إدخال كود الغرفة بشكل صحيح');
      return;
    }
    if (!playerName.trim()) {
      setError('الرجاء إدخال اسمك');
      return;
    }
    if (!selectedTeam) {
      setError('الرجاء اختيار فريقك');
      return;
    }

    const activeRoom = localStorage.getItem('hx_room_code');
    if (activeRoom && roomCode !== activeRoom) {
      setError('كود الغرفة غير صحيح أو اللعبة غير متاحة حالياً');
      return;
    }

    const playerId = Math.random().toString(36).substr(2, 9);
    const playerSession = { id: playerId, name: playerName.trim(), team: Number(selectedTeam), joinedAt: new Date().getTime() };
    
    sessionStorage.setItem('hx_player_session', JSON.stringify(playerSession));

    const existingPlayers = JSON.parse(localStorage.getItem('hx_active_players') || '[]');
    const isDuplicate = existingPlayers.some((p:any) => p.name === playerSession.name && Number(p.team) === playerSession.team);
    if (!isDuplicate) {
      const newPlayers = [...existingPlayers, playerSession];
      localStorage.setItem('hx_active_players', JSON.stringify(newPlayers));
      window.dispatchEvent(new Event('storage'));
    }

    router.push('/games/hexa-cells/buzzer');
  };

  return (
    <main className={`min-h-[100dvh] flex flex-col items-center justify-center p-4 ${cairo.className} bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300 relative`} dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
        .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
      `}} />

      <SolidGamingBackground />

      {/* زر التبديل (مستقل وعائم) */}
      <button 
        type="button"
        onClick={toggleTheme} 
        className="absolute top-6 left-6 z-[60] p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 active:translate-y-1 transition-all shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4"
        title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8 mt-2">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mx-auto mb-5 border-4 border-indigo-300 dark:border-indigo-700 shadow-inner">
            <LogIn className="w-10 h-10 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">الدخول للعبة</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">أدخل الكود واسمك للبدء</p>
        </div>

        {error && (
          <div className="bg-rose-100 dark:bg-rose-900/30 border-4 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-400 p-4 rounded-2xl flex items-center gap-3 mb-6 font-black text-sm animate-in shake shadow-sm">
            <AlertCircle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleJoin} className="flex flex-col gap-5">
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-black text-sm mb-2 ml-1">كود الغرفة</label>
            <div className="relative">
              <Hash className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                maxLength={5}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-2xl py-4 pr-12 pl-4 text-center tracking-[0.4em] text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:tracking-normal placeholder:text-base shadow-inner uppercase"
                placeholder="مثال: H7X9K"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-black text-sm mb-2 ml-1">اسم اللاعب</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-2xl py-4 pr-12 pl-4 font-black text-lg text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors shadow-inner"
                placeholder="اكتب اسمك الأول..."
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-black text-sm mb-3 ml-1 flex items-center gap-2"><Users size={18}/> اختر فريقك</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setSelectedTeam(1)}
                className={`py-4 px-2 rounded-2xl font-black text-base transition-all border-4 flex flex-col items-center gap-3 ${selectedTeam === 1 ? 'border-b-4 translate-y-1 shadow-inner' : 'border-b-8 active:border-b-4 active:translate-y-1 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] bg-white dark:bg-slate-800'}`}
                style={{ 
                  backgroundColor: selectedTeam === 1 ? `${team1Color}20` : undefined, 
                  borderColor: selectedTeam === 1 ? team1Color : 'var(--color-slate-900)', 
                  color: selectedTeam === 1 ? team1Color : 'inherit' 
                }}
              >
                <Hexagon size={28} fill={team1Color} stroke={selectedTeam === 1 ? team1Color : 'currentColor'} strokeWidth={2} />
                {team1Name}
              </button>
              
              <button 
                type="button"
                onClick={() => setSelectedTeam(2)}
                className={`py-4 px-2 rounded-2xl font-black text-base transition-all border-4 flex flex-col items-center gap-3 ${selectedTeam === 2 ? 'border-b-4 translate-y-1 shadow-inner' : 'border-b-8 active:border-b-4 active:translate-y-1 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] bg-white dark:bg-slate-800'}`}
                style={{ 
                  backgroundColor: selectedTeam === 2 ? `${team2Color}20` : undefined, 
                  borderColor: selectedTeam === 2 ? team2Color : 'var(--color-slate-900)', 
                  color: selectedTeam === 2 ? team2Color : 'inherit' 
                }}
              >
                <Hexagon size={28} fill={team2Color} stroke={selectedTeam === 2 ? team2Color : 'currentColor'} strokeWidth={2} />
                {team2Name}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-2xl font-black text-xl border-4 border-slate-900 dark:border-black border-b-8 active:border-b-4 active:translate-y-1 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] transition-all flex items-center justify-center gap-2">
            دخول للعبة <ChevronRight size={24} strokeWidth={3} />
          </button>
        </form>
      </div>
    </main>
  );
}