"use client";
import React from "react";
import { HelpCircle, Target, Trash2 } from "lucide-react";

export default function WorldDominationChallengesTab({ ctx }: { ctx: any }) {
  if (ctx.wdActiveSubTab !== "challenges") return null;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0 shadow-sm">
        <div className="flex gap-4 w-full flex-1">
          <input
            type="text"
            value={ctx.newWdChallenge}
            onChange={(e) => ctx.setNewWdChallenge(e.target.value)}
            placeholder="أضف تحدي جديد للحكم (سيظهر للجمهور بدون خيارات)..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-purple-500 transition-colors shadow-inner"
            onKeyDown={(e) => e.key === "Enter" && ctx.addWdChallenge()}
          />
          <button onClick={ctx.addWdChallenge} className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-2xl font-black text-sm transition-colors shadow-md active:scale-95">
            حفظ التحدي
          </button>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <h3 className="font-black dark:text-white text-xl text-purple-600 flex items-center gap-2">
            <HelpCircle /> بنك تحديات الحكم المسجلة
          </h3>
          <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-4 py-1.5 rounded-xl text-sm font-black">
            {ctx.wdChallengesDB.length} تحدي
          </span>
        </div>

        {ctx.wdChallengesDB.length === 0 ? (
          <div className="text-center text-slate-400 py-16 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
            <Target size={64} className="opacity-20 text-purple-400" />
            <p className="font-black text-lg">لا يوجد تحديات مسجلة حالياً في البنك.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {ctx.wdChallengesDB.map((challenge: { id: string; question: string }, idx: number) => (
              <div key={challenge.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm gap-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <span className="text-slate-400 font-black text-lg shrink-0 w-8">{idx + 1}-</span>
                <span className="text-slate-800 dark:text-slate-200 text-base font-bold w-full leading-relaxed">{challenge.question}</span>
                <button onClick={() => ctx.deleteWdChallenge(challenge.id)} className="text-slate-400 hover:text-white hover:bg-rose-500 bg-white dark:bg-slate-900 p-3 rounded-xl transition-colors shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}