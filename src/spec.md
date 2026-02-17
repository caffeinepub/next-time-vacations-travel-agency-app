# Specification

## Summary
**Goal:** Publish the currently deployed draft as the live public version and reduce intermittent build/deploy failures.

**Planned changes:**
- Promote the current draft deployment to a live (non-preview) public URL.
- Diagnose and fix build/deploy issues that cause intermittent deployment failures, ensuring clean frontend builds and reliable end-to-end deployments.
- Improve deployment/build error output so failures clearly indicate which stage failed (frontend build vs canister build vs deploy), if platform-side expiration still occurs.

**User-visible outcome:** A public live URL loads successfully and shows the standard home page, and shared itinerary links (e.g., `?share=<id>`) open correctly; deployments complete more reliably.
