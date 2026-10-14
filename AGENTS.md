# AGENTS.md - spending-insights-dashboard

## Project

Customer Spending Insights Dashboard.
Mock-first, MSW-backed, TanStack Query + Zustand.

## Commands

- `yarn install` - install
- `yarn dev` - dev server
- `yarn build` - production build
- `yarn test` - Vitest
- `yarn test:affected` - run Vitest tests affected by pushed changes
- `yarn test:e2e` - Playwright
- `yarn playwright install chromium` - install the local Playwright browser
- `yarn lint` - ESLint
- `yarn format:check` - Prettier
- `yarn lighthouse` - Lighthouse CI
- `docker compose up --build dashboard` - development container with MSW
- `docker compose --profile production up --build production` - production frontend on port 8080

The Husky pre-push hook runs affected unit tests for the commits being pushed.

Husky's pre-push hook runs affected unit tests before each push.

## Conventions

- TypeScript strict, no `any` without comment
- Features in `src/features/<name>/` with `api.ts`, `hooks.ts`, `components/`, and colocated `__tests__/`
- Server state ONLY via TanStack Query. UI filters via Zustand.
- The active customer ID is held in Zustand (default `12345`) and is not URL-backed.
- Query keys live in `src/lib/api.ts`; each feature owns its API client and query hooks.
- Every customer-scoped query key and endpoint must use the active customer ID.
- URL-backed UI filters include period, custom dates, category, sort, page, page size, and trend months.
- Currency: `Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'})`
- Colors/icons come from API (`color`, `icon`), map icon string -> lucide-react.
- No PII in logs. Validate all filter inputs with zod.
- Accessibility: charts need aria-label + table fallback; use semantic, keyboard-accessible controls and table markup.
- Never hallucinate endpoints - only those in docs/API_CONTRACT.md
- Log all AI help in AI_USAGE.md
