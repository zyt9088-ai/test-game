"use client";
import React from "react";
import { Download, Upload } from "lucide-react";

export default function AdminBackupSection({ handleExportBackup, handleImportBackup }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-2xl p-6 w-full max-w-xl shadow-sm">
      <h3 className="text-lg font-black mb-2 text-slate-900 dark:text-white">النسخ الاحتياطي</h3>
      <div className="flex gap-3">
        <button onClick={handleExportBackup} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
          <Download size={18} /> حفظ
        </button>
        <label className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-700 transition-colors">
          <Upload size={18} /> استعادة
          <input type="file" accept=".json" className="hidden" onChange={handleImportBackup} />
        </label>
      </div>
    </div>
  );
}