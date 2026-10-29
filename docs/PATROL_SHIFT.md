# TweedlePD: Patrol Shift (v0.13)

This is **Episode Two** of the TweedlePD browser comedy, not a real law-enforcement simulator. It introduces a freely drivable original cartoon patrol map, three sequential dispatch calls, evidence-aware practical responses, a shift ledger, and a persistent badge.

## Enter the new episode

1. Open [TweedlePD: Rookie Mistakes](../tweedlepd.html) and solve Case #001, the Missing Donut Incident. Complete the required witness interviews and proof, then file Chief McBadge / Ate the Donuts / Security Tape **at the precinct desk**.
2. The solved-case credits contain a new **Start Episode Two: Patrol Shift** link.
3. Open [Patrol Shift](../patrol.html), also reachable from [TweedleVerse Arcade](../arcade.html).

The patrol page reads **only the existing valid solved status of Case #001** to determine eligibility. It does not change or reset the detective case. If the donut case is not solved in the current browser, a separate locked-screen message links back to Case #001.

## Gameplay

- Drive Chip's **top-down stylized squad car** with WASD, arrow keys, touch D-pad or a connected gamepad stick.
- The next dispatch zone is highlighted on the city map; a dashed line shows the straight-line direction, not a simulated GPS route.
- When close to the active stop (within 95 fictional map units), press E or **Respond at Location** to read the witness statement and three possible actions.
- Make a sensible choice to resolve each call. Wrong choices create a fictional mistake in the local shift ledger and offer explanatory feedback; they never trap the game or encourage harmful conduct.
- An **Accessible Fast Travel** button brings the car to the currently active call for players who cannot or do not want to steer.
- Calls occur in order. Their completion is saved locally, and the same call cannot be repeatedly counted or rewarded.

### Shift cases

1. **Drive-By Coupon Assault** at CoffeeChucks: an out-of-control coupon cannon has littered the sidewalk. Disable it and clean up rather than taking extreme action.
2. **Noise Complaint from Tomorrow** at Lackluster Video: inspect the impossible timestamp before accepting a report about noise that never occurred.
3. **Unauthorized Quiet Fee** at Spacealite Tower: reject Reggie's attempt to invoice the public for silence and issue a notice rather than paying him or detaining the absence of noise.

Complete all three to earn the **Senior Unpaid Deputy** badge. The badge is displayed on the shift screen and remains after a reload.

## Files and state

- `assets/patrol-core.mjs`: pure deterministic movement (bounded, diagonal-normalized), location checks, dispatch transitions, ordered-progress validation and versioned JSON save codec.
- `assets/patrol.js`: keyboard/touch/gamepad controller, original Canvas2D map and squad car, on-location dispatch choices, local autosave, reset confirmation and accessible fast travel.
- `assets/patrol.css` and `patrol.html`: responsive interface with native buttons, visible status, and reduced-motion CSS settings.
- `tests/patrol.test.mjs`: validates unlock prerequisites, route and call IDs, movement, wrong and correct answers, order, tampered saves, and deployment links.
- Pages publishes `patrol.html` alongside the previously deployed sites and assets.

The **three independent browser save keys remain separate**:

| Experience | Key |
| --- | --- |
| Stemside RPG | `tweedleverse.stemside.save.v1` |
| TweedlePD Case #001 | `tweedleverse.tweedlepd.case001.v1` |
| TweedlePD Patrol Shift | `tweedleverse.tweedlepd.patrol.v1` |

Patrol Reset only replaces the third key and asks for confirmation. No account, analytics, cookies, cloud sync, remote API, third-party assets, copyrighted game characters, or real fines are involved.

## QA

- `npm run check` using Node 22 or later.
- Confirm an unsolved Case #001 displays a locked episode page.
- Solve Case #001 and click through to Episode Two. Drive with WASD and arrows, and verify touch D-pad and optional gamepad inputs.
- Check that choosing an action far away does not complete a call. Drive near the yellow highlighted dispatch zone or use Accessible Fast Travel, then press E.
- Try a wrong answer at each call. Confirm the mistake counter increments and the objective does **not** advance.
- Choose the correct solutions in order. Check 1/3, 2/3 and 3/3 in the shift ledger. Confirm the badge appears only after the third success.
- Refresh after each call and after the finale. The car position and completed calls should return, with no duplicated award.
- Reset only patrol and confirm both Case #001 and Stemside RPG saves remain untouched.
- Check the mobile layout, focus indicators, reduced-motion preference and keyboard-only play.

### Scope

This **is a playable schematic driving and decision game**, not a physics-accurate vehicle simulator, a VR patrol experience, open-world traffic simulation, or general-purpose criminal justice training. More cases, city NPCs, and a deeper patrol district are possible future expansions.
