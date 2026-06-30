"use client";
import React from "react";
import { Globe, Swords, Gavel, MapPin, HelpCircle, Target, Clock, Timer, Activity } from "lucide-react";

const StatBox = ({ icon, title, count, colorTheme, className = "" }: any) => {
  const themes = {
    rose: "bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400",
    blue: "bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400",
    amber: "bg-white dark:bg-slate-900 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400",
  };
  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-all hover:scale-[1.02] ${themes[colorTheme as keyof typeof themes]} ${className}`}>
      <div className="flex items-center gap-2"><div className="opacity-70">{icon}</div><span className="text-sm font-bold text-slate-600 dark:text-slate-400">{title}</span></div>
      <span className="text-2xl font-black drop-shadow-sm">{count}</span>
    </div>
  );
};

export default function AdminStatsSection({ wdStats, cwStats, awStats }: any) {
  return (
    <div className="w-full max-w-6xl mb-12">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <Activity className="text-emerald-500" size={28} />
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">إحصائيات النظام</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* السيطرة على العالم */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-blue-900/50 rounded-[2rem] p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 rounded-xl"><Globe size={24} /></div>
            <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">السيطرة على العالم</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatBox icon={<MapPin size={18} />} title="الدول" count={wdStats.countries} colorTheme="blue" />
            <StatBox icon={<HelpCircle size={18} />} title="أسئلة" count={wdStats.questions} colorTheme="blue" />
            <StatBox icon={<Target size={18} />} title="تحديات" count={wdStats.challenges} colorTheme="blue" className="col-span-2" />
          </div>
          <div className="mt-auto border-t border-blue-100 dark:border-blue-900/30 pt-4">
            <h5 className="text-[11px] font-black text-slate-500 mb-3">تفصيل الأسئلة لكل دولة:</h5>
            <div className="flex flex-wrap gap-2 max-h-[90px] overflow-y-auto custom-scroll pr-1">
              {wdStats.countryDetails.map((c: any, i: number) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-2">
                  {c.name} <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md font-black">{c.qCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* حرب القلاع */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-rose-200 dark:border-rose-900/50 rounded-[2rem] p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-500/20 text-rose-600 rounded-xl"><Swords size={24} /></div>
            <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">حرب القلاع</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatBox icon={<Clock size={18} />} title="30 ثانية" count={cwStats.q30} colorTheme="rose" />
            <StatBox icon={<Timer size={18} />} title="5 ثواني" count={cwStats.q5} colorTheme="rose" />
            <StatBox icon={<Target size={18} />} title="تحدي فريق" count={cwStats.team} colorTheme="rose" />
            <StatBox icon={<HelpCircle size={18} />} title="أسئلة عامة" count={cwStats.general} colorTheme="rose" />
          </div>
        </div>

        {/* حرب المزايدات */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-amber-200 dark:border-amber-900/50 rounded-[2rem] p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 rounded-xl"><Gavel size={24} /></div>
            <h4 className="text-xl font-black text-slate-800 dark:text-slate-100">حرب المزايدات</h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <StatBox icon={<HelpCircle size={18} />} title="إجمالي الأسئلة" count={awStats.questions} colorTheme="amber" />
          </div>
        </div>
      </div>
    </div>
  );
}