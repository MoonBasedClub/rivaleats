'use client';

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DELIVERY_FEE,
  OUTSIDE_ZONE_FEE,
  WEEKLY_BASE_PRICE,
  CUTOFF_DAY,
  CUTOFF_HOUR_ET,
} from "@/lib/constants";

type Fulfillment = "delivery" | "pickup";
type ContactPref = "email" | "phone" | "either";

const timeWindows = [
  "8:00am - 10:00am",
  "10:00am - 12:00pm",
  "12:00pm - 2:00pm",
  "4:00pm - 6:00pm",
];

function getEasternNow() {
  const now = new Date();
  const estString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(estString);
}

function isAfterCutoff() {
  const nowET = getEasternNow();
  const day = nowET.getDay();
  const hour = nowET.getHours();
  if (day > CUTOFF_DAY) return true;
  if (day === CUTOFF_DAY && hour >= CUTOFF_HOUR_ET) return true;
  return false;
}

function isOutsideZone(postalCode?: string, county?: string, state?: string) {
  const zip = postalCode?.trim();
  const normalizedCounty = county?.toLowerCase().trim();
  const normalizedState = state?.toLowerCase().trim();

  // Allow FL + Broward indicators or common Broward zip prefixes (330xx, 333xx).
  if (normalizedCounty && normalizedCounty.includes("broward")) return false;
  if (zip && /^(330|333)/.test(zip)) return false;
  if (normalizedState && normalizedState !== "fl") return true;
  if (zip) return true; // Any other zip marks as outside until confirmed.
  return false;
}

