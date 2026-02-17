# Specification

## Summary
**Goal:** Make the homepage cruise ship hero image fill the full screen while maintaining aspect ratio using a cover-style layout.

**Planned changes:**
- Update `frontend/src/components/Hero.tsx` to use full viewport height/width for the hero container (e.g., `h-screen`/`min-h-screen`).
- Adjust the hero image styling to use a cover-style fit so it fills the hero area without letterboxing (cropping as needed).
- Ensure hero text and CTAs remain visible and readable on top of the full-screen image in both light and dark modes.

**User-visible outcome:** The homepage hero displays the cruise ship image full-screen, with readable overlay text/CTAs on top.
