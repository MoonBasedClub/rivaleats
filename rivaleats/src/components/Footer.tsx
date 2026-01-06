import Link from "next/link";

const footerLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="display text-lg font-semibold tracking-tight">
            Rival Eats
          </p>
          <p className="text-sm text-[#d7d1c6]">
            Rival-Friendly Meals for Busy Weeks. Delivery & pickup across Broward.
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-[#b8b0a3]">
            Sunday / Monday windows - per-item ordering
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border/40 px-3 py-1 transition hover:-translate-y-0.5 hover:border-cream hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
