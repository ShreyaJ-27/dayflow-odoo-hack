import express, { type Request, type Response, type NextFunction } from 'express';
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
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Universal CORS headers for all origins (supports Vercel, localhost, and custom domains)
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept');
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(cors({
  origin: (_origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', authRoutes);

app.get('/api/info', (_request: Request, response: Response) => {
  response.json({ success: true, data: { name: 'Dayflow HRMS API', version: '1.0.0' } });
});

app.get('/api/docs', (_request: Request, response: Response) => response.json({ ...openapi, servers: [{ url: env.API_BASE_URL ?? `http://localhost:${env.PORT}` }] }));

app.get('/api/smtp/status', async (_request: Request, response: Response) => {
  if (env.NODE_ENV === 'production') { response.status(404).json({ success: false, message: 'Not found', error: { code: 'NOT_FOUND' } }); return; }
  response.json({ success: true, data: await verifySmtp() });
});

app.use('/api', businessRoutes);
app.use('/api', documentRoutes);
app.use('/api', profilePictureRoutes);

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) { response.status(422).json({ success: false, message: 'Request validation failed', error: { code: 'VALIDATION_ERROR', details: error.issues } }); return; }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') { response.status(409).json({ success: false, message: 'A record with that value already exists', error: { code: 'DUPLICATE_RECORD' } }); return; }
  console.error(error);
  response.status(500).json({ success: false, message: 'Internal server error', error: { code: 'INTERNAL_ERROR' } });
});

app.get('/health', async (_request: Request, response: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ success: true, status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    response.status(503).json({ success: false, status: 'degraded', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});
