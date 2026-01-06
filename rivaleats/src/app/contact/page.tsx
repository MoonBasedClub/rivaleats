import Link from "next/link";

const faqs = [
  {
    q: "When is the weekly cutoff?",
    a: "Friday 7pm ET. Past that time, orders schedule for the next delivery window.",
  },
  {
    q: "Do you offer pickup?",
    a: "Yes. Pickup avoids the $10 delivery fee. Select it in checkout and we'll share pickup details.",
  },
  {
    q: "What if I have allergies?",
    a: "Add allergies and dietary preferences in each item edit. We confirm before prep.",
  },
  {
    q: "Where do you deliver?",
    a: "Broward is standard. Outside Broward may carry an additional fee; address check is built into checkout.",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Contact</p>
        <h1 className="display text-4xl font-semibold text-charcoal">
          Need something clarified?
        </h1>
        <p className="text-sm text-muted">
          Drop your order, send a note, or ask a quick question. We respond fast
          during service hours.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Reach us
            </p>
            <p className="display text-xl font-semibold text-charcoal">
              hello@rivaleats.com
            </p>
            <p className="text-sm text-muted">
              Same-day responses during the week.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-red/25 transition hover:-translate-y-0.5 hover:bg-[#a70f19]"
            >
              Start checkout
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:-translate-y-0.5 hover:bg-charcoal hover:text-cream"
            >
              View menu
            </Link>
          </div>
          <div className="rounded-2xl bg-cream p-4 text-sm text-muted">
            <p className="font-semibold text-charcoal">Service area & timing</p>
            <p>Broward deliveries. Pickup available. Delivery windows Sunday/Monday.</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">FAQ</p>
          <div className="grid gap-3">
            {faqs.map((item) => (
              <article
                key={item.q}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <p className="display text-lg font-semibold text-charcoal">
                  {item.q}
                </p>
                <p className="text-sm leading-relaxed text-muted">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
