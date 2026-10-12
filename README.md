# Customer Spending Insights Dashboard

A mock-first banking dashboard built with React and TypeScript. It demonstrates customer profile, spending summaries, categories, trends, paginated transactions, and spending goals.

## Run

```bash
yarn install
yarn dev          # MSW mocks API automatically
yarn test
yarn test:affected
yarn test:e2e
yarn lint
yarn format:check
yarn lighthouse
yarn build
```

Before pushing, Husky runs unit tests for changed test files and tests related to changed source files.

## Pull request reviews

The `Copilot tech lead review` workflow requests a GitHub Copilot code review when a pull request is opened, reopened, marked ready for review, or updated with new commits. It skips drafts and avoids requesting a duplicate review for the same head commit.

Review guidance in `.github/copilot-instructions.md` focuses Copilot on inline, actionable feedback, security issues, logic and edge cases, and project conventions. Copilot code review must be available for the repository, and repository custom instructions must be enabled in Copilot settings for this guidance to apply.

Copilot reviews use AI credits under the repository owner's Copilot plan and organization policies. Choose the **Balanced** review effort in Copilot settings for deeper security and logic analysis.

## Decisions

- TanStack Query for server state and Zustand for UI filters
- Recharts for spending visualizations
- MSW mocked from `docs/API_CONTRACT.md`
- ZAR via Intl, zod validation, accessible charts/tables, Lighthouse CI performance/accessibility >=90

## What AI did vs What I did

- AI: MSW handlers boilerplate, seed txns, test scaffolds, chart boilerplate (see AI_USAGE.md + prompts/)
- Reviewed banking math, accessibility, color/icon mapping, performance, error states, and architecture.

## Structure

`src/features/<profile|summary|categories|trends|transactions|goals>/` with feature API, hooks, components, and tests; shared utilities live in `src/lib/`.

The project uses Tailwind and a small set of shared card/layout classes; a generated component framework is intentionally not added for this single-page showcase.
