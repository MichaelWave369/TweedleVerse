# Welcome to Stemside | Game concept v0.1

**A standalone game in the TweedleVerse, not a claim that a game already exists.**

## First playable slice (v0.3)

[play.html](../play.html) now implements a small top-down walking prototype with visitable location markers, controller/keyboard/touch input, dialogue stubs, Coffee Run story progression, an interactive five-shot timing/power Tweedleball practice game, and an occasional Tweedsie cameo. The browser build uses the shared [Stemside map JSON](../data/stemside-map.json) and has automated tests. It is not yet a fully interactive 3D environment, and shops do not have interior scenes. Further features below remain design direction, not delivered behavior.

## Script-rewrite branch v0.4

The game now includes three story interiors, dialogue options, Plot Points, and a deterministic two-choice rewrite system. Finishing the Coffee Run and talking to two distinct interior residents allows the player to edit Page 42, changing the next objective to CoffeeChucks or Spacealite Tower and triggering a distinct ending. See [v0.4 notes](PLAYABLE_V04.md). This is authored branching narrative, not unconstrained generative dialogue.

## Original encounter system (v0.5)

Three of the existing businesses have opt-in, turn-based **corporate dispute encounters**, with distinct nonviolent enemy meters, four party abilities, repeatable wins/losses, and a limited Tweedsie assist unlocked by two unique wins. This supplements rather than replacing the walkable world, Coffee Run, authored dialogue and Tweedleball. Details and mechanics: [PLAYABLE_V05](PLAYABLE_V05.md). This is an original satirical RPG experiment, not a reproduction of any existing game's characters, art, music, scripts or UI.

## RPG progression, passport, and local saves (v0.6)

The playable game now tracks first visits to every one of Stemside's thirteen business landmarks, awards one original souvenir per unique landmark, computes fictional rank from existing achievements, displays a journal of coffee, Page 42, arena, and corporate events, and restores verified local browser saves. The collection is an authored feedback loop, not a physical-world product purchase. See [PLAYABLE_V06](PLAYABLE_V06.md).

## Living streets and a second authored quest (v0.7)

Four silicon residents stand or drift subtly around original Stemside locations and can be spoken to without entering a storefront. Marty, Buffer Bob, Chuck and Lenny have their own small dialogue and positions, and the optional four-stage Missing Tomorrow Tape quest yields a unique bonus collectible and 50 XP. Local save data migrates from v0.6 to v0.7 without wiping progress. See [PLAYABLE_V07](PLAYABLE_V07.md).

## Live-stage visual rhythm quest (v0.8)

The new **Gig That Almost Wasn't** mission uses four city interactions and an eight-beat original, silent timing minigame to complete Lenny Smokins' gig at the Southside Stems League arena. A score of 9 or more out of 16 grants a Gold-Plated Backstage Pass and one-time 60 XP. A wider timing option is provided, and no recording, melody or licensed music is included. Save format v3 migrates versions 1 and 2. See [PLAYABLE_V08](PLAYABLE_V08.md).

## RPG wayfinding & save portability (v0.9)

The walkable city now has an internal mini-radar, selectable quest/objective routing, and explicit map-unit compass directions derived from canonical game coordinates. Its local-first save can be exported to a self-contained validated JSON file and imported into another browser only after explicit overwrite confirmation. There are no external map APIs or cloud sync. See [PLAYABLE_V09](PLAYABLE_V09.md).

## Episode One: The Great Billing Reversal (v0.10)

The first optional, authored story finale brings together existing Coffee Run and corporate encounter progress. An eligible player investigates the billing system with Buffer Bob, follows a clue to Lackluster Video, and audits three ordered evidence items at Spacealite Tower. Players select either a town refund or a public-channel victory, with different dialogue, one permanent ending, a collectible Fee Waiver and 120 XP. The system adds a dedicated quest compass target, persistent progression and v1–v3 save migration. See [PLAYABLE_V010](PLAYABLE_V010.md). The story fork currently affects authored ending content, not the broader city map.

## Living aftermath of the Billing Reversal (v0.11)

The two persistent v0.10 finale outcomes now affect recurring shops, four outdoor residents, district visuals, news broadcasts, and corporate battle mechanics. Refund grants an initial 12-point shield, while freeing the public signal opens a one-use Tweedsie interruption in future disputes. These changes derive entirely from the existing validated save-state ending and require no additional accounts, services, save fields or server work. See [PLAYABLE_V011](PLAYABLE_V011.md). This is authored post-credits reactivity, not autonomous simulated townsfolk.

