# Welcome to Stemside v0.6 | The RPG Passport and Local Save System

> A browser-based **single-player progression layer** for the original TweedleVerse comedy RPG prototype. This update does not require accounts, internet services, or cloud storage.

## Playable additions

### The passport

Each of the 13 named Stemside businesses now earns you **one passport stamp and one unique fictional souvenir** the first time you interact with its storefront. Repeating an interaction replays the business's sketch dialogue but never awards duplicate souvenirs or XP. Collecting all thirteen earns the on-screen **FULL PASSPORT** designation. Three and eight stamps also have comic milestone messages.

Examples: CoffeeChucks Coupon, Tomorrow's VHS Receipt, Executive Stirrer, Southside Scorecard, and Reggie's Bag of Mostly Stems. No souvenir is a real product or consumption reward.

### Five progress ranks

Ranks are awarded from *existing game accomplishments*, calculated on each update, not from spending time idling:

| Accomplishment | Experience points |
| --- | ---: |
| Each distinct location interacted with | 5 |
| First conversation in each of three interiors | 12 |
| Each of three Coffee Run stages | 10 |
| Completing Coffee Run | Additional 25 |
| Winning a Tweedleball practice medal | 35 |
| Winning each of three distinct corporate encounters | 30 |
| Completing the rewritten Page 42 epilogue | 45 |

Thresholds: **Unpaid Intern (0)**, **Sidewalk Investigator (40)**, **Southside Regular (100)**, **Paperwork Rebel (190)**, and **Stemside Legend (300)**. They are flavor titles only, not paywalls or capability gates.

### Journal

The sidebar shows the latest location stamps plus coffee quest status, Tweedleball medal, resolved corporate complaints, and a Page 42 rewrite if completed. All entries are derived from the restored gameplay state; they do not require a remote backend or a separate journal database.

### Versioned local save

The game now uses a single compact JSON record under the browser storage key `tweedleverse.stemside.save.v1`.

It persists:
- Player position (world coordinates)
- Coffee Run stage
- Tweedleball medal
- Previously heard interiors, remaining Plot Points, selected Page 42 branch and resolution
- Unique corporate victories and passport stamps
- Existing encounter-count cadence for Tweedsie's appearances

It **does not** save an in-progress boss encounter, a partially charged Tweedleball shot, open dialogue modals, or active keyboard state. After a reload you return to the town, not into an ambiguous paused fight.

The player can use **SAVE LOCALLY NOW**, and meaningful milestones save automatically. Position saves periodically while walking and also on tab/page exit where the browser permits it. There are no cookies, account requirements, uploads, trackers, or external API calls. Modern browsers may clear site data, disable storage, or isolate storage in private/incognito mode; in those situations the game still works for the open tab but cannot promise persistence.

**RESET RUN + LOCAL SAVE** requests confirmation because it overwrites the previous local save with a fresh run.

The save format includes a schema version. The loader rejects unrecognized versions, clamps positions to the playable map, validates business IDs and boss IDs against approved names, deduplicates stamps and victories, and restricts Plot Point and story fields. Damaged data is ignored safely.

## Testing

Run `npm run check` or `npm test` with Node 22+. The new `tests/progression.test.mjs` covers ID consistency across all 13 landmarks, non-duplicating collectibles, rank calculations, valid save roundtrips, stale/corrupted input handling, story continuity, journal entries, wiring to the UI and GitHub Actions script syntax checks.

Browser QA:
1. Play `play.html` on the live GitHub Pages site or a local HTTP server.
2. Visit CoffeeChucks and interact twice. Confirm exactly **one** souvenir and 5 XP.
3. Visit another shop, talk to Chuck or Bob, then **SAVE LOCALLY NOW**.
4. Reload. Confirm the same position, passport items, story status and experience rank.
5. Complete the Coffee Run, win a corporate dispute and earn a Tweedleball medal. Reload, confirm persistence.
6. Try a Page 42 alternate ending; finish it and reload. Confirm the ending remains completed.
7. Choose **RESET RUN + LOCAL SAVE**; first cancel and ensure progress remains, then accept and verify a fresh passport.
8. Block browser storage (where supported). Confirm the game remains playable and shows a clear storage-unavailable message.

## Scope and limitations

The v0.6 passport is a modest, fully original RPG backbone. Items are collectibles with descriptive flavor text and **no equipping, trading, shops, currencies or consumable effects yet**. There is one local save slot only. No cloud sync or storage export/import. Full 3D interiors, party-level attributes and a larger campaign remain future possibilities.

This stays within existing static GitHub Pages hosting; no Pages admin changes are required for v0.6 if the current workflow already publishes the `assets/` directory.
