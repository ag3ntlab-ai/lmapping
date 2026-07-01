# The Lmapping Specification

**Version 0.1 — 2026-07-01**
A roadmap notation that reads the same to a human and to a machine.

© 2026 Nicolas Limare. Licensed under CC BY-SA 4.0. "Lmapping" is a name reserved by the author (see `LICENSE`).

---

## §1 · Purpose & scope

Lmapping is a **notation and a method for roadmaps** — not a tool and not software. It defines how to draw a delivery roadmap so that:

1. a person reads a card's **status** and **phase** at a glance, and the reading never changes across the board;
2. a machine parses the **same** drawing into structured data, deterministically;
3. the drawing can be produced on **any** surface that places a coloured box and an arrow — a whiteboard, a sticky wall, a diagramming canvas — with nothing to learn and edits made in seconds.

This document specifies the notation (the marks and their meaning), the process model the notation expresses, the levels of detail one board supports, and the conformance rules an implementation must respect. It is deliberately independent of any drawing tool.

**Terminology.** *MUST / MUST NOT / SHOULD / MAY* are used in the sense of a conformance requirement (see §10). A **board** is one Lmapping drawing. A **card** is one work item on the board. A **track** is a horizontal lane grouping related cards.

---

## §2 · The two-axis model

The core of Lmapping is that a card carries **two independent signals on two orthogonal axes**:

- **STATUS — carried by colour.** A card's fill colour (a light fill with a stronger, same-hue border) encodes *where the item is in its lifecycle*.
- **PHASE — carried by name + position.** A card's name and the **column** it sits in encode *what it is and when it is targeted*. A column header names a target time period (typically a month).

The two axes are **independent**: status (colour) means the same thing in any column, and position (time) is read the same way for any colour. This orthogonality is the property that makes an Lmapping board unambiguous. A notation that lets colour drift to mean "which column" or "which team" is **not** Lmapping (§10).

> **Why it matters.** On most boards, colour is overloaded (it means a column, a type, or a team) so a reader re-learns the legend per region. In Lmapping the legend is global: one colour, one meaning, everywhere.

---

## §3 · Status vocabulary

Lmapping defines an **8-status delivery lifecycle**. Each status has a name, a meaning, and a **recommended reference colour**. The colours below are a *recommended* palette; an implementation MAY substitute a palette but MUST keep colours distinguishable and MUST publish its own `legend_hex` map (§9) so the board stays machine-resolvable.

| # | Status | Meaning | Reference fill |
|---|---|---|---|
| 1 | **Demand** | Raised, not yet adopted onto the roadmap. | `#8a26ff` |
| 2 | **Intend** | Adopted as an intention; being shaped, not committed. | `#ca8fff` |
| 3 | **Commit** | Committed to a target period. *Committed ≠ started.* | `#ff8178` |
| 4 | **Solution** | Work begins here — defining the solution. Always the first *active* phase. | `#00b0f0` |
| 5 | **Specification** | The first release is being specified. Handover happens at the end. | `#9cd4ff` |
| 6 | **Development** | In build. This is the colour a card shows while active in delivery. | `#ffd418` |
| 7 | **QA** | In verification. | `#a1e5b8` |
| 8 | **Done/Release** | Delivered / released. | `#92d050` |

**"Active" is not a fixed colour.** A card that is currently being worked shows the colour of *its current phase* — a card active in Development is yellow, a card active in Solution is blue. There is no single "in progress" colour; progress is read from *which* lifecycle colour the card currently wears.

---

## §4 · Modifiers

Modifiers qualify a card **without** replacing its status.

- **Blocked — solid red (`#ff2e00`), light text.** A hard stop. Blocked is a *solid* fill, visually distinct from every status colour, so it is never confused with a lifecycle phase. A blocked card still has an underlying status (the phase it is stuck in).
- **Attention — orange fill (`#ff8a00`) OR a thick red border.** Flags a card that needs attention while **keeping its status**. Attention is explicitly **not** Blocked: the work is not stopped, it is flagged. An implementation MUST keep Attention and Blocked visually distinct.
- **Staging — ~0.2 fill-opacity ("ghost").** A faded, ghosted card marks an intermediate step inside a chain that is planned but not yet the live state.
- **Corner chips.** A small tag in a card corner marks a dependency or track membership. Chips are metadata, not status.

---

## §5 · Cartouche — release grouping

A **cartouche** is a box drawn around several cards. It means: **the enclosed cards form one release.** The release *is* the union of the enclosed cards' subjects. A cartouche is a first-class object of the notation, not decoration — a parser reads "these N cards ship together as one release."

A card MAY belong to at most one cartouche. A cartouche MAY span more than one track.

---

## §6 · Arrow taxonomy

Arrows are **notation, not decoration.** Lmapping defines three kinds of directed link; an implementation SHOULD make them visually distinguishable and MUST make them machine-readable as typed connectors (§9).

1. **Two-ends-one-arrow.** A single summarising arrow from a start to an end (a "kick-start → rollout" link) used in the **published / collapsed** view, where the full chain is hidden for legibility.
2. **Inter-track dependency.** An arrow from a card in one track to a card in another: "this cannot proceed until that."
3. **Chain progression.** A step-to-step arrow along an **expanded** milestone chain, showing the ordered path a subject takes through its phases.

---

## §7 · The process model — a gate-and-loop engine

