# Kai Cyber Dashboard - Local Development

## Prerequisites
- Docker & Docker Compose installed

## Setup

1. **Place JSON file:**
   - Download `ui_demo.json` from: https://github.com/chanduusc/Ui-Demo-Data/blob/main/ui_demo.json
   - Place it in `public/ui_demo.json`

2. **Start development server:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Open browser:**
   - Navigate to: http://localhost:5173

## Development Commands

### Start containers:
```bash
docker-compose -f docker-compose.dev.yml up
```

### Start in background:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Stop containers:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Rebuild containers:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### View logs:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

## Notes

- Hot reload is enabled (changes reflect immediately)
- JSON file is mounted as volume (not copied into image)
- Container image stays small (~200-300MB)
- Port 5173 is exposed for Vite dev server

