# UI/UX & Component Design System

## 1. Visual Identity & Animations
- **Theme:** Light, white and clean premium dashboard (white surfaces, slate text, indigo accent). No dark mode.
- **Tokens:** page background `#f7f8fb`, cards white with `slate-200` borders and soft shadows, primary `indigo-600`, text `slate-900`, muted text `slate-500`.
- **Fonts:** Inter for the UI. Merriweather and Fira Code are available in the article editor.
- **Animations (Framer Motion):** fade-in for resource cards, spring animation for the LinkedIn-style right-side chat drawer, modal scale/fade, scale effect on achievement badges.
- **Feedback:** `react-hot-toast` at `top-right` for every user action.

## 2. Key Page Layouts
- **Global shell:** Navbar (top), page content, Footer (bottom, 4 link columns: brand, explore, browse by college, account and policies). Chat drawer floats bottom-right.
- **Home / Resource Hub (`/`):** Hero with big search + "Share a resource" button, category tabs, College / Department / Session filters, tag chips, card grid (views, love, 3-dot report menu).
- **Login (`/login`) and Register (`/register`):** Separate pages sharing a two-column layout. Google and GitHub buttons, email or username + password, Remember me. Register has live username check and mandatory Terms checkbox.
- **Complete profile (`/complete-profile`):** For first-time Google/GitHub users (username, college, department, session, terms).
- **Terms (`/terms`):** Full terms page with anchors (`#copyright`, `#links`).
- **Article editor:** Toolbar restricted to Bold, Italic, Underline, font selector (Inter, Merriweather, Fira Code) and Add validated link. No images.
- **Public Profile (`/username`):** Header, share modal (LinkedIn, Facebook, WhatsApp, Messenger, direct link), achievements, tabs (Articles, Projects, Resources) plus owner-only tabs (Post status, Security).
- **Chat drawer:** Fixed `bottom-0 right-4`, department rooms and custom rooms, "AES-256 Encrypted" badge.
- **Admin dashboard (`/admin`):** Sidebar (Overview, Moderation queue, Top contributors, Colleges, Team and roles), weekly/monthly/yearly charts, approve/decline/comment, college filter and search.
