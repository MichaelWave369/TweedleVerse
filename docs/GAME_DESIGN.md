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

## Roadmap

**v0.1** world bible + world portal; **v0.2** one playable Tweedleball prototype; **v0.3** South Stemside explorable block; **v0.4** 15-minute scripted vertical slice; **v0.5** Spacealite channels and Tweedsie; **v0.6** North Stemside tournament extension; subsequent builds driven by tests and real feedback.
