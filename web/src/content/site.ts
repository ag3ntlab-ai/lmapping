// All human-facing copy. Edit here, never in components. Zero em-dashes.
// Marketing copy is faithful to the research report sections 9.2 / 9.4 / 9.5 / 9.6.

export const SITE = {
  name: "Lmapping",
  githubUrl: "https://github.com/ag3ntlab-ai/lmapping",
  author: "Nicolas Limare",
  year: 2026,
  version: "v0.1",
  ctaLabel: "Get early access", // the ONE CTA intent, reused everywhere
  nav: [
    { label: "How it works", href: "/#how" },
    { label: "Notation", href: "/notation" },
    { label: "Compare", href: "/#compare" },
    { label: "For AI", href: "/#ai" },
    { label: "Spec", href: "https://github.com/ag3ntlab-ai/lmapping", external: true, github: true },
  ],
} as const;

export const HERO = {
  headline: ["The roadmap", "anyone reads."],
  sub: "Status is a colour. Phase is a position. Draw it on any canvas, and an AI reads and updates it.",
  primary: SITE.ctaLabel,
  secondary: "See how it works",
  secondaryHref: "#how",
} as const;

// Reconciliation: three roadmaps that disagree, and you cannot present a Gantt to
// leadership. The leadership-presentation use-case (from Nico's real example).
export const RECONCILE = {
  kicker: "Three roadmaps that disagree",
  title: "You cannot present a Gantt to leadership.",
  body: "The portfolio lives across tools that never quite match. Open it in Jira or any Gantt and nobody sees the shape: cryptic tickets, cramped bars, a legend you re-learn every time. You make mistakes, and you certainly cannot put it on screen in a steering committee.",
  promise: "One Lmapping board holds every level of detail and doubles as the leadership view. A slip jumps out, you present it as-is, and you draw it in a tool you already know.",
  jiraLabel: "Jira / Gantt tool",
  jiraCaption: "Same portfolio. Dense, cryptic, unreadable in a room, and impossible to present.",
  lmLabel: "The same portfolio in Lmapping",
  lmCaption: "Readable at a glance, ready for leadership, and an error you would have missed jumps out.",
} as const;

// Levels of detail: one model, expand or collapse. From Nico's real example.
export const LEVELS = {
  kicker: "One model, every zoom",
  title: "One roadmap. Every level of detail.",
  body: "Collapse a project to a single card for the published board, or expand it into its full milestone chain for the team that runs it. Flip between them here. Same model, same colours, always in sync, never a second roadmap that drifts.",
  less: "Less detail",
  more: "More detail",
  lessCaption: "Published view. The Q4 release and the migration sit as single cards, the chain hidden. Readable across the whole portfolio.",
  moreCaption: "Team view. The same two projects expand into their milestone chains. Same board, more depth, nothing re-drawn.",
} as const;

// The notation, on the site: people must be able to learn the system. From the SOP.
export const NOTATION = {
  kicker: "The notation",
  title: "Learn the whole system in a minute.",
  body: "Status is a colour. Phase is a position. Two independent axes, a closed set of statuses, a small grammar of modifiers and arrows. That is the entire language.",
  statusesTitle: "Status is the colour",
  statusesNote: "A closed, deliberately-sequenced lifecycle. A colour means the same thing anywhere on the board, so nobody re-learns a legend.",
  modifiersTitle: "Modifiers sit on any card",
  modifiers: [
    { t: "Attention", d: "An orange fill, or a thick red border. The card keeps its status." },
    { t: "Blocked", d: "A solid red fill. The only fully-red status." },
  ],
  extrasTitle: "And on the board",
  extras: [
    { t: "Release cartouche", d: "A grey box grouping cards that ship together as one release, tagged at the bottom." },
    { t: "Kick-start arrow", d: "One arrow from where a project starts to its final card. The chain in between stays hidden." },
    { t: "Current month", d: "The live month is called out in bright pink, so the eye lands on now." },
  ],
  moreLink: "Read through the full notation system and its usage rules, the whole language on one page.",
  moreCta: "The full notation and rules",
} as const;

// Read a card: the two-axis model, interactive.
export const READCARD = {
  kicker: "How it works",
  title: "Read a card.",
  body: "A card carries two signals on two independent axes. Change one, and the other holds. That is what keeps the board unambiguous.",
  axisStatus: "Status is the colour.",
  axisPhase: "Phase is the name and the column.",
  caption: "Two signals. Two axes. They never collide.",
} as const;

