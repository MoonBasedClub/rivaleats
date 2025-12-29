import Link from "next/link";
import { OrderForm } from "@/components/forms/OrderForm";
import { SubscribeForm } from "@/components/forms/SubscribeForm";

export default function OrderPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">
          Weekly order
        </p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="display text-4xl font-semibold text-charcoal">
              Order the Weekly Full Package.
            </h1>
            <p className="text-sm text-muted">
              Lock in your meals. Delivery windows Sunday/Monday. Pickup
              available. Delivery +$10.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-charcoal px-4 py-2 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream"
          >
            View this week&apos;s menu
          </Link>
        </div>
      </div>

      <OrderForm />

      <div id="subscribe" className="grid gap-6 rounded-3xl border border-border bg-white px-6 py-8 shadow-[var(--shadow-card)] sm:grid-cols-[1fr_0.9fr] sm:px-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Stay updated
          </p>
          <h2 className="display text-2xl font-semibold text-charcoal">
            Weekly menu drop + cutoff reminders.
          </h2>
          <p className="text-sm text-muted">
            Add your email (and phone if you want SMS). We’ll send the menu and
            remind you before the Friday 7pm ET cutoff.
          </p>
        </div>
        <SubscribeForm />
      </div>
    </div>
  );
}
