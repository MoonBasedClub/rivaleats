import { NextResponse } from "next/server";
import { z } from "zod";
import { getAnonClient, getServiceRoleClient } from "@/lib/supabase/server";
import { logApiEvent } from "@/lib/monitoring";

const subscribeSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  contactPreference: z.enum(["email", "sms", "either"]).default("email"),
  smsConsent: z.boolean().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.phone && !data.smsConsent && data.contactPreference !== "email") {
    return NextResponse.json(
      { error: "SMS consent is required when selecting SMS updates." },
      { status: 400 }
    );
  }

  const supabase = getServiceRoleClient() ?? getAnonClient();
  if (!supabase) {
    const status = 202;
    logApiEvent({
      route: "/api/subscribe",
      status,
      message: "Dry-run subscribe: Supabase env vars missing",
      meta: { email: data.email },
    });
    return NextResponse.json(
      {
        ok: true,
        message:
          "Supabase environment variables not set. Subscription accepted in dry-run mode.",
      },
      { status }
    );
  }

  const { error } = await supabase.from("menu_signups").insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    contact_preference: data.contactPreference,
    sms_consent: data.smsConsent ?? false,
    source: "web",
  });

  if (error) {
    logApiEvent({
      route: "/api/subscribe",
      status: 500,
      message: "Unable to save signup",
      details: error.message,
      meta: { email: data.email },
    });
    return NextResponse.json(
      { error: "Unable to save signup", details: error.message },
      { status: 500 }
    );
  }

  logApiEvent({
    route: "/api/subscribe",
    status: 201,
    message: "Signup saved",
    meta: { email: data.email },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
