"use client";

import { motion, useReducedMotion } from "motion/react";
import { LinkedinLogoIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { AUTHOR } from "@/content/site";
import { Section } from "@/components/section";

export function Author() {
  const reduce = useReducedMotion();
  return (
    <Section id="author" className="pb-24 pt-2 sm:pb-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto grid max-w-3xl gap-6 rounded-[calc(var(--radius-card)+6px)] border border-line bg-panel p-7 shadow-[0_1px_0_#fff_inset,0_30px_70px_-58px_rgba(22,24,29,0.35)] sm:p-9 md:grid-cols-[auto_1fr] md:items-start md:gap-8"
      >
        {/* the L monogram: the two axes, again */}
        <div aria-hidden className="hidden h-16 w-16 shrink-0 place-items-center rounded-[16px] bg-ink md:grid">
          <svg width="30" height="30" viewBox="0 0 16 16" fill="none">
            <path d="M5 3 V12 H13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="2.4" width="2.2" height="2.2" rx="0.5" fill="#fff" />
          </svg>
        </div>

        <div>
          <p className="font-display text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{AUTHOR.kicker}</p>
          <h2 className="mt-2.5 font-display text-2xl font-semibold tracking-[-0.015em] text-ink sm:text-[1.9rem]">
            {AUTHOR.title}
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink2">{AUTHOR.body}</p>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink2">{AUTHOR.body2}</p>
          <a
            href={AUTHOR.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-bg px-5 font-display text-[14.5px] font-semibold text-ink transition-colors hover:border-ink/35"
          >
            <LinkedinLogoIcon size={18} weight="fill" />
            {AUTHOR.linkedinLabel}
            <ArrowUpRightIcon size={14} weight="bold" className="text-muted" />
          </a>
        </div>
      </motion.div>
    </Section>
  );
}
