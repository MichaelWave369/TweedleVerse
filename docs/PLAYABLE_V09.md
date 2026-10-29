# Stemside v0.9 | Quest Compass, City Radar, Portable Save Vault

**Status:** first navigational quality-of-life update for the existing playable 2D RPG. No new backend, external library, location tracking, or real-world routes.

## Quest compass

In the main game panel choose a **Follow Quest** destination:
- **Next Story Objective** automatically prioritizes incomplete Coffee Run, Marty’s tape, Lenny's gig, Page 42, corporate disputes, then passport stamps.
- Choose any specific story to track it independently.
- **Free Exploration** turns off directions while keeping the interactive city and minimap accessible.

The status strip shows a **straight-line direction and distance in fictional map units**, never real-world travel time. Waypoints use the same canonical city JSON and resident coordinates as the game itself. If an objective is completed, the strip tells you the selected track has no remaining outdoor destination. Script choices that are ready inside the sidebar do not invent a fictitious physical waypoint.

### Minimap

The small live radar displays North Stemside above South Stemside, existing 13 shop markers, outdoor resident dots, the player, and a diamond marker for your current goal. It updates as the player moves and changes focus. **HIDE MINIMAP** removes the visual; **SHOW MINIMAP** restores it. This is a deterministic internal map, not a connection to Google Maps, GPS, or device location. The overlay uses no extra network requests and is designed for both desktop and narrow screens.

## Portable save files

The v0.8 local save worked but did not travel between browsers. The **Portable Save Vault**, beneath the in-game passport, adds:
- **DOWNLOAD SAVE FILE**: generates a self-contained JSON file from current validated adventure state.
- **IMPORT A TWEEDLEVERSE JSON SAVE**: accepts a local JSON save after validation and explicit replacement confirmation.
- File inputs are read in the browser only. The process does not upload save contents, ask for accounts, or call a third-party service.

The file envelope identifies itself as `tweedleverse.stemside.portable`, schema `1`, with a validated v3 game save inside. Imports also support **raw v1, v2 or v3** game saves, allowing older adventures to migrate through the existing versioned decoder. Unknown formats, foreign JSON, corrupt data, or files larger than 64 KiB are refused without replacing the current save. All imported location and progress fields pass the normal allowlist and coordinate bounds before storage.

**Important:** import only overwrites the current device's game after the browser confirms. Export first if the present local save matters; there is no undo. A successful import reloads the game. Importing or exporting while browser storage is unavailable must not silently claim success. Exporting is a manual copy, not automatic synchronization between devices.

## No changes to game progression

The Coffee Run, three shop interiors, Page 42 rewrites, corporate encounters, Marty VHS story, Lenny's visual concert, original Tweedleball, 13-stamp passport and both bonus souvenirs remain in place. This version does **not** introduce any new game progress fields or change the underlying save-version number.

## Testing

Node 22+:
```sh
npm run check
```

In a browser, load `play.html` from the Pages URL or serve locally using `python -m http.server 8000`, then:

1. Change **Follow Quest** from Auto to Marty, Lenny, Corporates, and Free. The goal name, straight-line distance and highlighted diamond should update appropriately.
2. Walk to a waypoint and confirm the compass switches to **You've arrived**, without auto-completing the objective.
3. Hide/reveal the minimap on both desktop and phone widths. The main canvas should continue to accept keyboard, controller and touch input.
4. Download a save, inspect its `format`, `schema`, and `save` fields. No credentials or browser settings should be included.
5. Import the save into a different browser/device. Check all prior quests, progress, stamps, rank and position are recovered.
6. Try to import a malformed/foreign JSON file. Ensure it is refused and the current adventure stays unchanged.
7. Try a valid save, cancel confirmation, and confirm the existing local adventure still remains.
8. Play a Tweedleball round, complete Marty/Lenny steps, and redo the route to check no regressions.

Tests in `tests/travel.test.mjs` verify canonical quest targets, the compass and map geometry, migration for previous save formats, rejection of hostile inputs, and UI/CI integration. CI passing does not replace the browser-specific tests above.

## Remaining caveats

The compass uses **straight-line direction**, not pathfinding, so it may point through fictional buildings. It is a simple waypoint aid, not a fully walkable or traffic-aware navigation system. The save-file vault offers manual export/import rather than cloud sync or multiplayer. These are intentional privacy and scope choices.
