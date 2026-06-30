"use client";
import React from "react";
import { Download, Upload, UploadCloud, Check } from "lucide-react";

export default function CastleWarSimpleCategory({ ctx }: { ctx: any }) {
  const {
    cwActiveSubTab, cw30SecDB, cw5SecDB, cwTeamDB,
    newCw30Sec, setNewCw30Sec, newCw5Sec, setNewCw5Sec, newCwTeam, setNewCwTeam,
    selectedCw30Sec, setSelectedCw30Sec, selectedCw5Sec, setSelectedCw5Sec, selectedCwTeam, setSelectedCwTeam,
    saveCw30Data, saveCw5Data, saveCwTeamData, showToast,
    exportToJsonFile, handleJsonImport, handleExcelUpload
  } = ctx;

  if (!["30sec", "5sec", "team"].includes(cwActiveSubTab)) return null;

  const db = cwActiveSubTab === "30sec" ? cw30SecDB : cwActiveSubTab === "5sec" ? cw5SecDB : cwTeamDB;
  const selected = cwActiveSubTab === "30sec" ? selectedCw30Sec : cwActiveSubTab === "5sec" ? selectedCw5Sec : selectedCwTeam;
  const setSelect = cwActiveSubTab === "30sec" ? setSelectedCw30Sec : cwActiveSubTab === "5sec" ? setSelectedCw5Sec : setSelectedCwTeam;
  
  const val = cwActiveSubTab === "30sec" ? newCw30Sec : cwActiveSubTab === "5sec" ? newCw5Sec : newCwTeam;
  const setVal = cwActiveSubTab === "30sec" ? setNewCw30Sec : cwActiveSubTab === "5sec" ? setNewCw5Sec : setNewCwTeam;
  const saveFn = cwActiveSubTab === "30sec" ? saveCw30Data : cwActiveSubTab === "5sec" ? saveCw5Data : saveCwTeamData;

  const handleAdd = () => {
    if (val.trim()) {
      saveFn(Array.from(new Set([...db, val.trim()]))).then(() => {
        setVal("");
        showToast("تمت الإضافة");
      });
    }
  };

  return (
    <div className="animate-in fade-in flex flex-col h-full min-h-0">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between mb-4 shrink-0 shadow-sm">
        <div className="flex gap-2 w-full lg:w-1/3 shrink-0">
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="أضف موضوع/تحدي جديد..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-rose-500 transition-colors font-bold"
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
          <button onClick={handleAdd} className="bg-rose-600 hover:bg-rose-700 text-white px-5 rounded-lg font-black text-xs transition-colors shadow-sm">
            حفظ
          </button>
        </div>
        <div className="flex gap-2 w-full lg:w-auto shrink-0 justify-start lg:justify-end flex-wrap overflow-x-auto hide-scrollbar">
          {selected.length > 0 && (
            <button
              onClick={() => {
                if (confirm("متأكد من الحذف؟")) {
                  saveFn(db.filter((w: string) => !selected.includes(w))).then(() => {
                    setSelect([]);
                    showToast("تم الحذف");
                  });
                }
              }}
              className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30 px-3 py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all shadow-sm shrink-0"
            >
              حذف ({selected.length})
            </button>
          )}
          <button
            onClick={() => setSelect(selected.length === db.length && db.length > 0 ? [] : [...db])}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-3 py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all shadow-sm shrink-0"
          >
            تحديد الكل
          </button>
          <button
            onClick={() => exportToJsonFile(db, `castle_war_${cwActiveSubTab}`)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-3 py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Download size={14} /> تصدير
          </button>
          <label className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-3 py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0">
            <Upload size={14} /> استيراد
            <input type="file" accept=".json" className="hidden" onChange={(e) => handleJsonImport(e, saveFn)} />
          </label>
          <label className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg font-bold text-[10px] sm:text-xs cursor-pointer shadow-sm shrink-0">
            <UploadCloud size={14} /> إكسل
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => handleExcelUpload(e, db, saveFn, "تحدي")} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto custom-scroll pr-1 flex-1 content-start pb-4">
        {db.length === 0 ? (
          <p className="col-span-full text-slate-400 text-center w-full py-8 text-xs font-bold">
            لا يوجد بيانات، قم بالإضافة للبدء.
          </p>
        ) : (
          db.map((w: string, wIdx: number) => {
            const isSelected = selected.includes(w);
            return (
              <div
                key={wIdx}
                onClick={() => setSelect((prev: string[]) => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w])}
                className={`cursor-pointer border p-3.5 rounded-xl flex items-center gap-3 shadow-sm transition-all text-xs font-bold ${isSelected ? "bg-rose-50 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-100" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-600"}`}
              >
                <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-colors ${isSelected ? "bg-rose-600 border-rose-600" : "border-slate-300 dark:border-slate-500"}`}>
                  {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <div className="flex items-start gap-1.5 w-full">
                  <span className="text-slate-400 font-black text-[10px] mt-0.5">{wIdx + 1}-</span>
                  <span className="whitespace-normal leading-relaxed break-words">{w}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}