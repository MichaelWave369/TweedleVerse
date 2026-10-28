# Production, contribution & rights guide

## A shared sandbox for original IP

TweedleVerse is a connected fictional universe. It may eventually have series episodes, shorts, interactive shops, games, virtual sporting events, fake ads and songs. Every release should reuse the approved world bible while maintaining its own implementation and quality gate.

## Production workflow

1. Record a **pitch** as a scene / gag / location / character change.
2. Tag pitch as **proposed**; protect the original idea without accidentally canonizing a draft.
3. Write a short script, character beat or game mission.
4. Perform a continuity check against WORLD_BIBLE, CHARACTERS and SHOW_BIBLE.
5. Produce original designs / voices / music with a traceable asset manifest.
6. Review pacing, accessibility, performance, rights and tone.
7. Promote to canon only after explicit approval.

## Original asset and music policy

- Do **not** include screenshots, likenesses, ripped game assets, brand logos, copyrighted dialogue, lyrics, melodies or samples of third-party film/show/game/song references without necessary rights.
- Lenny Smokins and “I'm Real High” need original composition, lyrics and master recordings; “80s triumph rock” is broad direction, not permission to reproduce a specific hit.
- Parody business names are in-universe placeholders. Distinctive original visual designs and separate trademark review should precede merchandising or external commercialization.
- A draft portrait or AI-assisted design must be reviewed for originality, consistent character identity and permitted use before inclusion.
- No automatic training on contributors' content. Document provenance when bringing in generated materials.

## Repo and public IP decisions

This seed repo deliberately **does not yet publish an open-source LICENSE** for all story content. Code and creative intellectual property may ultimately need different permissions. Decide explicitly which software components get MIT or another license, and how fictional characters, narratives, logos and recordings are treated. Until then do not assume free reuse rights from public visibility.

## Suggested future repo structure

- docs/ : living canon + production and design notes
- data/ : structured places, businesses, characters, timeline
- site/ or static root : in-universe portal
- game/ : optional playable prototypes, split by engine as needed
- shows/ : episode beats, scripts, storyboards, shot lists
- audio/ : music/voice metadata, with original or licensed source files
- tests/ : tests for builds, data, links and accessibility

## Minimum approval gates for next iterations

- Automated smoke tests green.
- No outside network calls for a locally served static portal.
- Responsive mobile/desktop layout, keyboard access, readable contrast and reduced-motion support.
- One story-bible change per lore-changing feature; no accidental drift across show/game.
- Keep work reviewable in PRs and preserve the original canon drafts.
