// The full notation + usage-rules reference. Faithful to the Operating SOP and
// the Notation Model Key (colours pixel-exact); genericised, no real-company
// data. Edit copy here, never in the component. Zero em-dashes.

export const NP = {
  kicker: "The notation, in full",
  title: "The whole roadmap language, in one page.",
  intro:
    "Lmapping encodes a roadmap on two independent axes. Status is a colour. Phase is a name and a position. A closed set of statuses, a short grammar of modifiers and arrows, and a few rules for how time constrains a card. That is the entire system, and a human and a machine read it the same way.",

  // Axis 2 — the status colours (closed set). Fill + a stronger same-hue border.
  statusTitle: "Status is the colour",
  statusNote:
    "A light fill with a stronger border of the same hue. A colour means the same thing anywhere on the board, so nobody re-learns a legend. Active equals Development (yellow) and Release equals Done (green) share a colour on purpose, so phase and status line up.",
  statuses: [
    { key: "demand", label: "Demand", meaning: "A request, raised. Not on the roadmap yet.", fill: "#c593ff", border: "#8a26ff" },
    { key: "intend", label: "Intend", meaning: "Adopted as an intention. Positioned by quarter, not locked.", fill: "#e5c7ff", border: "#ca8fff" },
    { key: "commit", label: "Commit", meaning: "Committed to a target month. The lock. Not started.", fill: "#ffc0bc", border: "#ff8178" },
    { key: "solution", label: "Solution", meaning: "Work begins here. The solution is defined.", fill: "#80d8f8", border: "#00b0f0" },
    { key: "spec", label: "Specifications", meaning: "The first release is fully specified.", fill: "#ceeaff", border: "#b3dafb" },
    { key: "dev", label: "Development", meaning: "In build. The delivery zone. Equals Active.", fill: "#ffea8c", border: "#ffd418" },
    { key: "qa", label: "QA", meaning: "In verification. A failed check returns it to build.", fill: "#a1e5b8", border: "#599c70" },
    { key: "done", label: "Done / Release", meaning: "Delivered and released.", fill: "#c9e8a8", border: "#92d050" },
  ],
  blockedNote:
    "Blocked is a solid red fill (#ff2e00), white text. It is the only fully-red status, and it is not the same as Attention.",

  // Axis 1 — the phases (the delivery milestones)
  phasesTitle: "Phase is the position",
  phasesNote:
    "The five delivery milestones, read left to right. In detail an active card takes the colour of its own phase, not a generic yellow. Renamed for clarity: Design became Solution, Spec became Specifications, Dev became Development.",
  phases: ["Solution", "Specifications", "Development", "QA", "Release"] as const,

  modifiersTitle: "Modifiers sit on any card",
  modifiers: [
    { t: "Attention", d: "An orange fill (#ff8a00), or a thick red border. Either form flags a card while it keeps its status colour." },
    { t: "Blocked", d: "A solid red fill (#ff2e00), white text. The only fully-red status. Keep it apart from Attention." },
    { t: "Corner tag", d: "A small label in a card's corner flags a cross-team dependency, or an internal-only track that sits on the public board but outside the delivery scope." },
  ],

  lifecycleTitle: "One cycle, one colour at a time",
  lifecycleNote:
    "Before the work: Demand, then Intend, then Commit (the lock). In work: the card takes the colour of its phase, from Solution to QA. Finished: Done. Commit shows only before the start, because an active card is necessarily committed.",

  readingsTitle: "Two readings of the same project",
  collapsed: {
    t: "Collapsed",
    d: "One card is the release, at its target month, at the release's status. This is the published, readable view.",
  },
  expanded: {
    t: "Expanded",
    d: "The milestone chain, laid out in time. This is the real micro-management. Time constrains the status: the active front is Development, so Solution and Specifications before it read Done, and QA and Release after it can only be Intend, Commit at best.",
  },

  cartoucheTitle: "The release cartouche",
  cartoucheNote:
    "A box grouping several distinct feature cards that ship together as one release. It carries the union of their subjects and wears the release name; the enclosed cards keep their own status colours. Do not confuse it with the grey month cartouche, which is only a column header for a target month.",

  timeTitle: "Where a card sits sets its status",
  timeNote:
    "Two things at once. The grey month cartouche is a card's target month, and on a Kanban the month marks the end of the work. The coloured band above is a status-guidance zone: the status a card in that time is expected to hold. Q+1 is where planning crystallises, and Intend or Demand lock into a month as Commit.",
  bands: [
    { t: "Past quarter", d: "Done", cls: "done" },
    { t: "Current quarter", d: "On-going", cls: "dev" },
    { t: "Q+1", d: "Lock to a month, Commit", cls: "commit" },
    { t: "Later this year", d: "Intend or Demand", cls: "intend" },
    { t: "Next year", d: "Everything Demand", cls: "demand" },
  ],

  kickTitle: "The published roadmap: a kick start",
  kickNote:
    "Expanding every project floods the board, so the published roadmap draws only a project's two ends: a kick-start card where activity begins, an arrow, and the project's final card (the rollout or release) at its expected time. The chain between is hidden. A kick-start card carries no special colour: its colour is the status of the start.",

  connectorsTitle: "Arrows are notation, not decoration",
  connectorsNote:
    "Every arrow is part of the board's structured data, not just a visual, so a machine can read it as well as a person.",
  connectors: [
    { n: "1", t: "Two ends, one arrow", d: "Collapsed. A kick-start card to the project's final card, the chain hidden." },
    { n: "2", t: "Chain progression", d: "Expanded. A release's milestone chain, laid out statically." },
    { n: "3", t: "Inter-track dependency", d: "One card gates or feeds another, across tracks." },
  ],

  rulesTitle: "The rules that keep it honest",
  rules: [
    "The board is the single source of truth. One card, one status, one colour at a time.",
    "Commit is the final gate before work. Committed is not started; work begins at Solution.",
    "A new demand lands at the first free slot in time, after everything already on the roadmap.",
    "Intend is positioned by quarter, not a fixed month. Certainty pulls it into a month, as Commit.",
    "Time constrains status: a card cannot hold a status its place in time would not allow.",
    "A slip cascades downstream. Move a card, and the chain after it retro-plans from the release.",
    "Expand for the team that runs it; publish collapsed for the people who read it.",
  ],

  aiTitle: "Built for a machine to read, and to run",
  aiNote:
    "Because the notation is real (colour, position, arrows, a legend map), the board is data, not a screenshot. A read-skill turns any board into structured data; a write-skill applies changes back, in valid notation. The full, versioned spec is open.",

  ctaTitle: "That is the whole language.",
  ctaNote:
    "Status is a colour, phase is a position, and a few rules for how time constrains a card. Draw it anywhere, and your team and your AI read the same board.",
} as const;
