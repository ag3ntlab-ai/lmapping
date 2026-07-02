"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckIcon, MinusIcon, PlayIcon, PauseIcon } from "@phosphor-icons/react";
import { COMPARE } from "@/content/site";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";

const STEP_MS = 5000;

export function Compare() {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const row = COMPARE.rows[t];

  // Autoplay: advance to the next argument every 5s. Re-armed on each change, so
  // a manual tab pick also gets a full 5s. Paused for reduced-motion users.
  useEffect(() => {
    if (!playing || reduce) return;
    const id = setTimeout(() => setT((n) => (n + 1) % COMPARE.rows.length), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, reduce, t]);

  return (
    <Section id="compare" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.015em] text-ink sm:text-[2.4rem]">
          {COMPARE.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink2">{COMPARE.body}</p>
      </div>

      {/* controller + nav, above the display zone */}
      <div className="mt-10 flex items-center gap-2.5">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
          aria-pressed={playing}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-ink2"
        >
          {playing ? <PauseIcon size={15} weight="fill" /> : <PlayIcon size={15} weight="fill" />}
        </button>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Use cases">
          {COMPARE.rows.map((r, i) => (
            <button
              key={r.tab}
              role="tab"
              aria-selected={t === i}
              onClick={() => setT(i)}
              className={cn(
                "min-h-[38px] shrink-0 rounded-full border px-3.5 font-display text-[13px] font-semibold transition-colors",
                t === i ? "border-ink bg-ink text-white" : "border-line bg-panel text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              {r.tab}
            </button>
          ))}
        </div>
      </div>

      {/* contrast readout */}
      <div className="mt-4 rounded-[calc(var(--radius-card)+4px)] border border-line bg-panel p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={t}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <p className="text-center font-display text-[17px] font-semibold text-ink sm:text-[19px]">{row.need}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[12px] border border-line bg-bg px-4 py-4">
                <div className="mb-2 inline-flex items-center gap-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
                  <MinusIcon size={14} weight="bold" /> {COMPARE.usualLabel}
                </div>
                <p className="text-[14.5px] leading-relaxed text-ink2">{row.usual}</p>
              </div>
              <div className="rounded-[12px] border border-done-b/40 bg-done/20 px-4 py-4">
                <div className="mb-2 inline-flex items-center gap-1.5 font-display text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2e4718]">
                  <CheckIcon size={14} weight="bold" /> {COMPARE.oursLabel}
                </div>
                <p className="text-[14.5px] leading-relaxed text-ink">{row.ours}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
