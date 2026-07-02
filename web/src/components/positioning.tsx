import { POSITIONING } from "@/content/site";
import { STATUSES } from "@/content/notation";
import { Reveal } from "@/components/reveal";

// The one deliberate inverted band on the page: the positioning statement,
// in full, white on ink. Colour returns only as the signature legend.
export function Positioning() {
  return (
    <section className="bg-ink py-24 text-white sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <p className="font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-white sm:text-2xl">
            {POSITIONING.audience}
          </p>
          <p className="mt-3 text-[16px] leading-relaxed text-white/55 sm:text-[17px]">{POSITIONING.pain}</p>
        </Reveal>

        <div className="mt-8 space-y-5">
          {POSITIONING.paras.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className="text-[17px] leading-[1.65] text-white/85 sm:text-[19px]">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-white sm:text-[34px]">
            {POSITIONING.pull}
          </p>
        </Reveal>

        {/* signature: colour belongs to the method */}
        <Reveal delay={0.15}>
          <ul className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/12 pt-6">
            {STATUSES.map((s) => (
              <li key={s.key} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-[3px] border-2"
                  style={{ backgroundColor: `var(--color-${swatchVar(s.key)})`, borderColor: `var(--color-${swatchVar(s.key)}-b)` }}
                  aria-hidden
                />
                <span className="font-body text-[11.5px] text-white/60">{s.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function swatchVar(key: string): string {
  return key; // token names match the status keys (demand, intend, ...)
}
