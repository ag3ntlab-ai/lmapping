"use client";

import { motion, useReducedMotion } from "motion/react";
import { CursorIcon, PenNibIcon, TimerIcon, LockOpenIcon } from "@phosphor-icons/react";
import { SIMPLICITY } from "@/content/site";
import { Section } from "@/components/section";
import { Stagger, StaggerItem } from "@/components/reveal";
import { STATUS_CLASS } from "@/content/notation";
import { NotationCard } from "@/components/board/board";

const ICONS = [PenNibIcon, TimerIcon, LockOpenIcon];

// One draw cycle. The cursor places a card, drags an arrow, places the next.
// Every element shares this duration + repeatDelay, so the timeline stays synced.
const CYCLE = 6;
const step = (times: number[]) => ({
  duration: CYCLE,
  times,
  repeat: Infinity,
  repeatDelay: 0.8,
  ease: "easeInOut" as const,
});

// A ~280px stage with two card slots and an arrow track between them.
function DrawCanvas() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto h-[150px] w-[280px] max-w-full">
      {/* card 1: placed first */}
      <motion.div
        className="absolute left-0 top-[50px] w-[116px]"
        initial={false}
        animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 0, 1, 1, 1, 0], scale: [0.85, 0.85, 1, 1, 1, 0.85] }}
        transition={reduce ? undefined : step([0, 0.12, 0.18, 0.9, 0.95, 1])}
      >
        <NotationCard name="Voice capture" colorClass={STATUS_CLASS.demand} label="Demand" />
      </motion.div>

      {/* the arrow, drawn on left to right as the cursor drags across */}
      <motion.svg
        width="48"
        height="20"
        viewBox="0 0 48 20"
        className="absolute left-[116px] top-[63px] origin-left"
        aria-hidden
        initial={false}
        animate={reduce ? { scaleX: 1, opacity: 1 } : { scaleX: [0, 0, 1, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0] }}
        transition={reduce ? undefined : step([0, 0.34, 0.5, 0.9, 0.95, 1])}
      >
        <line x1="2" y1="10" x2="34" y2="10" stroke="var(--color-ink2)" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 4 L44 10 L32 16 z" fill="var(--color-ink2)" />
      </motion.svg>

      {/* card 2: placed last */}
      <motion.div
        className="absolute right-0 top-[50px] w-[116px]"
        initial={false}
        animate={reduce ? { opacity: 1, scale: 1 } : { opacity: [0, 0, 1, 1, 1, 0], scale: [0.85, 0.85, 1, 1, 1, 0.85] }}
        transition={reduce ? undefined : step([0, 0.66, 0.74, 0.92, 0.96, 1])}
      >
        <NotationCard name="Voice capture" colorClass={STATUS_CLASS.done} label="Done" />
      </motion.div>

      {/* the mouse cursor, tracing the whole gesture */}
      {!reduce && (
        <motion.div
          className="absolute left-0 top-0 z-10 text-ink drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
          animate={{
            x: [6, 58, 58, 140, 140, 222, 222, 6],
            y: [150, 73, 73, 73, 73, 73, 73, 150],
            opacity: [0, 1, 1, 1, 1, 1, 1, 0],
          }}
          transition={step([0, 0.1, 0.16, 0.4, 0.5, 0.72, 0.86, 1])}
        >
          <CursorIcon size={22} weight="fill" />
        </motion.div>
      )}
    </div>
  );
}

export function Simplicity() {
  const reduce = useReducedMotion();

  return (
    <Section className="py-20 sm:py-28">
      {/* prominent compatibility logos, on top (real marks, greyscale, no extra colour) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-display text-[11.5px] font-semibold uppercase tracking-[0.1em] text-muted">{SIMPLICITY.toolsLabel}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-11 gap-y-5">
          {SIMPLICITY.tools.map((t) =>
            t.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={t.name} src={t.logo} alt={t.name} title={t.name} className="h-7 w-auto opacity-70" />
            ) : (
              <span key={t.name} className="font-display text-[16px] font-medium text-muted">{t.name}</span>
            ),
          )}
        </div>
      </motion.div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
        {/* the "draw it" canvas */}
        <div className="order-2 overflow-hidden rounded-[calc(var(--radius-card)+4px)] border-2 border-dashed border-line bg-panel bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,color-mix(in_srgb,var(--color-ink)_2%,transparent)_10px,color-mix(in_srgb,var(--color-ink)_2%,transparent)_20px)] p-5 sm:p-8 lg:order-1">
          <DrawCanvas />
          <p className="mt-5 text-center font-body text-[12.5px] text-muted">{SIMPLICITY.canvasCaption}</p>
        </div>

        {/* the message + three points */}
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.015em] text-ink sm:text-[2.4rem]">
            {SIMPLICITY.title}
          </h2>
          <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-ink2">{SIMPLICITY.body}</p>

          <Stagger className="mt-7 grid gap-3">
            {SIMPLICITY.points.map((pt, i) => {
              const Icon = ICONS[i];
              return (
                <StaggerItem key={pt.t}>
                  <div className="flex gap-3.5 rounded-[12px] border border-line bg-panel px-4 py-3.5">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-line2 text-ink">
                      <Icon size={17} weight="bold" />
                    </span>
                    <div>
                      <p className="font-display text-[15px] font-semibold text-ink">{pt.t}</p>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{pt.d}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
