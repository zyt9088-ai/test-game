"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function useAdminMessagesNav() {
  const supabase = getSupabaseBrowser();
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
          setMessageCount((prev) => prev + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "contact_messages" },
        () => {
          setMessageCount((prev) => Math.max(0, prev - 1));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { messageCount };
}