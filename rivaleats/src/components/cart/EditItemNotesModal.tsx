"use client";

import { useState } from "react";
import type { CartItemNotes } from "./CartProvider";

type EditItemNotesModalProps = {
  open: boolean;
  itemName: string;
  notes: CartItemNotes;
  onSave: (notes: CartItemNotes) => void;
  onClose: () => void;
};

export function EditItemNotesModal({
  open,
  itemName,
  notes,
  onSave,
  onClose,
}: EditItemNotesModalProps) {
  const [draft, setDraft] = useState<CartItemNotes>(notes);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Edit notes
            </p>
            <h3 className="display text-2xl font-semibold text-charcoal">
              {itemName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted transition hover:text-charcoal"
          >
            Close
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          <label className="text-sm font-semibold text-charcoal">
            Allergies
            <textarea
              value={draft.allergies}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, allergies: e.target.value }))
              }
              placeholder="Shellfish, nuts, dairy, etc."
              className="mt-1 h-20 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
            />
          </label>
          <label className="text-sm font-semibold text-charcoal">
            Dietary preferences
            <textarea
              value={draft.dietaryPreferences}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  dietaryPreferences: e.target.value,
                }))
              }
              placeholder="High protein, gluten-free, no pork, etc."
              className="mt-1 h-20 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
            />
          </label>
          <label className="text-sm font-semibold text-charcoal">
            Special requests
            <textarea
              value={draft.specialRequests}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
              }
              placeholder="Sauce on the side, extra napkins, etc."
              className="mt-1 h-20 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-cream"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-red/25 transition hover:-translate-y-0.5 hover:bg-[#a70f19]"
          >
            Save notes
          </button>
        </div>
      </div>
    </div>
  );
}
