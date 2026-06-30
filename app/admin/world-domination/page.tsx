/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Cairo } from "next/font/google";
import { Globe } from "lucide-react";

import { useWorldDominationAdmin } from "@/hooks/admin/world-domination/useWorldDominationAdmin";
import ParticleBackground from "@/components/admin/dashboard/ParticleBackground";
import WorldDominationHeader from "@/components/admin/world-domination/WorldDominationHeader";
import WorldDominationTabs from "@/components/admin/world-domination/WorldDominationTabs";
import WorldDominationMapTab from "@/components/admin/world-domination/WorldDominationMapTab";
import WorldDominationChallengesTab from "@/components/admin/world-domination/WorldDominationChallengesTab";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

export default function WorldDominationAdmin() {
  const ctx = useWorldDominationAdmin();

  if (ctx.isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-black text-2xl ${cairo.className}`} dir="rtl">
        <Globe className="w-20 h-20 text-blue-500 animate-spin-slow mb-4" />
        <p className="animate-pulse">جاري الاتصال بمركز القيادة...</p>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen relative flex flex-col p-4 md:p-6 w-full ${cairo.className} overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950`}
      dir="rtl"
    >
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">
        <WorldDominationHeader />

        <section className="flex-1 bg-transparent flex flex-col transition-colors duration-500">
          <WorldDominationTabs wdActiveSubTab={ctx.wdActiveSubTab} setWdActiveSubTab={ctx.setWdActiveSubTab} />
          
          <WorldDominationMapTab ctx={ctx} />
          <WorldDominationChallengesTab ctx={ctx} />
        </section>
      </div>
    </main>
  );
}