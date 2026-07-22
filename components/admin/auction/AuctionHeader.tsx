"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Gavel, Database, ArrowLeft, Download, Upload } from "lucide-react";

export default function AuctionHeader({
  questionsCount,
  exportCSV,
  importCSV
}: {
  questionsCount: number;
  exportCSV?: () => void;
  importCSV?: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && importCSV) {
      importCSV(file);
      e.target.value = "";
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm gap-4">
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

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        {importCSV && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px] text-sm"
          >
            <Upload size={16} className="text-amber-500" />
            <span>استيراد CSV</span>
          </button>
        )}
        {exportCSV && (
          <button
            onClick={exportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-3 px-4 rounded-xl transition-all border-b-4 border-amber-700 active:border-b-0 active:translate-y-[4px] text-sm shadow-sm"
          >
            <Download size={16} />
            <span>تصدير CSV</span>
          </button>
        )}
        <Link href="/admin" className="flex-1 md:flex-none">
          <button className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px] text-sm">
            <ArrowLeft size={16} />
            <span>رجوع</span>
          </button>
        </Link>
      </div>
    </header>
  );
}