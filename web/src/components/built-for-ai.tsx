"use client";

import { motion, useReducedMotion } from "motion/react";
import { CodeIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { AI } from "@/content/site";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function BuiltForAI() {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.55, delay, ease: EASE },
  });

  return (
    <Section id="ai" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p {...rise()} className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          {AI.kicker}
        </motion.p>
        <motion.h2 {...rise(0.06)} className="mt-3 font-display text-3xl font-semibold tracking-[-0.015em] text-ink sm:text-[2.4rem]">
          {AI.title}
        </motion.h2>
        <motion.p {...rise(0.12)} className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink2">{AI.body}</motion.p>
      </div>

      {/* the agents that already read it (real, monochrome brand marks) */}
      <motion.div {...rise(0.06)} className="mx-auto mt-10 max-w-3xl">
        <p className="text-center font-display text-[11.5px] font-semibold uppercase tracking-[0.1em] text-muted">{AI.studiosLabel}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
          {AI.studios.map((s) =>
            s.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.name} src={s.logo} alt={s.name} title={s.name} className="h-6 w-auto opacity-70" />
            ) : (
              <span key={s.name} className="font-display text-[17px] font-semibold text-muted">{s.name}</span>
            ),
          )}
        </div>
      </motion.div>

      {/* proof: the board IS structured data (no coloured cards, just the data) */}
      <motion.div {...rise(0.06)} className="mx-auto mt-10 max-w-3xl">
        <div className="mb-2 flex items-center gap-1.5">
          <CodeIcon size={15} weight="bold" className="text-muted" />
          <span className="font-display text-[12.5px] font-medium text-muted">{AI.proofLabel}</span>
        </div>
        <pre className="no-scrollbar overflow-x-auto rounded-[14px] border border-line bg-ink px-5 py-4 font-mono text-[12px] leading-relaxed text-[#e8eaf0]">
          <code>{AI.proof}</code>
        </pre>
      </motion.div>

      {/* two skills: read (free, early access) + write (members, paid) */}
      <div className="mx-auto mt-6 grid max-w-3xl gap-4 md:grid-cols-2">
        {[AI.read, AI.write].map((o, i) => (
          <motion.div
            key={o.tag}
            {...rise(0.06 * i)}
            className="flex flex-col rounded-[18px] border border-line bg-panel p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-[14.5px] font-semibold text-ink">{o.tag}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.04em]",
                  i === 0 ? "bg-ink text-white" : "border border-line text-ink2",
                )}
              >
                {o.price}
              </span>
            </div>
            <h3 className="mt-3 font-display text-[19px] font-semibold text-ink">{o.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink2">{o.body}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{o.note}</p>
            <a
              href="#early-access"
              className={cn(
                "mt-5 inline-flex h-11 items-center justify-center gap-1.5 self-start rounded-full px-5 font-display text-[14px] font-semibold transition-colors",
                i === 0 ? "bg-ink text-white hover:bg-ink2" : "border border-line bg-bg text-ink hover:border-ink/35",
              )}
            >
              {o.cta}
              <ArrowRightIcon size={15} weight="bold" />
            </a>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
