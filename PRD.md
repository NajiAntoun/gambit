# Gambit — Product Requirements Document
Version 1.0 | March 2026

## 1. Product Overview

**Name:** Gambit
**Tagline:** Master your openings. Own the board.
**Type:** Web application (PWA-ready)
**Audience:** Chess players of all levels wanting to learn and memorize 
opening theory from both White and Black perspectives.

---

## 2. Goals & Success Criteria

### Primary Goal
Ship a fully functional, deployed chess opening trainer in one day 
that demonstrates Learn and Quiz modes across multiple openings 
from both White and Black perspectives.

### Success Criteria
- [ ] App is live and publicly accessible by end of day
- [ ] User can select an opening and a color
- [ ] Learn mode works flawlessly with move-by-move navigation
- [ ] Quiz mode correctly validates user moves and gives feedback
- [ ] At least 5 openings fully implemented
- [ ] Works on mobile and desktop
- [ ] Drill mode implemented if time permits

---

## 3. User Stories

### Must Have
- As a user, I can choose to play as White or Black
- As a user, I can browse and select from a list of chess openings
- As a user, I can step through an opening move by move with 
  strategic explanations (Learn mode)
- As a user, I can practice finding the correct moves and get 
  instant feedback (Quiz mode)
- As a user, I can see my progress per opening 
  (Not Started / Learning / Mastered)
- As a user, I can use the app seamlessly on phone or desktop

### Should Have
- As a user, I can ask for a deeper AI explanation of any move
- As a user, I can see my quiz score per session
- As a user, I can track which openings I have mastered

### Nice to Have (time permitting)
- As a user, I can drill openings in rapid fire mode with a timer
- As a user, I can track my personal best times
- As a user, I can see a streak counter

---

## 4. Features & Scope

### 4.1 Opening Selection Screen
- Color picker: White or Black
- Opening list grouped by category:
  - **White:** Ruy Lopez, Italian Game, Queen's Gambit, 
    London System, King's Indian Attack
  - **Black vs e4:** Sicilian Defense (Najdorf, Dragon, Scheveningen), 
    French Defense, Caro-Kann
  - **Black vs d4:** King's Indian Defense, Nimzo-Indian, 
    Queen's Gambit Declined
- Each opening shows: name, difficulty badge, progress status
- Search and filter by name

### 4.2 Learn Mode ✅ MUST SHIP
- Visual chess board with beautiful pieces
- Move list panel showing all moves in the opening line
- Current move highlighted in move list
- Previous / Next buttons to navigate moves
- Strategic explanation text per move
- "Ask Gambit" button for AI-powered deeper explanation
- Board automatically flips based on chosen color
- Last move highlighted on board

### 4.3 Quiz Mode ✅ MUST SHIP
- Board shows position — user must find the correct move
- Opponent moves play automatically
- Correct move → positive visual feedback
- Wrong move → incorrect move shown briefly, then correct move 
  revealed with explanation
- Score counter throughout session
- Session summary at end (score + time taken)
- Retry button
- Progress updated on completion 
  (Learning → Mastered after 3 clean runs)

### 4.4 Drill Mode ⏱ IF TIME PERMITS
- No explanations — pure move speed
- Countdown timer per opening
- Streak counter
- Personal best tracking

### 4.5 Progress Dashboard
- Overview of all openings and their status
- Visual progress indicators per opening
- Overall statistics
- Progress persists between sessions

---

## 5. Design Requirements

### Visual Identity
- Dark chess aesthetic
- Color palette: deep green, brown and gold accents
- Beautiful, classic chess piece set (Cburnett or Maestro style)
- Clean modern typography
- Smooth, satisfying piece move animations

### Chess Board
- Dark squares: deep green
- Light squares: cream
- Last move: gold highlight overlay
- Selected piece: bright gold highlight
- High contrast, easy to read at all screen sizes

### UX Principles
- Zero learning curve — intuitive from first interaction
- Mobile first — fully responsive on all screen sizes
- Fast — no unnecessary loading states
- Forgiving — wrong moves explained, never punishing
- Satisfying — correct moves feel rewarding

