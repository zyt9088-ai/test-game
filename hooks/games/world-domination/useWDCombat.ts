import { useState } from "react";

export function useWDCombat() {
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [isQuestionRevealed, setIsQuestionRevealed] = useState<boolean>(false);
  const [team1Choice, setTeam1Choice] = useState<string | null>(null);
  const [team2Choice, setTeam2Choice] = useState<string | null>(null);
  const [challengesUsed1, setChallengesUsed1] = useState<number>(0);
  const [challengesUsed2, setChallengesUsed2] = useState<number>(0);

  return {
    isAttacking, setIsAttacking,
    isQuestionRevealed, setIsQuestionRevealed,
    team1Choice, setTeam1Choice,
    team2Choice, setTeam2Choice,
    challengesUsed1, setChallengesUsed1,
    challengesUsed2, setChallengesUsed2
  };
}
