# BGMI Scrim & Weekly War Tracker

A lightweight website to maintain daily BGMI player data with built-in AI-style analysis prompts.

## What this tracks
- Player-wise daily matches (Scrim / Weekly War)
- Per-match kills
- Per-match position
- Per-match points chased
- Total kills and total points chased
- Average kills and average position
- Player achievements

## AI analysis included
For each player, the dashboard auto-generates improvement points such as:
- Fragging consistency feedback
- Rotation/placement suggestions
- Last 5 match trend analysis

> Current AI analysis is rule-based (runs fully in browser). You can later replace this with an API model for deeper coaching suggestions.

## Run locally
Open `index.html` in your browser.

No backend setup is required for the demo. Data is stored in browser `localStorage`.

## Next recommended upgrades
1. Add login (coach/manager/player roles).
2. Add cloud database (Supabase/Firebase/Postgres).
3. Add team-level analytics charts.
4. Add real AI integration (OpenAI API) to generate personalized training drills from historical match data.
5. Export CSV / weekly report PDF.
