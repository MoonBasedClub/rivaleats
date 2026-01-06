import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnonClient, getServiceRoleClient } from "@/lib/supabase/server";
import { logApiEvent } from "@/lib/monitoring";

const orderSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  contactPreference: z.enum(["email", "phone", "either"]).optional(),
  smsConsent: z.boolean().optional(),
  fulfillment: z.enum(["delivery", "pickup"]),
  deliveryDay: z.enum(["sunday", "monday"]),
  timeWindow: z.string(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  cartItems: z
    .array(
      z.object({
        itemId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().int().positive(),
        notes: z.object({
          allergies: z.string(),
          dietaryPreferences: z.string(),
          specialRequests: z.string(),
        }),
      })
    )
    .min(1),
  subtotal: z.number(),
  deliveryFee: z.number(),
  outsideZoneFee: z.number(),
  outsideZoneAccepted: z.boolean().optional(),
  afterCutoff: z.boolean(),
  scheduleNextWindow: z.boolean(),
  submissionSource: z.string().optional(),
});

function getEasternNow() {
  const now = new Date();
  const estString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(estString);
}

function getScheduledWeekStart(
  deliveryDay: "sunday" | "monday",
  afterCutoff: boolean,
  scheduleNextWindow: boolean
) {
  const nowET = getEasternNow();
  const day = nowET.getDay();
  const daysUntilSunday = (7 - day) % 7;
  const sunday = new Date(nowET);
  sunday.setDate(nowET.getDate() + daysUntilSunday);

  if (afterCutoff && scheduleNextWindow) {
    sunday.setDate(sunday.getDate() + 7);
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const scheduledWeekStart = formatter.format(sunday);

  if (deliveryDay === "monday") {
    return scheduledWeekStart;
  }

  return scheduledWeekStart;
}

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
  const totalPrice =
    order.subtotal + order.deliveryFee + order.outsideZoneFee;
  const scheduledWeekStart = getScheduledWeekStart(
    order.deliveryDay,
    order.afterCutoff,
    order.scheduleNextWindow
  );

  if (
    order.fulfillment === "delivery" &&
    (!order.addressLine1 || !order.city || !order.state || !order.postalCode)
  ) {
    return NextResponse.json(
      { error: "Address is required for delivery orders." },
      { status: 400 }
    );
  }

  const supabase = getServiceRoleClient() ?? getAnonClient();
  if (!supabase) {
    const status = 202;
    logApiEvent({
      route: "/api/order",
      status,
      message: "Dry-run order: Supabase env vars missing",
      meta: { email: order.email },
    });
    return NextResponse.json(
      {
        ok: true,
        message:
          "Supabase environment variables not set. Order accepted in dry-run mode.",
      },
      { status }
    );
  }

  const { error } = await supabase.from("orders").insert({
    customer_name: order.fullName,
    email: order.email,
    phone: order.phone,
    contact_preference: order.contactPreference ?? "email",
    sms_consent: order.smsConsent ?? false,
    delivery_type: order.fulfillment,
    delivery_day: order.deliveryDay,
    time_window: order.timeWindow,
    address_line1: order.addressLine1,
    address_line2: order.addressLine2,
    city: order.city,
    state: order.state,
    zip: order.postalCode,
    notes: order.notes,
    package_price: order.subtotal,
    delivery_fee: order.deliveryFee,
    out_of_zone_fee: order.outsideZoneFee,
    outside_zone_accepted: order.outsideZoneAccepted ?? false,
    total_price: totalPrice,
    is_late_order: order.afterCutoff,
    scheduled_week_start: scheduledWeekStart,
    cart_items: order.cartItems,
    submission_source: order.submissionSource ?? "web",
  });

  if (error) {
    logApiEvent({
      route: "/api/order",
      status: 500,
      message: "Unable to save order",
      details: error.message,
      meta: { email: order.email },
    });
    return NextResponse.json(
      { error: "Unable to save order", details: error.message },
      { status: 500 }
    );
  }

  logApiEvent({
    route: "/api/order",
    status: 201,
    message: "Order saved",
    meta: { email: order.email, fulfillment: order.fulfillment },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
