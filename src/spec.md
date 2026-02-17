# Specification

## Summary
**Goal:** Restore a persistent, full-viewport cruise ship hero background image on the homepage.

**Planned changes:**
- Update `frontend/src/components/Hero.tsx` so the homepage Hero uses a single cruise ship photo as a full-viewport background (covering width and height with a cover-style layout).
- Ensure the hero image is referenced consistently from `/assets/generated/cruise-ship-hero.dim_1600x900.jpg` and is served as a static public asset.
- Add a graceful visual fallback (e.g., solid/gradient background) when the image cannot be loaded, to avoid a blank hero area.

**User-visible outcome:** On the homepage (without a share link), users see a cruise ship photo filling the entire hero area and it remains visible after rebuilds/redeploys, with a non-blank fallback if the image fails to load.
