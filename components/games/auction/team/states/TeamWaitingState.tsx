"use client";
import React from "react";
import { ShieldAlert, LogOut } from "lucide-react";

export default function TeamWaitingState({ ctx }: { ctx: any }) {
  if (!ctx.isJoined || (ctx.liveData && ctx.liveData.game_state !== "setup")) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center animate-pulse">
        <ShieldAlert className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-white">بانتظار الحكم...</h2>
        <p className="text-slate-500 font-bold">الرجاء الانتظار حتى يقوم الحكم ببدء اللعبة.</p>
      </div>
      <button onClick={ctx.handleLeave} className="mt-12 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-xl border-b-4 border-slate-300 dark:border-slate-900 flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 active:border-b-0 active:translate-y-[4px] transition-all">
        <LogOut size={18} /> خروج
      </button>
    </div>
  );
}