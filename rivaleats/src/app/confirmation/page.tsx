type ConfirmationPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const total = Array.isArray(searchParams.total)
    ? searchParams.total[0]
    : searchParams.total;
  const day = Array.isArray(searchParams.day) ? searchParams.day[0] : searchParams.day;

  return (
    <div className="space-y-6 rounded-3xl border border-border bg-white p-8 shadow-[var(--shadow-card)]">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">Confirmation</p>
      <h1 className="display text-3xl font-semibold text-charcoal">
        You&apos;re locked in.
      </h1>
      <p className="text-sm text-muted">
        We received your order. Expect a follow-up with payment instructions and
        exact timing. If you don&apos;t see an email within a few minutes, check
        spam or reach out.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Order total
          </p>
          <p className="display text-2xl font-semibold text-charcoal">
            {total ? `$${total}` : "Pending"}
          </p>
          <p className="text-xs text-muted">Due on delivery/pickup.</p>
        </div>
        <div className="rounded-2xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Selected day
          </p>
          <p className="display text-2xl font-semibold capitalize text-charcoal">
            {day || "Sunday or Monday"}
          </p>
          <p className="text-xs text-muted">We&apos;ll confirm the window.</p>
        </div>
        <div className="rounded-2xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Next steps
          </p>
          <p className="display text-lg font-semibold text-charcoal">
            Watch your inbox.
          </p>
          <p className="text-xs text-muted">
            Reply with any updates to allergies, delivery notes, or gate codes.
          </p>
        </div>
      </div>
    </div>
  );
}
