"use client";

import React from "react";
import { ArrowRight, MonitorPlay } from "lucide-react";

interface TopBarProps {
  gameState: string;
  team1Name: string;
  team2Name: string;
  countriesLeft: number;
  team1Owned: number;
  team2Owned: number;
  roomCode: string | null;
  handleGoHome: () => void;
  handleGoBack: () => void;
  handleForceEndGame?: () => void;
  showAlert: (msg: string) => void;
  setShowAudienceModal: (val: boolean) => void;
}

export default function TopBar({
  gameState,
  team1Name,
  team2Name,
  countriesLeft,
  team1Owned,
  team2Owned,
  roomCode,
  handleGoHome,
  handleGoBack,
  handleForceEndGame,
  showAlert,
  setShowAudienceModal,
}: TopBarProps) {
  return (
    <div className="flex justify-between items-center mb-4 lg:mb-6 shrink-0 z-50">
      <div className="flex gap-2">
        <button
          onClick={handleGoHome}
          className="px-3 py-1.5 lg:px-4 lg:py-2 bg-rose-500 hover:bg-rose-400 text-white rounded-xl flex items-center gap-1.5 lg:gap-2 font-black text-[10px] lg:text-xs border-b-4 border-rose-700 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          الرئيسية
        </button>

        {gameState === "playing" && handleForceEndGame && (
          <button
            onClick={handleForceEndGame}
            className="px-3 py-1.5 lg:px-4 lg:py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center gap-1.5 lg:gap-2 font-black text-[10px] lg:text-xs border-b-4 border-purple-800 active:border-b-0 active:translate-y-[4px] transition-all ml-2"
          >
            إنهاء اللعبة
          </button>
        )}
      </div>

      {gameState === "playing" && (
        <div className="flex items-center gap-2 lg:gap-4 bg-white dark:bg-slate-900 px-3 py-1.5 lg:px-6 lg:py-2 rounded-xl lg:rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-center">
            <p className="text-[8px] lg:text-[10px] font-bold text-slate-500">
              حرة
            </p>
            <p className="font-black text-sm lg:text-base text-blue-600">
              {countriesLeft}
            </p>
          </div>
          <div className="w-px h-6 lg:h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 max-w-[50px] lg:max-w-none truncate">
              {team1Name}
            </p>
            <p className="font-black text-sm lg:text-base text-cyan-600">
              {team1Owned}
            </p>
          </div>
          <div className="w-px h-6 lg:h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <p className="text-[8px] lg:text-[10px] font-bold text-slate-500 max-w-[50px] lg:max-w-none truncate">
              {team2Name}
            </p>
            <p className="font-black text-sm lg:text-base text-rose-600">
              {team2Owned}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          if (!roomCode) showAlert("الرجاء بدء اللعبة أولاً لتوليد كود الغرفة!");
          else setShowAudienceModal(true);
        }}
        className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-1.5 lg:gap-2 font-black text-[10px] lg:text-xs border-b-4 border-blue-800 active:border-b-0 active:translate-y-[4px] transition-all"
      >
        <MonitorPlay size={14} className="lg:w-4 lg:h-4" />{" "}
        <span className="hidden sm:inline">شاشة الجمهور</span>
        <span className="sm:hidden">عرض</span>
      </button>
    </div>
  );
}