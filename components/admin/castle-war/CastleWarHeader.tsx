"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Swords, Download, Upload } from "lucide-react";

export default function CastleWarHeader({
  exportCSV,
  importCSV
}: {
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
    <header className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 md:p-5 shadow-sm mb-4 transition-colors duration-500 gap-4">
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

      <div className="flex items-center gap-3 w-full sm:w-auto">
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95"
          >
            <Upload size={16} className="text-rose-500" />
            <span>استيراد CSV</span>
          </button>
        )}
        {exportCSV && (
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95"
          >
            <Download size={16} />
            <span>تصدير CSV</span>
          </button>
        )}
      </div>
    </header>
  );
}