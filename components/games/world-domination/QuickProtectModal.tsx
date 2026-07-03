"use client";

import React from "react";
import { Shield } from "lucide-react";

// نقلنا كود السكرول هنا عشان الملف يكون مستقل
const modernScrollbar =
  "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

interface QuickProtectModalProps {
  quickProtectTeam: 1 | 2 | null;
  setQuickProtectTeam: (val: 1 | 2 | null) => void;
  team1Name: string;
  team2Name: string;
  countries: any[];
  protectedCountries: any;
  setCards1: React.Dispatch<React.SetStateAction<any>>;
  setCards2: React.Dispatch<React.SetStateAction<any>>;
  setProtectedCountries: React.Dispatch<React.SetStateAction<any>>;
  capitals: { team1: string | null; team2: string | null };
}

export default function QuickProtectModal({
  quickProtectTeam,
  setQuickProtectTeam,
  team1Name,
  team2Name,
  countries,
  protectedCountries,
  setCards1,
  setCards2,
  setProtectedCountries,
  capitals,
}: QuickProtectModalProps) {
  if (!quickProtectTeam) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 lg:p-6 max-w-md w-full border-2 border-emerald-500 text-center shadow-2xl animate-in zoom-in-95">
        <Shield className="w-12 h-12 lg:w-16 lg:h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl lg:text-2xl font-black mb-4 dark:text-white">
          تفعيل حماية سريعة لـ{" "}
          <span className="text-emerald-500">
            {quickProtectTeam === 1 ? team1Name : team2Name}
          </span>
        </h3>
        <p className="text-slate-500 mb-6 text-xs lg:text-sm font-bold">
          اختر الدولة المراد تحصينها بالدرع. (لا يمكن حماية العاصمة)
        </p>
        <div
          className={`max-h-60 overflow-y-auto flex flex-col gap-2 mb-6 pr-2 ${modernScrollbar}`}
        >
          {countries
            .filter((c) => c.owner === quickProtectTeam && !protectedCountries[c.id] && c.id !== capitals.team1 && c.id !== capitals.team2)
            .map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (quickProtectTeam === 1)
                    setCards1((p: any) => ({ ...p, protect: p.protect - 1 }));
                  else
                    setCards2((p: any) => ({ ...p, protect: p.protect - 1 }));
                  setProtectedCountries((p: any) => ({ ...p, [c.id]: true }));
                  setQuickProtectTeam(null);
                }}
                className="w-full py-2.5 lg:py-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-black rounded-xl transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 text-sm"
              >
                <span>{c.name}</span>
                <Shield size={16} />
              </button>
            ))}
          {countries.filter((c) => c.owner === quickProtectTeam && !protectedCountries[c.id] && c.id !== capitals.team1 && c.id !== capitals.team2).length === 0 && (
            <p className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl text-sm">
              لا يوجد دول مملوكة قابلة للحماية حالياً.
            </p>
          )}
        </div>
        <button
          onClick={() => setQuickProtectTeam(null)}
          className="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-black rounded-xl transition-colors text-sm"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
}