import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/server";

const orderSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  contactPreference: z.enum(["email", "phone", "either"]),
  smsConsent: z.boolean().optional(),
  fulfillment: z.enum(["delivery", "pickup"]),
  deliveryDay: z.enum(["sunday", "monday"]),
  timeWindow: z.string(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  county: z.string().optional(),
  allergies: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  notes: z.string().optional(),
  basePrice: z.number(),
  deliveryFee: z.number(),
  outsideZoneFee: z.number(),
  outsideZoneAccepted: z.boolean(),
  afterCutoff: z.boolean(),
  scheduleNextWindow: z.boolean(),
  submissionSource: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const order = parsed.data;

  if (
    order.fulfillment === "delivery" &&
    (!order.addressLine1 || !order.city || !order.state || !order.postalCode)
  ) {
    return NextResponse.json(
      { error: "Address is required for delivery orders." },
      { status: 400 }
    );
  }

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        message:
          "Supabase environment variables not set. Order accepted in dry-run mode.",
      },
      { status: 202 }
    );
  }

  const { error } = await supabase.from("orders").insert({
    full_name: order.fullName,
    email: order.email,
    phone: order.phone,
    contact_preference: order.contactPreference,
    sms_consent: order.smsConsent ?? false,
    fulfillment: order.fulfillment,
    delivery_day: order.deliveryDay,
    time_window: order.timeWindow,
    address_line1: order.addressLine1,
    address_line2: order.addressLine2,
    city: order.city,
    state: order.state,
    postal_code: order.postalCode,
    county: order.county,
    allergies: order.allergies,
    dietary_preferences: order.dietaryPreferences,
    notes: order.notes,
    base_price: order.basePrice,
    delivery_fee: order.deliveryFee,
    outside_zone_fee: order.outsideZoneFee,
    outside_zone_accepted: order.outsideZoneAccepted,
    after_cutoff: order.afterCutoff,
    schedule_next_window: order.scheduleNextWindow,
    submission_source: order.submissionSource ?? "web",
  });

  if (error) {
    return NextResponse.json(
      { error: "Unable to save order", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
