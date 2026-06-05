/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tajawal } from "next/font/google";
import { 
  Swords, Search, Play, Hexagon, ChevronDown, 
  Globe, Mail, Phone, MapPin, Send, MessageCircle, ExternalLink, X, Sun, Moon, Info, Gamepad2, Home, Zap, Target, Laptop, Package
} from "lucide-react";

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800', '900'] });

// ----------------------------------------------------
// محرك خلفية الألعاب (بألوان صلبة وأيقونات حيوية وملونة)
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

    const iconColors = ['text-emerald-500', 'text-rose-500', 'text-purple-500', 'text-amber-500', 'text-blue-500'];

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

// ----------------------------------------------------
// بطاقات الألعاب التفاعلية (مع ظلال وحواف ملونة حسب اللعبة)
// ----------------------------------------------------
const PlayfulGameCard = ({ game, index }: { game: any; index: number }) => {
  const getButtonColor = (id: string) => {
    if (id === 'castle-war') return 'bg-rose-500 border-rose-700 hover:bg-rose-400'; 
    if (id === 'world-domination') return 'bg-blue-500 border-blue-700 hover:bg-blue-400'; 
    if (id === 'word-mining') return 'bg-emerald-500 border-emerald-700 hover:bg-emerald-400';
    if (id === 'hangman') return 'bg-purple-500 border-purple-700 hover:bg-purple-400'; 
    if (id === 'hexa-cells') return 'bg-amber-500 border-amber-700 hover:bg-amber-400'; 
    return 'bg-blue-500 border-blue-700 hover:bg-blue-400';
  };

  const getCardStyles = (id: string) => {
    if (id === 'castle-war') return {
      card: 'border-rose-200 dark:border-rose-900/60 shadow-xl shadow-rose-100 dark:shadow-rose-900/20 hover:shadow-rose-200 dark:hover:shadow-rose-900/40',
      icon: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
    };
    if (id === 'world-domination') return {
      card: 'border-blue-200 dark:border-blue-900/60 shadow-xl shadow-blue-100 dark:shadow-blue-900/20 hover:shadow-blue-200 dark:hover:shadow-blue-900/40',
      icon: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
    };
    if (id === 'word-mining') return {
      card: 'border-emerald-200 dark:border-emerald-900/60 shadow-xl shadow-emerald-100 dark:shadow-emerald-900/20 hover:shadow-emerald-200 dark:hover:shadow-emerald-900/40',
      icon: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
    };
    if (id === 'hangman') return {
      card: 'border-purple-200 dark:border-purple-900/60 shadow-xl shadow-purple-100 dark:shadow-purple-900/20 hover:shadow-purple-200 dark:hover:shadow-purple-900/40',
      icon: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20'
    };
    if (id === 'hexa-cells') return {
      card: 'border-amber-200 dark:border-amber-900/60 shadow-xl shadow-amber-100 dark:shadow-amber-900/20 hover:shadow-amber-200 dark:hover:shadow-amber-900/40',
      icon: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
    };
    return { 
      card: 'border-slate-200 dark:border-slate-900/60 shadow-xl shadow-slate-100 dark:shadow-slate-900/20 hover:shadow-slate-200 dark:hover:shadow-slate-900/40', 
      icon: 'bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20' 
    };
  };

  const styles = getCardStyles(game.id);

  return (
    <Link href={game.path} className={`group relative flex flex-col h-full bg-white dark:bg-slate-800 rounded-3xl border-b-8 p-6 transition-all duration-300 hover:-translate-y-2 animate-in zoom-in-95 ${styles.card}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border-b-4 group-hover:scale-110 transition-transform duration-300 ${styles.icon}`}>
        {game.icon}
      </div>
      <h2 className="text-2xl font-black mb-3 text-slate-800 dark:text-white">{game.title}</h2>
      <p className="font-bold text-sm leading-relaxed mb-8 flex-1 text-slate-500 dark:text-slate-400">{game.description}</p>
      
      <div className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all text-white border-b-4 active:border-b-0 active:translate-y-1 ${getButtonColor(game.id)}`}>
        العرض الآن <Play size={18} className="fill-current" />
      </div>
    </Link>
  );
};

const AboutCard = ({ title, description, icon, colorClass }: { title: string, description: string, icon: React.ReactNode, colorClass: string }) => (
  <div className={`relative ${colorClass} rounded-2xl border-4 border-black dark:border-white p-6 shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.2)] animate-in zoom-in-95`}>
    <div className="flex justify-start items-center gap-3 mb-4">
      <div className="text-black dark:text-white shrink-0">{icon}</div>
      <h3 className="text-xl font-black text-black dark:text-white tracking-tight">{title}</h3>
    </div>
    <p className="font-bold text-xs md:text-sm leading-relaxed text-slate-800 dark:text-white tracking-tight">{description}</p>
  </div>
);

const GAMES = [
  { id: 'castle-war', title: 'حرب القلاع', description: 'لعبة استراتيجية تعتمد على الهجوم والدفاع، دمر قلاع خصمك لتنتصر.', icon: <Swords className="w-8 h-8 text-rose-500" />, path: '/games/castle-war', color: 'from-rose-500 to-red-600' },
  { id: 'world-domination', title: 'السيطرة على العالم', description: 'لعبة استراتيجية وتكتيكية لفرض نفوذك والسيطرة على القارات وتوسيع إمبراطوريتك.', icon: <Globe className="w-8 h-8 text-blue-500" />, path: '/games/world-domination', color: 'from-blue-500 to-indigo-600' },
  { id: 'word-mining', title: 'تنقيب الكلمات', description: 'تحدي الذكاء وسرعة البديهة، اكتشف كلمات خصمك قبل أن يكتشف كلماتك.', icon: <Search className="w-8 h-8 text-emerald-500" />, path: '/games/word-mining', color: 'from-emerald-500 to-teal-600' },
  { id: 'hangman', title: 'الرجل المشنوق', description: 'خمن الكلمة المخفية حرفاً بحرف قبل أن تكتمل المشنقة وتخسر التحدي.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-purple-500"><path d="M4 20h4" /><path d="M6 20V4h6v4" /><circle cx="12" cy="11" r="2" /><line x1="12" y1="13" x2="12" y2="17" /><line x1="10" y1="15" x2="14" y2="15" /><line x1="12" y1="17" x2="10" y2="20" /><line x1="12" y1="17" x2="14" y2="20" /></svg>, path: '/games/hangman', color: 'from-purple-500 to-indigo-600' },
  { id: 'hexa-cells', title: 'خلية الحروف', description: 'حرب الحروف والتوصيل.. سيطر على الخلايا لتصل إلى الطرف الآخر قبل خصمك.', icon: <div className="relative w-8 h-8 flex items-center justify-center text-amber-500"><Hexagon size={20} strokeWidth={2.5} className="absolute top-0" /><Hexagon size={20} strokeWidth={2.5} className="absolute bottom-0 -left-1.5" /><Hexagon size={20} strokeWidth={2.5} className="absolute bottom-0 -right-1.5" /></div>, path: '/games/hexa-cells', color: 'from-amber-500 to-orange-600' }
];

export default function HomePage() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const yOffset = -100; 
      const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    
    if (code.length === 5) {
      const prefix = code.charAt(0);
      if (prefix === 'W') window.location.href = `/games/word-mining/join?code=${code}`;
      else if (prefix === 'C') window.location.href = `/games/castle-war/join?code=${code}`;
      else if (prefix === 'H') window.location.href = `/games/hexa-cells/join?code=${code}`;
      else if (prefix === 'M') window.location.href = `/games/hangman?code=${code}`;
      else setJoinError('كود الغرفة غير صحيح. تأكد من إدخال الكود بدقة.');
    }
  };

  return (
    <main className={`min-h-screen relative flex flex-col items-center ${tajawal.className} overflow-x-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300`} dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: floatY 4s ease-in-out infinite; }
        @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
        .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
      `}} />

      <SolidGamingBackground />

      {/* الهيدر المثبت بعد التعديل لستايل Solid UI */}
      <div className="fixed top-4 left-0 right-0 z-[60] w-full max-w-7xl mx-auto px-4">
        <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl border-4 border-slate-900 dark:border-black p-2 md:p-3 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] flex justify-between items-center transition-colors duration-300">
          
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95 shrink-0 pl-2">
            <img src="https://ludn.sa/full_logo.svg?dpl=dpl_9jc3BNjB3uY2VzRn5kQd3MZSNLaW" alt="لدن التقنية" className="h-10 md:h-12 object-contain dark:brightness-0 dark:invert" />
          </Link>

          <nav className="flex items-center gap-1.5 md:gap-3">
            <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] md:text-sm text-slate-700 dark:text-slate-300 transition-all active:translate-y-0.5 active:border-b-0">
              <Home size={16} className="text-slate-500 dark:text-slate-400" /> <span className="hidden sm:inline">الرئيسية</span>
            </a>
            
            <a href="#about-section" onClick={(e) => scrollToSection(e, 'about-section')} className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] md:text-sm text-slate-700 dark:text-slate-300 transition-all active:translate-y-0.5 active:border-b-0">
              <Info size={16} className="text-purple-500" /> <span className="hidden sm:inline">عن المنصة</span>
            </a>

            <a href="#games-section" onClick={(e) => scrollToSection(e, 'games-section')} className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] md:text-sm text-slate-700 dark:text-slate-300 transition-all active:translate-y-0.5 active:border-b-0">
              <Gamepad2 size={16} className="text-emerald-500" /> <span className="hidden sm:inline">الألعاب والخدمات</span>
            </a>

            <a href="#contact-section" onClick={(e) => scrollToSection(e, 'contact-section')} className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-black text-[11px] md:text-sm text-slate-700 dark:text-slate-300 transition-all active:translate-y-0.5 active:border-b-0">
              <MessageCircle size={16} className="text-blue-500" /> <span className="hidden sm:inline">تواصل معنا</span>
            </a>
          </nav>

          <div className="flex gap-2 pr-2">
            <button onClick={toggleTheme} className="w-10 h-10 md:w-11 md:h-11 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-950 text-slate-600 dark:text-amber-400 rounded-xl flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:translate-y-0.5 active:border-b-0">
              {isDark ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} className="animate-wiggle" />}
            </button>
          </div>
        </div>
      </div>

      {/* نافذة الانضمام بالكود */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsJoinModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 border-4 border-emerald-500 rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-5 left-5 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"><X size={24}/></button>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-3xl mx-auto flex items-center justify-center mb-6 border-b-4 border-emerald-200 dark:border-emerald-800"><Search size={40} strokeWidth={2.5} /></div>
            <h3 className="text-3xl font-black text-center text-slate-900 dark:text-white mb-2">الانضمام لغرفة</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 font-bold mb-8">أدخل الكود المكون من 5 خانات</p>
            <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                maxLength={5}
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase());
                  setJoinError('');
                }}
                placeholder="مثال: M7X9K"
                className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-center text-3xl font-black tracking-[0.5em] uppercase outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors text-slate-800 dark:text-white placeholder:tracking-normal placeholder:text-lg"
                dir="ltr"
              />
              {joinError && <p className="text-rose-500 text-sm font-bold text-center animate-pulse">{joinError}</p>}
              
              <button
                type="submit"
                disabled={joinCode.trim().length !== 5}
                className="w-full mt-2 py-4 bg-emerald-500 border-b-4 border-emerald-700 hover:bg-emerald-400 text-white rounded-2xl font-black text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 active:border-b-0 active:translate-y-1"
              >
                دخول الغرفة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* زر الواتساب العائم */}
      <a href="https://wa.me/966543611229" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 border-b-4 border-green-700 hover:bg-green-400 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all animate-float active:translate-y-1 active:border-b-0"><MessageCircle size={32} /></a>

      <div className="relative z-10 w-full flex-1 flex flex-col pt-4">
        {/* ===================== Hero Section ===================== */}
        <section id="hero" className="flex flex-col items-center text-center min-h-[50vh] justify-center px-4 pt-32 pb-16 animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-3 pb-1">
            منصة ألعاب <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-blue-500 drop-shadow-sm">لدن</span>
          </h1>
          <p className="text-lg md:text-2xl font-bold max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400 mb-12">
            شريكك التقني لتطوير مواقع وتطبيقات حديثة تلبي طموحاتك وتعزز نجاحك في العالم الرقمي.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 z-20 w-full justify-center max-w-2xl px-4">
            <button onClick={() => setIsJoinModalOpen(true)} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 border-b-4 border-emerald-700 hover:bg-emerald-400 text-white rounded-2xl font-black text-xl md:text-2xl transition-all active:scale-95 active:border-b-0 active:translate-y-1">
              <Search className="w-8 h-8" strokeWidth={3} />
              <span>دخول الغرفة</span>
            </button>

            <a href="https://ludn.sa/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-500 text-white rounded-2xl font-black text-xl md:text-2xl transition-all active:scale-95 active:border-b-0 active:translate-y-1">
              <Globe className="w-8 h-8" strokeWidth={3} />
              <span>موقع لدن</span>
            </a>
          </div>

          <a href="#games-section" onClick={(e) => scrollToSection(e, 'games-section')} className="mt-16 animate-bounce cursor-pointer flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-950 rounded-full text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-all active:translate-y-1 active:border-b-0"><ChevronDown size={32} strokeWidth={3} /></a>
        </section>

        {/* ===================== قسم عن المنصة ===================== */}
        <section id="about-section" className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            
            <div className="lg:col-span-6 text-slate-900 dark:text-white space-y-6 animate-in slide-in-from-right-8 duration-700">
                <div className="relative inline-block mb-4">
                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 drop-shadow-sm pb-2">عن المنصة</h2>
                    <div className="absolute -bottom-1 right-0 left-0 h-2 bg-black dark:bg-emerald-500 rounded-full"></div>
                </div>

                <div className="space-y-5 text-xl md:text-2xl font-bold leading-relaxed max-w-2xl text-slate-700 dark:text-slate-300">
                    <p>
                        منصة ألعاب تفاعلية <span className="text-emerald-500 font-black">مجانية</span> تجمع العائلة والأصدقاء في لحظات مليئة بالحماس والضحك.
                    </p>
                    <p className="border-r-4 border-emerald-400 pr-5 py-2 text-lg md:text-xl text-slate-600 dark:text-slate-400">
                        تم تصميمها وتطويرها بكل فخر بواسطة <br/>
                        <span className="font-black text-blue-600 dark:text-blue-400">مؤسسة لدن التقنية لحلول الأعمال.</span>
                    </p>
                </div>
                
                <button onClick={() => setIsJoinModalOpen(true)} className="mt-8 flex items-center justify-center gap-3 px-8 py-5 bg-emerald-500 border-b-4 border-emerald-700 hover:bg-emerald-400 text-white rounded-2xl font-black text-xl md:text-2xl transition-all active:scale-95 active:border-b-0 active:translate-y-1 w-full md:w-auto">
                    ابدأ اللعب 🎮
                </button>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6" dir="ltr">
                <AboutCard title="تفاعل مباشر" description="تحديات وتفاعل لحظي بين اللاعبين في كل جولة" icon={<Zap size={36} />} colorClass="bg-[#2dd4bf] dark:bg-[#115e59]" />
                <AboutCard title="لعب جماعي" description="العب مع اخوياك وأهلك بنفس الوقت ومن مكانكم" icon={<Target size={36} />} colorClass="bg-[#818cf8] dark:bg-[#3730a3]" />
                <AboutCard title="من أي جهاز" description="العب من جوالك، تابلت، أو الكمبيوتر بدون تحميل" icon={<Laptop size={36} />} colorClass="bg-[#a7f3d0] dark:bg-[#065f46]" />
                <AboutCard title="خدمات متنوعة" description="كمية ألعاب وخدمات تجنن ومفيدة لتجمعاتكم" icon={<Package size={36} />} colorClass="bg-[#a78bfa] dark:bg-[#5b21b6]" />
            </div>

        </section>

        {/* ===================== قسم ألعابنا والخدمات ===================== */}
        <section id="games-section" className="max-w-7xl mx-auto w-full px-4 py-16 relative z-10 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">منصة الألعاب والخدمات</h2>
            <p className="text-xl font-bold text-slate-500 dark:text-slate-400">جرب أنظمتنا الترفيهية والتفاعلية المبنية بأحدث التقنيات</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {GAMES.map((game, index) => (<PlayfulGameCard key={game.id} game={game} index={index} />))}
          </div>
        </section>

        {/* ===================== قسم تواصل معنا ===================== */}
        <section id="contact-section" className="max-w-7xl mx-auto w-full px-4 py-16 relative z-10 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">عندك فكرة ألعاب ؟</h2>
            <p className="text-xl font-bold text-slate-500 dark:text-slate-400">شاركنا فكرة اللعبة ونصممها لك</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-900 p-6 flex items-center gap-5 relative group overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 group-hover:scale-110 transition-transform duration-500 z-0"></div>
                <div className="w-16 h-16 bg-blue-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 relative z-10 border-b-4 border-blue-200 dark:border-slate-900"><Mail size={28} /></div>
                <div className="relative z-10"><p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-1">البريد الإلكتروني</p><p className="text-slate-900 dark:text-white font-black text-xl" dir="ltr">info@ludn.sa</p></div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-900 p-6 flex items-center gap-5 relative group overflow-hidden">
                <div className="absolute inset-0 bg-emerald-600/5 group-hover:scale-110 transition-transform duration-500 z-0"></div>
                <div className="w-16 h-16 bg-emerald-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 relative z-10 border-b-4 border-emerald-200 dark:border-slate-900"><Phone size={28} /></div>
                <div className="relative z-10"><p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-1">رقم الجوال</p><p className="text-slate-900 dark:text-white font-black text-xl" dir="ltr">054 361 1229</p></div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-900 p-6 flex items-center gap-5 relative group overflow-hidden">
                <div className="absolute inset-0 bg-purple-600/5 group-hover:scale-110 transition-transform duration-500 z-0"></div>
                <div className="w-16 h-16 bg-purple-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 relative z-10 border-b-4 border-purple-200 dark:border-slate-900"><MapPin size={28} /></div>
                <div className="relative z-10"><p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-1">الموقع</p><p className="text-slate-900 dark:text-white font-black text-xl">المملكة العربية السعودية</p></div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-[2rem] border-b-8 border-slate-200 dark:border-slate-900 p-8 md:p-10">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3"><Send size={32} className="text-blue-500" /> أرسل رسالة</h3>
              <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">الاسم الكامل</label><input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors" placeholder="اسمك..." /></div>
                  <div><label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">رقم الجوال</label><input type="tel" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors" placeholder="05x xxx xxxx" /></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">البريد الإلكتروني</label><input type="email" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors" placeholder="example@email.com" /></div>
                <div><label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">الرسالة</label><textarea rows={4} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors resize-none" placeholder="كيف نخدمك؟"></textarea></div>
                <button type="submit" className="w-full mt-4 py-5 bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-500 text-white font-black text-2xl rounded-2xl transition-all active:translate-y-1 active:border-b-0">إرسال الرسالة</button>
              </form>
            </div>

          </div>
        </section>

        {/* ===================== الفوتر الشامل المدمج ===================== */}
        <footer className="w-full bg-white dark:bg-slate-800 border-t-8 border-slate-200 dark:border-slate-950 pt-16 pb-8 relative z-10 transition-colors duration-300 mt-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
            
            <div className="flex flex-col items-center md:items-start gap-4">
              <img src="https://ludn.sa/full_logo.svg?dpl=dpl_9jc3BNjB3uY2VzRn5kQd3MZSNLaW" alt="لدن التقنية" className="h-14 object-contain dark:brightness-0 dark:invert" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm text-center md:text-right mt-2 leading-relaxed max-w-xs">
                منصة ألعاب تفاعلية تجمع العائلة والأصدقاء في لحظات مليئة بالحماس والضحك.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">روابط سريعة</h3>
              <ul className="flex flex-col gap-3 font-bold text-slate-600 dark:text-slate-300">
                <li><a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronDown size={16} className="-rotate-90 text-blue-500"/> الرئيسية</a></li>
                <li><a href="#about-section" onClick={(e) => scrollToSection(e, 'about-section')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2"><ChevronDown size={16} className="-rotate-90 text-purple-500"/> عن المنصة</a></li>
                <li><a href="#games-section" onClick={(e) => scrollToSection(e, 'games-section')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronDown size={16} className="-rotate-90 text-emerald-500"/> الألعاب والخدمات</a></li>
                <li><a href="#contact-section" onClick={(e) => scrollToSection(e, 'contact-section')} className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2"><ChevronDown size={16} className="-rotate-90 text-amber-500"/> تواصل معنا</a></li>
              </ul>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">الألعاب والخدمات</h3>
              <ul className="flex flex-col gap-3 font-bold text-slate-600 dark:text-slate-300">
                <li><Link href="/games/castle-war" className="hover:text-rose-500 transition-colors flex items-center gap-2"><Swords size={18} className="text-rose-500" /> حرب القلاع</Link></li>
                <li><Link href="/games/world-domination" className="hover:text-blue-500 transition-colors flex items-center gap-2"><Globe size={18} className="text-blue-500" /> السيطرة على العالم</Link></li>
                <li><Link href="/games/word-mining" className="hover:text-emerald-500 transition-colors flex items-center gap-2"><Search size={18} className="text-emerald-500" /> تنقيب الكلمات</Link></li>
                <li><Link href="/games/hangman" className="hover:text-purple-500 transition-colors flex items-center gap-2"><Gamepad2 size={18} className="text-purple-500" /> الرجل المشنوق</Link></li>
                <li><Link href="/games/hexa-cells" className="hover:text-amber-500 transition-colors flex items-center gap-2"><Hexagon size={18} className="text-amber-500" /> خلية الحروف</Link></li>
              </ul>
            </div>
            
          </div>

          <div className="w-full pt-8 border-t-4 border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">2026 لدن التقنية - جميع الحقوق محفوظة ©</p>
          </div>
        </footer>

      </div>
    </main>
  );
}