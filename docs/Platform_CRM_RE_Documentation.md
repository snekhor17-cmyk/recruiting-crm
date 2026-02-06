# Platform CRM — Recruitment Edition Documentation

## Stage 0 Scope
This stage provides only technical scaffolding for development:
- frontend + backend local startup;
- domain-oriented folder structure;
- shadcn/ui wiring on frontend;
- backend healthcheck endpoint;
- basic documentation.

## Out of Scope
No business logic, database, CRUD, authorization, timeline logic, or derived statuses are implemented in Stage 0.

## Project Layout
- `frontend/` — Next.js app with Tailwind CSS and shadcn/ui setup.
- `backend/` — Express service with `GET /health`.
- `docs/` — documentation and issue snapshots.
