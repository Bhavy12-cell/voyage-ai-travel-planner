<div align="center">

# 🧭 Voyage AI

### Autonomous Multi-Agent Travel Itinerary Orchestrator

*Design your dream journey in seconds — powered by five cooperating AI agents*

[![Gemini](https://img.shields.io/badge/LLM-Gemini%203.5%20Flash-8B5CF6?style=for-the-badge)](https://ai.google.dev/)
[![Track](https://img.shields.io/badge/Track-Concierge%20Agents-F0997B?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-1D9E75?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Live%20Demo-22C55E?style=for-the-badge)]()

**[🚀 Live Demo](#)** &nbsp;•&nbsp; **[🎥 Video Walkthrough](#)** &nbsp;•&nbsp; **[📄 Kaggle Writeup](#)**

</div>

<br>

<div align="center">
<img src="assets/cover-banner.png" alt="Voyage AI cover banner" width="100%">
</div>

<br>

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Why Agents?](#-why-agents)
- [Architecture](#-architecture)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Key Concepts Demonstrated](#-key-concepts-demonstrated)
- [Future Enhancements](#-future-enhancements)

<br>

## 🧩 The Problem

Planning a trip today means juggling a dozen open tabs — one for attractions,
another for currency conversion, another for weather, another for safety
advisories. It's slow, fragmented, and easy to get wrong, especially for
first-time visitors to a new place.

## ✨ The Solution

**Voyage AI** consolidates all of that research into a single, intelligent,
autonomous workflow. Give it a destination, trip duration, budget, traveler
count, and interests — and it generates a complete, personalized, day-by-day
itinerary in seconds, complete with real photography, weather-aware planning,
safety information, local language help, a packing checklist, and a
downloadable PDF.

## 🤖 Why Agents?

A single LLM call struggles to reliably balance multiple competing
constraints — budget, weather, safety, interests — all at once. Voyage AI
splits the problem across **five specialized, cooperating agents**, each with
a narrow responsibility, converging into one coherent plan. This makes the
reasoning transparent and auditable through live agent orchestration logs,
rather than a black box.

<br>

## 🏗️ Architecture

<div align="center">
<img src="assets/architecture-diagram.png" alt="Voyage AI multi-agent architecture diagram" width="85%">
</div>

```
User Input (destination, days, budget, travelers, interests)
                    │
                    ▼
         Itinerary Coordinator Agent
                    │
      ┌─────────────┼──────────────┬────────────────┐
      ▼             ▼              ▼                ▼
 Places Agent   Budget Agent   Weather Agent    Safety & Language
                                                       Agent
      │             │              │                  │
      └─────────────┴──────────────┴──────────────────┘
                    ▼
   Final day-wise itinerary + Packing Checklist
        + Shareable Poster + Full PDF Export
```

| Agent | Responsibility |
|---|---|
| 🗺️ **Places Agent** | Discovers attractions, restaurants & photo spots; fetches real photography via Unsplash |
| 💰 **Budget Agent** | Dynamically allocates and scales cost across accommodation, food, activities & transport |
| 🌤️ **Weather Agent** | Fetches forecasts and reshapes activities accordingly (indoor swap on rain, etc.) |
| 🛡️ **Safety & Language Agent** | Surfaces emergency numbers, nearest hospital/embassy, currency rates & local phrases |
| 🧭 **Itinerary Coordinator** | Orchestrates all agents and merges outputs into one cohesive plan |

<br>

## 🎯 Features

| | |
|---|---|
| 🗓️ Multi-agent day-by-day itinerary | 💰 Smart, dynamically-scaled budget dashboard |
| 🌤️ Weather-aware activity planning | 🛡️ Destination safety & emergency info |
| 🗣️ Local currency & travel phrases | 🎒 Auto-generated packing checklist |
| 📸 Best photo-spot recommendations | 🖼️ Real destination photography |
| 📄 One-click full itinerary PDF export | 🪧 Downloadable shareable trip poster |

<br>

## 🖼️ Screenshots

<div align="center">

<img src="assets/screenshot-homepage.png" alt="Voyage AI homepage" width="90%">
<br><em>Homepage — quick-select destinations & smart cost scaling</em>

<br><br>

<img src="assets/screenshot-itinerary.png" alt="Generated day-wise itinerary" width="90%">
<br><em>Generated day-wise itinerary with real place photography</em>

<br><br>

<img src="assets/screenshot-budget-safety.png" alt="Budget dashboard and safety panel" width="90%">
<br><em>Budget dashboard, weather, safety & language panels</em>

</div>

<br>

## 🛠️ Tech Stack

- **LLM:** Google Gemini 3.5 Flash
- **Agent Orchestration:** Custom TypeScript orchestrator with a tool-calling loop
- **Backend:** Node.js + Express
- **Frontend:** React (TypeScript) + Vite
- **Images:** Unsplash API (free tier)
- **PDF Generation:** Client-side (jsPDF / html2pdf)
- **Hosting:** Google AI Studio / Cloud Run

<br>

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/Bhavy12-cell/voyage-ai-travel-planner.git
cd voyage-ai-travel-planner

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then fill in your own keys in .env:
#   GEMINI_API_KEY=your_gemini_api_key_here
#   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# 4. Run locally
npm run dev
```

- Get a free Gemini API key → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Get a free Unsplash API key → [unsplash.com/developers](https://unsplash.com/developers)

Then open `http://localhost:3000` in your browser.

<br>

## 🔑 Key Concepts Demonstrated

- ✅ **Multi-agent system** — five cooperating agents orchestrated by a central coordinator (`src/agents/orchestrator.ts`)
- ✅ **MCP-style tool calling** — Places Agent runs tool calls through a structured tool interface
- ✅ **Security** — API keys are loaded server-side only, never exposed to the client; no user data persists beyond the session
- ✅ **Deployability** — deployed as a live, publicly accessible web application
- ✅ **Agent skills** — structured tool-calling loop with defensive parsing and graceful fallback handling

<br>

## 🔮 Future Enhancements

- User authentication to save and revisit past itineraries
- Multi-language UI support
- Collaborative trip planning for groups

<br>

---

<div align="center">

**Built for the Kaggle "AI Agents: Intensive Vibe Coding" Capstone Project**

Track: **Concierge Agents** &nbsp;|&nbsp; License: **Apache 2.0**

</div>`
