import { Resend } from "resend";

import type { ContactFields } from "@/lib/contact/schema";

export type SendContactEmailResult =
  | { ok: true; id: string }
  | { ok: false; misconfigured: true }
  | { ok: false; error: string };

export type ContactEmailConfig = {
  apiKey: string;
  to: string;
  from: string;
};

export function getContactEmailConfig(): ContactEmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

/** Escape text for safe inclusion in a simple HTML email body. */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildContactEmailContent(fields: ContactFields): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `Portfolio contact from ${fields.name}`;
  const text = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    "",
    fields.message,
  ].join("\n");

  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>`,
    `<p><strong>Message:</strong></p>`,
    `<p>${escapeHtml(fields.message).replaceAll("\n", "<br />")}</p>`,
  ].join("\n");

  return { subject, text, html };
}

/**
 * Send contact mail via Resend. Returns misconfigured when env/config is missing.
 * Does not log API keys or full message bodies.
 */
export async function sendContactEmail(
  fields: ContactFields,
  config?: ContactEmailConfig | null,
): Promise<SendContactEmailResult> {
  const resolved = config ?? getContactEmailConfig();
  if (!resolved) {
    return { ok: false, misconfigured: true };
  }

  const { subject, text, html } = buildContactEmailContent(fields);
  const resend = new Resend(resolved.apiKey);

  const { data, error } = await resend.emails.send({
    from: resolved.from,
    to: resolved.to,
    replyTo: fields.email,
    subject,
    text,
    html,
  });

  if (error) {
    // Generic log — no API key, no full PII dump
    console.error("[contact] Resend send failed:", error.name ?? "error");
    return { ok: false, error: "delivery_failed" };
  }

  return { ok: true, id: data?.id ?? "unknown" };
}

/**
 * Resolve config then send. Prefer this from the route so missing env is explicit.
 */
export async function sendContactEmailIfConfigured(
  fields: ContactFields,
): Promise<SendContactEmailResult> {
  const config = getContactEmailConfig();
  if (!config) {
    return { ok: false, misconfigured: true };
  }
  return sendContactEmail(fields, config);
}
