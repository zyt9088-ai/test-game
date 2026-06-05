"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Cairo } from "next/font/google";
import {
  Database,
  FolderTree,
  Swords,
  Globe,
  Download,
  Upload,
} from "lucide-react";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(
        (window.innerWidth * window.innerHeight) / 15000,
      );
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains("dark");
      const particleColor = isDark
        ? "rgba(148, 163, 184, 0.3)"
        : "rgba(100, 116, 139, 0.2)";

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
};

export default function AdminDashboardMain() {
  const handleExportBackup = () => {
    const keysToBackup = [
      "admin_wd_countries_db",
      "admin_wd_challenges_db",
      "admin_cw_30sec_db",
      "admin_cw_5sec_db",
      "admin_cw_team_db",
      "admin_cw_general_db",
      "admin_cw_castle1_img",
      "admin_cw_castle2_img",
      "castleRoomPositions",
      "admin_cw_instructions",
      "admin_cw_tour_texts",
    ];
    const backupData: any = {};
    keysToBackup.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) backupData[key] = data;
    });

    const blob = new Blob([JSON.stringify(backupData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gamemaster_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, data[key]);
        });
        alert(
          "تم استعادة النسخة الاحتياطية بنجاح! تم تحديث البيانات في النظام.",
        );
      } catch (error) {
        alert("الملف غير صالح أو تالف! يرجى اختيار ملف نسخة احتياطية صحيح.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <main
      className={`min-h-screen relative flex flex-col p-4 md:p-6 w-full ${cairo.className} overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950`}
      dir="rtl"
    >
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        <header className="shrink-0 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 md:p-5 shadow-sm mb-4 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm transition-colors duration-500">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-wide transition-colors duration-500">
                لوحة التحكم المركزية
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-0.5 transition-colors duration-500">
                إدارة الإعدادات وبنك المعلومات لجميع الألعاب
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800/50 transition-colors duration-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-colors duration-500">
              Local Storage Active
            </span>
          </div>
        </header>

        <section className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-6 shadow-sm flex flex-col items-center justify-center text-center transition-colors duration-500">
          <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <FolderTree
              size={72}
              className="text-indigo-500 dark:text-indigo-400 mb-6 transition-colors duration-500 opacity-80"
            />
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 transition-colors duration-500">
              مرحباً بك، مدير النظام
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-base mb-10 max-w-2xl leading-relaxed transition-colors duration-500">
              اختر اللعبة من الأسفل للبدء بتخصيص الإعدادات وبنوك الأسئلة الخاصة
              بها، أو قم بإدارة النسخ الاحتياطي للنظام.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
              {/* بطاقة السيطرة على العالم */}
              <Link href="/admin/world-domination" className="group">
                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center transition-all duration-300 hover:border-blue-500 hover:shadow-lg dark:hover:bg-slate-800">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    السيطرة على العالم
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                    إدارة الخريطة، الدول، وتحديات الحكم
                  </p>
                </div>
              </Link>

              {/* بطاقة حرب القلاع */}
              <Link href="/admin/castle-war" className="group">
                <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center transition-all duration-300 hover:border-rose-500 hover:shadow-lg dark:hover:bg-slate-800">
                  <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Swords size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    حرب القلاع
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                    إدارة الأسئلة، التحديات، وصور القلاع
                  </p>
                </div>
              </Link>
            </div>

            {/* قسم النسخ الاحتياطي */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 w-full max-w-xl transition-colors duration-500 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 transition-colors duration-500">
                النسخ الاحتياطي للنظام
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5 transition-colors duration-500">
                لأن البيانات مخزنة محلياً، ننصحك بأخذ نسخة احتياطية دورية لحفظ
                عملك.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleExportBackup}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Download size={18} /> حفظ نسخة احتياطية
                </button>

                <label className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95">
                  <Upload size={18} /> استعادة من ملف
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
