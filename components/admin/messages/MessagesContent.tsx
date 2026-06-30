"use client";
import React from "react";
import { Inbox, User, Calendar, Trash2, Phone, Mail, MessageCircle } from "lucide-react";

export default function MessagesContent({ ctx }: { ctx: any }) {
  const { loading, messages, viewMode, deleteMessage, formatDate } = ctx;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-700 p-20 flex flex-col items-center justify-center text-center">
        <Inbox size={64} className="text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-black text-slate-500 dark:text-slate-400">الصندوق فاضي</h3>
        <p className="text-slate-400 font-bold mt-2">ما فيه أي رسائل جديدة حتى الآن.</p>
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.map((msg: any) => (
          <div key={msg.id} className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700 p-6 transition-all hover:-translate-y-1 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">{msg.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Calendar size={12} />
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteMessage(msg.id)}
                className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 rounded-xl transition-colors"
                title="حذف الرسالة"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
              {msg.phone && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <Phone size={16} className="text-blue-500" />
                  <span dir="ltr">{msg.phone}</span>
                </div>
              )}
              {msg.email && (
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <Mail size={16} className="text-emerald-500" />
                  <span>{msg.email}</span>
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={16} className="text-purple-500" />
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">نص الرسالة:</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-bold text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 h-full">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border-b-4 border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b-2 border-slate-100 dark:border-slate-700">
            <tr>
              <th className="p-5 font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">المرسل</th>
              <th className="p-5 font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">بيانات التواصل</th>
              <th className="p-5 font-black text-slate-600 dark:text-slate-300 w-1/2 min-w-[300px]">نص الرسالة</th>
              <th className="p-5 font-black text-slate-600 dark:text-slate-300 whitespace-nowrap">التاريخ</th>
              <th className="p-5 font-black text-slate-600 dark:text-slate-300 text-center whitespace-nowrap">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg: any) => (
              <tr key={msg.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-5 align-top">
                  <div className="font-black text-slate-900 dark:text-white">{msg.name}</div>
                </td>
                <td className="p-5 align-top">
                  <div className="flex flex-col gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                    {msg.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="text-blue-500 shrink-0" />
                        <span dir="ltr">{msg.phone}</span>
                      </div>
                    )}
                    {msg.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-emerald-500 shrink-0" />
                        <span className="break-all">{msg.email}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-5 align-top">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </td>
                <td className="p-5 align-top">
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </div>
                </td>
                <td className="p-5 align-top text-center">
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="p-2.5 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 rounded-xl transition-colors inline-flex justify-center"
                    title="حذف الرسالة"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}