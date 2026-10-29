# TweedleVerse Arcade v0.15 | Underground Courier & Grand Stem Cup

This release deepens the two playable v0.14 games without creating new repos, overwriting the preexisting save slots, or claiming multiplayer and AAA simulation features.

## Adventures of Tweedsie: Underground Courier Board

Three ordered deliveries add return trips and a reason to explore alternate tunnel passages:

1. **Root Route Express**: discover Root Cellar and Northside Farm Underpass, retrieve the Royal Root Sprig and Northside Garden Stash, and return to the **Original Hole** to claim the delivery. Unlocks **Burrow Burst**, a horizontal 150-unit dash with an approximately 1.25-second controller cooldown. Use **Shift** or the new on-screen button, or optional gamepad X.
2. **The Midnight Messenger**: discover Firefly Subway and Mushroom Exchange, retrieve Fluorescent Loud Bud and Midnight Bloom, return to claim. Unlocks **Scent Compass**, a route hint computed from the actual connected cave graph. It tells players the next cavern on the shortest known route to a missing cargo item.
3. **Stemside's Most Wanted Courier**: discover Underground Exchange and Echo Shaft, retrieve Market Mystery Nug and Echo Leaf, and file the delivery to earn the **Golden Gopher Courier** badge.

Contract completion is explicitly **not** simply stepping into a location. The user needs both discovered caves, both originally collectible cargo items and an actual delivery at home. The only exemption is a **previously completed Loud Vault run**; those players can redeem eligible deliveries at their finale location without losing their existing ending.

The base tunnel game still uses its original `tweedleverse.tweedsie.tunnels.v1` save. Claimed deliveries and dash usage live in an additional `tweedleverse.tweedsie.courier.v1` browser-local save. Delivery claims are checked against the base save on load; impossible/out-of-order claims are rejected. The original caverns, gates, vault, jump physics and old achievements remain unchanged.

## TweedleGolf ProTour: Grand Stem Cup

The **Grand Stem Cup** makes a repeatable three-hole tournament out of the existing authored courses, with a real round lifecycle:

1. Start the cup from the golf sidebar. The golfer tees up at CoffeeChucks Municipal.
2. Finish the hole in actual gameplay. The completed stroke total is recorded in Cup state and the **Next Cup Hole** control advances to Reggie's Paywall Links.
3. Finish Reggie's hole and advance to South Stemside Public Links, then complete that third hole.
4. See total strokes, placement and a **Grand Stem Cup Champion** or **Official Grand Stem Finisher** badge. A personal-best score, last score and count of completed rounds persist for future attempts.

Fixed, **scripted fictional** opponent totals give meaningful offline leaderboard competition:

- Duke Von Divot: 11 strokes
- Cindy Chipshot: 14 strokes
- Reggie Bands III: 17 strokes

These are not actual human golfers, live scores or real licensed celebrity personalities. Cup holes must be played in order, cannot be skipped using the regular hole selector, and course editing is temporarily disabled during an active round to protect the tournament state. Practice and custom-course creation remain available outside Cup rounds. The round survives refresh through its own new `tweedleverse.tweedlegolf.cup.v1` save; it preserves the base golf scorecard and custom course in `tweedleverse.tweedlegolf.protour.v1`.

## Testing

```bash
npm run check
```

The new pure, dependency-free engines are `assets/tunnel-contracts.mjs` and `assets/golf-cup.mjs`; the GitHub Actions checks and Pages verification jobs syntax-check them along with every preexisting module. `tests/arcade-courier-cup.test.mjs` checks:

- Collect/visit prerequisite enforcement, in-order delivery, home check, optional completed-run compatibility, new save validation, dash bounds and graph-based compass routes.
- Three-hole round sequencing, inability to skip incomplete holes, reliable finished-stroke recording, replay and best-score behavior, predetermined opponent rankings and sanitizing invalid scores.
- UI wiring for new actions and unmodified original games.

Manual browser checks: open an older Tweedsie save (all original collectibles intact) and a brand-new save, deliver one contract and test the dash by keyboard and touch; verify the compass after contract two; close a full Cup round, reload after hole one and after the finale, then play a second round and confirm the best total remains the lower score. Confirm golf course editing and ordinary hole choices remain available outside a round, and that neither game resets the other games.

## Limits

The arcade versions remain browser-first first-party original fiction. The courier board is three hand-authored jobs; dash movement is a simplified power, not enemy combat. The Cup is a three-hole local tournament with scripted opponents, not networked multiplayer, a licensed PGA simulation, advanced aerodynamics or 18-hole tournament management. All data stays on the device.
