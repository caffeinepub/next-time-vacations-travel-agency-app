# Specification

## Summary
**Goal:** Help users obtain a correct live app link from within the app and verify the deployed backend via simple diagnostics.

**Planned changes:**
- Add an “App Status / Live Link” section in the Admin Settings dialog that displays the current app URL computed at runtime from `window.location.origin + window.location.pathname`.
- Add a one-click “Copy link” action that copies the displayed URL to the clipboard and shows a success toast.
- Add a lightweight backend public query that returns deployment diagnostics (backend canister principal and a backend-generated timestamp/version string).
- Fetch and display the diagnostics in the “App Status / Live Link” section using the existing actor/react-query pattern, with a non-blocking error message if diagnostics fail to load.
- Add a short English “Going Live Checklist” panel near the live link (including incognito/private-window verification and a note that diagnostics should load if the backend is reachable), without referencing builder UI controls.

**User-visible outcome:** Users can open Admin Settings to copy a working live URL for the current app and see basic backend diagnostics (or a friendly non-blocking error), plus a brief checklist to confirm the app is live.
