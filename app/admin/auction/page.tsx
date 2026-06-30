"use client";
import React from "react";
import { Cairo } from "next/font/google";
import { Loader2 } from "lucide-react";
import { useAuctionQuestions } from "@/hooks/admin/auction/useAuctionQuestions";
import AuctionHeader from "@/components/admin/auction/AuctionHeader";
import AuctionQuestionForm from "@/components/admin/auction/AuctionQuestionForm";
import AuctionQuestionsList from "@/components/admin/auction/AuctionQuestionsList";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

export default function AuctionAdminPage() {
  const ctx = useAuctionQuestions();

  if (ctx.isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 ${cairo.className}`} dir="rtl">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 ${cairo.className}`} dir="rtl">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <AuctionHeader questionsCount={ctx.questions.length} />
        <AuctionQuestionForm ctx={ctx} />
        <AuctionQuestionsList 
          questions={ctx.questions} 
          handleEdit={ctx.handleEdit} 
          handleDelete={ctx.handleDelete} 
        />
      </div>
    </main>
  );
}