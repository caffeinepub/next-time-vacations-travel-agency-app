# Specification

## Summary
**Goal:** Restore and harden the homepage Hero background image so it reliably displays after builds/deploys.

**Planned changes:**
- Add/verify the Hero background image exists at `frontend/public/assets/generated/cruise-ship-hero.dim_1600x900.jpg` so the public path `/assets/generated/cruise-ship-hero.dim_1600x900.jpg` returns successfully.
- Update `frontend/src/components/Hero.tsx` to detect hero image load failure and show the existing gradient fallback plus a small, readable English message, while keeping the full-viewport background behavior when the image loads.

**User-visible outcome:** The homepage shows the cruise ship hero image as a full-screen background; if it fails to load, users see the gradient fallback and a clear message indicating the image couldn’t be loaded.
