import Link from "next/link";
import { fetchMenuData } from "@/lib/menu";

export const revalidate = 900;

const sections: Record<"breakfast" | "dinner", string> = {
  breakfast: "Breakfast",
  dinner: "Dinner",
};

export default async function MenuPage() {
  const menu = await fetchMenuData();
  const lastUpdated = new Date(menu.lastUpdated).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">
          This week&apos;s menu
        </p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="display text-4xl font-semibold text-charcoal">
              Flavors built for the week.
            </h1>
            <p className="text-sm text-muted">
              Updated {lastUpdated}. Drop your order before Friday 7pm ET.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-red/25 transition hover:-translate-y-0.5 hover:bg-[#a70f19]"
            >
              Start order
            </Link>
            <Link
              href="/order#subscribe"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream"
            >
              Get updates
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {(["breakfast", "dinner"] as const).map((key) => {
          const items = menu.items.filter((item) => item.section === key);
          if (!items.length) return null;

          return (
            <section key={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="display text-2xl font-semibold text-charcoal">
                  {sections[key]}
                </h2>
                <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream">
                  {items.length} items
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="display text-xl font-semibold text-charcoal">
                          {item.name}
                        </h3>
                        {typeof item.price === "number" && item.price > 0 && (
                          <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-charcoal">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
