# Specification

## Summary
**Goal:** Set the uploaded cruise ship photo as the homepage hero background image for Next Time Vacations.

**Planned changes:**
- Crop/resize the uploaded image `cruise-290913_1280.jpg` to 1600×900 and add it to frontend public assets at the exact path `/assets/generated/cruise-ship-hero.dim_1600x900.jpg`.
- Update the homepage hero section to use `/assets/generated/cruise-ship-hero.dim_1600x900.jpg` as a full-screen background with cover/fill behavior, keeping the existing fade-in and gradient overlay for readability.
- Ensure resilient fallback remains: if the hero image fails to load, show the gradient background and a small readable error message without breaking layout.
- Ensure any existing HTML preload link (if present) matches `/assets/generated/cruise-ship-hero.dim_1600x900.jpg` exactly to avoid preload 404s.

**User-visible outcome:** The homepage hero displays the new cruise ship photo as a full-screen background (with overlay and fade-in), and the page still renders cleanly with a readable message if the image fails to load.
