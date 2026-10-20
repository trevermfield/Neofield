# Gym Leader Battles

Trever and Tyler's Neofield Region game. **Adventure** is the main game: Professor Okla, Tyler's Neofield Mons, routes, catching, 17 gyms and the Champion. The **Battle Hall** has single gym battles, **Badge Rush** (all 17 gyms back to back, then the Elite Four and Champion), the Elite Four challenge, Link Battles and **Build Your Own Team**. Each phone has 4 save slots; built teams are shared by all of them. Battles run on the Pokémon Showdown simulator ([@pkmn/sim](https://www.npmjs.com/package/@pkmn/sim)).

## Play it

- **Website:** `https://<your-github-name>.github.io/<this-repo>/` (it updates by itself a minute or two after every change).
  - **Android:** open it in Chrome, tap ⋮, then **Install app**.
  - **iPhone:** open it in Safari, tap Share, then **Add to Home Screen**.
- **Android app (APK):** [download the latest neofield.apk](../../releases/latest/download/neofield.apk). Open it and allow the install when Android asks. The app loads the website, so it gets game updates without a new download.

Saves live on each device. To move them between phones, or between the app and the browser, use **Options → Save backup** on the title screen.

Online battles only work inside the Claude version of the game for now.

## What's where

| Folder | What it holds |
| --- | --- |
| `game/` | The source. `regional.js` has the Neofield Pokémon and routes, `art.js` lists their pictures, `builder.js` powers Build Your Own Team and level-matched gym teams, `teams.js` and the `*_team.txt` files have the gym teams, `adventure.js` handles levels and evolution, `engine.js` wraps the battle simulator and runs the computer opponent, and `index_markup.html` + `app_script.html` are the screens and game logic. |
| `www/` | The website. `mons/` holds Tyler's Mon pictures, `portraits/` the gym leaders. `index.html` and `engine.js` are built from `game/` and aren't stored here. |
| `android/` | The Android app shell (Capacitor). |
| `scripts/build.mjs` | Builds `game/` into `www/`. |

## Adding a new Mon picture

1. Put the picture in the **New Mons** Drive folder, named with its dex number, like `002Something.png`.
2. Its background gets removed and it's saved as `www/mons/<name>.png`.
3. The Mon is renamed in `game/regional.js` and its picture is added to `MON_PICS` in `game/art.js`.

Pushing to `main` rebuilds the website automatically.

## Building it yourself

```sh
npm install
npm run build        # builds www/
npm run serve        # plays it at http://localhost:8080
npm run check-teams  # checks every gym team is legal
```

The APK is built by GitHub (the **Android app** workflow) whenever `android/` changes, or by hand from the Actions tab. It's signed with the key in `android/app/`, so each new APK installs over the last one.

Fan project for family use. Pokémon and its names belong to Nintendo, Game Freak and The Pokémon Company.
