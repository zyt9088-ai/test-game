"use client";
import React from "react";
import { ListOrdered, Database, Edit, Trash2 } from "lucide-react";
import { AuctionQuestion } from "@/hooks/admin/auction/useAuctionQuestions";

export default function AuctionQuestionsList({ 
  questions, handleEdit, handleDelete 
}: { 
  questions: AuctionQuestion[], 
  handleEdit: (q: AuctionQuestion) => void, 
  handleDelete: (id: string) => void 
}) {
  return (
    <section className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
          <ListOrdered size={20} />
        </div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">
          الأسئلة المضافة ({questions.length})
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {questions.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Database className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-500">لا توجد أسئلة مضافة حتى الآن.</p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div key={q.id} className="p-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-amber-300 dark:hover:border-amber-700 transition-colors group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-xs font-black">سؤال {index + 1}</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{q.category}</span>
                </div>
                <p className="font-black text-slate-800 dark:text-slate-200 mb-2 leading-relaxed">{q.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, i) => (
                     <span key={i} className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg border ${opt === q.answer ? 'bg-emerald-100 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}>
                       {opt}
                     </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <button onClick={() => handleEdit(q)} className="flex-1 md:flex-none p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-colors flex items-center justify-center" title="تعديل"><Edit size={18} /></button>
                <button onClick={() => handleDelete(q.id)} className="flex-1 md:flex-none p-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl transition-colors flex items-center justify-center" title="حذف"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}