# recruiting-crm

Monorepo bootstrap for Recruiting CRM with:

- `frontend`: React + Vite app
- `backend`: Node.js (Express) API
- `infra`: placeholder for infrastructure files

## Requirements

- Node.js LTS (recommended: Node 20)
- npm 10+

## Environment variables

Copy the root example file for local development:

```bash
cp .env.example .env
```

Backend-specific variables can also be copied from `backend/.env.example`.

## Install dependencies

```bash
npm install
```

## Run locally

Start frontend and backend in parallel from the repository root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

You can also run each service independently:

```bash
npm run dev -w frontend
npm run dev -w backend
```

## Health check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "ok": true,
  "time": "2026-01-01T00:00:00.000Z"
}
```

## Lint

```bash
npm run lint
```

## Repository structure

```text
.
├── backend/
├── frontend/
├── infra/
└── README.md
```

## Security

- Do not commit real secrets.
- Keep sensitive values in local `.env` files only.
