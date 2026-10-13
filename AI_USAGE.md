# AI_USAGE.md - AI usage audit trail

| Date       | Task                      | Prompt (summary)                                                                                                         | Model | Accepted / Edited                 | Time saved |
| ---------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----- | --------------------------------- | ---------- |
| 2026-10-11 | Scaffold docs + types     | Generate dashboard scaffold from API_CONTRACT.md                                                                         | Cline | Accepted + hand-tuned             | ~3h        |
| 2026-10-11 | MSW fixture               | Generate deterministic 1,250 ZAR transactions with real filtering, sorting, and pagination                               | Auto  | Implemented + tested              | ~2h        |
| 2026-10-11 | Charts and accessibility  | Add trends table fallback and formatted chart values                                                                     | Auto  | Reviewed + edited                 | ~30m       |
| 2026-10-11 | Tests and tooling         | Cover URL filters and mock aggregates; configure Node tests and TypeScript linting                                       | Auto  | Implemented + tested              | ~1h        |
| 2026-10-11 | Startup and filters       | Add validated shareable URL/custom-date filters and fix Tailwind/MSW startup                                             | Auto  | Reviewed + smoke-tested           | ~1h        |
| 2026-10-11 | Feature and quality gates | Split dashboard into feature modules, wire URL-backed trend/page size, derive goals, and add E2E/Lighthouse/format hooks | Auto  | Reviewed + tested                 | ~3h        |
| 2026-10-11 | Push test hook            | Run unit tests affected by commits before each push                                                                      | Auto  | Implemented + tested              | ~30m       |
| 2026-10-12 | URL state and CI gates    | Clear omitted optional filters when restoring URL state and run Prettier checks in CI                                    | Auto  | Implemented + validated           | ~15m       |
| 2026-10-13 | Docker containerization   | Add production Docker image, Compose development workflow, and container usage documentation                             | Auto  | Implemented + Docker-smoke-tested | ~30m       |
