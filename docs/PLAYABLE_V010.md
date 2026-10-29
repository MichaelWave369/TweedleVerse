# Stemside v0.10 | Episode One: The Great Billing Reversal

**Playable authored RPG episode**, not a claim of a finished open-world game. All characters, fictional corporate names, prose, code and CSS stage illustrations are original. No external media or licensed audio is needed.

## Why this episode exists

The previous releases introduced a town, Coffee Run, resident conversations, a playable Tweedleball practice court, corporate comedy encounters, two side quests, script rewrites, an adventure journal, city compass and portable saves. This episode finally brings together those systems into a contained story with a beginning, a real player-driven investigation, an interactive puzzle and a choice of endings.

## How to unlock

Complete the **three-stop Coffee Run** and win **one** of the existing corporate disputes. Previous accomplishments count, including when restored from your local browser save or imported using the Portable Save Vault. The episode's quest card stays visible while locked and explains what remains.

Once eligible, use the **BILLING REVERSAL FINALE** option in the existing quest compass or follow it under automatic quest tracking when the Coffee Run is complete.

## Playable investigation

1. **Talk (T or controller B) to Buffer Bob outside TweedCorp.** Bob notices the entire city was charged for observing itself, including tomorrow.
2. **Interact (E or controller A) at Lackluster Video.** A future-dated receipt proves the charge predates the episode.
3. **Interact at Spacealite Executive Tower.** The in-game audit modal opens. It can also be reopened with **OPEN THE FINAL INVOICE** while standing near the tower.
4. **File three pieces of evidence in the correct sequence**: the coffee receipt, tomorrow's VHS receipt, then Reggie's invoice. Incorrect evidence increments a fictional paperwork error counter and offers feedback, but does not erase progress or cost a real payment.
5. **Choose one of two story outcomes** after completing the audit:
   - **Refund the Whole Town**: Reggie must reimburse South Stemside for outrageous charges.
   - **Free the Public Signal**: Reggie loses his private claim over the local broadcast channel.

The story endings use different authored text. The choice is final for that save slot until the player resets the full adventure. Reopening the finale after completion shows the credits and chosen outcome, with no second experience bonus.

## Reward and persistence

An ending grants the **Interdimensional Fee Waiver** souvenir and **120 XP**, once. The achievement and ending appear in the original passport and adventure journal.

Version 0.10 advances the **game save schema from v3 to v4** while preserving the old localStorage key. Existing v1, v2 and v3 saves migrate automatically. New finale state stores the investigation step, evidence verified, fictional mistakes, and selected ending. Fields are validated; bad stages and unknown ending strings are rejected without executing untrusted text.

No telemetry, account, uploads, real transactions, generated copyrighted art or remote AI service has been added. The old JSON export and import system continues to use the existing portable file envelope and supports the upgraded save data.

## QA

Run `npm run check` under Node 22+ and open [play.html](../play.html) through a local server or deployed Pages:

1. Confirm the episode is locked on a fresh run and available after the Coffee Run and a corporate victory.
2. Track the episode with the quest compass. Verify Bob → Lackluster → Spacealite are shown in order.
3. At Bob, press T to talk; at the two buildings, use E to interact. Try visiting sites out of order and confirm no progression.
4. At Spacealite, choose invoice evidence before coffee and verify the error count increases but the evidence stage stays put.
5. Submit coffee → tape → invoice, choose the **Refund** ending, and confirm one Fee Waiver and 120 XP.
6. Save/reload and confirm the chosen ending and journal entry remain. Replay the completed modal; no duplicate reward.
7. Repeat on a fresh run with the **Public Signal** outcome. Confirm the two endings differ.
8. Import a v3 save from the portable vault and confirm no earlier achievements are lost.
9. Retest Marty, Lenny, Tweedleball, Page 42 rewrites, compass, passport and local file export/import.

## Explicit boundaries

This is an **authored, single-player, deterministic side-finale**, not a full RPG campaign, multi-hour story, animated cinematic, or autonomous NPC drama. The audit is a three-step evidence-order puzzle, not a complex financial simulation. The two endings currently diverge in narrative resolution and the saved ending state, not the entire city map. Future seasons can make their consequences influence more districts and recurring characters.