// The card-player: the §02 "life of a card" method (collapsed to expanded).
export const PLAYER = {
  title: "The life of a card.",
  body: "One card, from a demand to a shipped release. It commits, then expands: the chain is retro-planned back from the release month. Each phase goes active as now reaches the left edge of its month. The name never changes, only the status and its colour.",
  note: "Committed is not started. Work begins at Solution. Once detail lands, a slip cascades the chain downstream.",
} as const;

// Not open-bar colour: the orthogonality / IP crown.
export const ORTHO = {
  title: "Not open-bar colour.",
  body: "Most tools let colour drift, so it means a team here, a column there, a priority somewhere else. Lmapping fixes colour to a closed system.",
  usualLabel: "How most tools use colour",
  usualCaption: "Colour means something different in every corner. You re-learn the legend on every board.",
  lmappingLabel: "How Lmapping uses colour",
  lmappingCaption:
    "One colour, one status, everywhere. Colour is independent of time, and the eight statuses are a deliberately-sequenced lifecycle, not a pick-your-own palette.",
} as const;

// Compare: the 8 use cases (report 9.5), usual vs Lmapping.
export const COMPARE = {
  title: "Lmapping vs the usual way",
  body: "The same roadmap, read two ways. Pick what you are trying to do.",
  usualLabel: "The usual way",
  oursLabel: "Lmapping",
  rows: [
    {
      tab: "Read at a glance",
      need: "Know a card's status instantly, anywhere on the board",
      usual: "Colour means different things per column or tool, so you re-learn the legend",
      ours: "Status is one colour, same meaning everywhere (status is independent of phase)",
    },
    {
      tab: "Flow and time",
      need: "See flow and time on one board",
      usual: "Kanban flow or a Gantt timeline, pick one",
      ours: "Both. Kanban flow on a Gantt time axis",
    },
    {
      tab: "Zoom",
      need: "Zoom from portfolio to a single card without redrawing",
      usual: "Separate views that drift apart",
      ours: "One model, four zoom levels, always in sync",
    },
    {
      tab: "Dependencies",
      need: "Read dependencies and governance from the picture",
      usual: "Lines at best. Gates and hand-offs live in your head",
      ours: "A three-arrow grammar and a gate-and-loop engine, on the board",
    },
    {
      tab: "Change it",
      need: "Draw it and change it",
      usual: "Dedicated software to learn. Changes take minutes to hours",
      ours: "Any tool that draws boxes and arrows. Nothing to learn, changes in seconds",
    },
    {
      tab: "AI reads it",
      need: "Let an AI read your roadmap",
      usual: "A screenshot or an API, not a notation",
      ours: "Machine-readable by design. A read-skill (OpenAI and Anthropic compatible) turns the board into data",
    },
    {
      tab: "AI manages it",
      need: "Let an AI manage your roadmap",
      usual: "Not possible. It is a picture, or a lock-in API",
      ours: "A write-skill (OpenAI and Anthropic compatible) applies updates, in the notation",
    },
    {
      tab: "No lock-in",
      need: "Adopt it without buying a platform",
      usual: "Mostly locked to a vendor",
      ours: "Open, free spec. Zero lock-in, tool-agnostic",
    },
  ],
} as const;

// Built for AI: the wedge. Read-skill free (early access), write-skill paid (community).
export const AI = {
  kicker: "The wedge",
  title: "Built for an AI to read. And to run.",
  body: "Because the notation is real (colour, position, arrows, a legend map), the board is data, not a screenshot. The agents you already use read it, and with the write-skill they update it, in valid notation.",
  studiosLabel: "Read by the agents you already use",
  studios: [
    { name: "Anthropic", logo: "/logos/anthropic.svg" },
    { name: "OpenAI", logo: "" },
    { name: "Mistral", logo: "/logos/mistralai.svg" },
    { name: "Qwen", logo: "/logos/qwen.svg" },
    { name: "GLM", logo: "" },
  ],
  proofLabel: "The same board, as structured data",
  proof: `{
  "board": [
    { "card": "Passkey login", "month": "Jul 2026", "status": "QA" },
    { "card": "Public API",    "month": "Sep 2026", "status": "Solution" },
    { "card": "Search v2",     "month": "Aug 2026", "status": "Development" },
    { "card": "Home widgets",  "month": "Sep 2026", "status": "Commit" }
  ]
}`,
  read: {
    tag: "Read the board",
    price: "Free",
    title: "An AI reads it.",
    body: "The read-skill turns a board into structured data: cards, status, phase, cartouche, arrows. Register for early access and it ships free, with the white paper and a full course (PDF and video) on the notation and how to run it yourself, plus best practices and use cases.",
    note: "Live today on Miro, already in daily production use. More canvases follow.",
    cta: "Get the read-skill free",
  },
  write: {
    tag: "Run the board",
    price: "Members",
    title: "An AI runs it.",
    body: "The write-skill applies changes back to the board, in valid notation. A community capability: one lifetime licence, no subscription.",
    note: "Founding price $19.99 for the first 100, then rising in steps of 100.",
    cta: "Join the community",
  },
} as const;

