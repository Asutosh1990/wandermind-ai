# WanderMind AI

A beginner-friendly React + TypeScript mobile-first travel discovery prototype.

## Requirements
- Node.js 20 LTS (or a recent supported Node.js version)
- Visual Studio Code
- Internet connection for installing packages and loading remote demo photos

## Run locally
1. Extract this ZIP.
2. Open the `wandermind-ai` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed in the terminal (usually http://localhost:5173).

## Current prototype features
- Mobile-first Discover screen inspired by the supplied design.
- Editable travel prompt and trip preferences.
- Multi-select travel moods.
- Local sample destination recommendations and simple preference ranking.
- Destination detail screen.
- Save/remove destinations using browser localStorage.
- Discover, Saved and Profile navigation.

## Important
Recommendations, match percentages, budgets and destination details are illustrative mock data. They are not live prices, availability or AI-generated travel advice. The microphone button is visual only. No login, booking, payment or real AI integration is included yet.

## Project structure
- `src/App.tsx` — screens, state and interactions
- `src/data/destinations.ts` — sample destination data
- `src/styles.css` — visual design and responsive layout
- `src/types.ts` — TypeScript data types
