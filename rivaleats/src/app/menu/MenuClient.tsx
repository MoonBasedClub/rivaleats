"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { EditItemNotesModal } from "@/components/cart/EditItemNotesModal";
import type { MenuData } from "@/lib/menu";

const sections: Record<"breakfast" | "dinner", string> = {
  breakfast: "Breakfast",
  dinner: "Dinner",
};

export function MenuClient({ menu }: { menu: MenuData }) {
  const { items, addItem, increment, decrement, updateNotes } = useCart();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const lastUpdated = useMemo(() => {
    return new Date(menu.lastUpdated).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [menu.lastUpdated]);

  const cartById = useMemo(() => {
    return items.reduce<Record<string, typeof items[number]>>((acc, item) => {
      acc[item.itemId] = item;
      return acc;
    }, {});
  }, [items]);

  const editingItem = editingItemId ? cartById[editingItemId] : null;
  const itemHasNotes = (itemId: string) => {
    const entry = cartById[itemId];
    if (!entry) return false;
    return Boolean(
      entry.notes.allergies ||
        entry.notes.dietaryPreferences ||
        entry.notes.specialRequests
    );
  };

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
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-red/25 transition hover:-translate-y-0.5 hover:bg-[#a70f19]"
            >
              Go to checkout
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream"
            >
              Get updates
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {(["breakfast", "dinner"] as const).map((key) => {
          const sectionItems = menu.items.filter((item) => item.section === key);
          if (!sectionItems.length) return null;

          return (
            <section key={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="display text-2xl font-semibold text-charcoal">
                  {sections[key]}
                </h2>
                <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream">
                  {sectionItems.length} items
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {sectionItems.map((item) => {
                  const cartItem = cartById[item.id];
                  const quantity = cartItem?.quantity ?? 0;
                  const price = typeof item.price === "number" ? item.price : 0;

                  return (
                    <article
                      key={item.id}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="display text-xl font-semibold text-charcoal">
                            {item.name}
                          </h3>
                          {price > 0 && (
                            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-charcoal">
                              ${price.toFixed(2)}
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

                      <div className="mt-4 flex items-center justify-end gap-2">
                        {quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() =>
                              addItem({ itemId: item.id, name: item.name, price })
                            }
                            aria-label={`Add ${item.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-base font-semibold text-cream transition hover:-translate-y-0.5 hover:bg-ink"
                          >
                            +
                          </button>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 rounded-full bg-cream px-2 py-1">
                              <button
                                type="button"
                                onClick={() => decrement(item.id)}
                                aria-label={`Decrease ${item.name}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-base font-semibold text-charcoal transition hover:bg-cream"
                              >
                                -
                              </button>
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-sm font-semibold text-charcoal">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => increment(item.id)}
                                aria-label={`Increase ${item.name}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-base font-semibold text-charcoal transition hover:bg-cream"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditingItemId(item.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-cream"
                            >
                              Edit
                              {itemHasNotes(item.id) && (
                                <span className="h-2 w-2 rounded-full bg-brand-red" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {editingItem && (
        <EditItemNotesModal
          key={editingItem.itemId}
          open={Boolean(editingItem)}
          itemName={editingItem.name}
          notes={editingItem.notes}
          onClose={() => setEditingItemId(null)}
          onSave={(notes) => {
            updateNotes(editingItem.itemId, notes);
            setEditingItemId(null);
          }}
        />
      )}
    </div>
  );
}
