# Welcome to Stemside v0.7 | Living Streets & The Missing Tomorrow Tape

## What changed

The existing playable Stemside retains the Coffee Run, three shop interiors and Plot Points, Page 42 branching, three satirical corporate encounters, Tweedleball, the thirteen-stop souvenir passport, and the manual/autosave systems.

Version **0.7** adds **four outdoor residents**, represented as simple original animated silicon sprites drawn with Canvas. Residents are real interaction targets, not decorative text: the game checks proximity to their world coordinates, enables **TALK TO RESIDENT**, delivers authored dialogue, and optionally progresses an independent mission.

| NPC | Where to find them | What they say |
| --- | --- | --- |
| Marty, Rewind Technician | Near Lackluster Video (south-east) | A movie from tomorrow is mysteriously overdue |
| Buffer Bob, Compliance | Outside TweedCorp Co. | Everything requires a form, including the form |
| Chuck, CoffeeChucks | Near CoffeeChucks | Even the price of saying “coffee” has increased |
| Lenny Smokins | By the Southside Stems League | The record label wants to monetize every solo |

Outdoor residents drift subtly inside safe local areas; **reduced-motion preferences freeze that movement**. These are **simple outdoor dialogue NPCs**, not autonomous pathfinding agents, and their conversations do not send text to any external service.

## Optional four-step side quest: “The Tape That Hasn't Happened Yet”

1. Talk to **Marty** beside Lackluster Video. He reveals that Snublishers mistakenly mailed a movie that has not yet been filmed.
2. Go to **Snublishers Clearing House** and use the existing **Interact** action to claim the strange misdirected mailing.
3. Talk to **Buffer Bob** outside TweedCorp to get a bureaucratically correct delivery label, addressed to yesterday.
4. Return to **Marty** for the punchline and the unique **Tomorrow's Film Credit** souvenir.

The bonus souvenir is distinct from the **13 canonical place stamps**, so the original passport and completion milestones remain unchanged. The mystery also awards **50 XP once**, and displays in the adventure journal after completion. Steps have explicit order and cannot be skipped or farmed by repeating dialogue.

## Input and on-screen feedback

- Existing WASD/arrow keys, gamepad left stick, and mobile touch D-pad move the avatar.
- **T** or the on-screen **Talk to Resident** button talks to a nearby resident; gamepad **B** is also mapped to Talk.
- **E**, **Enter**, or gamepad **A** preserves storefront Interact and quest/Tweedleball behavior.
- A nearby resident displays a canvas label and is announced in the game's existing live on-screen location hint.
- A second quest card in the sidebar lists the mystery's current objective. Visit the original adventure journal to see clue and completion records.

## Backward-compatible persistence

The JSON format is bumped from version **1 → 2** while retaining the existing localStorage key `tweedleverse.stemside.save.v1` to avoid leaving the user's data behind. Reading a version-1 save restores all previously recorded player position, Coffee Run, script state, victories, passport stamps, medal, and other information; the new `tapeQuest` field defaults to step zero. The next save writes version 2 under that same key.

New saves validate the stage against the 0–4 quest range. Unknown or malformed saves are rejected safely. **No accounts, telemetry, cloud uploads or server-side session storage** have been added.

As before, completed milestones are saved automatically, movement is saved periodically, and you can explicitly save. Reset Run deliberately overwrites the existing local slot after confirmation. Clearing browser site data, changing browsers or using private mode can remove or isolate the save.

## Test plan

Run `npm run check` using Node 22+.

1. Open [play.html](../play.html) through a local server or deployed Pages URL.
2. Find Marty near Lackluster Video. Press **T**; confirm the new side quest goes from step 1 to step 2.
3. At Snublishers, press **E**; confirm step 3.
4. Speak to Buffer Bob near TweedCorp; confirm step 4.
5. Return to Marty and earn **Tomorrow's Film Credit**, plus 50 XP. Talk again; ensure no second reward.
6. Save and reload; confirm the entire mystery persists, including its journal entry, while all earlier progress remains.
7. Load a legacy version-1 save; check that its old achievements remain, and the mystery begins at step one.
8. Test keyboard, mouse/touch, gamepad B, and reduced-motion preferences.
9. Verify earlier Coffee Run, Tweedleball, Page 42 rewrite, corporate encounters, and the 13-location passport still operate.

## Limitations

The residents currently remain near fixed locations, with gentle cosmetic wandering. Dialogues are static and the mystery has one authored resolution. This is a **compact RPG neighborhood slice**, not yet a complete animated open-world adventure. Future expansions could bring full walking NPC schedules, adaptive story arcs, custom pixel-sprite sheets, more quest branches, optional save export/import, and a unified playable show universe.
