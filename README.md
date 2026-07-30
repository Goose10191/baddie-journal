# Bertram Baddies — Training Journal

A sleek, dark-mode, offline-capable web app for the girls to track their workouts
and watch their progress over time. No build step, no backend. Each device stores
its own data privately in the browser (`localStorage`). Installable to the home
screen as a PWA.

## Features
- **Home** — greeting dashboard: workouts this week, week streak, water, weeks logged
- **Workout** — Day 1 / 2 / 3 (segmented), exercises × rounds, finisher, energy/confidence
  scale, star rating, reflections
- **Progress** — stat summary + line charts (top-set weight per exercise, workout rating,
  bodyweight) and a browsable history of every finished week (tap to view, or delete)
- **Wins** — weekly wins checklist, note to self, Baddie Score
- **Me** — name, week, bodyweight, goals, personal records, coach's notes, and
  **Finish Week** (archives the week to Progress; name/goals/records/bodyweight carry over)

## Files
- `index.html` — the entire app (HTML + CSS + vanilla JS, no dependencies)
- `manifest.webmanifest`, `sw.js` — PWA metadata + offline cache
- `assets/logo.png`, `icon-192/512.png`, `apple-touch-icon.png` — logo & app icons
- `.nojekyll` — tells GitHub Pages to serve files as-is
- `dev-server.js` — tiny local preview server (development only; not used in production)

## Run locally
```bash
node dev-server.js
```
Then open http://localhost:8585

## Deploy to GitHub Pages (chosen host)
The repo is already initialized and committed. To publish with **GitHub Desktop**:
1. **File → Add local repository…** and pick `C:\Projects\baddie-journal`.
2. **Publish repository** (uncheck "Keep this code private" if you want a simple public URL).
3. On github.com open the repo → **Settings → Pages**.
4. Under *Build and deployment*, Source = **Deploy from a branch**, Branch = **main** / **/(root)** → **Save**.
5. Wait ~1 minute. Your app is live at:
   `https://<your-username>.github.io/baddie-journal/`

The app uses relative paths, so it works correctly under that `/baddie-journal/` subpath.

## Install on a phone (per girl, on her own device)
1. Open the GitHub Pages URL in the phone's browser.
2. **iPhone (Safari):** Share → *Add to Home Screen*.
   **Android (Chrome):** menu (⋮) → *Install app / Add to Home screen*.
3. Opens full-screen like a native app, works offline, keeps her data on that device.

## Updating the app
Edit files → **bump the `CACHE` version** in `sw.js` (e.g. `baddies-v2` → `baddies-v3`)
so installed devices pull the new version → commit & push in GitHub Desktop. Pages redeploys automatically.

## Data notes
- Data is **per device / per browser** — private to each girl. No cloud sync by design
  (you said this is just for them). Clearing the browser's site data erases entries.
- "Finish Week" archives the week to Progress history; "Reset current week" clears the
  current week without saving; each saved week can be deleted from its detail view.
