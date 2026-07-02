"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ListIcon, XIcon, ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import { SITE } from "@/content/site";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const toCta = () => {
    setOpen(false);
    const el = document.getElementById("early-access");
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    else window.location.href = "/#early-access";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label={SITE.name}>
          <Wordmark />
          <span className="font-display text-[17px] font-bold tracking-tight text-ink">{SITE.name}</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {SITE.nav.map((n) => {
            const isExternal = "external" in n && n.external;
            const isGithub = "github" in n && n.github;
            const cls =
              "inline-flex items-center gap-1.5 font-display text-[14px] font-medium text-muted transition-colors hover:text-ink";
            const inner = (
              <>
                {isGithub && <GithubLogoIcon size={15} weight="fill" />}
                {n.label}
                {isExternal && !isGithub && <ArrowUpRightIcon size={13} weight="bold" />}
              </>
            );
            return isExternal ? (
              <a key={n.label} href={n.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={n.label} href={n.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button size="sm" onClick={toCta} className="hidden shrink-0 sm:inline-flex">
            {SITE.ctaLabel}
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-ink md:hidden"
          >
            {open ? <XIcon size={20} weight="bold" /> : <ListIcon size={20} weight="bold" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Primary mobile"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {SITE.nav.map((n) => {
                const isExternal = "external" in n && n.external;
                const isGithub = "github" in n && n.github;
                const cls =
                  "flex items-center justify-between rounded-xl px-2 py-2.5 font-display text-[15px] font-medium text-ink2 hover:bg-line2";
                const inner = (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      {isGithub && <GithubLogoIcon size={16} weight="fill" />}
                      {n.label}
                    </span>
                    {isExternal && <ArrowUpRightIcon size={15} weight="bold" className="text-muted" />}
                  </>
                );
                return isExternal ? (
                  <a key={n.label} href={n.href} onClick={() => setOpen(false)} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className={cls}>
                    {inner}
                  </Link>
                );
              })}
              <Button size="md" onClick={toCta} className="mt-1.5 w-full">
                {SITE.ctaLabel}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

// The wordmark tile. An L drawn as two orthogonal strokes: the two axes.
function Wordmark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-ink" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5 3 V12 H13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="2.4" width="2.2" height="2.2" rx="0.5" fill="#fff" />
      </svg>
    </span>
  );
}
