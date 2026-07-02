"use client";

import { motion, useReducedMotion } from "motion/react";
import { RECONCILE } from "@/content/site";
import { DATA_LESS } from "@/content/notation";
import { Section } from "@/components/section";
import { LmapBoard } from "@/components/board/lmap-board";
import { JiraMess } from "@/components/jira-mess";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reconcile() {
  const reduce = useReducedMotion();
  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <Section id="reconcile" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p {...rise()} className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          {RECONCILE.kicker}
        </motion.p>
        <motion.h2
          {...rise(0.06)}
          className="mt-3 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.015em] text-ink sm:text-[2.5rem]"
        >
          {RECONCILE.title}
        </motion.h2>
        <motion.p {...rise(0.12)} className="mx-auto mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink2">
          {RECONCILE.body}
        </motion.p>
      </div>

      {/* before: the Gantt mess */}
      <motion.figure {...rise(0.06)} className="mx-auto mt-12 max-w-4xl">
        <figcaption className="mb-2.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-line2 px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            {RECONCILE.jiraLabel}
          </span>
        </figcaption>
        <JiraMess />
        <p className="mt-2.5 text-[13px] italic leading-snug text-muted">{RECONCILE.jiraCaption}</p>
      </motion.figure>

      {/* after: the same portfolio, in the notation */}
      <motion.figure {...rise(0.06)} className="mx-auto mt-10 max-w-4xl">
        <figcaption className="mb-2.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-ink px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
            {RECONCILE.lmLabel}
          </span>
        </figcaption>
        <div className="overflow-hidden rounded-[calc(var(--radius-card)+6px)] border border-line bg-white p-4 shadow-[0_1px_0_#fff_inset,0_36px_80px_-56px_rgba(22,24,29,0.38)] sm:p-5">
          <div className="no-scrollbar overflow-x-auto">
            <LmapBoard data={DATA_LESS} />
          </div>
        </div>
        <p className="mt-2.5 text-[13px] leading-snug text-ink2">{RECONCILE.lmCaption}</p>
      </motion.figure>

      <motion.p
        {...rise(0.08)}
        className="mx-auto mt-12 max-w-2xl text-center font-display text-[19px] font-medium leading-snug text-ink sm:text-[21px]"
      >
        {RECONCILE.promise}
      </motion.p>
    </Section>
  );
}
