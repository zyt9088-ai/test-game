"use client";

import React from "react";
import { Shield, Crown, Bomb, Swords, Crosshair, Skull, Eye, Flame } from "lucide-react";

const SVG_ROOMS = [
  { id: 0, cx: 250, cy: 300 }, { id: 1, cx: 250, cy: 420 }, { id: 2, cx: 250, cy: 540 }, { id: 3, cx: 170, cy: 660 }, { id: 4, cx: 330, cy: 660 },
  { id: 5, cx: 600, cy: 150 }, { id: 6, cx: 480, cy: 300 }, { id: 7, cx: 720, cy: 300 }, { id: 8, cx: 480, cy: 460 }, { id: 9, cx: 720, cy: 460 },
  { id: 10, cx: 950, cy: 300 }, { id: 11, cx: 950, cy: 420 }, { id: 12, cx: 950, cy: 540 }, { id: 13, cx: 870, cy: 660 }, { id: 14, cx: 1030, cy: 660 },
];

export default function AudienceCastle({
  isTeam1Castle,
  liveData,
  explosionRoomIdx,
  explosionIsTeam1Target,
}: {
  isTeam1Castle: boolean;
  liveData: any;
  explosionRoomIdx: number | null;
  explosionIsTeam1Target: boolean;
}) {
  const revealed = isTeam1Castle ? liveData.revealed1 || [] : liveData.revealed2 || [];
  const teamData = isTeam1Castle ? liveData.team1Data : liveData.team2Data;
  const isSpiedTarget = isTeam1Castle ? liveData.spiedTarget2 : liveData.spiedTarget1;
  const isTargetTeam = liveData.gameState === "playing" && liveData.attackingTeam !== (isTeam1Castle ? 1 : 2);
  const glowColor = isTeam1Castle ? "url(#team1Glow)" : "url(#team2Glow)";
  const strokeColor = isTeam1Castle ? "stroke-cyan-500" : "stroke-rose-500";

  return (
    <div className={`relative inline-block w-full max-w-[320px] md:max-w-[400px] lg:max-w-[460px] xl:max-w-[500px] shadow-[16px_16px_0px_#000] rounded-[3rem] overflow-hidden border-[8px] border-black bg-[#050b14] mx-auto transition-all duration-500 ${isTargetTeam && liveData.battleStep === "target" ? "scale-[1.02] ring-8 ring-amber-500/50" : "scale-100"}`}>
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
          <filter id="deepShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="15" stdDeviation="10" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        <circle cx="600" cy="500" r="500" fill="url(#bgAura)" />
        <circle cx="600" cy="350" r="250" fill="#1e1b4b" opacity="0.3" filter="url(#neonGlow)" />
        <image href="/castle-bg.png" x="0" y="-120" width="1200" height="1120" preserveAspectRatio="xMidYMid slice" />

        <path d="M 250 800 L 250 500 L 950 500 L 950 800 Z" fill="url(#tower3D)" filter="url(#deepShadow)" />
        <path d="M 250 500 L 250 450 L 300 450 L 300 500 L 350 500 L 350 450 L 400 450 L 400 500 L 450 500 L 450 450 L 500 450 L 500 500 L 550 500 L 550 450 L 600 450 L 600 500 L 650 500 L 650 450 L 700 450 L 700 500 L 750 500 L 750 450 L 800 450 L 800 500 L 850 500 L 850 450 L 900 450 L 900 500 L 950 500 Z" fill="url(#tower3D)" />

        <rect x="120" y="200" width="260" height="600" rx="10" fill="url(#tower3D)" filter="url(#deepShadow)" />
        <path d="M 100 800 L 120 700 L 380 700 L 400 800 Z" fill="url(#tower3D)" />
        <path d="M 100 200 L 250 20 L 400 200 Z" fill="url(#roofGradient)" filter="url(#deepShadow)" />
        <path d="M 90 200 L 410 200 L 410 220 L 90 220 Z" fill="#b45309" />

        <rect x="820" y="200" width="260" height="600" rx="10" fill="url(#tower3D)" filter="url(#deepShadow)" />
        <path d="M 800 800 L 820 700 L 1080 700 L 1100 800 Z" fill="url(#tower3D)" />
        <path d="M 800 200 L 950 20 L 1100 200 Z" fill="url(#roofGradient)" filter="url(#deepShadow)" />
        <path d="M 790 200 L 1110 200 L 1110 220 L 790 220 Z" fill="#b45309" />

        <rect x="420" y="80" width="360" height="720" rx="15" fill="url(#tower3D)" filter="url(#deepShadow)" />
        <path d="M 390 80 L 600 -80 L 810 80 Z" fill="url(#roofGradient)" filter="url(#deepShadow)" />
        <path d="M 380 80 L 820 80 L 820 110 L 380 110 Z" fill="#f59e0b" />

        <path d="M 480 800 L 480 620 A 120 120 0 0 1 720 620 L 720 800 Z" fill="#020617" stroke={isTeam1Castle ? "#0891b2" : "#e11d48"} strokeWidth="8" filter="url(#neonGlow)" />
        <path d="M 540 800 L 540 620 A 60 60 0 0 1 660 620 L 660 800" fill="none" stroke={isTeam1Castle ? "#22d3ee" : "#fb7185"} strokeWidth="4" opacity="0.6" />
        <circle cx="600" cy="710" r="30" fill={isTeam1Castle ? "url(#team1Glow)" : "url(#team2Glow)"} filter="url(#neonGlow)" />
        <circle cx="600" cy="710" r="15" fill="#ffffff" />

        <rect x="80" y="800" width="1040" height="40" rx="5" fill="#0f172a" filter="url(#deepShadow)" />
        <rect x="40" y="840" width="1120" height="60" rx="10" fill="#020617" filter="url(#deepShadow)" />

        <foreignObject x="560" y="520" width="80" height="80">
          <Swords className="text-slate-500 w-full h-full opacity-60" />
        </foreignObject>
        <foreignObject x="420" y="740" width="40" height="40">
          <Skull className="text-slate-500 w-full h-full opacity-60" />
        </foreignObject>
        <foreignObject x="740" y="740" width="40" height="40">
          <Skull className="text-slate-500 w-full h-full opacity-60" />
        </foreignObject>

        {SVG_ROOMS.map((room) => {
          const isRevealedRoom = revealed[room.id];
          const isDamagedRoom = isRevealedRoom && teamData && (teamData.rooms[room.id] > 0 || teamData.commanderRoom === room.id || teamData.trapRoom === room.id);
          const isDestroyedTrap = isRevealedRoom && teamData && teamData.trapRoom === room.id;
          const hitCommander = isRevealedRoom && teamData && teamData.commanderRoom === room.id;
          const isSpied = isSpiedTarget === room.id;
          const isTargetedNow = isTargetTeam && liveData.targetRoomIndex === room.id;
          const isExploding = explosionRoomIdx === room.id && explosionIsTeam1Target === isTeam1Castle;

          return (
            <g
              key={room.id}
              style={{ transformOrigin: `${room.cx}px ${room.cy}px` }}
              className={`transition-transform duration-200 ease-out will-change-transform ${isTargetedNow ? "scale-[1.12]" : ""}`}
            >
              <path
                d={`M ${room.cx - 35} ${room.cy + 45} L ${room.cx + 35} ${room.cy + 45} L ${room.cx + 35} ${room.cy - 10} A 35 35 0 0 0 ${room.cx - 35} ${room.cy - 10} Z`}
                className={`fill-[#0f172a] stroke-[3px] transition-colors duration-200 ${isTargetedNow ? "stroke-amber-400" : "stroke-[#1e293b]"}`}
                filter="url(#deepShadow)"
              />
              <path
                d={`M ${room.cx - 25} ${room.cy + 35} L ${room.cx + 25} ${room.cy + 35} L ${room.cx + 25} ${room.cy - 5} A 25 25 0 0 0 ${room.cx - 25} ${room.cy - 5} Z`}
                fill={isRevealedRoom ? "#020617" : glowColor}
                filter={!isRevealedRoom ? "url(#neonGlow)" : ""}
              />
              <line x1={room.cx - 25} y1={room.cy + 15} x2={room.cx + 25} y2={room.cy + 15} stroke="#020617" strokeWidth="3" opacity="0.7" />
              <line x1={room.cx} y1={room.cy - 30} x2={room.cx} y2={room.cy + 35} stroke="#020617" strokeWidth="3" opacity="0.7" />

              <foreignObject x={room.cx - 80} y={room.cy - 80} width="160" height="160" className="pointer-events-none overflow-visible">
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-visible">
                  {isSpied && !isRevealedRoom && !isTargetedNow && (
                    <Eye className="absolute -top-4 text-yellow-400 w-12 h-12 animate-bounce drop-shadow-[0_4px_0_#000] z-40" strokeWidth={3} />
                  )}

                  {isRevealedRoom && !isTargetedNow ? (
                    isDamagedRoom ? (
                      hitCommander ? (
                        <Crown className="text-amber-500 drop-shadow-[0_4px_0_#000] z-40 w-16 h-16 animate-pulse" strokeWidth={2.5} />
                      ) : isDestroyedTrap ? (
                        <Bomb className="text-purple-600 animate-wiggle drop-shadow-[0_4px_0_#000] z-40 w-16 h-16" strokeWidth={2.5} />
                      ) : (
                        <Skull className="text-rose-500 drop-shadow-[0_4px_0_#000] animate-pulse z-40 w-16 h-16" strokeWidth={2.5} />
                      )
                    ) : (
                      <Shield className="text-emerald-400 drop-shadow-[0_4px_0_#000] z-40 w-16 h-16" fill="none" strokeWidth={3} />
                    )
                  ) : (
                    <span className={`font-black z-30 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] transition-all duration-300 ${isTargetedNow ? "text-5xl text-white opacity-0" : `text-4xl text-white opacity-90`}`}>
                      {room.id + 1}
                    </span>
                  )}

                  {isTargetedNow && !isRevealedRoom && (
                    <Crosshair className="absolute text-rose-500 drop-shadow-[0_0_20px_rgba(225,29,72,1)] animate-ping z-50 w-32 h-32" strokeWidth={3} />
                  )}

                  {isExploding && !isTargetedNow && (
                    <div className="absolute z-50 pointer-events-none flex items-center justify-center">
                      <div className={`w-32 h-32 rounded-full animate-ping border-[10px] border-black shadow-inner ${liveData.resultType === "commander" ? "bg-yellow-500" : liveData.resultType === "trap" ? "bg-purple-600" : "bg-rose-500"}`} />
                      <Flame size={60} className="absolute text-white animate-pulse drop-shadow-[3px_3px_0_#000]" />
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
}