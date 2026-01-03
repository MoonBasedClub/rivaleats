import Link from "next/link";
import { SubscribeForm } from "@/components/forms/SubscribeForm";

const highlights = [
  { label: "Base package", value: "$79.99 / week" },
  { label: "Delivery windows", value: "Sunday / Monday" },
  { label: "Pickup option", value: "No delivery fee" },
  { label: "Delivery fee", value: "+$10 (Broward)" },
];

const steps = [
  {
    title: "Pick your drop",
    body: "Choose delivery or pickup, Sunday or Monday. Select the window that fits your rhythm.",
  },
  {
    title: "Tell us how you eat",
    body: "Share allergies, dietary preferences, and notes so every bite feels intentional.",
  },
  {
    title: "Checkout without the chaos",
    body: "Submit the weekly package. We'll confirm, coordinate, and handle payment instructions.",
  },
];

const faqs = [
  {
    q: "When do orders lock?",
    a: "Friday 7pm ET. After that, we'll prompt you to schedule for the next delivery window.",
  },
  {
    q: "Where do you deliver?",
    a: "Broward is standard. Outside Broward may carry an additional charge; address check happens in the order form.",
  },
  {
    q: "What about payment?",
    a: "No online payments yet. Submit the order and we'll share payment instructions in the confirmation.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl bg-soft-card shadow-[var(--shadow-card)]">
        <div className="relative grid gap-10 px-6 py-12 sm:grid-cols-[1.1fr_0.9fr] sm:px-10 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(47,143,47,0.08),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(193,18,31,0.1),transparent_32%)]" />
          <div className="relative z-10 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-charcoal px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream">
              Weekly drop
              <span className="h-2 w-2 rounded-full bg-brand-green" />
            </p>
            <h1 className="display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
              Rival Eats brings the heat to your week.
            </h1>
            <p className="text-lg text-muted sm:text-xl">
              Elevated meals, zero fuss. Lock in the weekly package, choose
              delivery or pickup, and set your notesso every plate lands the way
              you like it.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/order"
                className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-red/25 transition hover:-translate-y-0.5 hover:bg-[#a70f19]"
              >
                Order this week
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full border border-charcoal px-6 py-3 text-base font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream"
              >
                See this week&apos;s menu
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {item.label}
                  </p>
                  <p className="display text-xl font-semibold text-charcoal">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <div className="h-full rounded-3xl border border-border bg-ink px-6 py-8 text-cream shadow-2xl shadow-brand-red/15">
              <p className="display text-xl font-semibold">Delivery & Pickup</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#dfd8ca]">
                <li>- Delivery windows: Sunday or Monday (+$10 delivery)</li>
                <li>- Pickup: skip the delivery fee</li>
                <li>- Outside Broward? We'll flag an additional charge before you submit.</li>
                <li>- After Friday 7pm ET, we schedule your order for the next window.</li>
              </ul>
              <div className="mt-8 rounded-2xl bg-charcoal/70 p-4 text-sm text-[#f3e9d9]">
                <p className="font-semibold text-white">Weekly menu drop</p>
                <p>Join the list for the latest menu and pickup/delivery updates.</p>
                <div className="mt-4">
                  <SubscribeForm compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              How it works
            </p>
            <h2 className="display text-3xl font-semibold text-charcoal">
              A fast glide from craving to table.
            </h2>
          </div>
          <Link
            href="/order"
            className="hidden rounded-full border border-charcoal px-4 py-2 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream sm:inline-flex"
          >
            Start an order
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-white p-5 shadow-[0_14px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {idx + 1}
              </div>
              <p className="display text-lg font-semibold text-charcoal">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-border bg-white px-6 py-10 shadow-[var(--shadow-card)] sm:grid-cols-2 sm:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">
            Service area
          </p>
          <h3 className="display text-2xl font-semibold text-charcoal">
            Broward delivery, pickup friendly.
          </h3>
          <p className="mt-2 text-sm text-muted">
            Delivery fee is $10 inside our standard Broward zone. Outside
            Broward, well show you an additional charge before you submitno
            surprises.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p> Delivery windows: Sunday or Monday</p>
            <p> Cutoff: Friday 7pm ET</p>
            <p> Address check + dietary notes captured in the form</p>
          </div>
        </div>
        <div className="rounded-2xl bg-cream p-5">
          <p className="display text-lg font-semibold text-charcoal">
            Stay in the loop
          </p>
          <p className="text-sm text-muted">
            Get the weekly menu drop and a nudge before the Friday cutoff.
          </p>
          <div className="mt-4">
            <SubscribeForm />
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="display text-lg font-semibold text-charcoal">
              {item.q}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
