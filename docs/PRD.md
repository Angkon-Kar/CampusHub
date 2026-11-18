# PRD: Campus Resources Hub (DUTechUnit Resources Hub)

## 1. Project Overview
A 100% free academic resource-sharing, blogging, project showcasing, and encrypted networking platform for 6 affiliated engineering colleges (SIMT, MEC, FEC, BEC, NITER, SHEC). Departments: CSE, EEE, CE, ME. Built as an academic lab project focusing on modern web standards.

## 2. Core Functional Requirements
### A. Authentication & User Profile
- **Firebase Auth:** Login via Google, GitHub, and Email/Username + Password. (Apple login is not included.)
- **Separate pages:** `/login` and `/register`. First-time social users finish `/complete-profile`.
- **Account linking & security:** OAuth users can set a password and username. Security tab shows active login providers (Google, GitHub, Email).
- **Registration:** unique `username` with real-time validation, mandatory Terms & Conditions checkbox (links to `/terms`), and "Remember Me".
- **Public profile (`/username`):** user info, published articles, resources, projects, badges, and a Share button (LinkedIn, Facebook, Messenger, WhatsApp, Copy Link).

### B. Resource Hub & Link Security
- **Upload flow:** logged-in users share public Google Drive links (PDF, PPTX, etc.) by College, Department, Session, Topic and Tags.
- **3-tier link validation:** (1) frontend regex (disables upload if invalid), (2) backend URL unshortening, (3) safety check via Google Safe Browsing / AI moderation.
- **Access control:** guests can browse but must log in to download or open drive links.
- **Engagement & reporting:** view counter, love react, 3-dot menu to report broken/expired links (back to admin queue).

### C. Articles/Blogs & Free Courses
- No image uploads. Bold, Italic, Underline, 3 fonts, and validated links only.
- Dedicated section for 100% free course links.

### D. Project Showcase & Gamification
- Global project feed plus projects on `/username`.
- Achievements unlock from approved contributions (1st approved post unlocks the section; more posts, projects and loves unlock more badges).

### E. LinkedIn-Style Encrypted Chat
- Bottom-right collapsible drawer. Rooms auto-grouped by Session + Department across the 6 colleges. Custom private rooms (creator is Room Admin) with shareable invite link.
- Real-time via Socket.io, stored in MongoDB with AES-256-GCM encryption at rest (server-side, not end-to-end).

### F. Admin & Moderator Panel
- RBAC: Super Admin and Moderator. Moderation queue (Approve, Decline, Comment), report handling, delete.
- Analytics: weekly, monthly, yearly charts; uploads, declines, views, loves, active members, top contributors, college filter and search.

## 3. Design
- Light, white, clean premium theme. See Design.md.
