"use client";

import React from "react";
import { Trophy } from "lucide-react";

interface GameOverScreenProps {
  startGame: () => void;
}

export default function GameOverScreen({ startGame }: GameOverScreenProps) {
  return (
    <div className="m-auto p-8 lg:p-12 bg-white dark:bg-slate-900 rounded-3xl lg:rounded-[3rem] text-center shadow-2xl border-2 w-full max-w-sm lg:max-w-3xl">
      <Trophy className="text-amber-500 w-16 h-16 lg:w-32 lg:h-32 mx-auto mb-4 lg:mb-8" />
      <h2 className="text-3xl lg:text-6xl font-black mb-6 lg:mb-12 dark:text-white">
        انتهت المعركة
      </h2>
      <button
        onClick={startGame}
        className="w-full lg:w-auto px-8 lg:px-16 py-3 lg:py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-xl lg:rounded-2xl text-lg lg:text-3xl transition-transform active:scale-95"
      >
        بدء حرب جديدة
      </button>
    </div>
  );
}