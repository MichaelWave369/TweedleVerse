# Welcome to Stemside v0.5 | Corporate Disputes

> **A grown-up absurdist neighborhood RPG experiment.** All names, character designs, commands, prose and visuals are original to TweedleVerse. This is not a clone of any earlier role-playing game.

## What is playable

The [Stemside game](../play.html) retains its existing walkable district, interactive map, three comic storefront scenes, Plot Points / Page 42 rewrites, and Tweedleball practice. Three **optional** turn-based corporate confrontations have been added, accessible with the **CHALLENGE CORPORATE NONSENSE** button while standing near the corresponding location.

| Site | Encounter | Corporate premise |
| --- | --- | --- |
| CoffeeCharles | The Grand Charles Surcharge | The company charges extra for pronouncing coffee |
| Whole Moods | Mandatory Feeling Audit | An orb demands a mandatory happiness quota |
| Spacealite Tower | The Subscription Showdown | Reggie bills the entire town for looking at his building |

These are deterministic **comedy encounters**, not violent battles. Enemies have *Corporate Nonsense Exposed* instead of health. Your shared party meter is *Composure*. Lose your composure and the meeting is adjourned, without losing other progress. Revisit or press **RESTART ENCOUNTER** to try again.

## Four silicon party actions

| Character | Action | Mechanical tradeoff |
| --- | --- | --- |
| Chip | Play Dumb | +19 nonsense exposed, +6 composure recovered |
| Dank-9000 | Pitch a Bundle | +27 nonsense exposed |
| Buffer Bob | Cite Section 42 | +17 nonsense exposed, +14 shield against the next corporate retort |
| Professor Terpenstein | Deploy Prototype | +34 nonsense exposed, costs 24 composure before the opponent reacts |

The opponent responds after your turn unless the move resolves the argument. Enemy retorts reduce composure; Bob's shield absorbs them, and compounding frustration slightly increases costs on long meetings. A reckless prototype can exhaust the party before the argument is finished. Move combinations are meaningful, and all three disputes can be won without a cheat or external service.

## Tweedsie, the accidental legal department

After defeating **two distinct** corporate opponents, Tweedsie becomes available in later confrontations as a **once-per-encounter** move: he edits the invoice, adds 20 nonsense exposed, and makes the opponent skip one response. A win is recorded only once for each unique opponent; a replayed encounter still works as practice. Three distinct wins unlock a joke honorary title, *Rebel of Stemside*. There is no real currency, gambling, commerce, or substance-use requirement.

## Controls and accessibility

- Visit one of the three sites using the game page's existing **WASD, arrows, touch D-pad or gamepad stick** navigation.
- Select **CHALLENGE CORPORATE NONSENSE**. The modal focuses its Close button and traps Tab in its active controls.
- Click or tap one of the four character actions, or press **1–4** while the encounter is open.
- Use **Escape** or Close to leave. The original Page 42 rewrite, interior scenes, Coffee Run, and Tweedleball are unaffected.
- Buttons and progress meters have textual statuses; reduced-motion preferences disable metric transitions. Battle art is an abstract CSS illustration, not external media.
- The gamepad controls the walkable map; **gamepad navigation of the in-battle command menu is not yet implemented**. Keyboard/mouse/touch work for commands.

## Originality and scope

This is an early, compact satirical turn-based RPG **minigame**. There's no RPG inventory, character leveling, save/load, NPC movement, long campaign, sophisticated world collisions, or dynamic party switching yet. The commands and story are authored. No remote inference, account, telemetry, third-party JavaScript libraries or copyrighted audio/video assets are used.

Pure JavaScript game mechanics live in [battle-core.mjs](../assets/battle-core.mjs); DOM and drawing integration lives in [play.js](../assets/play.js). Test [battle.test.mjs](../tests/battle.test.mjs) covers the uniqueness and location mapping of all three enemies, four unique actions, winning/losing scenarios, immutability, one-use Tweedsie ability, achievement awards, original HTML wiring and deployment checks.

## How to verify

Run `npm run check` with Node 22+, then `python -m http.server 8000` and visit `http://localhost:8000/play.html`. For CI use the repository's `TweedleVerse checks` workflow. The existing GitHub Pages workflow already copies the whole `assets/` directory so this feature deploys after merge without modifying the Pages publish artifact.

A clean run should:
1. Walk to CoffeeCharles; win with a varied selection of Chip/Dank/Bob/Professor actions.
2. Visit Whole Moods; win a second unique encounter.
3. Approach Spacealite Tower; verify Tweedsie is now clickable once and causes the opponent to miss a turn.
4. Win all three; confirm the title in the sidebar.
5. Restart and deliberately overuse the Professor at Spacealite to reach a loss and retry; confirm no earlier achievements are lost.
6. Confirm the Coffee Run, interiors, script rewrite, Tweedleball and map still function.
