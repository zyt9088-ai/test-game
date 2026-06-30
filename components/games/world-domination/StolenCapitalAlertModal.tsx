"use client";

import React from "react";
import { Star, Coins } from "lucide-react";

interface StolenCapitalAlertModalProps {
  stolenCapitalAlert: {
    winner: 1 | 2;
    loser: 1 | 2;
    points: number;
    countryName: string;
  } | null;
  setStolenCapitalAlert: (val: any) => void;
  team1Name: string;
  team2Name: string;
}

export default function StolenCapitalAlertModal({
  stolenCapitalAlert,
  setStolenCapitalAlert,
  team1Name,
  team2Name,
}: StolenCapitalAlertModalProps) {
  if (!stolenCapitalAlert) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-800 border-4 border-amber-500 rounded-3xl p-6 lg:p-10 max-w-md lg:max-w-2xl w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-in zoom-in-95">
        <Star className="w-20 h-20 lg:w-32 lg:h-32 text-amber-500 mx-auto mb-4 lg:mb-6 animate-pulse" />
        <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 lg:mb-6 tracking-wide drop-shadow-md">
          سقوط العاصمة! 🔥
        </h2>
        <p className="text-lg lg:text-2xl font-bold text-slate-300 mb-6 lg:mb-8 leading-relaxed">
          لقد سقطت عاصمة{" "}
          <span className="text-white font-black">
            {stolenCapitalAlert.loser === 1 ? team1Name : team2Name}
          </span>{" "}
          ({stolenCapitalAlert.countryName})
        </p>
        <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-6 lg:p-8 mb-6 lg:mb-10 shadow-inner">
          <p className="text-xl lg:text-3xl font-black text-amber-400 mb-2">
            تم غنم ثلث الثروات:
          </p>
          <div className="text-4xl lg:text-6xl font-black text-white flex items-center justify-center gap-3">
            {stolenCapitalAlert.points}{" "}
            <Coins className="text-yellow-400 w-8 h-8 lg:w-12 lg:h-12" />
          </div>
          <p className="text-base lg:text-xl font-bold text-amber-300 mt-4">
            لصالح: {stolenCapitalAlert.winner === 1 ? team1Name : team2Name}
          </p>
        </div>
        <button
          onClick={() => setStolenCapitalAlert(null)}
          className="w-full py-4 lg:py-5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xl lg:text-2xl rounded-2xl transition-all shadow-md active:scale-95"
        >
          متابعة المعركة
        </button>
      </div>
    </div>
  );
}