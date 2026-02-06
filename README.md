# Platform CRM (Stage 0)

Project skeleton for a recruiting CRM platform.

## Requirements
- Node.js 18+
- npm 9+

## Setup
```bash
cp .env.example .env
```

Install dependencies:
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Run frontend
```bash
cd frontend
npm run dev
```
Frontend URL: `http://localhost:3000`

## Run backend
```bash
cd backend
npm run dev
```
Backend URL: `http://localhost:4000`
Healthcheck: `http://localhost:4000/health`

## Available pages
- `/candidates`
- `/contacts`
- `/vacancies`
- `/users`
