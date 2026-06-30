/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cairo } from "next/font/google";
import {
  Shield, Crown, Bomb, Swords, Crosshair, Skull, Eye, Flame, CheckCircle2, Lock,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import AudienceBackground from "@/components/games/castle-war/display/AudienceBackground";
import AudienceCastle from "@/components/games/castle-war/display/AudienceCastle";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

export default function CastleWarDisplay() {
  const supabase = getSupabaseBrowser();
  const [liveData, setLiveData] = useState<any>(null);
  const [explosionRoomIdx, setExplosionRoomIdx] = useState<number | null>(null);
  const [explosionIsTeam1Target, setExplosionIsTeam1Target] = useState(false);
  const [targetRoomIdx, setTargetRoomIdx] = useState<number | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);

  const lastTimestampRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    setRoomCode(code);

    const handleSyncData = (parsed: any) => {
      if (!parsed) return;
      if (parsed.explosionRoomIndexHit !== undefined && parsed.timestamp !== lastTimestampRef.current) {
        const hitRoom = parsed.explosionRoomIndexHit;
        const isT1Target = parsed.attackingTeam === 2;

        setTargetRoomIdx(hitRoom);
        setExplosionIsTeam1Target(isT1Target);

        setTimeout(() => {
          setTargetRoomIdx(null);
          setExplosionRoomIdx(hitRoom);
          setTimeout(() => {
            setExplosionRoomIdx(null);
          }, 1000);
        }, 500);

        lastTimestampRef.current = parsed.timestamp;
      }
      setLiveData(parsed);
    };

    if (code) {
      const fetchInitial = async () => {
        const { data } = await supabase.from("cw_rooms").select("live_sync").eq("room_code", code).single();
        if (data && data.live_sync) handleSyncData(data.live_sync);
      };

      fetchInitial();

      const channel = supabase.channel(`display_room_${code}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "cw_rooms", filter: `room_code=eq.${code}` },
          (payload) => {
            if (payload.new && payload.new.live_sync) handleSyncData(payload.new.live_sync);
          }
        ).subscribe();

      return () => {
        supabase.removeChannel(channel);
        document.documentElement.classList.remove("dark");
      };
    } else {
      return () => { document.documentElement.classList.remove("dark"); };
    }
  }, []);

  const getChallengeTitle = (type: string) => {
    switch (type) {
      case "30sec": return "ثلاثين ثانية";
      case "5sec": return "خمس ثواني";
      case "general": return "أسئلة عامة";
      case "team": return "تحدي الفريق";
      case "guess": return "توقع الرقم";
      default: return "";
    }
  };

  if (!liveData) {
    return (
      <div className={`h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white ${cairo.className}`} dir="rtl">

        <AudienceBackground />
        <div className="relative z-10 bg-slate-800 border-8 border-black p-16 rounded-[4rem] shadow-[16px_16px_0px_#000] flex flex-col items-center animate-in zoom-in-95">
          <Swords className="w-32 h-32 text-slate-500 animate-pulse mb-8" strokeWidth={2.5} />
          <h1 className="text-5xl md:text-6xl font-black text-slate-300 tracking-tight">
            {roomCode ? "جاري الاتصال بغرفة العمليات..." : "بانتظار بدء الحرب..."}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <main className={`h-screen w-full relative bg-[#0f172a] ${cairo.className} overflow-hidden`} dir="rtl">


      <AudienceBackground />

      <div className="relative z-10 w-full h-full flex items-center justify-between px-8 md:px-16 gap-10">
        <div className="flex-1 w-full flex flex-col justify-center items-center h-full z-20">
          <div className="flex flex-col items-center mb-4 w-full max-w-[320px]">
            <div className="bg-cyan-500 border-4 border-black text-white font-black text-3xl md:text-4xl py-3 px-6 rounded-[2rem] shadow-[8px_8px_0px_#000] text-center flex items-center justify-center gap-3 w-full">
              {liveData.hp1} <span className="text-xl text-cyan-900 font-bold hidden xl:block">جندي</span>
            </div>
          </div>
          <AudienceCastle
            isTeam1Castle={true}
            liveData={liveData}
            explosionRoomIdx={explosionRoomIdx}
            explosionIsTeam1Target={explosionIsTeam1Target}
          />
        </div>

        <div className="flex-1 w-full flex flex-col justify-center items-center h-full z-20">
          <div className="flex flex-col items-center mb-4 w-full max-w-[320px]">
            <div className="bg-rose-500 border-4 border-black text-white font-black text-3xl md:text-4xl py-3 px-6 rounded-[2rem] shadow-[8px_8px_0px_#000] text-center flex items-center justify-center gap-3 w-full">
              {liveData.hp2} <span className="text-xl text-rose-900 font-bold hidden xl:block">جندي</span>
            </div>
          </div>
          <AudienceCastle
            isTeam1Castle={false}
            liveData={liveData}
            explosionRoomIdx={explosionRoomIdx}
            explosionIsTeam1Target={explosionIsTeam1Target}
          />
        </div>
      </div>

      <div className="absolute top-8 md:top-12 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
        <div className="animate-floating-box px-8 py-3 rounded-3xl border-8 border-black flex items-center gap-4 shadow-[8px_8px_0px_#000] bg-white transition-colors duration-300">
          <Swords size={32} className={liveData.attackingTeam === 1 ? "text-cyan-500" : "text-rose-500"} strokeWidth={2.5} />
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">دور الهجوم</span>
            <span className={`text-xl md:text-2xl font-black ${liveData.attackingTeam === 1 ? "text-cyan-500" : "text-rose-500"}`}>
              {liveData.attackingTeam === 1 ? liveData.team1Name : liveData.team2Name}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl pointer-events-none flex flex-col items-center">
        {liveData.battleStep === "roll" && (() => {
          const allAvailableTypes = ["guess", "30sec", "5sec", "general", "team"];
          const usedT1 = liveData.usedChallengesT1 || [];
          const usedT2 = liveData.usedChallengesT2 || [];
          const currentTeamUsed = liveData.turn === 1 ? usedT1 : usedT2;
          const teamColorBg = liveData.turn === 1 ? "bg-cyan-500" : "bg-rose-500";
          const teamTextColor = liveData.turn === 1 ? "text-cyan-400" : "text-rose-400";
          const teamName = liveData.turn === 1 ? liveData.team1Name : liveData.team2Name;

          return (
            <div className="bg-slate-800 border-8 border-black rounded-[3rem] p-8 md:p-10 text-center shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 w-full max-w-4xl mx-auto">
              <h3 className={`text-3xl md:text-4xl font-black mb-8 ${teamTextColor} drop-shadow-[2px_2px_0_#000]`}>
                بانتظار اختيار فريق ({teamName})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
                {allAvailableTypes.map((cType) => {
                  const isUsed = currentTeamUsed.includes(cType);
                  return (
                    <div key={cType} className={`py-6 rounded-3xl font-black text-xl md:text-2xl border-8 transition-all flex items-center justify-center ${isUsed ? "bg-slate-900 text-slate-700 border-slate-950 opacity-40 shadow-inner" : `${teamColorBg} text-white border-black shadow-[6px_6px_0px_#000] animate-pulse`}`}>
                      {getChallengeTitle(cType)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {liveData.battleStep === "challenge" && liveData.isChallengeRevealed && liveData.activeChallengeData && (
          <div className="bg-white border-8 border-black rounded-[3rem] p-8 md:p-10 text-center shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 pointer-events-auto w-full">
            <h3 className="bg-slate-100 border-4 border-slate-200 text-slate-600 font-black mb-4 uppercase tracking-widest text-lg py-2 px-6 rounded-2xl inline-block">
              {liveData.activeChallengeName}
            </h3>

            {!liveData.timerStarted ? (
              <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in">
                <Lock className="w-20 h-20 text-slate-300 mb-6 animate-pulse" strokeWidth={2} />
                <h2 className="text-3xl md:text-4xl font-black text-slate-500">التحدي جاهز</h2>
                <p className="text-xl text-slate-400 mt-2 font-bold">بانتظار بدء المؤقت لعرض التفاصيل...</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <p className="text-2xl md:text-4xl font-black text-slate-900 leading-relaxed mb-6">
                  {liveData.activeChallengeData.q || liveData.activeChallengeData}
                </p>

                {liveData.activeChallengeData.options && (
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {liveData.activeChallengeData.options.map((opt: string, i: number) => (
                      <div key={i} className="bg-slate-100 border-4 border-slate-900 rounded-2xl py-3 text-xl md:text-2xl font-black text-slate-800 shadow-[4px_4px_0px_#000]">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {liveData.genTimer > 0 && (
                  <div className={`text-5xl md:text-7xl font-mono font-black py-4 rounded-3xl border-8 shadow-inner transition-colors ${liveData.genTimer <= 5 ? "bg-rose-100 text-rose-600 border-rose-500 animate-pulse" : "bg-slate-900 border-black text-amber-400"}`}>
                    {formatTime(liveData.genTimer)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {liveData.battleStep === "result" && liveData.targetRoomIndex === null && (
          <div className={`border-8 rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 text-center shadow-[24px_24px_0px_#000] animate-in zoom-in duration-500 w-full max-w-3xl ${liveData.resultType === "spy" ? "bg-yellow-400 border-yellow-600" : liveData.resultType === "hit" ? "bg-emerald-400 border-black text-slate-900" : liveData.resultType === "trap" ? "bg-purple-500 border-black text-white" : liveData.resultType === "commander" ? "bg-amber-400 border-black text-slate-900" : "bg-slate-200 border-black text-slate-900"}`}>
            <div className={`mx-auto w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-inner border-8 ${liveData.resultType === "spy" ? "border-yellow-500 bg-yellow-300" : "border-slate-100/20 bg-black/10"}`}>
              {liveData.resultType === "hit" && <CheckCircle2 className="w-14 h-14" strokeWidth={3} />}
              {liveData.resultType === "miss" && <Shield className="w-14 h-14 opacity-60" fill="none" strokeWidth={3} />}
              {liveData.resultType === "trap" && <Bomb className="w-14 h-14 animate-pulse drop-shadow-[4px_4px_0_#000]" strokeWidth={2.5} />}
              {liveData.resultType === "commander" && <Crown className="w-14 h-14 animate-bounce drop-shadow-[4px_4px_0_#000]" strokeWidth={2.5} />}
              {liveData.resultType === "spy" && <Eye className="text-slate-900 w-14 h-14 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]" strokeWidth={3} />}
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm">
              {liveData.resultMsg}
            </h2>
          </div>
        )}

        {liveData.gameState === "gameOver" && (
          <div className="bg-amber-400 border-8 border-black rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 text-center shadow-[24px_24px_0px_#000] animate-in zoom-in-95 pointer-events-auto w-full max-w-4xl">
            <Crown className="mx-auto text-white w-24 h-24 md:w-40 md:h-40 mb-6 drop-shadow-[6px_6px_0_#000] animate-bounce" strokeWidth={2.5} />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 border-b-8 border-black/10 pb-4 inline-block">انتهت الحرب!</h2>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-[4px_4px_0_#000]">
              الفريق المنتصر<br />
              <span className={`block mt-6 text-6xl md:text-8xl drop-shadow-[6px_6px_0_#000] ${liveData.hp1 > 0 ? "text-cyan-300" : "text-rose-300"}`}>
                {liveData.hp1 > 0 ? liveData.team1Name : liveData.team2Name}
              </span>
            </h1>
          </div>
        )}
      </div>
    </main>
  );
}