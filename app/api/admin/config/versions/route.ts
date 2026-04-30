import { NextResponse } from "next/server";
import { listConfigVersions } from "@/lib/config/repository";
import { requireAdminForRoute } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await requireAdminForRoute();
  if (admin.response || !admin.supabase) {
    return admin.response ?? NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const versions = await listConfigVersions(admin.supabase);
    return NextResponse.json({ versions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
