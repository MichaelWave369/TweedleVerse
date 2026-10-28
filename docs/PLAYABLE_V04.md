# Welcome to Stemside | v0.4: Three Interiors and Page 42

**Status: reviewable PR stage.** This is a working browser prototype and not a shipped 3D open world.

## New playable systems

Three existing map locations include an **ENTER SHOP** action when the player is near the signpost:

| Interior | NPC | Theme |
| --- | --- | --- |
| CoffeeChucks | Chuck, Shift Manager | Workday coffee scam and North/South bean pricing |
| Lackluster Video | Marty, Rewind Technician | VHS from future episodes and the missing script |
| TweedCorp Co. | Buffer Bob, Compliance | Unwanted athletic contract and corporate script rules |

Each original scene contains a small illustrated side-view counter and three choices, each with authored dialogue. Selecting a conversation option in an interior for the first time grants **one Plot Point** (max three total); revisits give different lines but cannot farm points. Outside, the existing game still supports thirteen businesses, Coffee Run, Tweedleball practice, and Tweedsie.

## A real script rewrite, not just a renamed label

1. Walk the **Coffee Run**: CoffeeChucks → Stems League → TweedCorp.
2. Enter any **two distinct** interiors and click a dialogue option in each to earn two Plot Points.
3. Select **READ THE EPISODE SCRIPT** in the game sidebar after step 1 and 2.
4. Spend 2 points, once per run, on one of two rewritten next scenes:
   - **Coffee First:** return to CoffeeChucks to obtain your free coffee.
   - **Audit the Bandwidth:** visit Spacealite Tower to uncover Reggie's billing absurdity.
5. When you visit the chosen destination, its authored payoff appears and the script HUD marks **epilogue complete**.

The rewrite changes the actual next destination and narrative resolution. The original three-stop Coffee Run remains preserved, and the chosen branch is deterministic and testable. A new run resets points, dialogue-visit rewards, and the chosen ending. No remote AI service, accounts, telemetry, or saved player data is used.

## Architecture

- `assets/story-core.mjs`: pure data and logic for scenes, earned plot points, rewrite eligibility and epilogue resolution.
- `assets/play.js`: browser controller integrating the existing game world, DOM choices, modals and HUD.
- `play.html` and `assets/play.css`: accessible original scene art drawn with CSS, dialogue buttons and Page 42.
- `tests/story.test.mjs`: Node tests that verify one-time awards, state immutability, rewrite gating, distinct endings and site wiring.

## Accessibility and limitations

The interior and script use button-based interactions accessible to mouse, keyboard, and touch, with modal focus management and Escape to close. Moving between businesses still requires the existing map controls. Full controller navigation *inside* choice menus is not yet implemented; gamepad A remains available for the exterior. The illustrated rooms are compact interactive **scene panels**, not walkable interiors. No scene includes copyrighted dialogue, characters, audio or assets.

For local verification run `npm test`, `node --check assets/play.js` and `node --check assets/story-core.mjs`, then open `play.html` via a local web server. The existing GitHub Pages workflow publishes assets automatically when enabled.
