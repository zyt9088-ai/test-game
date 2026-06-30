"use client";
import React from "react";
import Link from "next/link";
import { Bell, Inbox } from "lucide-react";
import { useAdminMessagesNav } from "@/hooks/useAdminMessagesNav";

export default function AdminMessagesNavigation() {
  const { messageCount } = useAdminMessagesNav();

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