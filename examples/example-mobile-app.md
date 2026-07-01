# Example — "Pocket Garden", a consumer mobile app

An invented product, mapped in Lmapping to show the notation end to end. (Fictional — for illustration only.)

## The board (expanded / internal view)

Columns are months. Each card's colour is its **status**; its column is its **target period**.

| Track | Feb | Mar | Apr | May | Jun | Jul |
|---|---|---|---|---|---|---|
| **Onboarding** | Solution `#00b0f0` — *New signup flow* | Specification `#9cd4ff` — *New signup flow* | Development `#ffd418` — *New signup flow* | QA `#a1e5b8` — *New signup flow* | Done/Release `#92d050` — *New signup flow* | |
| **Growth** | | Commit `#ff8178` — *Referral program* | Solution `#00b0f0` — *Referral program* | Specification `#9cd4ff` — *Referral program* | Development `#ffd418` — *Referral program* **(Attention: `#ff8a00`)** | QA `#a1e5b8` — *Referral program* |
| **Platform** | | | Intend `#ca8fff` — *Offline mode* | Intend `#ca8fff` — *Offline mode* | Commit `#ff8178` — *Offline mode* | Solution `#00b0f0` — *Offline mode* |

**How to read it:**
- *New signup flow* walks its chain Feb→Jun: blue (Solution) → light-blue (Specification) → yellow (Development) → green-ish (QA) → green (Done/Release). One subject, one chain, moving left to right as it matures.
- *Referral program* is coral in Mar = **Commit** (placed on the roadmap, but *not started* — work begins when it turns blue/Solution in Apr). In Jun it carries an **Attention** modifier (orange) — it still has its Development status, it's just flagged for a look. Not Blocked.
- *Offline mode* sits at **Intend** (light purple) in Apr–May — being shaped, not committed — then **Commit** in Jun. It is the tail of the pipe: it queued at the first free slot after the committed work.

## Cartouche — the "v2.0 release"

A box drawn around *New signup flow (Done/Release, Jun)* **and** *Referral program (QA→Release, Jul)* forms **one release**: **v2.0**. The release is the union of those two subjects shipping together.

## Arrows

- **Chain progression:** the step-to-step arrows along *New signup flow* (Solution→Spec→Dev→QA→Release).
- **Inter-track dependency:** an arrow from *Offline mode (Platform)* → *Referral program (Growth)* would say "referral can't fully ship until offline mode lands." (Here it doesn't; shown for illustration.)
- **Two-ends-one-arrow:** in the *published* view (below) the whole *New signup flow* chain collapses to a single arrow from its kick-start to its release.

## Collapsed / published view (same model, less detail)

For a portfolio audience, collapse each chain to one **release-card** and draw the two-ends-one-arrow:

| Track | Q1 | Q2 |
|---|---|---|
| **Onboarding** | → *New signup flow* → **shipped Jun** |
| **Growth** | | → *Referral program* → **shipping Jul** |
| **Platform** | | *Offline mode* — committed, in solution |

Nothing was deleted — the phases still exist in the model; the view just hides them. Zoomed out further, **position alone** tells you most work sits in Q2 without reading a single colour.
