# Specification

## Summary
**Goal:** Make the footer social media icons link to configurable, real social URLs instead of placeholder `#` links.

**Planned changes:**
- Add a single frontend config export (e.g., `SOCIAL_LINKS`) that defines the footer social network URLs in one place.
- Update `Footer.tsx` to render Facebook/X/Instagram/LinkedIn icons using the config values (no hardcoded URLs in the footer markup).
- Ensure each rendered social link opens in a new tab with `rel="noopener noreferrer"` and includes an accessible label (e.g., `aria-label`).
- Hide (do not render) any social icon whose configured URL is empty/undefined.
- Keep the existing footer phone number text (`Call us: 434-238-8796`) unchanged.

**User-visible outcome:** Footer social icons go to real social pages in a new tab, and site owners can update social URLs by editing a single config file.
