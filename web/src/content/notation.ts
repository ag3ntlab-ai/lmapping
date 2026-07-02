// The notation itself: statuses, modifiers, and FOUR distinct board datasets
// (one per module, so no example repeats). Palette is the source of truth from
// ../../legend.json. Colour belongs to the method, never the chrome.

export type StatusKey =
  | "demand" | "intend" | "commit" | "solution"
  | "spec" | "dev" | "qa" | "done";

export type Status = {
  key: StatusKey;
  label: string;
  meaning: string;
  gate: string;
  zone: "planning" | "delivery";
};

export const STATUSES: Status[] = [
  { key: "demand",   label: "Demand",        zone: "planning", meaning: "Raised, not yet adopted onto the roadmap.",                    gate: "A request is raised. It is not on the roadmap yet." },
  { key: "intend",   label: "Intend",        zone: "planning", meaning: "Adopted as an intention, being shaped, not committed.",        gate: "Adopted as an intention. Being shaped, not committed." },
  { key: "commit",   label: "Commit",        zone: "planning", meaning: "Committed to a target period. Committed is not started.",      gate: "Committed to a target month. Committed is not started." },
  { key: "solution", label: "Solution",      zone: "planning", meaning: "Work begins here: the solution is defined. First active phase.", gate: "Solution validated. Work begins here." },
  { key: "spec",     label: "Specifications", zone: "planning", meaning: "The first release is specified. Handover happens at the end.", gate: "The first release is specified. Handover to delivery." },
  { key: "dev",      label: "Development",   zone: "delivery", meaning: "In build. The delivery zone.",                                 gate: "In build. The delivery team owns it now." },
  { key: "qa",       label: "QA",            zone: "delivery", meaning: "In verification.",                                            gate: "In verification. A failed check returns it to build." },
  { key: "done",     label: "Done / Release", zone: "delivery", meaning: "Delivered and released.",                                    gate: "Delivered. Released." },
];

export const STATUS_BY_KEY: Record<StatusKey, Status> = Object.fromEntries(
  STATUSES.map((s) => [s.key, s]),
) as Record<StatusKey, Status>;

// Tailwind class per status: light fill + stronger same-hue border + dark text.
export const STATUS_CLASS: Record<StatusKey, string> = {
  demand:   "bg-demand border-demand-b text-[#2a1448]",
  intend:   "bg-intend border-intend-b text-[#3a2458]",
  commit:   "bg-commit border-commit-b text-[#5a1a14]",
  solution: "bg-solution border-solution-b text-[#04384a]",
  spec:     "bg-spec border-spec-b text-[#1e3a5a]",
  dev:      "bg-dev border-dev-b text-[#4a3b00]",
  qa:       "bg-qa border-qa-b text-[#1f3d28]",
  done:     "bg-done border-done-b text-[#2e4718]",
};

export const SWATCH_CLASS: Record<StatusKey, string> = {
  demand:   "bg-demand border-demand-b",
  intend:   "bg-intend border-intend-b",
  commit:   "bg-commit border-commit-b",
  solution: "bg-solution border-solution-b",
  spec:     "bg-spec border-spec-b",
  dev:      "bg-dev border-dev-b",
  qa:       "bg-qa border-qa-b",
  done:     "bg-done border-done-b",
};

export type Modifier = "blocked" | "attention";
export const MODIFIER_CLASS: Record<Modifier, string> = {
  blocked: "bg-blocked border-[#c02200] text-white",
  // Attention: keeps the status colour, adds a THICK red border (SOP: ~4.5px).
  attention: "!border-blocked shadow-[0_0_0_2px_var(--color-blocked)_inset]",
};

// ── Board data ───────────────────────────────────────────────────────────────
export type BoardCard = {
  id: string;
  name: string;
  subtitle?: string;
  track: string;
  period: number;
  status: StatusKey;
  modifier?: Modifier;
};

export type BoardData = {
  tracks: string[];
  periods: string[];
  year: number;
  cards: BoardCard[];
  cartouche: { label: string; cardIds: string[] };
  dependency: { from: string; to: string };
  liveCardId?: string; // hero only: this card advances QA -> Done once
};

// A distinct roadmap per module, so no example is reused. Each is notation-
// coherent: a release cartouche (2 same-month cross-track cards), one
// inter-track dependency (prerequisite earlier than dependent), one Blocked,
// one Attention. All generic (no real-company content).

