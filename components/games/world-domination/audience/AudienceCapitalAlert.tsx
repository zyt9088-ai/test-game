"use client";
import React from "react";
import { Star, Coins } from "lucide-react";

export default function AudienceCapitalAlert({ stolenCapitalAlert, team1Name, team2Name }: any) {
  if (!stolenCapitalAlert) return null;

  return (
    <div className="fixed inset-0 z-100 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 transition-colors duration-700">
      <div className="bg-white dark:bg-slate-900 border-4 border-amber-500 rounded-3xl lg:rounded-[3rem] p-6 lg:p-16 max-w-4xl w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.5)] lg:shadow-[0_0_100px_rgba(245,158,11,0.5)] animate-in zoom-in duration-700">
        <Star className="w-24 h-24 lg:w-48 lg:h-48 text-amber-500 mx-auto mb-4 lg:mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] lg:drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]" />
        <h2 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4 lg:mb-8 tracking-widest drop-shadow-lg">
          سقوط العاصمة! 🔥
        </h2>
        <p className="text-xl lg:text-4xl font-bold text-slate-600 dark:text-slate-300 mb-8 lg:mb-12 leading-relaxed">
          لقد سقطت عاصمة{" "}
          <span className="text-slate-900 dark:text-white font-black drop-shadow-md">
            {stolenCapitalAlert.loser === 1 ? team1Name : team2Name}
          </span>{" "}
          ({stolenCapitalAlert.countryName})
        </p>
        <div className="bg-amber-50 dark:bg-amber-500/10 border-4 border-amber-300 dark:border-amber-500/40 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer"></div>
          <p className="text-2xl lg:text-4xl font-black text-amber-600 dark:text-amber-400 mb-4 lg:mb-6 relative z-10">
            تم غنم ثلث الثروات:
          </p>
          <div className="text-5xl lg:text-9xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-3 lg:gap-6 drop-shadow-2xl relative z-10">
            {stolenCapitalAlert.points}{" "}
            <Coins className="text-yellow-500 dark:text-yellow-400 w-12 h-12 lg:w-24 lg:h-24 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] lg:drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
          </div>
          <p className="text-xl lg:text-3xl font-bold text-amber-700 dark:text-amber-300 mt-6 lg:mt-8 relative z-10">
            لصالح: {stolenCapitalAlert.winner === 1 ? team1Name : team2Name}
          </p>
        </div>
      </div>
    </div>
  );
}