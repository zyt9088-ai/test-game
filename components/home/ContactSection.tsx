"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { submitContactMessage } from "@/actions/contact";
import { toast } from "sonner";

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);
    
    if (result.success) {
      toast.success(result.message);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="contact-section" className="max-w-7xl mx-auto w-full px-4 py-16 relative z-10 pt-16 md:pt-20">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 text-slate-900 dark:text-white">عندك فكرة ألعاب ؟</h2>
        <p className="text-lg md:text-xl font-bold text-slate-500 dark:text-slate-400">شاركنا فكرة اللعبة ونصممها لك</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-900 p-5 md:p-6 flex items-center gap-4 md:gap-5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 group-hover:scale-110 transition-transform duration-500 z-0"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 relative z-10 border-b-4 border-blue-200 dark:border-slate-900">
              <Mail size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mb-1">البريد الإلكتروني</p>
              <p className="text-slate-900 dark:text-white font-black text-lg md:text-xl" dir="ltr">contact@ludn.sa</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-900 p-5 md:p-6 flex items-center gap-4 md:gap-5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-emerald-600/5 group-hover:scale-110 transition-transform duration-500 z-0"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 relative z-10 border-b-4 border-emerald-200 dark:border-slate-900">
              <Phone size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mb-1">رقم الجوال</p>
              <p className="text-slate-900 dark:text-white font-black text-lg md:text-xl" dir="ltr">055 101 4446</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-900 p-5 md:p-6 flex items-center gap-4 md:gap-5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-purple-600/5 group-hover:scale-110 transition-transform duration-500 z-0"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 relative z-10 border-b-4 border-purple-200 dark:border-slate-900">
              <MapPin size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mb-1">الموقع</p>
              <p className="text-slate-900 dark:text-white font-black text-lg md:text-xl">المملكة العربية السعودية</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-[2rem] border-b-8 border-slate-200 dark:border-slate-900 p-6 md:p-10">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 flex items-center gap-3">
            <Send size={28} className="text-blue-500 md:w-8 md:h-8" /> أرسل رسالة
          </h3>
          <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">الاسم الكامل</label>
                <input name="name" type="text" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 md:p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors text-sm md:text-base" placeholder="اسمك..." required />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">رقم الجوال</label>
                <input name="phone" type="tel" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 md:p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors text-sm md:text-base" placeholder="05x xxx xxxx" required />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">البريد الإلكتروني</label>
              <input name="email" type="email" className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 md:p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors text-sm md:text-base" placeholder="example@email.com" required />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 flex justify-between">
                <span>الرسالة</span>
              </label>
              <textarea name="message" rows={4} maxLength={200} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 md:p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-blue-500 transition-colors resize-none text-sm md:text-base" placeholder="كيف نخدمك؟ (الحد الأقصى 200 حرف)" required></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full mt-2 md:mt-4 py-4 md:py-5 bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-500 text-white font-black text-xl md:text-2xl rounded-2xl transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
