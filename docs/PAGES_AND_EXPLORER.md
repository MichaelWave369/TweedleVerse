# Stemside Street Explorer & GitHub Pages

## Explorer v0.2

The route `stemside.html` contains a map of thirteen spots across North and South Stemside. Select a map marker or directory listing for a short original in-world vignette. Filter by district, trigger Tweedsie every fifth location interaction, and play the simple three-step **Coffee Run** quest:

1. Visit CoffeeChucks.
2. Go to the Southside Stems League arena to redeem a coffee promo.
3. Return to TweedCorp Co. with a surprise tournament obligation instead.

This is a *fictional clickable neighborhood map*, not yet an explorable 3D game. The main portal in `index.html` links to the map.

Map content lives in `data/stemside-map.json`, deliberately separate from layout and interaction code to help future game integrations. Canonical anchors are also in `data/canon.json` and `docs/WORLD_BIBLE.md`; changes should update both when relevant.

## Local preview

From repository root:
```sh
python -m http.server 8000
```
Open `http://localhost:8000/` or `http://localhost:8000/stemside.html`.

No build step or third-party runtime dependencies required. Opening the HTML as a `file://` path may block JSON loading; use a local server.

## GitHub Pages: intentionally opt in

The new `.github/workflows/pages.yml` validates on `main` but **skips deployment by default** so merging does not cause a red deployment check before Pages is configured.

After merging:

1. Open GitHub repository **Settings → Pages**. Under **Build and deployment**, select **GitHub Actions** as source. Ensure the Pages site is enabled for this repository.
2. Open **Settings → Secrets and variables → Actions → Variables → New repository variable**. Set **Name** `ENABLE_TWEEDLEVERSE_PAGES` and **Value** `true`.
3. Open **Actions → TweedleVerse Pages → Run workflow** (branch `main`). Confirm the `verify` and `deploy` jobs succeed.
4. Use the **published URL provided by the deployment job**, rather than assuming a site is live because tests passed.

The publish artifact intentionally contains only `index.html`, `stemside.html`, `assets/` and `data/`; no `.git` or private project metadata is deployed. It uses relative URLs suitable for project Pages and custom domains.

To stop publication, set `ENABLE_TWEEDLEVERSE_PAGES` to `false` or remove it. This skips future deploy jobs, but **does not automatically unpublish an existing site**; remove/disable GitHub Pages separately if necessary.

## Next upgrade ideas

- Use SVG paths / accessible semantic buttons to turn districts into walkable streets.
- Build a physically playable Tweedleball vertical slice with keyboard/controller and accessible practice mode.
- Connect location visits with original NPC dialogue and a journal.
- Add a save system with transparent local-only data handling.
- Create character art and proper music assets under reviewed licenses.
