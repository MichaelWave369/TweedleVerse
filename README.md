# TweedleVerse 🌿

> **Same universe. Different dimensions. Absolutely no refunds.**

An original, absurdist silicon-comedy universe created by **Michael Wave / Backyard Production Company**.

**TweedleVerse** is the umbrella world. **Practical Smokers** is its flagship workplace / hidden-camera-style comedy. **Welcome to Stemside** is its proposed explorable game. **TGA Pro Tour** is the world's ridiculous obstacle-course sport, **Tweedleball**. **Spacealite™** is the predatory interdimensional cable monopoly.


## TweedleVerse Arcade and TweedlePD (v0.12)

The universe now has a central [TweedleVerse Arcade](arcade.html) connecting **two playable browser adventures** and labeling additional game concepts as future projects. The new [TweedlePD: Rookie Mistakes](tweedlepd.html) is a separate, original comedy detective game starring Practical Smokers' Chip. Explore TVPD, CoffeeChucks, Lackluster Video and TweedCorp; inspect five clues, question four witnesses, and **return to the precinct to file the correct investigative report** in Case #001: The Missing Donut Incident. False accusations can be corrected; the right conclusion awards the Unpaid Detective Badge.

The detective game uses its **own versioned browser-only save** and cannot overwrite the existing Stemside RPG's local save. It introduces no third-party dependencies or server requests. The Pages workflow includes the Arcade and detective game; the main portal, city explorer, and RPG link to Arcade. See [Arcade and TweedlePD guide](docs/ARCADE_TWEEDLEPD.md) for complete mechanics, automated tests and browser QA instructions.

### Patrol Shift: v0.13

[Play TweedlePD: Patrol Shift](patrol.html) is **Episode Two** of the detective comedy. After solving Case #001, the rookie can drive a top-down squad car around a stylized Stemside patrol map using WASD, arrow keys, touch buttons or a gamepad stick. Answer three sequential original dispatch calls at CoffeeChucks, Lackluster Video and Spacealite Tower. Wrong decisions are explained and retriable; each safe solution is recorded in a separate local patrol save. Completing all three awards the **Senior Unpaid Deputy** badge. An accessible fast-travel action lets players skip the steering step. No real policing advice, multiplayer, or network services are involved. See [Patrol Shift guide](docs/PATROL_SHIFT.md). Existing Case #001 and Stemside RPG save files stay unchanged.

## Two more playable Arcade series (v0.14)

- [**Adventures of Tweedsie**](tweedsie.html): An original platforming side-scroller with **eight linked underground rooms**, branching tunnels, jumping, six fictional collectible loud buds, an unlockable vault ending, a cave chart, and local saves. Original Tweedsie art is reused, no borrowed sprites or licensed game mechanics.
- [**TweedleGolf ProTour**](golf.html): **Three playable arcade golf holes**, aiming and shot power, four clubs, golf lies and hazards, persistent strokes and scores, plus a **15×9 editable custom hole**, **named clubhouse** and **invite-able fictional celebrity golfers** unlocked by course prestige.

Both link from [TweedleVerse Arcade](arcade.html) and use entirely separate validated browser save keys. They are original playable first slices, not a finished 3D golf simulator or sprawling finished Metroidvania. Full controls, QA and limitations: [Twin Arcade v0.14](docs/TWIN_ARCADE_V014.md).

## More to do in the Arcade (v0.15)

**Adventures of Tweedsie** now has a **three-contract underground courier board**. Collect two specified fictional curiosities and visit both required caverns for each job, then return to the Original Hole to file the delivery. Contract rewards unlock a **Burrow Burst** dash, a **Scent Compass** for navigating the cave network, and finally the **Golden Gopher Courier** badge. Existing v0.14 tunnel saves remain intact; courier claims are stored in a separate local key, and a completed older vault run may redeem eligible deliveries without replaying everything.

