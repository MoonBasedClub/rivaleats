import Link from "next/link";

const cards = [
  {
    title: "Menu manager",
    href: "/admin/menu",
    body: "Review current items, add a dish, and keep pricing/sections tidy.",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    body: "Latest submissions with delivery vs pickup details and flags.",
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-soft-card p-6 shadow-[var(--shadow-card)]">
        <p className="text-sm text-muted">
          These views use server-side Supabase access. Make sure the service
          role key is set in the environment before relying on them in
          production.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-charcoal">
                {card.title}
              </h2>
              <span className="text-sm font-semibold text-brand-red transition group-hover:translate-x-1">
                View
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
