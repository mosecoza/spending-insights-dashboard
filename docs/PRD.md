# PRD - Spending Insights Dashboard

## Goal

Provide an accessible customer spending dashboard with reliable profile, summary, category, trend, transaction, and goal views.

## Scope (from CustomerSpendingInsightsEndpoints.md)

1. Profile header: GET /api/customers/{id}/profile
2. Summary cards: GET .../spending/summary?period=7d|30d|90d|1y + comparedToPrevious
3. Categories donut + custom dates: GET .../categories?period&startDate&endDate
4. Trends line: GET .../trends?months (default 12, max 24)
5. Transactions table: GET .../transactions?limit&offset&category&dates&sortBy (total 1250)
6. Goals: GET .../goals (on_track|warning)
7. Filters metadata: GET .../filters

## Acceptance

- All filters update URL + query keys, loading/skeleton/error/empty states
- Pagination correct (offset math), sort persists
- a11y: keyboard filters, aria charts, table semantics
- Lighthouse perf/a11y >=90, Vitest utils + 1 e2e filter->paginate
