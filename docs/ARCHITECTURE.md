# ARCHITECTURE

## Current folders

```
src/
  lib/api.ts (Axios, query keys, ZAR), dateRange.ts, filterUrl.ts, validation.ts (zod)
  types/api.ts
  mocks/handlers.ts, data.ts (deterministic 1,250-transaction fixture), seed.json, browser.ts
  store/useFilters.ts (Zustand: period, dates, category, sortBy, page, months)
  features/{profile,summary,categories,trends,transactions,goals}/
    api.ts, hooks.ts, components/, __tests__/
  components/FilterUrlSync.tsx, ErrorBoundary.tsx
```

## State split

- Server: TanStack Query only. Stale 30s, cache 5m.
- UI: Zustand + validated URL search params (period, custom dates, category, sort, page).
- Period selection applies to summary/category data; the transaction endpoint uses explicit custom dates because its contract has no period parameter.

## Routing

`/` dashboard, with filter state serialized in the query string.

## Mock API

MSW handlers validate query parameters with Zod and return filtered, sorted, paginated data and aggregates from a fixed 1,250-row fixture. The fixture date anchor is `2024-09-16` so mock results and tests are reproducible.

## Perf

Lazy Recharts, useMemo aggregates, virtualize transactions if >100 rendered, code-split routes.
