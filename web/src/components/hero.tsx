"use client";

import { motion, useReducedMotion } from "motion/react";
import { HERO } from "@/content/site";
import { DATA_COLOR } from "@/content/notation";
import { Button } from "@/components/ui";
import { LmapBoard } from "@/components/board/lmap-board";
import { Legend } from "@/components/board/board";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft ink vignette, not an AI gradient blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 85% 0%, color-mix(in srgb, var(--color-ink) 5%, transparent), transparent 60%)",
        }}
      />
      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:gap-12">
        {/* the message */}
        <div className="max-w-2xl">
          <motion.h1
            {...rise(0.04)}
            className="font-display text-[clamp(2.4rem,5.4vw,3.9rem)] font-bold leading-[1.02] tracking-[-0.02em] text-ink"
          >
            {HERO.headline[0]}
            <br />
            {HERO.headline[1]}
          </motion.h1>

          <motion.p {...rise(0.14)} className="mt-5 max-w-md text-[17px] leading-relaxed text-ink2 sm:text-[18px]">
            {HERO.sub}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() =>
                document.getElementById("early-access")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
              }
            >
              {HERO.primary}
            </Button>
          </motion.div>
        </div>

        {/* a real board, rendered in HTML from the notation (pixel-controlled) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="rounded-[calc(var(--radius-card)+6px)] border border-line bg-panel p-4 shadow-[0_1px_0_#fff_inset,0_40px_90px_-56px_rgba(22,24,29,0.4)] sm:p-6"
        >
          <div className="no-scrollbar overflow-x-auto">
            <LmapBoard data={DATA_COLOR} />
          </div>
          <div className="mt-4 border-t border-line2 pt-3.5">
            <Legend />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
