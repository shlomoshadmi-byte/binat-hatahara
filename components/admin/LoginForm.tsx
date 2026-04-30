"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setIsSubmitting(false);
      return;
    }

    const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage("Check your email for the magic sign-in link.");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-600">Owner email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="focus-ring w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="you@example.com"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cedar px-4 py-3 font-bold text-white transition hover:bg-cedar/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mail size={18} />
        {isSubmitting ? "Sending link..." : "Send magic link"}
      </button>
      {message && <p className="rounded-2xl bg-cedar/10 p-3 text-sm font-semibold text-cedar">{message}</p>}
      {error && <p className="rounded-2xl bg-berry/10 p-3 text-sm font-semibold text-berry">{error}</p>}
    </form>
  );
}
