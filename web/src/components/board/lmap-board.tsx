"use client";

import * as React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { LMAP_CLASS, type LmapData, type LmapTag } from "@/content/notation";
import { NotationCard } from "@/components/board/board";
import { cn } from "@/lib/utils";

const ROW_H = 56; // fixed lane height -> two boards on the same grid align to the pixel

type Rect = { left: number; top: number; right: number; bottom: number; cx: number; cy: number };
type Cart = { id: string; label: string; tag?: LmapTag; x: number; y: number; w: number; h: number };
type Arrow = { id: string; x1: number; y1: number; x2: number; y2: number; kind: "line" | "sElbow" | "dropElbow" };
type Tag = { id: string; kind: LmapTag; label: string; x: number; y: number };

// Three shapes, all ending horizontally so the solid triangle enters head-on:
//  - line: a straight run (card -> card).
//  - sElbow: origin FAR from the cartouche -> exit right, run across, curve down,
//    curve back right, touch the cartouche border at its vertical middle.
//  - dropElbow: origin ADJACENT (an expanded chain-end) -> exit the card's BOTTOM,
//    drop straight down, then a rounded turn right into the cartouche border.
function pathFor(a: Arrow): string {
  if (a.kind === "line") return `M ${a.x1} ${a.y1} H ${a.x2}`;
  const dy = a.y2 >= a.y1 ? 1 : -1;
  if (a.kind === "dropElbow") {
    const r = Math.max(2, Math.min(10, Math.floor(Math.abs(a.y2 - a.y1) / 2), Math.abs(a.x2 - a.x1)));
    return `M ${a.x1} ${a.y1} V ${a.y2 - dy * r} Q ${a.x1} ${a.y2} ${a.x1 + r} ${a.y2} H ${a.x2}`;
  }
  const gap = Math.max(4, a.x2 - a.x1);
  const r = Math.max(2, Math.min(9, Math.floor(gap / 2), Math.floor(Math.abs(a.y2 - a.y1) / 2)));
  const xTurn = Math.min(a.x2 - r, Math.max(a.x1 + r, a.x2 - 12));
  return `M ${a.x1} ${a.y1} H ${xTurn - r} Q ${xTurn} ${a.y1} ${xTurn} ${a.y1 + dy * r} V ${a.y2 - dy * r} Q ${xTurn} ${a.y2} ${xTurn + r} ${a.y2} H ${a.x2}`;
}

