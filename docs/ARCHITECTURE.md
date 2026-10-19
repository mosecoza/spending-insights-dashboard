# ARCHITECTURE

## Current folders

```
src/
  lib/api.ts (Axios, query keys, ZAR), dateRange.ts, filterUrl.ts, validation.ts (zod), categoryIcons.tsx
  types/api.ts
  mocks/handlers.ts, data.ts (deterministic 1,250-transaction fixture), seed.json, browser.ts
  store/useFilters.ts (Zustand: customerId, period, dates, category, sortBy, page, limit, months)
  features/{profile,summary,categories,trends,transactions,goals}/
    api.ts hooks.ts components/ __tests__/
  components/FilterUrlSync.tsx, ErrorBoundary.tsx, StateViews.tsx (shared loading, error, and empty states)
```

## State split

- Server: TanStack Query only. Stale 30s, cache 5m.
- UI: Zustand owns the active customer ID (default `12345`) and filters in the existing shared store; hooks subscribe to only the fields they consume. React Router synchronizes filter search params only; customer ID is intentionally not URL-backed or shareable, so copied dashboard URLs always use the default customer.
- Changing customer ID resets dashboard filters to their defaults. All customer-scoped query keys and API paths include the active ID; current per-resource key shapes are retained (for example, `['profile', customerId]`).
- Period selection applies to summary/category data; the transaction endpoint uses explicit custom dates because its contract has no period parameter.

## Routing

`/` dashboard, with filter state serialized in the query string.

## Mock API

MSW handlers validate query parameters with Zod and return filtered, sorted, paginated data and aggregates from fixed 1,250-row fixtures. Demo customers `12345`, `67890`, and `24680` have distinct profile and spending data; unsupported customer IDs receive HTTP 404. The fixture date anchor is `2024-09-16` so mock results and tests are reproducible.

## Contracts & validation

`docs/API_CONTRACT.md` (transcribed from the upstream endpoint spec) is the normative source of truth. `src/types/api.ts` is its hand-mapped TypeScript transcription; the zod schemas in `src/lib/validation.ts` are the executable barrier enforcing the same shapes at runtime — never the other way around (no `z.infer`).

- MSW handlers validate inbound query params; feature API clients validate outbound response payloads. Both parse against the contract.
- Query schemas may coerce and default (for example, `z.coerce.number()`, `.default(20)`); response schemas are strict pass-throughs. Manual DTOs keep these input/output roles distinct, which inferred types would blur.
- Drift policy: a contract change updates the DTOs, the schemas, and the per-endpoint resolve/reject tests as a single unit. The reject tests are the tripwire — if schema and contract ever disagree, a test fails.

## Perf

Recharts charts are lazy-loaded; the transactions API caps each rendered page at 100 rows, so client-side virtualization is not currently needed. Routes are not code-split because the app has a single dashboard route.

## Quality gates

Vitest unit tests, Playwright filter-to-pagination E2E, ESLint, Prettier with a Husky pre-commit hook, and Lighthouse CI performance/accessibility assertions (>=90) run locally and in GitHub Actions.

Feature cards use shared accessible skeleton, retryable query-error, and empty-state views. Lazy chart chunks announce their loading state; the transaction table offers a clear-filters action when the current filters return no rows.

The single-page UI keeps its shared Tailwind primitives local rather than adding a generated component library.

## Containers

`Dockerfile` builds the frontend with Node 22 and serves the production assets from Nginx. `compose.yaml` provides a bind-mounted development service with MSW and an opt-in production service. The production image serves static assets only; it does not provide or proxy the `/api` endpoints.
