"use client";

import React from "react";
import { Gamepad2, Sparkles, Shield, Cpu } from "lucide-react";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "800", "900"],
});

export default function GamingLoadingScreen({
  title = "جاري الاتصال بمركز القيادة...",
  subtitle = "يتم الآن مزامنة بنك الأسئلة والبيانات من السيرفر..."
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden ${tajawal.className}`}
      dir="rtl"
    >
      {/* خلفية الإضاءة النيون والمؤثرات */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/15 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>

      {/* الرمز الرئيسي المشع بالنيون */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8 max-w-md w-full text-center">
        <div className="relative">
          {/* الحلقات النيون المضيئة المتحركة */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 blur-lg opacity-70 animate-pulse"></div>
          <div className="relative bg-slate-900/90 border-2 border-purple-500/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex items-center justify-center">
            <Gamepad2 className="w-16 h-16 text-purple-400 animate-bounce" strokeWidth={2} />
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-spin-slow" />
            <Cpu className="w-5 h-5 text-blue-400 absolute -bottom-2 -left-2 animate-pulse" />
          </div>
        </div>

        {/* العناوين والنصوص */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-blue-300 tracking-wide">
            {title}
          </h2>
          <p className="text-slate-400 text-sm font-bold leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* شريط التحميل التفاعلي بالنيون */}
        <div className="w-full bg-slate-900/80 rounded-full h-3 p-0.5 border border-slate-800 shadow-inner overflow-hidden relative">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 animate-pulse w-full origin-left transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        </div>

        {/* الوسم السفلي */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800/80">
          <Shield size={14} className="text-purple-400" />
          <span>منظومة التحكم بالألعاب والحسابات</span>
        </div>
      </div>
    </div>
  );
}