export function LmapBoard({ data, className }: { data: LmapData; className?: string }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [ov, setOv] = useState<{ carts: Cart[]; arrows: Arrow[]; tags: Tag[] }>({ carts: [], arrows: [], tags: [] });

  useLayoutEffect(() => {
    const compute = () => {
      const board = boardRef.current;
      if (!board) return;
      const b = board.getBoundingClientRect();
      const rect = (id: string): Rect | null => {
        const el = refs.current.get(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: r.left - b.left,
          top: r.top - b.top,
          right: r.right - b.left,
          bottom: r.bottom - b.top,
          cx: r.left - b.left + r.width / 2,
          cy: r.top - b.top + r.height / 2,
        };
      };

      const carts: Cart[] = [];
      (data.cartouches ?? []).forEach((c) => {
        const rs = c.cardIds.map(rect).filter(Boolean) as Rect[];
        if (rs.length !== c.cardIds.length) return;
        const minX = Math.min(...rs.map((r) => r.left));
        const minY = Math.min(...rs.map((r) => r.top));
        const maxX = Math.max(...rs.map((r) => r.right));
        const maxY = Math.max(...rs.map((r) => r.bottom));
        carts.push({ id: c.id, label: c.label, tag: c.tag, x: minX - 5, y: minY - 8, w: maxX - minX + 10, h: maxY - minY + 16 });
      });

      const arrows: Arrow[] = [];
      (data.arrows ?? []).forEach((a) => {
        const to = a.toKind === "cartouche" ? carts.find((c) => c.id === a.to) : rect(a.to);
        if (!to) return;
        const f = a.from === "edge:left" ? null : rect(a.from);
        if (a.from !== "edge:left" && !f) return;

        if (a.toKind === "cartouche") {
          const c = to as Cart;
          const x2 = c.x; // touch the grey cartouche's left border
          const y2 = c.y + c.h / 2; // at its vertical middle
          if (f && c.x - f.right < 48) {
            // ADJACENT (expanded chain-end): exit the card's bottom, drop, turn right
            arrows.push({ id: a.id, x1: f.cx, y1: f.bottom, x2, y2, kind: "dropElbow" });
          } else {
            // FAR: exit the right edge and S-curve into the cartouche
            arrows.push({ id: a.id, x1: f ? f.right : 0, y1: f ? f.cy : y2, x2, y2, kind: "sElbow" });
          }
        } else {
          const r = to as Rect;
          arrows.push({ id: a.id, x1: f ? f.right : 0, y1: f ? f.cy : r.cy, x2: r.left, y2: r.cy, kind: "line" });
        }
      });

      const tags: Tag[] = [];
      data.cards.forEach((card) => {
        if (!card.tag) return;
        const r = rect(card.id);
        if (r) tags.push({ id: card.id, kind: card.tag, label: card.tag === "app-release" ? "App release" : "BE update", x: r.right, y: r.bottom });
      });
      carts.forEach((c) => {
        if (c.tag) tags.push({ id: c.id, kind: c.tag, label: c.label, x: c.x + c.w, y: c.y + c.h });
      });

      setOv({ carts, arrows, tags });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (boardRef.current) ro.observe(boardRef.current);
    const t = setTimeout(compute, 250);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [data]);

  const nCols = data.months.length;

  return (
    <div className={cn("relative", className)}>
      <div className="rounded-[12px] border border-line bg-[color-mix(in_srgb,var(--color-ink)_1.5%,transparent)] p-2.5">
      <div
        ref={boardRef}
        className="no-scrollbar relative grid min-w-[700px] gap-x-3 gap-y-2 md:min-w-0"
        style={{ gridTemplateColumns: `repeat(${nCols}, minmax(0, 1fr)) 12px`, gridTemplateRows: `auto repeat(${data.rows}, ${ROW_H}px) 20px` }}
      >
        {/* column guides: dividers + current-month tint, behind the cards */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid gap-x-3"
          style={{ gridTemplateColumns: `repeat(${nCols}, minmax(0, 1fr)) 12px` }}
        >
          {Array.from({ length: nCols }).map((_, gi) => (
            <div
              key={gi}
              className={cn(gi > 0 && "border-l border-line2/70")}
              style={gi === data.currentMonth ? { backgroundColor: "#F503EB0d" } : undefined}
            />
          ))}
        </div>
        {/* month header */}
        {data.months.map((m, i) => (
          <div
            key={m + i}
            className={cn(
              "flex items-center justify-center rounded-[7px] px-2 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.04em] text-white",
              i === data.currentMonth ? "bg-[#F503EB]" : "bg-[#b4b4b4]",
            )}
          >
            {m}
          </div>
        ))}

        {/* cards */}
        {data.cards.map((card) => (
          <div
            key={card.id}
            style={{ gridColumn: `${card.col + 1} / span ${card.span ?? 1}`, gridRow: card.row + 2 }}
            className="self-center"
          >
            <NotationCard
              name={card.name}
              colorClass={LMAP_CLASS[card.status]}
              label={card.sub}
              modifier={card.modifier}
              cardRef={(el) => {
                if (el) refs.current.set(card.id, el);
                else refs.current.delete(card.id);
              }}
            />
          </div>
        ))}

        {/* overlay: cartouches + arrows */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <marker id="lmap-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-ink2)" />
            </marker>
          </defs>
          {ov.carts.map((c) => (
            <rect key={c.id} x={c.x} y={c.y} width={c.w} height={c.h} rx={14} fill="none" stroke="#b0b0b0" strokeWidth={2} />
          ))}
          {ov.arrows.map((a) => (
            <path
              key={a.id}
              d={pathFor(a)}
              fill="none"
              stroke="var(--color-ink2)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              markerEnd="url(#lmap-head)"
              opacity={0.9}
            />
          ))}
        </svg>

        {/* tags: green diamond + red-outlined label (App release) / orange diamond (BE update) */}
        {ov.tags.map((t) => (
          <div
            key={t.id + t.kind}
            className="pointer-events-none absolute z-[3] flex -translate-x-full items-center gap-1"
            style={{ left: t.x - 4, top: t.y - 8 }}
          >
            <span
              className={cn(
                "h-3 w-3 shrink-0 rotate-45 rounded-[2px] border",
                t.kind === "app-release" ? "border-done-b bg-done" : "border-[#d19a00] bg-[#ffb800]",
              )}
              aria-hidden
            />
            <span
              className={cn(
                "whitespace-nowrap rounded-md border-[1.5px] bg-panel px-1.5 py-0.5 font-display text-[9px] font-bold",
                t.kind === "app-release" ? "border-blocked text-blocked" : "border-[#d19a00] text-[#7a5a00]",
              )}
            >
              {t.label}
            </span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
