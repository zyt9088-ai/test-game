"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Download, Upload } from "lucide-react";

export default function WorldDominationHeader({
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
    <header className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 md:p-5 shadow-sm mb-6 transition-colors duration-500 gap-4">
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
            <Upload size={16} className="text-purple-500" />
            <span>استيراد CSV</span>
          </button>
        )}
        {exportCSV && (
          <button
            onClick={exportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm active:scale-95"
          >
            <Download size={16} />
            <span>تصدير CSV</span>
          </button>
        )}
      </div>
    </header>
  );
}