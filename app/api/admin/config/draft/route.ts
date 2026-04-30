import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { loadDraftConfig, saveDraftConfig } from "@/lib/config/repository";
import { requireAdminForRoute } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await requireAdminForRoute();
  if (admin.response || !admin.supabase) {
    return admin.response ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const draft = await loadDraftConfig(admin.supabase);
    return NextResponse.json(draft);
  } catch (error) {
    return routeError(error);
  }
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdminForRoute();
  if (admin.response || !admin.supabase || !admin.user) {
    return admin.response ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const draft = await saveDraftConfig(admin.supabase, body.config, admin.user.id);
    return NextResponse.json(draft);
  } catch (error) {
    return routeError(error);
  }
}

function routeError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Invalid configuration", issues: error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unknown error" },
    { status: 500 },
  );
}
