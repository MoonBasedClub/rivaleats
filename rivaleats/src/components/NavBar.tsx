import Link from "next/link";
import { LogoMark } from "./LogoMark";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/contact", label: "Contact / FAQ" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12">
            <LogoMark />
          </div>
          <div className="flex flex-col leading-tight text-charcoal">
            <span className="display text-lg font-semibold tracking-tight">
              Rival Eats
            </span>
            <span className="text-xs uppercase tracking-[0.22em] text-muted">
              Meal Experience
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/order"
          className="hidden rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-red/20 transition hover:-translate-y-0.5 hover:bg-[#a70f19] sm:inline-flex"
        >
          Order now
        </Link>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal sm:hidden"
          aria-label="Navigation (links visible on larger screens)"
        >
          <span className="text-xs font-semibold">Menu</span>
        </button>
      </div>
    </header>
  );
}
