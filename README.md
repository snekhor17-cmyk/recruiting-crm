# Платформа — recruiting-crm

## Локальный запуск

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Healthcheck: http://localhost:3001/health

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Страницы:
- http://localhost:3000
- http://localhost:3000/candidates
- http://localhost:3000/contacts
- http://localhost:3000/vacancies
- http://localhost:3000/users
