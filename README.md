# Customer Spending Insights Dashboard

A mock-first banking dashboard built with React and TypeScript. It demonstrates customer profile, spending summaries, categories, trends, paginated transactions, and spending goals.

## Run

```bash
pnpm install
pnpm dev    # MSW mocks API automatically
pnpm test
pnpm build
```

## Decisions

- TanStack Query for server state and Zustand for UI filters
- Recharts for spending visualizations
- MSW mocked from `docs/API_CONTRACT.md`
- ZAR via Intl, zod validation, WCAG AA, Lighthouse >=90

## What AI did vs What I did

- AI: MSW handlers boilerplate, seed txns, test scaffolds, chart boilerplate (see AI_USAGE.md + prompts/)
- Reviewed banking math, accessibility, color/icon mapping, performance, error states, and architecture.

## Structure

`src/features/<profile|summary|categories|trends|transactions|goals>/` (each with feature API, hooks, components, and tests) + shared `src/lib/`, `src/types/`, and `src/mocks/`