export const DATA_HERO: BoardData = {
  tracks: ["Platform", "Growth", "Mobile"],
  periods: ["May", "Jun", "Jul", "Aug"],
  year: 2026,
  cards: [
    { id: "sync",    name: "Offline sync",     track: "Platform", period: 0, status: "done" },
    { id: "passkey", name: "Passkey login",    track: "Platform", period: 1, status: "qa" },
    { id: "api",     name: "Public API",       track: "Platform", period: 2, status: "solution" },
    { id: "billing", name: "Billing redesign", track: "Growth",   period: 1, status: "dev", modifier: "blocked" },
    { id: "search",  name: "Search v2",        track: "Growth",   period: 3, status: "commit" },
    { id: "push",    name: "Push v2",          track: "Mobile",   period: 1, status: "dev", modifier: "attention" },
    { id: "voice",   name: "Voice capture",    track: "Mobile",   period: 2, status: "demand" },
    { id: "widgets", name: "Home widgets",     track: "Mobile",   period: 3, status: "intend" },
  ],
  cartouche: { label: "Autumn release", cardIds: ["search", "widgets"] },
  dependency: { from: "api", to: "search" },
  liveCardId: "passkey",
};

export const DATA_PAIN: BoardData = {
  tracks: ["Payments", "Accounts", "Risk"],
  periods: ["Jan", "Feb", "Mar", "Apr"],
  year: 2026,
  cards: [
    { id: "payouts",    name: "Instant payouts", track: "Payments", period: 0, status: "done" },
    { id: "statements", name: "Statements API",  track: "Payments", period: 2, status: "solution" },
    { id: "kyc",        name: "KYC refresh",     track: "Accounts", period: 1, status: "dev", modifier: "attention" },
    { id: "sso",        name: "SSO login",       track: "Accounts", period: 3, status: "commit" },
    { id: "fraud",      name: "Fraud rules v2",  track: "Risk",     period: 1, status: "dev", modifier: "blocked" },
    { id: "limits",     name: "Limits engine",   track: "Risk",     period: 3, status: "intend" },
  ],
  cartouche: { label: "Spring release", cardIds: ["sso", "limits"] },
  dependency: { from: "statements", to: "sso" },
};

export const DATA_ORTHO: BoardData = {
  tracks: ["Ingest", "Query", "Boards"],
  periods: ["May", "Jun", "Jul", "Aug"],
  year: 2026,
  cards: [
    { id: "pipeline", name: "Event pipeline", track: "Ingest", period: 0, status: "done" },
    { id: "schema",   name: "Schema registry", track: "Ingest", period: 2, status: "solution" },
    { id: "sql",      name: "SQL editor",     track: "Query",  period: 1, status: "dev", modifier: "attention" },
    { id: "views",    name: "Saved views",    track: "Query",  period: 3, status: "commit" },
    { id: "alerts",   name: "Alert rules",    track: "Boards", period: 1, status: "spec", modifier: "blocked" },
    { id: "embed",    name: "Embed API",      track: "Boards", period: 3, status: "intend" },
  ],
  cartouche: { label: "v3 release", cardIds: ["views", "embed"] },
  dependency: { from: "schema", to: "views" },
};

export const DATA_COMPARE: BoardData = {
  tracks: ["Storefront", "Checkout", "Ops"],
  periods: ["Sep", "Oct", "Nov", "Dec"],
  year: 2026,
  cards: [
    { id: "srch",      name: "Search revamp",    track: "Storefront", period: 0, status: "done" },
    { id: "pdp",       name: "PDP redesign",     track: "Storefront", period: 2, status: "solution" },
    { id: "oneclick",  name: "1-click checkout", track: "Checkout",   period: 1, status: "dev", modifier: "attention" },
    { id: "wallet",    name: "Wallet pay",       track: "Checkout",   period: 3, status: "commit" },
    { id: "inventory", name: "Inventory sync",   track: "Ops",        period: 1, status: "dev", modifier: "blocked" },
    { id: "returns",   name: "Returns portal",   track: "Ops",        period: 3, status: "intend" },
  ],
  cartouche: { label: "Holiday release", cardIds: ["wallet", "returns"] },
  dependency: { from: "pdp", to: "wallet" },
};

// Default month axis for the standalone modules (read-a-card, the AI demo).
export const PERIODS = ["May", "Jun", "Jul", "Aug"] as const;
export const YEAR = 2026;

