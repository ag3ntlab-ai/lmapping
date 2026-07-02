import * as React from "react";
import { cn } from "@/lib/utils";

// Section shell: consistent width + vertical rhythm + anchor scroll offset.
export function Section({
  id,
  className,
  children,
  bleed = false,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  bleed?: boolean;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className={cn(!bleed && "mx-auto w-full max-w-6xl px-4 sm:px-6")}>
        {children}
      </div>
    </section>
  );
}

// One eyebrow, used sparingly (max 1 per 3 sections). Plain-language topic label.
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </p>
  );
}
