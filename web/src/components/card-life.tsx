"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useReducedMotion } from "motion/react";
import { PlayIcon, PauseIcon } from "@phosphor-icons/react";
import { PLAYER } from "@/content/site";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// The life of a card. Faithful port of the Operating SOP §02 reference player:
// a FIXED "now" playhead, and the time-strip TRANSLATES beneath it (months flow
// past). One card lands on its target month, commits, then EXPANDS into its
// milestone chain, retro-planned back from the release, with a mid-Spec slip.
// Content is generic (no real-company data); mechanics/layout reproduced exactly.
// ─────────────────────────────────────────────────────────────────────────────

// 12 months of calendar, repeated once so the grid keeps filling past the
// viewport: at the end of the timeline the strip scrolls ~17 columns, so a
// single 12-month strip would run out into white on the right. 24 covers any width.
const MONTHS12 = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const MLAB = [...MONTHS12, ...MONTHS12];
const PHASE = ["Solution", "Specs", "Dev", "QA", "Release"];
const A = 0.33; // scrub point where the single card expands into the chain
const PAD = 6;
const SLIP = 4.5; // now-month at mid-Spec where Dev commits and the tail slips +1
const CHAIN_PRE = [3, 4, 5, 6, 7];
const CHAIN_POST = [3, 4, 6, 7, 8];
const CARD_NAME = "Public API"; // the card name never changes; generic + étanche
const OWN = "the product owners";

const BEATS: [string, number][] = [
  ["Demand", 0.0], ["Intend", 0.11], ["Commit", 0.22], ["Expanded", 0.33], ["Solution", 0.44],
  ["Specs", 0.55], ["Dev", 0.66], ["QA", 0.77], ["Release", 0.88],
];
// scrub (0..1) -> now-month on an honest calendar (fractional month index)
const ANCH: [number, number][] = [
  [0, 0.5], [0.11, 1.0], [0.22, 1.7], [0.33, 1.9], [0.44, 3.0],
  [0.55, 4.0], [0.66, 6.0], [0.77, 7.0], [0.88, 8.0], [1.0, 8.8],
];

type StateKey = "Demand" | "Intend" | "Commit" | "Done" | "Solution" | "Specifications" | "Development" | "QA" | "Release";
const STATES: Record<StateKey, { bg: string; bd: string; tx: string; s: string }> = {
  Demand:         { bg: "var(--color-demand)",   bd: "var(--color-demand-b)",   tx: "#2a1448", s: "Demand" },
  Intend:         { bg: "var(--color-intend)",   bd: "var(--color-intend-b)",   tx: "#3a2458", s: "Intend" },
  Commit:         { bg: "var(--color-commit)",   bd: "var(--color-commit-b)",   tx: "#5a1a14", s: "Commit" },
  Done:           { bg: "var(--color-done)",     bd: "var(--color-done-b)",     tx: "#2e4718", s: "Done" },
  Solution:       { bg: "var(--color-solution)", bd: "var(--color-solution-b)", tx: "#06425a", s: "active" },
  Specifications: { bg: "var(--color-spec)",     bd: "var(--color-spec-b)",     tx: "#0a3550", s: "active" },
  Development:    { bg: "var(--color-dev)",       bd: "var(--color-dev-b)",     tx: "#4a3b00", s: "active" },
  QA:             { bg: "var(--color-qa)",        bd: "var(--color-qa-b)",      tx: "#16402a", s: "active" },
  Release:        { bg: "var(--color-done)",      bd: "var(--color-done-b)",    tx: "#2e4718", s: "active" },
};

// grey phantom cards (other work already on the board) in the upper rows, so the
// board reads as a full, living roadmap at any scroll. Columns 0-7 reproduce the
// reference exactly; the same density continues across the extended calendar so
// the background is never empty. Per column: how many phantom rows (0, 1 or 2).
const PHANTOM_ROWS = [2, 2, 2, 2, 0, 1, 0, 1, 2, 1, 2, 1, 0, 2, 1, 1, 2, 0, 1, 2, 1, 1, 0, 2];
const TAKEN: [number, number][] = [];
PHANTOM_ROWS.forEach((n, c) => {
  for (let r = 0; r < n; r++) TAKEN.push([c, r]);
});

