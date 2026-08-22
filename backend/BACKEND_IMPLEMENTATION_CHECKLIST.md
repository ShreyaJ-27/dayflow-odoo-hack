# Dayflow Backend Implementation Checklist

All required backend capabilities are implemented and verified against PostgreSQL.

[x] Strict TypeScript Express service, Helmet, CORS, rate limiting, validation, safe errors, graceful shutdown
    -> src/app.ts, src/server.ts, src/config/env.ts; GET /health, GET /api/info
    -> tests/health.test.ts, tests/auth.integration.test.ts
[x] PostgreSQL Prisma relational schema, migration, indexes, foreign keys, unique constraints, seed bootstrap
    -> prisma/schema.prisma, prisma/migrations/20260822050012_init/migration.sql, prisma/seed.ts
    -> npm run prisma:generate; npx prisma migrate status
[x] Secure signup/signin, ADMIN restriction, HR invite code, bcrypt, safe user responses
    -> src/modules/auth.routes.ts, src/utils/security.ts; POST /api/auth/signup, /signin
    -> tests/auth.integration.test.ts
[x] Email verification/resend and password reset with hashed, expiring, one-time tokens
    -> src/modules/auth.routes.ts, src/lib/mailer.ts; GET /api/auth/verify-email and auth token endpoints
    -> tests/auth.integration.test.ts
[x] JWT access tokens, hashed refresh-token rotation, revocation, logout, auth/RBAC/ownership middleware
    -> src/utils/security.ts, src/middleware/auth.ts; /api/auth/refresh, /logout, /me
    -> tests/auth.integration.test.ts, tests/business.integration.test.ts
[x] Employee profile/job details, restricted self-edit, HR/Admin listing/search/filter/detail management
    -> src/modules/business.routes.ts, prisma/schema.prisma; /api/employees variants
    -> tests/business.integration.test.ts
[x] Attendance records, timezone-day uniqueness, check-in/out invariants, daily/weekly/date-range/admin access
    -> src/modules/business.routes.ts, prisma/schema.prisma; /api/attendance variants
    -> tests/business.integration.test.ts
[x] Leave PAID/SICK/UNPAID, date/overlap validation, ownership/cancel, review comments, pending-only review
    -> src/modules/business.routes.ts, prisma/schema.prisma; /api/leaves variants
    -> tests/business.integration.test.ts
[x] Atomic approved-leave attendance reflection and in-app decision notification
    -> src/modules/business.routes.ts; leave review and notification APIs
    -> tests/business.integration.test.ts
[x] Effective-dated salary structures/history, protected employee read-only access, HR/Admin updates
    -> src/modules/business.routes.ts, prisma/schema.prisma; /api/payroll variants
    -> tests/business.integration.test.ts
[x] Nodemailer SMTP service and readable templates for verification, reset, leave, and payroll events
    -> src/lib/mailer.ts, auth.routes.ts, business.routes.ts; GET /api/smtp/status in non-production
    -> test mode suppresses delivery; live SMTP status verified
[x] Cloudinary documents plus dedicated profile-picture upload/replacement and validation
    -> src/lib/cloudinary.ts, src/modules/documents.routes.ts, src/modules/profile-picture.routes.ts
    -> /api/documents variants and /api/employees/*/profile-picture
[x] Recipient-scoped notifications, dashboards, and protected analytics/report APIs
    -> src/modules/business.routes.ts; /api/notifications, /api/dashboard, /api/reports
    -> tests/business.integration.test.ts
[x] Filtered attendance/leave/payroll/employee reports, PostgreSQL aggregation, payroll pagination
    -> src/modules/business.routes.ts; /api/reports/*
    -> tests/business.integration.test.ts
[x] Complete OpenAPI route, security, parameter, request, response, and schema documentation
    -> src/docs/openapi.ts, src/app.ts; GET /api/docs
    -> live OpenAPI 3.0.3 verification
[x] README, environment template, scripts, deployment/security guidance
    -> README.md, .env.example, package.json, .gitignore
[x] End-to-end verification
    -> migration up to date; database connected; SMTP verified
    -> npm test: 10 passed; npm run build: passed