## Elevator pitch

An original single-player, optionally cooperative open-world comedy adventure where the player works at TweedCorp, explores North and South Stemside, competes on the Tweedleball circuit, watches Spacealite's terrible television, and sometimes edits the episode script to change a mission.

## The playable loop

**Explore → meet someone → accept an absurdly mundane problem → make the problem worse → solve it through ingenuity or slapstick → unlock a location, encounter, scene, or Tweedsie cameo.**

Player goals include staying employed, finding ways to afford coffee, getting friends out of trouble, and advancing the Southside Stems League. No real-world substance use is a victory condition.

## Five core systems

1. **Small living neighborhood.** Hand-authored streets with recognizable store facades, interiors, transit and residents. Environmental jokes reward attention.
2. **Episode Script inventory.** A finite “Plot Points” resource offers branching rewritten goals. Each script change has an intended response and consequence, not unlimited unmoderated text generation.
3. **Tweedleball.** Progressive court / gauntlet encounters tied to the season's underdog story.
4. **Spacealite channel surf.** Original short skits and faux commercials play on in-world televisions; some reveal secrets or quests.
5. **Tweedsie sightings.** Optional playful discovery events, in cutscenes, pause menus, venue windows, and credits. Never invasive or irreversible.

## Vertical slice: South Stemside

Proposed first locations: TweedCorp entrance and QA floor; CoffeeChucks; Lackluster Video; Taco McBurger Bell; Reggie's Reggie; small Stems League practice court. Start with one contiguous walkable block, four NPCs, one coherent mission, one working Tweedleball challenge, one meaningful script-edit choice, one Spacealite commercial and one Tweedsie cameo.

### First mission: “Late Again”
Chip is late to TweedCorp. The script forecasts “arrives late and gets fired.” Player earns a limited rewrite: “gets assigned to qualify for the Southside match.” A supposedly easier escape route becomes an outrageous training commitment.

### Content pipeline

Maintain characters and locations in readable data files; separate story from engine. Build original low-poly/2D-friendly assets that also serve animation, web and future VR. Treat voice and music as optional modules, never hard dependencies.

## Tech direction (candidate)

- **Web-first** 2D/isometric or low-poly 3D with keyboard, controller and touch support; choose actual rendering tech after a performance spike.
- **Offline-first:** static deployable build, no compulsory telemetry, no external CDN or licensed remote assets.
- **PhiCade / PixelForge / Backyard Production Company / REEL Commons / PhiOS XR:** possible integration points, not assumed APIs.
- **VR phase:** after accessible flat-screen play works well; comfort modes, teleport, seated play, lower motion intensity.

## Game design boundaries

Avoid making the game a clone of existing licensed titles. References are tonal. Don't copy music, recognizable character silhouettes, dialogue, branding or game assets. Give players clear controls and stable objectives even when the story gleefully contradicts itself.

## Proposed side game: Where's Tweedsie? [NOT IMPLEMENTED]

A standalone original **hidden-scene adventure** where players find Tweedsie and optional visual jokes inside detailed illustrated Stemside panoramas. A TVPD crime scene, South Stemside crowd, Grand Stem tournament, and Winnie's forgotten darkroom are candidate locations. Merv's rare dimensional photo media may support an **optional nested portal scene**, without supplying infinite blanks or retroactively solving *The Last Exposure*.

Design priorities: a distinctive original visual style, accessible keyboard/touch/zoom controls, a fair hint ladder, non-flashing camera gags, offline-first progress in an isolated save, and no changes to the existing Passport and game save ledgers. No playable page or integration is claimed. Full design, proposal-only scene list and first-rung criteria: [Where's Tweedsie?](WHERES_TWEEDSIE.md).

The game's recurring background-walker premise is also proposed for the separate [Tweedle 420 mockumentary](TWEEDLE_420.md).

## Roadmap

**v0.1** world bible + world portal; **v0.2** one playable Tweedleball prototype; **v0.3** South Stemside explorable block; **v0.4** 15-minute scripted vertical slice; **v0.5** Spacealite channels and Tweedsie; **v0.6** North Stemside tournament extension; subsequent builds driven by tests and real feedback.
