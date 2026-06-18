<<<<<<< HEAD
# Empirical Lab

Game-based empirical economics training for causal inference, panel data, data acquisition, and research workflows.

## Overview

A single-page web application built for economics master's students who already know basic R/Python and want to master:

- Fixed Effects & Panel Data
- Difference-in-Differences & Event Studies
- Data Acquisition with Playwright
- Reproducible Research Workflows

## Features

- 20+ interactive levels (MCQ, code challenges, research memos, workflow ordering)
- 4 quest lines with boss projects
- XP, badges, streaks, and rank progression
- Skill tree tracking concept mastery
- Method notes, glossary, and toolkit reference
- Full bilingual support (EN/ZH)
- Dual-theme UI: Dark (Tactical Telemetry) / Light (Swiss Industrial Print)
- Progress backup via JSON export/import
- Zero dependencies, pure vanilla JS

## Tech Stack

- Vanilla JavaScript (single IIFE, no framework)
- CSS custom properties for theming
- Local fonts: Maple Mono, Anthropic Serif
- localStorage for progress and preferences
- No build step required

## Getting Started

```bash
# Serve locally
python -m http.server 8080
# or
npx serve .
```

Open http://localhost:8080 in your browser.

## Scripts

```bash
npm run check   # Syntax check (node --check app.js)
npm test        # Run 43 smoke tests
```

## File Structure

```
index.html          # App shell
app.js              # Application logic, routing, i18n, rendering
styles.css          # Industrial Brutalism dual-theme stylesheet
tests/smoke.cjs     # Smoke test suite
maple-mono_5.2.6/   # Maple Mono font files (woff2)
Anthropic Serif-fontiko/  # Anthropic Serif font files (otf)
```

## Design

Industrial Brutalism aesthetic with two modes:

- **Dark mode**: CRT terminal style, scanlines, monospace dominance, grayscale palette
- **Light mode**: Swiss Industrial Print, matte paper, heavy rules, sharp geometry

All corners are 90 degrees. No gradients, no shadows, no border-radius.
=======
# empirical-lab
>>>>>>> 311870768f27b10b36b2af3d812d85d455831e80
