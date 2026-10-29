# Stemside v0.11 | A Living Town After the Finale

**Episode One's consequences are now visible and playable throughout the existing world.** This is an authored, single-player update, not an AI-driven simulation of NPCs or a new game engine.

## Why it matters

In v0.10, the player could complete The Great Billing Reversal and choose one of two endings. Previously the choice produced unique final dialogue and a saved record. In v0.11, those choices change what the **player sees, hears (as text), and can do** in the town after the credits.

### If you chose Refund the Whole Town

- The city adopts warmer, post-refund district colors. Northside Crossing's surcharge signage changes, and a new street billboard celebrates the reimbursement.
- At least eight businesses and all four street residents have **authored post-finale dialogue** about the refund and Reggie's defeat. These are new interactions, not just a journal entry.
- The city news board lists an original post-refund headline, ticker and three regional reports.
- **Receipt Shield:** every newly started corporate confrontation (and each retry) begins with **12 shield**, automatically absorbing part of a future bureaucratic retaliation. Other encounter stats, achievement logic, and score thresholds remain unchanged.

### If you chose Free the Public Signal

- The districts take on a different civic-broadcast palette, with a **Channel Zero** street billboard and changed Northside signage.
- Shops and street residents react to the newly public broadcast with an entirely different bank of authored dialogue.
- The town news board becomes a distinct local TV feed with original regional reports and new on-air headlines.
- **Community Signal:** Tweedsie's one-use intervention is available in subsequent corporate disputes **even if fewer than two bosses have been defeated**. It still works **only once per encounter**. Players who already unlocked Tweedsie retain their existing entitlement.

### Before the finale

The original corporate news board remains in control, all original dialogues work, district colors remain unchanged, and existing combat behavior continues.

## How this integrates with the previous game

- **No save migration necessary.** The existing validated v4 save stores the finale ending. v0.11 derives all consequences from that saved state and does not add a separate story flag or duplicate achievement.
- Reloading a previous completed save, or importing it using the existing Portable Save Vault, immediately restores the correct aftermath on the next page load.
- The news panel is local and static; no television streaming, tracking, network feeds or advertisements have been introduced.
- Completing the v0.10 finale updates the city broadcast immediately, not only on reload. Resetting the game returns the town to its pre-finale state after the existing confirmation prompt.
- Existing quests (Coffee Run, Marty, Lenny, Page 42, Tweedleball), 13-stamp passport, 2 bonus items, core battle outcomes, local saves and accessible input paths remain supported.

## Architecture

- New pure module: `assets/consequence-core.mjs` holds two alternate public-news feeds, landmark reactions, street-resident reactions, and branch perks. It has no browser or network APIs.
- `assets/play.js` connects the module to the canvas's district visuals, original dialogue interactions, city board and battle UI.
- `assets/battle-core.mjs` accepts optional `perks` arguments on action validation and turn advancement, defaulting to the prior behavior for callers that omit them.
- `assets/play.css` styles three visual news states: pre-finale, refund and public-signal.
- `tests/consequence.test.mjs` checks pre-finale compatibility, alternate dialogue coverage, non-duplicated rewards, save roundtrips, optional perk behavior and site/CI wiring.

## Manual QA

1. Load an ordinary v0.10 save before the finale. Verify news, original street colors and corporate battle mechanics.
2. Finish the three-evidence audit and select **Refund the Whole Town**.
3. Return to CoffeeChucks, TweedCorp, and Spacealite; read changed dialogue. Talk to Buffer Bob, Marty, Chuck and Lenny to hear their distinct reactions.
4. Open a **new corporate confrontation**. Verify a starting shield of 12 and verify that it absorbs the first retaliation, with no new XP or souvenir duplicated.
5. Save, reload and optionally export/import to another browser; confirm all changes persist.
6. Repeat on a separate save with **Free the Public Signal**. Verify the Channel Zero bulletin, new town colors and dialogue. Try Tweedsie's move once in a new corporate encounter.
7. Confirm the original ending choice remains one-time. Confirm the original Coffee Run, Marty mystery, Lenny concert, Tweedleball, Page 42 and three corporate enemies still work.
8. Reset Run only after exporting anything valuable; verify the original city and dialogues are restored.

## Scope

This is a **branch-aware scripted neighborhood**, not emergent NPC simulation. The endings influence the city's illustrations, texts and future corporate battle tactics, but they do not add new districts, multiplayer, quests, or full post-credits cutscenes yet. Future episodes can extend these consequences without changing the local-first save contract.