function nowMonth(t: number): number {
  for (let i = 0; i < ANCH.length - 1; i++) {
    if (t <= ANCH[i + 1][0]) {
      const a = ANCH[i], b = ANCH[i + 1], f = (t - a[0]) / ((b[0] - a[0]) || 1);
      return a[1] + (b[1] - a[1]) * f;
    }
  }
  return ANCH[ANCH.length - 1][1];
}

// [Solution, Spec, Dev, QA, Release] state keys by now-month (with the slip)
function statusFor(nm: number): StateKey[] {
  if (nm < 3) return ["Commit", "Intend", "Intend", "Intend", "Intend"];
  if (nm < 4) return ["Solution", "Commit", "Intend", "Intend", "Intend"];
  if (nm < SLIP) return ["Done", "Specifications", "Intend", "Intend", "Intend"];
  if (nm < 5) return ["Done", "Specifications", "Commit", "Intend", "Intend"];
  if (nm < 6) return ["Done", "Done", "Commit", "Intend", "Intend"];
  if (nm < 7) return ["Done", "Done", "Development", "Commit", "Commit"];
  if (nm < 8) return ["Done", "Done", "Done", "QA", "Commit"];
  if (nm < 8.6) return ["Done", "Done", "Done", "Done", "Release"];
  return ["Done", "Done", "Done", "Done", "Done"];
}

type CapKind = "pre" | "front" | "exec";
function captionFor(t: number, nm: number): [CapKind, string, string] {
  if (t < A) {
    if (t < 0.11) return ["pre", "Demand", "Mid-December: a demand is logged, placed on its target <b>June</b>. Status <b>Demand</b>, time is already moving."];
    if (t < 0.22) return ["front", "Intend", "Early January: <b>Intend</b>, still anchored to June. Now keeps advancing."];
    return ["front", "Commit", `${OWN}: <b>Commit</b>, repositioned to <b>July</b> (capacity: other projects finish first). Committed, <b>not started</b>.`];
  }
  if (nm < 3) return ["front", "Expanded", "End-January: the owners <b>commit in July</b> (capacity pushed it from June), then <b>expand</b>, retro-planned from July. Solution in <b>Commit</b> (Mar), the rest Intend."];
  if (nm < 4) return ["front", "Solution", `Now enters <b>March</b>: <b>Solution active</b> (front: ${OWN}). The chain is reviewed, <b>Spec moves to Commit</b>.`];
  if (nm < SLIP) return ["front", "Specs", "<b>Specifications active</b> (April). Solution <b>done</b>."];
  if (nm < 6) return ["front", "Specs", "<b>Mid-Spec:</b> detailed effort view, <b>Dev commits and slips +1</b> (dev runs longer). <b>May empties</b>; the tail moves Dev to Jun, QA to Jul, Release to Aug."];
  if (nm < 7) return ["exec", "Dev", "<b>Development active</b> (June, delivery). Specs <b>done</b>. Good visibility, <b>QA and Release move to Commit</b>."];
  if (nm < 8) return ["exec", "QA", "<b>QA active</b> (July, delivery). Dev <b>done</b>. Release <b>still Commit</b>."];
  if (nm < 8.6) return ["exec", "Release", "<b>Release active</b> (August, green = done). QA <b>done</b>."];
  return ["exec", "Done", "<b>All done.</b> The card exits to the left, into the past."];
}

// The caption pin is coloured by the STATUS it names, straight from the Notation
// Model Key (QA and Release are two DIFFERENT greens: qa #a1e5b8/#599c70,
// release #c9e8a8/#92d050), not by a front/exec zone.
const PIN_COLOR: Record<string, { bg: string; bd: string; tx: string }> = {
  Demand: STATES.Demand,
  Intend: STATES.Intend,
  Commit: STATES.Commit,
  Expanded: { bg: "var(--color-line2)", bd: "var(--color-line)", tx: "var(--color-muted)" },
  Solution: STATES.Solution,
  Specs: STATES.Specifications,
  Dev: STATES.Development,
  QA: STATES.QA,
  Release: STATES.Release,
  Done: STATES.Done,
};

