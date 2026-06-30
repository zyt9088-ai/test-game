/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Cairo } from "next/font/google";
import { CheckCircle2, AlertCircle } from "lucide-react";

import { useCastleWarAdmin } from "@/hooks/admin/castle-war/useCastleWarAdmin";
import CastleWarHeader from "@/components/admin/castle-war/CastleWarHeader";
import CastleWarTabs from "@/components/admin/castle-war/CastleWarTabs";
import CastleWarSimpleCategory from "@/components/admin/castle-war/CastleWarSimpleCategory";
import CastleWarGeneralCategory from "@/components/admin/castle-war/CastleWarGeneralCategory";
import ParticleBackground from "@/components/admin/dashboard/ParticleBackground"; 

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

export default function CastleWarAdmin() {
  const ctx = useCastleWarAdmin();

  return (
    <main
      className={`min-h-screen relative flex flex-col p-4 md:p-6 w-full ${cairo.className} overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950`}
      dir="rtl"
    >


      {/* خلفية الجزيئات الموحدة نقدر نستخدمها هنا مباشرة */}
      <ParticleBackground />

      {/* تنبيه التوست */}
      {ctx.toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-lg z-[100] font-black text-sm flex items-center gap-2 animate-in slide-in-from-top-4 ${ctx.toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
        >
          {ctx.toast.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {ctx.toast.msg}
        </div>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        <CastleWarHeader />

        <section className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-3 md:p-6 shadow-sm flex flex-col min-h-0 transition-colors duration-500 overflow-hidden">
          <div className="flex flex-col h-full animate-in fade-in min-h-0">
            <CastleWarTabs cwActiveSubTab={ctx.cwActiveSubTab} setCwActiveSubTab={ctx.setCwActiveSubTab} />

            <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-3 md:p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
              <CastleWarSimpleCategory ctx={ctx} />
              <CastleWarGeneralCategory ctx={ctx} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}