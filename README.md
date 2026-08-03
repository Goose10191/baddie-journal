# Bertram Baddies — Training Journal

A sleek, dark-mode, offline-capable web app for the girls to track their workouts
and watch their progress over time. No build step, no backend. Each device stores
its own data privately in the browser (`localStorage`). Installable to the home
screen as a PWA.

## Features
- **Home** — greeting dashboard: workouts this week, week streak, water, weeks logged
- **Workout** — days shown as a segmented control; exercises × rounds, finisher,
  energy/confidence scale, star rating, reflections. **Edit mode** (✎) lets you
  add / rename / delete days, change rounds, and add / remove / swap / reorder exercises.
- **Exercise library** — ~96 built-in exercises filterable by **body part** (Legs, Glutes,
  Calves, Chest, Back, Shoulders, Arms, Core, Full Body, Cardio) and **equipment**
  (Bodyweight, Dumbbell, Kettlebell, Barbell, Band, Machine, Box, Jump Rope, Other),
  searchable, plus **custom exercises** with your choice of tracked fields.
- **Last-time reference** — while logging, each exercise shows your most recent session's numbers
  (e.g. "Last (Aug 2): 25×10 · 25×9") so you can push for progressive overload.
- **Backup reminder** — since data is on-device, Home nudges you to export a backup if it's been 3+ weeks
  (or never); the Me tab shows when you last backed up. Exporting records the date.
- **Progress** — stat summary + line charts (top-set weight per exercise, workout rating,
  bodyweight) and a browsable history of every finished week (tap to view, or delete).
  Each finished week snapshots the plan it used, so history stays accurate after edits.
- **Wins** — weekly wins checklist, note to self, Baddie Score
- **Me** — name, week, bodyweight, goals, personal records, coach's notes, and
  **Finish Week** (archives to Progress; name/goals/records/bodyweight/plan carry over)

## Files
- `index.html` — HTML shell · `styles.css` — all styles · `app.js` — all logic (vanilla JS, no deps)
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

## Importing workouts (build days from a file)
On the **Workout** tab → **✎ Edit** → **Import workout file (.json or .zip)**. Uploading **appends**
the days to the current plan. Use **Download example file** for a starting template.

Format (JSON):
```json
{
  "days": [
    {
      "name": "Push Day",
      "focus": "Chest · Shoulders",
      "rounds": 4,
      "scale": "energy",
      "finisher": "Max Push-Ups",
      "exercises": [
        { "name": "Dumbbell Bench Press", "track": ["wt", "reps"] },
        "Push-Ups",
        { "name": "Plank", "track": ["time"] },
        { "name": "Farmer Carry", "track": ["wt", "dist"] }
      ]
    }
  ]
}
```
- `days` — a list of workout days (or pass a single day object / a bare array of days).
- Per day: `name` (required), `focus`, `rounds` (1–8, default 3), `scale` (`"energy"` | `"confidence"`),
  `finisher` — all optional except name.
- `exercises` — each entry is either a **name string** (e.g. `"Push-Ups"`; if it's a known
  exercise the app auto-picks what to track) or an object `{ "name": ..., "track": [...] }`.
- `track` values: `"wt"`, `"reps"`, `"time"`, `"dist"`, `"rir"`, `"pain"`.
  Synonyms like `"weight"`, `"seconds"`, `"distance"`, `"rpe"` are accepted. Unknown exercises default to weight + reps.

**Also supported (richer programs):**
- **Nested wrappers** — a file may wrap everything in `{ "program": { "workouts": [ ...days ] } }`.
- **Sets vs rounds** — a day is *straight sets* by default (columns labeled "Set 1/2/3"). Make it a
  *circuit* with `"scale": "rounds"` or `"mode": "rounds"` (columns become "Round 1/2/3", shared across
  exercises). You can also flip any day in **✎ Edit → Track by: Sets / Rounds**.
- **Per-exercise sets** — `{ "name": "...", "sets": 3, ... }` gives that exercise its own number of set columns.
- **Targets** — `"target": "8 each arm"` or `"repRange": [6, 8]` shows a small prescription under the exercise.
- **Finisher** — `"finisher": "Treadmill Walk"` (plus optional `finisherDetails`).
- **.zip bundles** — upload a whole zip of `.json` files; the app reads them all and de-duplicates workouts by name
  (so a bundle containing both a "complete pack" and individual day files won't create duplicates).

## Data notes
- Data is **per device / per browser** — private to each girl. No cloud sync by design
  (you said this is just for them). Clearing the browser's site data erases entries.
- "Finish Week" archives the week to Progress history; "Reset current week" clears the
  current week without saving; each saved week can be deleted from its detail view.
