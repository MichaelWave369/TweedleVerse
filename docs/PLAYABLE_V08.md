# Stemside v0.8 | Lenny Smokins' First Concert

**Status:** Browser-game vertical slice, original authored fiction and a visual-only rhythm challenge.

## The gig that almost wasn't

Lenny Smokins is finally playable as a quest-giver rather than only a street cameo. The optional side quest is independent of the Coffee Run and Marty VHS mystery.

1. **Talk to Lenny** near the Southside arena. He lost tomorrow's set list and the amplifier adapter.
2. Visit **Lackluster Video** and use storefront **Interact** to retrieve the set list from a suspicious future VHS.
3. Visit **Taco McBurger Bell** and interact to recover the amplifier adapter, which the staff were using for a milkshake machine.
4. Return to **Lenny**, who authorizes rehearsal.
5. At **Southside Stems League Arena**, use **PLAY LENNY'S GIG** to enter an original eight-beat performance challenge.

The existing TGA/Tweedleball Interact action remains independent, so the arena supports both minigames without hijacking the original story.

## Playable eight-beat timing challenge

- The concert runs without audio, third-party music, or copyrighted song excerpts.
- A visual count-in of three seconds precedes **eight beats**, spaced 0.9 seconds apart.
- Press **Space** or click/tap **TAP ON BEAT** as each cue reaches its target.
- A perfect beat earns 2 points; a near-hit earns 1, for a maximum of 16.
- Earn **9 points** or more to save the gig. Misses can be retried freely, and completed performances can be replayed as encores without duplicate rewards.
- **Wider timing window** allows more forgiving note windows for players who find fast timing difficult. It is enabled automatically for reduced-motion users.
- The result includes the **Gold-Plated Backstage Pass** and a once-only **60 XP** award, plus an adventure-journal entry.

Performance calculations are deterministic and testable. No audio synthesis, autoplay, remote sound library, gambling, paid purchases, or real cannabis mechanics are added. The visual stage is a CSS-drawn original comic illustration.

## Persistence and old player saves

We now store a validated `gigQuest` stage from 0 to 5 alongside the existing hero position, Coffee Run, Marty quest, Page 42 branching, passport, TGA medal and corporate victories. The save format advances **v2 to v3**, while the existing local storage key `tweedleverse.stemside.save.v1` remains unchanged. The decoder accepts v1 and v2 records and migrates them to v3, defaulting the new quest to stage 0. Unknown versions are rejected without overwriting valid data.

In-progress notes and an open stage modal are deliberately **not saved**. Reloading resumes city exploration with the gig quest in its prior completed/uncompleted state. Reset Run clears concert progress only when the user confirms the full adventure reset.

## How to QA

Run `npm run check` (Node 22+), then serve the site locally with `python -m http.server 8000` and open [play.html](../play.html).

- Confirm existing v0.6 and v0.7 local saves load and remain intact.
- Talk to Lenny, visit Lackluster, visit Taco McBurger Bell, talk to Lenny again.
- Verify **PLAY LENNY'S GIG** is enabled only at the Southside arena after those steps.
- Start the stage: a 3-second countdown and 8 original visual beats should appear.
- Test timing, wide-window accessibility, an unsuccessful set, retry, and a score of at least 9.
- Confirm the Gold-Plated Backstage Pass is awarded once, with 60 XP, and survives reload.
- Verify a subsequent encore does not duplicate XP; confirm the original TGA game still launches.
- Check reduced-motion, mobile touch, keyboard Space, gamepad A, and Escape-to-close.
- Confirm Coffee Run, Marty mystery, shop dialogue, corporate disputes, Page 42 edits and the 13-location passport are unchanged.

## Design boundary

This is not yet a complete rhythm-music game. It is an **original, silent visual rhythm minigame**, designed as a platform for future *newly composed* in-universe Lenny songs and concert staging. Future original audio would require deliberate licensing, mute controls, platform playback handling, and accessible visual equivalents.
