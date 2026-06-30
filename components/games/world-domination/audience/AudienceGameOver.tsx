"use client";
import React from "react";
import { Trophy, Crown, Coins } from "lucide-react";

export default function AudienceGameOver({ gameState, isDraw, score1, score2, team1Name, team2Name, winnerName, winnerScore, winnerColor }: any) {
  if (gameState !== "gameOver") return null;

  return (
    <div className="fixed inset-0 z-90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8 transition-colors duration-700">
      <div className="w-full max-w-4xl bg-slate-50 dark:bg-slate-900/80 rounded-[3rem] lg:rounded-[4rem] border-4 border-amber-500 p-8 lg:p-16 text-center shadow-[0_0_40px_rgba(245,158,11,0.3)] lg:shadow-[0_0_80px_rgba(245,158,11,0.3)] animate-in zoom-in-95 duration-700">
        <div className="relative inline-block mb-6 lg:mb-10">
          <Trophy className="w-24 h-24 lg:w-48 lg:h-48 text-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] lg:drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
          <Crown className="w-10 h-10 lg:w-16 lg:h-16 text-yellow-500 dark:text-yellow-300 absolute -top-4 -right-4 lg:-top-6 lg:-right-6 rotate-12 animate-bounce drop-shadow-md" />
        </div>
        <h2 className="text-xl lg:text-3xl font-black text-slate-500 dark:text-slate-400 mb-2 lg:mb-4 tracking-[0.2em] lg:tracking-[0.3em] uppercase">
          انتهت السيطرة
        </h2>
        {isDraw ? (
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white drop-shadow-xl">
              تعادل الأبطال!
            </h1>
            <p className="text-xl lg:text-3xl text-slate-600 dark:text-slate-300 font-bold">
              كلا الفريقين أثبتا قوتهما بـ {score1} نقطة
            </p>
          </div>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-2">
              <p className="text-lg lg:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-widest">
                سيد العالم الجديد هو:
              </p>
              <h1
                className={`text-5xl lg:text-8xl font-black ${winnerColor} drop-shadow-[0_0_15px_currentColor] lg:drop-shadow-[0_0_30px_currentColor] lg:scale-110`}
              >
                {winnerName}
              </h1>
            </div>
            <div className="bg-white dark:bg-slate-950/50 inline-flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-6 px-8 py-4 lg:px-12 lg:py-6 rounded-3xl lg:rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="flex items-center gap-3 lg:gap-6">
                <Coins className="text-yellow-500 dark:text-yellow-400 w-8 h-8 lg:w-14 lg:h-14" />
                <span className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white drop-shadow-lg">
                  {winnerScore}
                </span>
              </div>
              <span className="text-sm lg:text-2xl font-bold text-slate-500 lg:text-slate-50 lg:mr-2">
                نقطة سيطرة
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}