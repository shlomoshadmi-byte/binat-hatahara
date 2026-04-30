"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  if (!isSupabaseConfigured() || !url || !anonKey) {
    return null;
  }

  return createBrowserClient(url, anonKey);
}
