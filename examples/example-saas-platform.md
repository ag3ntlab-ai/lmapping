# Example — "Ledgerly", a B2B SaaS platform

An invented product, mapped in Lmapping to show a hard dependency, a block, and staging. (Fictional — for illustration only.)

## The board (expanded view)

| Track | Sep | Oct | Nov | Dec |
|---|---|---|---|---|
| **Billing** | Development `#ffd418` — *Usage-based billing* | QA `#a1e5b8` — *Usage-based billing* | Done/Release `#92d050` — *Usage-based billing* | |
| **Integrations** | Solution `#00b0f0` — *Accounting connector* | **Blocked `#ff2e00`** — *Accounting connector* | Specification `#9cd4ff` — *Accounting connector* | Development `#ffd418` — *Accounting connector* |
| **Reporting** | Intend `#ca8fff` — *Custom dashboards* *(staging, opacity 0.2)* | Intend `#ca8fff` — *Custom dashboards* | Commit `#ff8178` — *Custom dashboards* | Solution `#00b0f0` — *Custom dashboards* |

**How to read it:**
- *Accounting connector* is **Blocked** in Oct — a solid red card. It still has an underlying status (it was in Solution and cannot proceed); solid red just means "hard stop". Once unblocked it resumes its chain (Specification in Nov).
- *Custom dashboards* shows a **staged** (ghosted, ~0.2 opacity) card in Sep: a planned-but-not-live step. It firms up to a solid Intend in Oct, then Commit in Nov.

## Dependency arrow

An **inter-track dependency** arrow runs from *Usage-based billing (Billing)* → *Accounting connector (Integrations)*: the connector consumes the new billing events, so it cannot reach Development until billing releases. Reading the board, the dependency explains the Oct block: the connector is waiting on billing.

## The gate-and-loop reading

- *Usage-based billing* passes **QA?** in Oct → moves to Done/Release in Nov. Had QA failed, it would loop back to Development (not drop).
- *Accounting connector*, once unblocked, re-enters the planning flow at Specification, then hands over to delivery (Development, Dec).
- *Custom dashboards* is the tail of the pipe — it queued after the committed work and drifts right as capacity fills.