### Screens
1. Home / Opening Selection
2. Mode Selection (Learn / Quiz / Drill)
3. Game Board (adapts per mode)
4. Session Summary (end of Quiz / Drill)
5. Progress Dashboard

---

## 6. Milestones & Tasks

### Milestone 1 — Foundation ✅
- [x] M1.1 Initialize Git repository
- [x] M1.2 Create CLAUDE.md, BRIEF.md and PRD.md
- [x] M1.3 Scaffold frontend and backend projects
- [x] M1.4 Set up deployment configuration for both
- [x] M1.5 Set up environment variables and gitignore
- [x] M1.6 First commit: "Project scaffold"

### Milestone 2 — Data & Board ✅
- [x] M2.1 Create opening data file (14 openings, 170+ annotated moves, structured TS arrays)
- [x] M2.2 Build chess board component (react-chessboard v9 wrapper)
- [x] M2.3 Board flips correctly based on chosen color
- [x] M2.4 Move highlighting works correctly (last move in gold)
- [x] M2.5 Commit: "Chess board + opening data"

### Milestone 3 — Opening Selection UI ✅
- [x] M3.1 Home screen with color picker (All / White / Black filter)
- [x] M3.2 Opening list grouped by category
- [x] M3.3 Difficulty badges and progress status indicators
- [x] M3.4 Search and filter functionality
- [x] M3.5 Mode selection screen
- [x] M3.6 Commit: "Opening selection UI"

### Milestone 4 — Learn Mode ✅
- [x] M4.1 Step through moves with Previous / Next navigation
- [x] M4.2 Move list panel with current move highlighted (clickable)
- [x] M4.3 Strategic explanation per move
- [x] M4.4 Smooth animations (200ms)
- [x] M4.5 Commit: "Learn mode complete"

### Milestone 5 — Quiz Mode ✅
- [x] M5.1 Auto-play opponent moves (500ms delay)
- [x] M5.2 User move validation (drag-drop → SAN comparison)
- [x] M5.3 Correct and wrong move visual feedback (color overlays)
- [x] M5.4 Score tracking throughout session
- [x] M5.5 Session summary screen (score, time, retry)
- [x] M5.6 Progress update logic (Learning → Mastered after 3 clean runs)
- [x] M5.7 Commit: "Quiz mode complete"

### Milestone 6 — AI Integration ✅
- [x] M6.1 Backend API endpoint for move explanations (POST /api/ask-gambit)
- [x] M6.2 Claude Haiku API integration with system prompt
- [x] M6.3 "Ask Gambit" button in Learn mode with loading state
- [x] M6.4 Response caching (no duplicate API calls per position)
- [x] M6.5 Hardcoded fallbacks if API unavailable
- [x] M6.6 Commit: included in main commit

### Milestone 7 — Progress Dashboard ✅
- [x] M7.1 Dashboard screen with stats overview grid
- [x] M7.2 Progress persistence between sessions (versioned localStorage)
- [x] M7.3 Visual progress indicators (badges, clean run counter, best time)
- [x] M7.4 Commit: included in main commit

### Milestone 8 — Polish & Deploy ✅
- [x] M8.1 Mobile responsiveness pass (mobile-first layout throughout)
- [x] M8.2 Animation and UX polish (PWA manifest, App.css, viewport-fit)
- [x] M8.3 Deploy frontend → Vercel
- [x] M8.4 Deploy backend → Railway (Express + PostgreSQL)
- [x] M8.5 Connect frontend to backend (VITE_API_URL env var)
- [x] M8.6 End-to-end test on mobile and desktop
- [x] M8.7 Final commit: "v1.0 — shipped 🚀"

### Milestone 9 — Drill Mode ✅
- [x] M9.1 Drill mode UI (reuses quiz engine, no explanations)
- [x] M9.2 Timer and streak counter
- [x] M9.3 Personal best persistence
- [x] M9.4 Commit: "Drill mode"

