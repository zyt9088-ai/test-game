"use client";
import React, { useState, useEffect } from "react";
import { Activity, Server } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ServerStatusButton() {
  const [status, setStatus] = useState<"excellent" | "good" | "weak" | "checking">("checking");
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const checkLatency = async () => {
      try {
        const start = performance.now();
        // A simple query to measure response time
        const { error } = await supabase.from("profiles").select("id").limit(1);
        const end = performance.now();
        const duration = end - start;

        if (!mounted) return;

        setLatency(Math.round(duration));

        if (error) {
          setStatus("weak");
        } else if (duration < 200) {
          setStatus("excellent");
        } else if (duration < 500) {
          setStatus("good");
        } else {
          setStatus("weak");
        }
      } catch (err) {
        if (mounted) setStatus("weak");
      }
    };

    checkLatency();
    const interval = setInterval(checkLatency, 10000); // Check every 10 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case "excellent":
        return { label: "ممتاز", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/20", icon: Activity };
      case "good":
        return { label: "جيد جداً", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-500/20", icon: Activity };
      case "weak":
        return { label: "ضعيف", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/20", icon: Activity };
      default:
        return { label: "جاري الفحص", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800", icon: Server };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.color} border border-transparent hover:border-current transition-colors text-xs font-bold cursor-help`}
      title={status !== "checking" ? `سرعة الاستجابة: ${latency}ms` : "جاري قياس سرعة الاتصال..."}
    >
      <Icon size={14} className={status !== "checking" ? "animate-pulse" : "animate-spin"} />
      <span className="hidden sm:inline">حالة السيرفر:</span>
      <span>{config.label}</span>
    </div>
  );
}
