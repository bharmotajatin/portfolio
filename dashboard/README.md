# BIRD AIRPORT SERVICES – Scheduled Flight Dashboard

A full-featured **Scheduled Flight Dashboard** built with **React**, **Three.js**, and **Framer Motion**. The theme follows the BIRD AIRPORT SERVICES style (first image); data and parameters follow the flight performance table by category and airline (second image).

## Features

- **Theme (image 1):** Header with logo and nav, KPI cards (Total Flights, Active, Cancelled, Status Overview), metric cards (Top Airlines, Flight Types, Delay Flights), and charts (bar, area, pie).
- **Data (image 2):** Flight performance table with columns: Cancelled Flight, Flight Arrived Later Than STA, And Departed On Or Before STD, And Departed Within The SGT, GHA / Non-GHA attribution, On Time Flights, Exceeding SGT, TOTAL, etc., with COMBINED and per-airline rows.
- **Tech:** React 18, Vite, Three.js (via `@react-three/fiber` + `@react-three/drei`), Framer Motion, Recharts.
- **Animations:** Staggered card/chart entrance, hover on KPI cards, animated table rows, 3D floating shapes in the background.

## Run locally

```bash
cd scheduled-flight-dashboard
npm install
npm run dev
```

Open **http://localhost:5174/** in your browser.

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Project structure

- `src/App.jsx` – Main layout, Canvas, header, filters, KPIs, metrics, charts, table.
- `src/components/` – Header, KPICards, MetricCards, ChartsSection (bar, area, pie, service rating), FlightDataTable, ThreeScene.
- `src/data/flightData.js` – Mock rows and columns for the flight table, KPI/metric/chart helpers.

You can replace the mock data in `flightData.js` with real API calls or state management when wiring to a backend.
