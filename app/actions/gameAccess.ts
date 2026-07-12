"use server";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

function getServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  
  // Fallback: manually parse .env.local if not loaded by Next.js yet
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    if (envConfig.SUPABASE_SERVICE_ROLE_KEY) {
      return envConfig.SUPABASE_SERVICE_ROLE_KEY;
    }
  } catch (e) {
    console.error("Could not parse .env.local dynamically:", e);
  }
  
  return null;
}

export async function consumeGameSessionAction(gameId: string, clientUserId: string, reason: string) {
  try {
    // 🛡️ حماية أمنية: التأكد من هوية المستخدم الحقيقية من الكوكيز (السيرفر)
    const supabaseServer = await getSupabaseServer();
    const { data: { user }, error } = await supabaseServer.auth.getUser();
    
    if (error || !user) {
      throw new Error("Unauthorized: Invalid session");
    }

    // الاعتماد على معرف المستخدم من الجلسة الموثقة في السيرفر وليس من المتصفح
    const userId = user.id;

    const serviceKey = getServiceRoleKey();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceKey || !url) {
      throw new Error("Missing Supabase credentials for Admin client");
    }

    const supabaseAdmin = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    });

    // 1. Fetch user_games record for this game
    const { data: userGame } = await supabaseAdmin
      .from("user_games")
      .select("games_played, is_purchased")
      .eq("user_id", userId)
      .eq("game_id", gameId)
      .maybeSingle();

    if (userGame) {
      await supabaseAdmin
        .from("user_games")
        .update({ games_played: (userGame.games_played || 0) + 1 })
        .eq("user_id", userId)
        .eq("game_id", gameId);
    } else {
      await supabaseAdmin
        .from("user_games")
        .insert({
          user_id: userId,
          game_id: gameId,
          games_played: 1,
          is_purchased: false,
        });
    }

    // 2. Deduct token if paid and not purchased
    if (reason === "paid") {
      // If the user already owns the game (lifetime), we shouldn't deduct a token.
      if (userGame?.is_purchased) {
        return { success: true };
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("available_tokens")
        .eq("id", userId)
        .maybeSingle();

      if (profile && (profile.available_tokens || 0) > 0) {
        await supabaseAdmin
          .from("profiles")
          .update({ available_tokens: profile.available_tokens - 1 })
          .eq("id", userId);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("consumeGameSessionAction Error:", err);
    return { success: false, error: "Failed to consume game session." };
  }
}

export async function fetchUserGamesAction(clientUserId: string) {
  try {
    // 🛡️ حماية أمنية
    const supabaseServer = await getSupabaseServer();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return [];
    
    const userId = user.id;

    const serviceKey = getServiceRoleKey();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceKey || !url) return [];

    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data } = await supabaseAdmin
      .from("user_games")
      .select("*")
      .eq("user_id", userId);

    return data || [];
  } catch (err) {
    console.error("fetchUserGamesAction Error:", err);
    return [];
  }
}

export async function fetchUserProfileAction(clientUserId: string) {
  try {
    // 🛡️ حماية أمنية
    const supabaseServer = await getSupabaseServer();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return null;
    
    const userId = user.id;

    const serviceKey = getServiceRoleKey();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceKey || !url) return null;

    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, available_tokens")
      .eq("id", userId)
      .maybeSingle();

    return data;
  } catch (err) {
    console.error("fetchUserProfileAction Error:", err);
    return null;
  }
}

export async function checkAccessAction(gameId: string) {
  try {
    const supabaseServer = await getSupabaseServer();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return { allowed: false, reason: "error" as const, availableTokens: 0 };
    }

    const userId = user.id;
    const serviceKey = getServiceRoleKey();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceKey || !url) {
      return { allowed: false, reason: "error" as const, availableTokens: 0 };
    }

    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Get user profile for tokens
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("available_tokens")
      .eq("id", userId)
      .maybeSingle();

    const tokens = profile?.available_tokens || 0;

    // 2. Get user game record to check if THIS game is purchased
    const { data: userGame } = await supabaseAdmin
      .from("user_games")
      .select("is_purchased")
      .eq("user_id", userId)
      .eq("game_id", gameId)
      .maybeSingle();

    const isPurchased = userGame?.is_purchased || false;

    // Rule 1: Lifetime purchased
    if (isPurchased) {
      return { allowed: true, reason: "paid" as const, availableTokens: tokens };
    }

    // 3. Get TOTAL games played across ALL games to check global free trial
    const { data: allGames } = await supabaseAdmin
      .from("user_games")
      .select("games_played")
      .eq("user_id", userId);

    let totalGamesPlayed = 0;
    if (allGames) {
      totalGamesPlayed = allGames.reduce((acc: number, g: any) => acc + (g.games_played || 0), 0);
    }

    // Rule 2: Global Free Trial (only if they never played ANY game)
    if (totalGamesPlayed === 0) {
      return { allowed: true, reason: "free_trial" as const, availableTokens: tokens };
    }

    // Rule 3: Has Tokens
    if (tokens > 0) {
      return { allowed: true, reason: "paid" as const, availableTokens: tokens };
    }

    // Blocked
    return { allowed: false, reason: "no_tokens" as const, availableTokens: tokens };
  } catch (err) {
    console.error("checkAccessAction Error:", err);
    return { allowed: false, reason: "error" as const, availableTokens: 0 };
  }
}
