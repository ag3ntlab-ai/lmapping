"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, ArrowDownIcon, ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { NP } from "@/content/notation-page";
import { SITE } from "@/content/site";
import { STATUS_CLASS, type StatusKey } from "@/content/notation";
import { NotationCard } from "@/components/board/board";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{children}</p>;
}

const BAND_CLASS: Record<string, string> = {
  done: "bg-done border-done-b text-[#2e4718]",
  dev: "bg-dev border-dev-b text-[#4a3b00]",
  commit: "bg-commit border-commit-b text-[#5a1a14]",
  intend: "bg-intend border-intend-b text-[#3a2458]",
  demand: "bg-demand border-demand-b text-[#2a1448]",
};

export function NotationDetail() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      {/* intro */}
      <Reveal>
        <SectionLabel>{NP.kicker}</SectionLabel>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.02em] text-ink">
          {NP.title}
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink2">{NP.intro}</p>
      </Reveal>

      {/* Status is the colour */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Axis 1</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.statusTitle}</h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink2">{NP.statusNote}</p>
        </Reveal>
        <Reveal delay={0.06} className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {NP.statuses.map((s) => (
            <div key={s.key} className={cn("flex items-start justify-between gap-3 rounded-[12px] border-[2.5px] px-4 py-3", STATUS_CLASS[s.key as StatusKey])}>
              <div>
                <p className="font-display text-[14px] font-semibold">{s.label}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug opacity-80">{s.meaning}</p>
              </div>
              <code className="shrink-0 whitespace-nowrap rounded-md bg-white/55 px-1.5 py-0.5 font-mono text-[10px] font-medium opacity-80">
                {s.fill}
                <span className="opacity-50"> · {s.border}</span>
              </code>
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.1} className="mt-3 flex items-start gap-3 rounded-[12px] border-[2.5px] border-[#c02200] bg-blocked px-4 py-3 text-white">
          <span className="font-display text-[14px] font-semibold">Blocked</span>
          <span className="text-[12.5px] leading-snug opacity-90">{NP.blockedNote}</span>
        </Reveal>
      </section>

      {/* Phase is the position */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Axis 2</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.phasesTitle}</h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink2">{NP.phasesNote}</p>
        </Reveal>
        <Reveal delay={0.06} className="no-scrollbar mt-7 flex items-center gap-2 overflow-x-auto pb-1">
          {NP.phases.map((p, i) => {
            const key = (["solution", "spec", "dev", "qa", "done"] as StatusKey[])[i];
            return (
              <div key={p} className="flex shrink-0 items-center gap-2">
                <div className={cn("rounded-[10px] border-2 px-3.5 py-2 font-display text-[13px] font-semibold", STATUS_CLASS[key])}>{p}</div>
                {i < NP.phases.length - 1 && <ArrowRightIcon size={15} weight="bold" className="text-muted" />}
              </div>
            );
          })}
        </Reveal>
      </section>

      {/* Lifecycle */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>A card's lifecycle</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.lifecycleTitle}</h2>
        </Reveal>
        <Reveal delay={0.06} className="no-scrollbar mt-7 flex items-center gap-1.5 overflow-x-auto pb-1">
          {(["demand", "intend", "commit", "solution", "spec", "dev", "qa", "done"] as StatusKey[]).map((k, i, arr) => (
            <div key={k} className="flex shrink-0 items-center gap-1.5">
              <span className={cn("rounded-[8px] border-2 px-2.5 py-1.5 font-display text-[12px] font-semibold capitalize", STATUS_CLASS[k])}>{k === "spec" ? "Specs" : k === "dev" ? "Dev" : k === "done" ? "Done" : k}</span>
              {i < arr.length - 1 && <span className="text-[13px] text-muted">{"→"}</span>}
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink2">{NP.lifecycleNote}</p>
        </Reveal>
      </section>

      {/* Modifiers */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Modifiers</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.modifiersTitle}</h2>
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {NP.modifiers.map((m, i) => (
            <Reveal key={m.t} delay={0.06 * i} className="rounded-[16px] border border-line bg-panel p-5">
              <div className="mb-3 h-8 w-14" aria-hidden>
                {m.t === "Attention" ? (
                  <span className="block h-8 w-14 rounded-[8px] border-[3px] border-blocked bg-dev" />
                ) : m.t === "Blocked" ? (
                  <span className="block h-8 w-14 rounded-[8px] bg-blocked" />
                ) : (
                  <span className="relative block h-8 w-14 rounded-[8px] border-2 border-solution-b bg-solution">
                    <span className="absolute right-0 top-0 rounded-bl-[6px] rounded-tr-[6px] bg-ink px-1 py-0.5 font-display text-[8px] font-bold uppercase text-white">dep</span>
                  </span>
                )}
              </div>
              <p className="font-display text-[15px] font-semibold text-ink">{m.t}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink2">{m.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Two readings */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Reading the roadmap</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.readingsTitle}</h2>
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <Reveal className="rounded-[16px] border border-line bg-panel p-5">
            <p className="font-display text-[14px] font-semibold text-ink">{NP.collapsed.t}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink2">{NP.collapsed.d}</p>
            <div className="mt-4">
              <p className="mb-1.5 font-body text-[11.5px] text-muted">Column = September (target month)</p>
              <NotationCard name="Checkout v2" colorClass={STATUS_CLASS.intend} label="Release · Intend" />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[16px] border border-line bg-panel p-5">
            <p className="font-display text-[14px] font-semibold text-ink">{NP.expanded.t}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink2">{NP.expanded.d}</p>
            <div className="mt-4 grid gap-1.5">
              {([
                ["Solution", "done"],
                ["Specifications", "done"],
                ["Development", "dev"],
                ["QA", "intend"],
                ["Release", "intend"],
              ] as [string, StatusKey][]).map(([ph, k], i, arr) => (
                <div key={ph}>
                  <NotationCard name="Checkout v2" colorClass={STATUS_CLASS[k]} label={ph} />
                  {i < arr.length - 1 && <div className="flex justify-center py-0.5 text-muted"><ArrowDownIcon size={13} weight="bold" /></div>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Release cartouche */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Grouping</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.cartoucheTitle}</h2>
        </Reveal>
        <Reveal delay={0.06} className="mt-7 grid gap-6 md:grid-cols-[minmax(0,340px)_1fr] md:items-center">
          <div className="relative rounded-[14px] border-2 border-[#b0b0b0] p-3">
            <div className="grid gap-2">
              {["Search v2 + filters", "Wallet pay", "New onboarding", "Widgets"].map((c) => (
                <div key={c} className="rounded-[9px] border-[1.5px] border-intend-b bg-intend px-3 py-2 font-display text-[11.5px] font-semibold text-[#3a2458]">{c}</div>
              ))}
            </div>
            <span className="absolute -bottom-3 right-3 flex items-center gap-1 rounded-md border-[1.5px] border-blocked bg-panel px-2 py-0.5 font-display text-[10px] font-bold text-blocked">
              <span className="h-2.5 w-2.5 rotate-45 rounded-[1px] border border-done-b bg-done" aria-hidden />
              App release
            </span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink2">{NP.cartoucheNote}</p>
        </Reveal>
      </section>

      {/* Time header / guidance bands */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>The time header</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.timeTitle}</h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink2">{NP.timeNote}</p>
        </Reveal>
        <Reveal delay={0.06} className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1">
          {NP.bands.map((b) => (
            <div key={b.t} className={cn("min-w-[150px] flex-1 rounded-[10px] border-2 px-3 py-2.5", BAND_CLASS[b.cls])}>
              <p className="font-display text-[12.5px] font-semibold">{b.t}</p>
              <p className="mt-0.5 text-[11.5px] font-medium opacity-80">{b.d}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Kick start */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>The published roadmap</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.kickTitle}</h2>
        </Reveal>
        <Reveal delay={0.06} className="mt-7 grid gap-6 md:grid-cols-[1fr_minmax(0,300px)] md:items-center">
          <p className="text-[15px] leading-relaxed text-ink2">{NP.kickNote}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1"><NotationCard name="Team A kick start" colorClass={STATUS_CLASS.commit} label="Commit" /></div>
            <ArrowRightIcon size={18} weight="bold" className="shrink-0 text-muted" />
            <div className="flex-1"><NotationCard name="Rollout" colorClass={STATUS_CLASS.demand} label="Demand · 2027" /></div>
          </div>
        </Reveal>
      </section>

      {/* Connectors */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Connectors</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.connectorsTitle}</h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink2">{NP.connectorsNote}</p>
        </Reveal>
        <div className="mt-7 grid gap-3">
          {NP.connectors.map((c, i) => (
            <Reveal key={c.n} delay={0.05 * i} className="flex items-center gap-4 rounded-[14px] border border-line bg-panel px-5 py-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-display text-[13px] font-bold text-white">{c.n}</span>
              <div>
                <p className="font-display text-[14.5px] font-semibold text-ink">{c.t}</p>
                <p className="mt-0.5 text-[13.5px] leading-snug text-ink2">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Usage rules */}
      <section className="mt-20">
        <Reveal>
          <SectionLabel>Usage rules</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.rulesTitle}</h2>
        </Reveal>
        <Reveal delay={0.06} className="mt-7 grid gap-2.5">
          {NP.rules.map((r, i) => (
            <div key={i} className="flex gap-3.5 rounded-[12px] border border-line bg-panel px-4 py-3.5">
              <span className="font-display text-[13px] font-bold text-muted">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[14.5px] leading-relaxed text-ink">{r}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Machine-readable */}
      <section className="mt-20">
        <Reveal className="rounded-[20px] border border-line bg-panel p-7 sm:p-9">
          <SectionLabel>For a machine</SectionLabel>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">{NP.aiTitle}</h2>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink2">{NP.aiNote}</p>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-bg px-5 font-display text-[14.5px] font-semibold text-ink transition-colors hover:border-ink/35"
          >
            <GithubLogoIcon size={16} weight="fill" />
            Read the open spec
            <ArrowUpRightIcon size={14} weight="bold" className="text-muted" />
          </a>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="mt-20 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-xl font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[2rem]">{NP.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-ink2">{NP.ctaNote}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/#early-access" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-display text-[15px] font-semibold text-white transition-colors hover:bg-ink2">
              {SITE.ctaLabel}
            </Link>
            <Link href="/" className="inline-flex h-12 items-center gap-1.5 rounded-full border border-line bg-panel px-6 font-display text-[15px] font-semibold text-ink transition-colors hover:border-ink/35">
              Back to the overview
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
