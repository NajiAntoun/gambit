# Changelog

All notable changes to Gambit are documented here.

---

## [Unreleased]

### Added
- **Scholar's Mate Defense** opening — 20-move main line teaching Black's counter-attack against the Scholar's Mate attempt, ending in a devastating triple fork (Nxc2+). Includes g4 push fork variation and 2 deviations.
- **Piece theme selector** — 4 high-quality SVG piece sets: Spatial (default), Staunty, Maestro, Governor. User preference saved in localStorage. Selector in Profile page with mini previews.
- **Compact header on board pages** — Online widget and profile avatar now accessible from Learn, Quiz, and Drill pages via a slim header bar. Full header with logo on all other pages.

### Changed
- **Logo redesign** — Replaced pawn-crushes-king animation with a premium knight badge (gold gradient, floating shadow) + crowned G wordmark + gold accent underline. Badge intentionally overflows the header for a branded floating effect.
- **Favicon updated** — New gold knight badge matching the redesigned logo.
- **Board pages layout** — Changed from fixed `100svh` height to flex layout to accommodate the compact global header.

### Fixed
- **PRD updated** — All milestones, opening counts (28), success criteria, and backlog items brought up to date.

---

## [1.0.0] — 2026-03-27

### Shipped
- 27 chess openings with annotated moves across White, Black vs e4, and Black vs d4 categories
- Learn mode with move-by-move navigation and strategic explanations
- Quiz mode with move validation, scoring, and mastery tracking (3 clean runs)
- Drill mode with speed drills and deviation drills (42 deviation scenarios)
- AI-powered "Ask Gambit" explanations via Claude Haiku
- Progress dashboard with per-opening stats
- Authentication via Clerk with per-user PostgreSQL progress
- User profiles with onboarding flow
- Chess.com and Lichess rating imports
- Online presence widget with real-time user list
- Opening variation forks (accept/decline) in 9 openings
- Bird's Opening: Williams Gambit (27th opening)
- ErrorBoundary and MiniBoard resilience
- Mobile-first responsive design, PWA-ready
- Deployed: Vercel (frontend) + Railway (backend + PostgreSQL)
