import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { verifyAccess } from '../utils/security.js';

declare global { namespace Express { interface Request { user?: { id: string; role: 'ADMIN' | 'HR' | 'EMPLOYEE'; email: string } } } }

export async function requireAuth(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const header = request.header('authorization');
    if (!header?.startsWith('Bearer ')) { response.status(401).json({ success: false, message: 'Authentication required', error: { code: 'AUTH_REQUIRED' } }); return; }
    const claims = verifyAccess(header.slice(7));
    const user = await prisma.user.findUnique({ where: { id: claims.sub }, select: { id: true, role: true, email: true, isActive: true, emailVerified: true } });
    if (!user?.isActive || (!user.emailVerified && user.role !== 'ADMIN')) { response.status(401).json({ success: false, message: 'Account is not available', error: { code: 'AUTH_ACCOUNT_UNAVAILABLE' } }); return; }
    request.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch { response.status(401).json({ success: false, message: 'Invalid or expired access token', error: { code: 'AUTH_INVALID_TOKEN' } }); }
}

export const requireRole = (...roles: Array<'ADMIN' | 'HR' | 'EMPLOYEE'>) => (request: Request, response: Response, next: NextFunction): void => {
  if (!request.user || !roles.includes(request.user.role)) { response.status(403).json({ success: false, message: 'Insufficient permissions', error: { code: 'FORBIDDEN' } }); return; }
  next();
};
