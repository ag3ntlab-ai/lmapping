# Lmapping

**A roadmap notation that reads the same to a human and to a machine.**

Status is a **colour**. Phase is a **position**. Dependencies are **arrows**. One board — drawable on any whiteboard — that your team reads at a glance *and* your AI reads without guessing.

> Lmapping is a **notation, not a tool.** C4 did this for software architecture; Wardley Mapping did it for strategy; Lmapping does it for **roadmaps**. It is open and free.

---

## Why it exists

Roadmaps have never had a real notation. Every team invents its own colours, and every tool loses them across views. Lmapping fixes that with one rule kept strict:

- **Two orthogonal axes.** A card's **colour** is its *status* (where it is in its lifecycle); a card's **name + column** is its *phase* (what it is, and when). The two are independent — a colour means the same thing anywhere on the board, so nobody re-learns the legend.
- **One model, four zoom levels.** Portfolio view, the full milestone chain, a single card's life, published-vs-internal — all the *same* model, never a redrawn deck.
- **AI-operable, by design.** Because the notation is real (colour + position + typed arrows + a `legend_hex` map), it ships with a **read-skill** (turns the board into data) and a **write-skill** (lets an AI apply updates in the notation) — both OpenAI- and Anthropic-compatible. Not a screenshot: data.
- **Radically simple, zero lock-in.** Any tool that draws a coloured box and an arrow runs it. Nothing to learn, edits in seconds, no dependency on any paid platform.

---

## Learn it in 5 minutes

1. **Draw columns for time.** Each column header is a target period (usually a month). Left is sooner, right is later.
2. **Put each work item in a card.** The card's **name** says what it is; the **column** says when it is targeted.
3. **Colour the card by its status** — its place in the 8-status lifecycle:
   **Demand → Intend → Commit → Solution → Specification → Development → QA → Done/Release.**
   Colour is a light fill with a stronger same-hue border. A card active in Development is yellow; a card active in Solution is blue. "Active" is just the current phase's colour.
4. **Two things to remember about the flow.** *Commit ≠ start* — work begins at **Solution**; committing only places an item in a target period. And the board is a **finite pipe**: a new demand queues at the first free slot in time, not on a side list.
5. **Add the three marks that carry meaning:**
   - a **box around several cards** (a *cartouche*) = they ship as **one release**;
   - an **arrow** = a real link (a kick-start→rollout summary, a cross-track dependency, or a step in a chain);
   - **solid red** = Blocked; **orange fill / thick red border** = Attention (needs a look, but *not* stopped); a **ghosted (faded) card** = a staged, not-yet-live step.
6. **Zoom.** Collapse a whole chain into one release-card for the portfolio view; expand it to see every phase. Compression hides cards in the *view* — it never deletes a phase from the *model*.

That's the whole notation. The precise rules are in **[SPEC.md](SPEC.md)**; the machine schema is in **[legend.json](legend.json)**; worked examples are in **[examples/](examples/)**.

---

## Contents

- **[SPEC.md](SPEC.md)** — the canonical specification (the two-axis model, the status vocabulary, modifiers, cartouche, arrows, the gate-and-loop process, the four levels of detail, machine-readability, and conformance).
- **[legend.json](legend.json)** — the machine-readable notation schema + `legend_hex`.
- **[examples/](examples/)** — generic roadmaps drawn in Lmapping.
- **[LICENSE](LICENSE)** — CC BY-SA 4.0.

---

© 2026 **Nicolas Limare**. The Lmapping specification and documentation are licensed under **CC BY-SA 4.0** — free to use, teach, implement, and adapt with attribution. The licence covers the docs; the name **"Lmapping"** is reserved by the author (see [LICENSE](LICENSE)). Version **0.1** — 2026-07-01.
