'use client';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LobbyPage() {
    const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // استخراج كود الغرفة ومعرفة إذا المستخدم هو المضيف
  const roomCode = params.roomCode;
  const isHost = searchParams.get('host') === 'true';

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-none bg-white/95 backdrop-blur text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-indigo-900">غرفة الانتظار</CardTitle>
          <CardDescription className="text-lg">
            {isHost ? 'شارك هذا الكود مع اللاعبين للانضمام' : 'أنت الآن في الغرفة، بانتظار الباقين'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* عرض كود الغرفة */}
          <div className="bg-slate-100 p-6 rounded-lg border-2 border-dashed border-indigo-300">
            <span className="text-5xl font-black text-indigo-700 tracking-[0.2em] uppercase">
              {roomCode}
            </span>
          </div>

          {/* تغيير الواجهة بناءً على صلاحية المستخدم */}
          {isHost ? (
            <div className="space-y-4">
              <p className="text-slate-600 font-medium">أنت المضيف. بانتظار انضمام اللاعبين...</p>
              <Button 
  onClick={() => router.push(`/game/${roomCode}?host=true`)} 
  size="lg" 
  className="w-full bg-green-600 hover:bg-green-700 text-lg h-14"
>
  بدء اللعبة (الرجل المشنوق)
</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center items-center space-x-2 space-x-reverse">
                <span className="animate-bounce w-3 h-3 bg-indigo-600 rounded-full"></span>
                <span className="animate-bounce w-3 h-3 bg-indigo-600 rounded-full" style={{ animationDelay: '0.1s' }}></span>
                <span className="animate-bounce w-3 h-3 bg-indigo-600 rounded-full" style={{ animationDelay: '0.2s' }}></span>
              </div>
              <p className="text-slate-600 font-medium">في انتظار المضيف لبدء اللعبة...</p>
            </div>
          )}
          
        </CardContent>
      </Card>
    </main>
  );
}