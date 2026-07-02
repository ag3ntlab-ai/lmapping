import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Lmapping",
  alternateName: "The Lmapping roadmap notation",
  author: { "@type": "Person", name: "Nicolas Limare" },
  license: "https://creativecommons.org/licenses/by-sa/4.0/",
  url: "https://lmapping.com",
  sameAs: ["https://github.com/ag3ntlab-ai/lmapping"],
  description:
    "An open roadmap notation and delivery method where status is a colour and phase is a position, on a Kanban-Gantt board, readable identically by a human and an AI. Free and open under CC BY-SA 4.0.",
  keywords:
    "roadmap notation, kanban gantt, product roadmap, AI-readable roadmap, delivery method, status colour, machine-readable roadmap",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lmapping.com"),
  title: "Lmapping: the roadmap notation a human and a machine read the same",
  description:
    "Lmapping is a roadmap notation: status is a colour, phase is a position. Draw it anywhere, and an AI reads and updates it. Open and free.",
  applicationName: "Lmapping",
  appleWebApp: { capable: true, title: "Lmapping", statusBarStyle: "default" },
  openGraph: {
    title: "Lmapping: a roadmap notation for humans and machines",
    description:
      "Status is a colour. Phase is a position. One board your team reads at a glance and your AI reads without guessing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f7f9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col font-body text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
        {children}
      </body>
    </html>
  );
}
