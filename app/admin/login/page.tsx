import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-6 shadow-soft">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-cedar">Admin</p>
          <h1 className="mt-2 text-3xl font-bold">Sign in to manage configs</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use the owner email configured in `NEXT_PUBLIC_ADMIN_EMAIL`.
          </p>
        </div>
        {!isSupabaseConfigured() ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            Supabase environment variables are not configured yet. Copy `.env.example` to
            `.env.local` and add your project URL and anon key.
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