// "The usual way": colour reassigned to mean the COLUMN (overloaded). Dull, ambiguous.
export const USUAL_ACCENTS = [
  "bg-[#dfe3ea] border-[#c3c8d2] text-[#3a4150]",
  "bg-[#d5dbe6] border-[#b7bfcc] text-[#374050]",
  "bg-[#e3e6ec] border-[#c8ccd6] text-[#3a4150]",
  "bg-[#d9dee8] border-[#bcc3d0] text-[#374050]",
];

// ── Lmapping board — HTML render of Nico's exact vector examples ──────────────
// Rebuilt in HTML (not embedded SVG) for pixel control: no toggle jitter, real
// text (a11y), responsive, animatable. The data below is transcribed from Nico's
// own Miro examples (the "guide" PDFs); the notation is reproduced exactly.
export type LmapStatus =
  | "demand" | "intend" | "commit" | "active"
  | "solution" | "spec" | "qa" | "done" | "blocked";

export const LMAP_CLASS: Record<LmapStatus, string> = {
  demand: "bg-demand border-demand-b text-[#2a1448]",
  intend: "bg-intend border-intend-b text-[#3a2458]",
  commit: "bg-commit border-commit-b text-[#5a1a14]",
  active: "bg-dev border-dev-b text-[#4a3b00]", // generic active = Development yellow
  solution: "bg-solution border-solution-b text-[#04384a]",
  spec: "bg-spec border-spec-b text-[#1e3a5a]",
  qa: "bg-qa border-qa-b text-[#1f3d28]",
  done: "bg-done border-done-b text-[#2e4718]",
  blocked: "bg-blocked border-[#c02200] text-white",
};

export type LmapTag = "app-release" | "backend-update";
export type LmapCard = {
  id: string;
  name: string;
  sub?: string;
  col: number; // month column, 0-based
  row: number; // lane, 0-based
  span?: number;
  status: LmapStatus;
  modifier?: "attention" | "blocked";
  tag?: LmapTag;
};
export type LmapCartouche = { id: string; cardIds: string[]; label: string; tag?: LmapTag };
export type LmapArrow = { id: string; from: string; to: string; toKind?: "card" | "cartouche" };
export type LmapData = {
  months: string[];
  currentMonth: number;
  rows: number;
  cards: LmapCard[];
  cartouches?: LmapCartouche[];
  arrows?: LmapArrow[];
};

// The Q4 story, "less detail": the release + the migration are single cards.
export const DATA_LESS: LmapData = {
  months: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  currentMonth: 2,
  rows: 6,
  cards: [
    { id: "ks", name: "USA kick start next release", sub: "(Q4)", col: 0, row: 0, status: "done" },
    { id: "spec", name: "Spec release USA Q4", col: 2, row: 0, status: "spec" },
    { id: "vblog", name: "USA: Vblog + Media player V2", col: 5, row: 0, status: "commit" },
    { id: "frs", name: "USA: FRS usability redesign", col: 5, row: 1, status: "commit" },
    { id: "sdk", name: "USA: SDK27 + security components", col: 5, row: 2, status: "commit" },
    { id: "vcard", name: "USA: Vcard contact update", col: 5, row: 3, status: "commit" },
    { id: "brazil", name: "Brazil : rollout", sub: "mid aug", col: 1, row: 1, status: "done", tag: "app-release" },
    { id: "fdev", name: "France: Dev", sub: "specificities", col: 0, row: 2, status: "done" },
    { id: "fqa", name: "France: QA", sub: "French local team for UAT", col: 1, row: 2, status: "done" },
    { id: "froll", name: "France: Rollout", sub: "GTM ready last week of Sept", col: 2, row: 2, status: "active", tag: "app-release" },
    { id: "fia1", name: "USA -migration FIA DB", sub: "Due 17 sept", col: 2, row: 5, status: "active", modifier: "attention" },
    { id: "fia2", name: "USA -migration FIA DB", sub: "Update USA systems", col: 5, row: 5, status: "intend", modifier: "attention", tag: "backend-update" },
  ],
  cartouches: [{ id: "cartQ4", cardIds: ["vblog", "frs", "sdk", "vcard"], label: "App release", tag: "app-release" }],
  arrows: [
    { id: "l1", from: "spec", to: "cartQ4", toKind: "cartouche" },
    { id: "l2", from: "edge:left", to: "fia1" },
    { id: "l3", from: "fia1", to: "fia2" },
  ],
};

