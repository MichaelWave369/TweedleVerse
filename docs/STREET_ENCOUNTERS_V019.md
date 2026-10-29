# TweedleVerse v0.19 | Stemside Street Encounters

The World Map is now an **exploration and story gameplay layer**, not only a navigable gateway between previously published adventures. Players can investigate three original comedy mysteries that use the **existing connected street graph**, actual arrival checks, location-specific witnesses, evidence-based decisions, and a locally saved side-case ledger.

The existing World Map remains at [world.html](../world.html); no new pages, packages, hosted services or account setup are needed.

## Playable incidents

The new **Street Encounters** board appears alongside the destination list. Players may start either of the first two cases, in either order, and then unlock the finale after resolving both.

| Case | Witness itinerary | Completion reward |
| --- | --- | --- |
| The Sidewalk Subscription | CoffeeChucks → TweedlePD HQ → Spacealite Tower | Public Sidewalk Defender |
| The Divot Diplomatic Incident | TweedleGolf Club → Tweedsie's Burrow → Northside Farms | Fairway Peacekeeper |
| The Broadcast of Absolutely Nothing | Lackluster Video → the Game Arcade → Public Commons → TweedCorp Tower | Unpaid Stemside Civic Hero |

Each stop has an authored witness statement and **three possible responses**. There is one evidence-based resolution at each stop. Incorrect responses are retriable; they increment only the fictional local wrong-lead counter. Correct responses advance the case and identify the next witness location. A case is not credited until **all three or four interviews** have been resolved in sequence. Players may work on only one open incident at a time.

### How to play

1. Select **Open Incident File** on the Street Encounters panel.
2. The next witness is highlighted on the map. Click **Set Route to Witness**, then **Walk to Selected Location** or walk with arrow/WASD/touch direction buttons to reach the actual location through connected streets.
3. Only when your World Map character is physically at that location do the witness statement and response buttons appear.
4. Choose the response backed by evidence. A wrong response produces satirical feedback and never skips the location.
5. Continue to the next district, and earn the fictional case reward at the final interview.
6. Complete both initial incidents to unlock the four-stop citywide finale.

The interface is keyboard-accessible through native buttons, supports narrow screens, and respects the site's reduced-motion setting. The game is fictional satire, not advice about real law enforcement, substance use, or legal disputes.

## Save boundaries

A new **independent versioned localStorage key** is used solely for incident progress:

`tweedleverse.worldmap.encounters.v1`

Its schema records a set of completed case IDs, the active case and step, and a capped fictional wrong-lead count. On load, `decodeEvents` validates all case IDs, scene indices and finale prerequisites, preventing unsupported or out-of-order completions from being recognized. Like other browser-local saves, it is **not cryptographically signed** and is not an online competitive achievement authority.

The v0.18 World Map save (`tweedleverse.worldmap.local.v1`) remains **unchanged**. Street Encounters reads it only in memory via the existing World Map controller to verify the player actually reached the correct stop. It writes **only its own encounter key**.

- **Reset Only Street Cases** clears/reinitializes only encounter progress after confirmation. The city tour, visited locations and postcards remain intact.
- **Reset Only World Map** resets map exploration after confirmation, without clearing completed street cases. A new journey can resume with retained cases.
- The seven earlier game saves, read-only Universe Passport, and separate Crossroads case ledger are untouched.
- No accounts, analytics, external API calls, media licenses, user locations, cookies or new packages.

## Engineering and quality gates

- `assets/world-events-core.mjs`: pure authored incident definitions, unlock rules, safe decode/encode, location-gated answers, and case lifecycle.
- `assets/world-map.js`: event board rendering, progress persistence, map marker for active witness, route-to-witness button and decision controls.
- `world.html` and `assets/world-map.css`: integrated story interface and accessible response controls.
- `tests/world-events.test.mjs`: unique case/choice validation, gated finale, connected path arrival, impossible teleport/answer denial, retries, saved end states, malformed data, separate reset and UI/CI integration.
- Existing World Map regression tests continue to run and the v0.18 test version guard now permits later compatible minor releases.

Run:

```bash
npm run check
```

After merge, manually QA a fresh browser profile: visit `world.html`, open Sidewalk Subscription, walk to CoffeeChucks, choose a wrong response, then the supported answer; follow the new highlighted witness location through the full case. Complete the Divot case to unlock Broadcast. Reload in the middle of a multi-stop case, verify the current step returns. Finish all incidents, reset only the World Map, and confirm street-case completion persists. Then reset only street cases and verify postcards, earlier adventures and Passport/Crossroads still retain their original progress.

## Next possible chapter

Street Encounters introduces **location-bound narrative progression** on top of the connected city graph. It does not yet simulate a living AI population, continuous NPC movement, traffic physics or bidirectional cross-game item transfers. Those would require a separate consent-aware event protocol and richer simulation testing.
