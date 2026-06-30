"use client";
import React from "react";
import { LogOut } from "lucide-react";

export default function TeamHeader({ handleLeave, roomCode }: any) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
      <button onClick={handleLeave} className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-xl flex items-center justify-center gap-2 font-black text-xs transition-colors">
        <LogOut size={16} /> خروج
      </button>
      <div className="text-left">
        <h1 className="text-lg font-black tracking-wide text-slate-900 dark:text-white">غرفة: <span className="text-yellow-600">{roomCode}</span></h1>
      </div>
    </div>
  );
}