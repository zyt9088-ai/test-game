"use client";

import React from "react";
import { Trophy } from "lucide-react";

interface GameOverScreenProps {
  startGame: () => void;
  team1Name: string;
  team2Name: string;
  score1: number;
  score2: number;
}

export default function GameOverScreen({
  startGame,
  team1Name,
  team2Name,
  score1,
  score2,
}: GameOverScreenProps) {
  const isTie = score1 === score2;
  const winnerName = score1 > score2 ? team1Name : team2Name;
  const highestScore = Math.max(score1, score2);

  return (
    <div className="m-auto p-8 lg:p-12 bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[3rem] text-center shadow-2xl border-2 w-full max-w-sm lg:max-w-3xl">
      <Trophy className="text-amber-500 w-16 h-16 lg:w-32 lg:h-32 mx-auto mb-4 lg:mb-8" />
      <h2 className="text-3xl lg:text-6xl font-black mb-6 lg:mb-8 dark:text-white">
        انتهت اللعبة!
      </h2>
      
      {isTie ? (
        <div className="mb-8 lg:mb-12">
          <p className="text-2xl lg:text-4xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            النتيجة تعادل!
          </p>
          <p className="text-xl lg:text-2xl font-black text-amber-600 dark:text-amber-400">
            كلا الفريقين حصلا على {score1} نقطة
          </p>
        </div>
      ) : (
        <div className="mb-8 lg:mb-12">
          <p className="text-2xl lg:text-4xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            الفريق الفائز هو
          </p>
          <p className="text-4xl lg:text-6xl font-black text-emerald-500 dark:text-emerald-400 drop-shadow-md mb-2">
            {winnerName}
          </p>
          <p className="text-xl lg:text-2xl font-bold text-slate-500 dark:text-slate-400">
            بأعلى رصيد من النقاط ({highestScore} نقطة)
          </p>
        </div>
      )}

      <button
        onClick={startGame}
        className="w-full lg:w-auto px-8 lg:px-16 py-3 lg:py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-xl lg:rounded-2xl text-lg lg:text-3xl transition-transform active:scale-95"
      >
        بدء لعبة جديدة
      </button>
    </div>
  );
}