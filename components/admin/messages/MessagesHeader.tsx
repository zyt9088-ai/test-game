"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Inbox, LayoutGrid, List } from "lucide-react";

export default function MessagesHeader({ ctx }: { ctx: any }) {
  const { viewMode, setViewMode, messages } = ctx;

  return (
    <>
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="group relative inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 border-b-4 border-indigo-900 rounded-2xl text-white font-black hover:bg-indigo-500 hover:-translate-y-1 active:translate-y-1 active:border-b-0 transition-all shadow-lg shadow-indigo-500/30"
        >
          <div className="bg-white/20 p-1.5 rounded-xl">
            <ArrowRight size={22} className="text-white group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-lg tracking-wide">الرجوع</span>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-white dark:bg-slate-800 p-6 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border-b-4 border-blue-200 dark:border-blue-800">
            <Inbox size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">صندوق الرسائل</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-1">
              الرسائل الواردة من نموذج تواصل معنا
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              title="عرض البطاقات"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              title="عرض الجدول"
            >
              <List size={20} />
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl font-black text-slate-600 dark:text-slate-300">
            الإجمالي: {messages.length}
          </div>
        </div>
      </div>
    </>
  );
}