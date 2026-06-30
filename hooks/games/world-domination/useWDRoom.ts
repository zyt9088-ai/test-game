import { useState, useEffect } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export function useWDRoom() {
  const supabase = getSupabaseBrowser();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [audienceUrl, setAudienceUrl] = useState<string>("");
  const [showAudienceModal, setShowAudienceModal] = useState<boolean>(false);

  return {
    supabase,
    roomCode, setRoomCode,
    isInitialized, setIsInitialized,
    audienceUrl, setAudienceUrl,
    showAudienceModal, setShowAudienceModal
  };
}
