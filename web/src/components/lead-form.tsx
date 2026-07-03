"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { CheckCircleIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { Button, Input, Label } from "@/components/ui";
import { CTA } from "@/content/site";

const schema = z.object({
  firstName: z.string().trim().min(1, "Your first name, please."),
  lastName: z.string().trim().min(1, "Your last name, please."),
  email: z.string().trim().max(200, "That email is too long.").email("A valid email, please."),
});

type Field = "firstName" | "lastName" | "email";
type Errors = Partial<Record<Field, string>>;

export function LeadForm() {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [consentError, setConsentError] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    const next: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] = issue.message;
    }
    const missingConsent = !consent;
    setErrors(next);
    setConsentError(missingConsent);
    if (!parsed.success || missingConsent) return;

    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, consent: true, homepage: honeypot }),
      });
      if (!res.ok) throw new Error("bad status");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div data-testid="lead-success" className="flex items-center gap-3 rounded-[var(--radius-card)] border border-qa-b/50 bg-qa/25 px-5 py-6">
        <CheckCircleIcon size={26} weight="fill" className="shrink-0 text-qa-b" />
        <p className="font-display text-[15px] font-semibold text-ink">{CTA.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate data-testid="lead-form" className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <Input
            id="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={set("firstName")}
            invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <Input
            id="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={set("lastName")}
            invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
        </Field>
      </div>
      <Field id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      </Field>

      {/* Honeypot: hidden from people, a lure for bots. Never shown to a real user. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor="homepage">Homepage</label>
        <input
          id="homepage"
          name="homepage"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-0.5 grid gap-2">
        <div className="flex items-start gap-2.5">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setConsentError(false);
            }}
            aria-invalid={consentError || undefined}
            aria-describedby={consentError ? "consent-error" : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
          />
          <label htmlFor="consent" className="text-[13.5px] leading-relaxed text-ink2">
            I agree to receive Lmapping updates by email, and to my data being handled per the{" "}
            <Link
              href="/privacy"
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-ink underline decoration-line underline-offset-2 hover:decoration-ink"
            >
              Privacy notice
            </Link>
            .
          </label>
        </div>
        {consentError && (
          <p id="consent-error" role="alert" className="text-[12.5px] font-medium text-blocked">
            Please accept to continue.
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={state === "loading"} className="mt-1 w-full sm:w-auto">
        {state === "loading" && <CircleNotchIcon size={18} className="animate-spin" />}
        {state === "loading" ? "Sending" : "Get early access"}
      </Button>

      {state === "error" && (
        <p role="alert" className="text-[13px] font-medium text-blocked">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12.5px] font-medium text-blocked">
          {error}
        </p>
      )}
    </div>
  );
}
