import { useState } from "react";

export function useCWGameFlow() {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "gameOver">("lobby");
  const [isLoading, setIsLoading] = useState(true);
  const [team1Name, setTeam1Name] = useState("الفريق الأول");
  const [team2Name, setTeam2Name] = useState("الفريق الثاني");
  const [turn, setTurn] = useState<1 | 2>(1);
  const [battleStep, setBattleStep] = useState<"roll" | "challenge" | "target" | "trapChoice" | "result">("roll");

  return {
    gameState, setGameState,
    isLoading, setIsLoading,
    team1Name, setTeam1Name,
    team2Name, setTeam2Name,
    turn, setTurn,
    battleStep, setBattleStep
  };
}
