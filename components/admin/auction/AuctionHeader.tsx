"use client";
import React from "react";
import Link from "next/link";
import { Gavel, Database, ArrowLeft } from "lucide-react";

export default function AuctionHeader({ questionsCount }: { questionsCount: number }) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm gap-4">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-amber-100 dark:bg-amber-500/20 rounded-2xl text-amber-600">
          <Gavel size={32} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
            بنك أسئلة حرب المزايدات
          </h1>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <Database size={16} />
            <span>إجمالي الأسئلة المضافة: {questionsCount}</span>
          </div>
        </div>
      </div>
      <Link href="/admin">
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-xl transition-all border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px]">
          <ArrowLeft size={18} />
          <span>رجوع للوحة التحكم</span>
        </button>
      </Link>
    </header>
  );
}