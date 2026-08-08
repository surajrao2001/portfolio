/**
 * Typed JSON shapes for POST /api/contact.
 * Never include stack traces or internal error details.
 */

export type ContactSuccessResponse = {
  ok: true;
};

export type ContactErrorResponse = {
  ok: false;
  error: string;
  /** Field-level validation messages when error is "validation". */
  fields?: Record<string, string[]>;
};

export type ContactApiResponse = ContactSuccessResponse | ContactErrorResponse;

/** Client-safe messages — same text for misconfigured and unexpected failures. */
export const CONTACT_MESSAGES = {
  success: "Message sent. I will get back to you.",
  validation: "Check the highlighted fields and try again.",
  rateLimit: "Too many messages from this network. Try again later.",
  unavailable:
    "Messaging is temporarily unavailable. Try again later or use another channel.",
  invalidBody: "Could not read that request. Refresh and try again.",
} as const;
