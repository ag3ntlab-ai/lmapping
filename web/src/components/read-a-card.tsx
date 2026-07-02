"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { PERIODS, STATUSES, STATUS_CLASS, YEAR } from "@/content/notation";
import { READCARD } from "@/content/site";
import { Section, Kicker } from "@/components/section";
import { NotationCard } from "@/components/board/board";
import { cn } from "@/lib/utils";

export function ReadACard() {
  const reduce = useReducedMotion();
  const [s, setS] = useState(3); // Solution
  const [p, setP] = useState(2); // Jul
  const status = STATUSES[s];
  const wrap = (n: number, len: number) => (n + len) % len;

  return (
    <Section id="how" className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Kicker>{READCARD.kicker}</Kicker>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.015em] text-ink sm:text-[2.4rem]">
          {READCARD.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16.5px] leading-relaxed text-ink2">{READCARD.body}</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-[calc(var(--radius-card)+6px)] border border-line bg-panel p-5 shadow-[0_1px_0_#fff_inset,0_30px_70px_-52px_rgba(22,24,29,0.35)] sm:p-8">
        {/* axis guide: STATUS = colour */}
        <div className="grid grid-cols-[auto_1fr] gap-x-3">
          <div className="flex flex-col items-center justify-center">
            <span className="rotate-180 font-display text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted [writing-mode:vertical-rl]">
              {READCARD.axisStatus}
            </span>
          </div>

          {/* the time rail: the card sits at a point in time */}
          <div>
            <div className="grid grid-cols-4 gap-2">
              {PERIODS.map((period, i) => (
                <div key={period} className="flex items-baseline justify-between px-0.5 pb-1">
                  <span className={cn("font-display text-[12px] font-semibold", i === p ? "text-ink" : "text-muted")}>
                    {period}
                  </span>
                  <span className="font-display text-[10px] text-muted/70">{YEAR}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PERIODS.map((period, i) => (
                <div key={period} className="min-h-[74px]">
                  {i === p ? (
                    <motion.div layout={!reduce} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                      <NotationCard
                        name="Public API"
                        colorClass={STATUS_CLASS[status.key]}
                        label={status.label}
                        className="min-h-[74px] px-3 py-2.5 [&>span:first-child]:text-[15px]"
                      />
                    </motion.div>
                  ) : (
                    <div className="h-[74px] rounded-[11px] border-2 border-dashed border-line2" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-center font-display text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
              {READCARD.axisPhase}
            </p>
          </div>
        </div>

        {/* controls */}
        <div className="mt-6 grid gap-3 border-t border-line2 pt-5 sm:grid-cols-2">
          <Stepper
            label="Status (colour)"
            value={status.label}
            onPrev={() => setS((v) => wrap(v - 1, STATUSES.length))}
            onNext={() => setS((v) => wrap(v + 1, STATUSES.length))}
          />
          <Stepper
            label="Target month (position)"
            value={`${PERIODS[p]} ${YEAR}`}
            onPrev={() => setP((v) => wrap(v - 1, PERIODS.length))}
            onNext={() => setP((v) => wrap(v + 1, PERIODS.length))}
          />
        </div>

        <p className="mt-5 rounded-[12px] bg-line2/70 px-4 py-3 text-center text-[14px] text-ink2">
          <b className="font-semibold text-ink">{status.label}.</b> {status.meaning}
        </p>
      </div>

      <p className="mt-6 text-center font-display text-[15px] font-medium text-ink">{READCARD.caption}</p>
    </Section>
  );
}

function Stepper({
  label,
  value,
  onPrev,
  onNext,
}: {
  label: string;
  value: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="rounded-[12px] border border-line bg-bg px-3 py-2.5">
      <p className="mb-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onPrev}
          aria-label={`Previous ${label}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink transition-colors hover:border-ink/40"
        >
          <CaretLeftIcon size={16} weight="bold" />
        </button>
        <span className="font-display text-[15px] font-semibold text-ink">{value}</span>
        <button
          onClick={onNext}
          aria-label={`Next ${label}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink transition-colors hover:border-ink/40"
        >
          <CaretRightIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
