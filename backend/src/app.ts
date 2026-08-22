import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from './lib/prisma.js';
import { env } from './config/env.js';
import authRoutes from './modules/auth.routes.js';
import businessRoutes from './modules/business.routes.js';
import documentRoutes from './modules/documents.routes.js';
import profilePictureRoutes from './modules/profile-picture.routes.js';
import { verifySmtp } from './lib/mailer.js';
import { openapi } from './docs/openapi.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', authRoutes);
app.get('/api/info', (_request, response) => {
  response.json({ success: true, data: { name: 'Dayflow HRMS API', version: '1.0.0' } });
});
app.get('/api/docs', (_request, response) => response.json({ ...openapi, servers: [{ url: env.API_BASE_URL ?? `http://localhost:${env.PORT}` }] }));
app.get('/api/smtp/status', async (_request, response) => {
  if (env.NODE_ENV === 'production') { response.status(404).json({ success: false, message: 'Not found', error: { code: 'NOT_FOUND' } }); return; }
  response.json({ success: true, data: await verifySmtp() });
});
app.use('/api', businessRoutes);
app.use('/api', documentRoutes);
app.use('/api', profilePictureRoutes);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) { response.status(422).json({ success: false, message: 'Request validation failed', error: { code: 'VALIDATION_ERROR', details: error.issues } }); return; }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { response.status(409).json({ success: false, message: 'A record with that value already exists', error: { code: 'DUPLICATE_RECORD' } }); return; }
  console.error(error);
  response.status(500).json({ success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } });
});

app.get('/health', async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ success: true, status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    response.status(503).json({ success: false, status: 'degraded', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});
