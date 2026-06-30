"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function WorldDominationHeader() {
  return (
    <header className="shrink-0 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 md:p-5 shadow-sm mb-6 transition-colors duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors duration-300 flex items-center justify-center">
          <ArrowRight size={24} />
        </Link>
        <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm transition-colors duration-500">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-wide transition-colors duration-500">السيطرة على العالم</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-0.5 transition-colors duration-500">إدارة الخريطة الميدانية وبنوك التحديات</p>
        </div>
      </div>
    </header>
  );
}