### Milestone 10 — Authentication & Per-user Progress ✅
- [x] M10.1 Clerk integration (sign-in / sign-up screens, ClerkProvider, UserButton)
- [x] M10.2 Clerk theme matching Gambit dark aesthetic
- [x] M10.3 Replace localStorage progress with server-side PostgreSQL
- [x] M10.4 JWT-protected API endpoints (requireAuth middleware)
- [x] M10.5 Per-user progress isolation (userId-scoped DB rows)
- [x] M10.6 AppShell auth guard + loading screen
- [x] M10.7 Commit: "Authentication + Postgres progress"

### Milestone 11 — User Profiles & Onboarding ✅
- [x] M11.1 accounts table (display name, birth year, country, chess level, preferred color, goal, gender)
- [x] M11.2 Onboarding flow for new users (?welcome=true redirect)
- [x] M11.3 Profile settings page with segmented controls and age inference
- [x] M11.4 Skip flow (creates empty row so onboarding never repeats)
- [x] M11.5 My Profile + Progress links in UserButton dropdown
- [x] M11.6 Category labels renamed to beginner-friendly names
- [x] M11.7 Commit: "User profiles + onboarding"

### Milestone 12 — Online Presence Widget ✅
- [x] M12.1 In-memory presence store with 90s TTL (no Redis needed)
- [x] M12.2 Heartbeat (POST) + poll (GET) every 30s, sign-off on beforeunload
- [x] M12.3 Pulsing green dot + count in header (CSS @keyframes)
- [x] M12.4 Dropdown showing connected users: avatar, name, gender icon, country flag, level icon
- [x] M12.5 Country name → ISO 3166 → flag emoji utility (countryFlags.ts)
- [x] M12.6 Commit: "Online presence widget"

### Milestone 13 — Chess Ratings & Platform Connections ✅
- [x] M13.1 DB migrations: chess_title, fide_id, fide_rating, chess_com_*, lichess_* columns
- [x] M13.2 Account route updated for all new fields (rowToAccount, POST, PATCH)
- [x] M13.3 ChessTitle type; Account interface extended; OnlineUser.rating field added
- [x] M13.4 fetchChessCom() + fetchLichess() — public APIs, CORS-safe, no key required
- [x] M13.5 Profile page restructured: Personal info / Chess background / Official rating / Platform connections / Your account
- [x] M13.6 PlatformConnector component: Fetch → preview card → Import flow
- [x] M13.7 Background rating refresh on each login (silent, fire-and-forget)
- [x] M13.8 Headline rating in heartbeat (FIDE → rapid → blitz fallback chain)
- [x] M13.9 Online widget shows gold rating badge per user
- [x] M13.10 Commit: "Chess ratings + platform connections"

---

## 7. Out of Scope (v1)
- Multiplayer
- Engine analysis
- Custom opening input by user
- Opening explorer or database search
- Endgame or middlegame training
- Native mobile app (PWA is sufficient)

---

## 8. Backlog (post-v1)
- ~~Opening variation trees (forks, dangerous deviations, known traps)~~ ✅ Done — 9 openings with accept/decline forks, ForkOverlay component
- Deviation Drill mode (quiz with unexpected opponent moves)
- ~~Expand opening library (more White openings, Gambit Accepted lines, more Black vs d4)~~ ✅ Done — 23 openings across all categories
- Animated Gambit app icon
- ~~Playful onboarding copy ("Skip for now" teaser)~~ ✅ Done
- FIDE API integration if it becomes reliably CORS-safe

---

## 9. Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Chess board integration is complex | Test board component first in M2 before building UI |
| Backend deployment issues | Keep backend minimal — single responsibility |
| Time runs out before Quiz | Learn mode alone is a shippable demo |
| AI API unavailable | Hardcoded fallbacks always in place first |
| Opening data entry is time consuming | Use existing PGN databases, copy/paste |

---

## 10. Definition of Done ✅
- [x] App live and publicly accessible
- [x] Learn and Quiz modes working end to end
- [x] At least 5 openings playable (14 implemented)
- [x] Mobile responsive
- [x] No console errors
- [x] Progress saves and persists between sessions (PostgreSQL, per-user)
- [x] Authentication with Clerk
- [x] User profiles with chess context
- [x] Online presence widget
- [x] Chess ratings + platform connections