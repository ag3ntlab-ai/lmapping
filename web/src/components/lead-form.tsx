"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCircleIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { Button, Input, Label } from "@/components/ui";
import { CTA } from "@/content/site";

const schema = z.object({
  firstName: z.string().trim().min(1, "Your first name, please."),
  lastName: z.string().trim().min(1, "Your last name, please."),
  email: z.string().trim().email("A valid email, please."),
  mobile: z.string().trim().optional(),
});

type Field = "firstName" | "lastName" | "email" | "mobile";
type Errors = Partial<Record<Field, string>>;

export function LeadForm() {
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", mobile: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as Field] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, source: "one-pager" }),
      });
      if (!res.ok) throw new Error("bad status");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-qa-b/50 bg-qa/25 px-5 py-6">
        <CheckCircleIcon size={26} weight="fill" className="shrink-0 text-qa-b" />
        <p className="font-display text-[15px] font-semibold text-ink">{CTA.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <Input
            id="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={set("firstName")}
            invalid={!!errors.firstName}
          />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <Input
            id="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={set("lastName")}
            invalid={!!errors.lastName}
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
        />
      </Field>
      <Field id="mobile" label="Mobile" hint="optional" error={errors.mobile}>
        <Input
          id="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.mobile}
          onChange={set("mobile")}
        />
      </Field>

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
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        {hint && <span className="font-body text-[12px] text-muted">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-[12.5px] font-medium text-blocked" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