**TweedleGolf ProTour** now has the **Grand Stem Cup**, a replayable three-hole sequential tournament with a local scorecard, a saved personal best, scripted fictional celebrity competitors, podium rankings and a champion/finisher reward. Tournament progress is stored independently of the golfer's existing local course/club data. A Cup in progress cannot skip holes or enter the terrain architect; players still have free practice mode outside a round.

See [Courier and Cup v0.15](docs/COURIER_CUP_V015.md) for controls, limitations and QA.

## Universe Passport: shared story, independent saves (v0.16)

The [**Universe Passport**](passport.html) now shows **15 save-validated achievement stamps** spanning Stemside, TweedlePD, Tweedsie's underground adventures and TweedleGolf. It uses each existing game's decoder to build a read-only stamp album, local progression rank, and original *Stemside Evening News* crossover stories when achievements from different games coincide. Visit the [Arcade](arcade.html) to see your same-browser stamp count and enter the Passport.

This is **not** a cloud account or a synced/mutable universe save. All seven existing game save slots remain owned and written exclusively by their games. Passport never changes them, makes network calls, or collects personal information. Without local progress in this browser it correctly displays locked stamps. Local browser data is not cryptographically authenticated. [Passport guide and QA](docs/UNIVERSE_PASSPORT_V016.md).

## Crossroads: Actual playable multi-game cases (v0.17)

[**Play TweedleVerse Crossroads**](crossroads.html) to investigate **three original, three-scene crossover mysteries**, unlocked by achievements from two *different* game series. Chip, Tweedsie, fictional golf celebrities and Reggie finally collide in playable evidence-driven adventures, not just Passport newspaper headlines. Cases: **The Eighteenth Hole That Wasn't**, **The Grand Recount of Nothing**, and **The Underground Evidence Delivery**. Each ends with its own locally saved case badge. Bad answers are explained and safely retriable.

Crossroads uses the existing Universe Passport decoders to verify source-game achievement stamps; it **never writes to any of the seven existing game saves**. Only the separate `tweedleverse.crossroads.cases.v1` slot stores its own case steps and results. The Passport stays read-only, but now shows a live `0 / 3` to `3 / 3` Crossroads completion counter. The Arcade links directly to these investigations. No login, network service, unlicensed media or new packages. More details: [Crossroads v0.17 guide](docs/CROSSROADS_V017.md).

## Walkable Stemside World Map (v0.18)

[**Explore the World Map**](world.html) for the first real connected top-down navigation layer across TweedleVerse. Walk a hand-authored graph of **eleven locations**, preview shortest street routes, navigate with keyboard/touch or animated path walking, collect **ten postcards**, complete **three neighborhood tours**, and enter the existing Stemside RPG, TVPD, Tweedsie, golf, Crossroads, Passport, and Arcade at their in-universe landmarks. Locations reflect actual validated Passport achievements through contextual dialogue.

The original seven game saves and Crossroads ledger are unchanged. World Map writes **only** `tweedleverse.worldmap.local.v1`, independently and with a confirmed reset. It's original fictional cartography and a playable portal hub, not a full seamless 3D world or a real street map. Original fifteen Passport stamps remain unchanged. [Technical guide and QA](docs/WORLD_MAP_V018.md).

## Street Encounters on the World Map (v0.19)

[**Walk Stemside and play Street Encounters**](world.html) adds **three original location-bound investigations** to the eleven-place city atlas. *The Sidewalk Subscription* and *The Divot Diplomatic Incident* send players to witness locations across the connected streets; finishing both unlocks *The Broadcast of Absolutely Nothing*, a four-stop citywide finale. Players have to physically reach each interview location using the map, choose evidence-based responses, and can safely retry wrong leads. There are three fictional local case rewards.

Cases use **only their own versioned local key** `tweedleverse.worldmap.encounters.v1`. The prior map save, postcards, World Map tours, seven original game saves, Passport and Crossroads are not overwritten. Reset Street Cases and Reset World Map are separate confirmed actions. The rewards are local to the World Map and are not added to the existing canonical fifteen Passport stamps. See [v0.19 technical guide and browser QA](docs/STREET_ENCOUNTERS_V019.md).

