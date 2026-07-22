"use client";
import React from "react";
import { Download, Upload, UploadCloud, Check, Edit } from "lucide-react";

export default function CastleWarGeneralCategory({ ctx }: { ctx: any }) {
  const {
    cwActiveSubTab, cwGenDB, selectedCwGen, setSelectedCwGen,
    newCwGenQuestion, setNewCwGenQuestion, genOpt1, setGenOpt1,
    genOpt2, setGenOpt2, genOpt3, setGenOpt3, correctGenOpt, setCorrectGenOpt,
    addManualCwGenQA, exportToJsonFile, handleJsonImport, saveCwGenData, handleCwGenFileUpload, showToast,
    editingGenIdx, startEditingCwGen, cancelEditingCwGen
  } = ctx;

  if (cwActiveSubTab !== "general") return null;

  return (
    <div className="animate-in fade-in flex flex-col h-full min-h-0">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4 shadow-sm shrink-0">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-3">
            <input
              type="text"
              value={newCwGenQuestion}
              onChange={(e) => setNewCwGenQuestion(e.target.value)}
              placeholder="اكتب السؤال هنا..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-3.5 text-sm outline-none focus:border-emerald-500 font-bold"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" value={genOpt1} onChange={(e) => setGenOpt1(e.target.value)} placeholder="الخيار الأول" className={`p-3 rounded-lg border outline-none text-xs font-bold ${correctGenOpt === 1 ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-slate-200 bg-white text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white"}`} />
              <input type="text" value={genOpt2} onChange={(e) => setGenOpt2(e.target.value)} placeholder="الخيار الثاني" className={`p-3 rounded-lg border outline-none text-xs font-bold ${correctGenOpt === 2 ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-slate-200 bg-white text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white"}`} />
              <input type="text" value={genOpt3} onChange={(e) => setGenOpt3(e.target.value)} placeholder="الخيار الثالث" className={`p-3 rounded-lg border outline-none text-xs font-bold ${correctGenOpt === 3 ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300" : "border-slate-200 bg-white text-slate-900 dark:bg-slate-950 dark:border-slate-700 dark:text-white"}`} />
            </div>
          </div>

          <div className="flex flex-col justify-between shrink-0 w-full lg:w-auto gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1.5 gap-1.5">
              {[1, 2, 3].map((num) => (
                <button key={num} onClick={() => setCorrectGenOpt(num)} className={`flex-1 px-4 py-2.5 text-xs font-black rounded-md transition-all ${correctGenOpt === num ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500"}`}>
                  {num} صح
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <button onClick={addManualCwGenQA} className="flex-1 min-w-[80px] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-lg text-xs shadow-sm flex items-center justify-center gap-1">
                {editingGenIdx !== null && editingGenIdx !== undefined ? <Edit size={14} /> : null}
                <span>{editingGenIdx !== null && editingGenIdx !== undefined ? "حفظ التعديل" : "إضافة"}</span>
              </button>
              {editingGenIdx !== null && editingGenIdx !== undefined && (
                <button onClick={cancelEditingCwGen} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-3 rounded-lg text-xs">
                  إلغاء
                </button>
              )}
              <button onClick={() => exportToJsonFile(cwGenDB, "castle_war_general")} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-3 rounded-lg cursor-pointer shadow-sm flex items-center justify-center" title="تصدير JSON"><Download size={16} /></button>
              <label className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 px-3 rounded-lg cursor-pointer shadow-sm flex items-center justify-center" title="استيراد JSON">
                <Upload size={16} />
                <input type="file" accept=".json" className="hidden" onChange={(e) => handleJsonImport(e, saveCwGenData)} />
              </label>
              <label className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0" title="رفع إكسل">
                <UploadCloud size={16} /> إكسل
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleCwGenFileUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-3 px-3 shrink-0 bg-slate-100 dark:bg-slate-800/50 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <span className="text-xs font-black text-slate-600 dark:text-slate-400">بنك الأسئلة العامة ({cwGenDB.length})</span>
        <div className="flex gap-2 items-center">
          {selectedCwGen.length > 0 && (
            <button
              onClick={() => {
                if (confirm("متأكد من الحذف؟")) {
                  saveCwGenData(cwGenDB.filter((_: any, i: number) => !selectedCwGen.includes(i)));
                  setSelectedCwGen([]);
                  showToast("تم الحذف");
                }
              }}
              className="text-rose-600 bg-rose-100 dark:bg-rose-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-rose-200 transition-colors"
            >
              حذف ({selectedCwGen.length})
            </button>
          )}
          <button
            onClick={() => setSelectedCwGen(selectedCwGen.length === cwGenDB.length && cwGenDB.length > 0 ? [] : cwGenDB.map((_: any, i: number) => i))}
            className="text-indigo-600 bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-indigo-200 transition-colors"
          >
            تحديد الكل
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto custom-scroll pr-1 flex-1 content-start pb-4">
        {cwGenDB.length === 0 ? (
          <p className="text-slate-400 text-center w-full py-8 text-xs font-bold">لا يوجد أسئلة عامة.</p>
        ) : (
          cwGenDB.map((item: any, idx: number) => {
            const isSelected = selectedCwGen.includes(idx);
            return (
              <div
                key={idx}
                className={`border p-4 rounded-2xl flex items-start justify-between gap-4 shadow-sm transition-all ${isSelected ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/50" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700"}`}
              >
                <div className="flex items-start gap-4 flex-1" onClick={() => setSelectedCwGen((prev: number[]) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx])}>
                  <div className={`w-5 h-5 rounded shrink-0 flex items-center justify-center border mt-1 transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600" : "border-slate-300 dark:border-slate-500"}`}>
                    {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="font-black text-slate-400 text-sm mt-1">{idx + 1}-</span>
                  <div className="flex flex-col gap-2 w-full">
                    <span className="font-black text-slate-900 dark:text-white text-sm leading-relaxed">{item.q}</span>
                    {item.options ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.options.map((opt: string, oIdx: number) => (
                          <span key={oIdx} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border ${opt === item.a ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400"}`}>
                            {opt}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg w-fit">
                        الجواب: {item.a}
                      </span>
                    )}
                  </div>
                </div>

                {startEditingCwGen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingCwGen(idx);
                    }}
                    className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors shrink-0"
                    title="تعديل السؤال"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}