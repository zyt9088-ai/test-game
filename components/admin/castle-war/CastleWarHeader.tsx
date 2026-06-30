"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Swords } from "lucide-react";

export default function CastleWarHeader() {
  return (
    <header className="shrink-0 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 md:p-5 shadow-sm mb-4 transition-colors duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors duration-300 flex items-center justify-center"
        >
          <ArrowRight size={24} />
        </Link>
        <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-sm transition-colors duration-500">
          <Swords size={24} />
        </div>
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-wide transition-colors duration-500">
            إدارة القلاع
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-sm mt-0.5 transition-colors duration-500">
            إدارة بنوك الأسئلة والتحديات الحية
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/50 transition-colors duration-500">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
        <span className="text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-colors duration-500 hidden sm:inline">
          متصل بقاعدة البيانات
        </span>
      </div>
    </header>
  );
}