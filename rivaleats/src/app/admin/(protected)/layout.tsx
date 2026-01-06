import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/supabase/auth-server";
import "../../globals.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await getServerAuthUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    redirect("/admin/login?error=not_admin");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 pb-12 pt-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Rival Eats · Admin
          </p>
          <h1 className="display text-3xl font-semibold text-charcoal">
            Back-of-house
          </h1>
          <p className="text-sm text-muted">
            Internal views for menu upkeep and order review. Access requires a
            Supabase user with metadata role set to &ldquo;admin&rdquo;.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-charcoal px-4 py-2 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream"
          >
            Public site
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-red/20 transition hover:-translate-y-0.5 hover:bg-[#a70f19]"
          >
            Admin home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
