"use client";
import { useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

const supabase = getSupabaseBrowser();

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      setMessage("الرجاء كتابة كلمة مرور جديدة لا تقل عن 6 خانات");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("كلمة المرور وتأكيد كلمة المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage(`خطأ: ${error.message}`);
      } else {
        setMessage("تم تحديث كلمة المرور بنجاح! جاري تحويلك للموقع...");
        
        // التحقق من الصلاحية لمعرفة إلى أين نوجهه
        const { data: { user } } = await supabase.auth.getUser();
        let redirectUrl = "/";
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profile?.role === 'Admin') {
            redirectUrl = "/admin";
          }
        }

        setTimeout(() => {
          router.push(redirectUrl);
        }, 2000);
      }
    } catch (err) {
      setMessage("حدث خطأ غير متوقع أثناء التحديث.");
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 py-12 ${cairo.className}`}
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            تعيين كلمة مرور جديدة
          </h1>
          <p className="text-sm font-bold text-slate-500">
            المركز الأمني لمنصة الألعاب
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">
              كلمة المرور الجديدة:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 border-2 border-transparent bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-900 dark:text-white text-left font-sans focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all focus:bg-white dark:focus:bg-slate-900 shadow-sm"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-black text-slate-700 dark:text-slate-300">
              تأكيد كلمة المرور:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 border-2 border-transparent bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-900 dark:text-white text-left font-sans focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all focus:bg-white dark:focus:bg-slate-900 shadow-sm"
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleUpdatePassword}
            className="w-full bg-gradient-to-l from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
            disabled={loading}
          >
            {loading ? "جاري التحديث..." : "حفظ والدخول للموقع"}
          </button>

          {message && (
            <div
              className={`p-4 rounded-2xl text-center text-sm font-bold border transition-all mt-4 ${message.includes("خطأ") ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"}`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
