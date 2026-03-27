# Chess Opening Trainer — Project Brief

## Vision
An interactive chess opening trainer allowing players to study, 
practice and master chess openings from both White and Black perspectives.

## Target User
Chess players of all levels wanting to memorize and understand 
opening theory through structured learning and practice.

## Core Features
- **Learn mode** — step by step opening with strategic explanations
- **Quiz mode** — find the correct move, get feedback
- **Drill mode** — rapid fire practice with timer and streaks
- **Progress tracking** — Not Started / Learning / Mastered per opening

## Openings Coverage
- White: Ruy Lopez, Italian, King's Indian Attack, Queen's Gambit, London
- Black vs e4: Sicilian (Najdorf, Dragon, Scheveningen), French, Caro-Kann
- Black vs d4: King's Indian, Nimzo-Indian, Queen's Gambit Declined

## Tech Stack
- Frontend: React + Vite + Tailwind — deployed on Vercel
- Backend: Node.js/Express — deployed on Railway
- Chess: chess.js + react-chessboard
- AI: Claude Haiku API (via backend proxy)
- Storage: localStorage for progress

## Design Principles
- Dark chess aesthetic (greens, browns, gold)
- Mobile first
- Fast, smooth, bug-free

## Visual Identity
- Dark chess aesthetic
- Primary colors: deep green (#1a2e1a), brown (#4a3728), gold (#c9a84c)
- Piece set: Cburnett or Maestro (from lichess open source library)
- Board: dark squares in deep green (#4a7c59), light squares in cream (#f0d9b5)
- Clean modern typography
- Smooth piece move animations

## Engineering & Process
- Deploy target: Vercel for frontend, Railway for backend
- Set up configuration files for both from the start (vercel.json, railway.toml)
- Maintain an internal task list, updated as each step is completed
- Git repository set up from the beginning — commit after each completed task
- Maintain a CLAUDE.md with core instructions — short and straight to the point
- You are a product designer with a PhD in human-computer interaction, and a super senior principal engineer building architecture that scales and is bug-free. Design and build accordingly.

## Deployment
- Frontend: Vercel
- Backend: Railway
- Configuration files for both set up from day one

## Non-Goals
- No multiplayer
- No engine analysis
- No user accounts (localStorage only)