## Enter the portal

The [Stemside portal](index.html) is a hand-built static site with an original illustrated city, working faux Spacealite channel surfing, a Wheel of Tweed, an interactive script page, and Tweedsie appearances. All code and vector art are local. **This is a playable web *experience*, not yet the open-world game.**

### Explore the streets

[Stemside Street Explorer](stemside.html) adds a clickable district map, 13 local landmarks, local information cards, surprise Tweedsie cameos, and a short three-stop Coffee Run story mission. This is an interactive map/story prototype, not an open-world game yet. See [Pages and Explorer guide](docs/PAGES_AND_EXPLORER.md) for the GitHub Pages setup and manual publish gate. The deployment workflow does not run unless the repository variable `ENABLE_TWEEDLEVERSE_PAGES=true` is set after enabling Pages.

### Play Stemside v0.3

[PLAY: Welcome to Stemside](play.html) is a **real playable top-down browser prototype** that shares [the city JSON](data/stemside-map.json) with the Street Explorer. Walk through the city using WASD/arrows, controller stick, or touch controls; interact with 13 named landmarks; complete the Coffee Run; practice a five-shot Tweedleball challenge and earn a Southside medal. Tweedsie may interrupt your visit. The game requires no accounts, libraries, build system or network beyond loading its own static assets. It is **not** a finished open-world game or full 3D environment. See [playable prototype notes](docs/PLAYABLE_V03.md).

### Inside the episode: v0.4

The [playable Stemside game](play.html) now has **three original storefront interiors** (CoffeeChucks, Lackluster Video, TweedCorp), authored NPC conversations, one-time Plot Points, and an actual **page-42 script rewrite**. Finish the Coffee Run and earn two Plot Points by talking in different interiors; then choose an alternate epilogue that changes your next destination and dialogue. Read [v0.4 interiors + script documentation](docs/PLAYABLE_V04.md).

### Corporate Confrontations: v0.5

The [playable Stemside game](play.html) now has **three original, optional turn-based comedy encounters**, inspired by the *general* feeling of discovering absurd situations while exploring a neighborhood. Visit **CoffeeCharles**, **Whole Moods**, or **Spacealite Tower**, and choose **CHALLENGE CORPORATE NONSENSE**. Your four silicon friends each contribute a distinct strategy: Chip recovers composure, Dank pushes through marketing, Bob shields against fees, and Terpenstein gambles on risky prototypes. Lose your composure and retry freely; win and earn a city dispute resolution. **After two unique wins, Tweedsie unlocks one surprise intervention per subsequent encounter.** A three-win title celebrates clearing the board.

All effects, illustrations and dialogue are original. The experience is a compact RPG *minigame*, not a complete role-playing title. [Read the v0.5 combat design and test plan](docs/PLAYABLE_V05.md). No external runtime assets, data collection or new dependencies.

### Your persistent RPG Passport: v0.6

[Welcome to Stemside](play.html) now includes a **13-souvenir collectible passport**, adventure journal, five fictional progress ranks, and **local browser saves**. Discover every unique business once to receive its original one-of-a-kind trinket. Quest stages, Page 42 choices, corporate victories, Tweedleball medal, location, and passport persist after a reload where browser storage is available. Saves never leave the browser, and gameplay remains playable if storage is unavailable. **RESET RUN + LOCAL SAVE** deliberately starts over (with a confirmation prompt). See [v0.6 documentation](docs/PLAYABLE_V06.md).

### Streets with actual residents: v0.7

