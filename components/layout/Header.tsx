'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme_preference', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme_preference', 'dark');
      setIsDark(true);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      e.preventDefault();
      router.push(`/#${targetId}`);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/50 dark:border-white/5 bg-white/40 dark:bg-[#05050A]/80 backdrop-blur-2xl transition-all duration-500 shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 h-20 md:h-24 flex items-center justify-between" dir="rtl">
        
        <Link href="/" className="group flex items-center gap-3 transition-transform duration-500 hover:scale-105 active:scale-95">
          <img 
            src="https://ludn.sa/full_logo.svg?dpl=dpl_9jc3BNjB3uY2VzRn5kQd3MZSNLaW" 
            alt="لدن التقنية" 
            className="h-14 md:h-16 lg:h-[4.5rem] object-contain transition-all duration-500 dark:brightness-0 dark:invert drop-shadow-sm" 
          />
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          
          <nav className="hidden md:flex items-center gap-8 font-black text-slate-700 dark:text-slate-200 transition-colors duration-500">
            <Link href="/" className="relative group py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">
              الرئيسية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            {/* تم إزالة رابط أعمالنا حسب الطلب */}
            <a href="/#contact-section" onClick={(e) => handleNavClick(e, 'contact-section')} className="relative group py-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300">
              اتصل بنا
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </a>
          </nav>

          <div className="w-px h-8 bg-slate-300/50 dark:bg-white/10 hidden md:block transition-colors duration-500"></div>

          <button 
            onClick={toggleTheme} 
            className="group relative p-2.5 md:p-3 rounded-full border border-white/60 dark:border-white/10 text-slate-600 dark:text-amber-400 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-500 shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95 flex items-center justify-center backdrop-blur-md overflow-hidden"
            title={isDark ? "الانتقال للوضع النهاري" : "الانتقال للوضع الليلي"}
          >
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/60 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            {isDark ? <Sun size={22} className="animate-spin-slow relative z-10" /> : <Moon size={22} className="animate-wiggle relative z-10" />}
          </button>

        </div>

      </div>
    </header>
  );
}