export function OrderForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [deliveryDay, setDeliveryDay] = useState<"sunday" | "monday">("sunday");
  const [timeWindow, setTimeWindow] = useState(timeWindows[2]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPreference, setContactPreference] =
    useState<ContactPref>("email");
  const [smsConsent, setSmsConsent] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("FL");
  const [postalCode, setPostalCode] = useState("");
  const [county, setCounty] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState("");
  const [notes, setNotes] = useState("");
  const [outsideZoneAccepted, setOutsideZoneAccepted] = useState(false);
  const [scheduleNextWindow, setScheduleNextWindow] = useState(false);

  const afterCutoff = useMemo(() => isAfterCutoff(), []);
  const outsideZone = useMemo(
    () => fulfillment === "delivery" && isOutsideZone(postalCode, county, state),
    [postalCode, county, state, fulfillment]
  );

  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const outsideFee = outsideZone && outsideZoneAccepted ? OUTSIDE_ZONE_FEE : 0;
  const total = WEEKLY_BASE_PRICE + deliveryFee + outsideFee;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    if (!fullName || !email) {
      setStatus("error");
      setMessage("Name and email are required.");
      return;
    }

    if (fulfillment === "delivery" && (!addressLine1 || !city || !state || !postalCode)) {
      setStatus("error");
      setMessage("Please complete the delivery address.");
      return;
    }

    if (afterCutoff && !scheduleNextWindow) {
      setStatus("error");
      setMessage("Cutoff reached. Confirm scheduling for the next window to continue.");
      return;
    }

    if (outsideZone && !outsideZoneAccepted) {
      setStatus("error");
      setMessage("Please confirm the outside-zone delivery fee to continue.");
      return;
    }

    setStatus("loading");
    try {
      const payload = {
        fullName,
        email,
        phone: phone || undefined,
        contactPreference,
        smsConsent,
        fulfillment,
        deliveryDay,
        timeWindow,
        addressLine1: fulfillment === "delivery" ? addressLine1 : undefined,
        addressLine2: fulfillment === "delivery" ? addressLine2 : undefined,
        city: fulfillment === "delivery" ? city : undefined,
        state: fulfillment === "delivery" ? state : undefined,
        postalCode: fulfillment === "delivery" ? postalCode : undefined,
        county: fulfillment === "delivery" ? county : undefined,
        allergies: allergies || undefined,
        dietaryPreferences: dietaryPreferences || undefined,
        notes: notes || undefined,
        basePrice: WEEKLY_BASE_PRICE,
        deliveryFee,
        outsideZoneFee: outsideFee,
        outsideZoneAccepted,
        afterCutoff,
        scheduleNextWindow: afterCutoff ? scheduleNextWindow : false,
        submissionSource: "web-order",
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Unable to submit order. Try again.");
      }

      router.push(`/confirmation?total=${total.toFixed(2)}&day=${deliveryDay}`);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setStatus((prev) => (prev === "loading" ? "idle" : prev));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">
          Package
        </p>
        <h1 className="display text-3xl font-semibold text-charcoal">
          Weekly Full Package — $79.99
        </h1>
        <p className="text-sm text-muted">
          Delivery +$10. Pickup is free. Outside Broward adds an additional fee
          before you confirm.
        </p>
      </div>

      {afterCutoff && (
        <div className="rounded-2xl border border-brand-red/40 bg-[#fef1f1] p-4 text-sm text-charcoal">
          <p className="display text-lg font-semibold text-brand-red">
            Past the Friday 7pm ET cutoff.
          </p>
          <p>
            We can schedule this for the next delivery window. Confirm below to
            continue.
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={scheduleNextWindow}
              onChange={(e) => setScheduleNextWindow(e.target.checked)}
            />
            Yes, schedule for the next window.
          </label>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-charcoal">
          Full name
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Phone (optional)
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Contact preference
          <select
            value={contactPreference}
            onChange={(e) => setContactPreference(e.target.value as ContactPref)}
            className="mt-1 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="either">Either</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-charcoal">
          <input
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
          />
          SMS consent (for phone updates)
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Fulfillment
          </p>
          <div className="mt-2 space-y-2 text-sm font-semibold text-charcoal">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="fulfillment"
                value="delivery"
                checked={fulfillment === "delivery"}
                onChange={() => setFulfillment("delivery")}
              />
              Delivery (+$10)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="fulfillment"
                value="pickup"
                checked={fulfillment === "pickup"}
                onChange={() => setFulfillment("pickup")}
              />
              Pickup (no fee)
            </label>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Delivery day
          </p>
          <div className="mt-2 space-y-2 text-sm font-semibold text-charcoal">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery-day"
                value="sunday"
                checked={deliveryDay === "sunday"}
                onChange={() => setDeliveryDay("sunday")}
              />
              Sunday
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery-day"
                value="monday"
                checked={deliveryDay === "monday"}
                onChange={() => setDeliveryDay("monday")}
              />
              Monday
            </label>
          </div>
        </div>
        <label className="rounded-2xl border border-border bg-cream p-4 text-sm font-semibold text-charcoal">
          Time window
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red"
          >
            {timeWindows.map((window) => (
              <option key={window} value={window}>
                {window}
              </option>
            ))}
          </select>
        </label>
      </div>

      {fulfillment === "delivery" && (
        <div className="space-y-3 rounded-2xl border border-border bg-cream p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Delivery address
              </p>
              <p className="text-sm text-muted">
                We’ll flag outside-Broward addresses before you submit.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Address line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red"
            />
            <input
              type="text"
              placeholder="Address line 2 (optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red"
            />
            <div className="grid grid-cols-[0.6fr_1fr] gap-3">
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red"
              />
              <input
                type="text"
                placeholder="ZIP"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red"
              />
            </div>
            <input
              type="text"
              placeholder="County (helps zone check)"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red sm:col-span-2"
            />
          </div>
          {outsideZone && (
            <div className="rounded-xl border border-brand-red/40 bg-[#fef1f1] p-3 text-sm text-charcoal">
              <p className="font-semibold text-brand-red">
                Outside standard zone — continue with additional charge of $
                {OUTSIDE_ZONE_FEE.toFixed(2)}?
              </p>
              <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-charcoal">
                <input
                  type="checkbox"
                  checked={outsideZoneAccepted}
                  onChange={(e) => setOutsideZoneAccepted(e.target.checked)}
                />
                Yes, I accept the outside-zone fee if needed.
              </label>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="sm:col-span-1 text-sm font-semibold text-charcoal">
          Allergies
          <textarea
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Shellfish, nuts, dairy, etc."
            className="mt-1 h-20 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
        <label className="sm:col-span-1 text-sm font-semibold text-charcoal">
          Dietary preferences
          <textarea
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            placeholder="High protein, gluten-free, no pork, etc."
            className="mt-1 h-20 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
        <label className="sm:col-span-1 text-sm font-semibold text-charcoal">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Gate codes, cooler drop, pickup timing notes."
            className="mt-1 h-20 w-full rounded-xl border border-border bg-cream px-3 py-2 text-sm text-charcoal outline-none transition focus:border-brand-red focus:bg-white"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-cream p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Pricing summary
          </p>
          <div className="mt-3 space-y-2 text-sm text-charcoal">
            <div className="flex items-center justify-between">
              <span>Weekly Full Package</span>
              <span>${WEEKLY_BASE_PRICE.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery fee</span>
              <span>
                {deliveryFee > 0 ? `+$${deliveryFee.toFixed(2)}` : "Pickup (no fee)"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Outside-zone fee</span>
              <span>
                {outsideZone
                  ? outsideZoneAccepted
                    ? `+$${OUTSIDE_ZONE_FEE.toFixed(2)}`
                    : "Pending confirmation"
                  : "$0.00"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-lg font-semibold">
              <span>Total due (on delivery/pickup)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted">
              Payment instructions follow after submission.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-red/25 transition hover:-translate-y-0.5 hover:bg-[#a70f19] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Submitting..." : "Submit order"}
          </button>
          {message && (
            <p
              className={`text-sm ${
                status === "error" ? "text-brand-red" : "text-charcoal"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
