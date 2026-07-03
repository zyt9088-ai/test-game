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
      <div className="bg-slate-800 border-4 border-amber-500 rounded-3xl p-5 lg:p-8 max-w-[90vw] lg:max-w-md w-full text-center shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-in zoom-in-95">
        <Star className="w-16 h-16 lg:w-20 lg:h-20 text-amber-500 mx-auto mb-3 lg:mb-4 animate-pulse" />
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-3 lg:mb-4 tracking-wide drop-shadow-md">
          سقوط العاصمة! 🔥
        </h2>
        <p className="text-base lg:text-lg font-bold text-slate-300 mb-5 lg:mb-6 leading-relaxed">
          لقد سقطت عاصمة{" "}
          <span className="text-white font-black">
            {stolenCapitalAlert.loser === 1 ? team1Name : team2Name}
          </span>{" "}
          ({stolenCapitalAlert.countryName})
        </p>
        <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-4 lg:p-5 mb-5 lg:mb-6 shadow-inner">
          <p className="text-lg lg:text-xl font-black text-amber-400 mb-2">
            تم غنم ثلث الثروات:
          </p>
          <div className="text-3xl lg:text-4xl font-black text-white flex items-center justify-center gap-2">
            {stolenCapitalAlert.points}{" "}
            <Coins className="text-yellow-400 w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <p className="text-sm lg:text-base font-bold text-amber-300 mt-3">
            لصالح: {stolenCapitalAlert.winner === 1 ? team1Name : team2Name}
          </p>
        </div>
        <button
          onClick={() => setStolenCapitalAlert(null)}
          className="w-full py-3 lg:py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-lg lg:text-xl rounded-2xl transition-all shadow-md active:scale-95"
        >
          متابعة المعركة
        </button>
      </div>
    </div>
  );
}