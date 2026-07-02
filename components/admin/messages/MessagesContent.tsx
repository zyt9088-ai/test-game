"use client";
import React from "react";
import { Inbox, User, Calendar, Trash2, Phone, Mail, MessageCircle } from "lucide-react";

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function MessagesContent({ ctx }: { ctx: any }) {
  const { loading, messages, viewMode, deleteMessage, formatDate } = ctx;

  const formatWhatsAppLink = (phone: string) => {
    // إزالة كل الرموز غير الرقمية
    const cleanPhone = phone.replace(/\D/g, '');
    // التأكد من أن الرقم يبدأ بكود السعودية أو إضافة الكود إن لم يكن موجوداً
    // (اغلب الأرقام في السعودية تبدأ ب 05 او 5)
    let waNumber = cleanPhone;
    if (cleanPhone.startsWith('05')) {
      waNumber = '966' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('5') && cleanPhone.length === 9) {
      waNumber = '966' + cleanPhone;
    }
    return `https://wa.me/${waNumber}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
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
          <div key={msg.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 flex flex-col h-full relative overflow-hidden group">
            
            {/* زخرفة خلفية */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -translate-y-16 translate-x-16 z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">{msg.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-0.5">
                      <Calendar size={14} className="text-slate-400" />
                      <span>{formatDate(msg.created_at)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  className="p-2.5 text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 rounded-xl transition-all shadow-sm"
                  title="حذف الرسالة"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-6 bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                {msg.phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                        <Phone size={16} className="text-blue-500" />
                      </div>
                      <span dir="ltr">{msg.phone}</span>
                    </div>
                    
                    <a 
                      href={formatWhatsAppLink(msg.phone)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg text-xs font-black transition-all shadow-sm"
                      title="مراسلة واتساب"
                    >
                      <WhatsAppIcon size={16} />
                      <span className="hidden sm:inline">واتساب</span>
                    </a>
                  </div>
                )}
                {msg.email && (
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                      <Mail size={16} className="text-emerald-500" />
                    </div>
                    <span>{msg.email}</span>
                  </div>
                )}
              </div>

              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <MessageCircle size={18} className="text-indigo-500" />
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">محتوى الرسالة:</span>
                </div>
                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border-2 border-indigo-100/50 dark:border-indigo-900/30 h-full flex-grow">
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-sm leading-loose whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-6 font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">المرسل والتاريخ</th>
              <th className="p-6 font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">بيانات التواصل</th>
              <th className="p-6 font-black text-slate-700 dark:text-slate-300 w-1/2 min-w-[300px]">نص الرسالة</th>
              <th className="p-6 font-black text-slate-700 dark:text-slate-300 text-center whitespace-nowrap">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg: any) => (
              <tr key={msg.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-6 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 dark:text-white text-base">{msg.name}</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-1.5">
                        <Calendar size={12} />
                        {formatDate(msg.created_at)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6 align-top">
                  <div className="flex flex-col gap-3">
                    {msg.phone && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-blue-500">
                          <Phone size={14} />
                        </div>
                        <span dir="ltr" className="text-sm font-bold text-slate-700 dark:text-slate-300">{msg.phone}</span>
                        <a 
                          href={formatWhatsAppLink(msg.phone)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mr-auto flex items-center gap-1 px-2.5 py-1 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg text-xs font-black transition-all"
                          title="مراسلة واتساب"
                        >
                          <WhatsAppIcon size={14} />
                          واتساب
                        </a>
                      </div>
                    )}
                    {msg.email && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-emerald-500">
                          <Mail size={14} />
                        </div>
                        <span className="break-all text-sm font-bold text-slate-700 dark:text-slate-300">{msg.email}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-6 align-top">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </td>
                <td className="p-6 align-middle text-center">
                  <button 
                    onClick={() => deleteMessage(msg.id)}
                    className="p-3 text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 rounded-xl transition-all inline-flex justify-center shadow-sm"
                    title="حذف الرسالة"
                  >
                    <Trash2 size={18} />
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