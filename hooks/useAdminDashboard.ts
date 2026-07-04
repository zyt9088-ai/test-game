"use client";

import { useState, useEffect, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAdminDashboard() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [wdStats, setWdStats] = useState<{
    countries: number;
    questions: number;
    challenges: number;
    countryDetails: { name: string; qCount: number }[];
  }>({ countries: 0, questions: 0, challenges: 0, countryDetails: [] });
  
  const [cwStats, setCwStats] = useState({
    q30: 0, q5: 0, team: 0, general: 0,
  });
  
  const [awStats, setAwStats] = useState({
    questions: 0,
  });

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/login");
      } else {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, [supabase, router]);

  useEffect(() => {
    if (isAuthChecking) return;

    const resetTimer = () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(() => {
        handleLogout();
      }, 900000); // 15 دقيقة
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => document.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      events.forEach((event) => document.removeEventListener(event, handleActivity));
    };
  }, [isAuthChecking]);

  useEffect(() => {
    if (isAuthChecking) return;

    const fetchWDStats = async () => {
      try {
        const { count: countriesCount } = await supabase.from("wd_countries").select("*", { count: 'exact', head: true });
        const { count: questionsCount } = await supabase.from("wd_country_questions").select("*", { count: 'exact', head: true });
        const { count: challengesCount } = await supabase.from("wd_challenges").select("*", { count: 'exact', head: true });

        // للتبسيط في لوحة التحكم، سنحسب الإجماليات فقط
        setWdStats({ 
          countries: countriesCount || 0, 
          questions: questionsCount || 0, 
          challenges: challengesCount || 0, 
          countryDetails: [] 
        });
      } catch (error) {
        console.error("Error fetching WD stats", error);
      }
    };

    const fetchCWStats = async () => {
      try {
        const { data } = await supabase.from("cw_questions").select("category");
        if (data) {
          let q30 = 0, q5 = 0, team = 0, general = 0;
          data.forEach(q => {
            if (q.category === '30sec') q30++;
            if (q.category === '5sec') q5++;
            if (q.category === 'team') team++;
            if (q.category === 'general') general++;
          });
          setCwStats({ q30, q5, team, general });
        }
      } catch (error) {
        console.error("Error fetching CW stats", error);
      }
    };

    const fetchAWStats = async () => {
      try {
        const { count: questions } = await supabase.from("aw_questions").select("*", { count: 'exact', head: true });
        setAwStats({ questions: questions || 0 });
      } catch (error) {
        console.error("Error fetching AW stats", error);
      }
    };

    fetchWDStats();
    fetchCWStats();
    fetchAWStats();
  }, [isAuthChecking, supabase]);

  const handleExportBackup = () => {
    const keysToBackup = [
      "admin_wd_countries_db", "admin_wd_challenges_db",
      "admin_cw_30sec_db", "admin_cw_5sec_db", "admin_cw_team_db", "admin_cw_general_db",
      "admin_aw_questions_db",
    ];
    const backupData: any = {};
    keysToBackup.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) backupData[key] = data;
    });

    const blob = new Blob([JSON.stringify(backupData)], { type: "application/json" });
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
    reader.onload = async (event) => {
      try {
        const fileData = JSON.parse(event.target?.result as string);
        
        // التحقق الأمني من بنية الملف
        if (typeof fileData !== "object" || fileData === null || Array.isArray(fileData)) {
          throw new Error("بنية الملف غير صالحة");
        }

        for (const key of Object.keys(fileData)) {
          // قبول مفاتيح الإعدادات المعتمدة فقط
          if (!key.startsWith("wd_") && !key.startsWith("cw_") && !key.startsWith("aw_")) {
            continue;
          }

          const stringValue = fileData[key];
          if (typeof stringValue !== "string") continue; // حماية إضافية للنوع

          localStorage.setItem(key, stringValue);

          let parsedValue;
          try { parsedValue = JSON.parse(stringValue); } 
          catch (err) { parsedValue = stringValue; }

          const tableName = key.startsWith("wd_") ? "wd_settings" : key.startsWith("cw_") ? "cw_settings" : "aw_settings";
          
          await supabase.from(tableName).upsert({
            id: key, data: parsedValue, updated_at: new Date().toISOString(),
          });
        }
        toast.success("تم استعادة النسخة الاحتياطية ورفعها للسيرفر بنجاح! ✅");
        window.location.reload();
      } catch (error) {
        console.error("خطأ في الرفع للسيرفر:", error);
        toast.error("الملف غير صالح أو حدث خطأ أثناء الاتصال بقاعدة البيانات!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return {
    isAuthChecking, wdStats, cwStats, awStats,
    handleLogout, handleExportBackup, handleImportBackup
  };
}