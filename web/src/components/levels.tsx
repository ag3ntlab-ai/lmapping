"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LEVELS } from "@/content/site";
import { DATA_LESS, DATA_MORE } from "@/content/notation";
import { Section } from "@/components/section";
import { LmapBoard } from "@/components/board/lmap-board";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Levels() {
  const reduce = useReducedMotion();
  const [more, setMore] = useState(false);
  const rise = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.55, delay, ease: EASE },
  });

  const tabs = [
    { on: false, label: LEVELS.less },
    { on: true, label: LEVELS.more },
  ];

  return (
    <Section id="zoom" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p {...rise()} className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          {LEVELS.kicker}
        </motion.p>
        <motion.h2
          {...rise(0.06)}
          className="mt-3 font-display text-3xl font-semibold leading-[1.1] tracking-[-0.015em] text-ink sm:text-[2.4rem]"
        >
          {LEVELS.title}
        </motion.h2>
        <motion.p {...rise(0.12)} className="mx-auto mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink2">
          {LEVELS.body}
        </motion.p>
      </div>

      <motion.div {...rise(0.06)} className="mx-auto mt-9 max-w-4xl">
        {/* segmented toggle: Less detail <-> More detail */}
        <div className="flex justify-center">
          <div role="tablist" aria-label="Level of detail" className="inline-flex rounded-full border border-line bg-panel p-1">
            {tabs.map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={more === t.on}
                onClick={() => setMore(t.on)}
                className={cn(
                  "relative min-h-[42px] rounded-full px-6 font-display text-[14px] font-semibold transition-colors",
                  more === t.on ? "text-white" : "text-muted hover:text-ink",
                )}
              >
                {more === t.on && (
                  <motion.span
                    layoutId="levels-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-[1]">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* two boards on the IDENTICAL grid, cross-faded in place -> pixel-aligned, no jitter */}
        <div className="mt-6 rounded-[calc(var(--radius-card)+6px)] border border-line bg-white p-4 shadow-[0_1px_0_#fff_inset,0_36px_80px_-56px_rgba(22,24,29,0.38)] sm:p-6">
          <div className="no-scrollbar overflow-x-auto">
            <div className="relative min-w-[660px] md:min-w-0">
              <div
                aria-hidden={more}
                className={cn("transition-opacity duration-[450ms] motion-reduce:transition-none", more ? "opacity-0" : "opacity-100")}
              >
                <LmapBoard data={DATA_LESS} />
              </div>
              <div
                aria-hidden={!more}
                className={cn(
                  "absolute inset-0 transition-opacity duration-[450ms] motion-reduce:transition-none",
                  more ? "opacity-100" : "opacity-0",
                )}
              >
                <LmapBoard data={DATA_MORE} />
              </div>
            </div>
          </div>
        </div>

        {/* caption per state */}
        <div className="mt-5 min-h-[52px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={more ? "more" : "less"}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-2xl text-center text-[14.5px] leading-snug text-ink2"
            >
              {more ? LEVELS.moreCaption : LEVELS.lessCaption}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </Section>
  );
}
