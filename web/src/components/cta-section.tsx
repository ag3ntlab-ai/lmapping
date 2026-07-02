import { Section } from "@/components/section";
import { LeadForm } from "@/components/lead-form";
import { CATEGORY, CTA } from "@/content/site";

export function CtaSection() {
  return (
    <Section id="early-access" className="py-20 sm:py-28">
      <div className="grid gap-10 rounded-[calc(var(--radius-card)+8px)] border border-line bg-panel px-6 py-12 shadow-[0_1px_0_#fff_inset,0_40px_90px_-60px_rgba(22,24,29,0.4)] sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16 lg:px-14 lg:py-16">
        <div>
          <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
            {CATEGORY.title}
          </p>
          <h2 className="mt-3 font-display text-[30px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[2.5rem]">
            {CTA.title}
          </h2>
          <p className="mt-4 max-w-md text-[16.5px] leading-relaxed text-ink2">{CTA.body}</p>
        </div>
        <LeadForm />
      </div>
    </Section>
  );
}
