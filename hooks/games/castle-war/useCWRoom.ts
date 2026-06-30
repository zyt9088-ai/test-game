import { useState, useRef } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

import { TeamSetup } from "@/hooks/useCastleWar";

export function useCWRoom() {
  const supabase = getSupabaseBrowser();
  const [roomCode, setRoomCode] = useState("");
  const roomCodeRef = useRef("");
  const [joinUrl, setJoinUrl] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [team1Ready, setTeam1Ready] = useState(false);
  const [team2Ready, setTeam2Ready] = useState(false);
  const [team1Data, setTeam1Data] = useState<TeamSetup | null>(null);
  const [team2Data, setTeam2Data] = useState<TeamSetup | null>(null);

  return {
    supabase,
    roomCode, setRoomCode, roomCodeRef,
    joinUrl, setJoinUrl,
    linkCopied, setLinkCopied,
    team1Ready, setTeam1Ready,
    team2Ready, setTeam2Ready,
    team1Data, setTeam1Data,
    team2Data, setTeam2Data
  };
}
