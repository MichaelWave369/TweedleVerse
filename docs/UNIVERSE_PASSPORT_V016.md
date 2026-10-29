# TweedleVerse Universe Passport | v0.16

The Universe Passport is a **read-only same-origin achievement gallery**, not another separately saved game, account system, or cross-repository tracking service.

Open [the Passport](../passport.html) or use the new **Open Your Passport** section in the [TweedleVerse Arcade](../arcade.html). The main TweedleVerse homepage also links to it.

## What it does

- Reads **seven exact first-party local browser save keys** from the existing five playable experiences across four game series, using the existing games' own versioned decoders.
- Recognizes **15 achievement stamps**: five from Stemside RPG, two from TweedlePD, three from Adventures of Tweedsie, and five from TweedleGolf.
- Shows completion by series, unlocked versus missing stamps, a local stamp count, a fun passport rank, and which original save slots could be read.
- Generates **short, fictional crossover headlines** when achievements in two different series intersect. For example, a real TVPD case completion plus recovered tunnel cargo unlocks a newspaper story about Tweedsie's underground routes; Stemside's billing finale plus a completed golf cup produces a Reggie Bands crossover.
- Lets players copy a **text-only summary** with an explicit button when clipboard permission is available. It includes only achievement titles and totals, not raw saves, personally identifying data, or game coordinates.
- Supports mobile, keyboard navigation, reduced motion, printer-friendly styles, and client-only local rendering. Game links and all achievement cards are native content. There is no web service, analytics, API, login, or package dependency.

## The recognized source slots

| Series / mode | Existing key | Decoder |
| --- | --- | --- |
| Stemside RPG | `tweedleverse.stemside.save.v1` | `decodeSave` |
| TweedlePD Case #001 | `tweedleverse.tweedlepd.case001.v1` | `decodePD` |
| TVPD Patrol Shift | `tweedleverse.tweedlepd.patrol.v1` | `decodePatrol` |
| Tweedsie Caverns | `tweedleverse.tweedsie.tunnels.v1` | `decodeTunnel` |
| Tweedsie Courier | `tweedleverse.tweedsie.courier.v1` | `decodeCourier` (requires valid cave state) |
| TweedleGolf ProTour | `tweedleverse.tweedlegolf.protour.v1` | `decodeGolf` |
| Grand Stem Cup | `tweedleverse.tweedlegolf.cup.v1` | `decodeCup` |

**These keys and their schemas remain unchanged.** Passport does not call `setItem`, `removeItem`, `clear`, send a request, or reset progress. The separate original games remain the only owners of their respective save writes. The detective badge is required to show the Patrol badge; the cavern save is required to validate Courier stamps.

## Stamps by game

**Stemside RPG:** Coffee Run Survivor, All-Access Tourist, Tweedleball Medalist, Script Rewriter, Billing Reversal.

**TweedlePD:** Unpaid Detective, Senior Unpaid Deputy.

**Adventures of Tweedsie:** Burrow Cartographer, Underground Legend, Golden Gopher Courier.

**TweedleGolf ProTour:** TweedleGolf Tour Card, Course Architect, VIP Clubhouse, Grand Stem Finisher, Grand Stem Champion.

The passport grants playful ranks based on the count of validated save-based stamps, from **Unpaid Visitor** to **Stemside Myth**. These are computed UI labels, not badges written to any game's save or externally authenticated achievements.

## Playtesting and privacy

1. Start with no browser saves: the Passport should show 0/15, seven missing slots, locked cards and an introductory crossover headline.
2. Complete Case #001 or a golf hole. Return to Passport or click **Refresh Local Stamps** to see the new stamps.
3. Check a partially completed Stemside save and a fully solved TVPD save. A Patrol stamp must **not** show unless both the detective case and the sequential patrol calls are complete.
4. Finish courier contracts in Tweedsie. The Golden Gopher stamp must not show with a missing or invalid tunnel save.
5. Finish a Grand Stem Cup and edit a custom golf hole. Verify tournament and architect stamps can appear independently.
6. Check the fictional crossover news changes when different series have overlapping progress.
7. Test unlocked/missing filters, copy-summary action, mobile layout and accessibility focus.
8. Return to every original game. **No original save should change** from visiting or refreshing the Passport.

Because these are plain browser saves, they are **not cryptographically signed**. Players can manually modify localStorage, so these are personal entertainment achievements, not competitive security attestations. Invalid save data is skipped or marked unreadable, and the Passport never evaluates executable text from the saved data.

The Passport sees only saves on the **same origin and browser profile**. Private browsing, clearing storage, switching devices, and other browsers can show zero progress. There is deliberately no account-level/cloud syncing, and no data leaves the browser through this feature.

## Developers

```bash
npm run check
```

New files: `passport.html`, `assets/passport.css`, `assets/passport.js`, `assets/passport-core.mjs`, `assets/arcade-passport.js`, and `tests/universe-passport.test.mjs`.

Existing GitHub Actions syntax validation and smoke tests include the Passport. The Pages artifact copies `passport.html` and the shared `assets/` directory. The Arcade itself reads the same seven slots for a small progress strip, with no writes and no added dependencies.

## Next

The Passport is the first **read-only continuity layer**. Future authored cross-game missions might link multiple stories using explicit permissions and a versioned event ledger. They are not claimed as implemented in this release.
