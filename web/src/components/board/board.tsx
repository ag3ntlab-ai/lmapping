"use client";

import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  DATA_HERO,
  MODIFIER_CLASS,
  STATUS_BY_KEY,
  STATUS_CLASS,
  SWATCH_CLASS,
  STATUSES,
  USUAL_ACCENTS,
  type BoardCard,
  type BoardData,
  type Modifier,
  type StatusKey,
} from "@/content/notation";
import { cn } from "@/lib/utils";

// An elbow (orthogonal) connector: out of the source's right edge, across to
// the target column, then straight down into the cartouche top. Right angles,
// matching the board's Miro elbow connectors; the head enters from above.
function elbowPath(a: { x1: number; y1: number; x2: number; y2: number }): string {
  return `M ${a.x1} ${a.y1} L ${a.x2} ${a.y1} L ${a.x2} ${a.y2}`;
}

// ── A single card, presentational. Fill + strong border + label. ─────────────
export function NotationCard({
  name,
  colorClass,
  label,
  modifier,
  active,
  ghost,
  cardRef,
  className,
}: {
  name: string;
  colorClass: string;
  label?: string;
  modifier?: Modifier;
  active?: boolean;
  ghost?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  className?: string;
}) {
  const blocked = modifier === "blocked";
  return (
    <div
      ref={cardRef}
      className={cn(
        "min-h-[46px] overflow-hidden rounded-[12px] border-[2.5px] px-2.5 py-1.5 text-left leading-tight transition-[background-color,border-color,box-shadow,opacity] duration-500",
        blocked ? MODIFIER_CLASS.blocked : colorClass,
        modifier === "attention" && MODIFIER_CLASS.attention,
        active && "ring-2 ring-ink ring-offset-2 ring-offset-panel",
        ghost && "opacity-30",
        className,
      )}
    >
      <span className="block font-display text-[12.5px] font-semibold">{name}</span>
      {label && (
        <span className="mt-0.5 block font-body text-[10.5px] font-medium opacity-80">{label}</span>
      )}
    </div>
  );
}

type Overlay = {
  cartouche?: { x: number; y: number; w: number; h: number };
  arrow?: { x1: number; y1: number; x2: number; y2: number };
};

