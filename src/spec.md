# Specification

## Summary
**Goal:** Let users share itineraries via public links and download itinerary details as a PDF, without requiring email sending or external integrations.

**Planned changes:**
- Add a “Share” action on the itinerary details screen to generate and display a stable, public shareable URL for the currently viewed itinerary.
- Add a public shared-itinerary view route that renders itinerary details without requiring sign-in, including an English “not available” error state for invalid/unknown links.
- Add a “Download as PDF” action on the itinerary details screen to generate and download a PDF of the currently viewed itinerary details (ports of call, dates, ship specs, cabin categories/prices/availability, dining, entertainment when present), with a disabled state or English error when data is unavailable.

**User-visible outcome:** A user can generate a public link to an itinerary for client review and download the itinerary as a PDF directly from the itinerary details page; recipients can open the shared link without logging in.
