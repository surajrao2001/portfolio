import { z } from "zod";

/** Max lengths — keep email bodies tight and discourage abuse. */
export const CONTACT_NAME_MAX = 100;
export const CONTACT_EMAIL_MAX = 254;
export const CONTACT_MESSAGE_MAX = 5000;
export const CONTACT_MESSAGE_MIN = 10;

/**
 * Honeypot field name: looks like a real form control bots fill.
 * Do not rename to "honeypot" — that telegraphs the trap.
 */
export const HONEYPOT_FIELD = "website" as const;

export const contactBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(CONTACT_NAME_MAX, `Name must be at most ${CONTACT_NAME_MAX} characters`),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(CONTACT_EMAIL_MAX, `Email must be at most ${CONTACT_EMAIL_MAX} characters`)
    .email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_MESSAGE_MIN,
      `Message must be at least ${CONTACT_MESSAGE_MIN} characters`,
    )
    .max(
      CONTACT_MESSAGE_MAX,
      `Message must be at most ${CONTACT_MESSAGE_MAX} characters`,
    ),
  /** Bots fill this; humans never see it. Empty or missing is fine. */
  [HONEYPOT_FIELD]: z.string().optional().default(""),
});

export type ContactBody = z.infer<typeof contactBodySchema>;

export type ContactFields = Pick<ContactBody, "name" | "email" | "message">;

/**
 * True when the honeypot looks filled — treat as bot.
 * Empty string and whitespace-only are ignored (trim after parse default).
 */
export function isHoneypotTriggered(
  value: string | undefined | null,
): boolean {
  if (value == null) return false;
  return value.trim().length > 0;
}

export type ContactParseResult =
  | { ok: true; data: ContactBody; honeypot: boolean }
  | { ok: false; errors: Record<string, string[]> };

/**
 * Parse and validate raw JSON body. On success, `honeypot` indicates silent reject.
 */
export function parseContactBody(raw: unknown): ContactParseResult {
  const result = contactBodySchema.safeParse(raw);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errors: Record<string, string[]> = {};
    for (const [key, messages] of Object.entries(fieldErrors)) {
      if (messages && messages.length > 0) {
        errors[key] = messages;
      }
    }
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: result.data,
    honeypot: isHoneypotTriggered(result.data[HONEYPOT_FIELD]),
  };
}
