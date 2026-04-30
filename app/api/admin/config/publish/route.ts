import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { publishDraftConfig } from "@/lib/config/repository";
import { requireAdminForRoute } from "@/lib/supabase/admin";

export async function POST() {
  const admin = await requireAdminForRoute();
  if (admin.response || !admin.supabase || !admin.user) {
    return admin.response ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const published = await publishDraftConfig(admin.supabase, admin.user.id);
    return NextResponse.json(published);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid draft configuration", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
