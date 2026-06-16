"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Cairo } from "next/font/google";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  Globe,
  MapPin,
  HelpCircle,
  Trash2,
  Check,
  MousePointerClick,
  ArrowRight,
  Target,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

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

export default function WorldDominationAdmin() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [wdActiveSubTab, setWdActiveSubTab] = useState<"map" | "challenges">(
    "map",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [wdCountries, setWdCountries] = useState<any[]>([]);
  const [newWdCountryName, setNewWdCountryName] = useState<string>("");
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [managingQuestionsFor, setManagingQuestionsFor] = useState<
    string | null
  >(null);
  const [newWdQ, setNewWdQ] = useState<string>("");
  const [wdOpt1, setWdOpt1] = useState<string>("");
  const [wdOpt2, setWdOpt2] = useState<string>("");
  const [wdOpt3, setWdOpt3] = useState<string>("");
  const [wdCorrectOpt, setWdCorrectOpt] = useState<number>(1);

  const [wdChallengesDB, setWdChallengesDB] = useState<string[]>([]);
  const [newWdChallenge, setNewWdChallenge] = useState<string>("");

  const formRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("wd_settings").select("*");
        if (data && !error) {
          data.forEach((item) => {
            if (item.id === "admin_wd_countries_db") setWdCountries(item.data);
            if (item.id === "admin_wd_challenges_db") setWdChallengesDB(item.data);
          });
        }
      } catch (e) {
        console.error("Error loading WD data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const saveToSupabase = async (id: string, data: any) => {
    try {
      const { error } = await supabase
        .from("wd_settings")
        .upsert({ id, data, updated_at: new Date().toISOString() });
        
      if (error) {
        console.error("تفاصيل الخطأ من Supabase:", error);
        alert("تعذر الحفظ في قاعدة البيانات ❌: " + error.message);
      } else {
        console.log("تم الحفظ في Supabase بنجاح ✅");
      }
    } catch (err) {
      console.error("خطأ عام:", err);
      alert("مشكلة في الاتصال بالسيرفر!");
    }
  };

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const scrollToQuestions = () => {
    setTimeout(() => {
      questionsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const addWdCountry = async () => {
    if (!selectedGeoId || !newWdCountryName.trim()) {
      alert("الرجاء اختيار دولة من الخريطة وكتابة اسمها أولاً.");
      return;
    }

    if (editingCountryId) {
      const newData = wdCountries.map((c) =>
        c.id === editingCountryId
          ? { ...c, name: newWdCountryName.trim(), geoId: selectedGeoId }
          : c,
      );
      setWdCountries(newData);
      await saveToSupabase("admin_wd_countries_db", newData);
      setEditingCountryId(null);
    } else {
      const newCountry = {
        id: `c_${Date.now()}`,
        geoId: selectedGeoId,
        name: newWdCountryName.trim(),
        value: 0,
        questions: [],
      };
      const newData = [...wdCountries, newCountry];
      setWdCountries(newData);
      await saveToSupabase("admin_wd_countries_db", newData);
      setManagingQuestionsFor(newCountry.id);
      scrollToQuestions();
    }
    setNewWdCountryName("");
    setSelectedGeoId(null);
  };

  const startEditingWdCountry = (c: any) => {
    setEditingCountryId(c.id);
    setNewWdCountryName(c.name);
    setSelectedGeoId(c.geoId);
    scrollToForm();
  };

  const cancelEditWdCountry = () => {
    setEditingCountryId(null);
    setNewWdCountryName("");
    setSelectedGeoId(null);
  };

  const deleteWdCountry = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدولة بالكامل؟")) {
      const newData = wdCountries.filter((c) => c.id !== id);
      setWdCountries(newData);
      await saveToSupabase("admin_wd_countries_db", newData);
      if (editingCountryId === id) cancelEditWdCountry();
      if (managingQuestionsFor === id) setManagingQuestionsFor(null);
    }
  };

  const addWdQuestion = async () => {
    if (
      !newWdQ.trim() ||
      !wdOpt1.trim() ||
      !wdOpt2.trim() ||
      !wdOpt3.trim() ||
      !managingQuestionsFor
    ) {
      alert("الرجاء تعبئة السؤال والخيارات الثلاثة.");
      return;
    }

    const options = [wdOpt1.trim(), wdOpt2.trim(), wdOpt3.trim()];
    const answer = options[wdCorrectOpt - 1];

    const newData = wdCountries.map((c) => {
      if (c.id === managingQuestionsFor) {
        return {
          ...c,
          questions: [
            ...(c.questions || []),
            { q: newWdQ.trim(), options, a: answer },
          ],
        };
      }
      return c;
    });
    setWdCountries(newData);
    await saveToSupabase("admin_wd_countries_db", newData);

    setNewWdQ("");
    setWdOpt1("");
    setWdOpt2("");
    setWdOpt3("");
    setWdCorrectOpt(1);
  };

  const deleteWdQuestion = async (qIndex: number) => {
    const newData = wdCountries.map((c) => {
      if (c.id === managingQuestionsFor) {
        const updatedQ = [...(c.questions || [])];
        updatedQ.splice(qIndex, 1);
        return { ...c, questions: updatedQ };
      }
      return c;
    });
    setWdCountries(newData);
    await saveToSupabase("admin_wd_countries_db", newData);
  };

  const addWdChallenge = async () => {
    if (!newWdChallenge.trim()) return;
    const newData = [...wdChallengesDB, newWdChallenge.trim()];
    setWdChallengesDB(newData);
    await saveToSupabase("admin_wd_challenges_db", newData);
    setNewWdChallenge("");
  };

  const deleteWdChallenge = async (idx: number) => {
    const newData = wdChallengesDB.filter((_, i) => i !== idx);
    setWdChallengesDB(newData);
    await saveToSupabase("admin_wd_challenges_db", newData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-black text-2xl" dir="rtl">
        <Globe className="w-20 h-20 text-blue-500 animate-spin-slow mb-4" />
        <p className="animate-pulse">جاري الاتصال بمركز القيادة...</p>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen relative flex flex-col p-4 md:p-6 w-full ${cairo.className} overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950`}
      dir="rtl"
    >
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">
        <header className="shrink-0 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-4 md:p-5 shadow-sm mb-6 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors duration-300 flex items-center justify-center"
            >
              <ArrowRight size={24} />
            </Link>
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm transition-colors duration-500">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-wide transition-colors duration-500">
                السيطرة على العالم
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs md:text-sm mt-0.5 transition-colors duration-500">
                إدارة الخريطة الميدانية وبنوك التحديات
              </p>
            </div>
          </div>
        </header>

        <section className="flex-1 bg-transparent flex flex-col transition-colors duration-500">
          <div className="flex bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shrink-0 shadow-sm">
            <button
              onClick={() => setWdActiveSubTab("map")}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${wdActiveSubTab === "map" ? "bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <MapPin size={18} /> الخريطة والدول
            </button>
            <button
              onClick={() => setWdActiveSubTab("challenges")}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${wdActiveSubTab === "challenges" ? "bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <HelpCircle size={18} /> بنك تحديات الحكم
            </button>
          </div>

          {wdActiveSubTab === "map" && (
            <div className="flex flex-col gap-8 w-full">
              {/* الخريطة بعرض الشاشة ومفتوحة بحريّة */}
              <div className="w-full bg-[#287cb5] rounded-[3rem] border-4 border-slate-900 overflow-hidden relative shadow-2xl flex items-center justify-center h-[500px]">
                <ComposableMap
                  projectionConfig={{ scale: 160 }}
                  className="w-full h-full"
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                      geographies.map((geo: any) => {
                        const isAdded = wdCountries.find(
                          (c) => c.geoId === geo.id,
                        );
                        const isSelected = selectedGeoId === geo.id;

                        let fillColor = "#f1f5f9";
                        if (isSelected) fillColor = "#facc15";
                        else if (isAdded) fillColor = "#10b981";

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => {
                              setSelectedGeoId(geo.id);
                              setNewWdCountryName(geo.properties.name);
                              scrollToForm();
                            }}
                            style={{
                              default: {
                                fill: fillColor,
                                outline: "none",
                                stroke: "#0f172a",
                                strokeWidth: 0.5,
                              },
                              hover: {
                                fill: "#3b82f6",
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: {
                                fill: "#2563eb",
                                outline: "none",
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
                <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl flex items-center gap-3">
                  <MousePointerClick
                    size={20}
                    className="text-amber-400 animate-pulse"
                  />
                  اضغط على الخريطة لاختيار الدولة مباشرة
                </div>
              </div>

              {/* فورم الإضافة محرر من القيود */}
              <div
                ref={formRef}
                className="w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="flex-1 w-full">
                  <label className="block text-sm font-black text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Globe size={18} />{" "}
                    {editingCountryId
                      ? "تعديل بيانات دولة"
                      : "إضافة دولة جديدة"}
                  </label>
                  <input
                    type="text"
                    value={newWdCountryName}
                    onChange={(e) => setNewWdCountryName(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 outline-none focus:border-blue-500 rounded-2xl dark:text-white text-sm font-bold shadow-inner transition-colors"
                    placeholder="اسم الدولة..."
                  />
                </div>

                <div className="w-full sm:w-1/3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-500 mb-1">
                    المعرف المربوط بالخريطة:
                  </span>
                  <span
                    className={`font-black text-sm ${selectedGeoId ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    {selectedGeoId || "اضغط على الخريطة أولاً"}
                  </span>
                </div>

                <div className="w-full sm:w-1/4 flex flex-col gap-2 shrink-0">
                  {editingCountryId ? (
                    <>
                      <button
                        onClick={addWdCountry}
                        disabled={!selectedGeoId || !newWdCountryName.trim()}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-black rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        حفظ التعديل
                      </button>
                      <button
                        onClick={cancelEditWdCountry}
                        className="w-full py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-sm font-black rounded-2xl transition-all shadow-sm active:scale-95"
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={addWdCountry}
                      disabled={!selectedGeoId || !newWdCountryName.trim()}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white text-sm font-black rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      حفظ وتثبيت الدولة
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center px-2 mt-4">
                <h3 className="font-black dark:text-white text-2xl text-slate-800 flex items-center gap-2">
                  <MapPin className="text-blue-600" /> الدول المضافة للنظام
                </h3>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1.5 rounded-xl text-sm font-black shadow-sm">
                  المجموع: {wdCountries.length}
                </span>
              </div>

              {/* شبكة الدول الحرة الممتدة للأسفل */}
              {wdCountries.length === 0 ? (
                <div className="w-full bg-white dark:bg-slate-900 p-12 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Globe size={64} className="opacity-20" />
                  <p className="font-black text-lg">
                    لا توجد دول مضافة حالياً. اختر من الخريطة وابدأ البناء.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                  {wdCountries.map((c, cIdx) => (
                    <div
                      key={c.id}
                      className={`p-5 rounded-[2rem] border-2 flex flex-col gap-4 transition-all bg-white dark:bg-slate-900 ${managingQuestionsFor === c.id ? "border-purple-500 shadow-lg ring-4 ring-purple-500/20 scale-[1.02]" : "border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md"}`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-slate-400 text-xs font-black">
                            {cIdx + 1}-
                          </span>
                          <span
                            className="font-black text-base dark:text-white truncate"
                            title={c.name}
                          >
                            {c.name}
                          </span>
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                          {c.geoId}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setManagingQuestionsFor(c.id);
                          scrollToQuestions();
                        }}
                        className={`w-full py-2.5 text-xs font-black rounded-xl transition-all shadow-sm border ${managingQuestionsFor === c.id ? "bg-purple-600 text-white border-purple-600" : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-300"}`}
                      >
                        إدارة الأسئلة ({c.questions?.length || 0})
                      </button>

                      <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <button
                          onClick={() => startEditingWdCountry(c)}
                          className="flex-1 text-slate-500 hover:text-amber-600 bg-slate-50 dark:bg-slate-950 py-2 rounded-xl text-[10px] font-black flex justify-center items-center transition-colors"
                        >
                          تعديل الاسم
                        </button>
                        <button
                          onClick={() => deleteWdCountry(c.id)}
                          className="flex-1 text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 dark:bg-rose-500/10 py-2 rounded-xl text-[10px] font-black flex justify-center items-center transition-colors"
                        >
                          حذف الدولة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* بنك الأسئلة المفتوح بحريّة بالأسفل */}
              {managingQuestionsFor && (
                <div
                  ref={questionsRef}
                  className="w-full mt-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 border-purple-400 dark:border-purple-800 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-8 scroll-mt-6"
                >
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 shrink-0">
                    <h3 className="font-black dark:text-white text-3xl flex items-center gap-3 text-purple-600">
                      <HelpCircle size={32} /> بنك أسئلة:{" "}
                      <span className="text-slate-900 dark:text-slate-100 bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5 rounded-2xl">
                        {
                          wdCountries.find((c) => c.id === managingQuestionsFor)
                            ?.name
                        }
                      </span>
                    </h3>
                    <button
                      onClick={() => setManagingQuestionsFor(null)}
                      className="text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 px-6 py-3 rounded-2xl text-sm font-black transition-colors shadow-sm"
                    >
                      إغلاق البنك
                    </button>
                  </div>

                  <div className="flex flex-col gap-6 mb-10 bg-slate-50 dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-inner">
                    <input
                      value={newWdQ}
                      onChange={(e) => setNewWdQ(e.target.value)}
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-base font-black outline-none focus:border-purple-500 dark:text-white shadow-sm"
                      placeholder="اكتب نص السؤال الاستراتيجي هنا..."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        value={wdOpt1}
                        onChange={(e) => setWdOpt1(e.target.value)}
                        className={`p-4 rounded-2xl border outline-none text-sm font-bold transition-all shadow-sm ${wdCorrectOpt === 1 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"}`}
                        placeholder="الخيار الأول"
                      />
                      <input
                        value={wdOpt2}
                        onChange={(e) => setWdOpt2(e.target.value)}
                        className={`p-4 rounded-2xl border outline-none text-sm font-bold transition-all shadow-sm ${wdCorrectOpt === 2 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"}`}
                        placeholder="الخيار الثاني"
                      />
                      <input
                        value={wdOpt3}
                        onChange={(e) => setWdOpt3(e.target.value)}
                        className={`p-4 rounded-2xl border outline-none text-sm font-bold transition-all shadow-sm ${wdCorrectOpt === 3 ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white"}`}
                        placeholder="الخيار الثالث"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 flex-wrap gap-4">
                      <div className="flex bg-slate-200 dark:bg-slate-800 rounded-2xl p-2 gap-2 border dark:border-slate-700">
                        <span className="text-sm font-black text-slate-600 dark:text-slate-300 px-4 flex items-center">
                          تحديد الإجابة الصحيحة:
                        </span>
                        {[1, 2, 3].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setWdCorrectOpt(num)}
                            className={`px-8 py-2 text-sm font-black rounded-xl transition-all ${wdCorrectOpt === num ? "bg-emerald-500 text-white shadow-md scale-105" : "text-slate-500 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950"}`}
                          >
                            الخيار {num}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={addWdQuestion}
                        disabled={
                          !newWdQ.trim() ||
                          !wdOpt1.trim() ||
                          !wdOpt2.trim() ||
                          !wdOpt3.trim()
                        }
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-400 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg text-base active:scale-95"
                      >
                        حفظ السؤال بالدولة
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="font-black text-lg text-slate-700 dark:text-slate-300 mb-2">
                      الأسئلة المسجلة:
                    </h4>
                    {wdCountries.find((x) => x.id === managingQuestionsFor)
                      ?.questions?.length === 0 ? (
                      <div className="text-center text-slate-400 font-bold py-16 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
                        <HelpCircle
                          size={64}
                          className="opacity-30 text-purple-400"
                        />
                        <p className="text-base">
                          لا توجد أسئلة مضافة لهذه الدولة حتى الآن.
                        </p>
                      </div>
                    ) : (
                      wdCountries
                        .find((x) => x.id === managingQuestionsFor)
                        ?.questions?.map((q: any, i: number) => (
                          <div
                            key={i}
                            className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl flex justify-between items-start gap-6 shadow-sm transition-all hover:border-purple-300 dark:hover:border-purple-700"
                          >
                            <span className="text-slate-400 font-black text-lg pt-0.5 w-8 shrink-0">
                              {i + 1}-
                            </span>
                            <div className="flex flex-col gap-4 w-full">
                              <span className="font-black text-lg text-slate-800 dark:text-slate-100 leading-relaxed">
                                {q.q}
                              </span>
                              <div className="flex flex-wrap gap-3">
                                {q.options.map((opt: string, oIdx: number) => (
                                  <span
                                    key={oIdx}
                                    className={`text-sm font-bold px-4 py-2 rounded-xl border shadow-sm ${opt === q.a ? "bg-emerald-100 border-emerald-400 text-emerald-800 dark:bg-emerald-500/20 dark:border-emerald-500/50 dark:text-emerald-300 font-black" : "bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-700"}`}
                                  >
                                    {opt}{" "}
                                    {opt === q.a && (
                                      <Check
                                        size={16}
                                        className="inline ml-1 text-emerald-600 dark:text-emerald-400"
                                      />
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteWdQuestion(i)}
                              className="text-slate-400 hover:text-white hover:bg-rose-500 p-3 bg-white dark:bg-slate-900 rounded-xl transition-colors shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {wdActiveSubTab === "challenges" && (
            <div className="flex flex-col gap-6 w-full animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0 shadow-sm">
                <div className="flex gap-4 w-full flex-1">
                  <input
                    type="text"
                    value={newWdChallenge}
                    onChange={(e) => setNewWdChallenge(e.target.value)}
                    placeholder="أضف تحدي جديد للحكم (سيظهر للجمهور بدون خيارات)..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-purple-500 transition-colors shadow-inner"
                    onKeyDown={(e) => e.key === "Enter" && addWdChallenge()}
                  />
                  <button
                    onClick={addWdChallenge}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-2xl font-black text-sm transition-colors shadow-md active:scale-95"
                  >
                    حفظ التحدي
                  </button>
                </div>
              </div>

              <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
                  <h3 className="font-black dark:text-white text-xl text-purple-600 flex items-center gap-2">
                    <HelpCircle /> بنك تحديات الحكم المسجلة
                  </h3>
                  <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-4 py-1.5 rounded-xl text-sm font-black">
                    {wdChallengesDB.length} تحدي
                  </span>
                </div>

                {wdChallengesDB.length === 0 ? (
                  <div className="text-center text-slate-400 py-16 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
                    <Target size={64} className="opacity-20 text-purple-400" />
                    <p className="font-black text-lg">
                      لا يوجد تحديات مسجلة حالياً في البنك.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {wdChallengesDB.map((challenge, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm gap-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                      >
                        <span className="text-slate-400 font-black text-lg shrink-0 w-8">
                          {idx + 1}-
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 text-base font-bold w-full leading-relaxed">
                          {challenge}
                        </span>
                        <button
                          onClick={() => deleteWdChallenge(idx)}
                          className="text-slate-400 hover:text-white hover:bg-rose-500 bg-white dark:bg-slate-900 p-3 rounded-xl transition-colors shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