// ── The full roadmap board: tracks (rows) x time (columns) ───────────────────
export function RoadmapBoard({
  data = DATA_HERO,
  mode = "lmapping",
  live = false,
  className,
}: {
  data?: BoardData;
  mode?: "lmapping" | "usual";
  live?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [overlay, setOverlay] = useState<Overlay>({});

  const [liveDone, setLiveDone] = useState(false);
  useLayoutEffect(() => {
    if (!live || reduce) return;
    const t = setTimeout(() => setLiveDone(true), 2400);
    return () => clearTimeout(t);
  }, [live, reduce]);

  // Measure the cartouche frame, then aim the dependency arrow at the cartouche.
  useLayoutEffect(() => {
    if (mode !== "lmapping") {
      setOverlay({});
      return;
    }
    const compute = () => {
      const board = boardRef.current;
      if (!board) return;
      const b = board.getBoundingClientRect();
      const rectOf = (id: string) => refs.current.get(id)?.getBoundingClientRect();

      const cr = data.cartouche.cardIds.map(rectOf).filter(Boolean) as DOMRect[];
      let cartouche: Overlay["cartouche"];
      if (cr.length === data.cartouche.cardIds.length) {
        const minX = Math.min(...cr.map((r) => r.left)) - b.left;
        const minY = Math.min(...cr.map((r) => r.top)) - b.top;
        const maxX = Math.max(...cr.map((r) => r.right)) - b.left;
        const maxY = Math.max(...cr.map((r) => r.bottom)) - b.top;
        cartouche = { x: minX - 8, y: minY - 11, w: maxX - minX + 16, h: maxY - minY + 30 };
      }

      const f = rectOf(data.dependency.from);
      const t = rectOf(data.dependency.to);
      let arrow: Overlay["arrow"];
      // The arrow attaches to the grey cartouche (not the inner card): it enters
      // the cartouche's TOP edge, at the target card's column.
      if (f && t && cartouche) {
        arrow = {
          x1: f.right - b.left,
          y1: f.top + f.height / 2 - b.top,
          x2: t.left + t.width / 2 - b.left,
          y2: cartouche.y - 1,
        };
      }
      setOverlay({ cartouche, arrow });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (boardRef.current) ro.observe(boardRef.current);
    const settle = setTimeout(compute, 300);
    return () => {
      ro.disconnect();
      clearTimeout(settle);
    };
  }, [mode, data]);

  const statusOf = (c: BoardCard): StatusKey =>
    live && c.id === data.liveCardId && liveDone ? "done" : c.status;

  const colorFor = (c: BoardCard, colIndex: number) =>
    mode === "usual" ? USUAL_ACCENTS[colIndex % USUAL_ACCENTS.length] : STATUS_CLASS[statusOf(c)];

  const labelFor = (c: BoardCard, period: string) =>
    mode === "usual" ? period : STATUS_BY_KEY[statusOf(c)].label;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={boardRef}
        className="no-scrollbar relative grid min-w-[560px] gap-x-2.5 gap-y-2 pb-7 md:min-w-0"
        style={{ gridTemplateColumns: `88px repeat(${data.periods.length}, minmax(0, 1fr))` }}
      >
        {/* column headers */}
        <div aria-hidden />
        {data.periods.map((p) => (
          <div key={p} className="flex items-baseline justify-between px-1 pb-0.5">
            <span className="font-display text-[12px] font-semibold text-ink">{p}</span>
            <span className="font-display text-[10px] text-muted">{data.year}</span>
          </div>
        ))}

        {/* one row per track */}
        {data.tracks.map((track) => (
          <React.Fragment key={track}>
            <div className="flex items-center pr-1">
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                {track}
              </span>
            </div>
            {data.periods.map((period, ci) => {
              const card = data.cards.find((c) => c.track === track && c.period === ci);
              return (
                <div key={period} className="min-h-[52px]">
                  {card && (
                    <NotationCard
                      name={card.name}
                      colorClass={colorFor(card, ci)}
                      label={labelFor(card, period)}
                      modifier={mode === "lmapping" ? card.modifier : undefined}
                      cardRef={(el) => {
                        if (el) refs.current.set(card.id, el);
                        else refs.current.delete(card.id);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* measured overlay: release cartouche + inter-track dependency (elbow) */}
        {mode === "lmapping" && (overlay.cartouche || overlay.arrow) && (
          <>
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <marker id="lm-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M0,0 L12,6 L0,12 L4,6 z" fill="var(--color-ink2)" />
                </marker>
              </defs>
              {overlay.cartouche && (
                <rect
                  x={overlay.cartouche.x}
                  y={overlay.cartouche.y}
                  width={overlay.cartouche.w}
                  height={overlay.cartouche.h}
                  rx={14}
                  fill="none"
                  stroke="#b0b0b0"
                  strokeWidth={2}
                />
              )}
              {overlay.arrow && (
                <path
                  d={elbowPath(overlay.arrow)}
                  fill="none"
                  stroke="var(--color-ink2)"
                  strokeWidth={1.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  markerEnd="url(#lm-arrow)"
                  opacity={0.7}
                />
              )}
            </svg>
            {/* release tag: green diamond + red-outlined label, HANGING at the cartouche's
                BOTTOM-right (SOP Notation Key: .cart-tag { right:11px; bottom:-12px }) */}
            {overlay.cartouche && (
              <div
                className="pointer-events-none absolute z-[3] flex -translate-x-full items-center gap-1"
                style={{ left: overlay.cartouche.x + overlay.cartouche.w - 4, top: overlay.cartouche.y + overlay.cartouche.h - 8 }}
              >
                <span className="h-3 w-3 shrink-0 rotate-45 rounded-[2px] border border-done-b bg-done" aria-hidden />
                <span className="whitespace-nowrap rounded-md border-[1.5px] border-blocked bg-panel px-1.5 py-0.5 font-display text-[9px] font-bold text-blocked">
                  {data.cartouche.label}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── The legend: status swatches + modifiers ──────────────────────────────────
export function Legend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-3.5 gap-y-1.5", className)}>
      {STATUSES.map((s) => (
        <li key={s.key} className="inline-flex items-center gap-1.5">
          <span className={cn("h-2.5 w-2.5 rounded-[3px] border-2", SWATCH_CLASS[s.key])} aria-hidden />
          <span className="font-body text-[11.5px] text-muted">{s.label}</span>
        </li>
      ))}
      <li className="ml-1 inline-flex items-center gap-1.5 border-l border-line pl-3.5">
        <span className="h-2.5 w-2.5 rounded-[3px] border-2 border-[#c02200] bg-blocked" aria-hidden />
        <span className="font-body text-[11.5px] text-muted">Blocked</span>
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px] border-[2.5px] border-blocked bg-line2" aria-hidden />
        <span className="font-body text-[11.5px] text-muted">Attention</span>
      </li>
    </ul>
  );
}

export function Swatch({ statusKey, className }: { statusKey: StatusKey; className?: string }) {
  return (
    <span
      className={cn("inline-block h-3 w-3 shrink-0 rounded-[3px] border-2", SWATCH_CLASS[statusKey], className)}
      aria-hidden
    />
  );
}
