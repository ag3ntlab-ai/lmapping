import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy | Lmapping",
  description:
    "What data Lmapping collects when you request early access, why, where it lives, and your rights.",
};

const UPDATED = "3 July 2026";
const CONTACT = "nicozefrench@gmail.com";
// Reflects the live DATABASE_URL region. Currently Neon us-east-1 (United States).
// If the database ever moves to the EU, update this to match; never claim a
// region the database is not actually in.
const DB_LOCATION = "the United States";
const linkCls =
  "font-medium text-ink underline decoration-line underline-offset-2 hover:decoration-ink";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-display text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          Privacy
        </p>
        <h1 className="mt-3 font-display text-[30px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          What we collect, and why
        </h1>
        <p className="mt-2 text-[13.5px] text-muted">Last updated {UPDATED}</p>

        <div className="mt-10 grid gap-9">
          <Section title="Who is responsible">
            {SITE.author}, operator of lmapping.com, is the data controller. For anything about your
            data, email{" "}
            <a href={`mailto:${CONTACT}`} className={linkCls}>
              {CONTACT}
            </a>
            .
          </Section>

          <Section title="What we collect">
            When you request early access, we collect your <strong>first name</strong>,{" "}
            <strong>last name</strong>, and <strong>email address</strong>. We also record the date
            you consented and the version of this notice you agreed to. That is all. We do not ask for
            a phone number, and we set no tracking cookies.
          </Section>

          <Section title="Why we collect it">
            Only to add you to the Lmapping early-access list and send you occasional updates about
            Lmapping. We do not sell or share your data, and we do not use it for anything else.
          </Section>

          <Section title="Our legal basis">
            Your consent, given through the opt-in checkbox on the form. You can withdraw it at any
            time, and we act on it (see your rights below).
          </Section>

          <Section title="Analytics">
            We use Vercel Web Analytics to count page views. It is cookieless: it sets no cookies and
            builds no profile of you, which is why the site shows no cookie banner.
          </Section>

          <Section title="Where your data lives">
            Our database is hosted by Neon in {DB_LOCATION}. The site is hosted by Vercel, a US
            company, under Standard Contractual Clauses. We keep a data processing agreement with
            each.
          </Section>

          <Section title="How long we keep it">
            Until you ask us to remove you, or until the early-access list is closed, whichever comes
            first.
          </Section>

          <Section title="Your rights">
            You can ask to access, correct, or delete your data, or withdraw your consent, at any
            time. Email{" "}
            <a href={`mailto:${CONTACT}`} className={linkCls}>
              {CONTACT}
            </a>{" "}
            and we will handle it.
          </Section>

          <Section title="Changes to this notice">
            If anything material changes, we update the date at the top of this page.
          </Section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[16px] font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink2">{children}</p>
    </section>
  );
}
