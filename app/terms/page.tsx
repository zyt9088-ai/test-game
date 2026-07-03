"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Tajawal } from "next/font/google";
import { ChevronRight, ShieldCheck, Scale, AlertTriangle, HelpCircle } from "lucide-react";
import { TopNav } from "@/components/home/TopNav";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
});

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms");

  const tabs = [
    { id: "terms", label: "شروط الاستخدام", icon: Scale },
    { id: "privacy", label: "سياسة الخصوصية", icon: ShieldCheck },
    { id: "faq", label: "الأسئلة الشائعة", icon: HelpCircle },
  ];

  const content = {
    terms: (
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 border-b-2 border-indigo-100 dark:border-indigo-900/30 pb-4">شروط الاستخدام</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 font-bold text-sm leading-loose">
          <p>
            مرحباً بك في منصة الألعاب التفاعلية الأولى. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل البدء باللعب.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-indigo-600 dark:text-indigo-400 mb-2">1. الحساب الشخصي</h3>
            <ul className="list-disc list-inside space-y-2 marker:text-indigo-400">
              <li>يجب أن تكون المعلومات المقدمة عند التسجيل (الاسم، الجوال، البريد) صحيحة ودقيقة.</li>
              <li>أنت مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بحسابك.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    privacy: (
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 border-b-2 border-emerald-100 dark:border-emerald-900/30 pb-4">سياسة الخصوصية</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 font-bold text-sm leading-loose">
          <p>
            نحن نولي أهمية قصوى لخصوصيتك. هذه السياسة تشرح كيفية جمعنا للبيانات واستخدامها.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-2">حماية البيانات</h3>
            <p>
              جميع بياناتك (كالبريد الإلكتروني ورقم الهاتف) مشفرة ومحفوظة بأعلى معايير الأمان. لن نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية دون موافقتك الصريحة.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-2">البيانات التي نجمعها</h3>
            <ul className="list-disc list-inside space-y-2 marker:text-emerald-400">
              <li>البيانات الأساسية التي تزودنا بها أثناء التسجيل (الاسم، البريد، الجوال).</li>
              <li>إحصائيات اللعب ونتائج المباريات لتحسين نظام التصنيف وعرض الإنجازات.</li>
              <li>سجلات الدخول لتأمين الحساب من الاختراقات.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    faq: (
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 border-b-2 border-amber-100 dark:border-amber-900/30 pb-4">الأسئلة الشائعة</h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 font-bold text-sm leading-loose">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-amber-600 dark:text-amber-400 mb-2">كيف يمكنني إنشاء لعبة في لدن؟</h3>
            <p>أنشئ حساب جديد في المنصة وابدأ اللعب مباشرة وقسم المتواجدين إلى فريقين ثم اختر اسم لكل فريق وبعدها ابدأ اللعبة.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-amber-600 dark:text-amber-400 mb-2">هل يمكن تجربة اللعبة قبل الشراء؟</h3>
            <p>نعم لكل حساب جديد تجربة مرة واحدة لكل لعبة.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-amber-600 dark:text-amber-400 mb-2">هل تتكرر الأسئلة بين الألعاب ؟</h3>
            <p>لكل لعبة أسلوبها الخاص وبنك الأسئلة تتحدث بشكل دوري.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-amber-600 dark:text-amber-400 mb-2">هل يوجد وقت محدد للعبة الواحدة؟</h3>
            <p>تختلف ظروف كل لعبة عن الأخرى حيث أن الهدف من الألعاب هي دمج المتعة والمعرفة مع العائلة أو الأصدقاء أو الزملاء في العمل.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-amber-600 dark:text-amber-400 mb-2">هل المنصة تعمل على الهواتف الذكية؟</h3>
            <p>المنصة متوافقة مع جميع الأجهزة الذكية بحيث توفر تحكم عالي في التنقلات بين الأسئلة والخيارات وصفحات المنصة.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white ${tajawal.className} flex flex-col`} dir="rtl">
      {/* استدعاء نفس الهيدر المستخدم في الصفحة الرئيسية */}
      <TopNav />

      {/* محتوى الصفحة */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 flex flex-col md:flex-row gap-8 mt-24 md:mt-32">
        
        {/* القائمة الجانبية */}
        <div className="w-full md:w-80 shrink-0">
          <div className="sticky top-28 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 flex flex-col gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">مركز السياسات</h1>
            <p className="text-xs font-bold text-slate-500 mb-4">
              اختر القسم المطلوب للاطلاع على التفاصيل.
            </p>
            
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all font-black text-sm text-right ${
                      isActive 
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-800/50" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
              <Link href="/player" className="flex items-center justify-center gap-2 w-full p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black hover:-translate-y-1 transition-transform shadow-md">
                العودة للتسجيل
              </Link>
            </div>
          </div>
        </div>

        {/* مساحة العرض الرئيسية */}
        <div className="flex-grow">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 min-h-[600px] relative overflow-hidden">
            
            {/* زخرفة خفيفة للخلفية */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 animate-fade-in">
              {content[activeTab as keyof typeof content]}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
