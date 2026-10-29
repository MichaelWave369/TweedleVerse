# TweedleVerse Arcade and TweedlePD: Rookie Mistakes (v0.12)

This release turns the one-game portal into a **multi-game landing site**, while keeping the existing Stemside game intact. It ships two actual playable entries and clearly labels four other concepts as *concept only*.

## Launch paths

- [TweedleVerse Arcade](../arcade.html): game-selection hub.
- [Welcome to Stemside](../play.html): original top-down RPG, no changes to existing achievements, minigames, save format or story.
- [TweedlePD: Rookie Mistakes](../tweedlepd.html): original standalone detective comedy, Case #001.

The homepage, city explorer, and RPG have links back to Arcade. The Pages workflow includes the two HTML pages, along with the shared assets folder. No third-party packages, hosting changes or paid services.

## Story and original characters

Practical Smokers' **Chip** accidentally accepts mandatory department training and becomes a rookie at the **Tweedle Police Department (TVPD)**. His first assignment comes from **Chief Buster McBadge**: *The Missing Donut Incident*. He visits four established or proposed sites in Stemside and investigates a possible pastry robbery.

- **TVPD Precinct:** examine crumbs and the chief's duty roster; question Chief McBadge.
- **CoffeeChucks:** collect the original delivery receipt; question Chuck.
- **Lackluster Video:** obtain a bizarrely future-dated security tape; question Marty.
- **TweedCorp:** audit Spacealite's opportunistic invoice; question Buffer Bob.

Once Chip has the receipt and security tape and has interviewed Chuck and Marty, he must **return to TVPD** to submit report 97-B. The case is solved only when the player identifies the chief, explains that he ate the donuts, and submits the security tape as decisive evidence. False accusations are rejected, recorded in the report-attempt counter, and can be corrected without losing evidence or locking the story. There is no violence, arrest mechanic, simulation of real policing or private data collection.

The solution was authored for this fictional comedy. It is not extracted from any classic licensed police adventure and does not contain third-party characters, copied music, screenshots, or game art.

## Mechanics and accessibility

- Click or keyboard-activate travel locations, evidence, witness dialogue, and the report form.
- Stylized, responsive hand-authored CSS stage art for the precinct, coffee shop, video shop and corporate office, plus a dedicated Arcade cabinet hub.
- Evidence and witness statements appear in a readable casebook, with an objective hint, progress indicator and live dialogue.
- Saves locally on the user's browser with a new, isolated versioned key: `tweedleverse.tweedlepd.case001.v1`.
- The game **never modifies** the Stemside RPG's `tweedleverse.stemside.save.v1` key. Reset prompts clearly state the scope.
- A solved case displays a persistent **Unpaid Detective Badge** ending. No automatic replay or duplicate rewards.
- Invalid/corrupt detective saves are ignored or sanitized; data is displayed with `textContent`, not injected as HTML.
- Reduced motion is respected. All functional controls are native buttons/selects with labels, keyboard operation and focus indicators.
- No online APIs, user accounts, cookies, analytics, third-party media, location access, or playable fake links.

## Check and deployment

```bash
npm run check
```

This validates the new engine, UI controller, original existing modules and Node 22's complete test suite. Tests cover real case requirements, evidence being location-bound, duplicate collection, incorrect conclusions, correct solution, impossible report submissions, save roundtrips, sanitization, separate save keys, game links and Pages packaging.

**Manual QA on GitHub Pages:** open Arcade; launch the RPG and return; launch TweedlePD, collect crumbs at TVPD, travel to CoffeeChucks for receipt and Chuck, visit Lackluster for tape and Marty, return to TVPD, try an incorrect report, then file Chief / Ate the Donuts / Security Tape. Refresh and verify persistent solved state. Reset only TweedlePD (after confirmation), then open Stemside and verify your prior RPG progress is still intact. Check mobile and keyboard layouts.

## Future roadmap (not claimed complete)

- More episode-based TweedlePD cases, patrol calls, richer dialogues and optional nonviolent puzzle mechanics.
- A shared *read-only* lore registry and optional cross-game references, without merging independent save slots or granting one game unrestricted access to another.
- Further original game concepts: Tweedleball Pro Tour, Lenny Smokins: World Tour, Tweedsie's Tunnels and Spacealite Tycoon.
- Gamepad and XR support may eventually follow, after browser-first workflows are playtested.

This is **a playable detective mini-adventure** and game hub, not a complete 3D open-world patrol simulator, full animated series or standalone app store.
