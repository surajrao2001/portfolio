"use client";

import { FormEvent, useId, useState } from "react";

import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import {
  CONTACT_EMAIL_MAX,
  CONTACT_MESSAGE_MAX,
  CONTACT_MESSAGE_MIN,
  CONTACT_NAME_MAX,
  HONEYPOT_FIELD,
} from "@/lib/contact/schema";
import { CONTACT_MESSAGES, type ContactApiResponse } from "@/lib/contact/types";
import { cn } from "@/lib/cn";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; fields?: Record<string, string[]> };

type FieldName = "name" | "email" | "message";

function clientFieldErrors(values: {
  name: string;
  email: string;
  message: string;
}): Record<string, string[]> | null {
  const errors: Record<string, string[]> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = ["Name is required"];
  else if (name.length > CONTACT_NAME_MAX) {
    errors.name = [`Name must be at most ${CONTACT_NAME_MAX} characters`];
  }

  if (!email) errors.email = ["Email is required"];
  else if (email.length > CONTACT_EMAIL_MAX) {
    errors.email = [`Email must be at most ${CONTACT_EMAIL_MAX} characters`];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Enter a valid email address"];
  }

  if (message.length < CONTACT_MESSAGE_MIN) {
    errors.message = [
      `Message must be at least ${CONTACT_MESSAGE_MIN} characters`,
    ];
  } else if (message.length > CONTACT_MESSAGE_MAX) {
    errors.message = [
      `Message must be at most ${CONTACT_MESSAGE_MAX} characters`,
    ];
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function fieldError(
  status: FormStatus,
  field: FieldName,
): string | undefined {
  if (status.kind !== "error" || !status.fields) return undefined;
  return status.fields[field]?.[0];
}

const inputClass =
  "mt-1.5 w-full rounded-md border border-ink/15 bg-surface-raised/80 px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60";

export function ContactForm() {
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const messageId = `${formId}-message`;
  const websiteId = `${formId}-website`;
  const statusId = `${formId}-status`;

  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
    };

    const localErrors = clientFieldErrors(values);
    if (localErrors) {
      setStatus({
        kind: "error",
        message: CONTACT_MESSAGES.validation,
        fields: localErrors,
      });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      let body: ContactApiResponse;
      try {
        body = (await res.json()) as ContactApiResponse;
      } catch {
        setStatus({
          kind: "error",
          message: CONTACT_MESSAGES.unavailable,
        });
        return;
      }

      if (body.ok) {
        form.reset();
        setStatus({
          kind: "success",
          message: CONTACT_MESSAGES.success,
        });
        return;
      }

      setStatus({
        kind: "error",
        message: body.error || CONTACT_MESSAGES.unavailable,
        fields: body.fields,
      });
    } catch {
      setStatus({
        kind: "error",
        message: CONTACT_MESSAGES.unavailable,
      });
    }
  }

  const submitting = status.kind === "submitting";
  const nameErr = fieldError(status, "name");
  const emailErr = fieldError(status, "email");
  const messageErr = fieldError(status, "message");

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative mt-10 space-y-6"
      aria-describedby={statusId}
    >
      {/* Honeypot: off-screen, not focusable, hidden from AT — bots may still fill "website". */}
      <div
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={websiteId}>Website</label>
        <input
          id={websiteId}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div>
        <label htmlFor={nameId} className="block text-sm font-medium text-ink">
          Name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_NAME_MAX}
          disabled={submitting}
          aria-invalid={nameErr ? true : undefined}
          aria-describedby={nameErr ? `${nameId}-error` : undefined}
          className={cn(inputClass, nameErr && "border-ink/40")}
        />
        {nameErr ? (
          <p id={`${nameId}-error`} className="mt-1.5 text-sm text-ink-muted">
            {nameErr}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={CONTACT_EMAIL_MAX}
          disabled={submitting}
          aria-invalid={emailErr ? true : undefined}
          aria-describedby={emailErr ? `${emailId}-error` : undefined}
          className={cn(inputClass, emailErr && "border-ink/40")}
        />
        {emailErr ? (
          <p id={`${emailId}-error`} className="mt-1.5 text-sm text-ink-muted">
            {emailErr}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={messageId}
          className="block text-sm font-medium text-ink"
        >
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={6}
          minLength={CONTACT_MESSAGE_MIN}
          maxLength={CONTACT_MESSAGE_MAX}
          disabled={submitting}
          aria-invalid={messageErr ? true : undefined}
          aria-describedby={messageErr ? `${messageId}-error` : undefined}
          placeholder="What are you trying to do?"
          className={cn(inputClass, "resize-y", messageErr && "border-ink/40")}
        />
        {messageErr ? (
          <p
            id={`${messageId}-error`}
            className="mt-1.5 text-sm text-ink-muted"
          >
            {messageErr}
          </p>
        ) : null}
      </div>

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="min-h-[1.25rem] text-sm"
      >
        {status.kind === "success" ? (
          <p className="text-accent">{status.message}</p>
        ) : null}
        {status.kind === "error" ? (
          <p className="text-ink-muted">{status.message}</p>
        ) : null}
        {status.kind === "submitting" ? (
          <p className="text-ink-muted">Sending…</p>
        ) : null}
      </div>

      <Magnetic>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </Button>
      </Magnetic>
    </form>
  );
}
