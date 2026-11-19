# UG Project — ep-dispatch-atc

ATC Seattle dispatch management frontend. Manages flaggers, jobs, assignments, and scheduling for the Seattle branch.

## Architecture

This is a **junior dev** React frontend app that consumes components and hooks from `@the-universal-group/ui-react`. It does NOT make direct API calls to `ug-data` — all data wiring happens in the protected `ug-ui-react` package.

```
ug-ep-dispatch-atc (this app)
  └── imports FlaggerList, useFlaggers, etc. from @the-universal-group/ui-react
        └── makes API calls to ug-data /dispatch/* endpoints
```

### Why this structure

- **Protected data layer**: API client logic, auth token handling, and React Query setup live in `ug-ui-react` (senior dev repo)
- **Reusable components**: Multiple dispatch apps (ATC, Tri-Cities, etc.) can share the same UI components
- **Consistent behavior**: All dispatch apps get the same data fetching, caching, and error handling patterns
- **Capability requests**: When this app needs new features, submit a capability request to `ug-ui-react` rather than building custom solutions

## Key Commands

- `npm run dev` — start dev server on port 3030
- `npm run build` — build production bundle
- `npm run lint` — type-check without emitting
- `npm test` — run tests

## Development

### Local development

```bash
cd ~/path/to/ug-docker
./link ug-ep-dispatch-atc
cd repos/ug-ep-dispatch-atc
npm install
cd ../..
docker compose up --build ug-ep-dispatch-atc
```

Visit http://localhost:3030

### Branch filter

This app defaults to filtering all dispatch data by `branch: "seattle"` since it's the ATC Seattle-specific frontend. The branch filter is set in `App.tsx`:

```typescript
const { data: flaggers } = useFlaggers({ branch: 'seattle' });
```

## Dependencies

- `@the-universal-group/ui` — shared UI theme and base components
- `@the-universal-group/ui-react` — dispatch components and hooks
- `@tanstack/react-query` — data fetching (configured by ug-ui-react)
- `antd` — UI component library
- `react` / `react-dom` — React framework
- `vite` — build tool and dev server

## Component Usage

### FlaggerList

```typescript
import { FlaggerList, useFlaggers } from '@the-universal-group/ui-react';

function MyComponent() {
  const { data: flaggers, isLoading, error } = useFlaggers({ branch: 'seattle' });

  return (
    <FlaggerList
      flaggers={flaggers || []}
      onSelect={(flagger) => {
        console.log('Selected:', flagger);
      }}
    />
  );
}
```

### Available hooks

From `@the-universal-group/ui-react/dispatch`:

- `useFlaggers(params?)` — list flaggers
- `useFlagger(id)` — get single flagger
- `useFlaggerMutations()` — create/update/delete flaggers
- `useJobs(params?)` — list jobs
- `useJob(id)` — get single job
- `useJobMutations()` — create/update/delete jobs
- Similar patterns for assignments, customers, contacts, trucks, skills, tags, certifications, availability

## Authentication

Auth is handled by `UgProvider` from `@the-universal-group/ui-react`. The provider:

1. Manages Google OAuth token
2. Exchanges it for a ug-data JWT via `POST /auth/token`
3. Injects the token into all API requests

No auth code needed in this app — just wrap everything in `<UgProvider>`.

## Adding New Features

### If the component exists in ug-ui-react

Import and use it:

```typescript
import { JobBoard, useJobs } from '@the-universal-group/ui-react';
```

### If the component doesn't exist

Submit a capability request to `ug-ui-react`:

```typescript
// Example capability request structure (submit via ug-data API)
{
  requesterRepo: 'ug-ep-dispatch-atc',
  recipientRepo: 'ug-ui-react',
  capability: 'JobBoard component with real-time updates',
  justification: 'ATC needs to view all active jobs in a board layout',
  blockedWork: 'Cannot build dispatch dashboard view without job board',
  status: 'pending'
}
```

See `DEVELOPMENT-LEVELS.md` in the ug-docker root for full capability request workflow.

## Deployment

This app deploys as a static site to S3 + CloudFront:

1. Vite builds the production bundle (`npm run build`)
2. GitHub Actions uploads `dist/` to S3
3. CloudFront serves the app

The SAM template (`template.yml`) defines the S3 bucket, CloudFront distribution, and origin access control.

## Environment-specific config

The app reads runtime config from `window.ugConfig`:

```typescript
window.ugConfig = {
  apiUrl: 'https://api.theuniversalgroup.ca', // prod
  // or 'http://localhost:3001' in dev
};
```

Config injection happens in `index.html` or via environment-specific builds.

## Docker Compose

Registered in the ug-docker compose.yml:

```yaml
ug-ep-dispatch-atc:
  image: ghcr.io/the-universal-group/ug-ep-dispatch-atc:latest
  ports:
    - "3030:3030"
  volumes:
    - ~/.aws:/root/.aws:ro
  environment:
    - UG_ENV=dev
```

## Rules

- Never make direct API calls to `ug-data` — always use hooks from `@the-universal-group/ui-react`
- Never copy components from `ug-ui-react` into this repo — import them
- Keep the branch filter set to `"seattle"` unless building a multi-branch view
- All pushes to `main` trigger deployment
- Version bumps happen automatically via CI/CD
- No secrets in this repo — auth is handled by `UgProvider`

## Documentation

For dispatch API reference, component props, and data models:

```
../../docs/
```

For deployment and CI/CD details:

```
node_modules/@the-universal-group/core/skills.md
```
