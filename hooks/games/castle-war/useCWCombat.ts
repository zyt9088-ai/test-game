import { useState } from "react";
import { TOTAL_SOLDIERS, ROOMS_COUNT } from "@/hooks/useCastleWar"; // Constants

export function useCWCombat() {
  const [attackingTeam, setAttackingTeam] = useState<1 | 2>(1);
  const [hp1, setHp1] = useState(TOTAL_SOLDIERS);
  const [hp2, setHp2] = useState(TOTAL_SOLDIERS);
  const [revealed1, setRevealed1] = useState<boolean[]>(Array(ROOMS_COUNT).fill(false));
  const [revealed2, setRevealed2] = useState<boolean[]>(Array(ROOMS_COUNT).fill(false));
  const [resultMsg, setResultMsg] = useState("");
  const [resultType, setResultType] = useState<"hit" | "miss" | "trap" | "commander" | "idle" | "spy" | "team1Win" | "team2Win" | "draw">("idle");
  const [spyUsed1, setSpyUsed1] = useState(false);
  const [spyUsed2, setSpyUsed2] = useState(false);
  const [spiedTarget1, setSpiedTarget1] = useState<number | null>(null);
  const [spiedTarget2, setSpiedTarget2] = useState<number | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [explosionRoomIndexHit, setExplosionRoomIndexHit] = useState<number | null>(null);
  const [targetRoomIndex, setTargetRoomIndex] = useState<number | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);

  return {
    attackingTeam, setAttackingTeam,
    hp1, setHp1, hp2, setHp2,
    revealed1, setRevealed1, revealed2, setRevealed2,
    resultMsg, setResultMsg,
    resultType, setResultType,
    spyUsed1, setSpyUsed1, spyUsed2, setSpyUsed2,
    spiedTarget1, setSpiedTarget1, spiedTarget2, setSpiedTarget2,
    screenShake, setScreenShake,
    explosionRoomIndexHit, setExplosionRoomIndexHit,
    targetRoomIndex, setTargetRoomIndex,
    isAttacking, setIsAttacking
  };
}
