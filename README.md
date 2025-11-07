# Kai Cyber Dashboard

Interactive dashboard for exploring container image vulnerabilities with rich filtering, comparison tools, and data visualizations.

## Prerequisites
- Docker Desktop (includes the `docker compose` CLI)
- Node.js 20+ (only required for running locally without Docker)

## Quick Start (Docker Compose)
1. **Download sample data**
   - Fetch `ui_demo.json` from https://github.com/chanduusc/Ui-Demo-Data/blob/main/ui_demo.json
   - Save the file to `public/ui_demo.json`
2. **Start the dev stack**
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
3. **Open the app**
   - Visit http://localhost:5173
4. **Stop containers**
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

### Helpful Compose commands
```bash
# Run without rebuilding
docker compose -f docker-compose.dev.yml up

# Run in the background
docker compose -f docker-compose.dev.yml up -d

# Follow container logs
docker compose -f docker-compose.dev.yml logs -f
```

## Running Without Docker (optional)
```bash
npm install
npm run dev -- --host
```
The dev server listens on http://localhost:5173. Hot module reloading is enabled by Vite.

## Architecture Overview
- **Frontend framework**: React 18 with TypeScript, bundled by Vite
- **UI toolkit**: Chakra UI for theming, layout, and component primitives
- **Data fetching**: React Query (`@tanstack/react-query`) handles caching and async state
- **Routing**: React Router for page-level navigation (`Dashboard`, `Vulnerability List`, details views)
- **State & hooks**:
  - `useVulnerabilityData` loads and caches the flattened vulnerability dataset
  - `useVulnerabilityById` selects individual CVE records
- **Visualization**: Recharts for CVE trend and comparison charts
- **Lists & performance**: `react-window` is used for virtualized vulnerability lists to handle large datasets
- **Data layer**:
  - `services/dataLoader` streams the JSON file (via fetch or IndexedDB cache)
  - `workers/dataProcessor.worker` offloads parsing to a Web Worker when available
  - `utils/dataTransform` flattens the hierarchical image → repo → group structure into list-friendly records
- **Layout**: `src/components/layout/Layout.tsx` provides a persistent header, footer, and preferences modal. During loading the footer stays pinned via flex layout.

### Repository structure (key folders)
- `src/pages` – top-level pages rendered by the router
- `src/components` – reusable UI elements (vulnerability cards, comparison drawer, charts, settings modal, etc.)
- `src/hooks` – domain-specific hooks for data access
- `src/services` – data loading, caching, and background worker utilities
- `src/types` – TypeScript definitions for vulnerability metadata
- `public` – static assets, including the required `ui_demo.json`

## Development Notes
- Docker Compose mounts the project directory for instant hot reloads
- `public/ui_demo.json` is mounted read-only into the container; update the file locally to refresh data
- Vite dev server exposes the app on port 5173 (configured in `docker-compose.dev.yml`)
- Use `npm run build` to generate an optimized production build if needed
