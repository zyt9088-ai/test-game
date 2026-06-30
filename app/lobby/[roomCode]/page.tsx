'use client';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomCode = params.roomCode;
  const isHost = searchParams.get('host') === 'true';

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      
      {/* بطاقة الغرفة (بديل الـ Card) */}
      <div className="max-w-md w-full shadow-2xl bg-white/95 backdrop-blur text-center rounded-2xl p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-indigo-900 mb-2">غرفة الانتظار</h1>
          <p className="text-lg text-slate-600 font-bold">
            {isHost ? 'شارك هذا الكود مع اللاعبين للانضمام' : 'أنت الآن في الغرفة، بانتظار الباقين'}
          </p>
        </div>

        <div className="space-y-6">
          {/* كود الغرفة */}
          <div className="bg-slate-100 p-6 rounded-lg border-2 border-dashed border-indigo-300">
            <span className="text-5xl font-black text-indigo-700 tracking-[0.2em] uppercase">
              {roomCode}
            </span>
          </div>

          {/* حالة المضيف أو اللاعب */}
          {isHost ? (
            <div className="space-y-4">
              <p className="text-slate-600 font-bold">أنت المضيف. بانتظار انضمام اللاعبين...</p>
              <button 
                onClick={() => router.push(`/game/${roomCode}?host=true`)} 
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-black h-14 rounded-xl transition-all shadow-lg active:scale-95"
              >
                بدء اللعبة (الرجل المشنوق)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-2">
                <span className="animate-bounce w-3 h-3 bg-indigo-600 rounded-full"></span>
                <span className="animate-bounce w-3 h-3 bg-indigo-600 rounded-full" style={{ animationDelay: '0.1s' }}></span>
                <span className="animate-bounce w-3 h-3 bg-indigo-600 rounded-full" style={{ animationDelay: '0.2s' }}></span>
              </div>
              <p className="text-slate-600 font-bold">في انتظار المضيف لبدء اللعبة...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}