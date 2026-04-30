import { NextResponse } from "next/server";
import { getAdminEmail } from "./env";
import { createSupabaseServerClient } from "./server";

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { supabase: null, user: null, error: "Supabase is not configured." };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return { supabase, user: null, error: "You must be signed in." };
  }

  const adminEmail = getAdminEmail();
  if (adminEmail && user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    return { supabase, user: null, error: "This account is not the configured owner." };
  }

  return { supabase, user, error: null };
}

export async function requireAdminForRoute() {
  const admin = await getCurrentAdmin();
  if (!admin.supabase || !admin.user) {
    return {
      ...admin,
      response: NextResponse.json({ error: admin.error }, { status: 401 }),
    };
  }

  return { ...admin, response: null };
}
