"use client";
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Globe, MapPin, MousePointerClick, HelpCircle, Check, Trash2, Edit, Plus, FolderPlus, X } from "lucide-react";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function WorldDominationMapTab({ ctx }: { ctx: any }) {
  if (ctx.wdActiveSubTab !== "map") return null;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* الخريطة */}
      <div className="w-full bg-[#287cb5] rounded-[3rem] border-4 border-slate-900 overflow-hidden relative shadow-2xl flex items-center justify-center h-[500px]">
        <ComposableMap projectionConfig={{ scale: 160 }} className="w-full h-full">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo: any) => {
                const isAdded = ctx.wdCountries.find((c: any) => c.geoId === geo.id);
                const isSelected = ctx.selectedGeoId === geo.id;
                let fillColor = "#f1f5f9";
                if (isSelected) fillColor = "#facc15";
                else if (isAdded) fillColor = "#10b981";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      // 1. سحب كود الدولة الرسمي المربوط بالخريطة (geoId)
                      ctx.setSelectedGeoId(geo.id);

                      // 2. سحب اسم الدولة
                      ctx.setNewWdCountryName(geo.properties.name || geo.properties.NAME);

                      // 3. النزول تلقائياً لنموذج الإضافة
                      ctx.scrollToForm();
                    }}
                    style={{
                      default: { fill: fillColor, outline: "none", stroke: "#0f172a", strokeWidth: 0.5 },
                      hover: { fill: "#3b82f6", outline: "none", cursor: "pointer" },
                      pressed: { fill: "#2563eb", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl flex items-center gap-3">
          <MousePointerClick size={20} className="text-amber-400 animate-pulse" />
          اضغط على الخريطة لاختيار الدولة مباشرة
        </div>
      </div>

      {/* نموذج الدولة */}
      <div ref={ctx.formRef} className="w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex-1 w-full">
          <label className="block text-sm font-black text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
            <Globe size={18} /> {ctx.editingCountryId ? "تعديل بيانات دولة" : "إضافة دولة جديدة"}
          </label>
          <input
            type="text"
            value={ctx.newWdCountryName}
            onChange={(e) => ctx.setNewWdCountryName(e.target.value)}
            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 rounded-2xl dark:text-white text-sm font-bold shadow-inner transition-colors"
            placeholder="اسم الدولة..."
          />
        </div>
        <div className="w-full sm:w-1/3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-500 mb-1">المعرف المربوط بالخريطة:</span>
          <span className={`font-black text-sm ${ctx.selectedGeoId ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"}`}>
            {ctx.selectedGeoId || "اضغط على الخريطة أولاً"}
          </span>
        </div>
        <div className="w-full sm:w-1/4 flex flex-col gap-2 shrink-0">
          {ctx.editingCountryId ? (
            <>
              <button onClick={ctx.addWdCountry} disabled={!ctx.selectedGeoId || !ctx.newWdCountryName.trim()} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-black rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-50">حفظ التعديل</button>
              <button onClick={ctx.cancelEditWdCountry} className="w-full py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-black rounded-2xl transition-all shadow-sm active:scale-95">إلغاء</button>
            </>
          ) : (
            <button onClick={ctx.addWdCountry} disabled={!ctx.selectedGeoId || !ctx.newWdCountryName.trim()} className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white text-sm font-black rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50">حفظ وتثبيت الدولة</button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-2 mt-4">
        <h3 className="font-black dark:text-white text-2xl text-slate-800 flex items-center gap-2">
          <MapPin className="text-blue-600" /> الدول المضافة للنظام
        </h3>
        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1.5 rounded-xl text-sm font-black shadow-sm">
          المجموع: {ctx.wdCountries.length}
        </span>
      </div>

      {/* قائمة الدول */}
      {ctx.wdCountries.length === 0 ? (
        <div className="w-full bg-white dark:bg-slate-900 p-12 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-4">
          <Globe size={64} className="opacity-20" />
          <p className="font-black text-lg">لا توجد دول مضافة حالياً. اختر من الخريطة وابدأ البناء.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {ctx.wdCountries.map((c: any, cIdx: number) => (
            <div key={c.id} className={`p-5 rounded-[2rem] border-2 flex flex-col gap-4 transition-all bg-white dark:bg-slate-900 ${ctx.managingQuestionsFor === c.id ? "border-purple-500 shadow-lg ring-4 ring-purple-500/20 scale-[1.02]" : "border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md"}`}>
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-400 text-xs font-black">{cIdx + 1}-</span>
                  <span className="font-black text-base dark:text-white truncate" title={c.name}>{c.name}</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">{c.geoId}</span>
              </div>
              <button
                onClick={() => { ctx.setManagingQuestionsFor(c.id); ctx.scrollToQuestions(); }}
                className={`w-full py-2.5 text-xs font-black rounded-xl transition-all shadow-sm border ${ctx.managingQuestionsFor === c.id ? "bg-purple-600 text-white border-purple-600" : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300"}`}
              >
                إدارة الأسئلة ({c.questions?.length || 0})
              </button>
              <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button onClick={() => ctx.startEditingWdCountry(c)} className="flex-1 text-slate-500 hover:text-amber-600 bg-slate-50 dark:bg-slate-950 py-2 rounded-xl text-[10px] font-black flex justify-center items-center transition-colors">تعديل الاسم</button>
                <button onClick={() => ctx.deleteWdCountry(c.id)} className="flex-1 text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 dark:bg-rose-500/10 py-2 rounded-xl text-[10px] font-black flex justify-center items-center transition-colors">حذف الدولة</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* بنك أسئلة الدولة */}
      {ctx.managingQuestionsFor && (
        <div ref={ctx.questionsRef} className="w-full mt-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 border-purple-400 dark:border-purple-800 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-8 scroll-mt-6">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 shrink-0">
            <h3 className="font-black dark:text-white text-3xl flex items-center gap-3 text-purple-600">
              <HelpCircle size={32} /> بنك أسئلة: <span className="text-slate-900 dark:text-slate-100 bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 rounded-2xl">{ctx.wdCountries.find((c: any) => c.id === ctx.managingQuestionsFor)?.name}</span>
            </h3>
            <button onClick={() => ctx.setManagingQuestionsFor(null)} className="text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 px-6 py-3 rounded-2xl text-sm font-black transition-colors shadow-sm">إغلاق البنك</button>
          </div>

          <div className="flex flex-col gap-6 mb-10 bg-slate-50 dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-inner">
            {/* اختيار فئة السؤال (المجال) */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <span className="text-sm font-black text-slate-700 dark:text-slate-300 shrink-0">فئة السؤال (المجال):</span>
              <div className="flex flex-wrap gap-2 flex-1 items-center">
                {(ctx.allWdCategories || ctx.defaultWdCategories || ["رياضة", "دين", "تاريخ", "علوم", "جغرافيا", "معلومات عامة"]).map((cat: string) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => ctx.setWdCategory(cat)}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all shadow-sm ${
                      ctx.wdCategory === cat
                        ? "bg-purple-600 text-white shadow-purple-500/20 scale-105"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => ctx.openAddCategoryModal(null)}
                  className="px-4 py-2 text-xs font-black rounded-xl text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 transition-all border border-purple-300 dark:border-purple-800 flex items-center gap-1.5"
                >
                  <Plus size={14} /> إضافة فئة جديدة...
                </button>
              </div>
            </div>

            <input value={ctx.newWdQ} onChange={(e) => ctx.setNewWdQ(e.target.value)} className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-base font-black outline-none focus:border-purple-500 dark:text-white shadow-sm" placeholder="اكتب نص السؤال الاستراتيجي هنا..." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={ctx.wdOpt1} onChange={(e) => ctx.setWdOpt1(e.target.value)} className={`p-4 rounded-2xl border outline-none text-sm font-bold transition-all shadow-sm ${ctx.wdCorrectOpt === 1 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"}`} placeholder="الخيار الأول" />
              <input value={ctx.wdOpt2} onChange={(e) => ctx.setWdOpt2(e.target.value)} className={`p-4 rounded-2xl border outline-none text-sm font-bold transition-all shadow-sm ${ctx.wdCorrectOpt === 2 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"}`} placeholder="الخيار الثاني" />
              <input value={ctx.wdOpt3} onChange={(e) => ctx.setWdOpt3(e.target.value)} className={`p-4 rounded-2xl border outline-none text-sm font-bold transition-all shadow-sm ${ctx.wdCorrectOpt === 3 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"}`} placeholder="الخيار الثالث" />
            </div>
            <div className="flex justify-between items-center mt-2 flex-wrap gap-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-2xl p-2 gap-2 border dark:border-slate-700">
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300 px-4 flex items-center">الإجابة الصحيحة:</span>
                  {[1, 2, 3].map((num) => (
                    <button key={num} type="button" onClick={() => ctx.setWdCorrectOpt(num)} className={`px-6 py-2 text-sm font-black rounded-xl transition-all ${ctx.wdCorrectOpt === num ? "bg-emerald-500 text-white shadow-md scale-105" : "text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950"}`}>الخيار {num}</button>
                  ))}
                </div>

                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-2xl p-2 gap-2 border dark:border-slate-700">
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300 px-4 flex items-center">الصعوبة:</span>
                  {(["سهل", "متوسط", "صعب"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => ctx.setWdDifficulty(level)}
                      className={`px-5 py-2 text-sm font-black rounded-xl transition-all ${ctx.wdDifficulty === level
                          ? level === "سهل"
                            ? "bg-emerald-500 text-white shadow-md scale-105"
                            : level === "متوسط"
                              ? "bg-amber-500 text-white shadow-md scale-105"
                              : "bg-rose-500 text-white shadow-md scale-105"
                          : "text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={ctx.addWdQuestion}
                  disabled={!ctx.newWdQ.trim() || !ctx.wdOpt1.trim() || !ctx.wdOpt2.trim() || !ctx.wdOpt3.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-400 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg text-base active:scale-95 flex items-center gap-2"
                >
                  {ctx.editingWdQuestionDbId ? <Edit size={18} /> : null}
                  <span>{ctx.editingWdQuestionDbId ? "حفظ التعديلات" : "حفظ السؤال بالدولة"}</span>
                </button>
                {ctx.editingWdQuestionDbId && (
                  <button
                    onClick={ctx.cancelEditWdQuestion}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-black px-6 py-4 rounded-2xl transition-all text-base"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-black text-lg text-slate-700 dark:text-slate-300 mb-2">الأسئلة المسجلة:</h4>
            {ctx.wdCountries.find((x: any) => x.id === ctx.managingQuestionsFor)?.questions?.length === 0 ? (
              <div className="text-center text-slate-400 font-bold py-16 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
                <HelpCircle size={64} className="opacity-30 text-purple-400" />
                <p className="text-base">لا توجد أسئلة مضافة لهذه الدولة حتى الآن.</p>
              </div>
            ) : (
              ctx.wdCountries.find((x: any) => x.id === ctx.managingQuestionsFor)?.questions?.map((q: any, i: number) => (
                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col gap-4 shadow-sm transition-all hover:border-purple-300 dark:hover:border-purple-700">
                  
                  {/* 1. السطر الأول: الفئات فوق السؤال + خيار إضافة فئة جديدة + أزرار التعديل والحذف */}
                  <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200/80 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400">فئة السؤال (المجال):</span>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {(ctx.allWdCategories || ctx.defaultWdCategories || ["رياضة", "دين", "تاريخ", "علوم", "جغرافيا", "معلومات عامة"]).map((cat: string) => {
                          const isSelected = (q.category || "معلومات عامة") === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => ctx.updateWdQuestionCategory(q.dbId, cat)}
                              className={`px-3 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-105"
                                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:border-purple-300 border border-slate-200 dark:border-slate-800"
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                        {/* خيار إضافة فئة جديدة بدلا من prompt */}
                        <button
                          type="button"
                          onClick={() => ctx.openAddCategoryModal(q.dbId)}
                          className="px-3 py-1 text-xs font-black rounded-xl text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 transition-all border border-purple-300 dark:border-purple-800 flex items-center gap-1"
                        >
                          <Plus size={12} /> إضافة فئة جديدة...
                        </button>
                      </div>
                    </div>

                    {/* أزرار تعديل السؤال وحذفه */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => ctx.startEditingWdQuestion(q)}
                        className="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-colors border border-blue-200 dark:border-blue-800 shadow-sm flex items-center gap-1.5 text-xs font-black"
                        title="تعديل السؤال والخيارات"
                      >
                        <Edit size={15} />
                        <span>تعديل السؤال</span>
                      </button>
                      <button
                        onClick={() => ctx.deleteWdQuestion(i)}
                        className="p-2.5 bg-rose-100 hover:bg-rose-500 hover:text-white dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl transition-colors border border-rose-200 dark:border-rose-800 shadow-sm"
                        title="حذف السؤال"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* 2. السطر الثاني: نص السؤال */}
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 font-black text-lg pt-0.5 shrink-0">{i + 1}-</span>
                    <span className="font-black text-xl text-slate-900 dark:text-slate-100 leading-relaxed">{q.q}</span>
                  </div>

                  {/* 3. السطر الثالث: خيارات الإجابات */}
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-bold text-slate-400">انقر لتحديد الإجابة الصحيحة:</span>
                    {q.options.map((opt: string, oIdx: number) => {
                      const isCorrect = opt === q.a;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => ctx.updateWdQuestionAnswer(q.dbId, opt)}
                          title="انقر لتحديد هذا الخيار كإجابة صحيحة"
                          className={`text-sm font-bold px-4 py-2 rounded-xl border shadow-sm transition-all cursor-pointer ${
                            isCorrect
                              ? "bg-emerald-500 border-emerald-600 text-white font-black ring-2 ring-emerald-500/30 scale-105"
                              : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 hover:border-emerald-400"
                          }`}
                        >
                          {opt} {isCorrect && <Check size={16} className="inline ml-1 text-white" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* 4. السطر الرابع: خيارات مستوى الصعوبة تحت الإجابات */}
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
                    <span className="text-xs font-black text-slate-500 px-2">مستوى الصعوبة:</span>
                    {(["سهل", "متوسط", "صعب"] as const).map((level) => {
                      const active = (q.difficulty || "متوسط") === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => ctx.updateWdQuestionDifficulty(q.dbId, level)}
                          className={`px-4 py-1.5 text-xs font-black rounded-xl transition-all ${
                            active
                              ? level === "سهل"
                                ? "bg-emerald-500 text-white shadow-sm scale-105"
                                : level === "متوسط"
                                ? "bg-amber-500 text-white shadow-sm scale-105"
                                : "bg-rose-500 text-white shadow-sm scale-105"
                              : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* نافذة منبثقة احترافية لإضافة فئة جديدة */}
      {ctx.isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="bg-white dark:bg-slate-900 border-2 border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                  <FolderPlus size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">إضافة فئة جديدة</h3>
                  <p className="text-xs font-bold text-slate-400">ستضاف الفئة لقائمة الخيارات الدائمة فوراً</p>
                </div>
              </div>
              <button
                onClick={ctx.closeAddCategoryModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">اسم الفئة الجديدة:</label>
              <input
                autoFocus
                type="text"
                value={ctx.newCategoryModalInput}
                onChange={(e) => ctx.setNewCategoryModalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") ctx.handleAddNewWdCategory(ctx.newCategoryModalInput);
                }}
                placeholder="اكتب اسم الفئة هنا (مثال: سينما، تكنولوجيا)..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-black outline-none focus:border-purple-500 dark:text-white shadow-inner"
              />

              {/* فئات مقترحة بنقرة واحدة */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[11px] font-bold text-slate-400 w-full mb-1">اقتراحات سريعة بنقرة واحدة:</span>
                {["تكنولوجيا", "سينما", "رياضة إلكترونية", "أدب وفنون", "اقتصاد", "سياسة", "سيارات"].map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => ctx.setNewCategoryModalInput(sugg)}
                    className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={!ctx.newCategoryModalInput.trim()}
                onClick={() => ctx.handleAddNewWdCategory(ctx.newCategoryModalInput)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-400 text-white font-black py-3.5 px-4 rounded-2xl transition-all shadow-lg text-sm active:scale-95"
              >
                حفظ وإضافة للقائمة
              </button>
              <button
                onClick={ctx.closeAddCategoryModal}
                className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-sm hover:bg-slate-200"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}