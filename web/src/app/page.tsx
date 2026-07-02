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

export default function Home() {
  return (
    <>
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
