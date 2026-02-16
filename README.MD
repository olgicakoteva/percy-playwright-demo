# 🎭 Playwright + Percy Visual Regression Testing (TypeScript, POM)

A complete end‑to‑end automation setup using **Playwright** for browser automation and **Percy** for visual regression testing.  
The project uses **TypeScript** and a **Page Object Model (POM)** structure, with data‑driven test execution via `src/data/pages.json`.  
It is optimized for Git (no large binaries committed) and ready for CI (GitHub Actions or Jenkins).

---

## 📦 What’s Included

- ✅ Playwright E2E tests (TypeScript)
- ✅ Percy visual snapshots
- ✅ Page Object Model (POM) structure
- ✅ Data‑driven URLs from `pages.json`
- ✅ Clean `.gitignore` (avoids node_modules & heavy artifacts)
- ✅ Ready for CI/CD
- ✅ Example tests (single page + multiple pages)

---

## 📁 Project Structure
percy-playwright-demo-final/
│
├── src/
│   ├── data/
│   │   └── pages.json            # All tested URLs stored here (data-driven)
│   │
│   ├── pages/
│   │   ├── pageFactory.ts        # Factory returning POM classes
│   │   └── pageNavigator.ts      # Navigation + snapshot helpers
│   │
│   ├── tests/
│   │   ├── multiplePages.test.ts # Multi-URL snapshot test (reads pages.json)
│   │   └── pageNavigator.test.ts # Example single-page navigation test
│   │
│   └── utils/                    # Place shared helpers here (optional)
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md

---

## 🛠 Prerequisites

- **Node.js 18+**
- **Git** (optional but recommended for versioning)
- **Percy account** and a project **PERCY_TOKEN**
- **VS Code** recommended

---

## 🚀 Setup & Installation (Run These Once)


1) **Install Node dependencies**
## ```bash
 ## npm install


## Install Playwright browsers
 ## npx playwright install
 ## ``

## Set your Percy token (replace with your real token)
## MAC
 ## export PERCY_TOKEN="your_token_here"
 ## ``
## Windows
 ## setx PERCY_TOKEN "your_token_here"

 ## Run with Percy (visual regression)
 ## npx percy exec -- npx playwright test


## Run Playwright only (no Percy)
## npx playwright test


## Open Playwright HTML report
## npx playwright show-report

## Page Object Model (POM) Overview

## src/pages/pageFactory.ts — Centralized factory to create and return page objects.
## src/pages/pageNavigator.ts — Encapsulates navigation logic and common helpers (e.g., go to URL, wait for load state, snapshot helper).
## src/tests/* — Keep tests lean; delegate flows to POM classes for maintainability.

## Benefits: cleaner tests, reusable flows, and easier scaling as coverage grows.