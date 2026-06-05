/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { Tajawal } from "next/font/google";
import { 
  ShieldQuestion, Search, Type, CheckCircle2, 
  Send, Database, Edit3, ChevronDown, Shuffle, Lock, User
} from "lucide-react";

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800', '900'] });

const DEFAULT_DB = [
  { category: 'أجزاء السيارة', words: ['محرك', 'مقود', 'عجلات', 'مكابح', 'زجاج', 'مقعد', 'مرايا', 'بطارية', 'مصباح', 'عادم'] },
  { category: 'دول أوربية', words: ['فرنسا', 'المانيا', 'ايطاليا', 'اسبانيا', 'السويد', 'النرويج', 'سويسرا', 'اليونان', 'بلجيكا', 'هولندا'] },
  { category: 'أدوات مطبخ', words: ['سكين', 'ملعقة', 'شوكة', 'قدر', 'مقلاة', 'صحن', 'كوب', 'خلاط', 'فرن', 'ثلاجة'] },
  { category: 'فواكه', words: ['تفاح', 'برتقال', 'موز', 'عنب', 'فراولة', 'مانجو', 'بطيخ', 'كيوي', 'خوخ', 'رمان'] },
];

export default function WordMiningJoinPage() {
  const [step, setStep] = useState<'selectTeam' | 'setup' | 'done'>('selectTeam');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  
  // بيانات من شاشة الحكم
  const [targetWordsCount, setTargetWordsCount] = useState(5);
  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');
  
  // بيانات الفريق الحالي
  const [selectedTeam, setSelectedTeam] = useState<1 | 2 | null>(null);
  const [category, setCategory] = useState('');
  const [wordsInput, setWordsInput] = useState<string[]>([]);
  const [setupMode, setSetupMode] = useState<'db' | 'manual'>('manual');
  
  const [customDB, setCustomDB] = useState<{category: string, words: string[]}[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // جلب الإعدادات من شاشة الحكم (اللوكال ستورج)
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl) setRoomCodeInput(codeFromUrl);

    const savedWordsCount = localStorage.getItem('wm_words_count');
    if (savedWordsCount) {
      const count = parseInt(savedWordsCount);
      setTargetWordsCount(count);
      setWordsInput(Array(count).fill(''));
    } else {
      setWordsInput(Array(5).fill(''));
    }

    const t1Name = localStorage.getItem('wm_team1_name');
    const t2Name = localStorage.getItem('wm_team2_name');
    if (t1Name) setTeam1Name(t1Name);
    if (t2Name) setTeam2Name(t2Name);

    const savedDB = localStorage.getItem('admin_word_mining_db');
    if (savedDB) {
      try {
        const parsed = JSON.parse(savedDB);
        if (parsed && parsed.length > 0) setCustomDB(parsed);
      } catch(e) {}
    }
  }, []);

  const handleTeamSelection = (team: 1 | 2) => {
    setSelectedTeam(team);
    setStep('setup');
  };

  const handleWordInput = (index: number, value: string) => {
    const newWords = [...wordsInput];
    newWords[index] = value;
    setWordsInput(newWords);
  };

  const fillFromCategory = (categoryName: string) => {
    const dbToUse = customDB.length > 0 ? customDB : DEFAULT_DB;
    const selectedCat = dbToUse.find(c => c.category === categoryName);
    if (!selectedCat) return;
    
    const shuffledWords = [...selectedCat.words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, targetWordsCount);
    while (selectedWords.length < targetWordsCount) selectedWords.push('');
    
    setCategory(selectedCat.category);
    setWordsInput(selectedWords);
  };

  const handleRandomCategoryFill = () => {
    const dbToUse = customDB.length > 0 ? customDB : DEFAULT_DB;
    const randomCat = dbToUse[Math.floor(Math.random() * dbToUse.length)];
    fillFromCategory(randomCat.category);
  };

  const isSetupValid = category.trim() !== '' && wordsInput.every(w => w.trim() !== '');

  const submitData = () => {
    if (!isSetupValid || !selectedTeam) return;

    const teamData = {
      name: selectedTeam === 1 ? team1Name : team2Name,
      category: category,
      score: 0,
      words: wordsInput.map(w => ({ 
        text: w.trim(), 
        revealed: 1, 
        guessed: false, 
        pointsEarned: 0, 
        attempts: 1 
      }))
    };

    // إرسال البيانات لشاشة الحكم عبر اللوكال ستورج
    localStorage.setItem(`wm_team${selectedTeam}_data`, JSON.stringify(teamData));
    setStep('done');
  };

  const themeBg = selectedTeam === 1 ? 'bg-cyan-100 dark:bg-cyan-900/80' : 'bg-rose-100 dark:bg-rose-900/80';
  const themeText = selectedTeam === 1 ? 'text-cyan-800 dark:text-cyan-300' : 'text-rose-800 dark:text-rose-300';
  const themeColorClass = selectedTeam === 1 ? 'bg-cyan-400 dark:bg-cyan-500' : 'bg-rose-400 dark:bg-rose-500';
  const dbOptions = customDB.length > 0 ? customDB : DEFAULT_DB;

  return (
    <main className={`min-h-[100dvh] relative flex flex-col items-center justify-center py-10 px-4 ${tajawal.className} bg-slate-50 dark:bg-slate-950 transition-colors duration-500`} dir="rtl">
      
      {/* خلفية بسيطة للجوال */}
      <div className="fixed inset-0 z-0 bg-linear-to-br from-emerald-100/40 via-slate-50 to-teal-100/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/30"></div>

      <div className="relative z-10 w-full flex justify-center items-center">
        
        {/* --- الشاشة الأولى: اختيار الفريق --- */}
        {step === 'selectTeam' && (
          <div className="w-full max-w-md bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in zoom-in-95">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-400 text-slate-900 border-4 border-slate-900 dark:border-black shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Lock size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">غرفة التجهيز السرية</h1>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">اختر فريقك للبدء بإدخال كلماتك بعيداً عن أعين الخصم</p>
            </div>

            <div className="flex flex-col gap-4">
              <button onClick={() => handleTeamSelection(1)} className="w-full bg-cyan-400 hover:bg-cyan-300 border-4 border-slate-900 dark:border-black text-slate-900 rounded-2xl p-5 font-black text-xl flex items-center justify-between transition-all border-b-[8px] active:border-b-[4px] active:translate-y-1 shadow-none">
                <span className="flex items-center gap-3"><User size={24} strokeWidth={2.5} /> {team1Name}</span>
              </button>
              
              <button onClick={() => handleTeamSelection(2)} className="w-full bg-rose-400 hover:bg-rose-300 border-4 border-slate-900 dark:border-black text-slate-900 rounded-2xl p-5 font-black text-xl flex items-center justify-between transition-all border-b-[8px] active:border-b-[4px] active:translate-y-1 shadow-none">
                <span className="flex items-center gap-3"><User size={24} strokeWidth={2.5} /> {team2Name}</span>
              </button>
            </div>
          </div>
        )}

        {/* --- الشاشة الثانية: إدخال الكلمات (مقسمة ومدمجة) --- */}
        {step === 'setup' && selectedTeam && (
          <div className={`w-full max-w-3xl ${themeBg} border-4 border-slate-900 dark:border-black rounded-[2rem] p-5 md:p-6 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in slide-in-from-bottom-8`}>
            
            <div className="text-center mb-5">
              <h2 className={`text-2xl md:text-3xl font-black mb-1 ${themeText}`}>تجهيز {selectedTeam === 1 ? team1Name : team2Name}</h2>
              <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">أدخل الكلمات التي سيخمنها الخصم</p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 mb-6">
              
              {/* القسم الأيمن: إعدادات التصنيف */}
              <div className="w-full md:w-5/12 bg-white/90 dark:bg-slate-800 p-4 rounded-2xl border-4 border-slate-900 dark:border-black shadow-inner flex flex-col">
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border-4 border-slate-900 dark:border-black mb-5 w-full shadow-inner gap-1.5">
                  <button onClick={() => setSetupMode('db')} className={`flex-1 py-1.5 font-black rounded-lg flex items-center justify-center gap-1.5 text-xs md:text-sm border-2 border-transparent transition-all ${setupMode === 'db' ? `${themeColorClass} border-slate-900 text-slate-900 border-b-[4px]` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <Database size={16} strokeWidth={2.5} /> سحب عشوائي
                  </button>
                  <button onClick={() => setSetupMode('manual')} className={`flex-1 py-1.5 font-black rounded-lg flex items-center justify-center gap-1.5 text-xs md:text-sm border-2 border-transparent transition-all ${setupMode === 'manual' ? `${themeColorClass} border-slate-900 text-slate-900 border-b-[4px]` : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <Edit3 size={16} strokeWidth={2.5} /> إدخال يدوي
                  </button>
                </div>

                <label className="text-slate-900 dark:text-white font-black text-sm flex items-center gap-2 mb-3 mt-auto">
                  <ShieldQuestion size={18} className={themeText} strokeWidth={2.5} /> 
                  {setupMode === 'db' ? 'اختر التصنيف' : 'اسم التصنيف'}
                </label>
                
                {setupMode === 'db' ? (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="relative w-full">
                      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white dark:bg-slate-700 border-4 border-slate-900 dark:border-black rounded-xl p-2.5 text-slate-900 dark:text-white font-black text-sm flex items-center justify-between outline-none shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000]">
                        <span className="truncate">{category ? category : 'اختر تصنيفاً...'}</span>
                        <ChevronDown className={`text-slate-900 dark:text-white transition-transform shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} strokeWidth={2.5} />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] w-full bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-xl z-50 shadow-[6px_6px_0px_#0f172a] dark:shadow-[6px_6px_0px_#000] overflow-hidden max-h-40 overflow-y-auto custom-scroll">
                          {dbOptions.map((cat, idx) => (
                            <button key={idx} onClick={() => { fillFromCategory(cat.category); setIsDropdownOpen(false); }} className="w-full text-right px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black border-b-2 border-slate-200 dark:border-slate-700 text-sm transition-colors">
                              {cat.category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={handleRandomCategoryFill} className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 p-2.5 rounded-xl font-black text-sm border-4 border-slate-900 dark:border-black border-b-[6px] active:border-b-[4px] active:translate-y-1 transition-all shadow-none">
                      <Shuffle size={18} strokeWidth={2.5} /> تصنيف عشوائي
                    </button>
                  </div>
                ) : (
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="مثال: أشياء في المطبخ..." className="w-full bg-white dark:bg-slate-700 border-4 border-slate-900 dark:border-black rounded-xl p-2.5 text-sm text-slate-900 dark:text-white font-black outline-none focus:border-amber-400 shadow-inner" />
                )}
              </div>

              {/* القسم الأيسر: إدخال الكلمات (شبكة عمودين) */}
              <div className="w-full md:w-7/12 flex flex-col">
                <label className="text-slate-900 dark:text-white font-black mb-3 text-sm flex items-center gap-2">
                  <Type size={18} className={themeText} strokeWidth={2.5} /> الكلمات ({targetWordsCount})
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {wordsInput.map((word, index) => (
                    <div key={index} className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black text-xs">{index + 1}</span>
                      <input type="text" value={word} onChange={(e) => handleWordInput(index, e.target.value)} placeholder={`الكلمة ${index + 1}`} className="w-full bg-white dark:bg-slate-800 border-4 border-slate-900 dark:border-black rounded-xl p-2.5 pr-8 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-amber-400 transition-colors shadow-inner placeholder:font-bold" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <button onClick={submitData} disabled={!isSetupValid} className={`w-full py-4 rounded-xl text-lg font-black flex items-center justify-center gap-2 transition-all border-4 border-slate-900 dark:border-black ${isSetupValid ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-900 border-b-[8px] active:border-b-[4px] active:translate-y-1' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed border-b-[4px] translate-y-1'}`}>
              {isSetupValid ? <>اعتماد الكلمات <CheckCircle2 size={24} strokeWidth={2.5} /></> : 'أكمل البيانات لاعتماد الكلمات'}
            </button>
          </div>
        )}

        {/* --- الشاشة الثالثة: تم الإرسال --- */}
        {step === 'done' && (
          <div className="w-full max-w-md bg-emerald-400 border-4 border-slate-900 dark:border-black rounded-[2rem] p-8 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000] animate-in zoom-in text-center">
            <div className="w-20 h-20 bg-white text-emerald-500 border-4 border-slate-900 dark:border-black rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000]">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">تم التجهيز بنجاح!</h2>
            <p className="text-slate-800 font-bold mb-6 text-lg leading-relaxed">تم إرسال كلماتك لشاشة الحكم، بانتظار تجهيز الفريق الآخر لبدء المعركة.</p>
            <div className="animate-pulse flex items-center justify-center gap-2 text-slate-900 font-black bg-white/50 py-2 px-4 rounded-xl border-2 border-slate-900">
              <Search size={20} strokeWidth={2.5} /> انظر للشاشة الرئيسية
            </div>
          </div>
        )}

      </div>
    </main>
  );
}