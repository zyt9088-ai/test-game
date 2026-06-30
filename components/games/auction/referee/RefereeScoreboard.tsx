"use client";
import React from "react";
import { ShieldAlert } from "lucide-react";

export default function RefereeScoreboard({
  gameState, currentIndex, questions, t1Name, t2Name,
  t1Balance, t2Balance, t1Points, t2Points, t1Ambush, t2Ambush
}: any) {
  if (gameState === "setup") return null;
  return (
      <div className="flex flex-col gap-3 mt-3">
         <div className="flex justify-between items-center px-1">
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-black border border-yellow-200 dark:border-yellow-800 shadow-sm">
              الجولة {currentIndex + 1} من {questions.length}
            </span>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
              المتبقي: {questions.length - currentIndex} أسئلة
            </span>
         </div>
         <div className="grid grid-cols-2 gap-3 md:gap-4 bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="text-center p-2 md:p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800/50 shadow-inner flex flex-col justify-center">
              <p className="text-[10px] md:text-xs font-black text-cyan-600 dark:text-cyan-400 mb-1 truncate">{t1Name}</p>
              <p className="font-black text-base md:text-xl text-slate-800 dark:text-white">
                {t1Balance <= 0 ? <span className="text-rose-500">إفلاس 0 💰</span> : `${t1Balance.toLocaleString()} 💰`} 
                <span className="text-slate-300 dark:text-slate-700 mx-1 md:mx-2">|</span> 
                <span className="text-cyan-600 dark:text-cyan-400">{t1Points}</span> 🏆
              </p>
              <div className="flex justify-center gap-1 mt-1.5">
                {Array.from({ length: 3 }).map((_, i) => (<ShieldAlert key={i} size={12} className={i < t1Ambush ? "text-amber-500" : "text-slate-300 dark:text-slate-700 opacity-30"} />))}
              </div>
           </div>
           <div className="text-center p-2 md:p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800/50 shadow-inner flex flex-col justify-center">
              <p className="text-[10px] md:text-xs font-black text-rose-600 dark:text-rose-400 mb-1 truncate">{t2Name}</p>
              <p className="font-black text-base md:text-xl text-slate-800 dark:text-white">
                {t2Balance <= 0 ? <span className="text-rose-500">إفلاس 0 💰</span> : `${t2Balance.toLocaleString()} 💰`} 
                <span className="text-slate-300 dark:text-slate-700 mx-1 md:mx-2">|</span> 
                <span className="text-rose-600 dark:text-rose-400">{t2Points}</span> 🏆
              </p>
              <div className="flex justify-center gap-1 mt-1.5">
                {Array.from({ length: 3 }).map((_, i) => (<ShieldAlert key={i} size={12} className={i < t2Ambush ? "text-amber-500" : "text-slate-300 dark:text-slate-700 opacity-30"} />))}
              </div>
           </div>
         </div>
      </div>
  );
}