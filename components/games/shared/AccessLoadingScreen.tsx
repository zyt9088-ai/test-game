import React from "react";
import { Shield, Zap } from "lucide-react";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

export default function AccessLoadingScreen() {
  return (
    <div className={`min-h-[100dvh] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-black text-2xl ${cairo.className}`} dir="rtl">
      <div className="relative flex items-center justify-center mb-8">
        <Shield className="w-24 h-24 text-slate-200 dark:text-slate-800 animate-pulse" />
        <Zap className="w-12 h-12 text-yellow-500 absolute animate-bounce drop-shadow-lg" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-3xl text-indigo-600 dark:text-indigo-400 animate-pulse drop-shadow-sm">جاري التأكد من الرصيد...</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold tracking-widest">لحظات وسيتم توجيهك</p>
      </div>
    </div>
  );
}
