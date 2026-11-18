# Project Memory & Context Tracker

## How to Use Separate Chats in Claude Projects
When starting a new chat inside the Claude Project, always say which module you are working on:
- **Chat 1:** Backend setup, load balancer & MongoDB schemas (Architecture.md & Rules.md)
- **Chat 2:** Firebase Auth + MongoDB sync & Security tab (PRD.md & Rules.md)
- **Chat 3:** Resource/Article upload, link unmasking & custom text editor
- **Chat 4:** Public profile `/username`, achievements & share modal
- **Chat 5:** Admin panel, moderation queue & analytics
- **Chat 6:** Socket.io encrypted chat (LinkedIn style)

## Decisions so far
- Colleges: SIMT, MEC, FEC, BEC, NITER, SHEC. Departments: CSE, EEE, CE, ME.
- No Apple login. Google, GitHub and Email/Username + Password only.
- Separate Login and Register pages. Footer with link columns on every page.
- Light, white, clean premium theme (no dark mode).
- Reply with complete corrected files, not partial patches.

## Current Status
- Client (frontend) complete: all pages, components, contexts, admin dashboard.
- Next: MongoDB Atlas setup, server `.env`, run the backend locally, then deploy to Render.
- Backend fixes still to apply: `"type": "module"`, reserved usernames, `/api/links/verify` auth + SSRF guard, department-room invite codes, report handling, article HTML sanitizer must allow `<a href>`.
