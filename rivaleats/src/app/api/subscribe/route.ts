import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceRoleClient } from "@/lib/supabase/server";

const subscribeSchema = z.object({
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

  const supabase = getServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        message:
          "Supabase environment variables not set. Subscription accepted in dry-run mode.",
      },
      { status: 202 }
    );
  }

  const { error } = await supabase.from("menu_signups").insert({
    email: data.email,
    phone: data.phone,
    contact_preference: data.contactPreference,
    sms_consent: data.smsConsent ?? false,
    source: "web",
  });

  if (error) {
    return NextResponse.json(
      { error: "Unable to save signup", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
