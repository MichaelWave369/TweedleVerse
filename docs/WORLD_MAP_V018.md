# TweedleVerse v0.18 | Stemside World Map

This release adds a **new playable, connected top-down city atlas** as the exploration and travel layer between existing game experiences. This is a hand-authored fictional map of Stemside, not a real-world map or an interchangeable open-world game engine.

Open [Stemside World Map](../world.html). Links are also provided from the main portal, Arcade, Universe Passport and Crossroads.

## Eleven connected destinations

The fictional city streets form one validated, bidirectional connected graph:

| Landmark | District | Playable destination |
| --- | --- | --- |
| Stemside Plaza | Civic Center | Stemside RPG |
| TweedlePD HQ | Civic Center | TweedlePD Case #001 |
| CoffeeChucks | South Stemside | Stemside RPG |
| Game Arcade | South Stemside | TweedleVerse Arcade |
| TweedCorp Tower | Corporate Row | Crossroads |
| Lackluster Video | South Stemside | TweedlePD Patrol Shift |
| Public Commons | North Stemside | Universe Passport |
| Northside Farms | North Stemside | Adventures of Tweedsie |
| Tweedsie's Burrow | Underground Entrance | Adventures of Tweedsie |
| TweedleGolf Club | The Fairways | TweedleGolf ProTour |
| Spacealite Tower | Corporate Row | Crossroads |

These are **in-universe access points** to already-implemented games, not brand-new duplicates. The map reuses existing page routes and doesn't change or overwrite any target game save. All portal hrefs are statically authored within this repository, so imported save data never creates a URL.

## Playable navigation

- Open `world.html` and spawn at Stemside Plaza.
- Click a point of interest on the Canvas2D map or select it in the keyboard-friendly destination list to preview the shortest street-by-street route.
- Click **Walk to Selected Location** to follow the highlighted route, with the player marker visibly moving along real graph edges. The tour records one street step per segment. **Stop Walking** pauses after the next finished segment.
- Arrow keys or WASD can walk one adjacent street at a time when the page or map canvas is focused. Four on-screen direction buttons support touch and keyboard.
- Once you have arrived at a selected landmark, the **Enter [game]** link becomes visible and opens that existing playable page. This isn't a claim of seamless shared 3D gameplay or live character import.
- Contextual NPC lines at TVPD, Tweedsie's Burrow, the Golf Club, Spacealite and the Arcade reflect *validated read-only Passport progress*. They do not modify any original game.

The map is a stylized fiction with street geometry, neighborhoods and cartoon signage. It has neither actual driving metrics nor real-world navigation, GPS or geographic claims.

## City tour progression

- **10 collectible postcard souvenirs** are earned by actually arriving at locations beyond Plaza.
- **3 neighborhood tour challenges**, determined by visited locations:
  1. *Who's in Charge Here?* explores Plaza, TVPD and TweedCorp.
  2. *From the Farm to the Fairway* traces Northside Farms → Burrow → Golf Club.
  3. *The Local Economy* covers CoffeeChucks, Lackluster, the Arcade, Spacealite and the Public Commons.
- Visit all eleven locations to earn the local **Stemside Grand Tour** finale on the World Map.

Tours and postcards are local to the World Map; they do **not** inject new stamps into the preexisting Passport's canonical set of fifteen achievements. That integration can be considered explicitly in a future version, rather than silently changing historical badge meanings.

## Storage separation and privacy

The only localStorage key World Map **writes** is:

`tweedleverse.worldmap.local.v1`

It holds `{version,current,visited,steps}` after value validation. Reset requests explicit confirmation and affects **only this map's exploration save**.

For contextual dialogue, World Map reads the same seven game slots that the Universe Passport already reads. There are no changes to their schemas, no Crossroads mutation, no network calls, no analytics, no new dependencies and no user account. On a browser with missing or invalid progress, this map works with neutral dialogue.

As with all our browser-local achievements, a user may modify localStorage manually; this is a personal exploration game, not a secure competitive attestation.

## Automated and manual QA

Run `npm run check` on Node 22+. New tests in `tests/world-map.test.mjs` cover:

- All map nodes and page destinations are valid, all roads bidirectional and the graph globally connected.
- Shortest paths have no skipped streets; walking can never teleport to an unconnected location.
- Map save version and visited locations are sanitized; malformed saves are rejected.
- Postcard discovery and all three tour requirements.
- Keyboard direction navigation and safe Passport-based dialogue.
- Complete UI controls, existing-game links, Pages artifact and CI syntax registration.

Manual browser QA after merge:

1. Open from Arcade, click TweedleGolf Club, click Walk, follow the highlighted path, and ensure you cannot enter golf until reaching its location.
2. Click **Stop Walking** mid-route; verify stopping after the current street and the saved intermediate location.
3. Use arrows/WASD and on-screen buttons to walk adjacent streets, watching the visited count and postcard list.
4. Navigate to TVPD and/or Spacealite with unsolved and solved saves, verify dialogue changes appropriately without resetting anything.
5. Refresh and confirm the world position, steps, postcards and tours persist.
6. Finish all locations and verify the local Grand Tour ending, then reset World Map and check that all original game saves, Crossroads and Passport are unchanged.
7. Test responsive phone sizes, keyboard-only focus and reduced-motion preference.

## Next directions

The map is the first **playable world navigation layer** for TweedleVerse. Richer street scenes, optional NPC walking interactions, shared lore events, transit methods and actual cross-game quest adapters could extend it, without requiring separate projects to share writable save state.
