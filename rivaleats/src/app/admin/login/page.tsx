"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/auth-browser";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdmin = searchParams.get("error") === "not_admin";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase env vars are missing.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Rival Eats · Admin
          </p>
          <h1 className="display text-3xl font-semibold text-charcoal">
            Sign in
          </h1>
          
          {notAdmin && (
            <p className="text-sm font-semibold text-brand-red">
              Your account is not marked as admin. Update user metadata to
              proceed.
            </p>
          )}
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-semibold text-charcoal">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-charcoal">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-brand-red"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm font-semibold text-brand-red">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-red/20 transition hover:-translate-y-0.5 hover:bg-[#a70f19] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
