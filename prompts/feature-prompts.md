# Prompt: scaffold MSW handlers
Read docs/API_CONTRACT.md + src/types/api.ts. Generate src/mocks/handlers.ts with 7 GET handlers returning realistic ZAR data. Include pagination (total 1250), sorting (date_desc/amount_desc), category filter. No invented endpoints.

# Prompt: categories feature
Using src/types/api.ts + docs/DESIGN_SYSTEM.md, scaffold src/features/categories/ (api.ts, hooks.ts with useQuery queryKeys.categories, components/CategoryDonut.tsx with Recharts + aria-label + table fallback). Validate startDate/endDate with zod.

# Prompt: transactions table
Scaffold server-paginated table: limit/offset math, sortBy, category filter, skeletons, empty state. Use useFilters store. Test pagination edge (offset > total).

# Prompt: tests
Generate Vitest for src/lib/api.ts ZAR formatting + pagination hasMore logic, incl edge cases (0, negative, large). I will review banking math manually.