// The same story, "more detail": the release and the migration expand into chains.
export const DATA_MORE: LmapData = {
  months: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  currentMonth: 2,
  rows: 6,
  cards: [
    { id: "ks", name: "USA kick start next release", sub: "(Q4)", col: 0, row: 0, status: "done" },
    { id: "spec", name: "Spec release USA Q4", col: 2, row: 0, status: "spec" },
    { id: "devrel", name: "Dev release USA Q4", col: 3, row: 0, status: "commit" },
    { id: "qarel", name: "QA & UAT release USA Q4", col: 4, row: 0, status: "commit" },
    { id: "vblog", name: "USA: Vblog + Media player V2", col: 5, row: 0, status: "commit" },
    { id: "frs", name: "USA: FRS usability redesign", col: 5, row: 1, status: "commit" },
    { id: "sdk", name: "USA: SDK27 + security components", col: 5, row: 2, status: "commit" },
    { id: "vcard", name: "USA: Vcard contact update", col: 5, row: 3, status: "commit" },
    { id: "brazil", name: "Brazil : rollout", sub: "mid aug", col: 1, row: 1, status: "done", tag: "app-release" },
    { id: "fdev", name: "France: Dev", sub: "specificities", col: 0, row: 2, status: "done" },
    { id: "fqa", name: "France: QA", sub: "French local team for UAT", col: 1, row: 2, status: "done" },
    { id: "froll", name: "France: Rollout", sub: "GTM ready last week of Sept", col: 2, row: 2, status: "active", tag: "app-release" },
    { id: "fia0", name: "USA -migration FIA DB", sub: "reported to x??", col: 0, row: 5, status: "commit" },
    { id: "fia1", name: "USA -migration FIA DB", sub: "Due 17 sept", col: 2, row: 5, status: "active", modifier: "attention" },
    { id: "fiaqa", name: "USA -migration FIA DB", sub: "QA, Hardening & Test", col: 3, row: 5, status: "done" },
    { id: "fia2", name: "USA -migration FIA DB", sub: "Update USA systems", col: 5, row: 5, status: "intend", modifier: "attention", tag: "backend-update" },
  ],
  cartouches: [{ id: "cartQ4", cardIds: ["vblog", "frs", "sdk", "vcard"], label: "App release", tag: "app-release" }],
  arrows: [
    { id: "m1", from: "qarel", to: "cartQ4", toKind: "cartouche" },
    { id: "m2", from: "edge:left", to: "fia0" },
    { id: "m3", from: "fia0", to: "fia1" },
    { id: "m4", from: "fia1", to: "fiaqa" },
    { id: "m5", from: "fiaqa", to: "fia2" },
  ],
};

// The colour-coding board (Apr -> Sep), the "read a whole roadmap at a glance"
// example. No cartouche; three App releases; two dependency arrows; June is now.
export const DATA_COLOR: LmapData = {
  months: ["APR", "MAY", "JUNE", "JULY", "AUG", "SEPT"],
  currentMonth: 2,
  rows: 4,
  cards: [
    { id: "pay", name: "USA: new paiement system", sub: "release on 13th april", col: 0, row: 0, status: "done", tag: "app-release" },
    { id: "bcase", name: "Brazil: business case", col: 1, row: 1, status: "done" },
    { id: "bgo", name: "Brazil: go/no go", sub: "end of june", col: 2, row: 1, status: "active", modifier: "attention" },
    { id: "broll", name: "Brazil : rollout", sub: "mid aug", col: 4, row: 1, status: "intend", tag: "app-release" },
    { id: "fkick", name: "France: Kickoff", sub: "april 12/14/16", col: 0, row: 2, status: "done" },
    { id: "fsol", name: "France: Solution", sub: "localisation needs / RGPD DB", col: 1, row: 2, status: "done" },
    { id: "fspec", name: "France: Specs", sub: "variation on RGPD", col: 2, row: 2, status: "active" },
    { id: "fdevc", name: "France: Dev", sub: "specificities", col: 3, row: 2, status: "commit" },
    { id: "fqac", name: "France: QA", sub: "French local team for UAT", col: 4, row: 2, status: "intend" },
    { id: "frollc", name: "France: Rollout", sub: "GTM ready last week of Sept", col: 5, row: 2, status: "intend", tag: "app-release" },
    { id: "umig", name: "USA - migration FIA DB", col: 0, row: 3, status: "done" },
    { id: "uuat", name: "USA - migration FIA DB", sub: "UAT env MISSED", col: 2, row: 3, status: "blocked" },
    { id: "urep", name: "USA -migration FIA DB", sub: "reported to x??", col: 3, row: 3, status: "intend" },
  ],
  arrows: [
    { id: "cc1", from: "bgo", to: "broll" },
    { id: "cc2", from: "umig", to: "uuat" },
  ],
};
