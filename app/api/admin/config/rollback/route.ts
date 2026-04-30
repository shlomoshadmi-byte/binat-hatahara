import { NextRequest, NextResponse } from "next/server";
import { rollbackToVersion } from "@/lib/config/repository";
import { requireAdminForRoute } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const admin = await requireAdminForRoute();
  if (admin.response || !admin.supabase || !admin.user) {
    return admin.response ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { version?: number };
    if (!body.version || !Number.isInteger(body.version)) {
      return NextResponse.json({ error: "A numeric version is required." }, { status: 400 });
    }

    const active = await rollbackToVersion(admin.supabase, body.version, admin.user.id);
    return NextResponse.json(active);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
