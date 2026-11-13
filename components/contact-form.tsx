"use client";

import Script from "next/script";
import { type FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  budgetOptions,
  type ContactFieldErrors,
  type ContactFields,
  contactLimits,
  needOptions,
  timingOptions,
  validateContact,
} from "@/lib/contact";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Inlined at build time. When unset, the Turnstile script is never loaded.
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };

const empty: ContactFields = { name: "", email: "", business: "", need: "", budget: "", timing: "", message: "", website: "" };

const inputBase =
  "mt-2 block w-full min-h-12 rounded-[8px] border bg-background px-3.5 py-2.5 text-base text-ink placeholder:text-muted/80 transition-colors focus-visible:border-accent disabled:opacity-60";

export function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState<ContactFields>(empty);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFields, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [token, setToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the confirmation so screen readers announce it and keyboard users aren't lost.
  useEffect(() => {
    if (status.kind === "sent") sentRef.current?.focus();
  }, [status.kind]);

  const renderTurnstile = useCallback(() => {
    if (!window.turnstile || !widgetRef.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: turnstileSiteKey,
      theme: "auto",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, []);

  const sending = status.kind === "sending";

  function update<K extends keyof ContactFields>(key: K, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-check a field live once it has been visited, so errors clear as you fix them.
    if (touched[key]) setErrors(pick(validateContact(next), touched));
  }

  function blur(key: keyof ContactFields) {
    const nextTouched = { ...touched, [key]: true };
    setTouched(nextTouched);
    setErrors(pick(validateContact(values), nextTouched));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const allTouched = Object.fromEntries(Object.keys(empty).map((k) => [k, true]));
    setTouched(allTouched);
    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof ContactFieldErrors)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (turnstileSiteKey && !token) {
      setStatus({ kind: "error", message: "Please complete the spam check above the button, then send again." });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token || undefined }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: ContactFieldErrors };
      if (res.ok && body.ok) {
        setStatus({ kind: "sent", name: values.name.trim().split(/\s+/)[0] });
        return;
      }
      if (body.fieldErrors && Object.keys(body.fieldErrors).length) setErrors(body.fieldErrors);
      setStatus({ kind: "error", message: body.error ?? "Something went wrong sending your message." });
    } catch {
      setStatus({ kind: "error", message: "Your message couldn't be sent. Check your connection and try again." });
    }
    if (widgetId.current) {
      window.turnstile?.reset(widgetId.current);
      setToken("");
    }
  }

  const mailto = `mailto:${email}?subject=${encodeURIComponent("New project")}`;

  if (status.kind === "sent") {
    return (
      <div role="status" aria-live="polite" className="rounded-[12px] border border-border bg-surface p-6 sm:p-8">
        <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-accent-ink">
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 ref={sentRef} tabIndex={-1} className="mt-5 text-xl font-semibold tracking-tight focus:outline-none">
          Message sent
        </h2>
        <p className="mt-2 leading-relaxed text-muted">
          Thanks, {status.name}. I&apos;ll reply within 1 to 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-note" className="min-w-0">
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderTurnstile}
        />
      ) : null}

      <p id="form-note" className="text-sm text-muted">
        All fields are required unless marked optional.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={contactLimits.name}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            disabled={sending}
            {...errorProps("name", errors.name)}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={contactLimits.email}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => blur("email")}
            disabled={sending}
            {...errorProps("email", errors.email)}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field id="business" label="Business or website" optional error={errors.business}>
          <input
            id="business"
            name="business"
            type="text"
            autoComplete="organization"
            maxLength={contactLimits.business}
            placeholder="Business name or a link"
            value={values.business}
            onChange={(e) => update("business", e.target.value)}
            onBlur={() => blur("business")}
            disabled={sending}
            {...errorProps("business", errors.business)}
          />
        </Field>
      </div>

      <ChoiceGroup
        id="need"
        label="What do you need?"
        value={values.need}
        onChange={(v) => update("need", v)}
        onBlur={() => blur("need")}
        disabled={sending}
        options={needOptions}
        error={errors.need}
      />
      <ChoiceGroup
        id="budget"
        label="Budget"
        optional
        value={values.budget}
        onChange={(v) => update("budget", v)}
        onBlur={() => blur("budget")}
        disabled={sending}
        options={budgetOptions}
        error={errors.budget}
      />
      <ChoiceGroup
        id="timing"
        label="Timing"
        optional
        value={values.timing}
        onChange={(v) => update("timing", v)}
        onBlur={() => blur("timing")}
        disabled={sending}
        options={timingOptions}
        error={errors.timing}
      />

      <div className="mt-5">
        <Field
          id="message"
          label="Message"
          error={errors.message}
          hint="I'd love to hear about your idea or project: what you're building, who it's for, and what you'd like help with. If you already have a site or app, a link is a bonus. And a rough idea is totally fine, so write whatever you have."
        >
          <textarea
            id="message"
            name="message"
            required
            rows={7}
            minLength={contactLimits.messageMin}
            maxLength={contactLimits.messageMax}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            onBlur={() => blur("message")}
            disabled={sending}
            {...errorProps("message", errors.message, "message-hint")}
            className={`${inputBase} ${errors.message ? "border-danger" : "border-border"} resize-y leading-relaxed`}
          />
        </Field>
        <p className="mt-1.5 text-right font-mono text-xs text-muted" aria-hidden="true">
          {values.message.trim().length} / {contactLimits.messageMax}
        </p>
      </div>

      {/* Honeypot: hidden from people and assistive tech. Bots that fill it get a fake success. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValues({ ...values, website: e.target.value })}
        />
      </div>

      {turnstileSiteKey ? <div ref={widgetRef} className="mt-6 min-h-[65px]" /> : null}

      <div aria-live="polite" role="status">
        {status.kind === "sending" ? <span className="sr-only">Sending your message.</span> : null}
        {status.kind === "error" ? (
          <div className="mt-6 rounded-[8px] border border-danger p-4 text-[0.9375rem] leading-relaxed">
            <p className="font-medium text-danger">{status.message}</p>
            <p className="mt-1 text-muted">
              You can also email me directly at{" "}
              <a href={mailto} className="break-all font-medium text-accent underline underline-offset-2">
                {email}
              </a>
              .
            </p>
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={sending}
        aria-disabled={sending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-accent px-6 text-[0.9375rem] font-semibold text-accent-ink transition-colors hover:opacity-90 disabled:cursor-progress disabled:opacity-70 sm:w-auto"
      >
        {sending ? (
          <>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Sending
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );

  function errorProps(id: string, error: string | undefined, hintId?: string) {
    const describedBy = [hintId, error ? `${id}-error` : null].filter(Boolean).join(" ");
    return {
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy || undefined,
      className: `${inputBase} ${error ? "border-danger" : "border-border"}`,
    };
  }
}

function pick(errors: ContactFieldErrors, touched: Partial<Record<string, boolean>>): ContactFieldErrors {
  return Object.fromEntries(Object.entries(errors).filter(([k]) => touched[k]));
}

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-[0.9375rem] font-medium">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor">
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.9 4h1.8v5.2H9.1V6Zm0 6.8h1.8v1.8H9.1v-1.8Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Single-choice question as a row of chips. Native radios (visually hidden) keep keyboard and screen reader
 * support; this replaces <select>, whose native popup can't be styled and opens oversized on macOS.
 * Optional groups can be cleared by clicking the selected chip again.
 */
function ChoiceGroup({
  id,
  label,
  optional,
  value,
  onChange,
  onBlur,
  disabled,
  options,
  error,
}: {
  id: string;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  disabled: boolean;
  options: readonly string[];
  error?: string;
}) {
  return (
    <fieldset
      id={id}
      className="mt-5 min-w-0"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onBlur();
      }}
    >
      <legend className="text-[0.9375rem] font-medium">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value === o;
          return (
            <label key={o} className="relative">
              <input
                type="radio"
                name={id}
                value={o}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(o)}
                onClick={() => {
                  if (optional && checked) onChange("");
                }}
                className="peer sr-only"
              />
              <span
                className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[0.9375rem] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:cursor-not-allowed peer-disabled:opacity-60 ${
                  checked
                    ? "border-accent bg-accent font-medium text-accent-ink"
                    : `${error ? "border-danger" : "border-border"} bg-background text-ink hover:border-accent`
                }`}
              >
                {o}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor">
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-.9 4h1.8v5.2H9.1V6Zm0 6.8h1.8v1.8H9.1v-1.8Z" />
          </svg>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
