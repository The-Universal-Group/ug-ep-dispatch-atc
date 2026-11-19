# ug-ep-dispatch-atc

ATC Seattle dispatch management frontend.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3030

## What This Is

A React frontend for managing ATC Seattle's dispatch operations:
- Flagger management
- Job scheduling
- Assignment tracking
- Availability management

## Architecture

This app imports UI components and data hooks from `@the-universal-group/ui-react`. It does NOT make direct API calls — all data wiring happens in the shared component library.

See `CLAUDE.md` for full details.

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run lint
```

## Docker

```bash
# From ug-docker root
./link ug-ep-dispatch-atc
docker compose up --build ug-ep-dispatch-atc
```

## License

Private — The Universal Group
