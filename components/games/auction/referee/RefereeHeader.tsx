"use client";
import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, QrCode, Copy, Gavel, PowerOff } from "lucide-react";

export default function RefereeHeader({ roomCode, setShowQRModal, copyLink, resetGame, triggerConfirm }: any) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm gap-4 sm:gap-0">
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
        <Link href="/" className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl flex items-center justify-center gap-2 font-black text-xs border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all flex-1 sm:flex-none">
          <Home size={16} /> الرئيسية
        </Link>
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl flex items-center justify-center gap-2 font-black text-xs border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all flex-1 sm:flex-none">
          <ArrowLeft size={16} /> رجوع
        </button>
        {roomCode && resetGame && triggerConfirm && (
          <button 
            onClick={() => triggerConfirm("هل أنت متأكد من رغبتك في إنهاء اللعبة وتصفيرها بالكامل؟ سيتم طرد الفرق للبداية.", resetGame)} 
            className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-400 rounded-xl flex items-center justify-center gap-2 font-black text-xs border-b-4 border-rose-200 dark:border-rose-900 active:border-b-0 active:translate-y-[4px] transition-all flex-1 sm:flex-none"
          >
            <PowerOff size={16} /> إنهاء وتصفير
          </button>
        )}
      </div>
      
      {roomCode && (
        <div className="flex gap-2 items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
           <span className="font-black tracking-widest text-slate-700 dark:text-slate-300 uppercase text-sm">{roomCode}</span>
           <button onClick={() => setShowQRModal(true)} className="text-yellow-500 hover:text-yellow-400 transition-colors"><QrCode size={18} /></button>
           <button onClick={copyLink} className="text-yellow-500 hover:text-yellow-400 transition-colors"><Copy size={18} /></button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Gavel className="text-yellow-500 w-6 h-6 md:w-8 md:h-8" />
        <div className="text-right sm:text-left">
          <h1 className="text-base md:text-lg font-black tracking-wide text-slate-900 dark:text-white">حرب المزايدات</h1>
          <p className="text-[10px] md:text-xs font-bold text-yellow-600 dark:text-yellow-500">الكنترول المركزي</p>
        </div>
      </div>
    </div>
  );
}