**Stemside now has four original street residents** to approach and talk to: Marty, Buffer Bob, Chuck, and Lenny Smokins. They appear as animated original canvas characters. The game now includes an optional four-step side quest, **The Tape That Hasn't Happened Yet**: ask Marty about an unfilmed VHS, check Snublishers' prize mail, ask Buffer Bob to repair the paperwork, and return to Marty. Completion awards **Tomorrow's Film Credit** (a 14th *bonus* collectible, outside the 13-stamp passport) and 50 XP. Progress is included in the local browser save, with automatic migration of v0.6 saves and no loss of your existing coffee mission, Tweedleball medal, encounters, script rewrites, or collectibles. Read [v0.7 development notes](docs/PLAYABLE_V07.md).

### Lenny Smokins' original visual concert: v0.8

[Welcome to Stemside](play.html) now includes **The Gig That Almost Wasn't**, a five-step quest. Talk to Lenny, find his set list at Lackluster Video, recover the stage power adapter at Taco McBurger Bell, return to Lenny, and perform an **original eight-beat visual rhythm game** at the Southside Stems League arena. Score **9/16** to win Lenny's Gold-Plated Backstage Pass and a **one-time 60 XP** bonus. The challenge uses original visual cues with **no existing songs, melodies, sound samples, or remote music services**. A wider timing window improves accessibility. The same local save key now accepts **versions 1 and 2** and migrates them into v3 without losing earlier achievements. See [v0.8 design and QA](docs/PLAYABLE_V08.md).

### Quest Compass, City Radar & Save Vault: v0.9

[Welcome to Stemside](play.html) now includes a **live minimap**, a selectable quest compass to locate Coffee Run stops, Marty, Lenny, corporate disputes, Page 42 or missing passport stamps, and a privacy-first **Portable Save Vault**. You can download a fully validated game save as a JSON file and import it into another browser with a confirmation. Older raw v1/v2 saves still migrate through the existing decoder; invalid or oversized files are safely refused. All game and quest features from v0.8 remain available. No GPS, remote map or upload service is used. See the [v0.9 guide](docs/PLAYABLE_V09.md).

### Episode One finale: v0.10

[Welcome to Stemside](play.html) now has a first authored **playable episode finale, The Great Billing Reversal**. Finish the Coffee Run and win a corporate dispute to unlock an investigation with Buffer Bob, Lackluster Video and Spacealite Tower. At Reggie's office, file three pieces of evidence in order and **choose one of two endings**: refund South Stemside or free the public broadcast. One ending permanently records in the local save, adds the Interdimensional Fee Waiver and grants **120 XP** once. Existing v1–v3 saves safely migrate to the v4 game schema, and portable save export/import still works. No new dependencies or remote services. Full mechanics and QA: [docs/PLAYABLE_V010.md](docs/PLAYABLE_V010.md).

### Living Finale Consequences: v0.11

The playable [Stemside RPG](play.html) now **changes after Episode One**, based on your saved ending. **Refund the Whole Town** recolors local districts, gives at least eight businesses and four residents new reactions, creates a post-refund news board and grants a **12-point Receipt Shield** when starting future corporate disputes. **Free the Public Signal** gives the city a separate Channel Zero visual theme, new dialogues and a different public news feed, while unlocking **one Tweedsie intervention per new corporate encounter**. Completed v0.10 saves take effect automatically with **no new save format or reset**. See [v0.11 guide](docs/PLAYABLE_V011.md).

### Development bibles

- [World and canon](docs/WORLD_BIBLE.md)
- [Characters and relationships](docs/CHARACTERS.md)
- [Winnie Kodak III and the forgotten TVPD darkroom (future lore/quest concept)](docs/WINNIE_KODAK_III.md)
- [Merv and *The Last Exposure*: stranded camera-ship and portal-photo lore (development concept)](docs/MERV_THE_LAST_EXPOSURE.md)
- [Practical Smokers series, skits, and season arc](docs/SHOW_BIBLE.md)
- [Tweedleball and the TGA tournament](docs/TWEEDLEBALL.md)
- [Welcome to Stemside game concept](docs/GAME_DESIGN.md)
- [Production standards and rights](docs/PRODUCTION.md)
- [Structured seed canon](data/canon.json)

