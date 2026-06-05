'use client';

import { MessageCircle, Instagram, Linkedin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t bg-white/40 border-slate-200/50 dark:bg-[#05050A]/80 dark:border-white/5 pt-16 pb-12 mt-auto overflow-hidden backdrop-blur-2xl transition-all duration-500 shadow-sm dark:shadow-none" dir="rtl">
      
      {/* إضاءة خفيفة (Glow) في أعلى الفوتر - تم التعديل للون الزمردي */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 h-[2px] bg-linear-to-r from-transparent via-emerald-500/30 dark:via-emerald-400/20 to-transparent blur-md transition-colors duration-500"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-right gap-4">
          <img 
            src="https://ludn.sa/full_logo.svg?dpl=dpl_9jc3BNjB3uY2VzRn5kQd3MZSNLaW" 
            alt="لدن التقنية" 
            className="h-14 md:h-16 object-contain drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] dark:brightness-0 dark:invert transition-all duration-500"
          />
          <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-400 leading-[1.8] mt-2 transition-colors duration-500">
            شريكك التقني لتطوير مواقع وتطبيقات حديثة<br />
            تلبي طموحاتك وتعزز نجاحك في العالم الرقمي.
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <a 
            href="https://qr.saudibusiness.gov.sa/viewcr?nCrNumber=B0Bed+yo7rKQjQaJ7XABEQ==" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex flex-col items-center gap-2"
            title="التحقق من ترخيص المركز السعودي للأعمال"
          >
            <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">الترخيص المعتمد</span>
            {/* بطاقة المركز السعودي للأعمال - زجاجية مع توهج نيون */}
            <div className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-sm group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:border-emerald-500/50 dark:group-hover:border-emerald-400/50 transition-all active:scale-95 cursor-pointer duration-500 backdrop-blur-xl">
              <ShieldCheck className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" size={28} />
              <span className="text-slate-800 dark:text-white font-black text-sm transition-colors">المركز السعودي للأعمال</span>
            </div>
          </a>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-4">
          <a href="https://x.com/LudnSA" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] duration-500 backdrop-blur-xl active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/ludn_sa/" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-pink-600 dark:hover:text-pink-400 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(219,39,119,0.3)] duration-500 backdrop-blur-xl active:scale-95">
            <Instagram size={22} className="group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a href="https://www.linkedin.com/in/ludnsa/" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] duration-500 backdrop-blur-xl active:scale-95">
            <Linkedin size={22} className="group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a href="https://wa.me/966543611229" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 hover:text-green-600 dark:hover:text-green-400 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] duration-500 backdrop-blur-xl active:scale-95">
            <MessageCircle size={22} className="group-hover:scale-110 transition-transform duration-300" />
          </a>
        </div>
        
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-200/50 dark:border-white/5 flex justify-center transition-colors duration-500">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors duration-500 text-center">
          2026 لدن التقنية - جميع الحقوق محفوظة ©
        </p>
      </div>

    </footer>
  );
}