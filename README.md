# Voyage AI — Autonomous Travel Itinerary Orchestrator

**Track:** Concierge Agents
**Built for:** Kaggle — AI Agents: Intensive Vibe Coding Capstone Project

🔗 **Live Demo:** https://travel-itinerary-planner-ai-agent-826700842796.asia-southeast1.run.app/
🎥 **Video Demo:** [Coming Soon]

---

## Problem Statement

Planning a trip is time-consuming and overwhelming. Travelers have to manually
research attractions, estimate costs, check weather, learn local phrases,
figure out currency conversion, and look up safety information — all across
different websites and apps. This fragmented process wastes hours and often
leaves travelers with incomplete or unbalanced plans.

## Solution

Voyage AI is a multi-agent travel planning system that takes a destination,
trip duration, budget, number of travelers, and interests as input, and
autonomously generates a complete, personalized, day-by-day travel itinerary
in seconds — combining attractions, dining, budget breakdown, weather-aware
planning, safety information, local language help, a packing checklist, and
a downloadable PDF, all in one place.

## Why Agents?

A single-prompt LLM call struggles to reliably balance multiple competing
constraints (budget, weather, interests, safety) at once. By splitting the
problem across cooperating specialized agents — each with a narrow
responsibility — the system produces more accurate, consistent, and
explainable results, while making the reasoning process transparent through
visible agent logs.

## Agent Architecture

```
User Input (destination, days, budget, travelers, interests)
                    │
                    ▼
         Itinerary Coordinator Agent
         (orchestrates the full flow)
                    │
      ┌─────────────┼──────────────┬───────────────┐
      ▼             ▼              ▼                ▼
 Places Agent   Budget Agent   Weather Agent   Safety/Language
 (attractions,  (allocates &   (fetches        Agent (emergency
 restaurants,   scales cost    forecast,       info, local
 photo spots    across          adjusts plan    phrases, currency
 via Unsplash)  categories)     accordingly)    conversion)
      │             │              │                │
      └─────────────┴──────────────┴────────────────┘
                    ▼
        Final structured day-wise itinerary
     + Packing Checklist + Shareable Trip Poster
              + Full Itinerary PDF Export
```

### Agents & Responsibilities

| Agent | Responsibility |
|---|---|
| **Places Agent** | Discovers attractions, restaurants, and photo-worthy spots for the destination and interests; fetches real place photos via the Unsplash API |
| **Budget Agent** | Dynamically allocates and scales the total budget across accommodation, food, activities, and transport based on traveler count and currency |
| **Weather Agent** | Fetches expected weather conditions for the trip dates and adjusts activity suggestions (e.g., indoor options during rain) |
| **Safety & Language Agent** | Surfaces destination-specific emergency numbers, nearest hospital/embassy info, safety tips, local currency conversion, and essential travel phrases |
| **Itinerary Coordinator Agent** | Combines all agent outputs into a single, coherent, day-by-day itinerary and manages the end-to-end orchestration |

## Key Concepts Demonstrated

- **Multi-agent system** — five cooperating agents with distinct responsibilities, orchestrated by a central coordinator (see `src/agents/orchestrator.ts`)
- **MCP Server** — Places Agent tool-calls run through an MCP-style tool interface to fetch place and photo data
- **Security features** — API keys are loaded server-side only via environment variables and are never exposed to the client; no user data is persisted beyond the session
- **Deployability** — deployed as a live, publicly accessible web application via Google AI Studio / Cloud Run
- **Agent skills** — structured tool-calling loop with defensive parsing and graceful fallback handling when a tool or model response fails

## Features

- 🗺️ Multi-agent day-by-day itinerary generation
- 💰 Smart, dynamically-scaled budget dashboard with category-wise cost breakdown
- 🌤️ Weather-aware activity planning
- 🛡️ Destination safety, health, and emergency information
- 🗣️ Local currency conversion and essential travel phrases
- 🎒 Auto-generated, interactive packing checklist
- 📸 Best photo-spot recommendations with golden-hour tips
- 🖼️ Real destination photos for every listed place
- 📄 One-click full itinerary PDF export for offline access
- 🪧 Downloadable, shareable trip summary poster

## Tech Stack

- **LLM:** Google Gemini 3.5 Flash
- **Agent Orchestration:** Custom TypeScript orchestrator with tool-calling loop
- **Backend:** Node.js + Express
- **Frontend:** React (TypeScript) + Vite
- **Images:** Unsplash API (free tier)
- **PDF Generation:** Client-side PDF export (jsPDF / html2pdf)
- **Hosting:** Google AI Studio / Cloud Run

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone <this-repo-url>
   cd voyage-ai-travel-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (see `.env.example`) and add your own keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```
   - Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Get a free Unsplash API key at [unsplash.com/developers](https://unsplash.com/developers)

4. Run the app locally:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0a1d1406-08c4-49e7-97f9-c9f2431d9fa7" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4e029a2c-d2ab-4218-91f3-c94fbdc5a8da" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e05df57c-1d9f-4e83-b9b0-7354d84bdb61" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c5a73d36-b5d1-4048-a7c2-3df1be629708" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/53554481-c3ca-441a-9c98-6c1bc117c065" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8d97dbce-a362-4bdc-8ff7-68081f9fae83" />







## Future Enhancements

- User authentication to save and revisit past itineraries
- Multi-language UI support
- Collaborative trip planning for groups

## License

Apache-2.0
