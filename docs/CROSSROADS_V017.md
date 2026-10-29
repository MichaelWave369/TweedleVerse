# TweedleVerse Crossroads | v0.17

**Crossroads is our first playable crossover narrative**, beyond the read-only Passport v0.16. It offers original three-scene branching evidence cases involving different game casts, unlocked only by progress earned in two separate existing titles. It is not a shared 3D game engine, online multiplayer or a cross-game inventory transfer.

Entry: [Crossroads](../crossroads.html). The [Arcade](../arcade.html) and [Universe Passport](../passport.html) both link to it.

## Crossover mini-cases

| Case | Required existing Passport stamps | Evidence-driven investigation | Local reward |
| --- | --- | --- | --- |
| #001 The Eighteenth Hole That Wasn't | Unpaid Detective (TweedlePD) + Course Architect (TweedleGolf) | Chip examines a disputed golf-course bunker and clears Tweedsie with survey evidence | Fairway Forensics |
| #002 The Grand Recount of Nothing | Billing Reversal (Stemside RPG) + Grand Stem Finisher (TweedleGolf) | The signed tournament scorecard defeats Reggie's fake billing-based protest | Billing Birdie |
| #003 The Underground Evidence Delivery | Senior Unpaid Deputy (TweedlePD) + Golden Gopher Courier (Adventures of Tweedsie) | Chip checks dispatch records against completed underground courier manifests | Crossover Courier |

Each case has three authored locations, witness dialogue, a meaningful three-choice evidence question at each location, safe retry of a wrong lead and an actual case-closed conclusion. Players may start any unlocked case, but one active case must be finished before opening another. The Crossroads page displays missing prerequisites with links to the appropriate original games.

A case is only unlocked using the existing **validated Passport stamps** calculated by `readPassport`. The first-party save decoders verify source versions and contents before the passport exposes the stamp.

## Why this is safe for existing games

- Crossroads reads the **same seven original first-party browser save keys** used by the Passport.
- It writes a **new, independent localStorage slot**: `tweedleverse.crossroads.cases.v1`. Only Crossroads writes this slot, to track its active mini-case, completed local endings and fictional wrong-lead count.
- It never modifies Stemside RPG, TweedlePD, Patrol Shift, Tweedsie Caverns, Tweedsie Courier, TweedleGolf or Grand Stem Cup saves.
- On reload, the decoder rechecks mission proofs against whatever valid source saves still exist. If original game progress was cleared or is from a different browser, impossible case claims are not accepted and invalid active cases are dropped.
- No remote API calls, accounts, analytics, real-world fines, real criminal-law instructions, downloads, or third-party media.
- These are **personal local achievements**, not cryptographically secure attestations. A technically skilled player can manually edit local browser storage. We do not claim otherwise.

## User interface

- Original 3D-like CSS scene illustrations with mission-specific lighting, witnesses and place labels.
- Mission board displays source badges, locked/available/complete states and links to the original games.
- Scene-by-scene detective adventure using keyboard-accessible native buttons, live feedback, and a local case ledger.
- Clear Crossroads-only reset with confirmation, an accessible Refresh Source Stamps action, and links back to Passport/Arcade.
- Passport itself remains read-only. It displays `0 / 3` through `3 / 3` crossover cases from validated local Crossroads state without saving anything.
- Arcade has a separate playable-case banner, not a misleading fifth independent game title.

## Test instructions

```bash
npm run check
```

`tests/crossroads.test.mjs` covers mission identifiers and different-series proof requirements, locked/available states, correct and incorrect choices, non-skippable steps, local save serialization, source-proof regression, new UI controls and Pages packaging.

Manual browser QA:

1. Open Crossroads with no local game progress. All three cases should be locked with game links.
2. Solve TVPD's donut case and rename or repaint a golf clubhouse. Refresh Crossroads. The Fairway case should unlock, without unlocking the other two.
3. Open Fairway. Answer incorrectly, verify error feedback with no advance, then choose work order / survey stakes / correct course map. Verify the closed-case reward.
4. Reload and confirm the closed state persists. Click **Reset Only Crossover Cases**; inspect the original games and verify their saves are untouched.
5. Meet additional case prerequisites and verify Grand Recount and Underground Evidence Delivery can be completed in either order.
6. Clear a prerequisite source slot in a disposable browser profile, refresh Crossroads, and verify a previously awarded side case is no longer considered supported.
7. Check the read-only Passport case counter, then test both pages on narrow screens and using keyboard-only controls.

## Next possible upgrade

Crossroads is the **first actual playable story intersection**, not yet a real shared world-state system. Future extensions could include persistent NPC crossovers, optional inter-series quest adapters, authored maps and campaign chapters while retaining explicit consent and separate ownership of game progress.
