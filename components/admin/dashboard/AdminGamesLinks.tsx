"use client";
import React from "react";
import Link from "next/link";
import { Globe, Swords, Gavel } from "lucide-react";

export default function AdminGamesLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
      <Link href="/admin/world-domination" className="group">
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-blue-500 transition-all h-full">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><Globe size={40} /></div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center">السيطرة على العالم</h3>
        </div>
      </Link>
      <Link href="/admin/castle-war" className="group">
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-rose-500 transition-all h-full">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><Swords size={40} /></div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center">حرب القلاع</h3>
        </div>
      </Link>
      <Link href="/admin/auction" className="group">
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-amber-500 transition-all h-full">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><Gavel size={40} /></div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center">حرب المزايدات</h3>
        </div>
      </Link>
    </div>
  );
}