import { useEffect } from "react";
import { useDebounceCallback } from "@/lib/game/debounce";

export function useWDSync(ctx: any) {
  const debouncedSyncToSupabase = useDebounceCallback(async (payload: any) => {
    try {
      await ctx.supabase.from("wd_rooms").upsert(payload);
    } catch (e) {
      console.error("خطأ في المزامنة اللحظية:", e);
    }
  }, 400);

  useEffect(() => {
    if (!ctx.isInitialized || !ctx.roomCode) return;

    const cleanCountries = ctx.countries ? ctx.countries.map(({ questions, ...rest }: any) => rest) : [];

    const localSyncData = {
      roomCode: ctx.roomCode, spiedCountryId: ctx.spiedCountryId,
      gameState: ctx.gameState, team1Name: ctx.team1Name, team2Name: ctx.team2Name, score1: ctx.score1, score2: ctx.score2, turn: ctx.turn, countries: ctx.countries,
      selectedCountry: ctx.isAttacking && !ctx.selectedCountry?.activeQuestion ? null : ctx.selectedCountry,
      timer: ctx.timer, team1Choice: ctx.team1Choice, team2Choice: ctx.team2Choice, showResult: ctx.showResult, isAttacking: ctx.isAttacking, isQuestionRevealed: ctx.isQuestionRevealed,
      cards1: ctx.cards1, cards2: ctx.cards2, protectedCountries: ctx.protectedCountries, challengesUsed1: ctx.challengesUsed1, challengesUsed2: ctx.challengesUsed2,
      mapPosition: ctx.mapPosition, capitals: ctx.capitals, stolenCapitalAlert: ctx.stolenCapitalAlert, timestamp: Date.now()
    };
    localStorage.setItem("wd_live_sync", JSON.stringify(localSyncData));

    debouncedSyncToSupabase({
      room_code: ctx.roomCode,
      game_state: ctx.gameState,
      team1_name: ctx.team1Name,
      team2_name: ctx.team2Name,
      score1: ctx.score1,
      score2: ctx.score2,
      turn: ctx.turn,
      timer: ctx.timer,
      current_country_id: ctx.selectedCountry?.id || null,
      active_question: ctx.selectedCountry?.activeQuestion || null,
      team1_choice: ctx.team1Choice,
      team2_choice: ctx.team2Choice,
      show_result: ctx.showResult,
      is_attacking: ctx.isAttacking,
      is_question_revealed: ctx.isQuestionRevealed,
      cards1: ctx.cards1,
      cards2: ctx.cards2,
      protected_countries: ctx.protectedCountries,
      challenges_used1: ctx.challengesUsed1,
      challenges_used2: ctx.challengesUsed2,
      map_position: ctx.mapPosition,
      capitals: ctx.capitals,
      stolen_capital_alert: ctx.stolenCapitalAlert,
      spied_country_id: ctx.spiedCountryId,
      countries: cleanCountries,
      created_at: new Date().toISOString()
    });
  }, [
    ctx.gameState, ctx.team1Name, ctx.team2Name, ctx.score1, ctx.score2, ctx.turn, ctx.countries,
    ctx.selectedCountry, ctx.timer, ctx.team1Choice, ctx.team2Choice, ctx.showResult, ctx.isAttacking,
    ctx.isQuestionRevealed, ctx.cards1, ctx.cards2, ctx.protectedCountries, ctx.challengesUsed1,
    ctx.challengesUsed2, ctx.mapPosition, ctx.capitals, ctx.stolenCapitalAlert, ctx.spiedCountryId,
    ctx.isInitialized, ctx.supabase, ctx.roomCode
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ctx.isTimerRunning && ctx.timer > 0)
      interval = setInterval(() => ctx.setTimer((t: number) => t - 1), 1000);
    else if (ctx.timer === 0) ctx.setIsTimerRunning(false);
    return () => clearInterval(interval);
  }, [ctx.isTimerRunning, ctx.timer]);
}