export function CardLife() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(860);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  // measure the stage so the strip math (COL = W/9) matches the reference
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Play: advance the scrub over ~16s (matches the reference traversal speed)
  const raf = useRef<number | null>(null);
  const lastTs = useRef<number>(0);
  useEffect(() => {
    if (!playing) return;
    lastTs.current = performance.now();
    const tick = (now: number) => {
      const dt = now - lastTs.current;
      lastTs.current = now;
      setT((prev) => {
        const next = Math.min(1, prev + dt / 16000);
        if (next >= 1) setPlaying(false);
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  const toggle = () => {
    if (t >= 0.999) setT(0);
    setPlaying((p) => !p);
  };
  const onScrub = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaying(false);
    setT(Number(e.target.value) / 1000);
  };

  // derived layout (identical formulas to the reference)
  const COL = W / 9;
  const nowPx = 2.4 * COL;
  const CARDW = COL - 2 * PAD;
  const nm = nowMonth(t);
  const stripX = nowPx - (nm + 2) * COL;
  const nowCol = Math.floor(nm) + 2; // the month column under the fixed playhead (light-pink highlight)
  const expanded = t >= A;
  const chainPos = nm < SLIP ? CHAIN_PRE : CHAIN_POST;
  const cfg = statusFor(nm);
  const [, capPin, capHtml] = captionFor(t, nm);
  const pin = PIN_COLOR[capPin] ?? PIN_COLOR.Done;
  const heroKey: StateKey = t < 0.11 ? "Demand" : t < 0.22 ? "Intend" : "Commit";
  const heroMonth = nm < 1.7 ? 6 : 7;

  // active beat (last beat at or before t)
  let activeBeat = 0;
  for (let k = 0; k < BEATS.length; k++) if (BEATS[k][1] <= t + 1e-6) activeBeat = k;

  const cardBase =
    "absolute z-[2] flex h-[42px] flex-col justify-center gap-[2px] overflow-hidden rounded-[9px] border-2 px-2 shadow-[0_6px_16px_-10px_rgba(27,26,34,0.4)] transition-[background-color,border-color,color,left] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]";

  return (
    <Section className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.015em] text-ink sm:text-[2.4rem]">
          {PLAYER.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink2">{PLAYER.body}</p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-[calc(var(--radius-card)+6px)] border border-line bg-panel p-5 shadow-[0_1px_0_#fff_inset,0_30px_70px_-52px_rgba(22,24,29,0.35)] sm:p-7">
        {/* the stage: a fixed "now" playhead, the time-strip translates beneath it */}
        <div ref={stageRef} className="relative h-[208px] overflow-hidden rounded-2xl border border-line bg-panel">
          {/* the moving time-strip */}
          <div className="absolute inset-0" style={{ transform: `translateX(${stripX}px)` }}>
            {/* month columns */}
            {MLAB.map((lab, k) => (
              <div
                key={lab + k}
                className={cn("absolute bottom-0 top-0 border-l border-dashed border-line", k % 2 && k !== nowCol ? "bg-[#faf9fd]" : "")}
                style={{ left: k * COL, width: COL, backgroundColor: k === nowCol ? "#F503EB0d" : undefined }}
              >
                <span className="absolute left-[9px] top-[9px] font-display text-[10.5px] font-semibold uppercase tracking-[0.4px] text-[#b8b3c4]">
                  {lab}
                </span>
              </div>
            ))}

            {/* grey background slots (other work already on the board) */}
            {TAKEN.map(([mo, row], j) => (
              <div
                key={j}
                className="absolute h-5 rounded-[5px] border border-[#e0dcea] bg-[#ece9f2]"
                style={{ left: mo * COL + 8, top: 50 + row * 28, width: COL - 16 }}
              />
            ))}

            {/* the single card (before it expands) */}
            {!expanded && (
              <div
                className={cardBase}
                style={{
                  left: (heroMonth + 2) * COL + PAD,
                  top: 116,
                  width: CARDW,
                  background: STATES[heroKey].bg,
                  borderColor: STATES[heroKey].bd,
                  color: STATES[heroKey].tx,
                }}
              >
                <span className="truncate font-display text-[10.5px] font-semibold leading-tight">{CARD_NAME}</span>
                <span className="truncate font-body text-[9px] leading-tight opacity-80">{STATES[heroKey].s}</span>
              </div>
            )}

            {/* the expanded milestone chain (name never changes) */}
            {expanded &&
              PHASE.map((phase, idx) => {
                const st = STATES[cfg[idx]];
                return (
                  <div
                    key={phase}
                    className={cn(cardBase, !reduce && "animate-[pl-flash_0.5s_ease]")}
                    style={{
                      left: (chainPos[idx] + 2) * COL + PAD,
                      top: 116,
                      width: CARDW,
                      background: st.bg,
                      borderColor: st.bd,
                      color: st.tx,
                    }}
                  >
                    <span className="truncate font-display text-[10.5px] font-semibold leading-tight">{CARD_NAME}</span>
                    <span className="truncate font-body text-[9px] leading-tight opacity-80">{`${phase} - ${st.s}`}</span>
                  </div>
                );
              })}
          </div>

          {/* the FIXED now playhead */}
          <div className="absolute bottom-0 top-0 z-[5] w-[2px] bg-ink" style={{ left: nowPx }} aria-hidden>
            <span
              className="absolute left-1/2 top-[6px] -translate-x-1/2 whitespace-nowrap rounded-[5px] px-[7px] py-px font-display text-[9.5px] font-bold tracking-[0.5px] text-white"
              style={{ backgroundColor: "#F503EB" }}
            >
              now
            </span>
          </div>
        </div>

        {/* the caption (pin + dynamic text) */}
        <div
          className="mt-3.5 flex min-h-[46px] items-center gap-2.5 rounded-[12px] border bg-panel px-[15px] py-[11px] text-[14px] text-ink2 transition-colors"
          style={{ borderColor: `color-mix(in srgb, ${pin.bd} 45%, var(--color-line))` }}
        >
          <span
            className="whitespace-nowrap rounded-md border px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.3px]"
            style={{ background: pin.bg, borderColor: pin.bd, color: pin.tx }}
          >
            {capPin}
          </span>
          <span dangerouslySetInnerHTML={{ __html: capHtml }} />
        </div>

        {/* transport: play + colourful scrub (thumb aligns with the beat ticks) */}
        <div className="mt-4 flex items-start gap-3.5">
          <button
            onClick={toggle}
            className="mt-px inline-flex h-10 min-w-[104px] shrink-0 items-center justify-center gap-1.5 rounded-[11px] bg-ink px-4 font-display text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.88]"
          >
            {playing ? <PauseIcon size={14} weight="fill" /> : <PlayIcon size={14} weight="fill" />}
            {playing ? "Pause" : t >= 0.999 ? "Replay" : "Play"}
          </button>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(t * 1000)}
              onChange={onScrub}
              aria-label="Playhead, the card's life"
              className="pl-scrub"
            />
            {/* beat ticks + labels, positioned to align with the thumb */}
            <div className="relative mt-2.5 h-[26px]">
              {BEATS.map(([label, frac], k) => (
                <div
                  key={label}
                  className={cn(
                    "absolute top-0 flex -translate-x-1/2 flex-col items-center gap-[3px] transition-colors",
                    k === activeBeat ? "text-ink" : "text-muted",
                  )}
                  style={{ left: `calc(9px + (100% - 18px) * ${frac})` }}
                >
                  <span
                    className={cn("w-[1.5px] rounded-[2px] transition-all", k === activeBeat ? "h-[9px] bg-ink" : "h-[6px] bg-[#cfcad9]")}
                    aria-hidden
                  />
                  <span className="hidden whitespace-nowrap font-display text-[9px] font-semibold sm:block">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center font-display text-[15px] font-medium text-ink">{PLAYER.note}</p>
    </Section>
  );
}
