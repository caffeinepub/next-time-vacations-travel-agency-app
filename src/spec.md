# Specification

## Summary
**Goal:** Let admins upload and manage the homepage hero image within the app so the front page can reliably display an updated hero without redeploying static assets.

**Planned changes:**
- Add backend persisted storage for a homepage hero image value (e.g., stored as a data URL string), plus a read method and an admin-only update/reset method with authorization checks.
- Ensure the stored hero image survives canister upgrades (add migration logic only if required by existing stable state).
- Add an Admin Dashboard section to upload/manage the homepage hero image: file picker, image-only validation, 5MB size limit validation, preview, save action, and reset-to-default action with English messages/toasts.
- Update the Hero component to use the admin-uploaded hero image when present, otherwise fall back to `/assets/generated/cruise-ship-hero.dim_1600x900.jpg`, preserving current diagnostics banner behavior on load failure.
- Add React Query hooks to fetch and update/reset the homepage hero image, following existing patterns and invalidating queries so the homepage updates without a hard refresh.

**User-visible outcome:** Admins can upload, preview, save, or reset the homepage hero image from the Admin Dashboard, and the homepage hero updates immediately (or falls back to the existing default image when none is set).
