import { NextResponse } from "next/server";
import { loadActiveConfig } from "@/lib/config/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const activeConfig = await loadActiveConfig(supabase);

  return NextResponse.json(activeConfig, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
