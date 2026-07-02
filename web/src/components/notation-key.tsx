"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { NOTATION } from "@/content/site";
import { STATUSES, STATUS_CLASS } from "@/content/notation";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function NotationKey() {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.55, delay, ease: EASE },
  });

  return (
    <Section id="notation" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p {...rise()} className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          {NOTATION.kicker}
        </motion.p>
        <motion.h2
          {...rise(0.06)}
          className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.015em] text-ink sm:text-[2.4rem]"
        >
          {NOTATION.title}
        </motion.h2>
        <motion.p {...rise(0.12)} className="mx-auto mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink2">
          {NOTATION.body}
        </motion.p>
      </div>

      {/* Status colours — the closed lifecycle */}
      <motion.div {...rise(0.06)} className="mx-auto mt-11 max-w-4xl">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-[15px] font-semibold text-ink">{NOTATION.statusesTitle}</h3>
          <p className="max-w-md text-[13px] leading-snug text-muted">{NOTATION.statusesNote}</p>
        </div>
        <ol className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {STATUSES.map((s, i) => (
            <li
              key={s.key}
              className={cn(
                "rounded-[12px] border-[2.5px] px-3 py-2.5 leading-tight",
                STATUS_CLASS[s.key],
              )}
            >
              <span className="flex items-baseline justify-between gap-1">
                <span className="font-display text-[13px] font-semibold">{s.label}</span>
                <span className="font-display text-[10px] font-medium opacity-60">{i + 1}</span>
              </span>
              <span className="mt-1 block font-body text-[11.5px] font-medium opacity-80">{s.meaning}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Modifiers + board grammar */}
      <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
        <motion.div {...rise(0.06)} className="rounded-[16px] border border-line bg-panel p-5">
          <h3 className="font-display text-[15px] font-semibold text-ink">{NOTATION.modifiersTitle}</h3>
          <ul className="mt-3.5 grid gap-3">
            {NOTATION.modifiers.map((m) => (
              <li key={m.t} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 h-6 w-9 shrink-0 rounded-[7px]",
                    m.t === "Blocked" ? "bg-blocked" : "bg-dev border-[2.5px] border-blocked",
                  )}
                />
                <span>
                  <span className="font-display text-[13.5px] font-semibold text-ink">{m.t}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink2">{m.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...rise(0.12)} className="rounded-[16px] border border-line bg-panel p-5">
          <h3 className="font-display text-[15px] font-semibold text-ink">{NOTATION.extrasTitle}</h3>
          <ul className="mt-3.5 grid gap-3">
            {NOTATION.extras.map((m) => (
              <li key={m.t} className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5 grid h-6 w-9 shrink-0 place-items-center">
                  {m.t === "Release cartouche" ? (
                    <span className="relative h-5 w-8 rounded-[5px] border-2 border-[#b0b0b0]">
                      <span className="absolute -bottom-1 right-0 h-2 w-2 rotate-45 rounded-[1px] border border-done-b bg-done" />
                    </span>
                  ) : m.t === "Current month" ? (
                    <span className="h-4 w-8 rounded-[4px] bg-[#ff17c3]" />
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <span className="h-4 w-3 rounded-[3px] bg-commit border border-commit-b" />
                      <span className="text-[11px] text-ink2">{"→"}</span>
                      <span className="h-4 w-3 rounded-[3px] bg-intend border border-intend-b" />
                    </span>
                  )}
                </span>
                <span>
                  <span className="font-display text-[13.5px] font-semibold text-ink">{m.t}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink2">{m.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="mx-auto mt-9 flex max-w-4xl flex-col items-center gap-3 text-center">
        <p className="max-w-md text-[14.5px] leading-relaxed text-ink2">{NOTATION.moreLink}</p>
        <Link
          href="/notation"
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-panel px-5 font-display text-[14.5px] font-semibold text-ink transition-colors hover:border-ink/35"
        >
          {NOTATION.moreCta}
          <ArrowRightIcon size={15} weight="bold" />
        </Link>
      </div>
    </Section>
  );
}
