# Welcome to Stemside v0.3 | Playable Browser Prototype

## The build

The [Play Stemside](../play.html) page extends the original [clickable map](../stemside.html) into a top-down browser experience. It is not a finished open world or a shipped standalone game. The browser runs plain HTML/CSS/JavaScript with a canvas renderer and an independently testable game core. All scene and UI assets are local. The game fetches the existing **data/stemside-map.json** and visualizes all thirteen landmarks.

### Controls

| Input | Walk | Interact |
| --- | --- | --- |
| Keyboard | WASD or arrow keys | E or Enter when near a business |
| Controller | Left stick | A button (Gamepad API) |
| Touch / pointer | On-screen direction pad | On-screen Interact button |

The gameplay window scrolls across two contrasting districts, includes the shared coffee errands, and uses short original business dialogue stubs. Movement speed is normalized for diagonals. The game stays inside the world bounds and pauses navigation while an interaction overlay is open.

### The Coffee Run

1. Visit CoffeeChucks for a supposedly free drink.
2. Visit the Southside Stems League and get entered in the championship system instead.
3. Return to TweedCorp Co. with the unwanted new obligation.

Completion updates the mission HUD. Reset Run resets the character position, quest and medal. Progress currently lives only in the page session. It **does not save, upload or track player data**.

### Tweedleball

At the **Southside Stems League** landmark, pressing Interact opens a real playable **five-shot** timing/power practice mode.

- A target travels horizontally. You always aim along the stationary center reticle.
- Hold and release Space to charge/fire, or use the accessible button's **Start Charging / Fire Now** toggle.
- Score 3 points for a bullseye when both timing and launch power are precise; 1 for a near hit; otherwise 0.
- Reach **6+ points after five attempts** to earn the Southside Medal.
- The **Steady target** checkbox removes target motion to make the task easier. It starts checked for users with reduced-motion preferences.
- Close and reopen the arena to retry.

This minigame is an original and deliberately modest first playable proof, **not the full physical gauntlet** envisioned for the TGA Pro Tour.

### Tweedsie

After every fifth business interaction outside the arena, Tweedsie appears in a dismissible cameo. Escape closes overlays, modal focus stays inside them, and interact controls are disabled while overlays are open.

## Offline and deployment

With the project files present, start a static local server:

```sh
python -m http.server 8000
```

Visit `http://localhost:8000/play.html`. It also deploys to the existing GitHub Pages site because the Pages artifact was updated to include **play.html** along with the `assets/` and `data/` directories.

The original [main portal](../index.html) and [city directory](../stemside.html) both link to the game. No external runtime scripts, fonts, textures or accounts are required. Opening it directly as `file://` may prevent JSON loading because browsers restrict file fetches.

## Tests and remaining work

`npm test` executes logic and wiring checks, including core movement, map proximity, ordered quest transitions, scoring thresholds, accessibility markup and relative asset links. `node --check` verifies script syntax. CI passing does not replace real device and browser QA.

Next vertical-slice priorities: character animation / collision, interiors with original characters and dialogues, Tweedleball obstacle movement and gamepad shooting support, controller rebinding, pause/resume, accessible minimap, optional local saves, and original sound/voice assets.

## Originality and safety

The game contains original fiction and silicon characters, not covert recordings or real cannabis sales. It does not require substance consumption. Third-party comedy references are tone inspirations only, not source assets, dialogue or songs.