The status vocabulary (§3) is not a linear pipeline. It expresses a **gate-and-loop engine** with two owner zones joined by a handover.

**Two zones.**
- **Planning zone** — Demand → Specification. Owned by the **planning owners**.
- **Delivery zone** — Development → Release. Owned by the **delivery owners**.
- A **handover** joins them at the end of Specification. After the handover the planning owners **pilot, they do not deliver.**

**Five gates + five return loops + a refocus.** Movement forward passes a gate; a failed gate returns the card to an earlier phase rather than dropping it.

- *Adopted?* — if no, the item stays in Demand.
- *Commit / target?* — if no, it is pushed to a later period (which can cascade the chain).
- *Solution validated?* — if no, iterate within Solution.
- *On track?* (after Development) — if no, re-plan back in Solution/Specification (reconfigure, patch, or reposition later releases).
- *QA passed?* (after QA) — if no, return to Development.
- *Refocus* — the planning owners may re-focus onto a committed next phase (a next release, or another subject).

**Two invariants worth stating plainly:**
- **Commit ≠ start.** Committing places an item in a target period; *work begins at Solution*. An item that is actively being worked is therefore, by construction, already committed — "Commit" is only ever shown *before* work starts.
- **Specification = the first release only.** Later releases of the same subject are planned as their own chain; Specification is not re-entered for every release.

**Backlog = the first free slot in time.** The roadmap is a finite, already-full **pipe**. A new demand does not get "added to a backlog list" — it queues at the first free time slot after the existing cards, and drifts further out as capacity fills. The backlog *is* the tail of the pipe.

---

## §8 · The four levels of detail

One model, four reads. Compression changes the **view**, never the **model** — hiding a card in a collapsed view MUST NOT delete a phase from the underlying model.

1. **Single-card life (the "card-player").** An interactive scrub through *one* card's life, beat by beat: how it moves phase by phase and repositions in time as gates fire.
2. **Collapsed vs expanded.** A single **release-card** (collapsed) vs the **full milestone chain** (expanded). The collapse is a view compression.
3. **Published vs internal.** A **published** view draws only the legible "two-ends + one-arrow" summary (§6.1); the **internal** view shows the full chain and micro-management.
4. **Portfolio / time-band.** Zoomed out, **position alone** gives a coarse, portfolio-level status read — where the mass of work sits in time — without reading individual colours.

---

## §9 · Machine-readability

An Lmapping board is **one encoding read by two readers.** The same marks a person sees are structured data a machine parses.

**What is parsed.** Every card's **fill**, **border**, and **fill-opacity**; its **column** (→ target period); its **cartouche** membership; and the **connectors** (typed arrows, §6).

**The `legend_hex` map.** A board ships (or references) a `legend_hex` map — a status-name → colour dictionary (see `legend.json`). A parser resolves each card's status by matching its fill against `legend_hex`, then applies modifier rules (a ~0.2 opacity → staging; a solid `#ff2e00` → Blocked; an `#ff8a00` fill or thick red border → Attention over the resolved status). This is what makes resolution **deterministic** rather than a guess from a screenshot.

**The skill interface (contract).** Lmapping defines two capabilities, both **OpenAI- and Anthropic-compatible**:
- a **read-skill** — input: a board (structured export); output: the board as data (cards with status, phase, cartouche, arrows);
- a **write-skill** — input: the board + a change; output: the board with the change applied **in valid notation** (§10).

The skill interface is a contract, not an implementation: any tool that consumes the structured export and honours `legend_hex` and the conformance rules is a conforming reader/writer.

---

## §10 · Conformance

A board is **valid Lmapping** if:

- **C1 (orthogonality) — MUST.** Status is carried by colour and phase by name+position, and the two are independent. Colour MUST NOT be reused to mean a column, a team, or a type.
- **C2 (status vocabulary) — MUST.** Every card's colour resolves to exactly one status in the published `legend_hex`. "Active" is the current phase's colour, not a separate colour.
- **C3 (modifiers distinct) — MUST.** Blocked is a solid red distinct from all status colours; Attention is distinguishable from Blocked and preserves the card's status.
- **C4 (cartouche) — SHOULD.** A release grouping is drawn as a cartouche; its members are exactly the cards that ship together.
- **C5 (typed arrows) — SHOULD.** Links are one of the three arrow types (§6) and are machine-readable as typed connectors.
- **C6 (view ≠ model) — MUST.** Collapsing/expanding changes the view only; no phase is deleted from the model by a compression.
- **C7 (machine-resolvable) — MUST.** The board publishes or references a `legend_hex` map so a reader resolves statuses deterministically.
- **C8 (commit semantics) — SHOULD.** "Commit" appears only before work starts; an active card is treated as already committed.

A board that violates a **MUST** is not conforming Lmapping. A board that meets every MUST and most SHOULDs is conforming; the SHOULDs raise fidelity.

---

### Versioning, authorship & licence

- **Version:** 0.1 (2026-07-01). Cite as *"Lmapping v0.1"*.
- **Author:** Nicolas Limare.
- **Licence:** this specification and its documentation are licensed **CC BY-SA 4.0**. The licence covers the text; it does not grant rights in the name **"Lmapping"** (see `LICENSE`).
- **Machine schema:** `legend.json`. **Overview & quickstart:** `README.md`. **Examples:** `examples/`.

*v0.1 is the first public, dated release — the authorship baseline. It is complete and coherent; later versions will refine wording, add examples, and formalise the skill export format.*
