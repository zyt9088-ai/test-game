"use client";
import React from "react";
import { Edit, Plus, ChevronDown, Save, Loader2 } from "lucide-react";

export default function AuctionQuestionForm({ ctx }: { ctx: any }) {
  const {
    editingId, setEditingId, formData, setFormData, handleSubmit, isSaving,
    categoryRef, isAddingCategory, setIsAddingCategory, newCategory, setNewCategory,
    isCategoryDropdownOpen, setIsCategoryDropdownOpen, uniqueCategories
  } = ctx;

  return (
    <section className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
          {editingId ? <Edit size={20} /> : <Plus size={20} />}
        </div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white">
          {editingId ? "تعديل السؤال" : "إضافة سؤال جديد"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 relative" ref={categoryRef}>
            <label className="font-bold text-sm text-slate-500 dark:text-slate-400">فئة السؤال (المجال)</label>
            <div 
              onClick={() => !isAddingCategory && setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full min-h-[56px] p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-black flex justify-between items-center cursor-pointer focus-within:border-amber-500 transition-colors"
            >
              {isAddingCategory ? (
                <div className="flex gap-2 w-full">
                  <input
                    autoFocus
                    type="text"
                    placeholder="اكتب الفئة الجديدة..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none placeholder:text-slate-400 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCategory.trim()) {
                          setFormData({ ...formData, category: newCategory.trim() });
                          setIsAddingCategory(false);
                          setNewCategory("");
                        }
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (newCategory.trim()) {
                        setFormData({ ...formData, category: newCategory.trim() });
                        setIsAddingCategory(false);
                        setNewCategory("");
                      }
                    }} 
                    className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
                  >تم</button>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddingCategory(false); 
                      setNewCategory("");
                    }} 
                    className="bg-rose-500 text-white px-3 py-1 rounded-lg text-xs font-bold"
                  >إلغاء</button>
                </div>
              ) : (
                <span className={formData.category ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}>
                  {formData.category || "اختر الفئة أو أضف جديدة..."}
                </span>
              )}
              {!isAddingCategory && (
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
              )}
            </div>

            {isCategoryDropdownOpen && !isAddingCategory && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in slide-in-from-top-2">
                {uniqueCategories.map((cat: string) => (
                  <div
                    key={cat}
                    onClick={() => { setFormData({ ...formData, category: cat }); setIsCategoryDropdownOpen(false); }}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer font-black text-sm border-b last:border-b-0 border-slate-100 dark:border-slate-700 transition-colors"
                  >
                    {cat}
                  </div>
                ))}
                <div
                  onClick={() => { setIsAddingCategory(true); setIsCategoryDropdownOpen(false); }}
                  className="p-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-500 cursor-pointer font-black text-sm transition-colors flex items-center gap-2 border-t-2 border-slate-100 dark:border-slate-700"
                >
                  <Plus size={16} /> إضافة فئة جديدة...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-bold text-sm text-slate-500 dark:text-slate-400">نص السؤال</label>
            <textarea
              placeholder="اكتب السؤال هنا..."
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={3}
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-black focus:border-amber-500 outline-none transition-colors resize-none"
            />
          </div>

          {[
            { id: "opt1", label: "الخيار الأول", value: formData.opt1 },
            { id: "opt2", label: "الخيار الثاني", value: formData.opt2 },
            { id: "opt3", label: "الخيار الثالث", value: formData.opt3 }
          ].map((opt, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <label className="font-bold text-sm text-slate-500 dark:text-slate-400">{opt.label}</label>
              <input
                type="text"
                value={opt.value}
                onChange={(e) => setFormData({ ...formData, [opt.id]: e.target.value })}
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-black focus:border-amber-500 outline-none transition-colors"
              />
            </div>
          ))}

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-bold text-sm text-emerald-600 dark:text-emerald-500 mb-1">حدد الإجابة الصحيحة</label>
            <div className="flex flex-col sm:flex-row gap-3">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, correctOption: num as 1 | 2 | 3 })}
                  className={`flex-1 py-4 px-4 rounded-xl font-black border-2 transition-all shadow-sm ${
                    formData.correctOption === num 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/40 dark:border-emerald-500 dark:text-emerald-400 ring-2 ring-emerald-500/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  الخيار رقم {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-bold text-sm text-slate-500 dark:text-slate-400">مستوى صعوبة السؤال</label>
            <div className="flex flex-col sm:flex-row gap-3">
              {(["سهل", "متوسط", "صعب"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-sm border-2 transition-all shadow-sm ${
                    formData.difficulty === level
                      ? level === "سهل"
                        ? "bg-emerald-500 border-emerald-600 text-white ring-2 ring-emerald-500/30 scale-[1.02]"
                        : level === "متوسط"
                        ? "bg-amber-500 border-amber-600 text-white ring-2 ring-amber-500/30 scale-[1.02]"
                        : "bg-rose-500 border-rose-600 text-white ring-2 ring-rose-500/30 scale-[1.02]"
                      : "bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t-2 border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-black text-lg rounded-xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-[4px] transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {editingId ? "حفظ التعديلات" : "إضافة للسيرفر"}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ category: formData.category, question: "", opt1: "", opt2: "", opt3: "", correctOption: 1, difficulty: "متوسط" });
              }}
              className="px-6 py-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-black text-lg rounded-xl border-b-4 border-slate-300 dark:border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </section>
  );
}