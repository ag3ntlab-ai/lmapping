import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NotationDetail } from "@/components/notation-detail";

export const metadata: Metadata = {
  title: "The Lmapping notation: the full reading key",
  description:
    "The complete Lmapping notation and its usage rules: status is a colour, phase is a position, and how time constrains a card. Accurate, open, and free.",
};

export default function NotationPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <NotationDetail />
      </main>
      <SiteFooter />
    </>
  );
}
