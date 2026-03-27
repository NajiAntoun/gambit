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

### Milestone 8 — Polish & Deploy
- [x] M8.1 Mobile responsiveness pass (mobile-first layout throughout)
- [x] M8.2 Animation and UX polish (PWA manifest, App.css, viewport-fit)
- [ ] M8.3 Deploy frontend → Vercel
- [ ] M8.4 Deploy backend → Railway
- [ ] M8.5 Connect frontend to backend (VITE_API_URL env var)
- [ ] M8.6 End-to-end test on mobile and desktop
- [ ] M8.7 Final commit: "v1.0 — shipped 🚀"

### Milestone 9 — Drill Mode (If Time Permits)
- [ ] M9.1 Drill mode UI
- [ ] M9.2 Timer and streak counter
- [ ] M9.3 Personal best persistence
- [ ] M9.4 Commit: "Drill mode"

---

## 7. Out of Scope (v1)
- Multiplayer
- Engine analysis
- User accounts or cloud sync
- Custom opening input by user
- Opening explorer or database search
- Endgame or middlegame training
- Native mobile app (PWA is sufficient for v1)

---

## 8. Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Chess board integration is complex | Test board component first in M2 before building UI |
| Backend deployment issues | Keep backend minimal — single responsibility |
| Time runs out before Quiz | Learn mode alone is a shippable demo |
| AI API unavailable | Hardcoded fallbacks always in place first |
| Opening data entry is time consuming | Use existing PGN databases, copy/paste |

---

## 9. Definition of Done
- [ ] App live and publicly accessible ✅
- [ ] Learn and Quiz modes working end to end ✅
- [ ] At least 5 openings playable ✅
- [ ] Mobile responsive ✅
- [ ] No console errors ✅
- [ ] Progress saves and persists between sessions ✅