### Try the portal locally

Run `python -m http.server 8000` from the repository folder and open `http://localhost:8000`. The website has no runtime dependency on any remote font, image or API. Run `npm test` with Node 22+ to validate the lore data and static entrypoint.

GitHub Pages hosting can be configured **after** the portal PR is merged; deployment is not claimed to be live yet.

## Welcome to Stemside

A sprawling, unequal retro-futuristic factory town inhabited by fictional *silicon people*. On the south side: scrappy residents, ridiculous businesses, actual community, and **Reggie's Reggie: “Cheap in a Pinch!”** On the north side: luxury shops, snobbery, fancy coffee, and the **North Stemside Invitational**. Both sides suffer under the same corporate absurdity.

### World anchors

| Anchor | Premise |
| --- | --- |
| **TweedCorp Co. (TCC)** | Dysfunctional botanical corporation employing four spectacularly unqualified friends. |
| **Tweed** | Fictional silicon-world botanical product; mock taxonomy: *Tweedimus Silativa* and *Tweedimus Indicone*. Grades: **Reggie / Mids / Loud**. |
| **Spacealite™** | Interdimensional television monopoly: “You Have Infinite Choices. None Are Included.” |
| **Reggie Bands III** | Reginald Von Bandwidth III, the easily enraged Spacealite executive; “Seeds McStems” to his enemies. |
| **Tweedsie** | Super-chill gopher trickster, dreadlocks, sunglasses, gold chain with a Tweed-leaf pendant, big fictional spliff; knows the fourth wall is negotiable. |
| **Tweedleball / TGA Pro Tour** | Hybrid obstacle-gauntlet target sport, with a Southside Stems League and wealthy Northside championship. |
| **Lenny Smokins** | Fictional retro-rock musician behind the proposed ORIGINAL song “I'm Real High.” |

### Landmarks

**South Stemside:** CoffeeChucks (“It's Coffee, Chuck. Drink It.”), Lackluster Video (“Be Kind. Rewind. Whatever.”), Taco McBurger Bell, Snublishers Clearing House, Reggie's Reggie, Stems League arena.

**North Stemside:** CoffeeCharles (“For the Distinguished Caffeinated”), Whole Moods, Le Biestro and other Biestros, Royal Tweedleball Club, North Stemside Invitational, opulent Spacealite properties.

### Signature storytelling rule

The characters treat absurd events sincerely. The show routinely breaks the fourth wall **and the fifth wall**: characters pull out their episode scripts, argue with the production crew and narrator, enter commercials, and dispute Spacealite's licensing fees. **Tweedsie** is the calmest person in every chaotic room.

The first major season arc follows a reluctant TweedCorp worker who wins the local Southside Stems League and qualifies for the despised North Stemside Invitational, hoping only to claim a year's free CoffeeChucks.

## Production directions

1. **World bible and canonical records:** characters, companies, places, relationships, vocabulary, running gags.
2. **Practical Smokers:** original scripts, animated sketches, faux commercials, characters with consistent comedic motivations.
3. **TGA Pro Tour:** playable Tweedleball rules prototype and game-show inspired courses.
4. **Welcome to Stemside:** an explorable game with crossovers and an *episode-script* mechanic.
5. **Spacealite:** an in-world channel-surfing hub for original micro-shows, faux commercials and shorts.
6. **Backyard Production Company → REEL Commons:** potential production and distribution integrations, not dependencies for the first prototype.

**Originality / rights:** This is a distinct fictional world. Comedic touchstones inform energy, not copyable characters, scenes, branding, lyrics, audio, or visual designs. All songs and assets should be original or properly licensed. This is satire and fictional entertainment, not a real cannabis-product brand or consumption instruction.

**Status:** v0.1 foundation. Some details (especially four lead character names and Tweedleball rules) remain proposals, not finalized canon.

© 2026 Michael Wave / PHI369 Labs. License to be selected deliberately; no third-party copyrighted materials included.
