"use client";

import React from "react";
import { Tajawal } from "next/font/google";

import { useAdminMessages } from "@/hooks/admin/messages/useAdminMessages";
import MessagesHeader from "@/components/admin/messages/MessagesHeader";
import MessagesContent from "@/components/admin/messages/MessagesContent";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
});

export default function AdminMessagesPage() {
  const ctx = useAdminMessages();

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 ${tajawal.className}`} dir="rtl">
      <div className="max-w-6xl mx-auto">
        <MessagesHeader ctx={ctx} />
        <MessagesContent ctx={ctx} />
      </div>
    </div>
  );
}