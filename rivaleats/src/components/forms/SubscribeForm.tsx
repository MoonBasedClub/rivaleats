'use client';

import { FormEvent, useState } from "react";

type SubscribePayload = {
  email: string;
  phone?: string;
  contactPreference: "email" | "sms" | "either";
  smsConsent: boolean;
};

function validate(payload: SubscribePayload) {
  if (!payload.email) return "Email is required.";
  if (payload.phone && !payload.smsConsent && payload.contactPreference !== "email") {
    return "Please consent to SMS if phone is provided and SMS is selected.";
  }
  return null;
}

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPreference, setContactPreference] =
    useState<SubscribePayload["contactPreference"]>("email");
  const [smsConsent, setSmsConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    const payload: SubscribePayload = {
      email: email.trim(),
      phone: phone.trim() || undefined,
      contactPreference,
      smsConsent,
    };

    const error = validate(payload);
    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Try again.");
      }

      setStatus("success");
      setMessage("You’re on the list. We’ll send weekly menu updates.");
      setEmail("");
      setPhone("");
      setContactPreference("email");
      setSmsConsent(false);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Unable to save. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 ${compact ? "" : "rounded-2xl border border-border bg-white p-4 shadow-sm"}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="flex-1 text-sm font-semibold text-charcoal">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
        {!compact && (
          <label className="flex-1 text-sm font-semibold text-charcoal">
            Phone (optional)
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="555-123-4567"
              className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
            />
          </label>
        )}
      </div>

      {!compact && (
        <div className="flex flex-col gap-2 text-sm font-semibold text-charcoal sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-muted">
              <input
                type="radio"
                name="contactPreference"
                value="email"
                checked={contactPreference === "email"}
                onChange={() => setContactPreference("email")}
              />
              Email
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-muted">
              <input
                type="radio"
                name="contactPreference"
                value="sms"
                checked={contactPreference === "sms"}
                onChange={() => setContactPreference("sms")}
              />
              SMS
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-muted">
              <input
                type="radio"
                name="contactPreference"
                value="either"
                checked={contactPreference === "either"}
                onChange={() => setContactPreference("either")}
              />
              Either
            </label>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-muted">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
            />
            SMS consent (for phone updates)
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-green/25 transition hover:-translate-y-0.5 hover:bg-[#267226] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Saving..." : "Get the weekly menu"}
      </button>
      {message && (
        <p
          className={`text-xs ${status === "error" ? "text-brand-red" : "text-charcoal"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
