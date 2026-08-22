# Dayflow HRMS Backend

A TypeScript, Express, Prisma, and PostgreSQL REST API for Dayflow HRMS.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- SMTP and Cloudinary credentials for optional integrations

## Setup

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The API listens on `PORT` and binds to `0.0.0.0`. `DATABASE_URL` and all security settings are loaded from `.env`; secrets are never committed. Public HR registration requires `HR_SIGNUP_INVITE_CODE`. Admin bootstrap uses `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, and `SEED_ADMIN_EMPLOYEE_ID`.

## Commands

- `npm run dev`: development server with reload
- `npm run build`: strict production compilation
- `npm start`: run `dist/server.js`
- `npm test`: Vitest and Supertest checks
- `npm run prisma:migrate`: create/apply a development migration
- `npm run prisma:deploy`: apply committed migrations in deployment

## API

Public endpoints include `GET /health`, `GET /api/info`, `GET /api/docs`, and the authentication endpoints under `/api/auth`. Authenticated modules cover employees, attendance, leave, payroll, documents, notifications, dashboards, and reports. Send `Authorization: Bearer <accessToken>` for protected endpoints. HR and admin operations are enforced server-side.

`GET /health` performs `SELECT 1` through Prisma and returns HTTP 503 when PostgreSQL is unavailable.

## Deployment

For Render, use a Node web service with build command `npm ci && npm run prisma:generate && npm run prisma:deploy && npm run build`, start command `npm start`, and the production environment variables from `.env.example`. Use Render PostgreSQL for `DATABASE_URL`, configure `FRONTEND_URL` to the deployed frontend origin, and use production SMTP/Cloudinary credentials.

## Security

Passwords use bcrypt. Access tokens are short-lived JWTs; refresh tokens are stored hashed and rotated/revoked. Helmet, credentialed CORS, rate limiting, Zod validation, upload size/type limits, ownership checks, and centralized safe error responses are enabled. Do not expose `.env` or token/credential values in logs.