export const SIMPLICITY = {
  title: "If you can draw a box and an arrow, you can draw a roadmap.",
  body: "Lmapping is a notation you own, not software you rent. Like C4 or Wardley Maps, for roadmaps.",
  canvasCaption: "A box, a colour, an arrow. That is the whole tool.",
  toolsLabel: "Draw it where you already work",
  tools: [
    { name: "Miro", logo: "/logos/miro.svg" },
    { name: "Excalidraw", logo: "/logos/excalidraw.svg" },
    { name: "FigJam", logo: "/logos/figma.svg" },
    { name: "tldraw", logo: "/logos/tldraw.svg" },
    { name: "any whiteboard", logo: "" },
  ],
  points: [
    { t: "Any canvas", d: "A whiteboard, a diagram tool, a sticky wall. The notation is the product, not an app." },
    { t: "Seconds, not hours", d: "Move a card, change a colour. No re-planning ceremony, no export." },
    { t: "Zero lock-in", d: "No dependency on Jira, Aha! or any paid platform. Open and free." },
  ],
} as const;

// Positioning statement (report 9.2), rendered in full, de-em-dashed.
export const POSITIONING = {
  kicker: "The positioning",
  audience: "For product and program leaders running multi-team, multi-release portfolios.",
  pain: "Tired of roadmaps that mislead, drift apart across tools, take hours to update, and can't be read by their AI.",
  paras: [
    "Lmapping is an open roadmap notation and delivery method that encodes status, phase, dependencies and governance into one board a human and a machine read the same way.",
    "It is radically simple to draw. Any tool that can place a coloured box and an arrow does it (Miro, or any basic drawing canvas), with nothing complex to learn and changes made in seconds, not hours. And it carries zero lock-in to Jira, Aha! or any paid platform.",
    "Unlike Gantt charts, Kanban tools and roadmap SaaS, which carry state but not a rigorous, machine-readable notation and tie you to their software, Lmapping is at its core a simple, modular drawing that expands as you grow and can be managed by you or by an AI.",
  ],
  pull: "The roadmap itself becomes the single, unambiguous, AI-ready source of truth.",
} as const;

// Category framing (report 9.3), used as a short band.
export const CATEGORY = {
  title: "Do not ship a tool. Be the notation.",
  body: "C4 did this for software architecture. Wardley did it for strategy. There is no equivalent for roadmaps. That is the opening.",
} as const;

export const CTA = {
  title: "Get early access.",
  body: "Leave your details for the spec, the reference tooling, and an invite when the community opens.",
  success: "You're on the list. Expect the spec and an invite soon.",
} as const;

// The author: the L in Lmapping is Limare. Bio from Nicolas Limare's CV,
// framed as origin story (his 15-year practice); the codified spec is 2026.
export const AUTHOR = {
  kicker: "The L is for Limare",
  title: "Lmapping is Nicolas Limare's method.",
  body: "The L in Lmapping is Limare. Nicolas Limare is a digital product and UX leader with 29 years of experience, in CPO and executive roles across global groups including IBM, LG, Technicolor and BioNTech. He builds and scales digital and phygital products, and the multidisciplinary teams behind them.",
  body2: "Lmapping is the roadmap method he designed and battle-tested over 15 years, across every digital and phygital product he has shipped. This site and its specification are its first public release.",
  linkedinLabel: "Nicolas Limare on LinkedIn",
  linkedinUrl: "https://www.linkedin.com/in/nlimare/",
} as const;
