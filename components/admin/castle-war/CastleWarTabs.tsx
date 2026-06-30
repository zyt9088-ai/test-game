"use client";
import React from "react";
import { Clock, Timer, Target, HelpCircle } from "lucide-react";

export default function CastleWarTabs({ cwActiveSubTab, setCwActiveSubTab }: any) {
  const tabs = [
    { id: "30sec", icon: <Clock size={16} />, label: "30 ثانية" },
    { id: "5sec", icon: <Timer size={16} />, label: "5 ثواني" },
    { id: "team", icon: <Target size={16} />, label: "تحدي الفريق" },
    { id: "general", icon: <HelpCircle size={16} />, label: "أسئلة عامة" },
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar bg-slate-100 dark:bg-slate-950/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 mb-4 shrink-0 gap-2 text-[11px] sm:text-xs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCwActiveSubTab(tab.id)}
          className={`flex-1 min-w-[100px] py-2.5 px-2 font-black rounded-lg transition-all flex items-center justify-center gap-2 ${
            cwActiveSubTab === tab.id
              ? "bg-white dark:bg-rose-600/20 text-rose-700 dark:text-rose-400 shadow-sm border border-rose-200 dark:border-rose-500/30"
              : "text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
          }`}
        >
          {tab.icon} <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}