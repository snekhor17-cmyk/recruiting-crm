# recruiting-crm

Monorepo bootstrap for Recruiting CRM with:

- `frontend`: React + Vite app
- `backend`: Node.js (Express) API
- `infra`: placeholder for infrastructure files

## Requirements

- Node.js LTS (recommended: Node 20)
- npm 10+

## Environment variables

Copy the example file and adjust values if needed:

```bash
cp .env.example .env
```

The backend reads `PORT`, and the frontend reads `VITE_API_URL`.

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
- Backend: http://localhost:3001

You can also run each service independently:

```bash
npm run dev -w frontend
npm run dev -w backend
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
