"use client";
import React from "react";
import { MapPin, HelpCircle } from "lucide-react";

export default function WorldDominationTabs({ wdActiveSubTab, setWdActiveSubTab }: any) {
  return (
    <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shrink-0 shadow-sm">
      <button
        onClick={() => setWdActiveSubTab("map")}
        className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${wdActiveSubTab === "map" ? "bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
      >
        <MapPin size={18} /> الخريطة والدول
      </button>
      <button
        onClick={() => setWdActiveSubTab("challenges")}
        className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${wdActiveSubTab === "challenges" ? "bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
      >
        <HelpCircle size={18} /> بنك تحديات الحكم
      </button>
    </div>
  );
}