# REQUIREMENTS.md — Hermes Currency Exchange App

## Project Overview
SPA for real-time currency conversion and historical exchange rate analysis.
API: Frankfurter (https://api.frankfurter.app) — free, no API key.

## Functional Requirements
### FR-01 — Currency Converter
- Select source and target currencies
- Input amount, see converted value in real-time
- Swap currencies button
- Show conversion rate and last updated date

### FR-02 — Historical Chart
- Line chart (Recharts) for exchange rate over time
- Time ranges: 7d, 15d, 30d, 3m, 6m, 1y, 5y, 10y
- Show min, max, average for period

### FR-03 — Data Table
- List historical rates with sorting, filter by date, pagination
- Export to CSV (PapaParse)

## Tech Stack
- React + JSX + Vite
- CSS Modules
- Recharts, Lucide React, date-fns, PapaParse
- fetch + async/await (no Axios)

## API Endpoints
- GET /currencies
- GET /latest?amount={n}&from={from}&to={to}
- GET /{start}..{end}?from={from}&to={to}
