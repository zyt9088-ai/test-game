/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cairo } from "next/font/google";
import {
  Shield,
  Crown,
  Bomb,
  Swords,
  Crosshair,
  Skull,
  Eye,
  Flame,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });

// غرف القلعة التفاعلية (15 غرفة)
const SVG_ROOMS = [
  // البرج الأيسر
  { id: 0, cx: 250, cy: 300 },
  { id: 1, cx: 250, cy: 420 },
  { id: 2, cx: 250, cy: 540 },
  { id: 3, cx: 170, cy: 660 },
  { id: 4, cx: 330, cy: 660 },
  // البرج الأوسط
  { id: 5, cx: 600, cy: 150 },
  { id: 6, cx: 480, cy: 300 },
  { id: 7, cx: 720, cy: 300 },
  { id: 8, cx: 480, cy: 460 },
  { id: 9, cx: 720, cy: 460 },
  // البرج الأيمن
  { id: 10, cx: 950, cy: 300 },
  { id: 11, cx: 950, cy: 420 },
  { id: 12, cx: 950, cy: 540 },
  { id: 13, cx: 870, cy: 660 },
  { id: 14, cx: 1030, cy: 660 },
];

const SolidGamingBackground = () => {
  const [icons, setIcons] = useState<any[]>([]);

  useEffect(() => {
    const gameShapes = [
      <svg
        key="1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="6" y1="12" x2="10" y2="12"></line>
        <line x1="8" y1="10" x2="8" y2="14"></line>
        <line x1="15" y1="13" x2="15.01" y2="13"></line>
        <line x1="18" y1="11" x2="18.01" y2="11"></line>
        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      </svg>,
      <svg
        key="2"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <circle cx="15.5" cy="15.5" r="1.5"></circle>
        <circle cx="15.5" cy="8.5" r="1.5"></circle>
        <circle cx="8.5" cy="15.5" r="1.5"></circle>
        <circle cx="12" cy="12" r="1.5"></circle>
      </svg>,
      <svg
        key="3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h4" />
        <path d="M6 20V4h6v4" />
        <circle cx="12" cy="11" r="2" />
        <line x1="12" y1="13" x2="12" y2="17" />
        <line x1="10" y1="15" x2="14" y2="15" />
        <line x1="12" y1="17" x2="10" y2="20" />
        <line x1="12" y1="17" x2="14" y2="20" />
      </svg>,
    ];

    const iconColors = [
      "text-cyan-500",
      "text-rose-500",
      "text-amber-500",
      "text-purple-500",
    ];

    const generatedIcons = Array.from({ length: 15 }).map((_, i) => ({
      id: `icon-${i}`,
      shape: gameShapes[i % gameShapes.length],
      colorClass: iconColors[i % iconColors.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 60 + 60,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 15 + 20}s`,
      rotate: Math.random() * 360,
    }));
    setIcons(generatedIcons);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0f172a] transition-colors duration-300">
      <div className="absolute inset-0 opacity-[0.08]">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className={`absolute animate-float-game-extra ${icon.colorClass}`}
            style={{
              left: icon.left,
              top: icon.top,
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              animationDelay: icon.delay,
              animationDuration: icon.duration,
              transform: `rotate(${icon.rotate}deg)`,
            }}
          >
            {icon.shape}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CastleWarDisplay() {
  const [liveData, setLiveData] = useState<any>(null);
  const [explosionRoomIdx, setExplosionRoomIdx] = useState<number | null>(null);
  const [explosionIsTeam1Target, setExplosionIsTeam1Target] = useState(false);
  const [targetRoomIdx, setTargetRoomIdx] = useState<number | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);

  const lastTimestampRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
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
      if (
        parsed.explosionRoomIndexHit !== undefined &&
        parsed.timestamp !== lastTimestampRef.current
      ) {
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
        const { data } = await supabase
          .from("cw_rooms")
          .select("live_sync")
          .eq("room_code", code)
          .single();
        if (data && data.live_sync) {
          handleSyncData(data.live_sync);
        }
      };

      fetchInitial();

      const channel = supabase
        .channel(`display_room_${code}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "cw_rooms",
            filter: `room_code=eq.${code}`,
          },
          (payload) => {
            if (payload.new && payload.new.live_sync) {
              handleSyncData(payload.new.live_sync);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        document.documentElement.classList.remove("dark");
      };
    } else {
      return () => {
        document.documentElement.classList.remove("dark");
      };
    }
  }, []);

  const getChallengeTitle = (type: string) => {
    switch (type) {
      case "30sec":
        return "ثلاثين ثانية";
      case "5sec":
        return "خمس ثواني";
      case "general":
        return "أسئلة عامة";
      case "team":
        return "تحدي الفريق";
      case "guess":
        return "توقع الرقم";
      default:
        return "";
    }
  };

  if (!liveData) {
    return (
      <div
        className={`h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white ${cairo.className}`}
        dir="rtl"
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } } .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }`,
          }}
        />
        <SolidGamingBackground />
        <div className="relative z-10 bg-slate-800 border-8 border-black p-16 rounded-[4rem] shadow-[16px_16px_0px_#000] flex flex-col items-center animate-in zoom-in-95">
          <Swords
            className="w-32 h-32 text-slate-500 animate-pulse mb-8"
            strokeWidth={2.5}
          />
          <h1 className="text-5xl md:text-6xl font-black text-slate-300 tracking-tight">
            {roomCode
              ? "جاري الاتصال بغرفة العمليات..."
              : "بانتظار بدء الحرب..."}
          </h1>
        </div>
      </div>
    );
  }

  // دالة عرض القلعة التفاعلية (بديلة للصورة القديمة)
  const renderCastle = (isTeam1Castle: boolean) => {
    const revealed = isTeam1Castle
      ? liveData.revealed1 || []
      : liveData.revealed2 || [];
    const teamData = isTeam1Castle ? liveData.team1Data : liveData.team2Data;
    const isSpiedTarget = isTeam1Castle
      ? liveData.spiedTarget2
      : liveData.spiedTarget1;
    const isTargetTeam =
      liveData.gameState === "playing" &&
      liveData.attackingTeam !== (isTeam1Castle ? 1 : 2);
    const glowColor = isTeam1Castle ? "url(#team1Glow)" : "url(#team2Glow)";
    const strokeColor = isTeam1Castle ? "stroke-cyan-500" : "stroke-rose-500";

    return (
      <div
        className={`relative inline-block w-full max-w-[320px] md:max-w-[400px] lg:max-w-[460px] xl:max-w-[500px] shadow-[16px_16px_0px_#000] rounded-[3rem] overflow-hidden border-[8px] border-black bg-[#050b14] mx-auto transition-all duration-500 ${isTargetTeam && liveData.battleStep === "target" ? "scale-[1.02] ring-8 ring-amber-500/50" : "scale-100"}`}
      >
        <svg
          viewBox="0 -120 1200 1120"
          className={`w-full h-auto select-none transition-all duration-500 ${isTargetTeam ? "opacity-100" : "opacity-60 grayscale-[50%]"}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tower3D" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="20%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="80%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="30%" stopColor="#b45309" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            <linearGradient id="team1Glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="team2Glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>

            <radialGradient id="bgAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
              <stop offset="50%" stopColor="rgba(129, 140, 248, 0.05)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur1" />
              <feGaussianBlur stdDeviation="24" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="deepShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="15"
                stdDeviation="10"
                floodColor="#000000"
                floodOpacity="0.8"
              />
            </filter>
          </defs>

          {/* هالة الخلفية */}
          <circle cx="600" cy="500" r="500" fill="url(#bgAura)" />
          <circle
            cx="600"
            cy="350"
            r="250"
            fill="#1e1b4b"
            opacity="0.3"
            filter="url(#neonGlow)"
          />

          {/* الصورة المدمجة كخلفية (إن وجدت بالمجلد) */}
          <image
            href="/castle-bg.png"
            x="0"
            y="-120"
            width="1200"
            height="1120"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* هيكل القلعة */}
          <path
            d="M 250 800 L 250 500 L 950 500 L 950 800 Z"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          <path
            d="M 250 500 L 250 450 L 300 450 L 300 500 L 350 500 L 350 450 L 400 450 L 400 500 L 450 500 L 450 450 L 500 450 L 500 500 L 550 500 L 550 450 L 600 450 L 600 500 L 650 500 L 650 450 L 700 450 L 700 500 L 750 500 L 750 450 L 800 450 L 800 500 L 850 500 L 850 450 L 900 450 L 900 500 L 950 500 Z"
            fill="url(#tower3D)"
          />

          {/* الأبراج */}
          <rect
            x="120"
            y="200"
            width="260"
            height="600"
            rx="10"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          <path
            d="M 100 800 L 120 700 L 380 700 L 400 800 Z"
            fill="url(#tower3D)"
          />
          <path
            d="M 100 200 L 250 20 L 400 200 Z"
            fill="url(#roofGradient)"
            filter="url(#deepShadow)"
          />
          <path d="M 90 200 L 410 200 L 410 220 L 90 220 Z" fill="#b45309" />

          <rect
            x="820"
            y="200"
            width="260"
            height="600"
            rx="10"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          <path
            d="M 800 800 L 820 700 L 1080 700 L 1100 800 Z"
            fill="url(#tower3D)"
          />
          <path
            d="M 800 200 L 950 20 L 1100 200 Z"
            fill="url(#roofGradient)"
            filter="url(#deepShadow)"
          />
          <path
            d="M 790 200 L 1110 200 L 1110 220 L 790 220 Z"
            fill="#b45309"
          />

          <rect
            x="420"
            y="80"
            width="360"
            height="720"
            rx="15"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          <path
            d="M 390 80 L 600 -80 L 810 80 Z"
            fill="url(#roofGradient)"
            filter="url(#deepShadow)"
          />
          <path d="M 380 80 L 820 80 L 820 110 L 380 110 Z" fill="#f59e0b" />

          {/* البوابة */}
          <path
            d="M 480 800 L 480 620 A 120 120 0 0 1 720 620 L 720 800 Z"
            fill="#020617"
            stroke={isTeam1Castle ? "#0891b2" : "#e11d48"}
            strokeWidth="8"
            filter="url(#neonGlow)"
          />
          <path
            d="M 540 800 L 540 620 A 60 60 0 0 1 660 620 L 660 800"
            fill="none"
            stroke={isTeam1Castle ? "#22d3ee" : "#fb7185"}
            strokeWidth="4"
            opacity="0.6"
          />
          <circle
            cx="600"
            cy="710"
            r="30"
            fill={isTeam1Castle ? "url(#team1Glow)" : "url(#team2Glow)"}
            filter="url(#neonGlow)"
          />
          <circle cx="600" cy="710" r="15" fill="#ffffff" />

          {/* القاعدة المستطيلة */}
          <rect
            x="80"
            y="800"
            width="1040"
            height="40"
            rx="5"
            fill="#0f172a"
            filter="url(#deepShadow)"
          />
          <rect
            x="40"
            y="840"
            width="1120"
            height="60"
            rx="10"
            fill="#020617"
            filter="url(#deepShadow)"
          />

          {/* الرسومات التجميلية */}
          <foreignObject x="560" y="520" width="80" height="80">
            <Swords className="text-slate-500 w-full h-full opacity-60" />
          </foreignObject>
          <foreignObject x="420" y="740" width="40" height="40">
            <Skull className="text-slate-500 w-full h-full opacity-60" />
          </foreignObject>
          <foreignObject x="740" y="740" width="40" height="40">
            <Skull className="text-slate-500 w-full h-full opacity-60" />
          </foreignObject>

          {/* غرف القلعة والانفجارات */}
          {SVG_ROOMS.map((room) => {
            const isRevealedRoom = revealed[room.id];
            const isDamagedRoom =
              isRevealedRoom &&
              teamData &&
              (teamData.rooms[room.id] > 0 ||
                teamData.commanderRoom === room.id ||
                teamData.trapRoom === room.id);
            const isDestroyedTrap =
              isRevealedRoom && teamData && teamData.trapRoom === room.id;
            const hitCommander =
              isRevealedRoom && teamData && teamData.commanderRoom === room.id;
            const isSpied = isSpiedTarget === room.id;

            const isTargetedNow =
              isTargetTeam && liveData.targetRoomIndex === room.id;
            const isExploding =
              explosionRoomIdx === room.id &&
              explosionIsTeam1Target === isTeam1Castle;

            return (
              <g
                key={room.id}
                style={{ transformOrigin: `${room.cx}px ${room.cy}px` }}
                className={`transition-transform duration-200 ease-out will-change-transform ${isTargetedNow ? "scale-[1.12]" : ""}`}
              >
                {/* الإطار الخارجي المقوس */}
                <path
                  d={`M ${room.cx - 35} ${room.cy + 45} L ${room.cx + 35} ${room.cy + 45} L ${room.cx + 35} ${room.cy - 10} A 35 35 0 0 0 ${room.cx - 35} ${room.cy - 10} Z`}
                  className={`fill-[#0f172a] stroke-[3px] transition-colors duration-200 ${isTargetedNow ? "stroke-amber-400" : "stroke-[#1e293b]"}`}
                  filter="url(#deepShadow)"
                />

                {/* النواة المضيئة */}
                <path
                  d={`M ${room.cx - 25} ${room.cy + 35} L ${room.cx + 25} ${room.cy + 35} L ${room.cx + 25} ${room.cy - 5} A 25 25 0 0 0 ${room.cx - 25} ${room.cy - 5} Z`}
                  fill={isRevealedRoom ? "#020617" : glowColor}
                  filter={!isRevealedRoom ? "url(#neonGlow)" : ""}
                />

                {/* شبك النوافذ */}
                <line
                  x1={room.cx - 25}
                  y1={room.cy + 15}
                  x2={room.cx + 25}
                  y2={room.cy + 15}
                  stroke="#020617"
                  strokeWidth="3"
                  opacity="0.7"
                />
                <line
                  x1={room.cx}
                  y1={room.cy - 30}
                  x2={room.cx}
                  y2={room.cy + 35}
                  stroke="#020617"
                  strokeWidth="3"
                  opacity="0.7"
                />

                {/* الحاوية HTML للأيقونات والتأثيرات */}
                <foreignObject
                  x={room.cx - 80}
                  y={room.cy - 80}
                  width="160"
                  height="160"
                  className="pointer-events-none overflow-visible"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center relative overflow-visible">
                    {isSpied && !isRevealedRoom && !isTargetedNow && (
                      <Eye
                        className="absolute -top-4 text-yellow-400 w-12 h-12 animate-bounce drop-shadow-[0_4px_0_#000] z-40"
                        strokeWidth={3}
                      />
                    )}

                    {isRevealedRoom && !isTargetedNow ? (
                      isDamagedRoom ? (
                        hitCommander ? (
                          <Crown
                            className="text-amber-500 drop-shadow-[0_4px_0_#000] z-40 w-16 h-16 animate-pulse"
                            strokeWidth={2.5}
                          />
                        ) : isDestroyedTrap ? (
                          <Bomb
                            className="text-purple-600 animate-wiggle drop-shadow-[0_4px_0_#000] z-40 w-16 h-16"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Skull
                            className="text-rose-500 drop-shadow-[0_4px_0_#000] animate-pulse z-40 w-16 h-16"
                            strokeWidth={2.5}
                          />
                        )
                      ) : (
                        <Shield
                          className="text-emerald-400 drop-shadow-[0_4px_0_#000] z-40 w-16 h-16"
                          fill="none"
                          strokeWidth={3}
                        />
                      )
                    ) : (
                      <span
                        className={`font-black z-30 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] transition-all duration-300 ${isTargetedNow ? "text-5xl text-white opacity-0" : `text-4xl text-white opacity-90`}`}
                      >
                        {room.id + 1}
                      </span>
                    )}

                    {isTargetedNow && !isRevealedRoom && (
                      <Crosshair
                        className="absolute text-rose-500 drop-shadow-[0_0_20px_rgba(225,29,72,1)] animate-ping z-50 w-32 h-32"
                        strokeWidth={3}
                      />
                    )}

                    {isExploding && !isTargetedNow && (
                      <div className="absolute z-50 pointer-events-none flex items-center justify-center">
                        <div
                          className={`w-32 h-32 rounded-full animate-ping border-[10px] border-black shadow-inner ${liveData.resultType === "commander" ? "bg-yellow-500" : liveData.resultType === "trap" ? "bg-purple-600" : "bg-rose-500"}`}
                        />
                        <Flame
                          size={60}
                          className="absolute text-white animate-pulse drop-shadow-[3px_3px_0_#000]"
                        />
                      </div>
                    )}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <main
      className={`h-screen w-full relative bg-[#0f172a] ${cairo.className} overflow-hidden`}
      dir="rtl"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes floatGameExtra { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(-20px, 15px) rotate(8deg) scale(1.05); } 50% { transform: translate(-10px, -15px) rotate(-8deg) scale(0.95); } 75% { transform: translate(15px, 20px) rotate(5deg) scale(1.02); } }
        .animate-float-game-extra { animation: floatGameExtra ease-in-out infinite; }
        
        @keyframes floatingBox { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .animate-floating-box { animation: floatingBox 3s ease-in-out infinite; }
      `,
        }}
      />

      <SolidGamingBackground />

      <div className="relative z-10 w-full h-full flex items-center justify-between px-8 md:px-16 gap-10">
        <div className="flex-1 w-full flex flex-col justify-center items-center h-full z-20">
          <div className="flex flex-col items-center mb-4 w-full max-w-[320px]">
            <div className="bg-cyan-500 border-4 border-black text-white font-black text-3xl md:text-4xl py-3 px-6 rounded-[2rem] shadow-[8px_8px_0px_#000] text-center flex items-center justify-center gap-3 w-full">
              {liveData.hp1}{" "}
              <span className="text-xl text-cyan-900 font-bold hidden xl:block">
                جندي
              </span>
            </div>
          </div>
          {renderCastle(true)}
        </div>

        <div className="flex-1 w-full flex flex-col justify-center items-center h-full z-20">
          <div className="flex flex-col items-center mb-4 w-full max-w-[320px]">
            <div className="bg-rose-500 border-4 border-black text-white font-black text-3xl md:text-4xl py-3 px-6 rounded-[2rem] shadow-[8px_8px_0px_#000] text-center flex items-center justify-center gap-3 w-full">
              {liveData.hp2}{" "}
              <span className="text-xl text-rose-900 font-bold hidden xl:block">
                جندي
              </span>
            </div>
          </div>
          {renderCastle(false)}
        </div>
      </div>

      <div className="absolute top-8 md:top-12 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
        <div
          className={`animate-floating-box px-8 py-3 rounded-3xl border-8 border-black flex items-center gap-4 shadow-[8px_8px_0px_#000] bg-white transition-colors duration-300`}
        >
          <Swords
            size={32}
            className={
              liveData.attackingTeam === 1 ? "text-cyan-500" : "text-rose-500"
            }
            strokeWidth={2.5}
          />
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">
              دور الهجوم
            </span>
            <span
              className={`text-xl md:text-2xl font-black ${liveData.attackingTeam === 1 ? "text-cyan-500" : "text-rose-500"}`}
            >
              {liveData.attackingTeam === 1
                ? liveData.team1Name
                : liveData.team2Name}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl pointer-events-none flex flex-col items-center">
        {liveData.battleStep === "roll" &&
          (() => {
            const allAvailableTypes = [
              "guess",
              "30sec",
              "5sec",
              "general",
              "team",
            ];
            const usedT1 = liveData.usedChallengesT1 || [];
            const usedT2 = liveData.usedChallengesT2 || [];

            const currentTeamUsed = liveData.turn === 1 ? usedT1 : usedT2;
            const teamColorBg =
              liveData.turn === 1 ? "bg-cyan-500" : "bg-rose-500";
            const teamTextColor =
              liveData.turn === 1 ? "text-cyan-400" : "text-rose-400";
            const teamName =
              liveData.turn === 1 ? liveData.team1Name : liveData.team2Name;

            return (
              <div className="bg-slate-800 border-8 border-black rounded-[3rem] p-8 md:p-10 text-center shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 w-full max-w-4xl mx-auto">
                <h3
                  className={`text-3xl md:text-4xl font-black mb-8 ${teamTextColor} drop-shadow-[2px_2px_0_#000]`}
                >
                  بانتظار اختيار فريق ({teamName})
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full">
                  {allAvailableTypes.map((cType) => {
                    const isUsed = currentTeamUsed.includes(cType);
                    return (
                      <div
                        key={cType}
                        className={`py-6 rounded-3xl font-black text-xl md:text-2xl border-8 transition-all flex items-center justify-center
                          ${
                            isUsed
                              ? "bg-slate-900 text-slate-700 border-slate-950 opacity-40 shadow-inner"
                              : `${teamColorBg} text-white border-black shadow-[6px_6px_0px_#000] animate-pulse`
                          }`}
                      >
                        {getChallengeTitle(cType)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        {/* القفل والحجب لشاشة الجمهور إلين يشتغل المؤقت */}
        {liveData.battleStep === "challenge" &&
          liveData.isChallengeRevealed &&
          liveData.activeChallengeData && (
            <div className="bg-white border-8 border-black rounded-[3rem] p-8 md:p-10 text-center shadow-[20px_20px_0px_#000] animate-in zoom-in duration-300 pointer-events-auto w-full">
              <h3 className="bg-slate-100 border-4 border-slate-200 text-slate-600 font-black mb-4 uppercase tracking-widest text-lg py-2 px-6 rounded-2xl inline-block">
                {liveData.activeChallengeName}
              </h3>

              {!liveData.timerStarted ? (
                <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in">
                  <Lock
                    className="w-20 h-20 text-slate-300 mb-6 animate-pulse"
                    strokeWidth={2}
                  />
                  <h2 className="text-3xl md:text-4xl font-black text-slate-500">
                    التحدي جاهز
                  </h2>
                  <p className="text-xl text-slate-400 mt-2 font-bold">
                    بانتظار بدء المؤقت لعرض التفاصيل...
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <p className="text-2xl md:text-4xl font-black text-slate-900 leading-relaxed mb-6">
                    {liveData.activeChallengeData.q ||
                      liveData.activeChallengeData}
                  </p>

                  {liveData.activeChallengeData.options && (
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {liveData.activeChallengeData.options.map(
                        (opt: string, i: number) => (
                          <div
                            key={i}
                            className="bg-slate-100 border-4 border-slate-900 rounded-2xl py-3 text-xl md:text-2xl font-black text-slate-800 shadow-[4px_4px_0px_#000]"
                          >
                            {opt}
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {liveData.genTimer > 0 && (
                    <div
                      className={`text-5xl md:text-7xl font-mono font-black py-4 rounded-3xl border-8 shadow-inner transition-colors ${liveData.genTimer <= 5 ? "bg-rose-100 text-rose-600 border-rose-500 animate-pulse" : "bg-slate-900 border-black text-amber-400"}`}
                    >
                      {formatTime(liveData.genTimer)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {liveData.battleStep === "result" &&
          liveData.targetRoomIndex === null && (
            <div
              className={`border-8 rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 text-center shadow-[24px_24px_0px_#000] animate-in zoom-in duration-500 w-full max-w-3xl ${
                liveData.resultType === "spy"
                  ? "bg-yellow-400 border-yellow-600"
                  : liveData.resultType === "hit"
                    ? "bg-emerald-400 border-black text-slate-900"
                    : liveData.resultType === "trap"
                      ? "bg-purple-500 border-black text-white"
                      : liveData.resultType === "commander"
                        ? "bg-amber-400 border-black text-slate-900"
                        : "bg-slate-200 border-black text-slate-900"
              }`}
            >
              <div
                className={`mx-auto w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-inner border-8 ${
                  liveData.resultType === "spy"
                    ? "border-yellow-500 bg-yellow-300"
                    : "border-slate-100/20 bg-black/10"
                }`}
              >
                {liveData.resultType === "hit" && (
                  <CheckCircle2 className="w-14 h-14" strokeWidth={3} />
                )}
                {liveData.resultType === "miss" && (
                  <Shield
                    className="w-14 h-14 opacity-60"
                    fill="none"
                    strokeWidth={3}
                  />
                )}
                {liveData.resultType === "trap" && (
                  <Bomb
                    className="w-14 h-14 animate-pulse drop-shadow-[4px_4px_0_#000]"
                    strokeWidth={2.5}
                  />
                )}
                {liveData.resultType === "commander" && (
                  <Crown
                    className="w-14 h-14 animate-bounce drop-shadow-[4px_4px_0_#000]"
                    strokeWidth={2.5}
                  />
                )}
                {liveData.resultType === "spy" && (
                  <Eye
                    className="text-slate-900 w-14 h-14 animate-pulse drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
                    strokeWidth={3}
                  />
                )}
              </div>

              <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-sm">
                {liveData.resultMsg}
              </h2>
            </div>
          )}

        {liveData.gameState === "gameOver" && (
          <div className="bg-amber-400 border-8 border-black rounded-[3rem] md:rounded-[4rem] p-10 md:p-14 text-center shadow-[24px_24px_0px_#000] animate-in zoom-in-95 pointer-events-auto w-full max-w-4xl">
            <Crown
              className="mx-auto text-white w-24 h-24 md:w-40 md:h-40 mb-6 drop-shadow-[6px_6px_0_#000] animate-bounce"
              strokeWidth={2.5}
            />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 border-b-8 border-black/10 pb-4 inline-block">
              انتهت الحرب!
            </h2>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-[4px_4px_0_#000]">
              الفريق المنتصر
              <br />
              <span
                className={`block mt-6 text-6xl md:text-8xl drop-shadow-[6px_6px_0_#000] ${liveData.hp1 > 0 ? "text-cyan-300" : "text-rose-300"}`}
              >
                {liveData.hp1 > 0 ? liveData.team1Name : liveData.team2Name}
              </span>
            </h1>
          </div>
        )}
      </div>
    </main>
  );
}
