# Bertram Baddies — Training Journal

A standalone, offline-capable web app for the girls to track their workouts.
No build step, no backend. Each device stores its own data privately in the
browser (`localStorage`). Installable to the home screen as a PWA.

## Files
- `index.html` — the entire app (HTML + CSS + vanilla JS, no dependencies)
- `manifest.webmanifest` — PWA metadata (name, icons, colors)
- `sw.js` — service worker (offline app-shell cache)
- `assets/logo.png` — header logo · `icon-192/512.png`, `apple-touch-icon.png` — app icons
- `dev-server.js` — tiny local preview server (development only; not deployed)

## Run locally
```bash
node dev-server.js
```
Then open http://localhost:8585

## Deploy (so the girls can add it to their phones)
It's just static files — host the folder anywhere that serves HTTPS:
- **Netlify Drop** (easiest): drag the `baddie-journal` folder onto https://app.netlify.com/drop
- **GitHub Pages**: push the folder to a repo, enable Pages
- **Cloudflare Pages / any static host**

> HTTPS is required for the "Add to Home Screen" install + offline features.
> Opening `index.html` directly from the file system works for the journal itself,
> but the service worker (offline) and home-screen install need it served over http(s).

## Install on a phone (per girl, on her own device)
1. Open the hosted URL in the phone's browser.
2. **iPhone (Safari):** Share → *Add to Home Screen*.
   **Android (Chrome):** menu (⋮) → *Add to Home screen / Install app*.
3. It now opens full-screen like a native app, works offline, and keeps her data on that device.

## Updating the app
Edit the files, then bump the `CACHE` version string in `sw.js` (e.g. `baddies-v1` → `baddies-v2`)
so installed devices pull the new version instead of the cached one.

## Notes on data
- Data is **per device / per browser** — private to each girl. Clearing the browser's
  site data (or "Start a New Week") erases entries.
- No cloud sync by design. If you later want to review their logs from your device,
  that would need a backend — ask and it can be added.
