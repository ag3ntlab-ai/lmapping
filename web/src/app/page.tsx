import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Reconcile } from "@/components/reconcile";
import { NotationKey } from "@/components/notation-key";
import { ReadACard } from "@/components/read-a-card";
import { CardLife } from "@/components/card-life";
import { Levels } from "@/components/levels";
import { Compare } from "@/components/compare";
import { BuiltForAI } from "@/components/built-for-ai";
import { Simplicity } from "@/components/simplicity";
import { Positioning } from "@/components/positioning";
import { CtaSection } from "@/components/cta-section";
import { Author } from "@/components/author";
import { SiteFooter } from "@/components/site-footer";

// FAQPage JSON-LD, alongside the CreativeWork JSON-LD in the root layout.
// Every answer is a reformulation of copy already published on this page /
// /notation / llms.txt (src/content/site.ts, src/content/notation-page.ts) —
// no fact or claim is introduced here that isn't already on the site.
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does status mean in the Lmapping notation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Status is the colour: a closed, deliberately-sequenced eight-status lifecycle (Demand, Intend, Commit, Solution, Specifications, Development, QA, Done/Release). A colour means the same thing anywhere on the board, so nobody re-learns a legend.",
      },
    },
    {
      "@type": "Question",
      name: "What does phase mean in the Lmapping notation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Phase is the name and the column: where a card sits in time. Status and phase are two independent axes, so changing one never changes the other, which is what keeps a card unambiguous.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I draw a Lmapping roadmap?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On any canvas that can place a coloured box and an arrow, such as Miro, Excalidraw, FigJam, tldraw, or any whiteboard. There is nothing complex to learn, and changes are made in seconds, not hours.",
      },
    },
    {
      "@type": "Question",
      name: "Can an AI read a Lmapping roadmap?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The notation is machine-readable by design, and a read-skill, compatible with OpenAI and Anthropic, turns the board into structured data instead of a screenshot or a lock-in API.",
      },
    },
    {
      "@type": "Question",
      name: "Can an AI update a Lmapping roadmap?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A write-skill, also compatible with OpenAI and Anthropic, applies changes back to the board in valid notation, so an AI can manage the roadmap rather than only read it.",
      },
    },
    {
      "@type": "Question",
      name: "Is Lmapping free and open, or does it lock you into a platform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lmapping is an open, free spec released under a CC BY-SA 4.0 licence, with zero lock-in to Jira, Aha! or any paid platform.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Reconcile />
        <NotationKey />
        <ReadACard />
        <CardLife />
        <Levels />
        <Compare />
        <BuiltForAI />
        <Simplicity />
        <Positioning />
        <CtaSection />
        <Author />
      </main>
      <SiteFooter />
    </>
  );
}
