# AGENTS.md - spending-insights-dashboard

## Project

Customer Spending Insights Dashboard.
Mock-first, MSW-backed, TanStack Query + Zustand.

## Commands

- `pnpm install` - install
- `pnpm dev` - dev server
- `pnpm build` - prod build
- `pnpm test` - Vitest
- `pnpm test:e2e` - Playwright/Cypress
- `pnpm lint` - ESLint
- `pnpm lighthouse` - Lighthouse CI

## Conventions

- TypeScript strict, no `any` without comment
- Features in `src/features/<name>/` with `api.ts`, `hooks.ts`, `components/`, and colocated `__tests__/`
- Server state ONLY via TanStack Query. UI filters via Zustand.
- Query keys: `['summary', period]`, `['categories', {period,startDate,endDate}]`, `['trends', months]`, `['transactions', {page,category,sortBy,dates}]`, `['goals']`, `['filters']`
- Currency: `Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'})`
- Colors/icons come from API (`color`, `icon`), map icon string -> lucide-react.
- No PII in logs. Validate all filter inputs with zod.
- Accessibility: charts need aria-label + table fallback, tables keyboard navigable.
- Never hallucinate endpoints - only those in docs/API_CONTRACT.md
- Log all AI help in AI_USAGE.md
