"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function RefereeAlertModal({ alertConfig, closeAlert }: any) {
  if (!alertConfig.show) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border-b-4 border-yellow-500 p-6 md:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
        <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">تنبيه النظام</h3>
        <p className="text-slate-600 dark:text-slate-300 font-bold text-sm mb-6 leading-relaxed whitespace-pre-line">{alertConfig.message}</p>
        <div className="flex gap-3 justify-center">
          {alertConfig.isConfirm && (
            <button onClick={closeAlert} className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black rounded-xl border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all shadow-md">إلغاء</button>
          )}
          <button onClick={() => { if (alertConfig.isConfirm && alertConfig.onConfirm) alertConfig.onConfirm(); closeAlert(); }} className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-xl border-b-4 border-yellow-700 active:border-b-0 active:translate-y-[4px] transition-all shadow-md">{alertConfig.isConfirm ? "تأكيد" : "حسناً"}</button>
        </div>
      </div>
    </div>
  );
}