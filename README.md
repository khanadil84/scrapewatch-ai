<div align="center">

# ScrapeWatch AI

### Autonomous Web Intelligence — Detect. Scrape. Understand. Recover.

**An AI-powered web scraping platform that makes data collection reliable, observable, and self-healing.**

When websites change their structure, traditional scrapers silently break. ScrapeWatch AI detects changes, diagnoses failures, generates repair instructions, and verifies recovery — turning fragile scraping scripts into resilient, monitored data pipelines.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bright Data](https://img.shields.io/badge/Bright_Data-Integration-FF6B35)](https://brightdata.com)

[Add Demo URL] · [Report Bug](https://github.com/[Add Repo URL]/issues) · [Request Feature](https://github.com/[Add Repo URL]/issues)

</div>

---

## The Problem

Web scraping is fundamentally fragile.

Websites change their layouts, rename CSS selectors, restructure HTML, and alter data formats — often without notice. The result?

- **Scrapers break silently.** A selector stops matching, the script returns empty data, and nobody notices for days.
- **Monitoring is disconnected from scraping.** You might have a scraper and a separate monitoring tool, but they don't talk to each other.
- **Recovery is manual.** When a scraper fails, a human must inspect the page, identify the change, update selectors, and redeploy.
- **Debugging is painful.** Was it a network error? A changed selector? A rate limit? An CAPTCHA? You dig through logs to find out.
- **Stale data goes undetected.** Without freshness checks, you might be making decisions on data that hasn't updated in weeks.

Traditional scraping tools treat the problem as "fetch HTML, parse it, done." But production data collection is a continuous lifecycle — and it needs a platform built for that reality.

---

## The Solution

ScrapeWatch AI treats web scraping as a **continuous, observable, self-healing pipeline** — not a one-shot script.

```
 ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ DISCOVER │───▶│  SCRAPE  │───▶│ OBSERVE  │───▶│  DETECT  │───▶│  RECOVER │───▶│ VERIFY   │
 │          │    │          │    │          │    │  CHANGES │    │          │    │          │
 │ Identify │    │ Collect  │    │ Monitor  │    │ Diagnose │    │  Repair  │    │ Confirm  │
 │  targets │    │   data   │    │  health  │    │ failures │    │ workflow │    │  health  │
 └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

Instead of "run a script and hope it works," ScrapeWatch AI continuously monitors, detects structural changes, generates repair instructions, and verifies recovery — all through a single, integrated platform.

---

## Key Features

### Smart Web Scraping

Trigger real-time data collection through the dashboard. ScrapeWatch AI connects to [Bright Data](https://brightdata.com) Scraper Studio to execute collections against live targets. Each run is tracked, timed, and logged — you always know what ran, when, and how it performed.

```
POST /api/scraper/run          →  Triggers Bright Data collection
GET  /api/scraper/poll         →  Polls collection status (202 → 200)
GET  /api/scraper/data         →  Returns normalized scraped records
```

### Data Explorer

Browse extracted structured data with search, sort, and pagination. The Data Explorer displays records returned from live collections — product names, prices, ratings, availability status — in a paginated, searchable table.

- Text search across product names and prices
- Sort by product name, price, or rating
- 8 records per page with full pagination controls
- Refresh fetches the latest snapshot instantly

### Change Detection

ScrapeWatch AI monitors target websites for structural changes — selector modifications, DOM restructures, pagination changes, and layout shifts. Each detected change is classified by severity (high, medium, low) and tracked through its lifecycle:

| Status | Meaning |
|---|---|
| **Automatically Repaired** | AI generated a repair instruction and the scraper recovered |
| **Monitoring** | Change detected, watching for impact on extraction |
| **Pending Review** | Change requires human review before automated action |

### Self-Healing Scrapers

When extraction fails, ScrapeWatch AI doesn't just alert — it diagnoses and repairs. The self-healing engine follows a 7-step workflow:

```
Idle → Change Detected → Analyzing → Repair Generated → Awaiting Approval → Verification → Recovered
```

The system generates specific repair instructions (e.g., "The price field is returning invalid data. Restore the price extraction while preserving the existing output schema.") and can verify recovery against the live collector.

**Production repair verification** is built in — after a repair, the system calls the live API to confirm data integrity before marking recovery complete.

### Bright Data Integration

ScrapeWatch AI integrates directly with [Bright Data](https://brightdata.com) Scraper Studio for production-grade web data collection:

- **Trigger**: `POST /dca/trigger` with collector ID and target URL
- **Poll**: `GET /dca/dataset?id=<collectionId>` — handles 202 (building) and 200 (complete)
- **Normalize**: Raw Bright Data responses are transformed into structured `ScrapedRecord` objects
- **Verify**: Post-recovery verification fetches fresh data from the live collector

The API token stays server-side only — it is never exposed to the browser.

### Live Monitoring

The dashboard provides real-time visibility into scraper health:

- **KPI Cards** — Records collected, run success rate, live collector count, failed crawls
- **System Health** — Collector health, extraction integrity, schema stability, average recovery time (animated ring gauges)
- **Activity Feed** — Timestamped event timeline with type-specific icons and live/demo badges
- **Live Scrapers** — Per-collector status cards with success rates, record counts, and run controls

### Failure Detection

Errors are surfaced immediately through the UI — not buried in logs. The Activity Feed shows collector completions, change detections, healing events, and schema verifications with color-coded severity and live/demo source badges.

---

## Why ScrapeWatch AI?

| Traditional Scraping | ScrapeWatch AI |
|---|---|
| Manual monitoring required | Automated, continuous monitoring |
| Broken selectors go unnoticed | Structural changes detected in real time |
| Silent failures return empty data | Failures surfaced with diagnostic context |
| Manual recovery per incident | Automated repair instruction generation |
| Static scripts, no observability | Full pipeline visibility from trigger to verification |
| Disconnected tools | Single integrated platform |

---

## Architecture

flowchart LR
    subgraph Frontend ["Frontend - React + TypeScript + Vite"]
        UI[Dashboard UI]
        DE[Data Explorer]
        TP[TopNav Trigger]
        DS[Data Service Layer]
    end

    subgraph Backend ["Backend - Node.js Zero Dependencies"]
        API[REST API]
        NORM[Normalizer]
        CACHE[Cache / Snapshot]
    end

    subgraph External ["External Services"]
        BD[Bright Data Scraper Studio]
    end

    subgraph Data ["Data Layer"]
        R[://toscrape.com]
    end

    TP -->|POST /api/scraper/run| API
    DE -->|GET /api/scraper/data| API
    DS -->|GET /api/scraper/poll| API
    API -->|POST /dca/trigger| BD
    API -->|GET /dca/dataset| BD
    BD -->|202 building / 200 data| API
    R --> BD
    API --> NORM
    NORM --> CACHE
    CACHE -->|ScrapedRecord[]| UI
    UI --> DE

### Project Structure

```
scrapewatch-ai/
├── server.mjs                          # Node.js API server (zero deps)
├── brightdata-result.json              # Cached Bright Data snapshot
├── src/
│   ├── App.tsx                         # Root app with tab-based navigation
│   ├── main.tsx                        # Entry point
│   ├── types/index.ts                  # TypeScript interfaces
│   ├── hooks/useLiveScrapedData.ts     # Live data fetching hook
│   ├── services/brightData/            # Bright Data service layer
│   │   ├── types.ts                    # Service interface
│   │   ├── fetch.ts                    # Real API implementation
│   │   ├── mock.ts                     # Mock implementation
│   │   ├── normalize.ts               # Response normalizer
│   │   └── index.ts                   # Service switch
│   ├── data/mock.ts                    # Demo data
│   └── components/
│       ├── layout/
│       │   ├── TopNav.tsx              # Navigation + Run Scraper trigger
│       │   └── Sidebar.tsx             # Collapsible sidebar
│       └── features/
│           ├── dashboard/
│           │   ├── HeroSection.tsx     # Animated SVG pipeline visualization
│           │   ├── KPICards.tsx        # Metric cards with sparklines
│           │   └── SystemHealth.tsx    # Ring gauge health metrics
│           ├── scrapers/LiveScrapers.tsx   # Collector monitoring cards
│           ├── data/DataExplorer.tsx       # Paginated data table
│           ├── changes/ChangeDetection.tsx # Change event feed
│           ├── healing/SelfHealingPanel.tsx # Self-healing workflow
│           └── activity/ActivityFeed.tsx   # Event timeline
├── vite.config.ts                      # Vite config with API proxy
├── tailwind.config.js                  # Custom dark theme
├── tsconfig.json                       # Strict TypeScript config
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 22)
- **npm** 9+
- A [Bright Data](https://brightdata.com) account with Scraper Studio access

### Installation

```bash
# Clone the repository
git clone https://github.com/[Add Repo URL].git
cd scrapewatch-ai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Required — Bright Data API token (server-side only, never exposed to browser)
BRIGHTDATA_API_TOKEN=your_bright_data_token

# Optional — Collector ID (defaults to c_mt5ryoya2bepdq2a8c)
BRIGHTDATA_COLLECTOR_ID=c_mt5ryoya2bepdq2a8c

# Optional — Server port (defaults to 3001)
PORT=3001
```

> **Security**: `BRIGHTDATA_API_TOKEN` is read only by `server.mjs`. It is never included in frontend code, never sent to the browser, and `.env` is gitignored.

### Development

```bash
# Start both backend and frontend
npm run dev:all

# Or start them separately:
npm run dev:server   # Backend on http://localhost:3001
npm run dev          # Frontend on http://localhost:5173
```

### Production

```bash
# Build and start
npm start

# This runs: tsc -b && vite build && node server.mjs
# The server serves the built frontend from dist/ and handles API routes
```

---

## API Reference

### `POST /api/scraper/run`

Triggers a new Bright Data collection. Returns immediately with a collection ID.

```json
{
  "success": true,
  "collectionId": "j_mt5x...",
  "collectorId": "c_mt5ryoya2bepdq2a8c",
  "status": "triggered"
}
```

### `GET /api/scraper/poll?collectionId=<id>`

Polls the status of a collection. Returns `202` with `{"status":"building"}` while in progress, or `200` with the dataset array when complete.

### `GET /api/scraper/data`

Returns the current cached dataset. Normalized into `ScrapedRecord[]` with 20 fields per record.

```json
{
  "source": "local",
  "collectorId": "c_mt5ryoya2bepdq2a8c",
  "recordCount": 20,
  "records": [
    {
      "id": "bd_1_...",
      "product": "A Light in the Attic",
      "price": "£51.77",
      "rating": 3,
      "availability": "In stock",
      "lastUpdated": "2025-01-15T...",
      "collectorId": "c_mt5ryoya2bepdq2a8c",
      "status": "healthy"
    }
  ]
}
```

### `GET /api/scraper/status`

Returns collector health, record count, extraction integrity, and last verified timestamp.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, TypeScript 5.6, Vite 6 | SPA with type-safe components |
| Styling | Tailwind CSS 3.4, PostCSS | Dark glassmorphism UI |
| Backend | Node.js `http` module | Zero-dependency API server |
| Data Collection | Bright Data Scraper Studio | Production-grade web scraping |
| Icons | Lucide React | Consistent icon system |
| Fonts | Inter, JetBrains Mono | UI and code typography |

---

## Security

- **API tokens are server-side only.** `BRIGHTDATA_API_TOKEN` is read from `.env` by `server.mjs` and never reaches the browser.
- **`.env` is gitignored.** The token file is not committed to version control.
- **CORS is configured.** The API server sets appropriate `Access-Control-Allow-*` headers.
- **No secrets in frontend code.** The React application makes requests to `/api/*` endpoints which are proxied to the backend.

---

## Error Handling

- **API failures** return structured JSON errors with HTTP status codes
- **Bright Data 202 responses** (collection in progress) are handled gracefully with polling
- **Bright Data 404/502 responses** propagate to the frontend with clear error messages
- **Frontend loading states** show spinners during data fetching
- **Frontend error states** display error messages with fallback behavior
- **The backend never crashes** on failed requests — all errors are caught and returned as JSON

---

## Roadmap

- [ ] Real-time DOM diffing for live change detection
- [ ] Automated selector repair without manual approval
- [ ] Multi-target scraping with scheduling (cron-like)
- [ ] Data freshness monitoring and staleness alerts
- [ ] Webhook integrations (Slack, Discord, email)
- [ ] Historical data versioning and diff views
- [ ] User authentication and team collaboration
- [ ] Browser extension for visual selector configuration
- [ ] Support for headless browser scraping (Playwright/Puppeteer)
- [ ] Export to CSV, JSON, and database connectors

---

## License

This project is currently not licensed. Contact the maintainers for usage terms.

---

<div align="center">

**Built for the hackathon. Designed for production.**

ScrapeWatch AI — Because scraping should be reliable.

</div>
