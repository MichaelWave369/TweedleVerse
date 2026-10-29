# TweedleVerse v0.14: Two new playable Arcade adventures

The [Arcade](../arcade.html) now links **four distinct game series** with **five playable browser experiences**. The new games are original, static GitHub Pages apps with independent local browser saves and no third-party dependencies.

## Adventures of Tweedsie

[Play the underground adventure](../tweedsie.html). A hand-authored original side-scroller with:
- **Eight interconnected cavern screens**: The Original Hole, Root Cellar, Firefly Subway, Mushroom Exchange, Echo Shaft, Loud Vault, Northside Farm Underpass and Underground Exchange. Some branch off the central path; explored locations are recorded in a cave chart.
- Gravity and jumping, platforms, left/right movement with WASD/arrows, Space/W/Up jump, E at glowing passages, optional gamepad (left stick/A/B) and touch buttons.
- Six fictional “loud-bud” curiosity collectibles located on different platforms. Collected props remain collected across reloads, with named inventory.
- The hidden Loud Vault opens when you collect at least **five**; entering finishes the demo and grants the **Underground Legend** badge.
- The existing **original Tweedsie SVG** is used for the player character. There are no borrowed game sprites, real farming instructions, real transactions or copying of another game's maps.
- **Scope:** Eight screen-scale rooms constitute the first connected network, not an infinite/procedurally generated full-sized world, and there's no hostile combat yet. Future: expansive nonlinear map, boss contracts, secrets and gated movement abilities.

## TweedleGolf ProTour

[Play golf and design a custom course](../golf.html). An original, simplified top-down golf game:
- **Three authored playable holes** with separate pars, tee locations, greens, fairway, rough, sand and water hazards.
- **Four clubs** (driver, iron, wedge, putter), click/tap-to-aim, a power slider, a Swing/Space action, per-hole strokes, water penalties and a persistent ProTour scorecard.
- A **Course Architect** mode with a **15 × 9 paintable terrain grid**: fairway, rough, green, sand and water. The protected tee and cup cannot be overwritten. The user can immediately play their custom hole and store their design in the browser.
- **Name your golf club.** Fictional celebrity guest interest depends on the designed course's terrain variety/prestige. As prestige increases, characters such as **Duke Von Divot**, **Cindy Chipshot**, **Reggie Bands III** and **Mavis McMulligan** become eligible for invitations. Invitations persist and can be revoked by redesigning an unsuitable course.
- Club flight ranges, lie multipliers and stroke updates are deterministic and simplified, not licensed PGA data, realistic professional ball-flight physics, live tournament multiplayer, or full resort economics.
- Future: multi-hole course designer, club building placement and staff, visitors reacting to actual hole scores, online/non-online tournaments, camera/shot flight refinement, sponsors and more events.

## Save isolation

| Experience | LocalStorage key |
| --- | --- |
| Stemside RPG | `tweedleverse.stemside.save.v1` |
| TweedlePD Case #001 | `tweedleverse.tweedlepd.case001.v1` |
| TweedlePD Patrol | `tweedleverse.tweedlepd.patrol.v1` |
| Tweedsie Underground | `tweedleverse.tweedsie.tunnels.v1` |
| TweedleGolf | `tweedleverse.tweedlegolf.protour.v1` |

Only the relevant key is touched by each game, including reset. Saves are checked for known IDs, finite coordinates, bounded values, and the expected version, with no code execution from imported data and no network calls.

## QA

Run `npm run check` on Node 22+.

- Open each title from the Arcade and ensure existing games still work.
- Tweedsie: collect a bud from the Root Cellar, cross passages, discover both side branches, gather five buds, reach the Loud Vault and claim the badge; reload and verify collections remain. Reset after confirmation.
- Golf: click the course to aim, play club shots, land in the water and observe a penalty, finish a hole and verify its score persists; build a custom hole, paint hazards/greens, rename the club, invite a VIP and confirm save/reload consistency. Reset after confirmation.
- Test phone dimensions, touch controls, keyboard controls, and optional gamepad on Tweedsie. All drawing and visuals are self-contained.
- Verify the Pages workflow copies `tweedsie.html`, `golf.html` and `assets/`, while previous pages and their save slots stay available.

**Both are first playable vertical slices**, not finished replacements for classic side-scrollers or full AAA PGA simulators.
