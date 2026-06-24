import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Bell, Inbox } from "lucide-react";

export default function AdminMessagesNavigation() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    // دالة تجلب عدد الرسائل الحالية
    const fetchMessagesCount = async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });
        
      if (!error && count !== null) {
        setMessageCount(count);
      }
    };

    fetchMessagesCount();

    // تفعيل الاستماع اللحظي (Real-time) لأي رسالة جديدة توصل
    const channel = supabase
      .channel("messages_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        () => {
          // تحديث العداد لما توصل رسالة جديدة
          setMessageCount((prev) => prev + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "contact_messages" },
        () => {
          // تحديث العداد لما تحذف رسالة
          setMessageCount((prev) => Math.max(0, prev - 1));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* أيقونة الإشعارات (الجرس) */}
      <Link
        href="/admin/messages"
        className="relative flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 border-b-4 border-slate-200 dark:border-slate-700 rounded-xl hover:-translate-y-1 transition-all active:border-b-0 active:translate-y-0 shadow-sm"
        title="الإشعارات"
      >
        <Bell className="text-slate-600 dark:text-slate-300" size={24} />
        {messageCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-rose-500 text-white text-xs font-black rounded-full animate-bounce shadow-md">
            {messageCount}
          </span>
        )}
      </Link>

      {/* زر صندوق الوارد */}
      <Link
        href="/admin/messages"
        className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-500 text-white rounded-xl font-black transition-all active:border-b-0 active:translate-y-1 shadow-sm"
      >
        <Inbox size={20} />
        <span className="hidden sm:inline">صندوق الوارد</span>
      </Link>
    </div>
  );
}