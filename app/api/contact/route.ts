import { NextResponse } from "next/server";

import {
  checkContactRateLimit,
  getClientIp,
} from "@/lib/contact/rate-limit";
import {
  HONEYPOT_FIELD,
  isHoneypotTriggered,
  parseContactBody,
} from "@/lib/contact/schema";
import { sendContactEmailIfConfigured } from "@/lib/contact/send-email";
import {
  CONTACT_MESSAGES,
  type ContactApiResponse,
} from "@/lib/contact/types";

export const runtime = "nodejs";

function json(body: ContactApiResponse, status: number) {
  return NextResponse.json(body, { status });
}

function honeypotFromRaw(raw: unknown): string | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  const value = (raw as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === "string" ? value : undefined;
}

/**
 * POST /api/contact
 *
 * Pipeline (fixed):
 * 1. Honeypot — if filled, return 200 { ok: true } without sending (bots learn less).
 * 2. Zod validation.
 * 3. Upstash rate limit by IP.
 * 4. Resend email.
 * 5. Typed JSON only — never stack traces.
 *
 * Missing Resend/Upstash env → 503 with generic client message.
 * Build succeeds without keys; only runtime requests need them.
 */
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(
      { ok: false, error: CONTACT_MESSAGES.invalidBody },
      400,
    );
  }

  // 1. Honeypot first — silent success; no validation feedback, no rate limit, no email.
  if (isHoneypotTriggered(honeypotFromRaw(raw))) {
    return json({ ok: true }, 200);
  }

  // 2. Validate body (Zod)
  const parsed = parseContactBody(raw);
  if (!parsed.ok) {
    return json(
      {
        ok: false,
        error: CONTACT_MESSAGES.validation,
        fields: parsed.errors,
      },
      400,
    );
  }

  const ip = getClientIp(request);
  let rate;
  try {
    rate = await checkContactRateLimit(ip);
  } catch {
    console.error("[contact] rate limit check failed");
    return json(
      { ok: false, error: CONTACT_MESSAGES.unavailable },
      503,
    );
  }

  if ("misconfigured" in rate && rate.misconfigured) {
    return json(
      { ok: false, error: CONTACT_MESSAGES.unavailable },
      503,
    );
  }

  if (!rate.ok) {
    return json(
      { ok: false, error: CONTACT_MESSAGES.rateLimit },
      429,
    );
  }

  try {
    const sent = await sendContactEmailIfConfigured({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });

    if ("misconfigured" in sent && sent.misconfigured) {
      return json(
        { ok: false, error: CONTACT_MESSAGES.unavailable },
        503,
      );
    }

    if (!sent.ok) {
      return json(
        { ok: false, error: CONTACT_MESSAGES.unavailable },
        502,
      );
    }

    return json({ ok: true }, 200);
  } catch {
    console.error("[contact] send failed unexpectedly");
    return json(
      { ok: false, error: CONTACT_MESSAGES.unavailable },
      503,
    );
  }
}
