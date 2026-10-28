# TweedleVerse 🌿

> **Same universe. Different dimensions. Absolutely no refunds.**

An original, absurdist silicon-comedy universe created by **Michael Wave / Backyard Production Company**.

**TweedleVerse** is the umbrella world. **Practical Smokers** is its flagship workplace / hidden-camera-style comedy. **Welcome to Stemside** is its proposed explorable game. **TGA Pro Tour** is the world's ridiculous obstacle-course sport, **Tweedleball**. **Spacealite™** is the predatory interdimensional cable monopoly.


## Enter the portal

The [Stemside portal](index.html) is a hand-built static site with an original illustrated city, working faux Spacealite channel surfing, a Wheel of Tweed, an interactive script page, and Tweedsie appearances. All code and vector art are local. **This is a playable web *experience*, not yet the open-world game.**

### Explore the streets

[Stemside Street Explorer](stemside.html) adds a clickable district map, 13 local landmarks, local information cards, surprise Tweedsie cameos, and a short three-stop Coffee Run story mission. This is an interactive map/story prototype, not an open-world game yet. See [Pages and Explorer guide](docs/PAGES_AND_EXPLORER.md) for the GitHub Pages setup and manual publish gate. The deployment workflow does not run unless the repository variable `ENABLE_TWEEDLEVERSE_PAGES=true` is set after enabling Pages.

### Development bibles

- [World and canon](docs/WORLD_BIBLE.md)
- [Characters and relationships](docs/CHARACTERS.md)
- [Practical Smokers series, skits, and season arc](docs/SHOW_BIBLE.md)
- [Tweedleball and the TGA tournament](docs/TWEEDLEBALL.md)
- [Welcome to Stemside game concept](docs/GAME_DESIGN.md)
- [Production standards and rights](docs/PRODUCTION.md)
- [Structured seed canon](data/canon.json)

### Try the portal locally

Run `python -m http.server 8000` from the repository folder and open `http://localhost:8000`. The website has no runtime dependency on any remote font, image or API. Run `npm test` with Node 22+ to validate the lore data and static entrypoint.

GitHub Pages hosting can be configured **after** the portal PR is merged; deployment is not claimed to be live yet.

## Welcome to Stemside

A sprawling, unequal retro-futuristic factory town inhabited by fictional *silicon people*. On the south side: scrappy residents, ridiculous businesses, actual community, and **Reggie's Reggie: “Cheap in a Pinch!”** On the north side: luxury shops, snobbery, fancy coffee, and the **North Stemside Invitational**. Both sides suffer under the same corporate absurdity.

### World anchors

| Anchor | Premise |
| --- | --- |
| **TweedCorp Co. (TCC)** | Dysfunctional botanical corporation employing four spectacularly unqualified friends. |
| **Tweed** | Fictional silicon-world botanical product; mock taxonomy: *Tweedimus Silativa* and *Tweedimus Indicone*. Grades: **Reggie / Mids / Loud**. |
| **Spacealite™** | Interdimensional television monopoly: “You Have Infinite Choices. None Are Included.” |
| **Reggie Bands III** | Reginald Von Bandwidth III, the easily enraged Spacealite executive; “Seeds McStems” to his enemies. |
| **Tweedsie** | Super-chill gopher trickster, dreadlocks, sunglasses, gold chain with a Tweed-leaf pendant, big fictional spliff; knows the fourth wall is negotiable. |
| **Tweedleball / TGA Pro Tour** | Hybrid obstacle-gauntlet target sport, with a Southside Stems League and wealthy Northside championship. |
| **Lenny Smokins** | Fictional retro-rock musician behind the proposed ORIGINAL song “I'm Real High.” |

### Landmarks

**South Stemside:** CoffeeChucks (“It's Coffee, Chuck. Drink It.”), Lackluster Video (“Be Kind. Rewind. Whatever.”), Taco McBurger Bell, Snublishers Clearing House, Reggie's Reggie, Stems League arena.

**North Stemside:** CoffeeCharles (“For the Distinguished Caffeinated”), Whole Moods, Le Biestro and other Biestros, Royal Tweedleball Club, North Stemside Invitational, opulent Spacealite properties.

### Signature storytelling rule

The characters treat absurd events sincerely. The show routinely breaks the fourth wall **and the fifth wall**: characters pull out their episode scripts, argue with the production crew and narrator, enter commercials, and dispute Spacealite's licensing fees. **Tweedsie** is the calmest person in every chaotic room.

The first major season arc follows a reluctant TweedCorp worker who wins the local Southside Stems League and qualifies for the despised North Stemside Invitational, hoping only to claim a year's free CoffeeChucks.

## Production directions

1. **World bible and canonical records:** characters, companies, places, relationships, vocabulary, running gags.
2. **Practical Smokers:** original scripts, animated sketches, faux commercials, characters with consistent comedic motivations.
3. **TGA Pro Tour:** playable Tweedleball rules prototype and game-show inspired courses.
4. **Welcome to Stemside:** an explorable game with crossovers and an *episode-script* mechanic.
5. **Spacealite:** an in-world channel-surfing hub for original micro-shows, faux commercials and shorts.
6. **Backyard Production Company → REEL Commons:** potential production and distribution integrations, not dependencies for the first prototype.

**Originality / rights:** This is a distinct fictional world. Comedic touchstones inform energy, not copyable characters, scenes, branding, lyrics, audio, or visual designs. All songs and assets should be original or properly licensed. This is satire and fictional entertainment, not a real cannabis-product brand or consumption instruction.

**Status:** v0.1 foundation. Some details (especially four lead character names and Tweedleball rules) remain proposals, not finalized canon.

© 2026 Michael Wave / PHI369 Labs. License to be selected deliberately; no third-party copyrighted materials included.
