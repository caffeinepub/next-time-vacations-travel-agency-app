# Specification

## Summary
**Goal:** Allow admins to configure branding (text, logo, and colors) for the public Shared Itinerary page, and have the shared page render using those saved settings.

**Planned changes:**
- Add an admin-only “Shared Page Branding” section in the Admin Dashboard with inputs for brand name, tagline/subtitle, contact phone number, logo image URL, primary color, and accent color.
- Implement save behavior that persists branding settings via a backend call and shows success/error toasts.
- Add a “Reset to defaults” action (with confirmation) that restores and persists the current default branding values used today.
- Add backend storage for a single global branding settings record and expose: a public read method (no auth) and an admin-only update method.
- Update the public Shared Itinerary page to fetch branding settings, apply configured text/logo, and apply primary/accent colors with fallbacks for missing/invalid values while remaining readable in light/dark mode.

**User-visible outcome:** Admins can update shared itinerary branding in the dashboard, and anyone viewing a shared itinerary link sees the configured brand name/tagline/phone/logo and controlled color accents (with sensible defaults when unset).
