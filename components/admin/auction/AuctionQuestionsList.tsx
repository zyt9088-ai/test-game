import React, { useState } from "react";
import { ListOrdered, Database, Edit, Trash2, Check, Folder, Plus } from "lucide-react";
import { AuctionQuestion } from "@/hooks/admin/auction/useAuctionQuestions";

export default function AuctionQuestionsList({ 
  questions, handleEdit, handleDelete, updateQuestionDifficulty, updateQuestionAnswer, setCategoryForNewQuestion
}: { 
  questions: AuctionQuestion[], 
  handleEdit: (q: AuctionQuestion) => void, 
  handleDelete: (id: string) => void,
  updateQuestionDifficulty?: (id: string, difficulty: "سهل" | "متوسط" | "صعب") => void,
  updateQuestionAnswer?: (id: string, answer: string) => void,
  setCategoryForNewQuestion?: (category: string) => void
}) {
  const [activeTab, setActiveTab] = useState<string>("الكل");

  // استخراج الفئات المتوفرة في الأسئلة
  const allCategories = Array.from(new Set(questions.map((q) => q.category || "عام")));

  // التصفية حسب الفئة المختارة
  const filteredQuestions = activeTab === "الكل" 
    ? questions 
    : questions.filter((q) => (q.category || "عام") === activeTab);

  // تجميع الأسئلة حسب الفئات للعرض المنظم
  const groupedCategories = activeTab === "الكل" ? allCategories : [activeTab];

  return (
    <section className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
      {/* هيدر بنك الأسئلة مع التصفية */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
            <ListOrdered size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">
            الأسئلة المضافة حسب الفئات ({questions.length})
          </h2>
        </div>

        {/* تبويبات التصفية حسب الفئة */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("الكل")}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${
                activeTab === "الكل"
                  ? "bg-amber-500 text-slate-900 shadow-sm scale-105"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              الكل ({questions.length})
            </button>
            {allCategories.map((cat) => {
              const count = questions.filter((q) => (q.category || "عام") === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 ${
                    activeTab === cat
                      ? "bg-amber-500 text-slate-900 shadow-sm scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  <Folder size={12} />
                  <span>{cat}</span>
                  <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* عرض الأسئلة مقسمة داخل بطاقات الفئات */}
      {questions.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Database className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="font-bold text-slate-500">لا توجد أسئلة مضافة حتى الآن.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groupedCategories.map((catName) => {
            const catQs = questions.filter((q) => (q.category || "عام") === catName);
            if (catQs.length === 0) return null;

            return (
              <div key={catName} className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40 p-5 rounded-3xl border-2 border-slate-200/80 dark:border-slate-800">
                {/* هيدر الفئة */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                      <Folder size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-base">{catName}</h3>
                      <span className="text-xs font-bold text-slate-400">إجمالي أسئلة الفئة: {catQs.length}</span>
                    </div>
                  </div>

                  {setCategoryForNewQuestion && (
                    <button
                      onClick={() => setCategoryForNewQuestion(catName)}
                      className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition-colors border border-amber-200 dark:border-amber-800/50"
                    >
                      <Plus size={14} /> إضافة سؤال لهذه الفئة
                    </button>
                  )}
                </div>

                {/* أسئلة الفئة */}
                <div className="flex flex-col gap-3">
                  {catQs.map((q, index) => (
                    <div key={q.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-amber-300 dark:hover:border-amber-700 transition-colors group shadow-sm">
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-lg text-xs font-black">سؤال {index + 1}</span>
                          </div>

                          {/* تصنيف الصعوبة التفاعلي للأسئلة السابقة */}
                          {updateQuestionDifficulty && (
                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                              <span className="text-[11px] font-black text-slate-400 px-1.5">الصعوبة:</span>
                              {(["سهل", "متوسط", "صعب"] as const).map((level) => {
                                const active = (q.difficulty || "متوسط") === level;
                                return (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => updateQuestionDifficulty(q.id, level)}
                                    className={`px-2.5 py-0.5 text-[11px] font-black rounded-lg transition-all ${
                                      active
                                        ? level === "سهل"
                                          ? "bg-emerald-500 text-white shadow-sm"
                                          : level === "متوسط"
                                          ? "bg-amber-500 text-white shadow-sm"
                                          : "bg-rose-500 text-white shadow-sm"
                                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                    }`}
                                  >
                                    {level}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <p className="font-black text-slate-800 dark:text-slate-200 mb-3 leading-relaxed text-base">{q.question}</p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-[11px] font-bold text-slate-400">انقر لتحديد الإجابة الصحيحة:</span>
                          {q.options.map((opt, i) => {
                            const isCorrect = opt === q.answer;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => updateQuestionAnswer && updateQuestionAnswer(q.id, opt)}
                                title="انقر لتحديد هذا الخيار كإجابة صحيحة"
                                className={`text-[11px] md:text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                                  isCorrect
                                    ? 'bg-emerald-500 border-emerald-600 text-white font-black ring-2 ring-emerald-500/20 scale-105 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 hover:border-emerald-400'
                                }`}
                              >
                                {opt} {isCorrect && <Check size={14} className="inline ml-1 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                        <button onClick={() => handleEdit(q)} className="flex-1 md:flex-none p-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-colors flex items-center justify-center" title="تعديل"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(q.id)} className="flex-1 md:flex-none p-3 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl transition-colors flex items-center justify-center" title="حذف"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}